# 🚨 URGENT: Fix Hardcoded localhost:3000 on Live Server

## The Problem

Your live server at `root@vmi3412819:/var/www/apps/komezaju/frontend` has **OLD SOURCE CODE** with hardcoded `localhost:3000` URLs that were never removed.

**Evidence from your server:**
```bash
root@vmi3412819:/var/www/apps/komezaju/frontend# grep -R "localhost:3000" -n src
src/routes/index.tsx:65:const API = "http://localhost:3000";
src/routes/index.tsx:1066:      const res = await fetch("http://localhost:3000/contact", {
src/routes/index.tsx:1723:      const response = await fetch("http://localhost:3000/auth/login", {
src/routes/dashboard.tsx:11:const API = "http://localhost:3000";
```

**Good news:** Your LOCAL repository already has the correct code (using `API_URL` from `lib/api.ts`). The server just needs to be updated.

---

## ✅ Solution: Update Server with Latest Code

### Step 1: Commit and Push Latest Code (Local Machine)

```bash
cd d:\project\KOMEZAJU

# Add all changes
git add .

# Commit with clear message
git commit -m "Fix: Remove hardcoded localhost URLs, use API_URL from environment"

# Push to repository
git push origin main
```

### Step 2: Pull Latest Code on Server

```bash
# SSH into your server
ssh root@vmi3412819

# Navigate to frontend directory
cd /var/www/apps/komezaju/frontend

# Pull latest code from git
git pull origin main

# Verify the changes
grep -R "localhost:3000" src
# ✅ Should return NO MATCHES

# Verify API_URL is imported correctly
grep -n "import.*API_URL" src/routes/index.tsx src/routes/dashboard.tsx
# ✅ Should show: import { API_URL } from "../lib/api";
```

### Step 3: Verify Environment Configuration on Server

```bash
# Check if .env file exists
cat .env
```

**Expected content:**
```env
VITE_API_URL=https://komezaju.org/api
```

**If file doesn't exist, create it:**
```bash
cat > .env << 'EOF'
# KOMEZAJU Frontend Environment Configuration
VITE_API_URL=https://komezaju.org/api
EOF
```

### Step 4: Clean and Rebuild on Server

```bash
# Delete old build
rm -rf dist

# Delete node_modules cache (recommended)
rm -rf node_modules/.vite

# Rebuild with production URL
npm run build

# Verify build contains correct URL
grep -r "komezaju.org/api" dist/
# ✅ Should show MULTIPLE MATCHES

# Verify NO localhost references
grep -r "localhost:3000" dist/
# ✅ Should show NO MATCHES
```

### Step 5: Restart Web Server (if needed)

```bash
# For nginx
sudo systemctl restart nginx

# For Apache
sudo systemctl restart apache2

# For PM2 (if using for frontend)
pm2 restart komezaju-frontend
```

### Step 6: Test Deployment

Visit `https://komezaju.org` and:

1. Open Browser DevTools (F12)
2. Go to **Network** tab
3. Click "Donate" or submit contact form
4. Check API requests:
   - ✅ **CORRECT:** `https://komezaju.org/api/contact`
   - ❌ **WRONG:** `http://localhost:3000/contact`

---

## 🔍 Root Cause Analysis

### What Happened?

1. ✅ Initial development used hardcoded `localhost:3000`
2. ❌ Code was deployed to server WITHOUT removing hardcoded URLs
3. ✅ LOCAL code was later updated to use `API_URL` from environment
4. ❌ SERVER code was NEVER UPDATED with the new changes
5. ❌ Server is still running old code with hardcoded `localhost:3000`

### Why .env Didn't Help?

The server's source code has:
```javascript
// OLD CODE (on server):
const API = "http://localhost:3000";  // ← Hardcoded!
const res = await fetch("http://localhost:3000/contact", { ... });
```

Even with `.env` file present, this hardcoded value is used instead.

### The Fix

Update server code to:
```javascript
// NEW CODE (in local repo):
import { API_URL } from "../lib/api";  // ← Reads from .env
const res = await fetch(`${API_URL}/contact`, { ... });
```

---

## 📋 Complete Server Update Checklist

### On Local Machine:
- [ ] Verify local code uses `API_URL` from `lib/api.ts`
  ```bash
  grep -R "localhost:3000" frontend/src
  # Should return NO MATCHES
  ```
- [ ] Commit all changes
  ```bash
  git add .
  git commit -m "Fix: Remove hardcoded localhost URLs"
  ```
- [ ] Push to repository
  ```bash
  git push origin main
  ```

### On Live Server:
- [ ] SSH into server
  ```bash
  ssh root@vmi3412819
  ```
- [ ] Navigate to frontend directory
  ```bash
  cd /var/www/apps/komezaju/frontend
  ```
- [ ] Pull latest code
  ```bash
  git pull origin main
  ```
- [ ] Verify hardcoded URLs are gone
  ```bash
  grep -R "localhost:3000" src
  # Should return NO MATCHES
  ```
- [ ] Check/create `.env` file
  ```bash
  cat .env
  # Should show: VITE_API_URL=https://komezaju.org/api
  ```
- [ ] Delete old build
  ```bash
  rm -rf dist
  ```
- [ ] Rebuild
  ```bash
  npm run build
  ```
- [ ] Verify build has correct URL
  ```bash
  grep -r "komezaju.org/api" dist/
  # Should show multiple matches
  ```
- [ ] Restart web server
  ```bash
  sudo systemctl restart nginx  # or apache2
  ```
- [ ] Test website at https://komezaju.org

---

## 🐛 Troubleshooting

### Problem: git pull shows conflicts

**Solution:**
```bash
# Backup current changes
cp -r /var/www/apps/komezaju/frontend /var/www/apps/komezaju/frontend.backup

# Discard local changes and pull fresh
cd /var/www/apps/komezaju/frontend
git reset --hard HEAD
git pull origin main
```

### Problem: .env file gets overwritten by git

**Solution:**
```bash
# .env should be in .gitignore (already is)
# Verify
cat .gitignore | grep .env

# Create .env manually on server
cat > .env << 'EOF'
VITE_API_URL=https://komezaju.org/api
EOF
```

### Problem: Build still contains localhost:3000

**Cause:** Source code still has hardcoded URLs

**Solution:**
```bash
# Verify latest code is pulled
git log --oneline -5
git diff origin/main

# If code is old, force pull
git fetch origin
git reset --hard origin/main

# Then rebuild
rm -rf dist node_modules/.vite
npm run build
```

### Problem: CORS errors persist

**Check backend configuration:**
```bash
cd /var/www/apps/komezaju/backend
cat .env | grep FRONTEND_URL
# Should show: FRONTEND_URL="https://komezaju.org"

# Restart backend
pm2 restart komezaju-backend
pm2 logs komezaju-backend
```

---

## 🔄 Alternative: Manual File Update (if git not working)

If git pull fails, you can manually update the files:

### Update index.tsx

```bash
cd /var/www/apps/komezaju/frontend/src/routes
nano index.tsx
```

**Find and remove these lines around line 65:**
```javascript
const API = "http://localhost:3000";  // ← DELETE THIS LINE
```

**Find line 1066 (in Contact component):**
```javascript
// OLD:
const res = await fetch("http://localhost:3000/contact", {

// NEW:
const res = await fetch(`${API_URL}/contact`, {
```

**Find line 1723 (in LoginModal component):**
```javascript
// OLD:
const response = await fetch("http://localhost:3000/auth/login", {

// NEW:
const response = await fetch(`${API_URL}/auth/login`, {
```

### Update dashboard.tsx

```bash
cd /var/www/apps/komezaju/frontend/src/routes
nano dashboard.tsx
```

**Find and remove around line 11:**
```javascript
const API = "http://localhost:3000";  // ← DELETE THIS LINE
```

**Then save and rebuild.**

---

## ✨ Expected Results After Fix

### Source Code Check:
```bash
grep -R "localhost:3000" src
# ✅ NO MATCHES
```

### Build Check:
```bash
grep -r "localhost:3000" dist/
# ✅ NO MATCHES

grep -r "komezaju.org/api" dist/
# ✅ MULTIPLE MATCHES
```

### Browser Check:
- Open https://komezaju.org
- F12 → Network tab
- Submit contact form
- ✅ See request to `https://komezaju.org/api/contact`

### Console Check:
- F12 → Console tab
- ✅ NO CORS errors
- ✅ NO "Failed to fetch" errors

---

## 📝 Summary

**The Problem:** Server has old source code with hardcoded `localhost:3000`

**The Solution:** Pull latest code from git, rebuild with correct `.env`

**Key Commands:**
```bash
# On server
cd /var/www/apps/komezaju/frontend
git pull origin main
cat > .env << 'EOF'
VITE_API_URL=https://komezaju.org/api
EOF
rm -rf dist
npm run build
sudo systemctl restart nginx
```

**Verification:**
```bash
grep -R "localhost:3000" src        # Should be empty
grep -r "komezaju.org/api" dist/    # Should have matches
```

---

**Status:** Action Required
**Priority:** High
**Estimated Time:** 10 minutes
