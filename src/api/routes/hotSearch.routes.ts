import express from 'express'
import { hotSearchController } from '../controllers/hotSearch.controller'

const router = express.Router()

router.get('/cities', hotSearchController.getAllActiveCities)

router.get('/:city', hotSearchController.getHotSearchByCity)

router.post('/', hotSearchController.createHotSearch)

router.put('/:city', hotSearchController.updateHotSearch)

router.delete('/:city', hotSearchController.deleteHotSearch)

export default router
