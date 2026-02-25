import { create } from 'zustand'
import {
  TabType,
  SearchParams,
  LocationData,
  DateRange,
  GuestInfo,
} from '@/types/query.types'
import dayjs from 'dayjs'

const DEFAULT_DATE_RANGE: DateRange = {
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  nights: 1,
}

const DEFAULT_GUESTS: GuestInfo = {
  rooms: 1,
  adults: 1,
  children: 0,
}

const DEFAULT_LOCATION: LocationData = {
  city: '杭州',
  country: '中国',
}

interface PriceRange {
  min: number
  max: number
}

interface StarRating {
  ratings: number[]
}

const DEFAULT_PARAMS: SearchParams & {
  priceRange?: PriceRange
  starRating?: StarRating
} = {
  scene: TabType.DOMESTIC,
  location: DEFAULT_LOCATION,
  dates: DEFAULT_DATE_RANGE,
  guests: DEFAULT_GUESTS,
  tags: [],
  keyword: '',
  priceRange: { min: 0, max: 99999 },
  starRating: { ratings: [] },
}

interface QueryState {
  activeScene: TabType
  scenes: {
    [key in TabType]: SearchParams & {
      priceRange?: PriceRange
      starRating?: StarRating
    }
  }
  keyword: string
  setActiveScene: (scene: TabType) => void
  updateSceneParams: (scene: TabType, params: Partial<SearchParams>) => void
  updateActiveSceneParams: (params: Partial<SearchParams>) => void
  updateDates: (startDate: string, endDate: string) => void
  updateGuests: (rooms: number, adults: number, children: number) => void
  updateLocation: (location: LocationData) => void
  updateKeyword: (keyword: string) => void
  updatePriceRange: (min: number, max: number) => void
  updateStarRating: (ratings: number[]) => void
  getDates: () => DateRange
  getGuests: () => GuestInfo
  getLocation: () => LocationData
  getKeyword: () => string
  getPriceRange: () => PriceRange
  getStarRating: () => StarRating
  getSearchParams: () => {
    city: string
    checkInDate: string
    checkOutDate: string
    rooms: number
    adults: number
    children: number
    nights: number
    keyword: string
    minPrice: number
    maxPrice: number
    starRatings: number[]
  }
}

export const useQueryStore = create<QueryState>((set, get) => ({
  activeScene: TabType.DOMESTIC,
  keyword: '',
  scenes: {
    [TabType.DOMESTIC]: { ...DEFAULT_PARAMS, scene: TabType.DOMESTIC },
    [TabType.INTERNATIONAL]: {
      ...DEFAULT_PARAMS,
      scene: TabType.INTERNATIONAL,
      location: { city: '东京', country: '日本' },
    },
    [TabType.HOMESTAY]: {
      ...DEFAULT_PARAMS,
      scene: TabType.HOMESTAY,
      guests: { rooms: [], adults: [], children: [] },
    },
    [TabType.HOURLY]: {
      ...DEFAULT_PARAMS,
      scene: TabType.HOURLY,
      dates: { ...DEFAULT_DATE_RANGE, nights: 0 },
    },
  },

  setActiveScene: (scene) => set({ activeScene: scene }),

  updateSceneParams: (scene, params) =>
    set((state) => ({
      scenes: {
        ...state.scenes,
        [scene]: { ...state.scenes[scene], ...params },
      },
    })),

  updateActiveSceneParams: (params) =>
    set((state) => ({
      scenes: {
        ...state.scenes,
        [state.activeScene]: { ...state.scenes[state.activeScene], ...params },
      },
    })),

  updateDates: (startDate, endDate) => {
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const nights = end.diff(start, 'day')
    set((state) => ({
      scenes: {
        ...state.scenes,
        [state.activeScene]: {
          ...state.scenes[state.activeScene],
          dates: { startDate, endDate, nights: Math.max(1, nights) },
        },
      },
    }))
  },

  updateGuests: (rooms, adults, children) => {
    set((state) => ({
      scenes: {
        ...state.scenes,
        [state.activeScene]: {
          ...state.scenes[state.activeScene],
          guests: { rooms, adults, children },
        },
      },
    }))
  },

  updateLocation: (location) => {
    set((state) => ({
      scenes: {
        ...state.scenes,
        [state.activeScene]: {
          ...state.scenes[state.activeScene],
          location,
        },
      },
    }))
  },

  updateKeyword: (keyword) => set({ keyword }),

  updatePriceRange: (min, max) => {
    set((state) => ({
      scenes: {
        ...state.scenes,
        [state.activeScene]: {
          ...state.scenes[state.activeScene],
          priceRange: { min, max },
        },
      },
    }))
  },

  updateStarRating: (ratings) => {
    set((state) => ({
      scenes: {
        ...state.scenes,
        [state.activeScene]: {
          ...state.scenes[state.activeScene],
          starRating: { ratings },
        },
      },
    }))
  },

  getDates: () => {
    const state = get()
    return state.scenes[state.activeScene].dates
  },

  getGuests: () => {
    const state = get()
    return state.scenes[state.activeScene].guests || DEFAULT_GUESTS
  },

  getLocation: () => {
    const state = get()
    return state.scenes[state.activeScene].location
  },

  getKeyword: () => {
    const state = get()
    return state.keyword
  },

  getPriceRange: () => {
    const state = get()
    return state.scenes[state.activeScene].priceRange || { min: 0, max: 99999 }
  },

  getStarRating: () => {
    const state = get()
    return state.scenes[state.activeScene].starRating || { ratings: [] }
  },

  getSearchParams: () => {
    const state = get()
    const scene = state.scenes[state.activeScene]
    const dates = scene.dates
    const guests = scene.guests || DEFAULT_GUESTS
    const location = scene.location
    const priceRange = scene.priceRange || { min: 0, max: 99999 }
    const starRating = scene.starRating || { ratings: [] }

    const getNumber = (
      val: number | number[] | undefined,
      defaultVal: number
    ): number => {
      if (val === undefined) return defaultVal
      if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
      return val
    }

    return {
      city: location.city,
      checkInDate: dates.startDate,
      checkOutDate: dates.endDate,
      rooms: getNumber(guests.rooms, 1),
      adults: getNumber(guests.adults, 2),
      children: getNumber(guests.children, 0),
      nights: dates.nights,
      keyword: state.keyword,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      starRatings: starRating.ratings,
    }
  },
}))
