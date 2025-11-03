# Netlify Deployment Guide

## 🚀 Deploy to Netlify in 5 Minutes

### Step 1: Push Latest Code to GitHub

Make sure all the latest changes are pushed:

```bash
git add .
git commit -m "Add Netlify configuration and functions"
git push origin main
```

### Step 2: Import to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your **pugglet33/kol-tracker** repository
5. Configure settings:
   - **Branch**: main
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

### Step 3: Configure Environment Variables

After the first deployment:

1. Go to **Site settings** → **Environment variables**
2. Add these variables:

**Variable 1:**
- Key: `VITE_API_BASE_URL`
- Value: `https://mysticsocial.xyz`

**Variable 2:**
- Key: `VITE_BACKEND_URL`
- Value: `https://YOUR-SITE-NAME.netlify.app` (your actual Netlify URL)

3. Click **"Save"**

### Step 4: Enable Netlify Blobs

Netlify Blobs (storage) is automatically enabled on all sites - no setup needed! ✅

### Step 5: Trigger Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 6: Test Your App

Once deployed, open your Netlify URL:
- You should see the KOL Tracker dashboard
- Try adding an account
- Try removing an account
- Test the auto-refresh

---

## ✅ What You Get with Netlify

- ✅ **Automatic deployments** on every git push
- ✅ **Built-in storage** with Netlify Blobs (no Redis setup needed!)
- ✅ **Serverless functions** that just work
- ✅ **Free HTTPS** and custom domains
- ✅ **Instant cache invalidation**
- ✅ **Deploy previews** for every PR

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Make sure `package.json` has all dependencies
- Try building locally: `npm run build`

### Functions Not Working
- Check Functions logs in Netlify dashboard
- Verify CORS headers are set
- Check function path is `/api/accounts`

### Environment Variables Not Applied
- After adding env vars, trigger a new deploy
- Use "Clear cache and deploy site"

---

## 🎯 Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions
4. Update `VITE_BACKEND_URL` to use your custom domain
5. Redeploy

---

## 📊 Monitoring

- **Analytics**: Enable in Site settings
- **Functions**: View logs in Functions tab
- **Build time**: Check Deploys tab

---

## 🔄 Updating Your Site

Just push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify automatically deploys! 🎉

---

## 💰 Pricing

- **Free tier includes:**
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  - Netlify Blobs storage (1GB free)

Perfect for this project! 🚀
