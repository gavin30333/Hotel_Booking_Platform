import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

interface ApiResponse<T = any> {
  success: boolean
  data: T
  total?: number
  page?: number
  pageSize?: number
  message?: string
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data as any
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default apiClient

export type SortBy =
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'viewCount_desc'

export interface HotelListParams {
  page: number
  pageSize: number
  city?: string
  keyword?: string
  minPrice?: number
  maxPrice?: number
  starRating?: number[]
  facilities?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Hotel {
  id: string
  name: string
  nameEn?: string
  address: string
  city: string
  starRating: number
  rating: number
  reviewCount: number
  minPrice: number
  imageUrl: string
  images: string[]
  tags: string[]
  facilities: string[]
  description: string
  phone?: string
  viewCount?: number
  orderCount?: number
}

export interface RoomType {
  id: string
  name: string
  nameEn?: string
  price: number
  originalPrice?: number
  area?: number
  bedType?: string
  maxOccupancy?: number
  breakfast?: boolean
  description?: string
  facilities?: string[]
  stock?: number
  images?: string[]
}

export interface HotelDetail extends Hotel {
  nearbyAttractions: Array<{
    name: string
    distance?: string
    description?: string
  }>
  transportations: Array<{ type: string; name: string; distance?: string }>
  shoppingMalls: Array<{
    name: string
    distance?: string
    description?: string
  }>
  discounts: Array<{
    name: string
    type: string
    value: number
    description?: string
  }>
  policies: {
    checkIn?: string
    checkOut?: string
    cancellation?: string
    extraBed?: string
    pets?: string
  }
  roomTypes: RoomType[]
  openingDate?: string
}

export interface HotelListResponse extends ApiResponse<Hotel[]> {
  total: number
  page: number
  pageSize: number
}

export interface HomeData {
  banners: Array<{ id: string; image: string; link: string }>
  hotHotels: Hotel[]
  discountHotels: Hotel[]
}

export const hotelApi = {
  getHome: () => apiClient.get<any, ApiResponse<HomeData>>('/public/home'),

  getHotelList: (params: HotelListParams) => {
    const queryParams = new URLSearchParams()
    queryParams.append('page', String(params.page))
    queryParams.append('pageSize', String(params.pageSize))
    if (params.city) queryParams.append('city', params.city)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.minPrice) queryParams.append('minPrice', String(params.minPrice))
    if (params.maxPrice) queryParams.append('maxPrice', String(params.maxPrice))
    if (params.starRating?.length)
      queryParams.append('starRating', params.starRating.join(','))
    if (params.facilities?.length)
      queryParams.append('facilities', params.facilities.join(','))
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    return apiClient.get<any, HotelListResponse>(
      `/public/hotels?${queryParams.toString()}`
    )
  },

  getHotelDetail: (id: string) =>
    apiClient.get<any, ApiResponse<HotelDetail>>(`/public/hotels/${id}`),

  getSuggestions: (keyword: string) =>
    apiClient.get<
      any,
      ApiResponse<Array<{ id: string; name: string; address: string }>>
    >(`/public/hotels/suggest?keyword=${encodeURIComponent(keyword)}`),
}

export const authApi = {
  sendCode: (phone: string) =>
    apiClient.post<any, ApiResponse<{ code: string }>>('/user/auth/send-code', {
      phone,
    }),

  login: (phone: string, code: string) =>
    apiClient.post<
      any,
      ApiResponse<{
        user: { id: string; phone: string; nickname: string; avatar?: string }
        token: string
        isNewUser: boolean
      }>
    >('/user/auth/login', { phone, code }),

  getProfile: () =>
    apiClient.get<
      any,
      ApiResponse<{
        id: string
        phone: string
        nickname: string
        avatar?: string
        createdAt: string
      }>
    >('/user/profile'),

  updateProfile: (data: { nickname?: string; avatar?: string }) =>
    apiClient.put<any, ApiResponse>('/user/profile', data),
}

export const favoriteApi = {
  toggle: (hotelId: string) =>
    apiClient.post<any, ApiResponse<{ isFavorite: boolean }>>(
      '/user/favorites',
      { hotelId }
    ),

  getList: () => apiClient.get<any, ApiResponse<Hotel[]>>('/user/favorites'),

  check: (hotelId: string) =>
    apiClient.get<any, ApiResponse<{ isFavorite: boolean }>>(
      `/user/favorites/${hotelId}`
    ),
}

export const orderApi = {
  create: (data: {
    hotelId: string
    roomTypeId: string
    checkIn: string
    checkOut: string
    guests: Array<{ name: string; phone: string; idCard: string }>
    remark?: string
  }) =>
    apiClient.post<
      any,
      ApiResponse<{ orderId: string; orderNo: string; finalPrice: number }>
    >('/user/orders', data),

  getList: (params?: { status?: string; page?: number; pageSize?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.pageSize)
      queryParams.append('pageSize', String(params.pageSize))
    return apiClient.get<
      any,
      ApiResponse<
        Array<{
          id: string
          orderNo: string
          hotelName: string
          hotelAddress: string
          roomTypeName: string
          checkIn: string
          checkOut: string
          nights: number
          finalPrice: number
          status: string
          createdAt: string
        }>
      >
    >(`/user/orders?${queryParams.toString()}`)
  },

  getDetail: (orderId: string) =>
    apiClient.get<any, ApiResponse<any>>(`/user/orders/${orderId}`),

  cancel: (orderId: string) =>
    apiClient.put<any, ApiResponse>(`/user/orders/${orderId}/cancel`),

  pay: (orderId: string) =>
    apiClient.post<any, ApiResponse<{ payStatus: string }>>(
      `/user/orders/${orderId}/pay`
    ),

  review: (
    orderId: string,
    data: { rating: number; content: string; images?: string[] }
  ) => apiClient.post<any, ApiResponse>(`/user/orders/${orderId}/review`, data),
}
