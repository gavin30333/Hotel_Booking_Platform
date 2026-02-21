import express from 'express'
import { userAuthController } from '../controllers/userAuthController'
import { userController } from '../controllers/userController'
import { orderController } from '../controllers/orderController'
import authMiddleware from '../middlewares/userAuth'

const router = express.Router()

router.post('/auth/send-code', userAuthController.sendCode)
router.post('/auth/login', userAuthController.login)

router.use(authMiddleware)

router.get('/profile', userAuthController.getProfile)
router.put('/profile', userAuthController.updateProfile)

router.post('/favorites', userController.toggleFavorite)
router.get('/favorites', userController.getFavorites)
router.get('/favorites/:hotelId', userController.checkFavorite)

router.post('/orders', orderController.create)
router.get('/orders', orderController.getList)
router.get('/orders/:id', orderController.getDetail)
router.put('/orders/:id/cancel', orderController.cancel)
router.post('/orders/:id/pay', orderController.pay)
router.post('/orders/:id/review', orderController.review)

export default router
