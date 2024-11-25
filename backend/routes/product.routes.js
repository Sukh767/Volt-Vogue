import express from 'express'
import { createProduct, getAllProducts, getFeaturedProducts } from '../controller/product.controller.js'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

//Product routes
router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.post('/create-product', protectRoute, adminRoute, createProduct)

export default router