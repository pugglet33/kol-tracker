# Quick Vercel Setup Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub (github.com/new)
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/kol-tracker.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `kol-tracker` repository
4. Click "Import"

### Step 3: Configure Build Settings

Vercel should auto-detect these settings:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Just click "Deploy" without changing anything!

### Step 4: Set Up Storage

After first deployment:

1. Go to your project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "KV" (Redis)
5. Name it "kol-accounts"
6. Click "Create"
7. Click "Connect" to link it to your project

### Step 5: Configure Environment Variables

In your project settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | `https://mysticsocial.xyz` | Production |
| `VITE_BACKEND_URL` | `https://YOUR-PROJECT.vercel.app` | Production |

**Important**: Replace `YOUR-PROJECT.vercel.app` with your actual Vercel deployment URL!

### Step 6: Redeploy

1. Go to "Deployments" tab
2. Click the three dots on latest deployment
3. Click "Redeploy"
4. Confirm

Your app is now live! 🎉

## Testing Your Deployment

1. Open your Vercel URL: `https://YOUR-PROJECT.vercel.app`
2. Try adding a test account (e.g., "elonmusk" or any account on mysticsocial.xyz)
3. Verify the stats load correctly
4. Test the refresh functionality
5. Try removing an account

## Updating After Changes

```bash
# Make your changes, then:
git add .
git commit -m "Your commit message"
git push

# Vercel automatically deploys on push!
```

## Common Issues

### "Backend connection error"
- Check that `VITE_BACKEND_URL` matches your Vercel URL
- Redeploy after setting environment variables

### "Failed to fetch accounts"
- Make sure KV storage is connected
- Check function logs in Vercel dashboard

### "No tracked tweets found"
- The username doesn't exist on mysticsocial.xyz yet
- Try a different account

## Next Steps

- Set up a custom domain (optional)
- Enable Vercel Analytics
- Monitor function logs
- Add more accounts!

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel KV Docs: [vercel.com/docs/storage/vercel-kv](https://vercel.com/docs/storage/vercel-kv)
- Project README: [README.md](README.md)
- Full Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
