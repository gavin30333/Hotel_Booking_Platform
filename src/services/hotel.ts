import { HotelListParams, Hotel, hotelApi, HotelListResponse } from './api'

export type { HotelListParams, Hotel, SortBy } from './api'

export interface HotelListResult {
  list: Hotel[]
  total: number
  page: number
  pageSize: number
}

export const getHotelList = async (
  params: HotelListParams
): Promise<HotelListResult> => {
  try {
    const response: HotelListResponse = await hotelApi.getHotelList(params)
    if (response.success) {
      return {
        list: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      }
    }
    throw new Error('获取酒店列表失败')
  } catch (error) {
    console.error('getHotelList error:', error)
    throw error
  }
}

export const getHotelDetail = async (id: string) => {
  try {
    const response = await hotelApi.getHotelDetail(id)
    if (response.success) {
      return response.data
    }
    throw new Error('获取酒店详情失败')
  } catch (error) {
    console.error('getHotelDetail error:', error)
    throw error
  }
}

export { hotelApi, authApi, favoriteApi, orderApi } from './api'
