import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS middleware
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import couponRoutes from './routes/coupon.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

dotenv.config();

const app = express();

const allowedOrigin = process.env.CLIENT_URL; // Client URL from the environment file

// Configure CORS
app.use(cors({
    origin: allowedOrigin, // Allow requests only from the specified client URL
    credentials: true, // Allow cookies and authorization headers
}));

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

// All routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // Connect to MongoDB Database
    connectDB();
});
