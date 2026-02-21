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

    if (filters?.star) {
      query.starRating = {
        $in: filters.star.map((star: string) => parseInt(star)),
      }
    }

    const hotels = await HotelModel.find(query)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec()

    const total = await HotelModel.countDocuments(query).exec()

    const hotelList = hotels.map((hotel) => ({
      hotelId: hotel._id.toString(),
      hotelNameCn: hotel.name,
      hotelNameEn: hotel.nameEn,
      hotelAddress: hotel.address,
      star: `${hotel.starRating}星`,
      minPrice: getMinPrice(hotel.roomTypes),
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
      roomTypes: hotel.roomTypes?.map((room: any) => ({
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
      hotel.roomTypes?.map((room: any) => ({
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
    _checkOutDate: string
  ) {
    const hotel = await HotelModel.findById(hotelId).exec()
    if (!hotel) {
      throw new Error('Hotel not found')
    }

    const roomType = hotel.roomTypes?.find(
      (r: any) => r._id?.toString() === roomTypeId
    )
    if (!roomType) {
      throw new Error('Room type not found')
    }

    return {
      roomTypeId: roomType._id?.toString(),
      roomTypeName: roomType.name,
      currentPrice: roomType.price,
      stock: roomType.stock || 10,
      isAvailable: (roomType.stock || 10) > 0,
    }
  },
}
