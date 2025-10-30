# Detailed Google Sheets Integration Guide - Step by Step

This is a beginner-friendly guide to connect your contact form to Google Sheets.

---

## PART 1: Find and Open Apps Script

### Step 1: Open Your Google Sheet

1. Open your browser and go to your spreadsheet:
   ```
   https://docs.google.com/spreadsheets/d/131GZQnH0OdXMvfLF-Bk5aLg2T39K14YPSoWDtPnbHSc/edit
   ```

2. Make sure you're logged into the Google account that owns this spreadsheet

### Step 2: Locate Apps Script

**There are TWO ways to find Apps Script:**

#### **METHOD 1 - Using the Menu Bar (Recommended)**

1. Look at the top menu bar of your Google Sheet
2. Click on **"Extensions"** (between "Tools" and "Help")
3. In the dropdown menu, click **"Apps Script"**
4. A new tab will open with the Apps Script editor

#### **METHOD 2 - If you don't see "Extensions"**

Some Google accounts might show it differently:

1. Click on **"Tools"** in the menu bar
2. Look for **"Script editor"** or **"Apps Script"**
3. Click it to open

**Note:** If you still don't see it, your Google Sheets might be in a different language. Look for a menu between "Tools" (🔧) and "Help" (?).

---

## PART 2: Set Up the Apps Script

### Step 3: Create Your Script

Once the Apps Script editor opens (it looks like a code editor):

1. You'll see a file called `Code.gs` on the left
2. There might be some default code like:
   ```javascript
   function myFunction() {
   }
   ```

3. **Select ALL the existing code** (Ctrl+A or Cmd+A)
4. **Delete it**

5. **Copy this ENTIRE code block** and paste it in:

```javascript
function doPost(e) {
  try {
    // Open your spreadsheet - YOUR SPREADSHEET ID IS ALREADY HERE
    var sheet = SpreadsheetApp.openById('131GZQnH0OdXMvfLF-Bk5aLg2T39K14YPSoWDtPnbHSc').getActiveSheet();
    
    // Get the data from the contact form
    var data = JSON.parse(e.postData.contents);
    
    // Create a timestamp
    var timestamp = new Date(data.timestamp);
    
    // Add a new row to the sheet with all the form data
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || ''
    ]);
    
    // Send success message back
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // If there's an error, send error message back
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

6. Click the **💾 Save** icon (or press Ctrl+S / Cmd+S)

7. When it asks for a project name, type: **"Vastuvriksha Contact Form"** and click OK

---

## PART 3: Deploy Your Script as a Web App

### Step 4: Deploy the Script

1. In the Apps Script editor, look at the top right
2. Click the **"Deploy"** button (it's blue, next to "Run")
3. A dropdown will appear - click **"New deployment"**

### Step 5: Configure Deployment Settings

A dialog box will open:

1. **Find the "Select type" section** (left side with a gear icon ⚙️)
2. Click the **gear icon ⚙️** next to "Select type"
3. From the menu that appears, select **"Web app"**

4. Now you'll see deployment settings. Fill them in:

   **Description:** Type: `Contact Form Handler`
   
   **Execute as:** Select **"Me (your.email@gmail.com)"**
   
   **Who has access:** Select **"Anyone"**

5. Click the blue **"Deploy"** button at the bottom

### Step 6: Authorize the Script (IMPORTANT!)

**You'll see a warning screen** - this is NORMAL. Follow these steps:

1. Click **"Authorize access"**

2. A Google account selection screen will appear
   - **Select your account**

3. You'll see a warning: **"Google hasn't verified this app"**
   - This is YOUR script, so it's safe!
   - Click **"Advanced"** (small text at the bottom)
   
4. Then click **"Go to Vastuvriksha Contact Form (unsafe)"**
   - It says "unsafe" but it's YOUR script, so it's fine

5. On the permissions screen, click **"Allow"**

### Step 7: Copy Your Web App URL

After authorization, you'll see a screen that says **"Deployment successfully updated"**

**VERY IMPORTANT:**

1. You'll see a **"Web app"** section with a URL
2. The URL looks like this:
   ```
   https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXX/exec
   ```

3. **Click the copy icon** 📋 next to the URL to copy it
4. **Save this URL somewhere** - you'll need it in the next step!

5. Click **"Done"**

---

## PART 4: Set Up Your Spreadsheet Headers

### Step 8: Add Column Headers

1. **Go back to your Google Sheet** (the spreadsheet tab)

2. In **Row 1** (the first row), add these headers:
   - **A1:** Timestamp
   - **B1:** Name
   - **C1:** Email
   - **D1:** Phone
   - **E1:** Subject
   - **F1:** Message

3. **Make them bold** (select the row and press Ctrl+B / Cmd+B)

Your sheet should look like this:

| Timestamp | Name | Email | Phone | Subject | Message |
|-----------|------|-------|-------|---------|---------|
|           |      |       |       |         |         |

---

## PART 5: Connect to Your Website

### Step 9: Update Your Website Code

1. **Open your code editor** (VS Code or Cursor)

2. **Navigate to this file:**
   ```
   src/pages/Contact.jsx
   ```

3. **Find line 34** - it looks like this:
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

4. **Replace it** with your copied URL:
   ```javascript
   const scriptURL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```
   
   **Example:**
   ```javascript
   const scriptURL = 'https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXX/exec';
   ```

5. **Save the file** (Ctrl+S / Cmd+S)

---

## PART 6: Test Everything

### Step 10: Test Your Contact Form

1. **Make sure your website is running:**
   ```bash
   npm run dev
   ```

2. **Open your website** in the browser (usually http://localhost:5173)

3. **Go to the Contact page**

4. **Fill out the form with test data:**
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Subject: Testing
   - Message: This is a test message

5. **Click "Send Message"**

6. You should see: **"⏳ Sending your message..."** then **"✅ Thank you! Your message has been received."**

7. **Go back to your Google Sheet** and refresh the page

8. **You should see your test submission** in row 2!

---

## TROUBLESHOOTING

### Problem: "Can't find Extensions menu"

**Solution:**
- Your Google Sheets might be in a different language
- Look for a menu between "Tools" (🔧 icon) and "Help" (? icon)
- Or try: Tools → Script editor

### Problem: "Permission denied when opening spreadsheet"

**Solution:**
- Make sure you're logged into the correct Google account
- Make sure you own this spreadsheet
- Try re-authorizing: Deploy → Manage deployments → Edit → Authorize again

### Problem: "No data appears in the sheet"

**Solution:**
1. Check if the URL in Contact.jsx is correct (must end with `/exec`)
2. Go to Apps Script → Executions (clock icon) to see if script ran
3. Make sure you selected "Anyone" in "Who has access"
4. Check browser console for errors (Press F12)

### Problem: "Script error when submitting form"

**Solution:**
1. Make sure the spreadsheet ID in the script is correct: `131GZQnH0OdXMvfLF-Bk5aLg2T39K14YPSoWDtPnbHSc`
2. Check that column headers are in Row 1
3. Go to Apps Script → View → Logs to see error messages

---

## Video Tutorial Reference

If you're still having trouble, search YouTube for: **"Google Sheets Apps Script Web App Tutorial"**

Or follow this sequence:
1. Google Sheets
2. Extensions → Apps Script
3. Paste code
4. Deploy → New deployment → Web app
5. Authorize
6. Copy URL
7. Paste in website code

---

## Need More Help?

If you're stuck at any step, please let me know:
- Which step are you on?
- What do you see on your screen?
- Any error messages?

I'll help you through it! 🙂

