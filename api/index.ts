import "dotenv/config";
import express, { Request, Response } from 'express';
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

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://thumblify-blush.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://thumblify-blush.vercel.app'],
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'none',
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: "sessions",
    }),
}));

app.use(express.json());

// Connect to DB before handling requests
let dbConnected = false;
app.use(async (req, res, next) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error('Database connection failed:', error);
            return res.status(500).json({ error: 'Database connection failed' });
        }
    }
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use('/api/user', UserRouter);

export default app;
