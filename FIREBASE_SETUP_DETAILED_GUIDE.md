# Firebase Setup - Detailed Step-by-Step Guide

This guide explains each step in detail to help you set up Firebase for the Sweet Delights application.

## Step 1: Create a Firebase Project

### What is Firebase?
Firebase is Google's platform for building web and mobile applications. It provides services like authentication, database, hosting, etc. We'll use it for user authentication and storing user data.

### How to create a project:

1. **Go to Firebase Console**
   - Open your web browser
   - Go to: https://console.firebase.google.com/
   - Sign in with your Google account (create one if you don't have one)

2. **Create a new project**
   - Click the "Add project" button (usually a big "+" sign)
   - Enter a project name (e.g., "sweet-delights-app")
   - You can optionally enable Google Analytics (not required for this app)
   - Click "Continue"
   - Accept the Firebase terms if prompted
   - Click "Create project"
   - Wait for Firebase to create your project (takes 10-30 seconds)
   - Click "Continue" when project is ready

3. **You should now see your project dashboard**

## Step 2: Enable Email/Password Authentication

### What is Authentication?
Authentication allows users to sign up and log in to your application. We're using Email/Password authentication, which means users will register with their email and password.

### How to enable it:

1. **Go to Authentication section**
   - In your Firebase project dashboard
   - Click on "Authentication" in the left sidebar (under "Build" section)
   - You'll see a "Get started" button if it's your first time

2. **Enable Email/Password provider**
   - Click on the "Sign-in method" tab
   - You'll see a list of sign-in providers (Google, Email/Password, etc.)
   - Find "Email/Password" and click on it
   - Toggle the "Enable" switch to ON
   - Click "Save"
   - You don't need to enable "Email link (passwordless sign-in)" - just the standard Email/Password

## Step 3: Create Firestore Database

### What is Firestore?
Firestore is a cloud database (like a more advanced version of server-db.json). It stores user data, addresses, wishlist items, etc. It's managed by Google, so it works on Vercel without local file issues.

### How to create it:

1. **Go to Firestore Database**
   - In your Firebase project dashboard
   - Click on "Firestore Database" in the left sidebar (under "Build" section)

2. **Create database**
   - Click "Create database"
   - You'll be asked to choose a location
   - Select a location close to your users (e.g., "nam5 (us-central)" for North America)
   - Click "Next"

3. **Choose security rules**
   - You'll see two options: "Start in Test Mode" or "Start in Production Mode"
   - **Choose "Start in Test Mode"** for now (easier for development)
   - Test mode allows read/write access for 30 days
   - We'll add proper security rules later
   - Click "Enable"

4. **Database is now ready**
   - You'll see an empty database interface
   - No collections or documents yet (that's normal)

## Step 4: Get Firebase Configuration Values

### What are these values?
These are like API keys that connect your application to your Firebase project. Without them, your app doesn't know which Firebase project to use.

### How to get them:

1. **Go to Project Settings**
   - In your Firebase project dashboard
   - Click the gear icon (⚙️) next to "Project Overview" in the top left
   - Select "Project settings"

2. **Register a web app**
   - Scroll down to "Your apps" section
   - Click the "</>" icon (web app icon)
   - Enter an app name (e.g., "Sweet Delights Web")
   - **Don't check "Firebase Hosting"** (we're using Vercel, not Firebase Hosting)
   - Click "Register app"

3. **Copy the configuration**
   - You'll see a code block with `firebaseConfig` object
   - It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
   - Copy these values - you'll need them for the next step

## Step 5: Add Firebase Config to .env.local

### What is .env.local?
This is a file that stores environment variables (secret configuration) for your application. It's not committed to Git, so your secrets stay safe.

### How to create it:

1. **Create the file**
   - In your project folder (Sweet-Delight)
   - Create a new file named `.env.local`
   - Make sure it's in the root folder (same level as package.json)

2. **Add the Firebase values**
   - Open `.env.local` in your text editor
   - Add the following lines with your actual Firebase values:
   ```env
   VITE_FIREBASE_API_KEY="AIzaSy...your-actual-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
   VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
   ```
   - Replace the placeholder values with the ones you copied from Firebase
   - Keep the quotes around the values
   - Make sure there are no extra spaces

3. **Restart your development server**
   - Stop the current server (Ctrl+C in terminal)
   - Start it again: `npm run dev`
   - This ensures the new environment variables are loaded

## Step 6: Set Up Initial Admin User

### Why do we need this?
The application has an admin role for special features (like managing products). We need to create an initial admin user so you can access admin features.

### How to do it:

**Option 1: Using Firebase Console (Easier)**

1. **Register the admin user through your app**
   - Start your application: `npm run dev`
   - Go to the Dashboard section
   - Click "Register"
   - Enter admin details:
     - Name: "Chef Varshini"
     - Email: "admin@sweetdelights.com"
     - Password: "admin123" (or your preferred password)
   - Click "Register & Sign In"

2. **Get the user UID**
   - Go to Firebase Console > Authentication
   - You'll see the newly created user
   - Copy the "User UID" (it looks like a random string)

3. **Update the user role in Firestore**
   - Go to Firebase Console > Firestore Database
   - Click "Start collection"
   - Collection ID: `users`
   - Document ID: paste the User UID you copied
   - Add the following fields:
     - `name`: "Chef Varshini" (string)
     - `email`: "admin@sweetdelights.com" (string)
     - `role`: "admin" (string)
     - `createdAt`: (timestamp - click the clock icon)
     - `addresses`: (array - leave empty for now)
     - `wishlist`: (array - leave empty for now)
   - Click "Save"

**Option 2: Using Firebase Console Directly**

1. **Go to Firestore Database**
2. **Click "Start collection"**
3. **Collection ID**: `users`
4. **Document ID**: `admin-uid` (or any ID you prefer)
5. **Add fields**:
   - `name`: "Chef Varshini" (string)
   - `email`: "admin@sweetdelights.com" (string)
   - `role`: "admin" (string)
   - `createdAt`: (timestamp)
   - `addresses`: [] (array)
   - `wishlist`: [] (array)
6. **Then create the auth user separately in Authentication section**

## Step 7: Configure Firestore Security Rules

### What are security rules?
Security rules control who can read/write data in your database. They protect your data from unauthorized access.

### How to configure them:

1. **Go to Firestore Rules**
   - In Firebase Console > Firestore Database
   - Click the "Rules" tab (next to "Data" tab)

2. **Replace the default rules**
   - Delete the existing rules
   - Paste these rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         // Users can only read/write their own data
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

3. **Publish the rules**
   - Click "Publish"
   - The rules are now active

### What these rules do:
- `request.auth != null` - User must be logged in
- `request.auth.uid == userId` - User can only access their own data
- This prevents users from accessing other users' data

## Testing Your Setup

### Test Registration:
1. Open your app (http://localhost:3000)
2. Go to Dashboard
3. Click "Register"
4. Enter a new email and password
5. Submit the form
6. You should see a success message

### Test Login:
1. Logout if you're logged in
2. Enter the email and password you just registered
3. Click "Sign In"
4. You should see the dashboard with your name

### Test Firestore:
1. Go to Firebase Console > Firestore Database
2. Click on the "users" collection
3. You should see your user document with the data you entered

## Troubleshooting

### "FirebaseError: Missing or insufficient permissions"
- This means your security rules are blocking access
- Check that you're logged in
- Check that the rules allow access for authenticated users

### "FirebaseError: No Firebase App '[DEFAULT]' has been created"
- This means Firebase isn't initialized properly
- Check your .env.local file has the correct values
- Restart your development server

### "Email already in use"
- This email is already registered in Firebase
- Use a different email or delete the existing user in Firebase Console

## Next Steps After Setup

Once Firebase is working:
1. Test all authentication features
2. Test address management
3. Test wishlist functionality
4. Deploy to Vercel with environment variables
5. Update Firestore security rules for production (more restrictive)

## Need Help?

If you get stuck at any step:
1. Check the Firebase documentation: https://firebase.google.com/docs
2. Make sure you copied the config values correctly
3. Ensure your .env.local file is in the right location
4. Restart your development server after changing environment variables
