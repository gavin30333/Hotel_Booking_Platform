import express from 'express'
import { publicController } from '../controllers/publicController'

const router = express.Router()

router.get('/home', publicController.getHome)
router.get('/hotels', publicController.getHotels)
router.get('/hotels/suggest', publicController.getSuggestions)
router.get('/hotels/:id', publicController.getHotelDetail)

export default router
