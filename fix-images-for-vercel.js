import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert filename to SEO-friendly format
const toSeoFriendly = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

// Create category subfolders in public/assets/images
const categories = ['cakes', 'sweets', 'savouries'];
categories.forEach(category => {
  const categoryPath = path.join(__dirname, 'public', 'assets', 'images', category);
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
    console.log(`✓ Created folder: public/assets/images/${category}`);
  }
});

// Map of old filenames to new SEO-friendly filenames with categories
const fileMapping = {
  // Cakes
  'Black Forest Cake.jpg': { category: 'cakes', newName: 'black-forest-cake.jpg' },
  'White Forest Cake.jpg': { category: 'cakes', newName: 'white-forest-cake.jpg' },
  'Red Velvet Cake.jpg': { category: 'cakes', newName: 'red-velvet-cake.jpg' },
  'Chocolate Truffle Cake.jpg': { category: 'cakes', newName: 'chocolate-truffle-cake.jpg' },
  'Dutch Chocolate Cake.jpg': { category: 'cakes', newName: 'dutch-chocolate-cake.jpg' },
  'Butterscotch Cake.jpg': { category: 'cakes', newName: 'butterscotch-cake.jpg' },
  'Gourmet Fruit Cake.jpg': { category: 'cakes', newName: 'gourmet-fruit-cake.jpg' },
  'Pineapple Cake.jpg': { category: 'cakes', newName: 'pineapple-cake.jpg' },
  'KitKat Chocolate Cake.jpg': { category: 'cakes', newName: 'kitkat-chocolate-cake.jpg' },
  'Ferrero Rocher Cake.jpg': { category: 'cakes', newName: 'ferrero-rocher-cake.jpg' },
  'Rasmalai Fusion Cake.jpg': { category: 'cakes', newName: 'rasmalai-fusion-cake.jpg' },
  'Imperial Ice Cream Cake.jpg': { category: 'cakes', newName: 'imperial-ice-cream-cake.jpg' },
  'Bespoke Designer Cake.jpg': { category: 'cakes', newName: 'bespoke-designer-cake.jpg' },
  'Royal Wedding Celebration Cake.jpg': { category: 'cakes', newName: 'royal-wedding-celebration-cake.jpg' },
  'Enchanted Birthday Cake.jpg': { category: 'cakes', newName: 'enchanted-birthday-cake.jpg' },
  'Artisanal Alwar Milk Cake.jpg': { category: 'cakes', newName: 'artisanal-alwar-milk-cake.jpg' },
  'Gourmet Gulab Jamun.jpg': { category: 'sweets', newName: 'gourmet-gulab-jamun.jpg' },
  'Heritage Rasgulla.jpg': { category: 'sweets', newName: 'heritage-rasgulla.jpg' },
  'Traditional Royal Rasmalai.jpg': { category: 'sweets', newName: 'traditional-royal-rasmalai.jpg' },
  'Prestige Kaju Katli.jpg': { category: 'sweets', newName: 'prestige-kaju-katli.jpg' },
  'Desi Ghee Motichoor Laddu.jpg': { category: 'sweets', newName: 'desi-ghee-motichoor-laddu.jpg' },
  'Royal Heritage Mysore Pak.jpg': { category: 'sweets', newName: 'royal-heritage-mysore-pak.jpg' },
  'Crispy Flaky Soan Papdi.jpg': { category: 'sweets', newName: 'crispy-flaky-soan-papdi.jpg' },
  'Saffron Kalakand Paneer.jpg': { category: 'sweets', newName: 'saffron-kalakand-paneer.jpg' },
  'Vrindavan Saffron Peda.jpg': { category: 'sweets', newName: 'vrindavan-saffron-peda.jpg' },
  'Saffron Shahi Jalebi.jpg': { category: 'sweets', newName: 'saffron-shahi-jalebi.jpg' },
  'Imperial Almond Badam Halwa.jpg': { category: 'sweets', newName: 'imperial-almond-badam-halwa.jpg' },
  'Golden Baked Cheese Roll.jpg': { category: 'sweets', newName: 'golden-baked-cheese-roll.jpg' },
  
  // Savouries
  'Gourmet Potato & Pea Samosa.jpg': { category: 'savouries', newName: 'gourmet-potato-pea-samosa.jpg' },
  'Puff Pastry Veg Slice.jpg': { category: 'savouries', newName: 'puff-pastry-veg-slice.jpg' },
  'Gourmet Paneer Spiced Puff.jpg': { category: 'savouries', newName: 'gourmet-paneer-spiced-puff.jpg' },
  'Italian Herbs Pizza Puff.jpg': { category: 'savouries', newName: 'italian-herbs-pizza-puff.jpg' },
  'Khara Spiced Potato Bun.jpg': { category: 'savouries', newName: 'khara-spiced-potato-bun.jpg' },
  'Spiced Beetroot & Veg Cutlet.jpg': { category: 'savouries', newName: 'spiced-beetroot-veg-cutlet.jpg' },
  'Artisan Grilled Club Sandwich.jpg': { category: 'savouries', newName: 'artisan-grilled-club-sandwich.jpg' },
  'Sourdough Butter Garlic Bread.jpg': { category: 'savouries', newName: 'sourdough-butter-garlic-bread.jpg' },
  'Spiced Spring Veg Roll.jpg': { category: 'savouries', newName: 'spiced-spring-veg-roll.jpg' }
};

// Move and rename files
const sourceDir = path.join(__dirname, 'assets', 'images');
const movedFiles = [];

for (const [oldName, mapping] of Object.entries(fileMapping)) {
  // Check in category subfolder first
  const sourcePath = path.join(sourceDir, mapping.category, oldName);
  const destPath = path.join(__dirname, 'public', 'assets', 'images', mapping.category, mapping.newName);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    movedFiles.push({ oldName, newName: mapping.newName, category: mapping.category });
    console.log(`✓ Moved: ${mapping.category}/${oldName} -> ${mapping.category}/${mapping.newName}`);
  } else {
    console.log(`✗ Source not found: ${mapping.category}/${oldName}`);
  }
}

console.log(`\nSuccessfully moved ${movedFiles.length} files to public/assets/images/`);

// Generate the updated product mapping for data.ts
const productImageMap = {};
movedFiles.forEach(file => {
  // Convert new filename back to product name format
  const productName = file.newName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('.jpg', '');
  
  const category = file.category.charAt(0).toUpperCase() + file.category.slice(1);
  const imagePath = `/assets/images/${file.category}/${file.newName}`;
  
  productImageMap[productName] = { category, path: imagePath };
});

// Update data.ts file
const dataTsPath = path.join(__dirname, 'src', 'data.ts');
let dataTsContent = fs.readFileSync(dataTsPath, 'utf-8');

let updateCount = 0;
for (const [productName, imageData] of Object.entries(productImageMap)) {
  // Update image field
  const imagePattern = new RegExp(
    `(name: '${productName}',[\\s\\S]*?image: )'/assets/images/[^']+'`,
    'g'
  );
  
  const match = imagePattern.exec(dataTsContent);
  if (match) {
    dataTsContent = dataTsContent.replace(imagePattern, `$1'${imageData.path}'`);
    console.log(`✓ Updated image path for ${productName}`);
    updateCount++;
  }
  
  // Update gallery field
  const galleryPattern = new RegExp(
    `(name: '${productName}',[\\s\\S]*?gallery: \\[\\s*)'/assets/images/[^']+'`,
    'g'
  );
  
  const galleryMatch = galleryPattern.exec(dataTsContent);
  if (galleryMatch) {
    dataTsContent = dataTsContent.replace(galleryPattern, `$1'${imageData.path}'`);
  }
}

// Also update category banner images
const categoryBannerMap = {
  'Cakes': '/assets/images/cakes/black-forest-cake.jpg',
  'Sweets': '/assets/images/sweets/gourmet-gulab-jamun.jpg',
  'Savouries': '/assets/images/savouries/gourmet-potato-pea-samosa.jpg'
};

for (const [category, bannerPath] of Object.entries(categoryBannerMap)) {
  const bannerPattern = new RegExp(
    `(name: '${category}',[\\s\\S]*?bannerImage: )'https://images\\.unsplash\\.com/[^']+'`,
    'g'
  );
  
  const bannerMatch = bannerPattern.exec(dataTsContent);
  if (bannerMatch) {
    dataTsContent = dataTsContent.replace(bannerPattern, `$1'${bannerPath}'`);
    console.log(`✓ Updated banner image for ${category}`);
  }
}

fs.writeFileSync(dataTsPath, dataTsContent);
console.log(`\n✓ Updated data.ts with ${updateCount} product image paths`);
console.log(`✓ Updated category banner images`);

// Create a summary file
const summary = {
  movedFiles: movedFiles.length,
  productImageMap,
  categoryBannerMap,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, 'image-migration-summary.json'),
  JSON.stringify(summary, null, 2)
);
console.log(`\n✓ Created image-migration-summary.json`);
