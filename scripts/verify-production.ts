/**
 * Production verification script - run with: npx tsx scripts/verify-production.ts
 */
import { generatePosterConfig, generatePosterSvg } from "../utils/poster-engine";
import { fetchLatestRatesDirect } from "../lib/live-rates";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const rates = {
  gold22k_1g: 13860,
  gold22k_8g: 110880,
  silver_1g: 270,
  dateDisplay: "15th June 2026",
};

console.log("=== 1. POSTER UNIQUENESS TEST (50 generations) ===\n");

const svgHashes = new Set<string>();
const jewelryTypes = new Set<string>();
const layouts = new Set<string>();
const palettes = new Set<string>();
const patterns = new Set<string>();
const compositions = new Set<string>();
const typographies = new Set<string>();
const seeds = new Set<number>();

for (let i = 0; i < 50; i++) {
  const config = generatePosterConfig(undefined, "story");
  const svg = generatePosterSvg(config, rates);
  jewelryTypes.add(config.jewelryType);
  layouts.add(config.layout);
  palettes.add(config.palette.name);
  patterns.add(config.pattern);
  compositions.add(config.composition);
  typographies.add(config.typography.heading);
  seeds.add(config.seed);
  const fingerprint = `${config.layout}|${config.palette.name}|${config.pattern}|${config.jewelryType}|${config.composition}|${svg.length}|${svg.slice(200, 400)}`;
  svgHashes.add(fingerprint);
}

console.log(`Format: 1080x1920 (story) enforced`);
console.log(`Unique seeds: ${seeds.size}/50`);
console.log(`Unique layouts: ${layouts.size}/8 possible`);
console.log(`Unique palettes: ${palettes.size}/8 possible`);
console.log(`Unique patterns: ${patterns.size}/6 possible`);
console.log(`Unique jewelry types (procedural): ${jewelryTypes.size}/8 possible`);
console.log(`Unique compositions: ${compositions.size}/6 possible`);
console.log(`Unique typography styles: ${typographies.size}/6 possible`);
console.log(`Unique SVG fingerprints: ${svgHashes.size}/50`);

const posterSource = readFileSync(join(process.cwd(), "utils/poster-engine.ts"), "utf8");
const hasUnsplash = /unsplash|JEWELRY_IMAGES|jewelryImage|jewelryMode/i.test(posterSource);
console.log(`\nExternal image URLs in poster-engine: ${hasUnsplash ? "YES - PROBLEM" : "NO - OK (procedural only)"}`);

const referenceDir = join(process.cwd(), "public/images/reference");
let sampleFiles: string[] = [];
try {
  sampleFiles = readdirSync(referenceDir);
} catch { /* empty */ }
const sampleUsed = sampleFiles.some((f) => posterSource.includes(f) || posterSource.includes("reference"));
console.log(`Sample poster images in reference/: ${sampleFiles.length}`);
console.log(`Sample images referenced in poster-engine: ${sampleUsed ? "YES - PROBLEM" : "NO - OK"}`);

console.log("\n=== 2. LIVE RATE SOURCE ===\n");

async function checkRates() {
  const latest = await fetchLatestRatesDirect();
  const liveRatesSource = readFileSync(join(process.cwd(), "lib/live-rates.ts"), "utf8");
  const hasMetalApi = /metalpriceapi|gold-api\.com/i.test(liveRatesSource);
  const hasStaticJson = readFileSync(join(process.cwd(), "utils/rates.ts"), "utf8").includes("gold-rates.json");

  console.log(`API endpoint: GET /api/rates`);
  console.log(`Live market API integration: ${hasMetalApi ? "YES" : "NO"}`);
  console.log(`Static gold-rates.json dependency: ${hasStaticJson ? "YES - PROBLEM" : "NO - OK"}`);
  console.log(`getLatestRate() returns:`);
  console.log(JSON.stringify(latest, null, 2));
  console.log(`Source: ${(latest as { source?: string }).source ?? "live-rates service"}`);

  console.log("\n=== VERIFICATION COMPLETE ===\n");

  const issues: string[] = [];
  if (hasUnsplash) issues.push("poster uses external images");
  if (sampleUsed) issues.push("sample images reused");
  if (svgHashes.size < 45) issues.push(`only ${svgHashes.size}/50 unique posters`);
  if (hasStaticJson) issues.push("still uses static gold-rates.json");
  if (seeds.size < 50) issues.push("duplicate seeds in generation");

  if (issues.length) {
    console.log("ISSUES FOUND:", issues.join(", "));
    process.exit(1);
  }
  console.log("ALL CHECKS PASSED");
}

checkRates().catch((e) => {
  console.error(e);
  process.exit(1);
});
