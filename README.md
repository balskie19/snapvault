# SnapVault 📱☁️
> Back up your iPhone photos & videos. Free your storage instantly.

---

## 🚀 Deploy to Vercel in 5 Minutes (No Coding Needed)

### Step 1 — Create a Free GitHub Account
1. Go to **https://github.com**
2. Click **Sign Up** — it's free
3. Verify your email

---

### Step 2 — Upload the Project to GitHub
1. Once logged in, click the **+** icon (top right) → **New repository**
2. Name it `snapvault`
3. Leave everything else as default
4. Click **Create repository**
5. On the next page, click **uploading an existing file**
6. Drag and drop the entire `snapvault` folder contents:
   - `public/` folder
   - `src/` folder
   - `package.json`
   - `README.md`
7. Scroll down, click **Commit changes**

---

### Step 3 — Create a Free Vercel Account
1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** — this links both accounts

---

### Step 4 — Deploy the App
1. On your Vercel dashboard, click **Add New → Project**
2. Find your `snapvault` repo and click **Import**
3. Vercel will auto-detect it as a React app
4. Click **Deploy** — that's it!
5. In about 60 seconds you'll get a live URL like:
   `https://snapvault.vercel.app`

---

### Step 5 — Open on iPhone
1. Open **Safari** on iPhone (must be Safari, not Chrome)
2. Go to your Vercel URL
3. Tap the **Share** button (box with arrow pointing up)
4. Tap **Add to Home Screen**
5. Tap **Add**

✅ SnapVault now appears on your iPhone home screen like a real app!

---

## 📁 Project Structure

```
snapvault/
├── public/
│   ├── index.html        ← App shell with mobile meta tags
│   └── manifest.json     ← PWA config for Add to Home Screen
├── src/
│   ├── App.jsx           ← Full app (all screens & logic)
│   └── index.js          ← React entry point
├── package.json          ← Dependencies
└── README.md             ← This file
```

---

## 🛠️ Run Locally (Optional)

If you want to run the app on your computer first:

```bash
# Install Node.js from https://nodejs.org (LTS version)

# Then in your terminal:
cd snapvault
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔮 Phase 2 — Backend (Coming Next)

The current app is a working UI prototype with mock data.
The next phase will connect real functionality using **Supabase** (free):

| Feature | Status |
|---|---|
| User login / signup | 🔜 Phase 2 |
| Real photo upload | 🔜 Phase 2 |
| Cloud storage | 🔜 Phase 2 |
| Real gallery | 🔜 Phase 2 |
| Delete files | 🔜 Phase 2 |

---

## 📱 App Screens

| Screen | Description |
|---|---|
| Onboarding | 3-slide intro for new users |
| Login / Sign Up | Email + Apple Sign In |
| Home | Storage meter + main menu |
| Browse & Select | Pick photos/videos to back up |
| Backup | Choose destination + progress |
| Cloud Gallery | View, search, delete backed-up files |
| Plans | Free / Plus / Pro comparison |
| Settings | Toggles, dark mode, plan upgrade |

---

## 🎨 Tech Stack

- **Frontend**: React 18
- **Fonts**: Nunito + Nunito Sans (Google Fonts)
- **Hosting**: Vercel (free)
- **Backend (Phase 2)**: Supabase

---

Built with SnapVault © 2026
