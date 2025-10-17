# 🚨 URGENT: Fix Blank Page on Netlify

## Your Issue: Website loads then goes blank

This is a **React Router** issue. Here's the fix:

---

## ⚡ QUICK FIX (Do This Now!)

### Step 1: Verify netlify.toml

Check if you have `netlify.toml` in your **root folder** (same level as package.json).

**It should contain:**

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

**The `[[redirects]]` section is CRITICAL!** This tells Netlify to always serve index.html for all routes.

### Step 2: Check Netlify Dashboard Settings

1. Go to your Netlify dashboard
2. Click on your site
3. Go to **"Site settings"** → **"Build & deploy"** → **"Build settings"**
4. Verify:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Step 3: Redeploy

**Option A: Drag & Drop**
```bash
npm run build
```
Then drag the `dist` folder to Netlify again

**Option B: Clear Cache & Deploy**
1. In Netlify dashboard, go to **Deploys** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**

---

## 🔍 Check for Console Errors

1. Open your deployed site
2. Press **F12** (open DevTools)
3. Click **Console** tab
4. **Take a screenshot** of any errors
5. Look for:
   - Red error messages
   - "Failed to fetch" errors
   - "404" errors
   - Router errors

---

## 🧪 Test Locally First

**ALWAYS test before deploying:**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:4173`

**Does it work locally?**
- ✅ **YES** → Problem is Netlify configuration
- ❌ **NO** → Problem is your build

---

## 🎯 Most Common Causes

### 1. Missing Redirects (90% of cases)
**Fix:** Make sure `netlify.toml` has the `[[redirects]]` section

### 2. Wrong Build Directory
**Fix:** Should be `dist` not `build`

### 3. Wrong Build Command
**Fix:** Should be `npm run build` not `npm run dev`

### 4. Base Path Issue
**Fix:** Check `vite.config.js` has `base: '/'`

---

## 📝 Your vite.config.js Should Look Like:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/'
})
```

**DO NOT change `base` to anything else!**

---

## 🔄 Complete Clean Rebuild

If nothing works, do a complete reset:

```bash
# Delete everything
rm -rf node_modules
rm -rf dist
rm -rf .vite

# Fresh install
npm install

# Build
npm run build

# Test locally
npm run preview
```

If local preview works, the build is fine!

---

## 🌐 Check Build Log on Netlify

1. Netlify Dashboard → Your site
2. Click **"Deploys"** tab
3. Click the latest deploy
4. Click **"Deploy log"**
5. Scroll down to see if build succeeded

**Look for:**
- ✅ "Site is live"
- ❌ Any red error messages
- ⚠️ Build warnings

---

## 📱 Check on Different Browsers

- Clear cache (Ctrl + Shift + Delete)
- Try incognito/private mode
- Try different browser
- Check on mobile

Sometimes it's just a cache issue!

---

## 🆘 Emergency: Copy-Paste These Files

### Create/Replace netlify.toml in root:

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

### Make sure vite.config.js looks like:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/'
})
```

### Then rebuild:

```bash
npm run build
```

### Then redeploy to Netlify

---

## ✅ Verification Checklist

Before deploying:

- [ ] `netlify.toml` exists in root folder
- [ ] It has `[[redirects]]` section
- [ ] `vite.config.js` has `base: '/'`
- [ ] `npm run build` works without errors
- [ ] `npm run preview` shows working site
- [ ] `dist` folder has `index.html` and `assets/` folder

After deploying:

- [ ] Check Netlify deploy log for errors
- [ ] Open browser console (F12) for errors
- [ ] Try hard refresh (Ctrl + F5)
- [ ] Try incognito mode

---

## 🎯 The Solution (Works 99% of time)

**Most likely your `netlify.toml` is missing or incorrect.**

1. Copy the `netlify.toml` content above
2. Paste it in a file named `netlify.toml` in root folder
3. Run: `npm run build`
4. Redeploy to Netlify
5. Should work! ✅

---

## 📞 Still Stuck?

Share these details:

1. **Browser console errors** (F12 → Console tab → screenshot)
2. **Netlify deploy log** (last 50 lines)
3. **Does `npm run preview` work locally?** (Yes/No)
4. **Content of your `netlify.toml`** file

---

## 🚀 After Fix Works

Once site loads correctly:

1. Go to `/admin`
2. Login (password: `vastuvriksha2024`)
3. Add your content
4. Click "💾 Save All Changes"
5. Refresh - content should appear!

---

**TL;DR: Add redirects to netlify.toml and redeploy!**

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This fixes 90% of blank page issues! 🎉


