# Sweet Delights Deployment Guide

This guide covers deploying the Sweet Delights application as a monolithic full-stack application on Render for simplicity and reliability.

## Prerequisites

- GitHub account with the project repository
- Render account (free)
- Firebase project configured
- Gemini AI API key

## Deployment to Render (Monolithic)

### Step 1: Push to GitHub
Ensure your code is pushed to a GitHub repository.

### Step 2: Connect Render
1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub account
4. Select the Sweet Delights repository
5. Configure:
   - Name: sweet-delights
   - Runtime: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Node version: 18

### Step 3: Set Environment Variables
In Render dashboard → Environment:
```
APP_URL=https://your-render-url.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
NODE_ENV=production
```

**Note:** GEMINI_API_KEY is optional. The app will work without it using fallback responses. PORT is automatically set by Render.

### Step 4: Deploy
Click "Create Web Service". Render will automatically deploy on every push to main branch.

## Post-Deployment Configuration

### Firebase Configuration
Ensure Firebase is configured for your production domain:
1. Go to Firebase Console → Authentication → Authorized domains
2. Add your Render URL (e.g., https://sweet-delights.onrender.com)
3. Update Firebase Storage rules if needed

### Update APP_URL
After deployment, update the `APP_URL` environment variable in Render to match your actual Render URL.

## Troubleshooting

### Build Fails
- Check Node version is set to 18
- Ensure all dependencies are in package.json
- Check build logs for specific errors

### Environment Variables Not Working
- Ensure variables are set in Render dashboard
- Variable names must match exactly
- Restart the service after adding variables

### API Calls Failing
- Check CORS settings in backend
- Verify APP_URL is correct
- Check Firebase authentication is configured

### Images Not Loading
- Ensure image paths are correct
- Check if images are in public folder
- Verify Firebase Storage is configured

## Security Features

The application includes the following security measures:

### 1. Security Headers
- Helmet middleware for HTTP security headers
- Content Security Policy (CSP)
- XSS Protection
- Frame protection

### 2. Rate Limiting
- API rate limiting to prevent abuse
- Request throttling for sensitive endpoints

### 3. Input Validation
- Server-side input validation
- Sanitization of user inputs
- Protection against injection attacks

### 4. Environment Variables
- Sensitive data stored in environment variables
- Never commit .env files to version control
- Use .env.example as template

### 5. Firebase Security
- Firebase Authentication for user management
- Firebase Security Rules for data access
- Authorized domain configuration

### 6. HTTPS
- Automatic HTTPS on Render
- Secure cookie handling
- Encrypted data transmission

## Monitoring

### Render
- View logs in Render dashboard
- Monitor service health
- Check resource usage
- Set up alerts for downtime

### Firebase Console
- Monitor authentication events
- Check database usage
- Review security rules

## Cost

Render offers a generous free tier:
- **Render**: Free tier available (with limitations)
- Automatic SSL/HTTPS included
- No credit card required for free tier

## Support

- Render docs: https://render.com/docs
- Firebase docs: https://firebase.google.com/docs
