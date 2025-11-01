# Deployment Guide

## Vercel Deployment

This project is configured for deployment on Vercel with serverless functions.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`
3. **GitHub Account**: For connecting your repository

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub

```bash
# If not already done, create a GitHub repo and push:
git add .
git commit -m "Initial commit: KOL Tracker application"
git remote add origin https://github.com/YOUR_USERNAME/kol-tracker.git
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `kol-tracker` repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Step 3: Set Environment Variables

In the Vercel dashboard, add these environment variables:

- `VITE_API_BASE_URL` = `https://mysticsocial.xyz`
- `VITE_BACKEND_URL` = `https://your-project.vercel.app` (your Vercel URL)

#### Step 4: Enable Vercel KV Storage

1. Go to your project dashboard
2. Click on "Storage" tab
3. Create a new KV database
4. Connect it to your project
5. The `KV_REST_API_URL` and `KV_REST_API_TOKEN` will be automatically added

#### Step 5: Deploy

Click "Deploy" - Vercel will build and deploy your application!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - What's your project's name? kol-tracker
# - In which directory is your code located? ./
# - Want to override the settings? N

# Set environment variables
vercel env add VITE_API_BASE_URL production
# Enter: https://mysticsocial.xyz

vercel env add VITE_BACKEND_URL production
# Enter: https://your-project.vercel.app

# Deploy to production
vercel --prod
```

### Post-Deployment Steps

1. **Update Backend URL**: After first deployment, update `VITE_BACKEND_URL` with your actual Vercel URL
2. **Redeploy**: Trigger a new deployment for the env variable to take effect
3. **Test**: Open your Vercel URL and test adding/removing accounts

### Vercel KV Storage

The serverless backend uses Vercel KV (Redis) for data persistence instead of JSON files.

**Setup KV Storage:**
1. In Vercel dashboard → Your Project → Storage
2. Create KV Database
3. Connect to your project
4. Environment variables are auto-configured

### API Endpoints

After deployment, your API will be available at:
- `GET https://your-project.vercel.app/api/accounts`
- `POST https://your-project.vercel.app/api/accounts`
- `DELETE https://your-project.vercel.app/api/accounts?id={id}`

### Troubleshooting

#### Backend Connection Errors
- Ensure `VITE_BACKEND_URL` matches your Vercel deployment URL
- Check Vercel function logs in dashboard

#### KV Storage Issues
- Verify KV database is connected in Vercel dashboard
- Check environment variables are set

#### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Try `npm run build` locally first

### Local Development with Production Backend

To test with the deployed backend locally:

```bash
# Update .env
VITE_BACKEND_URL=https://your-project.vercel.app

# Restart dev server
npm run dev
```

### Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: View function logs in Vercel dashboard
- **Performance**: Monitor in Vercel Speed Insights

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `VITE_BACKEND_URL` to use custom domain

## Alternative: Deploy Backend Separately

If you prefer to keep the Express backend:

### Option A: Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select the `backend` folder
4. Set environment variables
5. Deploy

### Option B: Render

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Deploy

Then update `VITE_BACKEND_URL` in Vercel to point to your backend URL.

## Production Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] Set up Vercel KV storage
- [ ] Deploy application
- [ ] Test account management
- [ ] Update backend URL after deployment
- [ ] Test API integration with mysticsocial.xyz
- [ ] Enable analytics (optional)
- [ ] Set up custom domain (optional)

## Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- View function logs in Vercel dashboard
- Review build logs for errors
