// controllers to get all user Thumbnails

import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";


export const getUserThumbnails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
        res.json(thumbnails);
    } catch (error) {
        console.error('Error fetching user thumbnails:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnails' });
    }
}

// controller to get single Thumbnail of a user
export const getThumbnailById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { id } = req.params;
        const thumbnail = await Thumbnail.findOne({ _id: id, userId });
        if (!thumbnail) {
            return res.status(404).json({ error: 'Thumbnail not found' });
        }
        res.json(thumbnail);
    } catch (error) {
        console.error('Error fetching thumbnail:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
}