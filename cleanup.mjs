import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiDir = path.join(__dirname, 'api');

const keepFiles = ['index.ts'];

try {
  const items = fs.readdirSync(apiDir);
  for (const item of items) {
    if (!keepFiles.includes(item)) {
      const fullPath = path.join(apiDir, item);
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Deleted: ${fullPath}`);
    }
  }
} catch (e) {
  console.error(e);
}
