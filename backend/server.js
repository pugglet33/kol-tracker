/**
 * KOL Tracker Backend Server
 *
 * Simple Express server for managing tracked accounts
 */

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'accounts.json');

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (will persist to file)
let accounts = [];

// Load accounts from file on startup
async function loadAccounts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    accounts = JSON.parse(data);
    console.log(`Loaded ${accounts.length} accounts from storage`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No existing accounts file, starting fresh');
      accounts = [];
    } else {
      console.error('Error loading accounts:', error);
    }
  }
}

// Save accounts to file
async function saveAccounts() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(accounts, null, 2));
    console.log(`Saved ${accounts.length} accounts to storage`);
  } catch (error) {
    console.error('Error saving accounts:', error);
  }
}

// Routes

/**
 * GET /api/accounts
 * Get all tracked accounts
 */
app.get('/api/accounts', (req, res) => {
  res.json({
    success: true,
    accounts: accounts,
  });
});

/**
 * POST /api/accounts
 * Add a new account to track
 *
 * Body: { username: string, category: 'kol' | 'angel' }
 */
app.post('/api/accounts', async (req, res) => {
  try {
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
      id: uuidv4(),
      username: username.replace(/^@/, ''), // Remove @ if present
      category,
      addedAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    await saveAccounts();

    res.status(201).json({
      success: true,
      account: newAccount,
    });
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * DELETE /api/accounts/:id
 * Remove an account from tracking
 */
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const index = accounts.findIndex(acc => acc.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    accounts.splice(index, 1);
    await saveAccounts();

    res.json({
      success: true,
      message: 'Account removed',
    });
  } catch (error) {
    console.error('Error removing account:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    accounts: accounts.length,
  });
});

// Start server
async function start() {
  await loadAccounts();

  app.listen(PORT, () => {
    console.log(`🚀 KOL Tracker Backend running on http://localhost:${PORT}`);
    console.log(`📊 Managing ${accounts.length} tracked accounts`);
  });
}

start();
