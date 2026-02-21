import * as express from 'express'
import { hotelController } from '../controllers/hotel.controller'

const router = express.Router()

// 酒店列表查询接口
router.post('/search', hotelController.search)

// 酒店详情接口
router.get('/detail', hotelController.getDetail)

// 酒店房型列表接口
router.get('/room-type/list', hotelController.getRoomTypes)

// 实时价格校验接口
router.post('/price/validate', hotelController.validatePrice)

export default router
