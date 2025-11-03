/**
 * Netlify Function for Account Management
 *
 * Simple in-memory storage (temporary until we set up proper database)
 * NOTE: Data will reset on each deploy - use localStorage on client for persistence
 */

// Temporary in-memory storage
let accounts = [];

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // GET - Fetch all accounts
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          accounts,
        })
      };
    }

    // POST - Add new account
    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid JSON in request body',
          })
        };
      }

      const { username, category } = body;

      // Validation
      if (!username || !category) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Username and category are required',
          })
        };
      }

      if (!['kol', 'angel'].includes(category)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Category must be either "kol" or "angel"',
          })
        };
      }

      // Check for duplicates
      const exists = accounts.find(
        acc => acc.username.toLowerCase() === username.toLowerCase() && acc.category === category
      );

      if (exists) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Account already exists in this category',
          })
        };
      }

      // Create new account
      const newAccount = {
        id: crypto.randomUUID(),
        username: username.replace(/^@/, ''),
        category,
        addedAt: new Date().toISOString(),
      };

      // Add to storage
      accounts.push(newAccount);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          account: newAccount,
        })
      };
    }

    // DELETE - Remove account
    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Account ID is required',
          })
        };
      }

      const index = accounts.findIndex(acc => acc.id === id);

      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Account not found',
          })
        };
      }

      accounts.splice(index, 1);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Account removed',
        })
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed',
      })
    };

  } catch (error) {
    console.error('API Error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      })
    };
  }
};
