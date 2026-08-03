# Matrix Stationery & Xerox — Billing App

A free, mobile-friendly billing & inventory app for your shop. Single HTML app,
synced live across devices with Firebase (free Spark plan).

## Files to upload to GitHub (all 4, same folder)
- `index.html` — the app
- `manifest.json` — lets you "Add to Home Screen" like a real app
- `sw.js` — lets the app shell load even with a weak connection
- `README.md` — this file (optional to upload, just for your reference)

## 1. Firebase console setup (one-time, ~5 minutes)

Go to https://console.firebase.google.com → your project **my-matrix-xerox**.

**A. Enable Firestore**
- Left menu → *Build → Firestore Database* → *Create database* → Start in **production mode** → pick a region close to India (e.g. `asia-south1`).

**B. Enable Storage**
- Left menu → *Build → Storage* → *Get started* → keep default settings.

**C. Enable Anonymous sign-in** (lets the app connect without a login screen, while still keeping randoms off your data)
- Left menu → *Build → Authentication* → *Get started* → *Sign-in method* tab → enable **Anonymous**.

**D. Set security rules**

Firestore rules (*Firestore Database → Rules* tab) — replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Storage rules (*Storage → Rules* tab) — replace with:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Click **Publish** on both.

> Note: your Firebase `apiKey` in the code is not a secret — it's meant to be
> public in web apps. The rules above are what actually protect your data
> (only signed-in app users, i.e. anyone who opens your published app, can
> read/write). For a small single-shop tool this is a reasonable, free setup.

## 2. Put it on GitHub Pages

1. Create a new GitHub repository (e.g. `matrix-billing`).
2. Upload `index.html`, `manifest.json`, and `sw.js` to the root of the repo.
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `root` → Save.
4. After a minute, your app is live at `https://<your-username>.github.io/matrix-billing/`.

## 3. Add it to your phone's home screen

- **Android (Chrome):** open the link → menu (⋮) → *Add to Home screen* / *Install app*.
- **iPhone (Safari):** open the link → Share icon → *Add to Home Screen*.

It'll open full-screen like a normal app, and data stays in sync with whatever device you use next — desktop, staff phone, or your own.

## 4. First-time setup inside the app

1. Tap the ⚙️ icon → set your shop name, upload your logo, and (when ready) upload your payment QR code.
2. Go to **Items** → tap **＋** → add your products with photos, stock rate, MRP, category, and stock quantity.
3. You're ready to bill — go to **Bill**, tap items to add them to the cart, then **Pay Now**.

## Notes on this version
- Tax/GST is **not** applied on bills, per your setup — MRP Rate is used as the selling price. If you want GST added later, this is a small addition.
- Currency is set to ₹ (INR).
- Low stock alert threshold is set to **less than 5** by default — change it anytime in Settings.
- Reports (Daily/Monthly) calculate revenue (MRP × qty), cost (Stock Rate × qty), and profit, and can be downloaded as a CSV (opens fine in Excel/Google Sheets).
