import { create } from 'zustand'
import { Hotel } from '../services/hotel'

type SortBy = 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc'

interface HotelState {
  filters: {
    city: string
    keyword: string
    checkInDate: string
    checkOutDate: string
    minPrice: number
    maxPrice: number
    starRating: number[]
    facilities: string[]
    sortBy: SortBy
    stayDuration?: string
    brand?: string
    minRating?: number
    roomType?: string
    smokeFree?: boolean
  }

  // 酒店列表数据
  hotelList: Hotel[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  hasMore: boolean

  // 操作方法
  setFilters: (filters: Partial<HotelState['filters']>) => void
  resetFilters: () => void
  setHotelList: (list: Hotel[]) => void
  addHotelList: (list: Hotel[]) => void
  setTotal: (total: number) => void
  setPage: (page: number) => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  resetHotelList: () => void
}

const defaultFilters: HotelState['filters'] = {
  city: '',
  keyword: '',
  checkInDate: '',
  checkOutDate: '',
  minPrice: 0,
  maxPrice: 10000,
  starRating: [],
  facilities: [],
  sortBy: 'price_asc',
}

export const useHotelStore = create<HotelState>((set) => ({
  // 初始状态
  filters: defaultFilters,
  hotelList: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  hasMore: true,

  // 操作方法
  setFilters: (filters) =>
    set((state) => {
      // 如果排序方式改变，重置酒店列表状态
      if (filters.sortBy && filters.sortBy !== state.filters.sortBy) {
        return {
          filters: { ...state.filters, ...filters },
          hotelList: [],
          total: 0,
          page: 1,
          hasMore: true,
        }
      }
      return {
        filters: { ...state.filters, ...filters },
      }
    }),

  resetFilters: () => set({ filters: defaultFilters }),

  setHotelList: (list) => set({ hotelList: list }),

  addHotelList: (list) =>
    set((state) => ({
      hotelList: [...state.hotelList, ...list],
    })),

  setTotal: (total) => set({ total }),

  setPage: (page) => set({ page }),

  setLoading: (loading) => set({ loading }),

  setHasMore: (hasMore) => set({ hasMore }),

  resetHotelList: () =>
    set({
      hotelList: [],
      total: 0,
      page: 1,
      hasMore: true,
    }),
}))
