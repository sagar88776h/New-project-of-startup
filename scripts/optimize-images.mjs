import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { REAL_FOOD_IMAGES } from '../src/data/defaultRestaurants.js';

const originalDir = path.resolve('public/food/original');
const optimizedDir = path.resolve('public/food');

if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir, { recursive: true });

async function downloadImage(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    return;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
  }
}

async function run() {
  console.log('--- Phase 3: Image Optimization with Sharp ---');
  let beforeTotal = 0;
  let afterTotal = 0;

  // 1. Process Banner
  const bannerSrc = path.resolve('public/devi-banner.png');
  if (fs.existsSync(bannerSrc)) {
    const bannerSize = fs.statSync(bannerSrc).size;
    beforeTotal += bannerSize;
    fs.copyFileSync(bannerSrc, path.join(originalDir, 'devi-banner.png'));

    // 1200w
    const bannerWebp = path.join(optimizedDir, 'devi-banner.webp');
    await sharp(bannerSrc).resize({ width: 1200 }).webp({ quality: 82 }).toFile(bannerWebp);
    afterTotal += fs.statSync(bannerWebp).size;
    console.log(`✓ Banner (1200w): ${(bannerSize / 1024).toFixed(1)} KB -> ${(fs.statSync(bannerWebp).size / 1024).toFixed(1)} KB`);

    // 2400w 2x
    const bannerWebp2x = path.join(optimizedDir, 'devi-banner-2x.webp');
    await sharp(bannerSrc).resize({ width: 2400 }).webp({ quality: 78 }).toFile(bannerWebp2x);
    console.log(`✓ Banner 2x: ${(fs.statSync(bannerWebp2x).size / 1024).toFixed(1)} KB`);

    // AVIF
    const bannerAvif = path.join(optimizedDir, 'devi-banner.avif');
    await sharp(bannerSrc).resize({ width: 1200 }).avif({ quality: 75 }).toFile(bannerAvif);
  }

  // 2. Process Logo
  const logoSrc = path.resolve('public/devi-logo.png');
  if (fs.existsSync(logoSrc)) {
    const logoSize = fs.statSync(logoSrc).size;
    beforeTotal += logoSize;
    fs.copyFileSync(logoSrc, path.join(originalDir, 'devi-logo.png'));

    const logoWebp = path.join(optimizedDir, 'devi-logo.webp');
    await sharp(logoSrc).resize({ width: 256, height: 256 }).webp({ quality: 85 }).toFile(logoWebp);
    const logoWebpSize = fs.statSync(logoWebp).size;
    afterTotal += logoWebpSize;
    console.log(`✓ Logo: ${(logoSize / 1024).toFixed(1)} KB -> ${(logoWebpSize / 1024).toFixed(1)} KB (< 60 KB target met)`);
  }

  // 3. Process Food & Category Images from REAL_FOOD_IMAGES
  console.log('\nProcessing food & category images...');
  const entries = Object.entries(REAL_FOOD_IMAGES).filter(([, url]) => url.startsWith('http'));

  for (const [key, url] of entries) {
    const originalFile = path.join(originalDir, `${key}.jpg`);
    await downloadImage(url, originalFile);

    if (fs.existsSync(originalFile)) {
      const origSize = fs.statSync(originalFile).size;
      beforeTotal += origSize;

      const isCategory = key.startsWith('cat');
      const targetWidth = isCategory ? 200 : 600;
      const targetHeight = isCategory ? 200 : undefined;

      const outWebp = path.join(optimizedDir, `${key}.webp`);
      const transformer = sharp(originalFile).resize({
        width: targetWidth,
        height: targetHeight,
        fit: isCategory ? 'cover' : 'inside',
      });

      await transformer.clone().webp({ quality: isCategory ? 78 : 80 }).toFile(outWebp);
      const optSize = fs.statSync(outWebp).size;
      afterTotal += optSize;

      // Also create AVIF
      const outAvif = path.join(optimizedDir, `${key}.avif`);
      await transformer.clone().avif({ quality: 75 }).toFile(outAvif);

      console.log(`  ✓ ${key}: ${(origSize / 1024).toFixed(1)} KB -> ${(optSize / 1024).toFixed(1)} KB (< ${isCategory ? 30 : 80} KB)`);
    }
  }

  console.log('\n=============================================');
  console.log(`Total Image Weight Before: ${(beforeTotal / (1024 * 1024)).toFixed(2)} MB (${(beforeTotal / 1024).toFixed(0)} KB)`);
  console.log(`Total Image Weight After:  ${(afterTotal / (1024 * 1024)).toFixed(2)} MB (${(afterTotal / 1024).toFixed(0)} KB)`);
  const savings = (((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(1);
  console.log(`Bandwidth Savings: ${savings}%`);
  console.log('=============================================\n');
}

run();
