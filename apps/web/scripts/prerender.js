import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  {
    path: '/jewellery-collections',
    title: "Jewellery Collections in Tirupur | Gold, Silver & Bridal Jewellery",
    description: "Explore premium gold jewellery, silver jewellery, bridal collections and traditional designs at Sri Velmayil Jewellery Tirupur.",
    canonical: "https://srivelmayiljewellery.store/jewellery-collections"
  },
  {
    path: '/gold-rate-today-tirupur',
    title: "Today's Gold Rate in Tirupur | Live Gold & Silver Rates",
    description: "Check today's live gold rate and silver rate in Tirupur. Updated daily with market information.",
    canonical: "https://srivelmayiljewellery.store/gold-rate-today-tirupur"
  },
  {
    path: '/about-us',
    title: "About Sri Velmayil Jewellery | 25 Years of Trusted Jewellery",
    description: "Learn about Sri Velmayil Jewellery's 25-year legacy of trust, BIS hallmarked jewellery and customer-first service in Tirupur.",
    canonical: "https://srivelmayiljewellery.store/about-us"
  },
  {
    path: '/contact-us',
    title: "Contact Sri Velmayil Jewellery | Jewellery Store in Tirupur",
    description: "Visit Sri Velmayil Jewellery in Tirupur or contact us for jewellery collections, gold rates and customer assistance.",
    canonical: "https://srivelmayiljewellery.store/contact-us"
  }
];

async function prerender() {
  const distPath = path.resolve(__dirname, '../dist');
  const indexFile = path.resolve(distPath, 'index.html');
  
  try {
    const template = await fs.readFile(indexFile, 'utf-8');

    for (const route of routes) {
      const dirPath = path.resolve(distPath, route.path.replace(/^\//, ''));
      await fs.mkdir(dirPath, { recursive: true });
      
      let html = template;
      
      // Replace Title
      html = html.replace(/<title>.*?<\/title>/gi, `<title>${route.title}</title>`);
      html = html.replace(/<meta[^>]*name="title"[^>]*>/gi, `<meta name="title" content="${route.title}" />`);
      
      // Replace Description
      html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, `<meta name="description" content="${route.description}" />`);
      
      // Replace Canonical
      html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, `<link rel="canonical" href="${route.canonical}" />`);
      
      // Replace Open Graph
      html = html.replace(/<meta[^>]*property="og:title"[^>]*>/gi, `<meta property="og:title" content="${route.title}" />`);
      html = html.replace(/<meta[^>]*property="og:description"[^>]*>/gi, `<meta property="og:description" content="${route.description}" />`);
      html = html.replace(/<meta[^>]*property="og:url"[^>]*>/gi, `<meta property="og:url" content="${route.canonical}" />`);
      
      // Replace Twitter
      html = html.replace(/<meta[^>]*name="twitter:title"[^>]*>/gi, `<meta name="twitter:title" content="${route.title}" />`);
      html = html.replace(/<meta[^>]*name="twitter:description"[^>]*>/gi, `<meta name="twitter:description" content="${route.description}" />`);
      
      const outFile = path.resolve(dirPath, 'index.html');
      await fs.writeFile(outFile, html);
      console.log(`[SEO Prerender] Generated static HTML for ${route.path}`);
    }
  } catch (err) {
    console.error("[SEO Prerender] Error during prerendering:", err);
    process.exit(1);
  }
}

prerender();
