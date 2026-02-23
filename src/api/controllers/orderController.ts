import { Response } from 'express'
import { OrderModel, IGuest } from '../../schemas/order.schema'
import { HotelModel, IRoomType } from '../../schemas/hotel.schema'
import { ReviewModel } from '../../schemas/review.schema'
import { AuthRequest } from '../middlewares/userAuth'

const generateOrderNo = (): string => {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `HT${dateStr}${random}`
}

const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const calculateDiscount = (
  roomPrice: number,
  nights: number,
  discounts: any[]
): number => {
  let discountAmount = 0
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  for (const discount of discounts || []) {
    if (discount.startDate && discount.endDate) {
      if (today < discount.startDate || today > discount.endDate) continue
    }

    switch (discount.type) {
      case 'percentage':
        discountAmount += roomPrice * nights * ((100 - discount.value) / 100)
        break
      case 'fixed':
        discountAmount += discount.value
        break
      case 'special':
        discountAmount += discount.value
        break
    }
  }

  return Math.min(discountAmount, roomPrice * nights)
}

export const orderController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { hotelId, roomTypeId, checkIn, checkOut, guests, remark } =
        req.body

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      if (
        !hotelId ||
        !roomTypeId ||
        !checkIn ||
        !checkOut ||
        !guests ||
        guests.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数',
          code: 'MISSING_PARAMS',
        })
      }

      const hotel = await HotelModel.findById(hotelId)
      if (!hotel || hotel.status !== 'online') {
        return res.status(404).json({
          success: false,
          message: '酒店不存在或已下线',
          code: 'HOTEL_NOT_FOUND',
        })
      }

      const roomType = hotel.roomTypes.find(
        (r: IRoomType) => r._id?.toString() === roomTypeId
      )
      if (!roomType) {
        return res.status(404).json({
          success: false,
          message: '房型不存在',
          code: 'ROOM_TYPE_NOT_FOUND',
        })
      }

      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)

      if (checkInDate >= checkOutDate) {
        return res.status(400).json({
          success: false,
          message: '入住日期必须早于离店日期',
          code: 'INVALID_DATE',
        })
      }

      const nights = calculateNights(checkInDate, checkOutDate)
      const totalPrice = roomType.price * nights
      const discountAmount = calculateDiscount(
        roomType.price,
        nights,
        hotel.discounts
      )
      const finalPrice = totalPrice - discountAmount

      const order = await OrderModel.create({
        orderNo: generateOrderNo(),
        customer: customerId,
        hotel: hotelId,
        hotelName: hotel.name,
        hotelAddress: hotel.address,
        roomTypeId: roomTypeId,
        roomTypeName: roomType.name,
        roomPrice: roomType.price,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        guests: guests as IGuest[],
        totalPrice,
        discountAmount,
        finalPrice,
        status: 'pending',
        remark,
      })

      await HotelModel.findByIdAndUpdate(hotelId, { $inc: { orderCount: 1 } })

      return res.json({
        success: true,
        message: '订单创建成功',
        data: {
          orderId: order._id,
          orderNo: order.orderNo,
          totalPrice: order.totalPrice,
          discountAmount: order.discountAmount,
          finalPrice: order.finalPrice,
        },
      })
    } catch (error) {
      console.error('创建订单错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getList(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { status, page = 1, pageSize = 10 } = req.query

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const query: any = { customer: customerId }
      if (status) {
        query.status = status
      }

      const total = await OrderModel.countDocuments(query)
      const orders = await OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(pageSize))
        .limit(Number(pageSize))
        .lean()

      const ordersData = orders.map((order) => ({
        id: order._id,
        orderNo: order.orderNo,
        hotelId: order.hotel,
        hotelName: order.hotelName,
        hotelAddress: order.hotelAddress,
        roomTypeName: order.roomTypeName,
        roomPrice: order.roomPrice,
        checkIn: order.checkIn.toISOString().split('T')[0],
        checkOut: order.checkOut.toISOString().split('T')[0],
        nights: order.nights,
        totalPrice: order.totalPrice,
        discountAmount: order.discountAmount,
        finalPrice: order.finalPrice,
        status: order.status,
        createdAt: order.createdAt,
      }))

      return res.json({
        success: true,
        data: ordersData,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      })
    } catch (error) {
      console.error('获取订单列表错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getDetail(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { id } = req.params

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const order = await OrderModel.findOne({
        _id: id,
        customer: customerId,
      }).lean()

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在',
          code: 'ORDER_NOT_FOUND',
        })
      }

      const hotel = await HotelModel.findById(order.hotel).lean()

      const review = await ReviewModel.findOne({ order: order._id }).lean()

      return res.json({
        success: true,
        data: {
          id: order._id,
          orderNo: order.orderNo,
          hotelId: order.hotel,
          hotelName: order.hotelName,
          hotelAddress: order.hotelAddress,
          hotelPhone: hotel?.phone || '',
          roomTypeId: order.roomTypeId,
          roomTypeName: order.roomTypeName,
          roomPrice: order.roomPrice,
          checkIn: order.checkIn.toISOString().split('T')[0],
          checkOut: order.checkOut.toISOString().split('T')[0],
          nights: order.nights,
          guests: order.guests,
          totalPrice: order.totalPrice,
          discountAmount: order.discountAmount,
          finalPrice: order.finalPrice,
          status: order.status,
          remark: order.remark,
          paidAt: order.paidAt,
          cancelledAt: order.cancelledAt,
          createdAt: order.createdAt,
          review: review
            ? {
                id: review._id,
                rating: review.rating,
                content: review.content,
                images: review.images,
                reply: review.reply,
                createdAt: review.createdAt,
              }
            : null,
        },
      })
    } catch (error) {
      console.error('获取订单详情错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async cancel(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { id } = req.params

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const order = await OrderModel.findOne({ _id: id, customer: customerId })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在',
          code: 'ORDER_NOT_FOUND',
        })
      }

      if (!['pending', 'paid'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: '当前订单状态无法取消',
          code: 'CANNOT_CANCEL',
        })
      }

      order.status = 'cancelled'
      order.cancelledAt = new Date()
      await order.save()

      return res.json({
        success: true,
        message: '订单已取消',
      })
    } catch (error) {
      console.error('取消订单错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async pay(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { id } = req.params

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const order = await OrderModel.findOne({ _id: id, customer: customerId })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在',
          code: 'ORDER_NOT_FOUND',
        })
      }

      if (order.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: '当前订单状态无法支付',
          code: 'CANNOT_PAY',
        })
      }

      order.status = 'paid'
      order.paidAt = new Date()
      await order.save()

      return res.json({
        success: true,
        message: '支付成功',
        data: { payStatus: 'success' },
      })
    } catch (error) {
      console.error('支付订单错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async review(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { id } = req.params
      const { rating, content, images } = req.body

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: '评分必须在1-5之间',
          code: 'INVALID_RATING',
        })
      }

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: '评价内容不能为空',
          code: 'EMPTY_CONTENT',
        })
      }

      const order = await OrderModel.findOne({ _id: id, customer: customerId })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在',
          code: 'ORDER_NOT_FOUND',
        })
      }

      if (order.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: '只能评价已完成的订单',
          code: 'CANNOT_REVIEW',
        })
      }

      const existingReview = await ReviewModel.findOne({ order: id })
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: '该订单已评价',
          code: 'ALREADY_REVIEWED',
        })
      }

      const review = await ReviewModel.create({
        order: id,
        customer: customerId,
        hotel: order.hotel,
        rating,
        content: content.trim(),
        images: images || [],
      })

      const reviews = await ReviewModel.find({ hotel: order.hotel })
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = totalRating / reviews.length

      await HotelModel.findByIdAndUpdate(order.hotel, {
        rating: avgRating,
        reviewCount: reviews.length,
      })

      return res.json({
        success: true,
        message: '评价成功',
        data: {
          id: review._id,
          rating: review.rating,
          content: review.content,
          images: review.images,
        },
      })
    } catch (error) {
      console.error('评价订单错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },
}

export default orderController
