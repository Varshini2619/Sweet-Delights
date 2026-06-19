import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current data.ts file
const dataTsPath = path.join(__dirname, 'src', 'data.ts');
let dataTsContent = fs.readFileSync(dataTsPath, 'utf-8');

// Map product names to local image files
const productImageMap = {
  'Black Forest Cake': '/assets/images/Black Forest Cake.jpg',
  'White Forest Cake': '/assets/images/White Forest Cake.jpg',
  'Red Velvet Cake': '/assets/images/Red Velvet Cake.jpg',
  'Chocolate Truffle Cake': '/assets/images/Chocolate Truffle Cake.jpg',
  'Dutch Chocolate Cake': '/assets/images/Dutch Chocolate Cake.jpg',
  'Butterscotch Cake': '/assets/images/Butterscotch Cake.jpg',
  'Gourmet Fruit Cake': '/assets/images/Gourmet Fruit Cake.jpg',
  'Pineapple Cake': '/assets/images/Pineapple Cake.jpg',
  'KitKat Chocolate Cake': '/assets/images/KitKat Chocolate Cake.jpg',
  'Ferrero Rocher Cake': '/assets/images/Ferrero Rocher Cake.jpg',
  'Rasmalai Fusion Cake': '/assets/images/Rasmalai Fusion Cake.jpg',
  'Imperial Ice Cream Cake': '/assets/images/Imperial Ice Cream Cake.jpg',
  'Bespoke Designer Cake': '/assets/images/Bespoke Designer Cake.jpg',
  'Royal Wedding Celebration Cake': '/assets/images/Royal Wedding Celebration Cake.jpg',
  'Enchanted Birthday Cake': '/assets/images/Enchanted Birthday Cake.jpg',
  'Gourmet Gulab Jamun': '/assets/images/Gourmet Gulab Jamun.jpg',
  'Heritage Rasgulla': '/assets/images/Heritage Rasgulla.jpg',
  'Traditional Royal Rasmalai': '/assets/images/Traditional Royal Rasmalai.jpg',
  'Prestige Kaju Katli': '/assets/images/Prestige Kaju Katli.jpg',
  'Desi Ghee Motichoor Laddu': '/assets/images/Desi Ghee Motichoor Laddu.jpg',
  'Royal Heritage Mysore Pak': '/assets/images/Royal Heritage Mysore Pak.jpg',
  'Crispy Flaky Soan Papdi': '/assets/images/Crispy Flaky Soan Papdi.jpg',
  'Saffron Kalakand Paneer': '/assets/images/Saffron Kalakand Paneer.jpg',
  'Artisanal Alwar Milk Cake': '/assets/images/Artisanal Alwar Milk Cake.jpg',
  'Vrindavan Saffron Peda': '/assets/images/Vrindavan Saffron Peda.jpg',
  'Saffron Shahi Jalebi': '/assets/images/Saffron Shahi Jalebi.jpg',
  'Imperial Almond Badam Halwa': '/assets/images/Imperial Almond Badam Halwa.jpg',
  'Gourmet Potato & Pea Samosa': '/assets/images/Gourmet Potato & Pea Samosa.jpg',
  'Puff Pastry Veg Slice': '/assets/images/Puff Pastry Veg Slice.jpg',
  'Gourmet Paneer Spiced Puff': '/assets/images/Gourmet Paneer Spiced Puff.jpg',
  'Italian Herbs Pizza Puff': '/assets/images/Italian Herbs Pizza Puff.jpg',
  'Khara Spiced Potato Bun': '/assets/images/Khara Spiced Potato Bun.jpg',
  'Spiced Beetroot & Veg Cutlet': '/assets/images/Spiced Beetroot & Veg Cutlet.jpg',
  'Artisan Grilled Club Sandwich': '/assets/images/Artisan Grilled Club Sandwich.jpg',
  'Sourdough Butter Garlic Bread': '/assets/images/Sourdough Butter Garlic Bread.jpg',
  'Golden Baked Cheese Roll': '/assets/images/Golden Baked Cheese Roll.jpg',
  'Spiced Spring Veg Roll': '/assets/images/Spiced Spring Veg Roll.jpg'
};

// Update data.ts with local image paths
let updatedContent = dataTsContent;
let updateCount = 0;

for (const [productName, localImagePath] of Object.entries(productImageMap)) {
  // Find the product and replace its image URL
  const productPattern = new RegExp(
    `(name: '${productName}',[\\s\\S]*?image: )'https://images\\.pexels\\.com/[^']+'`,
    'g'
  );
  
  const match = productPattern.exec(updatedContent);
  if (match) {
    updatedContent = updatedContent.replace(productPattern, `$1'${localImagePath}'`);
    console.log(`✓ Updated image for ${productName}`);
    updateCount++;
  } else {
    console.log(`✗ Could not find product: ${productName}`);
  }
  
  // Also update gallery if it exists
  const galleryPattern = new RegExp(
    `(name: '${productName}',[\\s\\S]*?gallery: \\[\\s*)'https://images\\.pexels\\.com/[^']+'`,
    'g'
  );
  
  const galleryMatch = galleryPattern.exec(updatedContent);
  if (galleryMatch) {
    updatedContent = updatedContent.replace(galleryPattern, `$1'${localImagePath}'`);
  }
}

// Write the updated content back to data.ts
fs.writeFileSync(dataTsPath, updatedContent);
console.log(`\nSuccessfully updated ${updateCount} product images to use local paths`);
