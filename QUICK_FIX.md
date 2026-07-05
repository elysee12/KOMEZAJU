# ⚡ QUICK FIX - CORS ERROR

## The Problem
Your website shows CORS errors because `dist/` folder has old code trying to access `localhost:3000`.

## The Solution (5 steps)

### 1️⃣ Delete Old Build
```bash
cd frontend
rmdir /s /q dist
```

### 2️⃣ Rebuild with Production URL
```bash
npm run build
```

### 3️⃣ Verify Build
```bash
findstr /s /i "komezaju.org" dist\*
```
✅ Should see multiple matches with `komezaju.org/api`

### 4️⃣ Restart Backend
```bash
cd backend
# Ctrl+C to stop, then:
npm run start:prod
```

### 5️⃣ Deploy
- Upload NEW `frontend/dist/` contents to your web server
- Clear browser cache
- Test at `https://komezaju.org`

---

## 📝 What's Already Done

✅ Frontend `.env` configured: `VITE_API_URL=https://komezaju.org/api`
✅ Backend `.env` configured: `FRONTEND_URL="https://komezaju.org"`
✅ Source code uses `API_URL` correctly (no hardcoded URLs)

**You just need to REBUILD and DEPLOY the new dist/ folder!**

---

## 🧪 How to Test

After deployment:

1. Open `https://komezaju.org`
2. Press F12 → **Network** tab
3. Click "Donate" or fill contact form
4. Check network requests:
   - ✅ **GOOD:** `https://komezaju.org/api/...`
   - ❌ **BAD:** `http://localhost:3000/...`

---

## 💡 Why This Happened

Vite replaces `import.meta.env.VITE_API_URL` during **BUILD TIME**, not runtime:

```javascript
// Before build (source code):
const API_URL = import.meta.env.VITE_API_URL;

// After build (compiled dist/):
const API_URL = "https://komezaju.org/api";  // ← Actual value embedded!
```

So:
- Updating `.env` AFTER building → ❌ No effect (value already embedded)
- Updating `.env` BEFORE building → ✅ Works (Vite reads and embeds new value)

---

📖 **Full guide:** See `PRODUCTION_DEPLOYMENT_GUIDE.md`
🔧 **Detailed fix:** See `frontend/FIX_CORS_PRODUCTION.md`
