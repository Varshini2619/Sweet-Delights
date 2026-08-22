# Sweet Delights - Complete Project Guide

## What is Sweet Delights?

Sweet Delights is a luxury bakery e-commerce platform with AI-powered features. It's a full-stack application that allows customers to browse, order, and customize bakery products online.

## Key Features

### For Customers
- **Product Catalog**: Browse cakes, sweets, savouries, and more
- **Custom Orders**: Request custom cakes for special events
- **Event Planning**: Plan weddings, birthdays, and corporate events
- **Shopping Cart**: Add products, apply coupons, checkout
- **Wishlist**: Save favorite products for later
- **Reviews**: Rate and review products
- **Blog**: Read baking tips and behind-the-scenes content
- **AI Chatbot**: Get instant help with bakery-related questions

### For Admin
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **Event Requests**: Manage event planning requests
- **Coupon Management**: Create and manage discount coupons
- **Blog Management**: Publish and manage blog posts
- **User Management**: View and manage customer accounts

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Firebase (Firestore for data, Authentication for users)
- **AI**: Google Gemini for chatbot (optional)
- **Deployment**: Render (recommended)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Git
- Firebase account
- Render account (for deployment)

### Step 1: Clone/Download the Project
```bash
cd D:\varshu\project\Sweet-Delight
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Firebase
1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Get your Firebase config from Project Settings
6. Update `.env.local` with your Firebase credentials

### Step 4: Set Environment Variables
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

### Step 5: Run Locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser

## What You Can Do

### As a Customer

1. **Browse Products**
   - Navigate through categories (Cakes, Sweets, Savouries, etc.)
   - Filter by category, sort by popularity/price
   - Search for specific products

2. **View Product Details**
   - Click on any product to see details
   - View ingredients, weights available
   - Read customer reviews
   - Add to cart or wishlist

3. **Place Orders**
   - Add products to cart
   - Apply coupon codes (SWEET10, DELIGHTS20, WELCOME5)
   - Checkout with address details
   - Track order status

4. **Plan Events**
   - Use Event Planner for weddings, birthdays, corporate events
   - Specify date, guest count, budget
   - Get AI-powered suggestions
   - Submit request for custom quote

5. **Use AI Chatbot**
   - Ask baking questions
   - Get product recommendations
   - Get event planning tips
   - (Works with or without Gemini API key)

### As an Admin

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to Admin tab

2. **Manage Products**
   - Add new products with images
   - Edit existing products
   - Delete products
   - Update prices and descriptions

3. **Manage Orders**
   - View all customer orders
   - Update order status (Pending → Processing → Delivered)
   - View order details

4. **Manage Events**
   - View event planning requests
   - Update request status
   - Add notes for customers

5. **Manage Coupons**
   - Create new discount codes
   - Set expiry dates
   - Configure discount types (percentage/flat)

6. **Manage Blog**
   - Publish new blog posts
   - Edit existing posts
   - Manage comments

## Deployment

### Deploy to Render (Recommended)

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
   - Add NODE_ENV=production

4. **Deploy**
   - Render will auto-deploy on push

See `DEPLOYMENT.md` for detailed instructions.

## Project Structure

```
Sweet-Delight/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── data.ts              # Product data
│   ├── types.ts             # TypeScript types
│   ├── firebase.ts          # Firebase configuration
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── EventPlanner.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── CartList.tsx
│   │   └── ...
│   └── services/            # API services
│       └── authService.ts
├── server.ts                # Express server
├── package.json             # Dependencies
├── render.yaml              # Render configuration
├── DEPLOYMENT.md            # Deployment guide
└── PROJECT_GUIDE.md         # This file
```

## Default Admin Credentials

- Email: admin@sweetdelights.com
- Password: admin123

## Default Test User

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

## Troubleshooting

### Build Fails
- Ensure Node.js 18+ is installed
- Run `npm install` to update dependencies
- Check for TypeScript errors

### Firebase Not Working
- Verify Firebase credentials in `.env.local`
- Check Firebase Console for enabled services
- Ensure Firestore rules allow read/write

### Deployment Fails
- Check Render logs for errors
- Ensure all environment variables are set
- Verify build command is correct

### Images Not Loading
- Check image URLs in data.ts
- Ensure images are accessible
- Verify Firebase Storage if using it

## Next Steps

1. **Set up Firebase** - Create project and get credentials
2. **Configure Environment** - Update `.env.local` with Firebase keys
3. **Run Locally** - Test all features locally
4. **Customize Products** - Add your own products via Admin Panel
5. **Deploy** - Follow DEPLOYMENT.md to deploy to Render
6. **Monitor** - Check Render logs and Firebase Console

## Support

- Render docs: https://render.com/docs
- Firebase docs: https://firebase.google.com/docs
- For issues: Check logs in Render dashboard or Firebase Console

## License

This is a private project. All rights reserved.
