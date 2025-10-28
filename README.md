# Vastuvriksha - Architecture & Interior Design Portfolio

A professional, modern portfolio website for Vastuvriksha architecture and interior design business. Built with React, featuring an easy-to-use admin panel for content management without coding.

## 🌟 Features

- **Modern & Professional Design** - Minimalist, visually appealing interface that reflects the interior design theme
- **Fully Responsive** - Works perfectly on all devices (desktop, tablet, mobile)
- **Admin Panel** - Easy content management through intuitive forms
- **No Backend Required** - Frontend-only solution using localStorage for data persistence
- **SEO Friendly** - Proper meta tags and semantic HTML
- **Fast Performance** - Built with Vite for lightning-fast development and optimized builds

## 📁 Project Structure

```
website/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components (Navbar, Footer)
│   ├── pages/          # Page components
│   │   ├── Home.jsx    # Landing page with hero section
│   │   ├── About.jsx   # About page
│   │   ├── Services.jsx # Services showcase
│   │   ├── Projects.jsx # Projects portfolio
│   │   ├── Contact.jsx  # Contact form
│   │   └── Admin.jsx    # Admin panel
│   ├── data/           # Content data (JSON)
│   ├── utils/          # Utility functions (storage management)
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The website will open at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist` folder

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🎨 Admin Panel Usage

### Accessing the Admin Panel

1. Navigate to `/admin` route in your browser
2. Enter the admin password (default: `vastuvriksha2024`)
3. You'll see tabs for different sections:
   - **Site Info** - Company details, contact info, social media links
   - **Hero Section** - Homepage banner content
   - **About** - Company story, mission, vision, statistics
   - **Services** - Add/edit/delete services
   - **Projects** - Add/edit/delete portfolio projects

### Managing Content

#### Adding a Project
1. Go to Admin → Projects tab
2. Click "+ Add Project"
3. Fill in the details:
   - Title (required)
   - Category (residential/commercial/architectural)
   - Location
   - Year
   - Status (completed/ongoing/upcoming)
   - Image URL
   - Description
4. Click "💾 Save All Changes"

#### Adding a Service
1. Go to Admin → Services tab
2. Click "+ Add Service"
3. Fill in:
   - Icon (use emoji, e.g., 🏠)
   - Service Title
   - Description
4. Click "💾 Save All Changes"

#### Updating Site Information
1. Go to Admin → Site Info tab
2. Update fields like:
   - Email, Phone, Address
   - Social media links (Facebook, Instagram, LinkedIn, Twitter)
3. Click "💾 Save All Changes"

### Important Notes

- **Always save your changes** using the "💾 Save All Changes" button
- All data is stored in browser's localStorage
- Data persists even after closing the browser
- To reset to defaults, use "Reset to Default" button (this will delete all custom content)
- **Change the admin password** in `src/pages/Admin.jsx` (line 12) for security

## 🔒 Security

**IMPORTANT:** This is a frontend-only solution. For production use with sensitive data:

1. Change the admin password in `src/pages/Admin.jsx`:
   ```javascript
   const ADMIN_PASSWORD = 'your_secure_password_here';
   ```

2. Consider implementing proper backend authentication for real-world use

3. For public deployment, you may want to remove the admin panel or add IP restrictions

## 📸 Adding Images to Projects

You have several options for project images:

### Option 1: Direct File Upload (Easiest!) ⭐
- Click "📁 Upload Image" button in admin panel
- Select image from your computer
- Images are automatically stored as base64 in localStorage
- Maximum file size: 2MB
- Supports JPG, PNG, GIF, WebP
- No external hosting needed!

### Option 2: Use Image Hosting Services
- Upload images to services like:
  - Imgur (https://imgur.com)
  - Cloudinary (https://cloudinary.com)
  - ImgBB (https://imgbb.com)
- Copy the direct image URL
- Paste in the "Image URL" field in admin panel

### Option 3: Use Your Own Server
- Upload images to your web hosting
- Use the direct URL

### Option 4: Create a Public Folder
1. Place images in `public/images/` folder
2. Use relative URLs like `/images/project1.jpg`

**Note:** For best performance, compress images before uploading using https://tinypng.com

## 🌐 Deployment

### 🚀 Deploy to Netlify (Recommended - 5 Minutes!)

**Quick Method:**
1. Build the project: `npm run build`
2. Go to: https://app.netlify.com/drop
3. Drag the `dist` folder
4. Done! Your site is LIVE! 🎉

**For detailed instructions, see:** `DEPLOY_NOW.md` or `DEPLOYMENT_GUIDE.md`

**GitHub Integration (Auto-deploy on changes):**
- See `DEPLOYMENT_GUIDE.md` for complete GitHub + Netlify setup
- Push to GitHub → Automatic deployment
- Perfect for ongoing updates

### Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/'
   })
   ```
4. Run: `npm run deploy`

## 🎨 Customization

### Changing Colors

Edit `src/index.css` (lines 1-10):
```css
:root {
  --primary-color: #2c3e50;      /* Main brand color */
  --secondary-color: #8b7355;    /* Accent color */
  --accent-color: #d4af37;       /* Highlight color */
  --text-dark: #1a1a1a;         /* Dark text */
  --text-light: #666;           /* Light text */
  --bg-light: #f8f9fa;          /* Background */
}
```

### Changing Fonts

Update `src/index.css` (line 19):
```css
body {
  font-family: 'Your Font', sans-serif;
}
```

## 📞 Support

For issues or questions:
- Check the documentation above
- Review the code comments in source files
- Each component is well-documented and easy to understand

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router v6** - Navigation
- **Vite** - Build tool
- **CSS3** - Styling
- **localStorage** - Data persistence

## 📝 License

This project is created for Vastuvriksha business. Customize as needed for your use.

## 🎯 Next Steps

1. Install Node.js if you haven't
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Go to `/admin` to start adding your content
5. Add your projects, services, and company information
6. Deploy to your hosting service
7. Point your domain (vastuvriksha.com) to the deployed site

---

**Made with ❤️ for Vastuvriksha**


test