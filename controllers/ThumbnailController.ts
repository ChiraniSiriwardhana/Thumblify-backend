import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import { isGeneratorFunction } from "node:util/types";
import { config } from "dotenv";
import ai from "../configs/ai.js";
import { model } from "mongoose";
import path from "path";
import fs from "fs";
import {v2 as cloudinary} from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const stylePrompts ={
    'Bold & Graphic': 'eye-catching thumbnail , bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition,professional style',

    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements , glowing accents , holographic effects , cyber-tech aesthetic , sharp lighting, high-tech atmosphere',

    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',

    'photorealistic': 'photorealistic thumbnail, ultra realistic lighting , natural skin tones, candid moment, DSLR-style photography , lifestyle realism, shallow depth of feild',

    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters,bold outlines, vibrant colors, creative cartoon or vector art style',

}

const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye catching palette',

    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',

    forest: 'natural-green tones, earthy colors, calm and organic palette, fresh atmosphere',

    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',

    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',

    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',

    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',

    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',

}



export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId} = req.session;
        const { title, prompt:user_prompt,  style, aspect_ratio, color_scheme, text_overlay}= req.body;

        console.log('Generate thumbnail request:', { userId, title, style, aspect_ratio, color_scheme });

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const thumbnail = new Thumbnail ({
            userId,
            title,
            prompt_used: user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true,
        })

        // Build the prompt for image generation
        let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} for:"${title}"`;
        if(color_scheme){
            prompt += ` using a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme.`
        }
        if(user_prompt){
            prompt += ` Additional details: ${user_prompt}`;
        }
        prompt += ` The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional and impossible to ignore.`

        console.log('Generated prompt:', prompt);

        // Generate the image using Hugging Face Inference API
        // Using FLUX.1 Schnell - fast and reliable image generation model
        console.log('Calling Hugging Face API...');
        console.log('Using API key:', process.env.HF_API_KEY?.substring(0, 10) + '...');
        
        const imageBlob: any = await ai.textToImage({
            model: 'black-forest-labs/FLUX.1-schnell',
            inputs: prompt,
        });
        console.log('Image generated successfully');

        // Convert the blob response to buffer
        const arrayBuffer = await imageBlob.arrayBuffer();
        const finalBuffer = Buffer.from(arrayBuffer);

        console.log('Image buffer size:', finalBuffer.length);

        const filename = `final-output-${Date.now()}.png`;
        const filePath = path.join('images', filename);

        //create the images directory if it doesnt exist
        fs.mkdirSync('images', { recursive: true });

        //Write the final image to the file
        fs.writeFileSync(filePath, finalBuffer);
        console.log('Image saved to:', filePath);

        // Upload to Cloudinary
        console.log('Uploading to Cloudinary...');
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type:'image'
        });
        console.log('Uploaded to Cloudinary:', uploadResult.secure_url);

        thumbnail.image_url = uploadResult.secure_url;
        thumbnail.isGenerating = false;
        await thumbnail.save();

        res.json({ message: 'Thumbnail generated successfully', thumbnail});

        //remove image file from disk
        fs.unlinkSync(filePath);

    }
    catch (error: any) {
        console.error('Error generating thumbnail:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to generate thumbnail', details: error.message });


    }
}
export const getThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        const thumbnail = await Thumbnail.findOne({ _id: id, userId });
        if (!thumbnail) {
            return res.status(404).json({ error: 'Thumbnail not found' });
        }

        res.json({ thumbnail });
    } catch (error: any) {
        console.error('Error fetching thumbnail:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
} 

// controllers fro thumbnails deletion
export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {userId} = req.session;

        await Thumbnail.findByIdAndDelete({ _id: id, userId });
        res.json({ message: 'Thumbnail deleted successfully' });
    }catch (error: any) {
        console.error('Error deleting thumbnail:', error);
        res.status(500).json({ error: 'Failed to delete thumbnail' });
    }
}