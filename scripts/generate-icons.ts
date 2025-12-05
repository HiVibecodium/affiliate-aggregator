/**
 * PWA Icon Generator Script
 *
 * This script generates all required PWA icons from a source SVG.
 *
 * Requirements:
 *   npm install sharp
 *
 * Usage:
 *   npx tsx scripts/generate-icons.ts
 *
 * Note: Place a source icon at public/icon-source.svg (512x512 recommended)
 */

import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'icons');

// Simple SVG icon template (blue gradient with "AA" text)
const generateSvgIcon = (size: number): string => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">AA</text>
</svg>
`;

async function generateIcons() {
  console.log('Creating icons directory...');
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log('Generating icons...');

  for (const size of SIZES) {
    const svgBuffer = Buffer.from(generateSvgIcon(size));

    // Generate regular icon
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);
    console.log(`Created: icon-${size}x${size}.png`);
  }

  // Generate maskable icon (512x512 with padding)
  const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <text x="256" y="310" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="white" text-anchor="middle">AA</text>
</svg>
`;

  const maskableBuffer = Buffer.from(maskableSvg);
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(OUTPUT_DIR, 'maskable-icon-512x512.png'));
  console.log('Created: maskable-icon-512x512.png');

  // Create favicon.ico (multi-size)
  const favicon16 = await sharp(Buffer.from(generateSvgIcon(16)))
    .resize(16, 16)
    .png()
    .toBuffer();

  const favicon32 = await sharp(Buffer.from(generateSvgIcon(32)))
    .resize(32, 32)
    .png()
    .toBuffer();

  // Save 32x32 favicon as png (ICO generation would require additional library)
  await writeFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'), favicon32);
  await writeFile(path.join(OUTPUT_DIR, 'favicon-16x16.png'), favicon16);
  console.log('Created: favicon-16x16.png, favicon-32x32.png');

  console.log('\nAll icons generated successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

generateIcons().catch(console.error);
