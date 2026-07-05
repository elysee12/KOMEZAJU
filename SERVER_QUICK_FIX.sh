#!/bin/bash

# ========================================
# KOMEZAJU - Server Quick Fix Script
# ========================================
# This script updates the live server with latest code
# and rebuilds with the correct API URL
#
# Run on server: bash SERVER_QUICK_FIX.sh
# ========================================

echo "🚀 KOMEZAJU Server Fix - Starting..."
echo ""

# Navigate to frontend directory
cd /var/www/apps/komezaju/frontend || exit 1

echo "📥 Step 1: Pulling latest code from git..."
git pull origin main

echo ""
echo "🔍 Step 2: Checking for hardcoded localhost URLs..."
if grep -R "localhost:3000" src; then
    echo "❌ ERROR: Found hardcoded localhost:3000 in source code!"
    echo "Please update your git repository first."
    exit 1
else
    echo "✅ No hardcoded URLs found - source code is clean!"
fi

echo ""
echo "📝 Step 3: Creating/verifying .env file..."
cat > .env << 'EOF'
# KOMEZAJU Frontend Environment Configuration
VITE_API_URL=https://komezaju.org/api
EOF
echo "✅ .env file configured"

echo ""
echo "🧹 Step 4: Cleaning old build..."
rm -rf dist
rm -rf node_modules/.vite
echo "✅ Old build deleted"

echo ""
echo "🔨 Step 5: Building for production..."
npm run build

echo ""
echo "🔍 Step 6: Verifying build..."
if grep -r "localhost:3000" dist/ > /dev/null 2>&1; then
    echo "❌ ERROR: Build still contains localhost:3000!"
    echo "Build failed - please check .env configuration"
    exit 1
else
    echo "✅ Build does NOT contain localhost:3000"
fi

if grep -r "komezaju.org/api" dist/ > /dev/null 2>&1; then
    echo "✅ Build contains production API URL (komezaju.org/api)"
else
    echo "⚠️  WARNING: Could not find komezaju.org/api in build"
fi

echo ""
echo "🔄 Step 7: Restarting web server..."
# Uncomment the appropriate line for your server:
# sudo systemctl restart nginx
# sudo systemctl restart apache2

echo ""
echo "✅ ========================================="
echo "✅ FIX COMPLETE!"
echo "✅ ========================================="
echo ""
echo "📋 Next steps:"
echo "1. Restart your web server (nginx/apache)"
echo "2. Clear browser cache"
echo "3. Visit https://komezaju.org"
echo "4. Test with DevTools Network tab"
echo ""
echo "✨ Your website should now use the correct API URL!"
