import { redis } from '../lib/redis.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate access token and refresh token
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
  return { accessToken, refreshToken };
};

// Store the refresh token in redis DB
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken: ${userId}`,
    refreshToken,
    'EX',
    24 * 60 * 60 * 1000
  );
};

// Set cookie
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', //prevent CSRF attacks, cross site request forgery attacks
    maxAge: 15 * 60 * 1000, //Expire in 15m
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // prevent CSRF attacks, cross site request forgery attacks
    maxAge: 24 * 60 * 60 * 1000, // Expire in 1d
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User already exists, with this email' });
    }

    const user = await User.create({ name, email, password });

    // authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    console.log('signup controller error', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with the provided email.',
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store the refresh token in Redis (or another store)
    await storeRefreshToken(user._id, refreshToken);

    // Set cookies with tokens
    setCookies(res, accessToken, refreshToken);

    // Respond with user details
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error in login controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decode = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      await redis.del(`refreshToken: ${decode.userId}`);
      // Clear cookies (refreshToken and accessToken)
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logout successfull' });
    }
  } catch (error) {
    console.error('Logout controller error:', error);
    res
      .status(500)
      .json({
        message: 'Server error. Please try again later.',
        error: error.message,
      });
  }
};


// This will re-create or regenerate the refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. Refresh token is missing.' });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    const storedToken = await redis.get(`refreshToken: ${decoded.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. Invalid refresh token.' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // Update access token in the cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // Expires in 15 minutes
    });

    return res
      .status(200)
      .json({ message: 'Access token refreshed successfully.' });
  } catch (error) {
    console.error('Error in refreshToken:', error);

    if (error.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ message: 'Invalid token. Please log in again.' });
    } else if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Refresh token expired. Please log in again.' });
    }

    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

// @desc    Get user details
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({
      message: 'Somwthing went wrong',
      error: error.message,
    });
  }
};
