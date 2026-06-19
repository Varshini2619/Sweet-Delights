import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current data.ts file
const dataTsPath = path.join(__dirname, 'src', 'data.ts');
let dataTsContent = fs.readFileSync(dataTsPath, 'utf-8');

// Map product names to their categories and local image paths
const productImageMap = {
  // Cakes
  'Black Forest Cake': { category: 'Cakes', path: '/assets/images/cakes/Black Forest Cake.jpg' },
  'White Forest Cake': { category: 'Cakes', path: '/assets/images/cakes/White Forest Cake.jpg' },
  'Red Velvet Cake': { category: 'Cakes', path: '/assets/images/cakes/Red Velvet Cake.jpg' },
  'Chocolate Truffle Cake': { category: 'Cakes', path: '/assets/images/cakes/Chocolate Truffle Cake.jpg' },
  'Dutch Chocolate Cake': { category: 'Cakes', path: '/assets/images/cakes/Dutch Chocolate Cake.jpg' },
  'Butterscotch Cake': { category: 'Cakes', path: '/assets/images/cakes/Butterscotch Cake.jpg' },
  'Gourmet Fruit Cake': { category: 'Cakes', path: '/assets/images/cakes/Gourmet Fruit Cake.jpg' },
  'Pineapple Cake': { category: 'Cakes', path: '/assets/images/cakes/Pineapple Cake.jpg' },
  'KitKat Chocolate Cake': { category: 'Cakes', path: '/assets/images/cakes/KitKat Chocolate Cake.jpg' },
  'Ferrero Rocher Cake': { category: 'Cakes', path: '/assets/images/cakes/Ferrero Rocher Cake.jpg' },
  'Rasmalai Fusion Cake': { category: 'Cakes', path: '/assets/images/cakes/Rasmalai Fusion Cake.jpg' },
  'Imperial Ice Cream Cake': { category: 'Cakes', path: '/assets/images/cakes/Imperial Ice Cream Cake.jpg' },
  'Bespoke Designer Cake': { category: 'Cakes', path: '/assets/images/cakes/Bespoke Designer Cake.jpg' },
  'Royal Wedding Celebration Cake': { category: 'Cakes', path: '/assets/images/cakes/Royal Wedding Celebration Cake.jpg' },
  'Enchanted Birthday Cake': { category: 'Cakes', path: '/assets/images/cakes/Enchanted Birthday Cake.jpg' },
  'Artisanal Alwar Milk Cake': { category: 'Sweets', path: '/assets/images/sweets/Artisanal Alwar Milk Cake.jpg' },
  
  // Sweets
  'Gourmet Gulab Jamun': { category: 'Sweets', path: '/assets/images/sweets/Gourmet Gulab Jamun.jpg' },
  'Heritage Rasgulla': { category: 'Sweets', path: '/assets/images/sweets/Heritage Rasgulla.jpg' },
  'Traditional Royal Rasmalai': { category: 'Sweets', path: '/assets/images/sweets/Traditional Royal Rasmalai.jpg' },
  'Prestige Kaju Katli': { category: 'Sweets', path: '/assets/images/sweets/Prestige Kaju Katli.jpg' },
  'Desi Ghee Motichoor Laddu': { category: 'Sweets', path: '/assets/images/sweets/Desi Ghee Motichoor Laddu.jpg' },
  'Royal Heritage Mysore Pak': { category: 'Sweets', path: '/assets/images/sweets/Royal Heritage Mysore Pak.jpg' },
  'Crispy Flaky Soan Papdi': { category: 'Sweets', path: '/assets/images/sweets/Crispy Flaky Soan Papdi.jpg' },
  'Saffron Kalakand Paneer': { category: 'Sweets', path: '/assets/images/sweets/Saffron Kalakand Paneer.jpg' },
  'Vrindavan Saffron Peda': { category: 'Sweets', path: '/assets/images/sweets/Vrindavan Saffron Peda.jpg' },
  'Saffron Shahi Jalebi': { category: 'Sweets', path: '/assets/images/sweets/Saffron Shahi Jalebi.jpg' },
  'Imperial Almond Badam Halwa': { category: 'Sweets', path: '/assets/images/sweets/Imperial Almond Badam Halwa.jpg' },
  'Golden Baked Cheese Roll': { category: 'Savouries', path: '/assets/images/savouries/Golden Baked Cheese Roll.jpg' },
  
  // Savouries
  'Gourmet Potato & Pea Samosa': { category: 'Savouries', path: '/assets/images/savouries/Gourmet Potato & Pea Samosa.jpg' },
  'Puff Pastry Veg Slice': { category: 'Savouries', path: '/assets/images/savouries/Puff Pastry Veg Slice.jpg' },
  'Gourmet Paneer Spiced Puff': { category: 'Savouries', path: '/assets/images/savouries/Gourmet Paneer Spiced Puff.jpg' },
  'Italian Herbs Pizza Puff': { category: 'Savouries', path: '/assets/images/savouries/Italian Herbs Pizza Puff.jpg' },
  'Khara Spiced Potato Bun': { category: 'Savouries', path: '/assets/images/savouries/Khara Spiced Potato Bun.jpg' },
  'Spiced Beetroot & Veg Cutlet': { category: 'Savouries', path: '/assets/images/savouries/Spiced Beetroot & Veg Cutlet.jpg' },
  'Artisan Grilled Club Sandwich': { category: 'Savouries', path: '/assets/images/savouries/Artisan Grilled Club Sandwich.jpg' },
  'Sourdough Butter Garlic Bread': { category: 'Savouries', path: '/assets/images/savouries/Sourdough Butter Garlic Bread.jpg' },
  'Spiced Spring Veg Roll': { category: 'Savouries', path: '/assets/images/savouries/Spiced Spring Veg Roll.jpg' }
};

// Update data.ts with new image paths
let updatedContent = dataTsContent;
let updateCount = 0;

for (const [productName, imageData] of Object.entries(productImageMap)) {
  // Find the product and replace its image URL
  const productPattern = new RegExp(
    `(name: '${productName}',[\\s\\S]*?image: )'/assets/images/[^']+'`,
    'g'
  );
  
  const match = productPattern.exec(updatedContent);
  if (match) {
    updatedContent = updatedContent.replace(productPattern, `$1'${imageData.path}'`);
    console.log(`✓ Updated image for ${productName} (${imageData.category})`);
    updateCount++;
  } else {
    console.log(`✗ Could not find product: ${productName}`);
  }
  
  // Also update gallery if it exists
  const galleryPattern = new RegExp(
    `(name: '${productName}',[\\s\\S]*?gallery: \\[\\s*)'/assets/images/[^']+'`,
    'g'
  );
  
  const galleryMatch = galleryPattern.exec(updatedContent);
  if (galleryMatch) {
    updatedContent = updatedContent.replace(galleryPattern, `$1'${imageData.path}'`);
  }
}

// Write the updated content back to data.ts
fs.writeFileSync(dataTsPath, updatedContent);
console.log(`\nSuccessfully updated ${updateCount} product images to use category-based paths`);
