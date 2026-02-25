import { create } from 'zustand'
import { Hotel } from '../services/api'

export interface ListPageState {
  hotelList: Hotel[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  hasMore: boolean
  setHotelList: (list: Hotel[]) => void
  addHotelList: (list: Hotel[]) => void
  setLoading: (loading: boolean) => void
  setTotal: (total: number) => void
  setPage: (page: number) => void
  setHasMore: (hasMore: boolean) => void
  resetList: () => void
}

export const useListPageStore = create<ListPageState>((set) => ({
  hotelList: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  hasMore: true,
  setHotelList: (list) => set({ hotelList: list }),
  addHotelList: (list) =>
    set((state) => ({ hotelList: [...state.hotelList, ...list] })),
  setLoading: (loading) => set({ loading }),
  setTotal: (total) => set({ total }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  resetList: () =>
    set({
      hotelList: [],
      total: 0,
      page: 1,
      hasMore: true,
    }),
}))
