import { HotelModel } from '../../schemas/hotel.schema'

const extractCity = (address: string): string => {
  const cityMatch = address.match(/^(.+?[省市])/)
  return cityMatch ? cityMatch[1] : '未知城市'
}

const getMinPrice = (roomTypes: any[]): number => {
  if (!roomTypes || roomTypes.length === 0) return 0
  return Math.min(...roomTypes.map((r) => r.price))
}

export const hotelService = {
  async searchHotels(
    city: string,
    _checkInDate: string,
    _checkOutDate: string,
    filters: any,
    pageNum: number,
    pageSize: number
  ) {
    const query: any = { status: 'online' }

    if (city) {
      query.address = { $regex: new RegExp(city, 'i') }
    }

    if (filters?.keyword) {
      query.$or = [
        { name: { $regex: new RegExp(filters.keyword, 'i') } },
        { nameEn: { $regex: new RegExp(filters.keyword, 'i') } },
        { address: { $regex: new RegExp(filters.keyword, 'i') } },
      ]
    }

    if (filters?.star && filters.star.length > 0) {
      query.starRating = {
        $in: filters.star.map((star: string) => parseInt(star)),
      }
    }

    if (filters?.minRating) {
      query.rating = { $gte: filters.minRating }
    }

    if (filters?.brand) {
      query.name = { $regex: new RegExp(filters.brand, 'i') }
    }

    if (filters?.facilities && filters.facilities.length > 0) {
      query.facilities = { $all: filters.facilities }
    }

    let sortOption: any = { viewCount: -1 }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          sortOption = { 'roomTypes.price': 1 }
          break
        case 'price_desc':
          sortOption = { 'roomTypes.price': -1 }
          break
        case 'rating_desc':
          sortOption = { rating: -1 }
          break
        case 'distance_asc':
          sortOption = { viewCount: -1 }
          break
        default:
          sortOption = { viewCount: -1 }
      }
    }

    let hotels = await HotelModel.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec()

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      const minPrice = filters.minPrice || 0
      const maxPrice = filters.maxPrice || 100000

      hotels = hotels.filter((hotel) => {
        const hotelMinPrice = getMinPrice(hotel.roomTypes as any[])
        return hotelMinPrice >= minPrice && hotelMinPrice <= maxPrice
      })
    }

    if (filters?.roomType) {
      const roomTypeKeywords: Record<string, string[]> = {
        大床房: ['大床', '特大床', 'king'],
        双床房: ['双床', '单人床', 'twin'],
        套房: ['套房', 'suite'],
        亲子房: ['亲子', '家庭', 'family'],
        家庭房: ['家庭', '亲子', 'family'],
      }
      const keywords = roomTypeKeywords[filters.roomType] || [filters.roomType]
      hotels = hotels.filter((hotel) => {
        const roomTypes = hotel.roomTypes as any[]
        return roomTypes?.some((room) =>
          keywords.some(
            (keyword) =>
              room.name?.toLowerCase().includes(keyword.toLowerCase()) ||
              room.bedType?.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      })
    }

    const total = await HotelModel.countDocuments(query).exec()

    const hotelList = hotels.map((hotel) => ({
      hotelId: hotel._id.toString(),
      hotelNameCn: hotel.name,
      hotelNameEn: hotel.nameEn,
      hotelAddress: hotel.address,
      star: `${hotel.starRating}星`,
      minPrice: getMinPrice(hotel.roomTypes as any[]),
      score: hotel.rating || 4.5,
      tags: hotel.facilities?.slice(0, 5) || [],
      city: extractCity(hotel.address),
    }))

    return {
      total,
      pageNum,
      pageSize,
      list: hotelList,
    }
  },

  async getHotelDetail(hotelId: string) {
    const hotel = await HotelModel.findById(hotelId).exec()
    if (!hotel) {
      throw new Error('Hotel not found')
    }

    return {
      hotelId: hotel._id.toString(),
      hotelNameCn: hotel.name,
      hotelNameEn: hotel.nameEn,
      hotelAddress: hotel.address,
      star: `${hotel.starRating}星`,
      score: hotel.rating || 4.5,
      tags: hotel.facilities?.slice(0, 5) || [],
      nearbyAttractions: hotel.nearbyAttractions,
      transportations: hotel.transportations,
      shoppingMalls: hotel.shoppingMalls,
      discounts: hotel.discounts,
      facilities: hotel.facilities,
      policies: hotel.policies,
      images: hotel.images,
      description: hotel.description,
      phone: hotel.phone,
      roomTypes: (hotel.roomTypes as any[])?.map((room) => ({
        roomTypeId: room._id?.toString(),
        roomTypeName: room.name,
        area: room.area,
        bedType: room.bedType,
        maxPeople: room.maxOccupancy,
        originalPrice: room.originalPrice,
        currentPrice: room.price,
        breakfast: room.breakfast,
        stock: room.stock || 10,
      })),
    }
  },

  async getRoomTypes(hotelId: string) {
    const hotel = await HotelModel.findById(hotelId).exec()
    if (!hotel) return []

    return (
      (hotel.roomTypes as any[])?.map((room) => ({
        roomTypeId: room._id?.toString(),
        roomTypeName: room.name,
        area: room.area,
        bedType: room.bedType,
        maxPeople: room.maxOccupancy,
        originalPrice: room.originalPrice,
        currentPrice: room.price,
        breakfast: room.breakfast,
        stock: room.stock || 10,
      })) || []
    )
  },

  async validatePrice(
    hotelId: string,
    roomTypeId: string,
    _checkInDate: string,
    _checkOutDate: string,
    expectedPrice: number
  ) {
    const hotel = await HotelModel.findById(hotelId).exec()
    if (!hotel) {
      throw new Error('Hotel not found')
    }

    const roomType = (hotel.roomTypes as any[])?.find(
      (r) => r._id?.toString() === roomTypeId
    )
    if (!roomType) {
      throw new Error('Room type not found')
    }

    const isValid = roomType.price === expectedPrice
    let tips = ''

    if (isValid) {
      tips = '价格有效期剩余2小时，请尽快预订'
    } else {
      tips = `该房型价格已调整为${roomType.price}元，是否继续预订？`
    }

    return {
      roomTypeId: roomType._id?.toString(),
      roomTypeName: roomType.name,
      currentPrice: roomType.price,
      stock: roomType.stock || 10,
      isAvailable: (roomType.stock || 10) > 0,
      isValid,
      tips,
    }
  },
}
