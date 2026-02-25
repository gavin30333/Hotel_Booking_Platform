import { create } from 'zustand'
import { Hotel } from '../services/hotel'

type SortBy = 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc'

interface LocationFilter {
  name: string
  lat: number
  lng: number
}

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
    rooms: number
    adults: number
    children: number
    location?: LocationFilter
    maxDistance?: number
  }

  hotelList: Hotel[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  hasMore: boolean

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
  rooms: 1,
  adults: 2,
  children: 0,
  location: undefined,
  maxDistance: 10000,
}

export const useHotelStore = create<HotelState>((set) => ({
  filters: defaultFilters,
  hotelList: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  hasMore: true,

  setFilters: (filters) =>
    set((state) => {
      const filterKeys = [
        'city',
        'keyword',
        'minPrice',
        'maxPrice',
        'starRating',
        'facilities',
        'minRating',
        'brand',
        'roomType',
        'sortBy',
      ]
      const hasKeyFilterChange = filterKeys.some(
        (key) =>
          filters[key as keyof typeof filters] !== undefined &&
          JSON.stringify(filters[key as keyof typeof filters]) !==
            JSON.stringify(state.filters[key as keyof typeof state.filters])
      )

      if (hasKeyFilterChange) {
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

  resetFilters: () =>
    set({
      filters: defaultFilters,
      hotelList: [],
      total: 0,
      page: 1,
      hasMore: true,
    }),

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
