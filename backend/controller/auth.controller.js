import { redis } from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Generate access token and refresh token
const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

    const refreshToken = jwt.sign({userId}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
    return { accessToken, refreshToken }
}

// Store the refresh token in redis DB
const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refreshToken: ${userId}`, refreshToken, 'EX', 24*60*60*1000)
}

// Set cookie
const setCookie = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', //prevent CSRF attacks, cross site request forgery attacks
        maxAge: 15*60*1000  //Expire in 15m
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // prevent CSRF attacks, cross site request forgery attacks 
        maxAge: 24*60*60*1000 // Expire in 1d
    })
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async(req, res) => {
    const { name, email, password } = req.body
    try {
        const userExists = await User.findOne({ email })

    if(userExists){
        return res.status(400).json({message: 'User already exists'})
    }

    const user = await User.create({ name, email, password })

    // authenticate
    const {accessToken, refreshToken } = generateTokens(user._id)
    await storeRefreshToken(user._id,refreshToken)

    setCookie(res, accessToken, refreshToken)

    res.status(201).json({ user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, message: 'User created successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = async(req, res) => {
    res.send('Login controller')
}

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async(req, res) => {
    res.send('Logout controller')
}