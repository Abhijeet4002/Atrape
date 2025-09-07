import { Handler } from '@netlify/functions';

// Mock data based on the existing items.json
const items = [
  {
    "id": "p1",
    "title": "Aurora Wireless Headphones",
    "description": "Premium over‑ear wireless headphones with noise cancellation and 30‑hour battery.",
    "price": 14900,
    "category": "Audio",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  },
  {
    "id": "p2",
    "title": "Nimbus Mechanical Keyboard",
    "description": "Hot‑swappable 75% mechanical keyboard with RGB and PBT keycaps.",
    "price": 9900,
    "category": "Peripherals",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    "createdAt": 1700000001000,
    "updatedAt": 1700000001000
  },
  {
    "id": "p3",
    "title": "Solaris Smartwatch",
    "description": "AMOLED display, GPS, heart‑rate and sleep tracking with 10‑day battery.",
    "price": 12900,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop",
    "createdAt": 1700000002000,
    "updatedAt": 1700000002000
  },
  {
    "id": "p4",
    "title": "Pulse Bluetooth Speaker",
    "description": "Portable IPX7 speaker with deep bass and 12‑hour playtime.",
    "price": 7900,
    "category": "Audio",
    "image": "https://images.unsplash.com/photo-1618384887924-3b70b1d54a88?q=80&w=1200&auto=format&fit=crop",
    "createdAt": 1700000003000,
    "updatedAt": 1700000003000
  },
  {
    "id": "p5",
    "title": "Flux USB‑C Hub",
    "description": "8‑in‑1 aluminum hub with HDMI 4K, PD 100W, USB‑A and SD card.",
    "price": 5900,
    "category": "Accessories",
    "image": "https://images.unsplash.com/photo-1593010351488-e4a54735a55a?q=80&w=1200&auto=format&fit=crop",
    "createdAt": 1700000004000,
    "updatedAt": 1700000004000
  }
];

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Parse query parameters
      const params = event.queryStringParameters || {};
      const { q, category, minPrice, maxPrice, sort } = params;
      
      let filteredItems = [...items];
      
      // Search filter
      if (q) {
        const searchTerm = q.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(searchTerm) || 
          item.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Category filter
      if (category) {
        const categories = category.split(',').map(c => c.trim().toLowerCase());
        filteredItems = filteredItems.filter(item => 
          categories.includes(item.category.toLowerCase())
        );
      }
      
      // Price filters
      if (minPrice) {
        filteredItems = filteredItems.filter(item => item.price >= Number(minPrice));
      }
      if (maxPrice) {
        filteredItems = filteredItems.filter(item => item.price <= Number(maxPrice));
      }
      
      // Sorting
      if (sort === 'price_asc') {
        filteredItems.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filteredItems.sort((a, b) => b.price - a.price);
      }
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: filteredItems }),
      };
    }
    
    // Handle individual item lookup by ID
    const pathParts = event.path.split('/');
    const itemId = pathParts[pathParts.length - 1];
    
    if (itemId && itemId !== 'items') {
      const item = items.find(i => i.id === itemId);
      if (!item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Item not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};