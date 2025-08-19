import express from 'express';
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';
import { uploadImage, deleteImage } from './ImageHandler.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const ImageRouter = express.Router();

ImageRouter.post('/upload', authMiddleware, upload.single('image'), uploadImage);
ImageRouter.delete('/delete', authMiddleware, deleteImage);

export default ImageRouter;
