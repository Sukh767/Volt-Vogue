import express from 'express';
import { login, logout, signup, refreshToken, getUserProfile } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

//Auth routes

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/profile', protectRoute, getUserProfile)
export default router