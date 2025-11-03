/**
 * Vercel Serverless Function for Account Management
 *
 * Handles GET, POST, and DELETE operations for tracked accounts
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Fetch all accounts
    if (req.method === 'GET') {
      const accounts = await kv.get('accounts') || [];
      return res.status(200).json({
        success: true,
        accounts,
      });
    }

    // POST - Add new account
    if (req.method === 'POST') {
      const { username, category } = req.body;

      // Validation
      if (!username || !category) {
        return res.status(400).json({
          success: false,
          message: 'Username and category are required',
        });
      }

      if (!['kol', 'angel'].includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Category must be either "kol" or "angel"',
        });
      }

      // Get existing accounts
      const accounts = await kv.get('accounts') || [];

      // Check for duplicates
      const exists = accounts.find(
        acc => acc.username.toLowerCase() === username.toLowerCase() && acc.category === category
      );

      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'Account already exists in this category',
        });
      }

      // Create new account
      const newAccount = {
        id: crypto.randomUUID(),
        username: username.replace(/^@/, ''),
        category,
        addedAt: new Date().toISOString(),
      };

      // Add and save
      accounts.push(newAccount);
      await kv.set('accounts', accounts);

      return res.status(201).json({
        success: true,
        account: newAccount,
      });
    }

    // DELETE - Remove account
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Account ID is required',
        });
      }

      const accounts = await kv.get('accounts') || [];
      const index = accounts.findIndex(acc => acc.id === id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Account not found',
        });
      }

      accounts.splice(index, 1);
      await kv.set('accounts', accounts);

      return res.status(200).json({
        success: true,
        message: 'Account removed',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Configure CORS
export const config = {
  api: {
    bodyParser: true,
  },
};
