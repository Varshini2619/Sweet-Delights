# Sweet Delights - Luxury Bakery E-Commerce Platform

A full-stack bakery e-commerce application with AI-powered features, built with React, Node.js, Express, and Firebase.

## Features

- **Product Catalog**: Browse cakes, sweets, savouries, and more
- **Custom Orders**: Request custom cakes for special events
- **Event Planning**: Plan weddings, birthdays, and corporate events
- **Shopping Cart**: Add products, apply coupons, checkout
- **Wishlist**: Save favorite products for later
- **Reviews**: Rate and review products
- **Blog**: Read baking tips and behind-the-scenes content
- **AI Chatbot**: Get instant help with bakery-related questions
- **Admin Panel**: Manage products, orders, events, and coupons

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Firebase (Firestore & Authentication)
- **AI**: Google Gemini (optional for chatbot)
- **Deployment**: Render

## Prerequisites

- Node.js 18 or higher
- Firebase account
- Render account (for deployment)

## Getting Started

### 1. Clone the repository
```bash
cd D:\varshu\project\Sweet-Delight
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Get your Firebase config from Project Settings
6. Update `.env.local` with your Firebase credentials

### 4. Set environment variables
Create or update `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_key (optional)
```

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser

## Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Create Render Service**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repository
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

3. **Add Environment Variables**
   - Add all Firebase variables
   - Add `NODE_ENV=production`

4. **Deploy**
   - Render will auto-deploy on push

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Documentation

- [PROJECT_GUIDE.md](PROJECT_GUIDE.md) - Complete project guide with all features
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment instructions
- [FIREBASE_SETUP_DETAILED_GUIDE.md](FIREBASE_SETUP_DETAILED_GUIDE.md) - Firebase configuration guide

## Default Credentials

**Admin:**
- Email: admin@sweetdelights.com
- Password: admin123

**Test User:**
- Email: user@sweetdelights.com
- Password: user123

## Available Coupon Codes

- SWEET10: 10% off (min order ₹40)
- DELIGHTS20: 20% off (min order ₹100)
- WELCOME5: ₹5 flat discount (min order ₹20)

## Security Features

- Helmet middleware for HTTP security headers
- Rate limiting to prevent abuse
- Content Security Policy (CSP)
- Firebase Authentication
- Environment variable protection

## License

This is a private project. All rights reserved.
