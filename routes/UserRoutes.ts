import express from 'express';
import User from '../models/User.js';
import { get } from 'node:http';
import { getThumbnailById, getUserThumbnails } from '../controllers/UserController.js';

const UserRouter = express.Router();

UserRouter.get('/thumbnails', getUserThumbnails);
UserRouter.get('/thumbnails/:id', getThumbnailById);

export default UserRouter;