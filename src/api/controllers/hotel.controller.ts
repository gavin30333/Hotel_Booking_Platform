import { Request, Response } from 'express'
import { hotelService } from '../services/hotel.service'

export const hotelController = {
  async search(req: Request, res: Response) {
    try {
      const {
        city,
        checkInDate,
        checkOutDate,
        filters,
        pageNum = 1,
        pageSize = 20,
      } = req.body

      if (!city || !checkInDate || !checkOutDate) {
        return res
          .status(400)
          .json({ code: 400, msg: 'Missing required parameters' })
      }

      const result = await hotelService.searchHotels(
        city,
        checkInDate,
        checkOutDate,
        filters,
        pageNum,
        pageSize
      )

      res.status(200).json({ code: 200, msg: '查询成功', data: result })
    } catch (error) {
      res.status(500).json({ code: 500, msg: 'Internal server error' })
    }
  },

  async getDetail(req: Request, res: Response) {
    try {
      const { hotelId } = req.query

      if (!hotelId) {
        return res.status(400).json({ code: 400, msg: 'hotelId 不能为空' })
      }

      const hotelIdStr: string = Array.isArray(hotelId)
        ? String(hotelId[0])
        : String(hotelId)
      const hotelDetail = await hotelService.getHotelDetail(hotelIdStr)
      res.status(200).json({ code: 200, msg: '查询成功', data: hotelDetail })
    } catch (error: any) {
      if (error.message === 'Hotel not found') {
        return res.status(404).json({ code: 404, msg: '酒店不存在' })
      }
      res.status(500).json({ code: 500, msg: 'Internal server error' })
    }
  },

  async getRoomTypes(req: Request, res: Response) {
    try {
      const { hotelId } = req.query

      if (!hotelId) {
        return res
          .status(400)
          .json({ code: 400, msg: 'Missing hotelId parameter' })
      }

      const hotelIdStr: string = Array.isArray(hotelId)
        ? String(hotelId[0])
        : String(hotelId)
      const roomTypes = await hotelService.getRoomTypes(hotelIdStr)
      res.status(200).json({ code: 200, msg: '查询成功', data: roomTypes })
    } catch (error) {
      res.status(500).json({ code: 500, msg: 'Internal server error' })
    }
  },

  async validatePrice(req: Request, res: Response) {
    try {
      const { hotelId, roomTypeId, checkInDate, checkOutDate, expectedPrice } =
        req.body

      if (
        !hotelId ||
        !roomTypeId ||
        !checkInDate ||
        !checkOutDate ||
        expectedPrice === undefined
      ) {
        return res
          .status(400)
          .json({ code: 400, msg: 'Missing required parameters' })
      }

      const priceInfo = await hotelService.validatePrice(
        hotelId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        expectedPrice
      )

      res.status(200).json({ code: 200, msg: '价格验证完成', data: priceInfo })
    } catch (error: any) {
      if (error.message === 'Room type not found') {
        return res.status(404).json({ code: 404, msg: 'Room type not found' })
      }
      res.status(500).json({ code: 500, msg: 'Internal server error' })
    }
  },
}
