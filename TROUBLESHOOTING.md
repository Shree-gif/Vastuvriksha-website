# 🔧 Troubleshooting - Blank Page on Netlify

## Problem: Website Shows Blank Page After Deployment

### Quick Fixes (Try These First!)

---

## Fix 1: Check Browser Console (Most Common)

1. Open the deployed site
2. Press **F12** (or right-click → Inspect)
3. Click **Console** tab
4. Look for errors

**Common errors and fixes:**

### Error: "Failed to load module" or "404 on assets"
**Solution:** Check your `vite.config.js`

Make sure it looks like this:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/'
})
```

---

## Fix 2: Verify Build Output

### Step 1: Check if build worked locally

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` - Does it work?

- ✅ **If YES:** Build is fine, issue is with Netlify config
- ❌ **If NO:** Fix build errors first

---

## Fix 3: Check Netlify Build Log

1. Go to Netlify dashboard
2. Click on your site
3. Click **"Deploys"**
4. Click the latest deploy
5. Click **"Deploy log"**

**Look for:**
- ❌ Build failed errors
- ⚠️ Warnings about missing files
- ✅ "Site is live" message

---

## Fix 4: Verify netlify.toml Configuration

Your `netlify.toml` should be:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**The redirects section is CRITICAL for React Router!**

---

## Fix 5: Check Build Settings in Netlify Dashboard

1. Go to **Site settings** → **Build & deploy**
2. Verify:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18 or higher

---

## Fix 6: Clear Netlify Cache

Sometimes Netlify caches old builds:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**

---

## Fix 7: Check if dist Folder Has Files

After running `npm run build`, check the `dist` folder:

```
dist/
├── index.html        ← Must exist
├── assets/
│   ├── index-[hash].js   ← Must exist
│   └── index-[hash].css  ← Must exist
└── vite.svg
```

**If dist is empty or missing files:**

```bash
# Clean and rebuild
rm -rf dist
rm -rf node_modules
npm install
npm run build
```

---

## Fix 8: Check for JavaScript Errors

Open browser console (F12) and look for:

### "Cannot read property of undefined"
- Content might not be loading
- Check localStorage
- Try clearing localStorage and refreshing

### "React is not defined"
- Build issue
- Rebuild: `npm run build`

---

## Fix 9: LocalStorage Issue

Since your site uses localStorage for content:

1. Open browser console (F12)
2. Go to **Application** tab
3. Click **Local Storage**
4. Check if `vastuvriksha_content` exists

**If missing:**
- Go to `/admin`
- Login and save some content
- Refresh the page

---

## Fix 10: Force Reinstall Everything

```bash
# Delete everything and start fresh
rm -rf node_modules
rm -rf dist
rm -rf .vite

# Reinstall
npm install

# Rebuild
npm run build

# Test locally first
npm run preview
```

---

## Step-by-Step Debugging Process

### 1. Test Locally First
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173`

**Does it work?**
- ✅ YES → Problem is with Netlify deployment
- ❌ NO → Problem is with your build

### 2. If Local Preview Works

Check your Netlify configuration:

```bash
# Make sure netlify.toml is in root folder
# Make sure it has the redirects section
# Redeploy to Netlify
```

### 3. If Local Preview Also Shows Blank

**Build has an issue:**

```bash
# Check for errors during build
npm run build

# Look for:
# - Any error messages
# - Warnings about missing modules
# - "Build failed" messages
```

---

## Common Causes & Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| Blank page | Missing redirects | Add `[[redirects]]` to netlify.toml |
| Flash then blank | React Router issue | Check redirects config |
| 404 on refresh | No redirects | Add redirects to netlify.toml |
| Console errors | Build issue | Rebuild locally first |
| No errors but blank | Content not loading | Check localStorage/admin |

---

## Quick Fix Commands

Run these in order:

```bash
# 1. Clean everything
rm -rf node_modules dist .vite

# 2. Fresh install
npm install

# 3. Build
npm run build

# 4. Test locally
npm run preview

# 5. If local works, redeploy to Netlify
# Just drag the dist folder again
```

---

## Netlify-Specific Fixes

### Option 1: Drag & Drop Method

If you're using drag & drop:

```bash
# Build fresh
npm run build

# Go to Netlify dashboard
# Click "Deploys" tab
# Drag the NEW dist folder
# (This creates a new deployment)
```

### Option 2: GitHub Method

If using GitHub integration:

```bash
# Commit and push
git add .
git commit -m "Fix blank page issue"
git push

# Netlify will auto-deploy
# Check deploy logs for errors
```

---

## Check These Files

### 1. index.html (in root)

Should have:
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

### 2. src/main.jsx

Should have:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 3. package.json

Should have:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Emergency Fix: Minimal Deployment Test

Create a test file to see if Netlify is working:

```bash
# Create a simple test folder
mkdir test-deploy
cd test-deploy

# Create simple HTML
echo "<h1>Test</h1>" > index.html

# Drag this folder to Netlify
# Does it show "Test"?
# - YES: Your build is the issue
# - NO: Netlify account issue
```

---

## Still Not Working?

### Check Netlify Status
- Visit: https://www.netlifystatus.com
- Is Netlify having issues?

### Try Different Browser
- Clear cache
- Try incognito mode
- Try different browser

### Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for failed requests (red)

---

## Most Likely Solution

**99% of the time it's one of these:**

1. **Missing redirects in netlify.toml** ← Most common!
2. **Build command wrong** (should be `npm run build`)
3. **Publish directory wrong** (should be `dist`)
4. **Node version too old** (use 18+)

---

## Copy-Paste Solution

**Just copy these files exactly:**

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Then:
```bash
npm install
npm run build
# Drag dist folder to Netlify
```

---

## Get Help

If still stuck, share:
1. Screenshot of blank page with console open (F12)
2. Netlify deploy log (copy/paste)
3. Error messages from browser console

---

## Prevention

**Before every deployment:**

```bash
# Always test locally first!
npm run build
npm run preview

# If preview works, deployment should work
# If preview doesn't work, fix it before deploying
```

---

**Most Common Fix: Add the redirects to netlify.toml and redeploy!**


