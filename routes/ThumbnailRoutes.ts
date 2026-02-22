import express from 'express';
import { generateThumbnail, deleteThumbnail } from '../controllers/ThumbnailController.js';


const ThumbnailRouter = express.Router();

ThumbnailRouter.post('/generate', generateThumbnail);
ThumbnailRouter.delete('/delete/:id', deleteThumbnail);

export default ThumbnailRouter;