import { Request, Response, NextFunction } from "express";

const protect = async (req: Request, res: Response, next: NextFunction) => {
    console.log('🔐 Auth Middleware - Session Data:', {
        isLoggedIn: req.session.isLoggedIn,
        userId: req.session.userId,
        sessionID: req.sessionID,
        cookies: req.headers.cookie
    });
    
    const { isLoggedIn, userId } = req.session ;
    if(!isLoggedIn || !userId){
        console.log('❌ Auth failed - User not logged in');
        return res.status(401).json({ message: "Unauthorized- YOU ARE NOT LOGGED IN" });
    }

    console.log('✅ Auth passed for userId:', userId);
    next();
}
export default protect;