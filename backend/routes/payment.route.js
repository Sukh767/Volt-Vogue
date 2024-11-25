import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { checkoutSuccess, createCheckoutSession } from '../controller/payment.controller.js'

const router =  express.Router()

router.post('/create-check-out-session',protectRoute, createCheckoutSession)
router.post ('/checkout-success', protectRoute, checkoutSuccess)

export default router