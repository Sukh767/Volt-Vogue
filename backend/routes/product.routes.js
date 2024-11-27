import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controller/product.controller.js'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router()

//Product routes
router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/recomendations', getRecommendedProducts)
router.post('/create-product', protectRoute, adminRoute, upload.fields([{
    name: 'images',
    maxCount: 5
}]),createProduct)
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct)
router.delete('/:id', protectRoute, adminRoute, deleteProduct)
export default router