/**
 * Shopify Product CSV Generator
 * Generates a products.csv file formatted for Shopify's native Product Import tool
 * Includes 8 dummy homecare products with specific edge cases for testing
 */

const fs = require('fs');
const path = require('path');

// Product data with edge cases
const products = [
  {
    handle: 'premium-eco-friendly-all-purpose-cleaner',
    title: 'Premium Eco-Friendly All-Purpose Cleaner',
    body: '<p>A powerful, plant-based cleaner that tackles tough stains while being gentle on the environment. Perfect for all surfaces.</p>',
    vendor: 'PureLane',
    type: 'Homecare',
    tags: 'cleaner,eco-friendly,all-purpose',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-001',
    inventoryQty: 100,
    inventoryPolicy: 'continue',
    price: '24.99',
    compareAtPrice: '29.99',
    imageSrc: 'https://images.unsplash.com/photo-1581578731117-104f2a912a67?w=800&h=800&fit=crop'
  },
  {
    handle: 'organic-laundry-detergent-lavender-scent',
    title: 'Organic Laundry Detergent - Lavender Scent',
    body: '<p>Gentle on clothes and the environment. Our organic formula removes tough stains while leaving a calming lavender scent.</p>',
    vendor: 'PureLane',
    type: 'Laundry',
    tags: 'detergent,organic,laundry',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-002',
    inventoryQty: 50,
    inventoryPolicy: 'continue',
    price: '19.99',
    compareAtPrice: '',
    imageSrc: 'https://images.unsplash.com/photo-1626387346564-0e4c36c7dd27?w=800&h=800&fit=crop'
  },
  {
    handle: 'sold-out-limited-edition-bamboo-cleaning-set',
    title: 'SOLD OUT - Limited Edition Bamboo Cleaning Set',
    body: '<p>Complete cleaning set made from sustainable bamboo. Includes scrub brush, dustpan, and handled broom. Limited stock available.</p>',
    vendor: 'PureLane',
    type: 'Cleaning Tools',
    tags: 'bamboo,sustainable,limited-edition',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-003',
    inventoryQty: 0, // EDGE CASE: Sold out
    inventoryPolicy: 'deny', // EDGE CASE: Do not continue selling
    price: '45.99',
    compareAtPrice: '59.99',
    imageSrc: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop'
  },
  {
    handle: 'no-media-professional-grade-glass-cleaner',
    title: 'NO MEDIA - Professional Grade Glass Cleaner',
    body: '<p>Industrial-strength glass cleaner that leaves streak-free results. Safe for use on windows, mirrors, and glass surfaces.</p>',
    vendor: 'PureLane',
    type: 'Homecare',
    tags: 'glass-cleaner,professional',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-004',
    inventoryQty: 75,
    inventoryPolicy: 'continue',
    price: '14.99',
    compareAtPrice: '',
    imageSrc: '' // EDGE CASE: No media/images
  },
  {
    handle: 'ultra-premium-platinum-series-cleaner',
    title: 'Ultra Premium Platinum Series Maximum Strength Industrial Grade Deep Cleaning Power Solution Formula X5000 with Advanced Nano-Technology and Plant-Based Extracts for Professional Homecare Results That Will Transform Your Living Space Into a Sparkling Clean Environment While Being Environmentally Friendly and Safe for Children Pets and All Family Members with Long Lasting Fresh Scent Technology',
    body: '<p>The ultimate cleaning solution with cutting-edge nano-technology. This premium formula delivers unmatched cleaning power while remaining eco-friendly.</p>',
    vendor: 'PureLane',
    type: 'Homecare',
    tags: 'premium,industrial,nano-technology',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-005',
    inventoryQty: 25,
    inventoryPolicy: 'continue',
    price: '89.99',
    compareAtPrice: '129.99',
    imageSrc: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop'
  },
  {
    handle: 'natural-dish-soap-citrus-burst',
    title: 'Natural Dish Soap - Citrus Burst',
    body: '<p>Tough on grease, gentle on hands. Our natural dish soap cuts through grease with the power of citrus essential oils.</p>',
    vendor: 'PureLane',
    type: 'Kitchen',
    tags: 'dish-soap,natural,citrus',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-006',
    inventoryQty: 200,
    inventoryPolicy: 'continue',
    price: '8.99',
    compareAtPrice: '',
    imageSrc: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&h=800&fit=crop'
  },
  {
    handle: 'microfiber-cleaning-cloths-pack-12',
    title: 'Microfiber Cleaning Cloths - Pack of 12',
    body: '<p>Ultra-soft microfiber cloths perfect for dusting, polishing, and cleaning all surfaces without scratching. Machine washable.</p>',
    vendor: 'PureLane',
    type: 'Cleaning Tools',
    tags: 'microfiber,cloths,pack',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-007',
    inventoryQty: 150,
    inventoryPolicy: 'continue',
    price: '16.99',
    compareAtPrice: '19.99',
    imageSrc: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop'
  },
  {
    handle: 'reusable-bamboo-paper-towels-3-roll',
    title: 'Reusable Bamboo Paper Towels - 3 Roll Pack',
    body: '<p>Sustainable alternative to paper towels. Made from organic bamboo, these reusable towels are washable and durable.</p>',
    vendor: 'PureLane',
    type: 'Kitchen',
    tags: 'bamboo,reusable,paper-towels',
    option1Name: 'Title',
    option1Value: 'Default Title',
    sku: 'PL-008',
    inventoryQty: 80,
    inventoryPolicy: 'continue',
    price: '22.99',
    compareAtPrice: '',
    imageSrc: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop'
  }
];

// Shopify CSV headers
const headers = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Option1 Name',
  'Option1 Value',
  'Variant SKU',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Price',
  'Variant Compare At Price',
  'Image Src'
];

function escapeCSV(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  // Convert to string
  const stringValue = String(value);
  
  // If the value contains quotes, commas, or newlines, wrap in quotes and escape quotes
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

function generateCSV() {
  console.log('🚀 Generating products.csv file...');
  
  // Create CSV content
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.map(escapeCSV).join(','));
  
  // Add product rows
  for (const product of products) {
    const row = [
      product.handle,
      product.title,
      product.body,
      product.vendor,
      product.type,
      product.tags,
      product.option1Name,
      product.option1Value,
      product.sku,
      product.inventoryQty,
      product.inventoryPolicy,
      product.price,
      product.compareAtPrice,
      product.imageSrc
    ];
    
    csvRows.push(row.map(escapeCSV).join(','));
  }
  
  const csvContent = csvRows.join('\n');
  
  // Write to file
  const filePath = path.join(__dirname, 'products.csv');
  fs.writeFileSync(filePath, csvContent, 'utf8');
  
  console.log(`✅ products.csv created successfully at: ${filePath}`);
  console.log(`📦 Generated ${products.length} products`);
  
  console.log('\n📋 Edge cases included:');
  console.log('   1. Product #3: SOLD OUT (Variant Inventory Qty: 0, Variant Inventory Policy: deny)');
  console.log('   2. Product #4: NO MEDIA (Image Src: blank)');
  console.log('   3. Product #5: LONG TITLE (200+ word title for CSS testing)');
  
  console.log('\n📤 Import instructions:');
  console.log('   1. Go to Shopify Admin > Products > Import');
  console.log('   2. Upload the products.csv file');
  console.log('   3. Review and complete the import');
}

// Execute the CSV generation
generateCSV();