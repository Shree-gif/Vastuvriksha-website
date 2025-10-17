# 💻 All Commands You Need

## First Time Setup

```bash
# Install all dependencies
npm install
```

---

## Development (Working on Website)

```bash
# Start development server
npm run dev

# Opens at: http://localhost:5173
# Press Ctrl+C to stop
```

---

## Building for Production

```bash
# Create production build
npm run build

# Creates 'dist' folder ready for deployment
```

---

## Preview Production Build

```bash
# Preview what production site looks like
npm run preview

# Opens at: http://localhost:4173
```

---

## Deployment to Netlify

### Option 1: Manual Deployment
```bash
# Build the site
npm run build

# Then drag 'dist' folder to:
# https://app.netlify.com/drop
```

### Option 2: Using Netlify CLI
```bash
# Install Netlify CLI (one time)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

---

## Git Commands (If Using GitHub)

### First Time Setup
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit - Vastuvriksha website"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/vastuvriksha-website.git

# Push to GitHub
git push -u origin main
```

### Making Updates
```bash
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Updated projects and services"

# Push to GitHub (auto-deploys on Netlify)
git push
```

---

## Common Issues & Fixes

### Node Modules Issue
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

### Build Cache Issue
```bash
# Clear Vite cache
rm -rf .vite
npm run build
```

### Port Already in Use
```bash
# Kill process and restart
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then:
npm run dev
```

---

## File Operations

### Delete Build Folder
```bash
# Windows
rmdir /s /q dist

# Mac/Linux
rm -rf dist
```

### Check Node Version
```bash
node --version
npm --version
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install | `npm install` |
| Develop | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |
| Deploy | Drag `dist` to Netlify |

---

## Development Workflow

1. **Start Development:**
   ```bash
   npm run dev
   ```

2. **Make Changes** in code

3. **Test Changes** in browser (auto-refreshes)

4. **When Ready to Deploy:**
   ```bash
   npm run build
   ```

5. **Deploy** `dist` folder to Netlify

---

## Production Deployment Checklist

```bash
# 1. Make sure everything works locally
npm run dev
# Test at http://localhost:5173

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview
# Test at http://localhost:4173

# 4. Deploy to Netlify
# Drag 'dist' folder to https://app.netlify.com/drop
```

---

## Environment Info

**Node Version Required:** 16 or higher  
**Package Manager:** npm  
**Build Tool:** Vite  
**Framework:** React 18  

---

## Helpful Tips

💡 Always run `npm install` after cloning/downloading  
💡 Run `npm run build` before every deployment  
💡 The `dist` folder is what you deploy  
💡 Never edit files in `dist` folder (they're auto-generated)  
💡 Changes in admin panel save to browser localStorage  

---

## Getting Help

```bash
# Check for errors
npm run build

# Read the error messages
# Most issues show helpful error messages
```

---

## Quick Deploy Checklist

- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] `dist` folder exists
- [ ] Drag to Netlify
- [ ] Test live URL
- [ ] Add content via `/admin`
- [ ] Save changes
- [ ] Done! ✅

---

**Keep this file handy for quick reference!** 📌


