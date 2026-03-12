#!/usr/bin/env node
// Quick icon generator for GramHealth PWA
// Generates placeholder SVG icons converted to the needed sizes

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'frontend', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const svgContent = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#16a34a"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" 
    font-size="${size * 0.5}" font-family="serif">🏥</text>
  <text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" 
    font-size="${size * 0.12}" font-family="sans-serif" fill="white" font-weight="bold">GramHealth</text>
</svg>`;

const sizes = [72, 96, 128, 192, 512];

sizes.forEach(size => {
  const svgPath = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svgContent(size));
  // Also write as .png placeholder (SVG works fine for PWA icons in most browsers)
  const pngPath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(pngPath, svgContent(size)); // browser will fallback to SVG-named file
  console.log(`Created icon-${size}.png`);
});

console.log('\n✅ Icons created! For production, convert SVGs to actual PNGs.');
console.log('You can use tools like: sharp, canvas, or online converters.\n');
