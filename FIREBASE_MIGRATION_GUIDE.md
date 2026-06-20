# Firebase Authentication Migration Guide

## Overview
The authentication system has been successfully migrated from server-db.json to Firebase Authentication and Firestore.

## Changes Made

### 1. New Files Created
- `src/firebase.ts` - Firebase configuration and initialization
- `src/services/authService.ts` - Authentication service utilities
- `src/data/blogPosts.ts` - Static blog post data (removed server-db.json dependency)

### 2. Files Modified
- `src/components/Dashboard.tsx` - Updated to use Firebase Auth instead of API calls
- `src/App.tsx` - Updated to use Firebase Auth state management
- `.env.example` - Added Firebase configuration variables

### 3. Dependencies Added
- `firebase` - Firebase SDK for web

## Firebase Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider

### Step 2: Create Firestore Database
1. Go to Firestore Database
2. Create database (start in production mode or test mode)
3. Set up security rules (see below)

### Step 3: Get Firebase Configuration
1. Go to Project Settings > General > Your apps
2. Register a web app
3. Copy the firebaseConfig object values

### Step 4: Configure Environment Variables
Create a `.env.local` file in the project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

### Step 5: Set Initial Admin User
After setting up Firebase, create an initial admin user in Firestore:

```javascript
// Run this in Firebase Console Firestore or use the Firebase SDK
const adminUser = {
  uid: "admin-uid",
  name: "Chef Varshini",
  email: "admin@sweetdelights.com",
  role: "admin",
  createdAt: new Date(),
  addresses: [
    {
      id: "addr-1",
      street: "100 Luxury Avenue, Ghee Corner",
      city: "Bengaluru",
      postalCode: "560001",
      phone: "+91 98765 43210",
      isDefault: true
    }
  ],
  wishlist: []
};
```

## Firestore Security Rules

Add these security rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Preserved

✅ Email/Password Registration
✅ Email/Password Login  
✅ Logout functionality
✅ Persistent sessions (Firebase Auth handles this automatically)
✅ User profile storage in Firestore
✅ Admin role support
✅ Address management
✅ Wishlist functionality
✅ Order history
✅ Event planner requests

## Error Handling

The new system provides specific Firebase error messages:
- Email already in use
- Invalid email format
- Weak password
- User not found
- Wrong password
- Too many requests
- And more...

## Vercel Deployment

For Vercel deployment, add the Firebase environment variables in your Vercel project settings:
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add all VITE_FIREBASE_* variables
3. Redeploy the application

## Testing

1. Start the development server: `npm run dev`
2. Test registration with a new email
3. Test login with registered credentials
4. Test logout functionality
5. Verify user profile data is stored in Firestore
6. Test address management
7. Test wishlist functionality

## Notes

- The old server-db.json authentication endpoints are no longer used
- User data is now stored in Firestore under the `users` collection
- Authentication state is managed by Firebase Auth SDK
- The application is now fully compatible with Vercel deployment
- No local filesystem dependencies for authentication
