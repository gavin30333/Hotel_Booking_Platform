import { Response } from 'express'
import { CustomerModel } from '../../schemas/customer.schema'
import { HotelModel } from '../../schemas/hotel.schema'
import { AuthRequest } from '../middlewares/userAuth'

const extractCity = (address: string): string => {
  const cityMatch = address.match(/^(.+?[省市])/)
  return cityMatch ? cityMatch[1] : '未知城市'
}

const getMinPrice = (roomTypes: any[]): number => {
  if (!roomTypes || roomTypes.length === 0) return 0
  return Math.min(...roomTypes.map((r) => r.price))
}

const formatHotel = (hotel: any) => {
  return {
    id: hotel._id,
    name: hotel.name,
    nameEn: hotel.nameEn,
    address: hotel.address,
    city: extractCity(hotel.address),
    starRating: hotel.starRating,
    rating: hotel.rating || 4.5,
    reviewCount: hotel.reviewCount || 0,
    minPrice: getMinPrice(hotel.roomTypes),
    imageUrl: hotel.images?.[0] || '',
    images: hotel.images || [],
    tags: hotel.facilities?.slice(0, 5) || [],
    facilities: hotel.facilities || [],
    description: hotel.description,
  }
}

export const userController = {
  async toggleFavorite(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { hotelId } = req.body

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      if (!hotelId) {
        return res.status(400).json({
          success: false,
          message: '缺少酒店ID',
          code: 'MISSING_HOTEL_ID',
        })
      }

      const hotel = await HotelModel.findById(hotelId)
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: '酒店不存在',
          code: 'HOTEL_NOT_FOUND',
        })
      }

      const customer = await CustomerModel.findById(customerId)
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          code: 'USER_NOT_FOUND',
        })
      }

      const favoriteIndex = customer.favorites.findIndex(
        (fav) => fav.toString() === hotelId
      )

      let isFavorite: boolean
      if (favoriteIndex > -1) {
        customer.favorites.splice(favoriteIndex, 1)
        isFavorite = false
      } else {
        customer.favorites.push(hotel._id as any)
        isFavorite = true
      }

      await customer.save()

      return res.json({
        success: true,
        message: isFavorite ? '收藏成功' : '取消收藏成功',
        data: { isFavorite },
      })
    } catch (error) {
      console.error('收藏操作错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getFavorites(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const customer =
        await CustomerModel.findById(customerId).populate('favorites')

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          code: 'USER_NOT_FOUND',
        })
      }

      const favorites = (customer.favorites as any[]).map((hotel: any) =>
        formatHotel(hotel)
      )

      return res.json({
        success: true,
        data: favorites,
      })
    } catch (error) {
      console.error('获取收藏列表错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async checkFavorite(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { hotelId } = req.params

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const customer = await CustomerModel.findById(customerId)
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          code: 'USER_NOT_FOUND',
        })
      }

      const isFavorite = customer.favorites.some(
        (fav) => fav.toString() === hotelId
      )

      return res.json({
        success: true,
        data: { isFavorite },
      })
    } catch (error) {
      console.error('检查收藏状态错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },
}

export default userController
