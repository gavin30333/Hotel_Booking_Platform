import express from 'express'
import { hotelController } from '../controllers/hotel.controller'

const router = express.Router()

router.post('/search', hotelController.search)
router.get('/:hotelId', hotelController.getDetail)
router.get('/:hotelId/room-types', hotelController.getRoomTypes)
router.post('/validate-price', hotelController.validatePrice)

export default router
