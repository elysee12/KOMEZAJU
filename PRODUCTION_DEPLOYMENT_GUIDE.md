# 🚀 KOMEZAJU PRODUCTION DEPLOYMENT GUIDE

## 🔴 URGENT: CORS Error Fix

Your website is experiencing CORS errors because the frontend is still trying to access `localhost:3000` instead of the production URL `https://komezaju.org/api`.

---

## 📊 CURRENT STATUS

### ✅ What's Already Configured

1. **Frontend Environment** (`frontend/.env`):
   ```env
   VITE_API_URL=https://komezaju.org/api
   ```

2. **Backend Environment** (`backend/.env`):
   ```env
   FRONTEND_URL="https://komezaju.org"
   BACKEND_URL="https://komezaju.org/api"
   ```

3. **Source Code**:
   - All API calls correctly use `API_URL` from `lib/api.ts`
   - No hardcoded `localhost` in source files
   - Centralized API configuration working correctly

### ❌ What's Wrong

The **dist/ folder** (deployed files) was built BEFORE the `.env` file was updated. It contains OLD compiled JavaScript with hardcoded `localhost:3000`.

**Why updating .env didn't fix it:**
- Vite replaces environment variables during BUILD TIME
- The compiled `dist/` files don't read `.env` at runtime
- They contain the actual values embedded in the JavaScript code

---

## 🛠️ COMPLETE FIX PROCEDURE

### Part 1: Frontend Rebuild

#### Step 1: Delete Old Build
```bash
cd frontend
rmdir /s /q dist
```

#### Step 2: Verify Environment Configuration
Check that `frontend/.env` contains:
```env
VITE_API_URL=https://komezaju.org/api
```

#### Step 3: Rebuild with Production URL
```bash
npm run build
```

#### Step 4: Verify Build Contains Correct URL
```bash
# Search for production URL in build files
findstr /s /i "komezaju.org/api" dist\*
```

✅ **Expected:** Multiple matches showing `komezaju.org/api`
❌ **Problem:** If you see `localhost:3000`, the build failed

### Part 2: Backend Configuration

#### Step 5: Verify Backend Environment
Check that `backend/.env` contains:
```env
FRONTEND_URL="https://komezaju.org"
BACKEND_URL="https://komezaju.org/api"
```

✅ **Already done** - Backend is configured correctly!

#### Step 6: Restart Backend Server
```bash
cd backend

# Stop current server (Ctrl+C in terminal)

# Restart in production mode
npm run start:prod

# OR if using PM2:
pm2 restart komezaju-backend
pm2 logs
```

The backend will now accept requests from `https://komezaju.org`.

### Part 3: Deploy to Production

#### Step 7: Upload New Frontend Build

1. Connect to your production server (FTP/SSH/cPanel)
2. Navigate to website root directory (usually `public_html` or `www`)
3. **Delete all old files** in the website directory
4. **Upload ALL files** from `frontend/dist/` to the website root
5. Verify file structure:
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── [images and other assets]
   └── [other files]
   ```

#### Step 8: Configure Web Server

**For Apache (.htaccess):**

The frontend already has `.htaccess` in `public/` folder that gets copied to `dist/`. Verify it exists:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**For Nginx:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify everything works:

### 1. Frontend Health Check

- [ ] Visit `https://komezaju.org` - loads correctly
- [ ] Homepage images load
- [ ] Navigation works
- [ ] Language switcher works
- [ ] No console errors in DevTools (F12 → Console)

### 2. API Connection Check

Open DevTools (F12) → **Network tab**, then:

- [ ] Contact form submission → See request to `komezaju.org/api/contact`
- [ ] Donate button → Modal opens without errors
- [ ] Login button → Modal opens without errors
- [ ] **NO requests** going to `localhost:3000`

### 3. Backend Health Check

Test API endpoints directly:

```bash
# Test CORS preflight
curl -X OPTIONS https://komezaju.org/api/contact \
  -H "Origin: https://komezaju.org" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test actual endpoint
curl -X GET https://komezaju.org/api/donations/stats \
  -H "Origin: https://komezaju.org" \
  -v
```

Expected response headers:
```
Access-Control-Allow-Origin: https://komezaju.org
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
```

### 4. Admin Dashboard Check

- [ ] Navigate to `https://komezaju.org/dashboard`
- [ ] Redirects to homepage (session check works)
- [ ] Login with admin credentials
- [ ] Dashboard loads with stats
- [ ] Can upload images
- [ ] Can view donations
- [ ] Can view messages

---

## 🐛 TROUBLESHOOTING

### Issue: Build still contains `localhost:3000`

**Diagnosis:**
```bash
cd frontend
findstr /s /i "localhost" dist\*
```

**Solutions:**
1. Delete `node_modules/.vite` cache:
   ```bash
   rmdir /s /q node_modules\.vite
   npm run build
   ```

2. Verify `.env` location (must be in `frontend/` root)

3. Check for typos in `.env` file name (must be exactly `.env`)

### Issue: CORS errors persist after rebuild

**Check 1: Browser Cache**
- Clear all browser cache (Ctrl+Shift+Delete)
- Try incognito/private window
- Hard refresh (Ctrl+Shift+R)

**Check 2: Backend CORS Config**
```bash
# Check backend logs for CORS settings
cd backend
npm run start:dev
# Look for: "Backend running on http://localhost:3000"
# Check what FRONTEND_URL is loaded
```

**Check 3: Mixed Content**
- All requests must use HTTPS (not HTTP)
- Check DevTools Console for mixed content warnings

### Issue: 404 errors on refresh

**Problem:** Direct URL access (e.g., `https://komezaju.org/dashboard`) returns 404

**Solution:** Configure web server for SPA routing:

**Apache:** Ensure `.htaccess` exists with rewrite rules (see Step 8)

**Nginx:** Add `try_files` directive (see Step 8)

### Issue: Images not loading

**Check 1: Upload Path**
- Images should be in `assets/` subfolder
- Check browser DevTools Network tab for 404s

**Check 2: Backend Images**
- Verify `backend/uploads/` folder exists
- Check `backend/.env` has correct `BACKEND_URL`
- Test direct image URL: `https://komezaju.org/api/uploads/[filename]`

---

## 📁 FILE STRUCTURE REFERENCE

### Frontend Structure
```
frontend/
├── .env                          # ← VITE_API_URL=https://komezaju.org/api
├── dist/                         # ← Deploy THIS folder to production
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js      # ← Contains embedded API URL
│   │   ├── index-[hash].css
│   │   └── [images]
│   └── .htaccess
└── src/
    └── lib/
        └── api.ts                # ← Exports API_URL from import.meta.env.VITE_API_URL
```

### Backend Structure
```
backend/
├── .env                          # ← FRONTEND_URL, BACKEND_URL, JWT_SECRET, etc.
├── uploads/                      # ← User-uploaded images
├── dist/                         # ← Compiled backend code
└── src/
    └── main.ts                   # ← CORS configuration reads FRONTEND_URL
```

---

## 🔄 FUTURE DEPLOYMENTS

Whenever you make code changes:

1. **Pull latest code** from git
2. **Update dependencies** if needed: `npm install`
3. **Verify .env** files have production URLs
4. **Frontend:** Delete `dist/`, run `npm run build`
5. **Backend:** Run `npm run build` if TypeScript changed
6. **Deploy:** Upload new `dist/` files
7. **Backend:** Restart server: `pm2 restart komezaju-backend`

---

## 📊 QUICK COMMAND REFERENCE

### Frontend Commands
```bash
cd frontend

# Development
npm run dev                       # Start dev server (localhost:8080)

# Production Build
rmdir /s /q dist                  # Clean old build
npm run build                     # Create production build
findstr /s /i "komezaju" dist\*   # Verify production URL in build

# Verify .env
type .env                         # Show environment variables
```

### Backend Commands
```bash
cd backend

# Development
npm run start:dev                 # Start with hot-reload

# Production
npm run build                     # Compile TypeScript
npm run start:prod                # Start production server

# With PM2 (recommended for production)
pm2 start dist/main.js --name komezaju-backend
pm2 restart komezaju-backend
pm2 logs komezaju-backend
pm2 stop komezaju-backend
```

---

## 📞 SUPPORT

If issues persist after following this guide:

1. **Share these outputs:**
   ```bash
   # Frontend build verification
   cd frontend
   findstr /s /i "localhost" dist\*
   
   # Backend environment
   cd backend
   type .env
   ```

2. **Browser DevTools:**
   - Open Console tab (errors)
   - Open Network tab (failed requests)
   - Take screenshots of any errors

3. **Backend logs:**
   ```bash
   pm2 logs komezaju-backend --lines 50
   ```

---

## ✨ SUCCESS INDICATORS

Your deployment is successful when:

✅ Website loads at `https://komezaju.org`
✅ All images display correctly
✅ Contact form submits successfully
✅ Donate modal opens and works
✅ Login redirects to dashboard
✅ Dashboard displays stats correctly
✅ No CORS errors in browser console
✅ No 404 errors on page refresh
✅ All API requests go to `https://komezaju.org/api`

---

**Documentation Version:** 1.0
**Last Updated:** Production CORS Fix
**Status:** Ready for deployment
