const crypto = require('crypto');
const Papa = require('papaparse');
const fs = require('fs');
function convertObjects(inputObjects) {
  const convertedObjects = [];

  for (const inputObject of inputObjects) {
    const convertedObject = convertObject(inputObject);
    convertedObjects.push(convertedObject);
  }

  return convertedObjects;
}
function convertObject(inputObject) {
  const convertedObject = {
    id: generateUUID(),
    title: inputObject.name,
    slug: inputObject.name.toLowerCase().replace(/\s+/g, '-'),
    description: inputObject.description,
    price: inputObject.price,
    categoryId:
      inputObject.category === 'Vegetables'
        ? 'd0898fc2-7a84-4144-a879-3eed21acb125'
        : '095cf69d-1d53-4974-ba7b-b64a09f5da04',
    stock: getRandomInt(1, 100),
    unit: inputObject.unit,
    sell: Number(0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productImages: JSON.stringify([
      {
        url: {
          public_id: inputObject.image,
          secure_url: inputObject.image,
        },
      },
    ]),
    // productTags: Array.isArray(inputObject.tags)
    //   ? JSON.stringify(inputObject.tags)
    //   : '',
    productTags: inputObject.tags,

    discount: inputObject.discount, // Use discount from inputObject
    afterDiscountPrice: roundToTwoDecimals(
      calculateAfterDiscountPrice(inputObject.price, inputObject.discount)
    ),
    orderId: null,
    vat: 10,
  };

  // Additional optional properties:
  // convertedObject.color = inputObject.color;
  // convertedObject.rating = inputObject.rating;
  // convertedObject.stockAvailability = inputObject.stockAvailability;

  return convertedObject;
}

// Function to generate a random UUID (replace with your preferred method)
function generateUUID() {
  return crypto.randomUUID().toString();
}

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to calculate afterDiscountPrice
function calculateAfterDiscountPrice(price, discount) {
  return price - price * discount;
}
// Function to round a number to two decimal places
function roundToTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}

const productDataArray = [
  {
    name: 'Organic Broccoli',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Fresh and organic broccoli, packed with nutrients.',
    price: 2.99,
    discount: 0.2,
    rating: 4.5,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['organic', 'fresh', 'healthy'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Ripe Tomatoes',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Juicy and ripe tomatoes, perfect for salads or cooking.',
    price: 1.49,
    discount: 0.1,
    rating: 4.2,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['ripe', 'fresh', 'salad'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Sweet Potatoes',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Nutrient-rich sweet potatoes, great for roasting or mashing.',
    price: 3.99,
    discount: 0.15,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['sweet', 'nutrient-rich'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Crisp Apples',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Crisp and refreshing apples, perfect for snacking.',
    price: 1.99,
    discount: 0.05,
    rating: 4.3,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['crisp', 'refreshing', 'snack'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Fresh Spinach',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Tender and fresh spinach, ideal for salads or cooking.',
    price: 2.49,
    discount: 0.1,
    rating: 4.4,
    unit: 'per bunch',
    category: 'Vegetables',
    tags: ['fresh', 'tender', 'healthy'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Yellow Bell Peppers',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sweet and colorful yellow bell peppers, great for cooking.',
    price: 1.79,
    discount: 0.08,
    rating: 4.1,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['sweet', 'colorful', 'cooking'],
    color: 'Yellow',
    stockAvailability: true,
  },
  {
    name: 'Bananas',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Ripe and energy-packed bananas, perfect for a quick snack.',
    price: 0.99,
    discount: 0.03,
    rating: 4.6,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['ripe', 'energy', 'snack'],
    color: 'Yellow',
    stockAvailability: true,
  },
  {
    name: 'Carrots',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Crunchy and nutritious carrots, ideal for snacks or cooking.',
    price: 1.29,
    discount: 0.06,
    rating: 4.2,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['crunchy', 'nutritious', 'snack'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Juicy Oranges',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sweet and juicy oranges, a refreshing citrus delight.',
    price: 2.19,
    discount: 0.12,
    rating: 4.3,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['sweet', 'juicy', 'refreshing'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Cucumbers',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Cool and crisp cucumbers, perfect for salads or snacks.',
    price: 1.39,
    discount: 0.07,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['cool', 'crisp', 'snack'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Red Grapes',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sweet and flavorful red grapes, a healthy snack option.',
    price: 3.49,
    discount: 0.18,
    rating: 4.5,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['sweet', 'flavorful', 'snack'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Avocados',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Creamy and nutritious avocados, perfect for salads or guacamole.',
    price: 2.99,
    discount: 0.15,
    rating: 4.4,
    unit: 'per piece',
    category: 'Vegetables',
    tags: ['creamy', 'nutritious', 'salad'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Lemons',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Zesty and tangy lemons, great for cooking and beverages.',
    price: 1.89,
    discount: 0.09,
    rating: 4.2,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['zesty', 'tangy', 'cooking'],
    color: 'Yellow',
    stockAvailability: true,
  },
  {
    name: 'Red Onions',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Flavorful and aromatic red onions, ideal for cooking.',
    price: 1.69,
    discount: 0.08,
    rating: 4.1,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['flavorful', 'aromatic', 'cooking'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Pineapples',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Sweet and tropical pineapples, a delightful addition to desserts.',
    price: 4.99,
    discount: 0.2,
    rating: 4.6,
    unit: 'per piece',
    category: 'Fruits',
    tags: ['sweet', 'tropical', 'dessert'],
    color: 'Yellow',
    stockAvailability: true,
  },
  {
    name: 'Bell Peppers Mix',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'A mix of colorful bell peppers, perfect for stir-fries and salads.',
    price: 2.29,
    discount: 0.1,
    rating: 4.3,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['colorful', 'stir-fry', 'salad'],
    color: 'Various',
    stockAvailability: true,
  },
  {
    name: 'Strawberries',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Juicy and sweet strawberries, a classic favorite for snacks and desserts.',
    price: 3.79,
    discount: 0.15,
    rating: 4.5,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['juicy', 'sweet', 'snack'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Green Beans',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Crunchy green beans, versatile for various cooking styles.',
    price: 2.09,
    discount: 0.12,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['crunchy', 'versatile', 'cooking'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Mangoes',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sweet and tropical mangoes, a delightful summer treat.',
    price: 3.49,
    discount: 0.18,
    rating: 4.4,
    unit: 'per piece',
    category: 'Fruits',
    tags: ['sweet', 'tropical', 'summer'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Cherry Tomatoes',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Tiny and flavorful cherry tomatoes, perfect for salads.',
    price: 1.99,
    discount: 0.1,
    rating: 4.2,
    unit: 'per pint',
    category: 'Vegetables',
    tags: ['flavorful', 'salad', 'small'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Peaches',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Juicy and sweet peaches, a summertime delight.',
    price: 2.89,
    discount: 0.14,
    rating: 4.3,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['juicy', 'sweet', 'summer'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Asparagus',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Tender asparagus, a versatile and healthy addition to meals.',
    price: 3.29,
    discount: 0.16,
    rating: 4.1,
    unit: 'per bunch',
    category: 'Vegetables',
    tags: ['tender', 'versatile', 'healthy'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Blueberries',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Sweet and antioxidant-rich blueberries, perfect for snacks or desserts.',
    price: 4.49,
    discount: 0.2,
    rating: 4.5,
    unit: 'per pint',
    category: 'Fruits',
    tags: ['sweet', 'antioxidant', 'snack'],
    color: 'Blue',
    stockAvailability: true,
  },
  {
    name: 'Zucchinis',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Versatile zucchinis, great for grilling, sautéing, or baking.',
    price: 1.79,
    discount: 0.09,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['versatile', 'grilling', 'baking'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Blackberries',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Sweet and juicy blackberries, a flavorful addition to your diet.',
    price: 3.99,
    discount: 0.18,
    rating: 4.4,
    unit: 'per pint',
    category: 'Fruits',
    tags: ['sweet', 'juicy', 'flavorful'],
    color: 'Black',
    stockAvailability: true,
  },
  {
    name: 'Cabbage',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Fresh and crisp cabbage, perfect for salads or coleslaw.',
    price: 1.69,
    discount: 0.08,
    rating: 4.2,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['fresh', 'crisp', 'salad'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Organic Broccoli',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Fresh and organic broccoli, packed with nutrients.',
    price: 2.99,
    discount: 0.2,
    rating: 4.5,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['organic', 'fresh', 'healthy'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Ripe Tomatoes',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Juicy and ripe tomatoes, perfect for salads or cooking.',
    price: 1.49,
    discount: 0.1,
    rating: 4.2,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['ripe', 'fresh', 'salad'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Sweet Potatoes',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Nutrient-rich sweet potatoes, great for roasting or mashing.',
    price: 3.99,
    discount: 0.15,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['sweet', 'nutrient-rich'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Crisp Apples',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Crisp and refreshing apples, perfect for snacking.',
    price: 1.99,
    discount: 0.05,
    rating: 4.3,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['crisp', 'refreshing', 'snack'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Fresh Spinach',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Leafy and nutritious spinach, ideal for salads or cooking.',
    price: 2.49,
    discount: 0.12,
    rating: 4.4,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['fresh', 'nutritious', 'leafy'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Bananas',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sweet and energizing bananas, a quick and healthy snack.',
    price: 0.99,
    discount: 0.08,
    rating: 4.1,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['sweet', 'energizing', 'snack'],
    color: 'Yellow',
    stockAvailability: true,
  },
  {
    name: 'Carrots',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Crunchy and vibrant carrots, perfect for snacking or cooking.',
    price: 1.79,
    discount: 0.09,
    rating: 4.2,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['crunchy', 'vibrant', 'snack'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Gala Apples',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sweet and flavorful Gala apples, great for desserts.',
    price: 2.29,
    discount: 0.1,
    rating: 4.3,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['sweet', 'flavorful', 'dessert'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Avocados',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Creamy and nutritious avocados, perfect for guacamole.',
    price: 3.49,
    discount: 0.15,
    rating: 4.5,
    unit: 'per piece',
    category: 'Fruits',
    tags: ['creamy', 'nutritious', 'guacamole'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Cucumbers',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Cool and refreshing cucumbers, great for salads.',
    price: 1.29,
    discount: 0.07,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['cool', 'refreshing', 'salad'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Oranges',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Juicy and vitamin-packed oranges, a healthy citrus snack.',
    price: 2.19,
    discount: 0.1,
    rating: 4.2,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['juicy', 'vitamin-packed', 'citrus'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Bell Peppers',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Colorful bell peppers, great for cooking or snacking.',
    price: 2.99,
    discount: 0.12,
    rating: 4.4,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['colorful', 'cooking', 'snack'],
    color: 'Various',
    stockAvailability: true,
  },
  {
    name: 'Pineapples',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description:
      'Sweet and tropical pineapples, perfect for desserts or smoothies.',
    price: 4.99,
    discount: 0.2,
    rating: 4.6,
    unit: 'per piece',
    category: 'Fruits',
    tags: ['sweet', 'tropical', 'dessert'],
    color: 'Yellow',
    stockAvailability: true,
  },
  {
    name: 'Organic Broccoli',
    image:
      'https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Fresh and organic broccoli, packed with nutrients.',
    price: 2.99,
    discount: 0.2,
    rating: 4.5,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['organic', 'fresh', 'healthy'],
    color: 'Green',
    stockAvailability: true,
  },
  {
    name: 'Ripe Tomatoes',
    image:
      'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Juicy and ripe tomatoes, perfect for salads or cooking.',
    price: 1.49,
    discount: 0.1,
    rating: 4.2,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['ripe', 'fresh', 'salad'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Sweet Potatoes',
    image:
      'https://images.pexels.com/photos/2894651/pexels-photo-2894651.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Nutrient-rich sweet potatoes, great for roasting or mashing.',
    price: 3.99,
    discount: 0.15,
    rating: 4.0,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['sweet', 'nutrient-rich'],
    color: 'Orange',
    stockAvailability: true,
  },
  {
    name: 'Crisp Apples',
    image:
      'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Crisp and refreshing apples, perfect for snacking.',
    price: 1.99,
    discount: 0.05,
    rating: 4.3,
    unit: 'per pound',
    category: 'Fruits',
    tags: ['crisp', 'refreshing', 'snack'],
    color: 'Red',
    stockAvailability: true,
  },
  {
    name: 'Fresh Carrots',
    image:
      'https://images.pexels.com/photos/5505466/pexels-photo-5505466.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Crunchy and fresh carrots, ideal for salads or snacks.',
    price: 1.29,
    discount: 0.08,
    rating: 4.1,
    unit: 'per pound',
    category: 'Vegetables',
    tags: ['fresh', 'crunchy', 'snack'],
    color: 'Orange',
    stockAvailability: true,
  },
];

// Remove duplicates based on product names
const uniqueProductMap = new Map();

productDataArray.forEach(product => {
  const productName = product.name;

  if (!uniqueProductMap.has(productName)) {
    // Store the product in the map using the name as the key
    uniqueProductMap.set(productName, product);
  } else {
    console.error(`Duplicate product name found: ${productName}`);
    // You can choose to handle duplicates in any way you prefer, like skipping or merging them.
  }
});

// Convert the values of the map (unique products) back to an array
const uniqueProductDataArray = Array.from(uniqueProductMap.values());

// Now use uniqueProductDataArray for further processing
const convertedObjects = convertObjects(uniqueProductDataArray);

console.log(convertedObjects);
// console.log(convertedObjects[0].productImages);
// Convert the array of objects to CSV format
// Convert the array of objects to CSV format
const csvData = Papa.unparse(convertedObjects);

// // Write the CSV data to a file
const fileName = 'converted_products.csv';
fs.writeFileSync(fileName, csvData);

console.log(`CSV file "${fileName}" has been generated successfully.`);
// convertedObjects.forEach(product => {
//   const productImagesJSON = JSON.stringify([
//     { url: product.productImages.url },
//   ]); // Wrap it in an array
//   console.log('Product Images:', productImagesJSON);
//   // Now, you can use productImagesJSON to insert into your database
// });
