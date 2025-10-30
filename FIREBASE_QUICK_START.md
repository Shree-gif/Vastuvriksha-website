# 🚀 Firebase Quick Start - Do This Now!

## 📋 Quick Checklist:

### Step 1: Create Firebase Project (5 minutes)
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click "Add project" → Name it "Vastuvriksha" → Create
3. Click </> Web icon → Name it "Vastuvriksha Website" → Register

### Step 2: Copy Your Config (1 minute)
You'll see something like this - **COPY IT:**
```
apiKey: "AIzaSy..."
authDomain: "vastuvriksha-xxx.firebaseapp.com"
projectId: "vastuvriksha-xxx"
storageBucket: "vastuvriksha-xxx.appspot.com"
messagingSenderId: "123456..."
appId: "1:123456..."
```

### Step 3: Enable Firestore (2 minutes)
1. Sidebar → "Firestore Database" → "Create database"
2. Choose location: **Mumbai (asia-south1)** or **Singapore**
3. Start in **"test mode"** → Enable

### Step 4: Enable Storage (2 minutes)
1. Sidebar → "Storage" → "Get started"
2. **Same location** as Firestore → Done

### Step 5: Update Your Website (1 minute)
1. Open: `src/firebase/config.js`
2. Replace the values with YOUR copied config
3. Save the file (Ctrl+S)

### Step 6: Test It! (2 minutes)
1. Restart server: Stop (Ctrl+C) and run `npm run dev`
2. Go to: `http://localhost:5173/projects`
3. Click "+ Add New Project"
4. Upload a test project with image
5. Should say "Project added successfully!"

---

## ✅ That's It!

**Total time: ~15 minutes**

Your admin panel will be fully functional and ready to deploy!

---

## 📖 Need Detailed Instructions?

Open `FIREBASE_SETUP_GUIDE.md` for step-by-step instructions with screenshots and troubleshooting.

---

## 🆘 Got an Error?

**Most common:** "Failed to load projects"
- **Fix:** Make sure you updated `src/firebase/config.js` with YOUR values from Firebase Console

**Still stuck?** Tell me the error message and I'll help! 💪

