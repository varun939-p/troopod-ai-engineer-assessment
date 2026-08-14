/**
 * Shopify Product Seeding Script
 * Creates 8 dummy homecare products with specific edge cases for testing
 */

const axios = require('axios');

// Store configuration
const STORE_DOMAIN = '4mmef0-2a.myshopify.com';
const API_VERSION = '2024-01';

// You'll need to provide your Shopify Admin API access token
// Get this from: Shopify Admin > Settings > Apps and sales channels > Develop apps > Create app > Configure Admin API scopes
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Error: SHOPIFY_ACCESS_TOKEN environment variable is required');
  console.error('Please set it with: export SHOPIFY_ACCESS_TOKEN=your_token_here');
  process.exit(1);
}

const API_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

// Product data with edge cases
const products = [
  {
    title: 'Premium Eco-Friendly All-Purpose Cleaner',
    description: 'A powerful, plant-based cleaner that tackles tough stains while being gentle on the environment. Perfect for all surfaces.',
    vendor: 'PureLane',
    productType: 'Homecare',
    tags: 'cleaner,eco-friendly,all-purpose',
    price: '24.99',
    compareAtPrice: '29.99',
    sku: 'PL-001',
    inventoryQuantity: 100,
    trackInventory: true,
    continueSelling: true,
    images: [
      'https://images.unsplash.com/photo-1581578731117-104f2a912a67?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&h=800&fit=crop'
    ]
  },
  {
    title: 'Organic Laundry Detergent - Lavender Scent',
    description: 'Gentle on clothes and the environment. Our organic formula removes tough stains while leaving a calming lavender scent.',
    vendor: 'PureLane',
    productType: 'Laundry',
    tags: 'detergent,organic,laundry',
    price: '19.99',
    compareAtPrice: null,
    sku: 'PL-002',
    inventoryQuantity: 50,
    trackInventory: true,
    continueSelling: true,
    images: [
      'https://images.unsplash.com/photo-1626387346564-0e4c36c7dd27?w=800&h=800&fit=crop'
    ]
  },
  {
    title: 'SOLD OUT - Limited Edition Bamboo Cleaning Set',
    description: 'Complete cleaning set made from sustainable bamboo. Includes scrub brush, dustpan, and handled broom. Limited stock available.',
    vendor: 'PureLane',
    productType: 'Cleaning Tools',
    tags: 'bamboo,sustainable,limited-edition',
    price: '45.99',
    compareAtPrice: '59.99',
    sku: 'PL-003',
    inventoryQuantity: 0, // EDGE CASE: Sold out
    trackInventory: true,
    continueSelling: false, // EDGE CASE: Do not continue selling
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556227770-38f78e3ad3dc?w=800&h=800&fit=crop'
    ]
  },
  {
    title: 'NO MEDIA - Professional Grade Glass Cleaner',
    description: 'Industrial-strength glass cleaner that leaves streak-free results. Safe for use on windows, mirrors, and glass surfaces.',
    vendor: 'PureLane',
    productType: 'Homecare',
    tags: 'glass-cleaner,professional',
    price: '14.99',
    compareAtPrice: null,
    sku: 'PL-004',
    inventoryQuantity: 75,
    trackInventory: true,
    continueSelling: true,
    images: [] // EDGE CASE: No media/images
  },
  {
    title: 'Ultra Premium Platinum Series Maximum Strength Industrial Grade Deep Cleaning Power Solution Formula X5000 with Advanced Nano-Technology and Plant-Based Extracts for Professional Homecare Results That Will Transform Your Living Space Into a Sparkling Clean Environment While Being Environmentally Friendly and Safe for Children Pets and All Family Members with Long Lasting Fresh Scent Technology',
    description: 'The ultimate cleaning solution with cutting-edge nano-technology. This premium formula delivers unmatched cleaning power while remaining eco-friendly.',
    vendor: 'PureLane',
    productType: 'Homecare',
    tags: 'premium,industrial,nano-technology',
    price: '89.99',
    compareAtPrice: '129.99',
    sku: 'PL-005',
    inventoryQuantity: 25,
    trackInventory: true,
    continueSelling: true,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop'
    ]
  },
  {
    title: 'Natural Dish Soap - Citrus Burst',
    description: 'Tough on grease, gentle on hands. Our natural dish soap cuts through grease with the power of citrus essential oils.',
    vendor: 'PureLane',
    productType: 'Kitchen',
    tags: 'dish-soap,natural,citrus',
    price: '8.99',
    compareAtPrice: null,
    sku: 'PL-006',
    inventoryQuantity: 200,
    trackInventory: true,
    continueSelling: true,
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&h=800&fit=crop'
    ]
  },
  {
    title: 'Microfiber Cleaning Cloths - Pack of 12',
    description: 'Ultra-soft microfiber cloths perfect for dusting, polishing, and cleaning all surfaces without scratching. Machine washable.',
    vendor: 'PureLane',
    productType: 'Cleaning Tools',
    tags: 'microfiber,cloths,pack',
    price: '16.99',
    compareAtPrice: '19.99',
    sku: 'PL-007',
    inventoryQuantity: 150,
    trackInventory: true,
    continueSelling: true,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop'
    ]
  },
  {
    title: 'Reusable Bamboo Paper Towels - 3 Roll Pack',
    description: 'Sustainable alternative to paper towels. Made from organic bamboo, these reusable towels are washable and durable.',
    vendor: 'PureLane',
    productType: 'Kitchen',
    tags: 'bamboo,reusable,paper-towels',
    price: '22.99',
    compareAtPrice: null,
    sku: 'PL-008',
    inventoryQuantity: 80,
    trackInventory: true,
    continueSelling: true,
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop'
    ]
  }
];

// GraphQL mutation to create a product
const createProductMutation = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        variants(first: 1) {
          edges {
            node {
              id
              price
              inventoryQuantity
              availableForSale
            }
          }
        }
        images(first: 5) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function createProduct(productData) {
  try {
    // Prepare the input for GraphQL
    const input = {
      title: productData.title,
      descriptionHtml: productData.description,
      vendor: productData.vendor,
      productType: productData.productType,
      tags: productData.tags,
      variants: [{
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        sku: productData.sku,
        inventoryQuantity: productData.inventoryQuantity,
        inventoryPolicy: productData.continueSelling ? 'CONTINUE' : 'DENY',
        trackInventory: productData.trackInventory ? 'TRUE' : 'FALSE'
      }]
    };

    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      },
      data: {
        query: createProductMutation,
        variables: { input }
      }
    });

    const result = response.data.data.productCreate;
    
    if (result.userErrors.length > 0) {
      console.error(`Error creating product "${productData.title}":`, result.userErrors);
      return null;
    }

    const product = result.product;
    console.log(`✅ Created product: ${product.title} (ID: ${product.id})`);
    
    // Add images if provided
    if (productData.images.length > 0) {
      await addImagesToProduct(product.id, productData.images, productData.title);
    }

    return product;
  } catch (error) {
    console.error(`Error creating product "${productData.title}":`, error.response?.data || error.message);
    return null;
  }
}

// GraphQL mutation to add images to a product
const addImagesMutation = `
  mutation productImagesAdd($productId: ID!, $images: [ProductImageInput!]!) {
    productImagesAdd(productId: $productId, images: $images) {
      product {
        id
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function addImagesToProduct(productId, imageUrls, productTitle) {
  try {
    const images = imageUrls.map((url, index) => ({
      src: url,
      altText: `${productTitle} - Image ${index + 1}`
    }));

    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      },
      data: {
        query: addImagesMutation,
        variables: {
          productId: productId,
          images: images
        }
      }
    });

    const result = response.data.data.productImagesAdd;
    
    if (result.userErrors.length > 0) {
      console.error(`Error adding images to "${productTitle}":`, result.userErrors);
    } else {
      console.log(`   Added ${images.length} image(s) to "${productTitle}"`);
    }
  } catch (error) {
    console.error(`Error adding images to "${productTitle}":`, error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Starting product seeding process...');
  console.log(`📦 Target store: ${STORE_DOMAIN}`);
  console.log(`📝 Creating ${products.length} products with edge cases:\n`);

  let successCount = 0;
  let failCount = 0;

  for (const product of products) {
    const result = await createProduct(product);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Product seeding complete!`);
  console.log(`✅ Successfully created: ${successCount} products`);
  console.log(`❌ Failed: ${failCount} products`);
  console.log('='.repeat(50));

  console.log('\n📋 Edge cases included:');
  console.log('   1. Product #3: SOLD OUT (0 inventory, continue selling disabled)');
  console.log('   2. Product #4: NO MEDIA (no images uploaded)');
  console.log('   3. Product #5: LONG TITLE (200+ word title for CSS testing)');
}

main().catch(console.error);