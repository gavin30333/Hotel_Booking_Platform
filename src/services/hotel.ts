import {
  getHotelDetail as getHotelDetailMock,
  getHotelList as getHotelListMock,
} from '@/mock'

type SortBy = 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc'

export interface HotelListParams {
  page: number
  pageSize: number
  city?: string
  checkInDate?: string
  checkOutDate?: string
  minPrice?: number
  maxPrice?: number
  starRating?: number[]
  facilities?: string[]
  sortBy?: SortBy
  stayDuration?: string
  brand?: string
}

// 酒店信息接口
export interface Hotel {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  starRating: number
  rating: number
  reviewCount: number
  minPrice: number
  imageUrl: string
  tags: string[]
  facilities: string[]
  description: string
  images?: string[]
  rooms?: Room[]
  reviews?: Review[]
}

// 房型接口
export interface Room {
  id: string
  name: string
  size: number
  bedType: string
  price: number
  description: string
}

// 评价接口
export interface Review {
  id: string
  userName: string
  date: string
  rating: number
  content: string
}

// 酒店列表响应接口
export interface HotelListResponse {
  list: Hotel[]
  total: number
  page: number
  pageSize: number
}

// 获取酒店列表
export const getHotelList = (params: HotelListParams) => {
  return getHotelListMock(params)
}

// 获取酒店详情
export const getHotelDetail = (id: string) => {
  return getHotelDetailMock(id)
}
