# 🚀 KOMEZAJU Frontend - Production Deployment

## 🔴 IMMEDIATE ACTION REQUIRED

Your deployed website is experiencing CORS errors because the `dist/` folder contains **OLD compiled code** with hardcoded `localhost:3000` URLs.

### ⚡ Quick Fix (3 Commands)

```bash
# 1. Delete old build
rmdir /s /q dist

# 2. Rebuild with production URL
npm run build

# 3. Verify correct URL in build
findstr /s /i "komezaju.org" dist\*
```

Then upload the NEW `dist/` folder contents to your web server.

---

## 📊 Current Configuration Status

### ✅ Environment Variables (Correct)

**frontend/.env:**
```env
VITE_API_URL=https://komezaju.org/api
```

**backend/.env:**
```env
FRONTEND_URL="https://komezaju.org"
BACKEND_URL="https://komezaju.org/api"
```

### ✅ Source Code (Correct)

All source files use `API_URL` from `src/lib/api.ts`:
- ✅ `src/routes/index.tsx` - Contact form, donate modal, login
- ✅ `src/routes/dashboard.tsx` - Admin dashboard API calls
- ✅ `src/lib/api.ts` - Centralized API configuration

**No hardcoded `localhost:3000` in source code!**

### ❌ Compiled Build (Incorrect)

The `dist/` folder was built BEFORE the `.env` file was updated:
- ❌ Contains old JavaScript with embedded `localhost:3000`
- ❌ Deployed to production server
- ❌ Causing CORS errors for all users

---

## 🎯 Understanding the Issue

### How Vite Environment Variables Work

```javascript
// SOURCE CODE (src/lib/api.ts):
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// DURING BUILD, Vite reads .env and REPLACES the variable with actual value:

// COMPILED CODE (dist/assets/index-abc123.js):
export const API_URL = "https://komezaju.org/api" || "http://localhost:3000";
```

**Key Point:** The value is embedded during build, not read at runtime!

### Timeline of Events

1. ✅ **Initial development:** Built with `.env` containing `localhost:3000`
2. ✅ **Deployed to production:** Uploaded `dist/` folder to server
3. ✅ **Updated .env:** Changed to `https://komezaju.org/api`
4. ❌ **Problem:** OLD `dist/` folder still on server with hardcoded `localhost:3000`
5. ❌ **Updating .env has no effect:** Compiled code doesn't re-read `.env`

---

## 🛠️ Complete Fix Procedure

### Step 1: Clean Old Build

```bash
cd d:\project\KOMEZAJU\frontend
rmdir /s /q dist
```

This deletes the folder containing old compiled code.

### Step 2: Verify Environment Configuration

```bash
type .env
```

Should show:
```env
VITE_API_URL=https://komezaju.org/api
```

### Step 3: Build for Production

```bash
npm run build
```

Output should show:
```
vite v5.x.x building for production...
✓ x modules transformed.
dist/index.html                  x.xx kB
dist/assets/index-abc123.js     xxx.xx kB
✓ built in x.xxs
```

### Step 4: Verify Build Contains Correct URL

```bash
findstr /s /i "komezaju.org" dist\*
```

Expected output (multiple matches):
```
dist\assets\index-abc123.js:...komezaju.org/api...
dist\assets\index-abc123.js:...komezaju.org/api...
```

❌ **If you see `localhost:3000`:** Build failed to read `.env` correctly

### Step 5: Deploy to Production

1. **Connect to your web server** (via FTP, SSH, cPanel, etc.)
2. **Navigate to website root** (usually `public_html`, `www`, or `httpdocs`)
3. **Delete OLD files:**
   - Delete `index.html`
   - Delete `assets/` folder
   - Keep: `.htaccess`, `robots.txt`, `favicon.ico` if they exist
4. **Upload NEW files:**
   - Upload all files from `frontend/dist/`
   - Maintain folder structure (`assets/` subfolder)

### Step 6: Clear Cache and Test

```bash
# Clear browser cache
# Chrome/Edge: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
```

Visit `https://komezaju.org` and:
1. Open DevTools (F12) → **Network** tab
2. Perform an action (submit contact form, click donate)
3. Check API requests:
   - ✅ `https://komezaju.org/api/contact` → CORRECT
   - ❌ `http://localhost:3000/contact` → WRONG

---

## 📋 Deployment Checklist

- [ ] Deleted old `dist/` folder
- [ ] Verified `.env` has `VITE_API_URL=https://komezaju.org/api`
- [ ] Ran `npm run build`
- [ ] Searched build files for `komezaju.org/api` (found matches)
- [ ] Connected to production server
- [ ] Deleted old website files
- [ ] Uploaded new `dist/` contents
- [ ] Cleared browser cache
- [ ] Tested website at `https://komezaju.org`
- [ ] Verified API calls in DevTools Network tab
- [ ] No CORS errors in Console tab

---

## 🐛 Troubleshooting

### Build contains `localhost:3000`

**Cause:** Vite is not reading `.env` file

**Solutions:**

1. **Check .env location:**
   ```bash
   dir .env
   ```
   Must be in `frontend/` root, not a subdirectory

2. **Check .env file name:**
   - Must be exactly `.env` (not `.env.txt` or `env`)
   - Windows might hide the extension

3. **Clear Vite cache:**
   ```bash
   rmdir /s /q node_modules\.vite
   npm run build
   ```

4. **Verify NODE_ENV:**
   ```bash
   echo %NODE_ENV%
   ```
   Should be empty or `production`

### CORS errors persist

**Cause:** Backend not configured or browser cache

**Solutions:**

1. **Restart backend:**
   ```bash
   cd ..\backend
   # Ctrl+C to stop
   npm run start:prod
   ```

2. **Clear ALL browser data:**
   - Go to `chrome://settings/clearBrowserData`
   - Select "All time"
   - Check all boxes
   - Clear data

3. **Test in incognito window:**
   - Ctrl+Shift+N (Chrome)
   - Ctrl+Shift+P (Firefox)

4. **Check backend logs:**
   ```bash
   cd ..\backend
   pm2 logs komezaju-backend
   ```

### Images not loading

**Frontend images (hero, programs, etc.):**
- ✅ Should be in `dist/assets/` after build
- ✅ Automatically bundled by Vite

**Backend images (admin uploads):**
- Check `backend/uploads/` folder exists
- Verify backend is serving `/uploads` static route
- Test direct URL: `https://komezaju.org/api/uploads/filename.jpg`

---

## 📁 Folder Structure Reference

### Before Build
```
frontend/
├── .env                    ← VITE_API_URL
├── src/
│   ├── lib/
│   │   └── api.ts         ← Exports API_URL
│   ├── routes/
│   │   ├── index.tsx      ← Uses API_URL
│   │   └── dashboard.tsx  ← Uses API_URL
│   └── assets/
│       └── images/
└── public/
    ├── .htaccess
    └── favicon.ico
```

### After Build (dist/)
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    ← Contains embedded komezaju.org/api
│   ├── index-[hash].css
│   ├── logo-[hash].png
│   └── [other assets]
├── .htaccess              ← Copied from public/
└── favicon.ico            ← Copied from public/
```

### Production Server
```
public_html/               ← Upload dist/ contents here
├── index.html
├── assets/
│   └── [all files]
└── .htaccess
```

---

## 🔄 Future Deployments

Every time you change code or `.env`:

1. **Pull latest changes** (if using git)
2. **Update dependencies** (if package.json changed):
   ```bash
   npm install
   ```
3. **Delete dist/**:
   ```bash
   rmdir /s /q dist
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```
5. **Verify build**:
   ```bash
   findstr /s /i "komezaju.org" dist\*
   ```
6. **Deploy** to server

---

## ✅ Success Indicators

Your deployment is successful when:

- [x] Website loads at `https://komezaju.org`
- [x] All sections visible (Hero, Programs, Beneficiaries, etc.)
- [x] Images display correctly
- [x] Language switcher works (EN/RW/FR)
- [x] Contact form submits successfully
- [x] Donate modal opens and works
- [x] Login button works
- [x] **DevTools Network tab shows:**
  - `komezaju.org/api/contact` ✅
  - `komezaju.org/api/donations` ✅
  - **NO** `localhost:3000` requests ❌
- [x] **DevTools Console shows:**
  - No CORS errors ✅
  - No 404 errors ✅

---

## 📚 Related Documentation

- **QUICK_FIX.md** - 5-step quick fix guide
- **frontend/FIX_CORS_PRODUCTION.md** - Detailed CORS troubleshooting
- **PRODUCTION_DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **frontend/DEPLOYMENT.md** - Original deployment instructions

---

## 💡 Key Takeaway

> **Vite environment variables are BUILD-TIME constants, not runtime variables.**
>
> Always rebuild after changing `.env` files!

---

**Last Updated:** Production CORS Fix
**Status:** Ready to deploy
**Action Required:** Rebuild and deploy frontend
