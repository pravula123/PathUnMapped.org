# Firebase Deployment Instructions for unmapped.org

1. Build your Vite project for production:
   npm run build

2. Install Firebase CLI if you haven't already:
   npm install -g firebase-tools

3. Login to Firebase:
   firebase login

4. Initialize Firebase in this folder (if not already):
   firebase init hosting
   # (Choose 'dist' as the public directory, configure as a single-page app, skip overwrite)

5. Deploy to Firebase Hosting:
   firebase deploy

---

- The dist/ folder will be created by the Vite build and is set as the public directory in firebase.json.
- All routes are rewritten to index.html for SPA support.
