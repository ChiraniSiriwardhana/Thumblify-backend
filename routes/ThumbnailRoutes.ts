import express from 'express';
import { generateThumbnail, deleteThumbnail, getThumbnail } from '../controllers/ThumbnailController.js';
import protect from '../middlewares/auth.js';

const ThumbnailRouter = express.Router();

ThumbnailRouter.post('/generate', protect, generateThumbnail);
ThumbnailRouter.get('/:id', protect, getThumbnail);
ThumbnailRouter.delete('/:id', protect, deleteThumbnail);

export default ThumbnailRouter;