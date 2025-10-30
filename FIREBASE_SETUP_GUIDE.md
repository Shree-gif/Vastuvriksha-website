# 🔥 Firebase Setup Guide for Vastuvriksha Website

## ✅ What We've Done:

1. ✅ Installed Firebase package
2. ✅ Created Firebase configuration file
3. ✅ Created Firebase service for project management
4. ✅ Updated Projects page to use Firebase Storage & Firestore

## 🎯 What You Need to Do:

Follow these steps to create your Firebase project and connect it to your website.

---

## STEP 1: Create a Firebase Project

### 1.1 Go to Firebase Console

**Open:** [https://console.firebase.google.com/](https://console.firebase.google.com/)

### 1.2 Sign In

- Use your **Google account** (same one you used for Google Sheets)
- Click **"Go to console"**

### 1.3 Create New Project

1. Click **"Add project"** or **"Create a project"**
2. **Project name:** Type `Vastuvriksha` (or any name you prefer)
3. Click **"Continue"**
4. **Google Analytics:** You can disable it or leave it on (not required)
5. Click **"Create project"**
6. Wait 30 seconds for Firebase to set up
7. Click **"Continue"** when ready

---

## STEP 2: Register Your Web App

### 2.1 Add Web App

1. On the project homepage, click the **</> (Web icon)** button
2. **App nickname:** Type `Vastuvriksha Website`
3. **Firebase Hosting:** Leave unchecked (we'll use Netlify/Vercel)
4. Click **"Register app"**

### 2.2 Copy Your Configuration

You'll see a code snippet that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "vastuvriksha-xxxxx.firebaseapp.com",
  projectId: "vastuvriksha-xxxxx",
  storageBucket: "vastuvriksha-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**📋 COPY these values!** We'll need them in the next step.

5. Click **"Continue to console"**

---

## STEP 3: Enable Firestore Database

### 3.1 Create Database

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. **Select location:** Choose closest to India (e.g., `asia-south1` Mumbai or `asia-southeast1` Singapore)
4. Click **"Next"**

### 3.2 Set Security Rules

1. Select **"Start in test mode"** (we'll secure it properly in a moment)
2. Click **"Enable"**
3. Wait for database creation (30 seconds)

### 3.3 Update Security Rules

1. Click the **"Rules"** tab
2. Replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all projects
    match /projects/{projectId} {
      allow read: if true;
      allow write: if true; // For now - we'll add authentication later
    }
  }
}
```

3. Click **"Publish"**

---

## STEP 4: Enable Firebase Storage

### 4.1 Create Storage

1. In the left sidebar, click **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Click **"Next"** (keep default rules for now)
4. **Select location:** Choose the SAME location you chose for Firestore
5. Click **"Done"**

### 4.2 Update Storage Rules

1. Click the **"Rules"** tab
2. Replace the existing rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{allPaths=**} {
      // Allow anyone to read project images
      allow read: if true;
      // Allow anyone to write (upload) - we'll secure this later
      allow write: if true;
    }
  }
}
```

3. Click **"Publish"**

---

## STEP 5: Update Your Website Configuration

### 5.1 Open Your Config File

In your project folder, open:
```
src/firebase/config.js
```

### 5.2 Replace Configuration Values

Replace the placeholder values with YOUR values from Step 2.2:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",              // Replace with your actual apiKey
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace with your actual authDomain
  projectId: "YOUR_PROJECT_ID",             // Replace with your actual projectId
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Replace with your actual storageBucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace with your actual messagingSenderId
  appId: "YOUR_APP_ID"                      // Replace with your actual appId
};
```

**Example of filled values:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC4bP8xKj9N2qL7mR3tS5vW1xY2zA3bC4d",
  authDomain: "vastuvriksha-a1b2c.firebaseapp.com",
  projectId: "vastuvriksha-a1b2c",
  storageBucket: "vastuvriksha-a1b2c.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9"
};
```

### 5.3 Save the File

Press **Ctrl+S** (or **Cmd+S** on Mac) to save.

---

## STEP 6: Test Your Setup

### 6.1 Restart Your Development Server

1. **Stop the current server** (Press Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

### 6.2 Test Admin Upload

1. Open your website: `http://localhost:5173/projects`
2. Click **"+ Add New Project"** button
3. Fill in the form:
   - **Title:** Test Project
   - **Category:** Residential
   - **Status:** Completed
   - **Location:** Mumbai
   - **Year:** 2025
   - **Description:** This is a test project
   - **Image:** Upload any image from your computer
4. Click **"Add Project"**
5. Wait for upload (you'll see "Uploading...")
6. You should see: **"Project added successfully!"**

### 6.3 Verify in Firebase Console

1. Go back to Firebase Console: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click on your project
3. Go to **"Firestore Database"**
4. You should see a **"projects"** collection with your test project
5. Go to **"Storage"**
6. You should see a **"projects"** folder with your uploaded image

---

## ✅ Success! What Now?

### **Your Admin Panel is Live!**

Now you can:
- ✅ Upload projects from ANY device
- ✅ Projects appear for ALL visitors
- ✅ Images stored permanently in Firebase
- ✅ No data loss when clearing browser

### **From Any Device:**

1. Go to: `yourwebsite.com/projects` (or `localhost:5173/projects`)
2. Click **"+ Add New Project"**
3. Upload project details and image
4. Done! Everyone can see it instantly

---

## 🔒 IMPORTANT: Security (Do This Later)

Right now, ANYONE can upload projects. This is fine for testing, but before going live publicly:

### **Option 1: Simple Password Protection (Quick)**

We can add a simple admin password to the website.

### **Option 2: Firebase Authentication (Proper)**

Set up real login with email/password or Google Sign-In.

**Let me know when you're ready, and I'll implement proper authentication!**

---

## 🆘 Troubleshooting

### **Error: "Failed to load projects"**

**Solution:**
1. Check that you replaced ALL values in `src/firebase/config.js`
2. Make sure you published the Firestore and Storage rules
3. Check browser console (F12) for specific error messages

### **Error: "Permission denied"**

**Solution:**
1. Go to Firestore → Rules
2. Make sure you have `allow read: if true;` and `allow write: if true;`
3. Click "Publish"

### **Images not uploading**

**Solution:**
1. Go to Storage → Rules
2. Make sure you have `allow read: if true;` and `allow write: if true;`
3. Click "Publish"
4. Check that Storage is enabled

### **"Firebase: No Firebase App"**

**Solution:**
1. Make sure you saved `src/firebase/config.js`
2. Restart the development server: Stop (Ctrl+C) and run `npm run dev` again

---

## 📞 Need Help?

If you get stuck at any step:
1. Take a screenshot of the error
2. Tell me which step you're on
3. I'll help you fix it!

---

## 🎉 You're Almost Done!

Once Firebase is connected:
1. Test the admin upload
2. Deploy to Netlify/Vercel
3. Your website is LIVE with full functionality!

Let me know how it goes! 🚀

