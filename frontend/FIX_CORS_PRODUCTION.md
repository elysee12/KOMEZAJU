# 🔧 FIXING CORS ERRORS - PRODUCTION DEPLOYMENT

## ❌ THE PROBLEM

Your deployed website is still trying to access `http://localhost:3000` instead of `https://komezaju.org/api`, even though you updated the `.env` file.

**WHY?** Because Vite environment variables are **replaced at BUILD TIME**, not runtime. Your current `dist/` folder was built BEFORE you updated the `.env` file, so it contains old compiled JavaScript with hardcoded `localhost:3000`.

---

## ✅ THE SOLUTION

You need to **rebuild** the frontend with the correct production URL and **reconfigure** the backend CORS settings.

---

## 📋 STEP-BY-STEP FIX

### **STEP 1: Clean Old Build**

Delete the old `dist/` folder that contains the wrong API URL:

```bash
# Windows CMD (from frontend directory)
cd frontend
rmdir /s /q dist

# Or in File Explorer: Delete the frontend/dist folder manually
```

### **STEP 2: Verify Environment Configuration**

Make sure `frontend/.env` has the production URL (it should already be correct):

```env
VITE_API_URL=https://komezaju.org/api
```

✅ **Already done** - Your `.env` file is correct!

### **STEP 3: Rebuild Frontend with Production URL**

Now rebuild the frontend. The build process will read `VITE_API_URL` from `.env` and embed it into the compiled JavaScript:

```bash
# From frontend directory
cd frontend
npm run build
```

This creates a NEW `dist/` folder with the correct production API URL.

### **STEP 4: Verify the Build Contains Correct URL**

Search the new build files to confirm they contain the production URL:

```bash
# Windows CMD (from frontend directory)
findstr /s /i "komezaju.org/api" dist\*
```

You should see **multiple matches** showing `komezaju.org/api`.

❌ If you still see `localhost:3000`, the build failed to read the `.env` file correctly.

### **STEP 5: Update Backend CORS Configuration**

The backend `.env` file has been updated to allow requests from your production domain:

```env
FRONTEND_URL="https://komezaju.org"
BACKEND_URL="https://komezaju.org/api"
```

✅ **Already done** - Backend is configured!

### **STEP 6: Restart Backend Server**

After updating the backend `.env`, restart your backend server so it loads the new CORS settings:

```bash
# Stop the current backend server (Ctrl+C)
# Then restart it
cd backend
npm run start:prod

# Or if using PM2:
pm2 restart komezaju-backend
```

### **STEP 7: Deploy New Build to Production**

Upload the NEW `frontend/dist/` folder contents to your production server:

1. **Connect to your server** (via FTP, SSH, or hosting control panel)
2. **Delete old files** in your website's public directory
3. **Upload all files** from the NEW `frontend/dist/` folder
4. **Clear browser cache** and test

---

## 🧪 TESTING

After deployment, test in your browser:

1. Open DevTools (F12) → **Network** tab
2. Visit `https://komezaju.org`
3. Check the API requests:
   - ✅ **CORRECT**: Requests go to `https://komezaju.org/api/...`
   - ❌ **WRONG**: Requests go to `http://localhost:3000/...`

---

## 🔍 UNDERSTANDING VITE ENVIRONMENT VARIABLES

**Important concept:**

```javascript
// In your source code (frontend/src/lib/api.ts):
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// During BUILD TIME, Vite reads .env and REPLACES this line with:
export const API_URL = "https://komezaju.org/api" || "http://localhost:3000";

// The compiled dist/ files contain the actual value, not the variable!
```

This is why:
- ✅ Updating `.env` BEFORE building → Works correctly
- ❌ Updating `.env` AFTER building → Has no effect (old value already embedded)
- ❌ Uploading old `dist/` folder → Still uses old URL

---

## 📝 QUICK CHECKLIST

- [ ] Delete old `frontend/dist/` folder
- [ ] Verify `frontend/.env` contains `VITE_API_URL=https://komezaju.org/api`
- [ ] Run `npm run build` in `frontend/` directory
- [ ] Search new build files for `komezaju.org/api` (should find matches)
- [ ] Verify `backend/.env` contains `FRONTEND_URL="https://komezaju.org"`
- [ ] Restart backend server to load new CORS settings
- [ ] Upload NEW `dist/` folder to production
- [ ] Clear browser cache and test website
- [ ] Check DevTools Network tab to confirm API calls go to production URL

---

## 🚨 TROUBLESHOOTING

### Problem: Build still contains `localhost:3000`

**Solution:** 
- Make sure you're in the `frontend` directory when running `npm run build`
- Delete `node_modules/.vite` cache folder and rebuild
- Check that `.env` file is in the `frontend/` root, not a subdirectory

### Problem: CORS errors after rebuild

**Solution:**
- Verify backend `.env` has `FRONTEND_URL="https://komezaju.org"` (no trailing slash!)
- Restart backend server
- Check backend logs for CORS configuration output

### Problem: Some requests work, others don't

**Solution:**
- Clear all browser caches (Ctrl+Shift+Delete)
- Check if you're mixing HTTP and HTTPS (all should be HTTPS)
- Use browser DevTools Network tab to see which requests fail

---

## 📞 NEED HELP?

If you're still experiencing issues after following these steps:

1. Run this command and share the output:
   ```bash
   cd frontend
   findstr /s /i "localhost" dist\*
   ```

2. Check backend logs when a request fails

3. Share the exact error message from browser DevTools Console

---

**Last Updated:** Production deployment fix
**Status:** Ready to deploy
