/**
 * Netlify Function for Account Management
 *
 * Simple in-memory storage (temporary until we set up proper database)
 * NOTE: Data will reset on each deploy - use localStorage on client for persistence
 */

// Temporary in-memory storage
let accounts = [];

export default async (req) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const url = new URL(req.url);

    // GET - Fetch all accounts
    if (req.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        accounts,
      }), { status: 200, headers });
    }

    // POST - Add new account
    if (req.method === 'POST') {
      const body = await req.json();
      const { username, category } = body;

      // Validation
      if (!username || !category) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Username and category are required',
        }), { status: 400, headers });
      }

      if (!['kol', 'angel'].includes(category)) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Category must be either "kol" or "angel"',
        }), { status: 400, headers });
      }

      // Check for duplicates
      const exists = accounts.find(
        acc => acc.username.toLowerCase() === username.toLowerCase() && acc.category === category
      );

      if (exists) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Account already exists in this category',
        }), { status: 409, headers });
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

      return new Response(JSON.stringify({
        success: true,
        account: newAccount,
      }), { status: 201, headers });
    }

    // DELETE - Remove account
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');

      if (!id) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Account ID is required',
        }), { status: 400, headers });
      }

      const index = accounts.findIndex(acc => acc.id === id);

      if (index === -1) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Account not found',
        }), { status: 404, headers });
      }

      accounts.splice(index, 1);

      return new Response(JSON.stringify({
        success: true,
        message: 'Account removed',
      }), { status: 200, headers });
    }

    // Method not allowed
    return new Response(JSON.stringify({
      success: false,
      message: 'Method not allowed',
    }), { status: 405, headers });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error',
      error: error.message,
    }), { status: 500, headers });
  }
};

export const config = {
  path: "/api/accounts"
};
