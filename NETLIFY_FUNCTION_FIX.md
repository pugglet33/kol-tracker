# Netlify Function Format Fix

## Issue: 500 Internal Server Error on /api/accounts

**Error:** POST to `/api/accounts` returned 500 Internal Server Error

**Root Cause:** Netlify functions were using the new ES Module format (`export default`) instead of the traditional CommonJS format (`exports.handler`).

## Fix Applied ✅

Converted both Netlify functions to use the standard CommonJS format:

### 1. accounts.js

**Before (ES Module format):**
```javascript
export default async (req) => {
  // ...
  return new Response(JSON.stringify(data), { status: 200, headers });
};

export const config = {
  path: "/api/accounts"
};
```

**After (CommonJS format):**
```javascript
exports.handler = async (event, context) => {
  // ...
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data)
  };
};
```

### 2. mysticsocial-proxy.js

**Before (ES Module format):**
```javascript
export default async (req) => {
  const url = new URL(req.url);
  const page = url.searchParams.get('page');
  // ...
};
```

**After (CommonJS format):**
```javascript
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const page = params.page || '1';
  // ...
};
```

## Key Differences

### Request Object
- **ES Module:** `req` (Request object), `req.method`, `new URL(req.url)`
- **CommonJS:** `event` (Event object), `event.httpMethod`, `event.queryStringParameters`

### Response Format
- **ES Module:** Returns `new Response(body, { status, headers })`
- **CommonJS:** Returns `{ statusCode, headers, body }`

### Request Body
- **ES Module:** `await req.json()` or `await req.text()`
- **CommonJS:** `JSON.parse(event.body)`

### Query Parameters
- **ES Module:** `new URL(req.url).searchParams.get('param')`
- **CommonJS:** `event.queryStringParameters.param`

## Files Changed

1. ✅ [netlify/functions/accounts.js](file:///home/ug/kol-tracker/kol-tracker/netlify/functions/accounts.js) - Converted to CommonJS
2. ✅ [netlify/functions/mysticsocial-proxy.js](file:///home/ug/kol-tracker/kol-tracker/netlify/functions/mysticsocial-proxy.js) - Converted to CommonJS

## Testing

After deploying, test:

1. **Add Account:**
   ```bash
   curl -X POST https://kol-tracker.netlify.app/api/accounts \
     -H "Content-Type: application/json" \
     -d '{"username":"rad1bad1","category":"kol"}'
   ```
   Expected: Status 201, returns account object

2. **Get Accounts:**
   ```bash
   curl https://kol-tracker.netlify.app/api/accounts
   ```
   Expected: Status 200, returns accounts array

3. **Proxy Function:**
   ```bash
   curl https://kol-tracker.netlify.app/api/mysticsocial/mana?search=rad1bad1&limit=100
   ```
   Expected: Status 200, returns MysticSocial API data

## Why This Matters

Netlify officially supports both formats, but:
- CommonJS (`exports.handler`) is the **traditional and well-documented** format
- ES Modules are newer and require specific configuration
- CommonJS has better compatibility and is more reliable

## Deploy to Fix

```bash
cd /home/ug/kol-tracker/kol-tracker
git add .
git commit -m "Fix Netlify functions: convert to CommonJS format"
git push origin main
```

This will fix:
- ✅ 500 error when adding accounts
- ✅ Account management functionality
- ✅ MysticSocial API proxy (CORS fix)

---

**Status:** ✅ Ready to deploy
**Priority:** Critical - app won't work without this
