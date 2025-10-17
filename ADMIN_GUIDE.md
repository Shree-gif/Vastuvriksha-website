# 📱 Admin Panel User Guide

## Accessing the Admin Panel

1. Open your website in a browser
2. Add `/admin` to the URL (e.g., `https://vastuvriksha.com/admin`)
3. Enter the admin password: `vastuvriksha2024`
4. Click "Login"

**Important:** Change the default password for security!

## Admin Panel Overview

The admin panel has 5 main sections (tabs):
1. **Site Info** - Company and contact information
2. **Hero Section** - Homepage banner content
3. **About** - Company story and statistics
4. **Services** - Services you offer
5. **Projects** - Portfolio of your work

## 📋 Detailed Tab Guide

### 1. Site Info Tab

**Basic Information**
- **Company Name**: Your business name (displays in footer and navbar)
- **Tagline**: Short catchy phrase about your business
- **Description**: Brief description of what you do

**Contact Details**
- **Email**: Business email (will create clickable mailto link)
- **Phone**: Contact number (will create clickable phone link)
- **Address**: Physical address (displays in footer and contact page)

**Social Media Links**
- Add full URLs to your social profiles
- Example: `https://facebook.com/vastuvriksha`
- Leave blank if you don't use that platform
- Links will automatically appear in footer

### 2. Hero Section Tab

This controls the main banner on your homepage:
- **Main Title**: Big headline (e.g., "Transforming Spaces into Living Art")
- **Subtitle**: Secondary headline
- **Description**: Brief paragraph below subtitle
- **Button Text**: Text on the call-to-action button
- **Button Link**: Where the button leads (e.g., `/projects` or `/contact`)

### 3. About Tab

**About Content**
- **Title**: Page title (usually "About [Company Name]")
- **Description**: Your company story (who you are, what you do)
- **Mission Statement**: What you aim to achieve
- **Vision Statement**: Your long-term goals

**Statistics** (4 stat boxes)
- **Number**: The statistic (e.g., "100+", "5 Years", "50+")
- **Label**: What it represents (e.g., "Projects Completed", "Years Experience")
- Great for showing credibility and experience

### 4. Services Tab

Add each service you offer:

**For Each Service:**
- **Icon**: Use an emoji (copy from https://emojipedia.org)
  - Examples: 🏠 (residential), 🏢 (commercial), 🎨 (design), 📐 (planning)
- **Service Title**: Name of the service
- **Description**: What this service includes

**Common Services:**
- Interior Design
- Architecture
- Space Planning
- 3D Visualization
- Consultation
- Project Management
- Renovation
- Furniture Design

**Managing Services:**
- Click "+ Add Service" to add new
- Click "Delete Service" to remove
- You can have unlimited services

### 5. Projects Tab

Showcase your completed work:

**For Each Project:**
- **Project Title**: Name of the project (required)
- **Category**: Choose from:
  - Residential (homes, apartments)
  - Commercial (offices, shops, restaurants)
  - Architectural (building design)
- **Location**: City/area where project is located
- **Year**: Year completed (e.g., "2024")
- **Status**: 
  - Completed (finished projects)
  - Ongoing (current projects)
  - Upcoming (planned projects)
- **Image URL**: Link to project photo (see image guide below)
- **Description**: Brief description of the project

**Managing Projects:**
- Click "+ Add Project" to add new
- Click "Delete Project" to remove
- Projects with no title won't display on website

## 📸 Adding Images to Projects

You now have **TWO EASY OPTIONS** to add images:

### Method 1: Direct File Upload (Easiest!) ⭐

1. In the Projects tab, find "Project Image" section
2. Click the **"📁 Upload Image"** button
3. Select image from your computer
4. Image instantly appears in preview
5. Click "Save All Changes"

**Requirements:**
- Maximum file size: 2MB
- Supported formats: JPG, PNG, GIF, WebP
- Images are stored in your browser (no external hosting needed!)

**Pro Tips:**
- Compress large images before uploading using: https://tinypng.com
- Use landscape orientation (1200x800px or similar)
- Keep file size under 2MB for best performance

### Method 2: Using Image URL (Alternative)

If you prefer using external hosting:

**Option A: Using Imgur**
1. Go to https://imgur.com
2. Click "New post" (top right)
3. Upload your project photo
4. After upload, right-click the image
5. Select "Copy image address"
6. Paste in "Paste image URL here" field

**Option B: Using ImgBB**
1. Go to https://imgbb.com
2. Click "Start uploading"
3. Upload image
4. Copy the "Direct link"
5. Paste in URL field

**Option C: Using Your Own Hosting**
1. Upload images to your server
2. Use the direct URL
3. Make sure it starts with `https://`

### Removing Images

To remove or change an image:
1. Click the **"✕ Remove Image"** button on the preview
2. Upload a new image or paste a different URL
3. Save changes

### Image Tips:
- Use high-quality, professional photos
- Landscape orientation works best (1200x800px)
- Keep file size under 2MB
- Show your actual work, not stock photos
- Good lighting and composition matter

## 💾 Saving Your Changes

**VERY IMPORTANT:**
1. After making any changes in admin panel
2. Scroll to bottom
3. Click "💾 Save All Changes" button
4. You'll see a green success message
5. Changes will now appear on your website

**What happens when you save:**
- All content is saved to browser's localStorage
- Changes are permanent (won't be lost on refresh)
- Website updates instantly
- All pages reflect new content

## 🔄 Resetting Content

If you want to start over:
1. Click "Reset to Default" button (bottom of admin panel)
2. Confirm the action
3. All content returns to original placeholders
4. You'll need to re-enter everything

**Warning:** This cannot be undone!

## 🎨 Content Best Practices

### Writing Tips:
- **Be Clear**: Use simple, professional language
- **Be Concise**: Keep descriptions brief and impactful
- **Be Consistent**: Maintain same tone across all content
- **Proofread**: Check spelling and grammar

### Image Guidelines:
- Use professional photos of your actual work
- Ensure good lighting and composition
- Show before/after if possible
- Include variety (different rooms, styles)

### SEO Tips:
- Include relevant keywords naturally
- Write descriptive project titles
- Add detailed descriptions
- Keep content updated

## 🔒 Security Tips

1. **Change Default Password**
   - Default: `vastuvriksha2024`
   - Change in `src/pages/Admin.jsx` file
   - Use strong password (mix of letters, numbers, symbols)

2. **Keep Admin Link Private**
   - Don't share `/admin` URL publicly
   - Remove admin link from navbar if needed
   - Only trusted people should access

3. **Regular Backups**
   - Periodically export your content
   - Take screenshots of important data
   - Keep copy of localStorage data

## 📱 Using on Different Devices

**Desktop (Recommended)**
- Full admin experience
- Easier to type and upload images
- Best for major content updates

**Tablet**
- Works well for quick edits
- Slightly cramped interface
- Good for on-the-go updates

**Mobile**
- Functional but not ideal
- Small screen makes editing harder
- Use for urgent small changes only

## ❓ Common Questions

**Q: Do I need to be online to use admin panel?**
A: Yes, initially to load it. But changes save locally.

**Q: Can multiple people edit at same time?**
A: No, only one admin at a time (same browser session).

**Q: Will my changes affect other browsers?**
A: No, each browser has its own localStorage. Make changes in one browser on your main computer.

**Q: What if I make a mistake?**
A: Just edit the field again and save. You can't break anything!

**Q: Can I preview changes before saving?**
A: Not currently. But you can always change back if needed.

**Q: How do I backup my content?**
A: Open browser console (F12), type: `localStorage.getItem('vastuvriksha_content')` and copy the output.

## 🚨 Troubleshooting

**Changes not appearing on website:**
- Did you click "Save All Changes"?
- Try refreshing the page (Ctrl+F5)
- Check if you're logged into admin

**Can't login to admin:**
- Check password (default: vastuvriksha2024)
- Clear browser cache
- Try different browser

**Images not showing:**
- Verify image URL is correct
- Make sure URL starts with http:// or https://
- Check if image host is working
- Try re-uploading to different service

**Lost all content:**
- Don't panic! Content is in browser's localStorage
- Don't clear browser data
- Contact developer if you reset by accident

## 💡 Tips for Success

1. **Start Small**: Add a few projects first, then expand
2. **Update Regularly**: Keep content fresh and current
3. **Use Real Data**: Avoid placeholder text on live site
4. **Test Everything**: Check all pages after major updates
5. **Mobile Check**: View site on phone after editing
6. **Ask for Feedback**: Show to friends/colleagues
7. **Be Patient**: Building good content takes time

## 📞 Getting Help

If you need assistance:
1. Read this guide carefully
2. Check SETUP_GUIDE.md for technical issues
3. Review README.md for development info
4. Check code comments in source files

---

**Happy Editing! Make your portfolio shine! ✨**


