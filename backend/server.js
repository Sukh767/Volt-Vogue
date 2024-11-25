import express from 'express';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import couponRoutes from './routes/coupon.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser';
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'

dotenv.config()

const app = express();

const PORT = process.env.PORT || 5000

app.use(express.json()) //allows to parse the body of the request
app.use(cookieParser())

//All routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)

    // Connect to MongoDB Database
    connectDB();
})