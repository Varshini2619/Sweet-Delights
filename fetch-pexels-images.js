import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PEXELS_API_KEY = 'PcBtIDqB1SpQ1jDvaMbbTzZ5OiGTTQRA4WqGEBnEXZmDn0ZRiqXtDMxk';

// Read the current data.ts file
const dataTsPath = path.join(__dirname, 'src', 'data.ts');
let dataTsContent = fs.readFileSync(dataTsPath, 'utf-8');

// Extract products from data.ts
const productsMatch = dataTsContent.match(/export const PRODUCTS: Product\[\] = \[([\s\S]*?)\];/);
if (!productsMatch) {
  console.error('Could not find PRODUCTS array in data.ts');
  process.exit(1);
}

// Parse product names
const productPattern = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
const products = [];
let match;
while ((match = productPattern.exec(productsMatch[1])) !== null) {
  products.push({
    id: match[1],
    name: match[2],
    category: match[3]
  });
}

console.log(`Found ${products.length} products to fetch images for`);

// Function to fetch image from Pexels
async function fetchPexelsImage(query) {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch image for "${query}": ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching image for "${query}":`, error.message);
    return null;
  }
}

// Fetch images for all products
async function fetchAllImages() {
  const imageMap = {};
  
  for (const product of products) {
    // Create search query from product name
    const searchQuery = `${product.name} ${product.category}`;
    console.log(`Fetching image for: ${searchQuery}`);
    
    const imageUrl = await fetchPexelsImage(searchQuery);
    
    if (imageUrl) {
      imageMap[product.id] = imageUrl;
      console.log(`✓ Found image for ${product.name}: ${imageUrl}`);
    } else {
      console.log(`✗ No image found for ${product.name}`);
    }
    
    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return imageMap;
}

// Update data.ts with new image URLs
function updateDataTs(imageMap) {
  let updatedContent = dataTsContent;
  
  for (const [productId, newImageUrl] of Object.entries(imageMap)) {
    // Find the product and replace its image URL
    const productPattern = new RegExp(
      `(id: '${productId}',[\\s\\S]*?image: )'https://images\\.unsplash\\.com/[^']+'`,
      'g'
    );
    
    updatedContent = updatedContent.replace(productPattern, `$1'${newImageUrl}'`);
    
    // Also update gallery if it exists
    const galleryPattern = new RegExp(
      `(id: '${productId}',[\\s\\S]*?gallery: \\[\\s*)'https://images\\.unsplash\\.com/[^']+'`,
      'g'
    );
    
    updatedContent = updatedContent.replace(galleryPattern, `$1'${newImageUrl}'`);
  }
  
  fs.writeFileSync(dataTsPath, updatedContent);
  console.log('Updated data.ts with new Pexels image URLs');
}

// Main execution
fetchAllImages()
  .then(imageMap => {
    console.log(`\nSuccessfully fetched ${Object.keys(imageMap).length} images`);
    updateDataTs(imageMap);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
