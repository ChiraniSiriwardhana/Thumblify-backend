// controllers to get all user Thumbnails

import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";


export const getUserThumbnails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        console.log('Fetching thumbnails for userId:', userId);
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
        console.log('Found thumbnails:', thumbnails.length);
        
        // Log the first thumbnail to see the structure
        if (thumbnails.length > 0) {
            console.log('Sample thumbnail data:', {
                _id: thumbnails[0]._id,
                title: thumbnails[0].title,
                image_url: thumbnails[0].image_url,
                hasImageUrl: !!thumbnails[0].image_url,
                isGenerating: thumbnails[0].isGenerating
            });
        }
        
        res.json({ thumbnails });
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
        console.log('Fetching thumbnail:', id, 'for userId:', userId);
        const thumbnail = await Thumbnail.findOne({ _id: id, userId });
        if (!thumbnail) {
            console.log('Thumbnail not found');
            return res.status(404).json({ error: 'Thumbnail not found' });
        }
        console.log('Found thumbnail with image_url:', thumbnail.image_url);
        res.json({ thumbnail });
    } catch (error) {
        console.error('Error fetching thumbnail:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
}