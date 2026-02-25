import { create } from 'zustand'
import {
  TabType,
  SearchParams,
  LocationData,
  DateRange,
  GuestInfo,
} from '@/types/query.types'
import dayjs from 'dayjs'

// Define initial states for each scene
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

const DEFAULT_PARAMS: SearchParams = {
  scene: TabType.DOMESTIC,
  location: DEFAULT_LOCATION,
  dates: DEFAULT_DATE_RANGE,
  guests: DEFAULT_GUESTS,
  tags: [],
  keyword: '',
}

interface QueryState {
  activeScene: TabType
  scenes: {
    [key in TabType]: SearchParams
  }
  setActiveScene: (scene: TabType) => void
  updateSceneParams: (scene: TabType, params: Partial<SearchParams>) => void
  updateActiveSceneParams: (params: Partial<SearchParams>) => void
}

export const useQueryStore = create<QueryState>((set) => ({
  activeScene: TabType.DOMESTIC,
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
      guests: { rooms: [], adults: [], children: [] }, // Initialize with empty arrays for homestay
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
}))
