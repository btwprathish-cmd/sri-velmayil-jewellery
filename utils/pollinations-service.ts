import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const POLLINATIONS_BASE_URL = process.env.POLLINATIONS_BASE_URL || 'https://image.pollinations.ai';
const CACHE_TTL_DAYS = parseInt(process.env.CACHE_TTL_DAYS || '30', 10);
const MEMORY_CACHE_SIZE = parseInt(process.env.MEMORY_CACHE_SIZE || '500', 10);
const GENERATION_TIMEOUT_MS = parseInt(process.env.GENERATION_TIMEOUT || '60', 10) * 1000;

const CACHE_DIR = path.join(process.cwd(), 'cache', 'generated-images');

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
      // Evict oldest (first item in Map)
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
  // 1. Cleanup memory cache
  for (const [key, item] of memoryCache.getEntries()) {
      if (now - item.timestamp > TTL_MS) {
          memoryCache.delete(key);
          logStructured('CACHE_EXPIRED', { promptHash: key, source: 'memory' });
      }
  }

  // 2. Cleanup disk cache
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
  if (!(global as any)._pollinationsCleanupStarted) {
    (global as any)._pollinationsCleanupStarted = true;
    setInterval(cleanupExpiredCache, 24 * 60 * 60 * 1000);
  }
}

// --- IMAGE VALIDATION ---
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchWithRetry(baseUrl: string, prompt: string, hash: string): Promise<string> {
  const backoffs = [1000, 2000, 4000];
  let lastError: any;

  for (let attempt = 0; attempt < 4; attempt++) { // 1 initial + 3 retries
    try {
      // Attempt 0: 9:16 aspect ratio. Attempt 1+: Default parameters to bypass 402 payment requirements.
      const seed = Math.floor(Math.random() * 100000);
      const queryParams = attempt === 0 ? `?width=768&height=1344&seed=${seed}` : `?seed=${seed}`;
      const url = `${baseUrl}/prompt/${encodeURIComponent(prompt)}${queryParams}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
      
      const startTime = Date.now();
      const res = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://pollinations.ai/'
        }
      });
      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;

      if (!res.ok) {
        if (res.status >= 500) {
          throw new Error(`HTTP 5xx error: ${res.status}`);
        } else {
          logStructured('POLLINATIONS_FAILURE', { promptHash: hash, duration, error: `HTTP ${res.status}` });
          throw new Error(`HTTP ${res.status}`);
        }
      }

      const contentType = res.headers.get('content-type') || '';
      if (!ALLOWED_MIME_TYPES.some(mime => contentType.includes(mime))) {
         logStructured('POLLINATIONS_FAILURE', { promptHash: hash, duration, error: 'Invalid MIME type' });
         throw new Error(`Invalid MIME type: ${contentType}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
         logStructured('POLLINATIONS_FAILURE', { promptHash: hash, duration, error: 'Empty file' });
         throw new Error('Empty file generated');
      }

      logStructured('POLLINATIONS_SUCCESS', { promptHash: hash, duration });
      
      const mime = contentType.split(';')[0] || 'image/jpeg';
      const base64 = buffer.toString('base64');
      return `data:${mime};base64,${base64}`;

    } catch (err: any) {
      lastError = err;
      
      if (err.name !== 'AbortError' && (!err.message || !err.message.includes('5xx'))) {
        if (err.message && (err.message.includes('MIME') || err.message.includes('Empty'))) {
           throw err;
        }
      }

      if (attempt < 3) {
        await delay(backoffs[attempt]);
      }
    }
  }

  logStructured('POLLINATIONS_FAILURE', { promptHash: hash, duration: 0, error: lastError?.message || 'Timeout' });
  throw lastError;
}

// --- MAIN GENERATION FUNCTION ---
export async function generateCachedImage(prompt: string): Promise<string> {
  const hash = createHash('sha256').update(prompt).digest('hex');
  const startTime = Date.now();

  // 1. Check memory cache
  const memCached = memoryCache.get(hash);
  if (memCached) {
    logStructured('CACHE_HIT', { promptHash: hash, duration: Date.now() - startTime, source: 'memory' });
    return memCached;
  }

  // 2. Check disk cache
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
    // Disk cache miss
  }

  logStructured('CACHE_MISS', { promptHash: hash, duration: Date.now() - startTime });

  // 3. Deduplication
  if (pendingRequests.has(hash)) {
    return pendingRequests.get(hash)!;
  }

  logStructured('POLLINATIONS_REQUEST', { promptHash: hash, duration: Date.now() - startTime });

  // 4. Generate via Pollinations
  const generatePromise = (async () => {
    try {
      const base64Data = await fetchWithRetry(POLLINATIONS_BASE_URL, prompt, hash);
      
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
