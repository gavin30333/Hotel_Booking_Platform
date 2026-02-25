import { HotelListParams, Hotel, hotelApi, HotelListResponse } from './api'
import { getHotelDetail as getMockHotelDetail } from '@/mock/index'

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
    console.warn('API returned success=false, falling back to mock data')
    const mockRes = await getMockHotelDetail(id)
    return mockRes.data
  } catch (error) {
    console.warn('getHotelDetail API error, falling back to mock:', error)
    const mockRes = await getMockHotelDetail(id)
    return mockRes.data
  }
}

export { hotelApi, authApi, favoriteApi, orderApi } from './api'
