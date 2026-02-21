import { Request, Response } from 'express'
import { HotelModel } from '../../schemas/hotel.schema'

const extractCity = (address: string): string => {
  const cityMatch = address.match(/^(.+?[省市])/)
  return cityMatch ? cityMatch[1] : '未知城市'
}

const getMinPrice = (roomTypes: any[]): number => {
  if (!roomTypes || roomTypes.length === 0) return 0
  return Math.min(...roomTypes.map((r) => r.price))
}

const formatHotelList = (hotel: any) => {
  const city = extractCity(hotel.address)
  const minPrice = getMinPrice(hotel.roomTypes)

  return {
    id: hotel._id,
    name: hotel.name,
    nameEn: hotel.nameEn,
    address: hotel.address,
    city,
    starRating: hotel.starRating,
    rating: hotel.rating || 4.5,
    reviewCount: hotel.reviewCount || 0,
    minPrice,
    imageUrl: hotel.images?.[0] || '',
    images: hotel.images || [],
    tags: hotel.facilities?.slice(0, 5) || [],
    facilities: hotel.facilities || [],
    description: hotel.description,
    viewCount: hotel.viewCount || 0,
    orderCount: hotel.orderCount || 0,
    phone: hotel.phone,
  }
}

export const publicController = {
  async getHome(_req: Request, res: Response) {
    try {
      const hotHotels = await HotelModel.find({ status: 'online' })
        .sort({ viewCount: -1 })
        .limit(6)
        .lean()

      const now = new Date()
      const currentYear = now.getFullYear()
      const discountHotels = await HotelModel.find({
        status: 'online',
        discounts: {
          $elemMatch: {
            startDate: { $lte: currentYear + '-12-31' },
            endDate: { $gte: currentYear + '-01-01' },
          },
        },
      })
        .limit(6)
        .lean()

      const banners = [
        {
          id: '1',
          image:
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          link: '/hotels?city=上海',
        },
        {
          id: '2',
          image:
            'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800',
          link: '/hotels?city=北京',
        },
        {
          id: '3',
          image:
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
          link: '/hotels?city=广州',
        },
      ]

      return res.json({
        success: true,
        data: {
          banners,
          hotHotels: hotHotels.map(formatHotelList),
          discountHotels: discountHotels.map(formatHotelList),
        },
      })
    } catch (error) {
      console.error('获取首页数据错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getHotels(req: Request, res: Response) {
    try {
      const {
        city,
        keyword,
        starRating,
        minPrice,
        maxPrice,
        facilities,
        sortBy = 'viewCount',
        sortOrder = 'desc',
        page = 1,
        pageSize = 20,
      } = req.query

      const query: any = { status: 'online' }

      if (city) {
        query.address = { $regex: new RegExp(city as string, 'i') }
      }

      if (keyword) {
        query.$or = [
          { name: { $regex: new RegExp(keyword as string, 'i') } },
          { nameEn: { $regex: new RegExp(keyword as string, 'i') } },
          { address: { $regex: new RegExp(keyword as string, 'i') } },
        ]
      }

      if (starRating) {
        const stars = (starRating as string).split(',').map(Number)
        query.starRating = { $in: stars }
      }

      if (facilities) {
        const facilityList = (facilities as string).split(',')
        query.facilities = { $all: facilityList }
      }

      const sortOptions: any = {}
      sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1

      const total = await HotelModel.countDocuments(query)
      const hotels = await HotelModel.find(query)
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(pageSize))
        .limit(Number(pageSize))
        .lean()

      let hotelsData = hotels.map(formatHotelList)

      if (minPrice || maxPrice) {
        const min = minPrice ? Number(minPrice) : 0
        const max = maxPrice ? Number(maxPrice) : Infinity
        hotelsData = hotelsData.filter(
          (h) => h.minPrice >= min && h.minPrice <= max
        )
      }

      return res.json({
        success: true,
        data: hotelsData,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      })
    } catch (error) {
      console.error('获取酒店列表错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getHotelDetail(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          success: false,
          message: '缺少酒店ID',
          code: 'MISSING_HOTEL_ID',
        })
      }

      const hotel = await HotelModel.findOneAndUpdate(
        { _id: id, status: 'online' },
        { $inc: { viewCount: 1 } },
        { new: true }
      ).lean()

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: '酒店不存在或已下线',
          code: 'HOTEL_NOT_FOUND',
        })
      }

      const roomTypesData = (hotel.roomTypes || []).map((room: any) => ({
        id: room._id,
        name: room.name,
        nameEn: room.nameEn,
        price: room.price,
        originalPrice: room.originalPrice,
        area: room.area,
        bedType: room.bedType,
        maxOccupancy: room.maxOccupancy,
        breakfast: room.breakfast,
        description: room.description,
        facilities: room.facilities || [],
        stock: room.stock || 10,
        images: room.images || [],
      }))

      return res.json({
        success: true,
        data: {
          id: hotel._id,
          name: hotel.name,
          nameEn: hotel.nameEn,
          address: hotel.address,
          city: extractCity(hotel.address),
          starRating: hotel.starRating,
          phone: hotel.phone,
          description: hotel.description,
          images: hotel.images || [],
          rating: hotel.rating || 4.5,
          reviewCount: hotel.reviewCount || 0,
          viewCount: hotel.viewCount || 0,
          orderCount: hotel.orderCount || 0,
          facilities: hotel.facilities || [],
          nearbyAttractions: hotel.nearbyAttractions || [],
          transportations: hotel.transportations || [],
          shoppingMalls: hotel.shoppingMalls || [],
          discounts: hotel.discounts || [],
          policies: hotel.policies || {},
          openingDate: hotel.openingDate,
          roomTypes: roomTypesData,
        },
      })
    } catch (error) {
      console.error('获取酒店详情错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getSuggestions(req: Request, res: Response) {
    try {
      const { keyword } = req.query

      if (!keyword || (keyword as string).length < 1) {
        return res.json({
          success: true,
          data: [],
        })
      }

      const hotels = await HotelModel.find({
        status: 'online',
        $or: [
          { name: { $regex: new RegExp(keyword as string, 'i') } },
          { address: { $regex: new RegExp(keyword as string, 'i') } },
        ],
      })
        .select('name address')
        .limit(10)
        .lean()

      const suggestions = hotels.map((hotel) => ({
        id: hotel._id,
        name: hotel.name,
        address: hotel.address,
      }))

      return res.json({
        success: true,
        data: suggestions,
      })
    } catch (error) {
      console.error('获取搜索建议错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },
}

export default publicController
