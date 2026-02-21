import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

//controllers for user registration

export const registerUser = async (req: Request, res: Response) => {
    try{
        const{ name, email, password } = req.body;

        // find user by email
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: "User already exists" });
        }
        //encrypt the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);

        const newUser =new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        //setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id.toString();
        return res.status(201).json({ 
            message: "User registered successfully",
            user:{
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
         });
    }
    catch (error){
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//controllers for user login
export const loginUser = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;
                

        // find user by email
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswirdCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswirdCorrect){
            return res.status(400).json({ message: "Invalid email or password" });
        }




        //setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();
        return res.status(201).json({ 
            message: "User logged in successfully",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
            }
         });
    }
    catch (error: any){
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//controllers for user logout
export const logoutUser = (req: Request, res: Response) => {
    req.session.destroy((error) => {
        if (error) {
            console.log( error);
            return res.status(500).json({ message: error.message });
        }
        
    });
    res.status(200).json({message: "User logged out successfully" });
}

//controllers for user verify
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Invalid User" });
        }
        return res.json({ user });
   
    }
    catch (error: any){
            if (error) {
            console.log( error);
            return res.status(500).json({ message: error.message });
        }

    }
} 