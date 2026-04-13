const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Sizes needed for app icons
const sizes = [
  { size: 1024, filename: 'icon.png' },
  { size: 192, filename: 'adaptive-icon.png' },
  { size: 800, filename: 'splash-icon.png' },
];

const svgPath = path.join(__dirname, 'assets/match-hub-logo.svg');
const assetsDir = path.join(__dirname, 'assets');

// Read SVG
const svgContent = fs.readFileSync(svgPath);

// Convert each size
Promise.all(
  sizes.map(({ size, filename }) => {
    return sharp(svgContent)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(assetsDir, filename))
      .then(() => console.log(`✓ Created ${filename} (${size}x${size})`))
      .catch(err => console.error(`✗ Error creating ${filename}:`, err.message));
  })
)
  .then(() => console.log('\n✅ All icons generated successfully!'))
  .catch(err => console.error('Error:', err));
