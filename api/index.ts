import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import connectDB from "../configs/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import AuthRouter from "../routes/AuthRoutes.js";
import ThumbnailRouter from "../routes/ThumbnailRoutes.js";
import UserRouter from "../routes/UserRoutes.js";

declare module "express-session" {
    interface SessionData {
        isLoggedIn?: boolean;
        userId?: string;
    }
}

const app = express();
app.set('trust proxy', 1);

// Check required environment variables
if (!process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET is not defined');
}
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
}

// CORS Configuration - MUST be first middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://thumblify-blush.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

// Handle CORS preflight for all routes
app.options('*', cors(corsOptions));

// Apply CORS to all requests
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Always true for Vercel (uses HTTPS)
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'none',
        path: '/'
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: "sessions",
        touchAfter: 24 * 3600,
        autoRemove: 'native',
        autoRemoveInterval: 10,
        crypto: {
            secret: process.env.SESSION_SECRET as string
        }
    }),
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// Connect to DB before handling requests (for serverless)
let dbConnected = false;
const ensureDbConnection = async (req: Request, res: Response, next: any) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            return res.status(500).json({ 
                error: 'Database connection failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    next();
};

app.use("/api/auth", ensureDbConnection, AuthRouter);
app.use("/api/thumbnail", ensureDbConnection, ThumbnailRouter);
app.use('/api/user', ensureDbConnection, UserRouter);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

export default app;
