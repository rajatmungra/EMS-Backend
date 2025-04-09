import express from 'express'
import loginHandler from './HandlerFunctions/loginHandler.js';
import { authMiddleware, verifyHandler } from './HandlerFunctions/authMiddleware.js';

const router = express.Router()

router.post('/login', loginHandler);
router.get('/verify', authMiddleware, verifyHandler);

export default router
