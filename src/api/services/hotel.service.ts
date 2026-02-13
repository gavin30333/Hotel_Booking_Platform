import { HotelModel } from '../../schemas/hotel.schema'
import { RoomTypeModel } from '../../schemas/roomType.schema'

export const hotelService = {
  async searchHotels(
    city: string,
    _checkInDate: string,
    _checkOutDate: string,
    filters: any,
    pageNum: number,
    pageSize: number
  ) {
    // 使用正则表达式进行模糊匹配，忽略大小写
    const query: any = { city: { $regex: new RegExp(city, 'i') } }

    if (filters?.star) {
      query.star = { $in: filters.star.map((star: string) => parseInt(star)) }
    }

    const hotels = await HotelModel.find(query)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec()

    const total = await HotelModel.countDocuments(query).exec()

    const hotelList = await Promise.all(
      hotels.map(async (hotel) => {
        const minPriceRoom = await RoomTypeModel.findOne({ hotelId: hotel._id })
          .sort({ currentPrice: 1 })
          .exec()

        return {
          hotelId: hotel._id.toString(),
          hotelNameCn: hotel.hotelNameCn,
          hotelNameEn: hotel.hotelNameEn,
          hotelAddress: hotel.hotelAddress,
          hotelScale: hotel.hotelScale,
          openTime: hotel.openTime.toISOString().split('T')[0],
          star: `${hotel.star}星`,
          minPrice: minPriceRoom?.currentPrice || 0,
          score: hotel.score,
          tags: hotel.tags,
        }
      })
    )

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
      hotelNameCn: hotel.hotelNameCn,
      hotelNameEn: hotel.hotelNameEn,
      hotelAddress: hotel.hotelAddress,
      hotelScale: hotel.hotelScale,
      openTime: hotel.openTime.toISOString().split('T')[0],
      star: `${hotel.star}星`,
      score: hotel.score,
      tags: hotel.tags,
      nearbyAttractions: hotel.nearbyAttractions,
      trafficAndMalls: hotel.trafficAndMalls,
      discountInfo: hotel.discountInfo,
    }
  },

  async getRoomTypes(hotelId: string) {
    const roomTypes = await RoomTypeModel.find({ hotelId }).exec()
    return roomTypes.map((roomType) => ({
      roomTypeId: roomType._id.toString(),
      roomTypeName: roomType.roomTypeName,
      area: roomType.area,
      bedType: roomType.bedType,
      maxPeople: roomType.maxPeople,
      originalPrice: roomType.originalPrice,
      currentPrice: roomType.currentPrice,
      breakfast: roomType.breakfast,
      cancelPolicy: roomType.cancelPolicy,
      stock: roomType.stock,
      roomDiscount: roomType.roomDiscount,
    }))
  },

  async validatePrice(
    hotelId: string,
    roomTypeId: string,
    _checkInDate: string,
    _checkOutDate: string
  ) {
    const roomType = await RoomTypeModel.findOne({
      _id: roomTypeId,
      hotelId,
    }).exec()
    if (!roomType) {
      throw new Error('Room type not found')
    }

    return {
      roomTypeId: roomType._id.toString(),
      roomTypeName: roomType.roomTypeName,
      currentPrice: roomType.currentPrice,
      stock: roomType.stock,
      isAvailable: roomType.stock > 0,
    }
  },
}
