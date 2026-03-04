# Thumblify Backend API

Backend API for Thumblify - an AI-powered YouTube thumbnail generator that uses Hugging Face AI models to create custom thumbnails based on style preferences, color schemes, and aspect ratios.

## Features

- 🎨 AI-powered thumbnail generation using Hugging Face models
- 🖼️ Image storage and optimization with Cloudinary
- 🔐 User authentication with session management
- 📦 Thumbnail history and management
- 🎯 Multiple style presets (Bold & Graphic, Tech/Futuristic, Minimalist, Photorealistic, Illustrated)
- 🌈 Customizable color schemes (Vibrant, Sunset, Forest, Neon, Purple, Monochrome, Ocean, Pastel)
- 📐 Multiple aspect ratios support

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **AI Integration:** Hugging Face Inference API
- **Image Storage:** Cloudinary
- **Session Management:** express-session with connect-mongo
- **Authentication:** bcrypt for password hashing

## Project Structure

```
backend/
├── api/
│   └── index.ts           # Vercel serverless entry point
├── configs/
│   ├── ai.ts              # Hugging Face AI configuration
│   └── db.ts              # MongoDB connection
├── controllers/
│   ├── AuthController.ts  # Authentication logic
│   ├── ThumbnailController.ts  # Thumbnail generation & management
│   └── UserController.ts  # User profile management
├── middlewares/
│   └── auth.ts            # Authentication middleware
├── models/
│   ├── Thumbnail.ts       # Thumbnail schema
│   └── User.ts            # User schema
├── routes/
│   ├── AuthRoutes.ts      # Auth endpoints
│   ├── ThumbnailRoutes.ts # Thumbnail endpoints
│   └── UserRoutes.ts      # User endpoints
└── server.ts              # Local development server
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account
- Hugging Face API key

## Installation

1. **Clone the repository**
   ```bash
   cd "Thumblify backend/backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Session
   SESSION_SECRET=your_session_secret_key
   
   # AI Provider
   HF_API_KEY=your_huggingface_api_key
   
   # Image Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Frontend
   FRONTEND_URL=http://localhost:5173
   
   # Environment
   NODE_ENV=development
   ```

## Running Locally

### Development Mode (with auto-reload)
```bash
npm run server
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Check session status

### Thumbnails
- `POST /api/thumbnail/generate` - Generate a new thumbnail
- `GET /api/thumbnail/user/:userId` - Get user's thumbnails
- `DELETE /api/thumbnail/:id` - Delete a thumbnail

### User
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user profile

## Deployment

This backend is configured for Vercel serverless deployment.

### Vercel Setup

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard (same as local `.env`)
3. **Deploy**

The `vercel.json` configuration routes all requests to `api/index.ts`.

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Available Scripts

- `npm start` - Run the server with tsx
- `npm run server` - Run in development mode with nodemon
- `npm run build` - Compile TypeScript to JavaScript

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `SESSION_SECRET` | Secret key for session encryption | ✅ |
| `HF_API_KEY` | Hugging Face API key | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `FRONTEND_URL` | Frontend application URL | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |

## Database Models

### User Model
- Email and password authentication
- User profile information
- Created and updated timestamps

### Thumbnail Model
- Reference to user ID
- Image URL (Cloudinary)
- Prompt and generation parameters
- Style and color scheme preferences
- Aspect ratio
- Creation timestamp

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- MongoDB session store
- CORS configuration
- HTTP-only cookies
- Secure cookie settings in production

## CORS Configuration

The API allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Local testing)
- `https://thumblify-blush.vercel.app` (Production frontend)

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
