import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    // Check for access token in cookies
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Check if the user exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized access: User not found' });
    }

    // Attach user object to request
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in protectRoute middleware:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const adminRoute = (req, res, next) => {
    try {
      // Check if the user exists and has an admin role
      if (req.user && req.user.role === 'admin') {
        return next();
      }
  
      // If the user is not an admin, deny access
      res.status(403).json({ message: 'Access denied - Admin only' });
    } catch (error) {
      console.error('Error in adminRoute middleware:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  