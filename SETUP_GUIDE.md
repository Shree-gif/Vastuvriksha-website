# 🚀 Quick Setup Guide for Vastuvriksha Website

## Step 1: Install Node.js

If you don't have Node.js installed:
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the instructions
4. Verify installation by opening terminal/command prompt and typing:
   ```
   node --version
   npm --version
   ```

## Step 2: Install Project Dependencies

Open terminal/command prompt in the project folder and run:
```bash
npm install
```

This will install all required packages (React, React Router, Vite, etc.)

## Step 3: Start the Development Server

```bash
npm run dev
```

The website will open at http://localhost:5173

## Step 4: Access Admin Panel

1. Open browser and go to: http://localhost:5173/admin
2. Enter password: `vastuvriksha2024`
3. Start adding your content!

## 📝 Adding Your Content

### 1. Company Information
- Go to Admin → **Site Info** tab
- Fill in:
  - Email: your@email.com
  - Phone: +91 XXXXXXXXXX
  - Address: Your business address
  - Social media links

### 2. Homepage Hero Section
- Go to Admin → **Hero Section** tab
- Customize the main banner text and call-to-action

### 3. About Page
- Go to Admin → **About** tab
- Add your company story, mission, vision
- Update statistics (projects completed, years of experience, etc.)

### 4. Services
- Go to Admin → **Services** tab
- Click "+ Add Service" for each service you offer
- You can use emojis for icons (🏠 🏢 🎨 📐 💡)
- Add description for each service

### 5. Projects
- Go to Admin → **Projects** tab
- Click "+ Add Project" for each completed/ongoing project
- Fill in:
  - Project title
  - Category (residential/commercial)
  - Location
  - Year
  - Description
  - Image URL (see image guide below)

### 6. Save Changes
- **Important:** Always click "💾 Save All Changes" button at the bottom after editing
- Your changes are saved in browser's localStorage

## 📸 Adding Project Images

### Option 1: Use Free Image Hosting (Easiest)

1. **Imgur** (Recommended)
   - Go to https://imgur.com
   - Click "New post"
   - Upload your image
   - Right-click on uploaded image → "Copy image address"
   - Paste in "Image URL" field

2. **ImgBB**
   - Go to https://imgbb.com
   - Upload image
   - Copy the direct link
   - Paste in admin panel

### Option 2: Use Project's Public Folder

1. Create folder: `public/images/`
2. Put your project images there (e.g., `project1.jpg`)
3. In admin panel, use: `/images/project1.jpg`

## 🎨 Customizing Colors

Edit `src/index.css` file, lines 1-10:

```css
:root {
  --primary-color: #2c3e50;      /* Change to your brand color */
  --secondary-color: #8b7355;    /* Change to your accent color */
  --accent-color: #d4af37;       /* Highlight color */
}
```

## 🔒 Security - Change Admin Password

Edit `src/pages/Admin.jsx`, line 12:

```javascript
const ADMIN_PASSWORD = 'your_new_secure_password';
```

## 🌐 Deploying Your Website

### Deploy to Netlify (Free & Easy)

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop

3. Drag and drop the `dist` folder

4. Your site is live! Connect your domain (vastuvriksha.com) in Netlify settings

### Deploy to Vercel (Alternative)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your project
4. It will auto-deploy!

## 📱 Connecting Your Domain

After deploying to Netlify or Vercel:

1. Go to your domain registrar where you bought vastuvriksha.com
2. Update DNS settings:
   - For Netlify: Point to their nameservers (they'll provide)
   - For Vercel: Add A record or CNAME (they'll provide)
3. Wait 24-48 hours for DNS propagation

## ❓ Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Reinstall Node.js from https://nodejs.org

### Changes not showing
- Make sure you clicked "💾 Save All Changes"
- Refresh the browser (Ctrl+F5)

### Admin panel not accessible
- Make sure you're on `/admin` route
- Check if password is correct

### Images not loading
- Check if image URL is correct
- Make sure URL starts with `http://` or `https://`
- Try using a different image hosting service

## 📞 Need Help?

- Read the main README.md file
- Check code comments in source files
- All components are well-documented

## ✅ Checklist Before Going Live

- [ ] Changed admin password
- [ ] Added all company information
- [ ] Updated hero section content
- [ ] Added about page content
- [ ] Added all services
- [ ] Added project portfolio
- [ ] Tested on mobile devices
- [ ] Built for production (`npm run build`)
- [ ] Deployed to hosting service
- [ ] Connected domain name
- [ ] Tested all pages on live site

---

**You're all set! Start building your portfolio! 🎉**



