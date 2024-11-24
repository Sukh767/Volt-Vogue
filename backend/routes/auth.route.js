import express from 'express';
import { login, logout, signup, refreshToken } from '../controller/auth.controller.js';


const router = express.Router();

//Auth routes

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh-token', refreshToken)

//router.get('/profile', getUserProfile)
export default router