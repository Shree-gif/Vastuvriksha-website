# 📂 Project Structure Explained

## Complete File & Folder Guide

```
vastuvriksha-website/
│
├── 📄 START_HERE.md              ⭐ READ THIS FIRST!
├── 📄 DEPLOY_NOW.md              🚀 Quick 5-min deployment
├── 📄 DEPLOYMENT_GUIDE.md        📖 Complete deployment guide
├── 📄 SETUP_GUIDE.md             🛠️ Setup & usage guide
├── 📄 ADMIN_GUIDE.md             👤 Admin panel tutorial
├── 📄 QUICK_START.md             ✅ Getting started checklist
├── 📄 COMMANDS.md                💻 All terminal commands
├── 📄 README.md                  📚 Technical documentation
│
├── 📄 package.json               📦 Dependencies & scripts
├── 📄 vite.config.js             ⚙️ Vite configuration
├── 📄 netlify.toml               🌐 Netlify config
├── 📄 vercel.json                🌐 Vercel config (alternative)
├── 📄 index.html                 🏠 Main HTML file
├── 📄 .gitignore                 🚫 Git ignore rules
│
├── 📁 public/                    🖼️ Static assets
│   └── vite.svg                  Icon file
│
├── 📁 src/                       💻 Source code
│   ├── 📄 main.jsx               ⚡ Entry point
│   ├── 📄 App.jsx                🎯 Main app component
│   ├── 📄 App.css                🎨 App styles
│   ├── 📄 index.css              🎨 Global styles
│   │
│   ├── 📁 components/            🧩 Reusable components
│   │   ├── Navbar.jsx            🔝 Navigation bar
│   │   ├── Navbar.css
│   │   ├── Footer.jsx            ⬇️ Footer
│   │   └── Footer.css
│   │
│   ├── 📁 pages/                 📄 Page components
│   │   ├── Home.jsx              🏠 Landing page
│   │   ├── Home.css
│   │   ├── About.jsx             ℹ️ About page
│   │   ├── About.css
│   │   ├── Services.jsx          ⚙️ Services page
│   │   ├── Services.css
│   │   ├── Projects.jsx          🎨 Projects portfolio
│   │   ├── Projects.css
│   │   ├── Contact.jsx           📧 Contact page
│   │   ├── Contact.css
│   │   ├── Admin.jsx             👑 Admin panel
│   │   └── Admin.css
│   │
│   ├── 📁 data/                  💾 Content data
│   │   └── content.json          📋 Default content
│   │
│   └── 📁 utils/                 🔧 Utility functions
│       └── storage.js            💾 LocalStorage management
│
└── 📁 dist/                      📦 Production build (auto-generated)
    └── (created after npm run build)
```

---

## 📝 What Each File Does

### 🌟 Documentation Files (Root Level)

| File | Purpose | When to Read |
|------|---------|--------------|
| `START_HERE.md` | Overview & navigation | First time |
| `DEPLOY_NOW.md` | Quick deployment | When ready to go live |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment | Full deployment process |
| `SETUP_GUIDE.md` | Setup & customization | Getting started |
| `ADMIN_GUIDE.md` | Admin panel usage | Learning to add content |
| `QUICK_START.md` | Step-by-step checklist | Following a plan |
| `COMMANDS.md` | Command reference | Need a command |
| `README.md` | Technical docs | Development info |
| `PROJECT_STRUCTURE.md` | This file! | Understanding structure |

### ⚙️ Configuration Files

| File | Purpose | Edit? |
|------|---------|-------|
| `package.json` | Dependencies & scripts | ❌ No |
| `vite.config.js` | Build tool config | ❌ No |
| `netlify.toml` | Netlify settings | ❌ No |
| `index.html` | Main HTML template | ✅ Only meta tags |
| `.gitignore` | Files to ignore in Git | ❌ No |

### 💻 Source Code (`src/` folder)

#### Core Files
- **`main.jsx`** - React entry point, renders App
- **`App.jsx`** - Main component with routing
- **`App.css`** - App-specific styles
- **`index.css`** - Global styles & CSS variables

#### Components (`src/components/`)
- **`Navbar.jsx/css`** - Top navigation menu
- **`Footer.jsx/css`** - Bottom footer with links

#### Pages (`src/pages/`)
- **`Home.jsx/css`** - Homepage with hero & previews
- **`About.jsx/css`** - Company info & values
- **`Services.jsx/css`** - Services showcase
- **`Projects.jsx/css`** - Portfolio gallery
- **`Contact.jsx/css`** - Contact form & info
- **`Admin.jsx/css`** - Content management panel

#### Data (`src/data/`)
- **`content.json`** - Default content structure

#### Utils (`src/utils/`)
- **`storage.js`** - localStorage helper functions

---

## 🎨 How It All Works Together

```
User visits website
       ↓
    index.html loads
       ↓
    main.jsx renders App.jsx
       ↓
    App.jsx shows Navbar
       ↓
    Router shows correct page
       ↓
    Page loads content from localStorage
       ↓
    Footer appears at bottom
```

### Admin Flow
```
Admin visits /admin
       ↓
    Login with password
       ↓
    Edit content in forms
       ↓
    Click "Save All Changes"
       ↓
    Content saved to localStorage
       ↓
    Event triggers content reload
       ↓
    All pages update instantly
```

---

## 📦 Build Process

```
npm run build
       ↓
    Vite bundles all files
       ↓
    Optimizes & minifies
       ↓
    Creates dist/ folder
       ↓
    Ready for deployment!
```

---

## 🚀 What You Deploy

When you run `npm run build`, the `dist/` folder is created with:

```
dist/
├── index.html          (optimized)
├── assets/
│   ├── index-abc123.js    (all JavaScript bundled)
│   └── index-def456.css   (all CSS bundled)
└── vite.svg
```

**This `dist` folder is what you drag to Netlify!**

---

## 🎯 Files You'll Edit Most

### Never Edit:
- ❌ `node_modules/` (auto-generated)
- ❌ `dist/` (auto-generated)
- ❌ `package.json` (unless adding packages)
- ❌ Config files

### Rarely Edit:
- 📝 `index.html` (only for meta tags)
- 📝 `src/index.css` (for color theme)

### Sometimes Edit:
- 📝 `src/pages/Admin.jsx` (change password)
- 📝 Component styles (for customization)

### Always Edit via Admin Panel:
- ✏️ Company information
- ✏️ Services
- ✏️ Projects
- ✏️ About content
- ✏️ Hero section

---

## 🔧 How Content is Managed

### Content Flow:

1. **Default Content**
   - Stored in: `src/data/content.json`
   - Loaded on first visit
   - Copied to localStorage

2. **Admin Changes**
   - Made via: `/admin` forms
   - Saved to: browser localStorage
   - Key: `vastuvriksha_content`

3. **Display Content**
   - Pages read from: localStorage
   - Falls back to: content.json
   - Updates in real-time

### Where Content Lives:

- **Before Admin Use:** `src/data/content.json`
- **After Admin Use:** Browser localStorage
- **Production Build:** Neither (loads from localStorage)

---

## 📱 Responsive Design

Styles follow mobile-first approach:

```css
/* Mobile (default) */
.container { width: 100%; }

/* Tablet & Desktop */
@media (max-width: 768px) {
  /* Adjustments for mobile */
}
```

---

## 🎨 Styling System

### CSS Variables (in `index.css`):
```css
--primary-color: #2c3e50;      /* Main brand color */
--secondary-color: #8b7355;    /* Accent color */
--accent-color: #d4af37;       /* Highlights */
```

Change these to update colors site-wide!

### Style Organization:
- **Global:** `src/index.css`
- **App:** `src/App.css`
- **Components:** Individual `.css` files
- **Pages:** Individual `.css` files

---

## 🗂️ Adding New Files

### Add a New Page:
1. Create `src/pages/NewPage.jsx`
2. Create `src/pages/NewPage.css`
3. Add route in `src/App.jsx`
4. Add link in `src/components/Navbar.jsx`

### Add a New Component:
1. Create `src/components/NewComponent.jsx`
2. Create `src/components/NewComponent.css`
3. Import where needed

---

## 💾 Storage Locations

| Data | Location | Persistent? |
|------|----------|-------------|
| Content | localStorage | ✅ Yes |
| Images (uploaded) | localStorage (base64) | ✅ Yes |
| Admin session | sessionStorage | ❌ No (session only) |
| Code changes | Git/GitHub | ✅ Yes (if using) |

---

## 🚀 Deployment Artifacts

What goes where:

| Environment | Files | Location |
|-------------|-------|----------|
| Development | All `src/` files | Your computer |
| Production | `dist/` files | Netlify servers |
| Content | localStorage | User's browser |

---

## 🔍 Finding Things Quickly

**Need to change colors?**
→ `src/index.css` (lines 1-10)

**Need to change admin password?**
→ `src/pages/Admin.jsx` (line 13)

**Need to update meta tags?**
→ `index.html` (lines 4-12)

**Need to add a service?**
→ `/admin` → Services tab

**Need to add a project?**
→ `/admin` → Projects tab

**Need deployment help?**
→ `DEPLOY_NOW.md` or `DEPLOYMENT_GUIDE.md`

---

## 📚 Import Structure

```javascript
// Page imports Component
import Navbar from './components/Navbar'

// Component imports Utils
import { initializeContent } from '../utils/storage'

// Everything imports CSS
import './styles.css'
```

---

## 🎯 Key Concepts

### 1. Single Page Application (SPA)
- Only one HTML file (`index.html`)
- React handles page changes
- Router manages URLs
- No page reloads

### 2. Component-Based
- Everything is a component
- Reusable pieces
- Props pass data
- State manages changes

### 3. Frontend-Only
- No backend server
- No database
- localStorage for data
- Static site hosting

---

## 🌟 Summary

**You don't need to understand all this to use the website!**

Most work happens in:
- 📁 `/admin` panel (for content)
- 📁 `src/index.css` (for colors)
- 📁 `src/pages/Admin.jsx` (for password)

Everything else is ready to go! 🚀

---

**Next Step:** Read `START_HERE.md` and deploy your site!


