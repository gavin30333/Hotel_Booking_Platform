import * as express from 'express';
import { hotelController } from '../controllers/hotel.controller';

const router = express.Router();

// 酒店列表查询接口
router.post('/search', hotelController.search);

// 酒店详情接口
router.get('/:hotelId', hotelController.getDetail);

// 酒店房型列表接口
router.get('/:hotelId/room-types', hotelController.getRoomTypes);

// 实时价格校验接口
router.post('/validate-price', hotelController.validatePrice);

export default router;