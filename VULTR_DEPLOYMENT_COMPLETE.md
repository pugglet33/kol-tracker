# ✅ Vultr Server Deployment - COMPLETE

## Server Information

**Server IP:** `155.138.165.12`
**OS:** Ubuntu 22.04 LTS
**Stack:** Node.js 18 + Express + PM2 + Nginx

---

## What Was Set Up

### ✅ 1. Backend Server (Node.js + Express)
- **Location:** `/opt/kol-tracker/`
- **Process Manager:** PM2 (auto-starts on reboot)
- **Port:** 3001 (internal)
- **Status:** Running

### ✅ 2. Nginx Reverse Proxy
- **Port:** 80 (external)
- **Config:** `/etc/nginx/sites-available/kol-tracker`
- **Features:**
  - Proxies `/api/*` to backend on port 3001
  - CORS headers enabled
  - Handles OPTIONS requests

### ✅ 3. Firewall (UFW)
- SSH (port 22): ✅ Open
- HTTP (port 80): ✅ Open
- HTTPS (port 443): ✅ Open (ready for SSL)

### ✅ 4. API Endpoints

All endpoints are now accessible at `http://155.138.165.12`

#### Account Management:
```bash
# Get all accounts
GET http://155.138.165.12/api/accounts

# Add account
POST http://155.138.165.12/api/accounts
Body: {"username": "rad1bad1", "category": "kol"}

# Remove account
DELETE http://155.138.165.12/api/accounts?id=ACCOUNT_ID
```

#### MysticSocial Proxy (CORS-free):
```bash
# Query users
GET http://155.138.165.12/api/mysticsocial/mana?search=rad1bad1&limit=100
```

---

## Frontend Configuration

The frontend has been updated to use the Vultr server:

**File:** `.env`
```bash
VITE_API_BASE_URL=https://mysticsocial.xyz
VITE_BACKEND_URL=http://155.138.165.12
```

**File:** `src/api/mysticsocial.ts`
- Now routes ALL requests through the backend server
- No more CORS issues!
- No more Netlify function complexity!

---

## How to Deploy Frontend to Netlify

1. **Commit and push changes:**
```bash
cd /home/ug/kol-tracker/kol-tracker
git add .
git commit -m "Switch to Vultr backend server"
git push origin main
```

2. **Update Netlify environment variable:**
   - Go to Netlify Dashboard → Site settings → Environment variables
   - Set `VITE_BACKEND_URL` = `http://155.138.165.12`
   - Trigger new deployment

3. **That's it!** Your app will now use the Vultr server for all API calls.

---

## Server Management Commands

### Check Backend Status
```bash
ssh root@155.138.165.12
pm2 list
pm2 logs kol-backend
```

### Restart Backend
```bash
ssh root@155.138.165.12
pm2 restart kol-backend
```

### Update Backend Code
```bash
# On your local machine
cd /home/ug/kol-tracker/kol-tracker/backend
# Make changes to server.js

# Copy to server
scp server.js root@155.138.165.12:/opt/kol-tracker/
ssh root@155.138.165.12 "cd /opt/kol-tracker && pm2 restart kol-backend"
```

### View Logs
```bash
ssh root@155.138.165.12
pm2 logs kol-backend --lines 100
```

### Check Nginx Status
```bash
ssh root@155.138.165.12
systemctl status nginx
nginx -t  # Test config
systemctl restart nginx
```

---

## API Test Results

✅ **Backend Accounts API:**
```json
{"success":true,"accounts":[...]}
```

✅ **MysticSocial Proxy:**
```json
{
  "success": true,
  "data": {
    "authors": [{
      "authorName": "RAD1BAD1",
      "totalPosts": 82,
      "totalMana": 33141.8,
      "rank": 1
    }]
  }
}
```

---

## Benefits Over Serverless

### Before (Netlify Functions):
- ❌ CORS proxy complexity
- ❌ Function format constraints
- ❌ In-memory storage (resets on deploy)
- ❌ Cold starts
- ❌ Path/naming constraints
- ❌ Limited debugging

### Now (Vultr Server):
- ✅ **Simple Express routes**
- ✅ **No CORS issues** (handled by backend)
- ✅ **Persistent SQLite database** (ready to add)
- ✅ **Always responsive** (no cold starts)
- ✅ **Clean routing** (no file naming rules)
- ✅ **Easy debugging** (PM2 logs)
- ✅ **Full control**

---

## Cost Comparison

**Previous (Netlify Serverless):**
- Free tier with limitations
- $19+/month for Pro features
- No persistent storage

**Now (Vultr Server):**
- **$6/month** for VPS
- Full control
- Can add database, cron jobs, etc.
- Scalable

---

## Next Steps (Optional Improvements)

### 1. Add SSL Certificate (Let's Encrypt)
```bash
ssh root@155.138.165.12
apt-get install -y certbot python3-certbot-nginx

# If you have a domain name:
certbot --nginx -d yourdomain.com

# This will:
# - Get SSL certificate
# - Configure Nginx for HTTPS
# - Auto-renew certificate
```

### 2. Add Database (SQLite or PostgreSQL)
```bash
ssh root@155.138.165.12
cd /opt/kol-tracker
npm install better-sqlite3

# Update server.js to use SQLite instead of JSON file
```

### 3. Set Up Domain Name
- Point your domain to `155.138.165.12`
- Update Nginx config with domain name
- Get SSL certificate (step 1)

### 4. Add Monitoring
```bash
npm install -g pm2
pm2 install pm2-logrotate
```

---

## Troubleshooting

### Backend not responding:
```bash
ssh root@155.138.165.12
pm2 list  # Check if running
pm2 restart kol-backend
pm2 logs kol-backend  # Check for errors
```

### Nginx issues:
```bash
ssh root@155.138.165.12
nginx -t  # Test config
systemctl status nginx
systemctl restart nginx
```

### Firewall blocking:
```bash
ssh root@155.138.165.12
ufw status
ufw allow 80/tcp
```

### Can't SSH:
- Make sure you're using the correct password: `W,2ok!724QBcMS]?`
- Check if port 22 is open in Vultr dashboard

---

## File Locations on Server

```
/opt/kol-tracker/              # Backend application
├── server.js                  # Express server
├── accounts.json              # Data storage
├── package.json
└── node_modules/

/etc/nginx/sites-available/    # Nginx config
└── kol-tracker

/root/.pm2/                    # PM2 data
└── logs/                      # Application logs
```

---

## Summary

🎉 **Your KOL Tracker is now running on a proper server!**

- **Backend:** http://155.138.165.12
- **API Endpoints:** Working ✅
- **No CORS issues:** Fixed ✅
- **Persistent storage:** Ready ✅
- **Auto-starts on reboot:** Configured ✅

**Next:** Deploy your frontend to Netlify with the updated `.env` and you're done!

---

## Questions?

- Server logs: `ssh root@155.138.165.12 "pm2 logs kol-backend"`
- Server status: `ssh root@155.138.165.12 "pm2 list"`
- Test API: `curl http://155.138.165.12/api/accounts`

**Much simpler than serverless, right? 😊**
