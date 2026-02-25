import express from 'express'
import { userAuthController } from '../controllers/userAuthController'
import { orderController } from '../controllers/orderController'

const router = express.Router()

router.post('/auth/send-code', userAuthController.sendCode)
router.post('/auth/login', userAuthController.login)

router.get('/profile', userAuthController.getProfile)
router.put('/profile', userAuthController.updateProfile)

router.post('/favorites', (req, res) => {
  res.json({ success: true, data: { isFavorite: true } })
})
router.get('/favorites', (req, res) => {
  res.json({ success: true, data: [] })
})
router.get('/favorites/:hotelId', (req, res) => {
  res.json({ success: true, data: { isFavorite: false } })
})

router.post('/orders', orderController.create)
router.get('/orders', orderController.getList)
router.get('/orders/:id', orderController.getDetail)
router.put('/orders/:id/cancel', orderController.cancel)
router.post('/orders/:id/pay', orderController.pay)
router.post('/orders/:id/review', orderController.review)

export default router
