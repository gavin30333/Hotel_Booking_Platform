import express from 'express'
import hotelRoutes from './hotel.routes'
import publicRoutes from './publicRoutes'
import userRoutes from './userRoutes'
import hotSearchRoutes from './hotSearch.routes'

const router = express.Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.use('/hotel', hotelRoutes)
router.use('/public', publicRoutes)
router.use('/user', userRoutes)
router.use('/hot-search', hotSearchRoutes)

export default router
