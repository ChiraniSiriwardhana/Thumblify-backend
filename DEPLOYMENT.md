# Vercel Deployment Setup

## Required Environment Variables

Add these in your Vercel project settings:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
HF_API_KEY=your_huggingface_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

## Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Important Notes

- The serverless function is at `api/index.ts`
- MongoDB connections are reused across requests
- Sessions use MongoDB store (connect-mongo)
- CORS is configured for production domain
