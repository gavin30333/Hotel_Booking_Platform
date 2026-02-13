import * as express from 'express'
import hotelRoutes from './hotel.routes'

const router = express.Router()

// 酒店相关路由
router.use('/hotel', hotelRoutes)

export default router
