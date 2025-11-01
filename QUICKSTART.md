# Quick Start Guide

## Get Started in 3 Steps

### 1. Start the Backend

Open a terminal and run:

```bash
cd backend
npm install  # Only needed first time
npm run dev
```

You should see:
```
🚀 KOL Tracker Backend running on http://localhost:3001
📊 Managing 0 tracked accounts
```

### 2. Start the Frontend

Open a **new terminal** and run:

```bash
npm install  # Only needed first time
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 3. Open the App

Open your browser and go to: **http://localhost:5173**

## Test the Application

### Add a Test Account

1. In the "Add Account" form, enter a Twitter username that's tracked by MysticSocial
2. Select "KOL" or "Angel" category
3. Click "Add Account"

**Example accounts to try** (if they're in the MysticSocial system):
- elonmusk
- vitalikbuterin
- Or any account that appears on mysticsocial.xyz

### View the Stats

Once added, you'll see:
- Total tweets tracked
- Mana score
- Rank in the leaderboard

### Test Auto-Refresh

- The page automatically refreshes every 30 seconds
- Or click the "Refresh" button for manual update
- Toggle "Auto-refresh" checkbox to enable/disable

### Remove an Account

Click the "Remove" button on any account card

## Troubleshooting

### Backend not starting?
- Make sure port 3001 is available
- Check you're in the `backend` directory
- Run `npm install` again

### Frontend not starting?
- Make sure port 5173 is available
- Check you're in the `kol-tracker` directory (not backend)
- Run `npm install` again

### "No tracked tweets found" error?
- The username might not be tracked by MysticSocial yet
- Try a different username
- Check mysticsocial.xyz to see which accounts are tracked

### Backend connection error?
- Make sure the backend is running on port 3001
- Check the `.env` file has `VITE_BACKEND_URL=http://localhost:3001`

## Next Steps

- Add more accounts to track
- Explore the different metrics displayed
- Try adding accounts to both KOL and Angel categories
- Watch the auto-refresh in action

## Development Tips

### Hot Module Replacement (HMR)
Both servers support hot reload - changes to code will automatically update without restarting

### View Backend Data
Check `backend/accounts.json` to see the persisted account data

### API Testing
Test the backend API directly:
```bash
# Get all accounts
curl http://localhost:3001/api/accounts

# Health check
curl http://localhost:3001/health
```

## Production Deployment

See [README.md](README.md#deployment) for deployment instructions to Vercel or other platforms.
