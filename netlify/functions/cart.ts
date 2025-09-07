import { Handler } from '@netlify/functions';

// Mock cart storage (in a real app, you'd use a database)
let mockCarts: Record<string, any> = {};

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
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
    // Get user ID from auth token (mock implementation)
    const authorization = event.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
    
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }
    
    // Mock user ID
    const userId = 'user-1';
    
    if (event.httpMethod === 'GET') {
      // Get cart for user
      const cart = mockCarts[userId] || { userId, items: [], updatedAt: Date.now() };
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      };
    }
    
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      
      // Check if this is a merge operation
      if (event.path.includes('/merge')) {
        const { items } = body;
        mockCarts[userId] = {
          userId,
          items: items || [],
          updatedAt: Date.now()
        };
        
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockCarts[userId]),
        };
      }
      
      // Add item to cart
      const { itemId, quantity = 1 } = body;
      
      if (!itemId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing itemId' }),
        };
      }
      
      if (!mockCarts[userId]) {
        mockCarts[userId] = { userId, items: [], updatedAt: Date.now() };
      }
      
      const cart = mockCarts[userId];
      const existingItem = cart.items.find((item: any) => item.itemId === itemId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ itemId, quantity });
      }
      
      cart.updatedAt = Date.now();
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      };
    }
    
    if (event.httpMethod === 'PATCH') {
      // Update cart item quantity
      const pathParts = event.path.split('/');
      const itemId = pathParts[pathParts.length - 1];
      const body = JSON.parse(event.body || '{}');
      const { quantity } = body;
      
      if (!mockCarts[userId]) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Cart not found' }),
        };
      }
      
      const cart = mockCarts[userId];
      const item = cart.items.find((item: any) => item.itemId === itemId);
      
      if (!item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Item not found in cart' }),
        };
      }
      
      if (quantity <= 0) {
        cart.items = cart.items.filter((item: any) => item.itemId !== itemId);
      } else {
        item.quantity = quantity;
      }
      
      cart.updatedAt = Date.now();
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      };
    }
    
    if (event.httpMethod === 'DELETE') {
      // Remove item from cart
      const pathParts = event.path.split('/');
      const itemId = pathParts[pathParts.length - 1];
      
      if (!mockCarts[userId]) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Cart not found' }),
        };
      }
      
      const cart = mockCarts[userId];
      cart.items = cart.items.filter((item: any) => item.itemId !== itemId);
      cart.updatedAt = Date.now();
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
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