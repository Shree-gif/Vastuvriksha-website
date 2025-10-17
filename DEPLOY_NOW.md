# 🚀 DEPLOY TO NETLIFY - QUICK START

## Follow These Steps RIGHT NOW!

### ⚡ 5-Minute Deployment (Fastest Method)

#### Step 1: Build Your Website (2 minutes)
Open terminal in this folder and run:
```bash
npm install
npm run build
```

A `dist` folder will be created. ✅

#### Step 2: Deploy to Netlify (2 minutes)

1. Open browser: **https://app.netlify.com/drop**
2. Sign up (free) or log in
3. **DRAG the `dist` folder** onto the page
4. Wait 30 seconds

🎉 **YOUR WEBSITE IS LIVE!**

You'll get a URL like: `https://amazing-site-123.netlify.app`

#### Step 3: Connect Your Domain (1 minute setup)

1. In Netlify, click **"Domain settings"**
2. Click **"Add custom domain"**
3. Type: `vastuvriksha.com`
4. Follow the DNS instructions shown

---

## What to Do After Deployment

### 1️⃣ Test Your Site
- Visit the Netlify URL
- Check all pages work
- Test on mobile

### 2️⃣ Add Your Content
- Go to: `your-url.netlify.app/admin`
- Password: `vastuvriksha2024`
- Add your company info, projects, services
- **Click "💾 Save All Changes"**

### 3️⃣ Change Password (IMPORTANT!)
- Open: `src/pages/Admin.jsx`
- Line 13: Change password
- Rebuild: `npm run build`
- Re-drag `dist` folder to Netlify

### 4️⃣ Wait for Domain (24-48 hours)
- Your domain will work after DNS propagates
- Check status: https://dnschecker.org

---

## Need More Help?

📖 **Read:** `DEPLOYMENT_GUIDE.md` (detailed instructions)

---

## Quick Troubleshooting

**Build fails?**
```bash
# Delete node_modules and try again:
rm -rf node_modules
npm install
npm run build
```

**Can't find dist folder?**
- It's created after `npm run build`
- Look in your project folder
- It contains HTML, CSS, JS files

**Domain not connecting?**
- Takes 24-48 hours
- Update nameservers at domain registrar
- Use Netlify's provided nameservers

---

## 🎯 You're Almost There!

1. Run: `npm install` then `npm run build`
2. Go to: https://app.netlify.com/drop
3. Drag `dist` folder
4. Done! 🚀

**THAT'S IT!** Your website is online!

---

## After Site is Live

✅ Add content via `/admin`  
✅ Share URL with clients  
✅ Add to business cards  
✅ Post on social media  
✅ Submit to Google  

**Welcome to the internet! 🌍**


