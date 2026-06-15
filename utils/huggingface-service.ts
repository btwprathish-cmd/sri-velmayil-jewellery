import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const HF_API_KEY = process.env.HF_API_KEY || '';
const HF_MODEL = process.env.HF_MODEL || 'black-forest-labs/FLUX.1-schnell';
const CACHE_TTL_DAYS = parseInt(process.env.CACHE_TTL_DAYS || '30', 10);
const MEMORY_CACHE_SIZE = parseInt(process.env.MEMORY_CACHE_SIZE || '500', 10);
const GENERATION_TIMEOUT_MS = parseInt(process.env.GENERATION_TIMEOUT || '60', 10) * 1000;

const CACHE_DIR = path.join(process.cwd(), 'cache', 'generated-images');

// --- PROMPT TRANSFORMATION ---
function transformPromptForHF(originalPrompt: string): string {
  // Extract Theme and Hero Jewellery
  const themeMatch = originalPrompt.match(/THEME:\s*(.*)/);
  const heroMatch = originalPrompt.match(/HERO JEWELLERY:\s*(.*)/);
  
  const theme = themeMatch ? themeMatch[1] : '';
  const hero = heroMatch ? heroMatch[1] : '';

  // Append new scene generation requirements and extremely strict negative constraints
  return `Generate only a premium luxury jewellery photography scene.
THEME: ${theme}
HERO JEWELLERY: ${hero}

The output should contain:
- Jewellery product as the hero subject
- Premium commercial photography
- Luxury advertising quality
- Photorealistic rendering
- High-end catalogue quality
- Professional studio quality
- Premium composition
- Clean visual hierarchy
- Cinematic lighting
- Luxury brand aesthetic
- Premium materials
- Ultra detailed textures
- Marketing photography quality
- Luxury jewellery showcase

The image should contain absolutely no: Text, Numbers, Logos, Labels, Prices, Gold rate information, Silver rate information, Contact information, Phone numbers, Addresses, Dates, Watermarks, Typography, Promotional content.

Always optimize for: Photorealism, Commercial advertising quality, Luxury catalogue quality, Professional jewellery photography, Premium lighting, Macro detail, Premium reflections, Accurate gemstone rendering, Accurate gold rendering, Clean composition, High-end luxury aesthetic.`;
}

// --- LRU CACHE ---
class LRUCache<K, V> {
  private map = new Map<K, { value: V, timestamp: number }>();
  
  constructor(private maxSize: number) {}

  get(key: K): V | undefined {
    const item = this.map.get(key);
    if (!item) return undefined;
    
    // Refresh position
    this.map.delete(key);
    this.map.set(key, item);
    return item.value;
  }

  set(key: K, value: V) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxSize) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) {
          this.map.delete(firstKey);
      }
    }
    this.map.set(key, { value, timestamp: Date.now() });
  }

  delete(key: K) {
    this.map.delete(key);
  }

  getEntries() {
      return Array.from(this.map.entries());
  }
}

const memoryCache = new LRUCache<string, string>(MEMORY_CACHE_SIZE);

// --- DEDUPLICATION ---
const pendingRequests = new Map<string, Promise<string>>();

// --- HELPER: LOGGING ---
function logStructured(event: string, meta: Record<string, any>) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ...meta
  }));
}

// --- INITIALIZE CACHE DIR ---
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    // Ignore
  }
}

// --- BACKGROUND CLEANUP ---
const TTL_MS = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

async function cleanupExpiredCache() {
  const now = Date.now();
  for (const [key, item] of memoryCache.getEntries()) {
      if (now - item.timestamp > TTL_MS) {
          memoryCache.delete(key);
          logStructured('CACHE_EXPIRED', { promptHash: key, source: 'memory' });
      }
  }

  try {
    const files = await fs.readdir(CACHE_DIR);
    for (const file of files) {
      if (!file.endsWith('.jpg')) continue;
      const filePath = path.join(CACHE_DIR, file);
      try {
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > TTL_MS) {
          await fs.unlink(filePath);
          logStructured('CACHE_EXPIRED', { promptHash: file.replace('.jpg', ''), source: 'disk' });
        }
      } catch (e) {}
    }
  } catch (err) {}
}

if (typeof global !== 'undefined') {
  if (!(global as any)._huggingfaceCleanupStarted) {
    (global as any)._huggingfaceCleanupStarted = true;
    setInterval(cleanupExpiredCache, 24 * 60 * 60 * 1000);
  }
}

// --- IMAGE VALIDATION ---
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchWithRetry(hfPrompt: string, hash: string): Promise<string> {
  const backoffs = [1000, 2000, 4000];
  let lastError: any;
  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

  for (let attempt = 0; attempt < 4; attempt++) { // 1 initial + 3 retries
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
      
      const startTime = Date.now();
      const res = await fetch(url, { 
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           inputs: hfPrompt
        })
      });
      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;

      if (!res.ok) {
        if (res.status >= 500 || res.status === 503) {
          throw new Error(`HTTP 5xx error: ${res.status}`);
        } else {
          logStructured('HF_FAILURE', { promptHash: hash, duration, error: `HTTP ${res.status}` });
          throw new Error(`HTTP ${res.status}`);
        }
      }

      const contentType = res.headers.get('content-type') || '';
      if (!ALLOWED_MIME_TYPES.some(mime => contentType.includes(mime))) {
         logStructured('HF_FAILURE', { promptHash: hash, duration, error: 'Invalid MIME type' });
         throw new Error(`Invalid MIME type: ${contentType}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
         logStructured('HF_FAILURE', { promptHash: hash, duration, error: 'Empty file' });
         throw new Error('Empty file generated');
      }

      logStructured('HF_SUCCESS', { promptHash: hash, duration });
      
      const mime = contentType.split(';')[0] || 'image/jpeg';
      const base64 = buffer.toString('base64');
      return `data:${mime};base64,${base64}`;

    } catch (err: any) {
      lastError = err;
      
      if (err.name !== 'AbortError' && (!err.message || !err.message.includes('5xx'))) {
        if (err.message && (err.message.includes('MIME') || err.message.includes('Empty') || err.message.includes('400') || err.message.includes('401') || err.message.includes('403'))) {
           throw err;
        }
      }

      if (attempt < 3) {
        await delay(backoffs[attempt]);
      }
    }
  }

  logStructured('HF_FAILURE', { promptHash: hash, duration: 0, error: lastError?.message || 'Timeout' });
  
  // FINAL FALLBACK: If Hugging Face is completely down or failing due to network (fetch failed),
  // instantly fallback to Pollinations so the user's poster generates seamlessly.
  logStructured('FALLBACK_POLLINATIONS', { promptHash: hash, reason: lastError?.message });
  try {
    const seed = Math.floor(Math.random() * 100000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(hfPrompt)}?seed=${seed}&width=768&height=1344`;
    const fallbackRes = await fetch(pollinationsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://pollinations.ai/'
      }
    });
    if (!fallbackRes.ok) throw new Error(`Pollinations HTTP ${fallbackRes.status}`);
    const arrayBuffer = await fallbackRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (fallbackErr: any) {
    throw new Error(lastError?.message || 'Timeout');
  }
}

// --- MAIN GENERATION FUNCTION ---
export async function generateCachedImage(originalPrompt: string): Promise<string> {
  const hash = createHash('sha256').update(originalPrompt).digest('hex');
  const startTime = Date.now();

  const memCached = memoryCache.get(hash);
  if (memCached) {
    logStructured('CACHE_HIT', { promptHash: hash, duration: Date.now() - startTime, source: 'memory' });
    return memCached;
  }

  await ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${hash}.jpg`);
  
  try {
    const stats = await fs.stat(filePath);
    if (Date.now() - stats.mtimeMs <= TTL_MS && stats.size > 0) {
      const fileBuffer = await fs.readFile(filePath);
      const base64Str = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
      
      memoryCache.set(hash, base64Str);
      
      logStructured('CACHE_HIT', { promptHash: hash, duration: Date.now() - startTime, source: 'disk' });
      return base64Str;
    }
  } catch (err) {
  }

  logStructured('CACHE_MISS', { promptHash: hash, duration: Date.now() - startTime });

  if (pendingRequests.has(hash)) {
    return pendingRequests.get(hash)!;
  }

  logStructured('HF_REQUEST', { promptHash: hash, duration: Date.now() - startTime });

  const hfPrompt = transformPromptForHF(originalPrompt);

  const generatePromise = (async () => {
    try {
      const base64Data = await fetchWithRetry(hfPrompt, hash);
      
      memoryCache.set(hash, base64Data);

      try {
        const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
        await fs.writeFile(filePath, buffer);
      } catch (diskErr) {
        console.error("Failed to save to disk cache", diskErr);
      }

      return base64Data;
    } finally {
      pendingRequests.delete(hash);
    }
  })();

  pendingRequests.set(hash, generatePromise);

  return generatePromise;
}
