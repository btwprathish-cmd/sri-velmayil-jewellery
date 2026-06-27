import fs from 'fs';
import path from 'path';

const filesToDelete = [
  'lib/supabase',
  'check-supabase.ts',
  'seed-category-metals.ts',
  'scripts/migrate.mjs',
  'apps/web/src/pages/MigratePage.tsx',
  'apps/web/src/lib/supabase.ts',
  'apps/api/src/lib/supabase.ts'
];

for (const file of filesToDelete) {
  const fullPath = path.join(process.cwd(), file);
  try {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Deleted: ${fullPath}`);
  } catch (err) {
    console.error(`Failed to delete ${fullPath}:`, err.message);
  }
}
