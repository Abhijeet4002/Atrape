import { Handler } from '@netlify/functions';

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
    // Extract the auth action from the path
    const pathParts = event.path.split('/');
    const action = pathParts[pathParts.length - 1]; // signup, login, or me
    
    if (event.httpMethod === 'POST' && action === 'signup') {
      const body = JSON.parse(event.body || '{}');
      const { name, email, password } = body;
      
      if (!name || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        };
      }
      
      // For demo purposes, just return a mock successful response
      return {
        statusCode: 201,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'User created successfully',
          token: 'mock-jwt-token-signup'
        }),
      };
    }
    
    if (event.httpMethod === 'POST' && action === 'login') {
      const body = JSON.parse(event.body || '{}');
      const { email, password } = body;
      
      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing email or password' }),
        };
      }
      
      // For demo purposes, accept any email/password combination
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: 'mock-jwt-token-login',
          user: {
            id: 'user-1',
            name: 'Demo User',
            email: email,
            role: 'user'
          }
        }),
      };
    }
    
    if (event.httpMethod === 'GET' && action === 'me') {
      const authorization = event.headers.authorization || '';
      const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
      
      if (!token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
      
      // For demo purposes, return a mock user for any valid-looking token
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'user-1',
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'user'
        }),
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