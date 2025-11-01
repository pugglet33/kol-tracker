# KOL Tracker

A web application for tracking Key Opinion Leaders (KOLs) and Angels on Twitter, displaying their engagement metrics from the MysticSocial tracking system.

## Features

- **Dual Category Tracking**: Separate lists for KOLs and Angels
- **Real-time Stats**: Display tracked tweet counts, mana scores, and rankings
- **Auto-refresh**: Automatic updates every 30 seconds (configurable)
- **Manual Refresh**: On-demand data refresh with visual feedback
- **Add/Remove Accounts**: Easy management of tracked Twitter accounts
- **Account Validation**: Verifies accounts exist in MysticSocial before adding
- **Last Updated Timestamp**: Shows when data was last refreshed

## Architecture

This project consists of two main components:

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: TailwindCSS
- **API Integration**: Custom API clients for MysticSocial and backend
- **Port**: 5173 (development)

### Backend (Express.js)
- **Framework**: Node.js + Express
- **Storage**: JSON file-based persistence
- **API**: RESTful endpoints for account management
- **Port**: 3001 (development)

## API Integration

The application integrates with two APIs:

1. **MysticSocial API** (mysticsocial.xyz)
   - Public API for fetching user stats and mana scores
   - Endpoints used:
     - `GET /api/mana` - Leaderboard data
     - `GET /api/posts` - Tweet data by author

2. **KOL Tracker Backend** (Local/Deployed)
   - Custom API for managing tracked accounts
   - Endpoints:
     - `GET /api/accounts` - Get all tracked accounts
     - `POST /api/accounts` - Add new account
     - `DELETE /api/accounts/:id` - Remove account

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3001`

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=https://mysticsocial.xyz
VITE_BACKEND_URL=http://localhost:3001
```

For production, update `VITE_BACKEND_URL` to your deployed backend URL.

## Development

### Project Structure

```
kol-tracker/
├── backend/                 # Express.js backend
│   ├── server.js           # Main server file
│   ├── accounts.json       # Persisted account data
│   └── package.json
├── src/
│   ├── api/                # API clients
│   │   ├── mysticsocial.ts # MysticSocial API client
│   │   └── backend.ts      # Backend API client
│   ├── components/         # React components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── AccountCard.tsx # Account display card
│   │   └── AddAccountForm.tsx # Add account form
│   ├── hooks/              # Custom React hooks
│   │   ├── useAccounts.ts  # Account management hook
│   │   └── useAutoRefresh.ts # Auto-refresh hook
│   ├── types/              # TypeScript types
│   │   └── account.ts      # Account type definitions
│   ├── config.ts           # Configuration
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
└── package.json
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start backend server
- `npm start` - Start backend (production)

## Usage

1. **Start both servers** (backend and frontend)
2. **Open the app** at `http://localhost:5173`
3. **Add accounts** using the form:
   - Enter Twitter username (without @)
   - Select category (KOL or Angel)
   - Click "Add Account"
4. **View stats** for each tracked account:
   - Total tweets tracked
   - Mana score
   - Rank
5. **Refresh data**:
   - Automatic refresh every 30 seconds
   - Manual refresh button
   - Toggle auto-refresh on/off
6. **Remove accounts** using the "Remove" button on each card

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `VITE_API_BASE_URL=https://mysticsocial.xyz`
   - `VITE_BACKEND_URL=<your-backend-url>`
4. Deploy

### Backend (Vercel Serverless)

The backend can be converted to Vercel serverless functions:

1. Create `api/` directory in root
2. Convert routes to serverless functions
3. Use Vercel KV or PostgreSQL for persistence
4. Deploy to Vercel

Alternatively, deploy the backend to:
- Railway
- Render
- Heroku
- Any Node.js hosting platform

## Error Handling

The application handles several error cases:

- **Account not found**: Shows "No tracked tweets found" message
- **Network errors**: Displays error banner at top of page
- **Duplicate accounts**: Prevents adding same account to same category
- **Backend unavailable**: Shows connection error message

## Future Enhancements

Phase 3 features (to be implemented):

- **Expanded metrics**: Full engagement breakdown (likes, retweets, etc.)
- **Tweet listing**: Display individual tweets per account
- **Pagination**: For accounts with many tweets
- **Search/Filter**: Search within tracked accounts
- **Export**: Download stats as CSV/JSON
- **Charts**: Visual representation of metrics over time

## API Reference

### Backend Endpoints

#### GET /api/accounts
Get all tracked accounts

**Response:**
```json
{
  "success": true,
  "accounts": [
    {
      "id": "uuid",
      "username": "example",
      "category": "kol",
      "addedAt": "2025-10-31T12:00:00.000Z"
    }
  ]
}
```

#### POST /api/accounts
Add new account

**Request:**
```json
{
  "username": "example",
  "category": "kol"
}
```

**Response:**
```json
{
  "success": true,
  "account": {
    "id": "uuid",
    "username": "example",
    "category": "kol",
    "addedAt": "2025-10-31T12:00:00.000Z"
  }
}
```

#### DELETE /api/accounts/:id
Remove account

**Response:**
```json
{
  "success": true,
  "message": "Account removed"
}
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, UUID
- **API Integration**: MysticSocial REST API
- **Deployment**: Vercel (planned)

## License

MIT

## Support

For issues or questions, please contact the development team.
