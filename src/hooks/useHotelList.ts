import { useCallback, useState, useRef, useEffect } from 'react'
import {
  HotelListParams,
  getHotelList,
  HotelListResult,
} from '../services/hotel'
import { useHotelStore } from '../store/hotelStore'

export const useHotelList = () => {
  const {
    filters,
    hotelList,
    total,
    page,
    pageSize,
    loading,
    hasMore,
    setHotelList,
    addHotelList,
    setTotal,
    setPage,
    setLoading,
    setHasMore,
    resetHotelList,
  } = useHotelStore()

  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)
  const shouldRefreshRef = useRef(false)

  const buildParams = useCallback(
    (currentPage: number, currentFilters: typeof filters): HotelListParams => {
      const sortByMap: Record<string, string> = {
        price_asc: 'minPrice',
        price_desc: 'minPrice',
        rating_desc: 'rating',
        distance_asc: 'viewCount',
      }

      const sortOrderMap: Record<string, 'asc' | 'desc'> = {
        price_asc: 'asc',
        price_desc: 'desc',
        rating_desc: 'desc',
        distance_asc: 'desc',
      }

      const sortBy = currentFilters.sortBy || 'price_asc'

      const params: HotelListParams = {
        page: currentPage,
        pageSize,
        sortBy: sortByMap[sortBy] || 'viewCount',
        sortOrder: sortOrderMap[sortBy] || 'desc',
      }

      if (currentFilters.city) {
        params.city = currentFilters.city
      }
      if (currentFilters.keyword) {
        params.keyword = currentFilters.keyword
      }
      if (
        currentFilters.minPrice !== undefined &&
        currentFilters.minPrice > 0
      ) {
        params.minPrice = currentFilters.minPrice
      }
      if (
        currentFilters.maxPrice !== undefined &&
        currentFilters.maxPrice < 10000
      ) {
        params.maxPrice = currentFilters.maxPrice
      }
      if (currentFilters.starRating && currentFilters.starRating.length > 0) {
        params.starRating = currentFilters.starRating
      }
      if (currentFilters.facilities && currentFilters.facilities.length > 0) {
        params.facilities = currentFilters.facilities
      }
      if (currentFilters.minRating !== undefined) {
        params.minRating = currentFilters.minRating
      }
      if (currentFilters.brand) {
        params.brand = currentFilters.brand
      }
      if (currentFilters.roomType) {
        params.roomType = currentFilters.roomType
      }

      return params
    },
    [pageSize]
  )

  const loadHotels = useCallback(
    async (isRefresh = false) => {
      if (isLoadingRef.current) return
      if (loading || (!hasMore && !isRefresh)) return

      isLoadingRef.current = true
      setLoading(true)
      setError(null)

      try {
        const currentFilters = useHotelStore.getState().filters
        const currentPage = useHotelStore.getState().page
        const params = buildParams(currentPage, currentFilters)
        const response: HotelListResult = await getHotelList(params)

        const currentHotelList = useHotelStore.getState().hotelList
        if (isRefresh) {
          setHotelList(response.list)
        } else {
          addHotelList(response.list)
        }

        setTotal(response.total)
        const newLength = isRefresh
          ? response.list.length
          : currentHotelList.length + response.list.length
        setHasMore(newLength < response.total)
        if (!isRefresh) {
          setPage(currentPage + 1)
        }
      } catch (err) {
        setError('加载酒店列表失败，请稍后重试')
        console.error('Failed to load hotels:', err)
      } finally {
        setLoading(false)
        isLoadingRef.current = false
      }
    },
    [
      loading,
      hasMore,
      buildParams,
      setHotelList,
      addHotelList,
      setTotal,
      setHasMore,
      setPage,
      setLoading,
    ]
  )

  const refreshHotels = useCallback(() => {
    resetHotelList()
    shouldRefreshRef.current = true
  }, [resetHotelList])

  useEffect(() => {
    if (shouldRefreshRef.current) {
      shouldRefreshRef.current = false
      loadHotels(true)
    }
  }, [filters, loadHotels])

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isLoadingRef.current) {
      loadHotels(false)
    }
  }, [loading, hasMore, loadHotels])

  return {
    hotelList,
    total,
    loading,
    hasMore,
    error,
    refreshHotels,
    loadMore,
  }
}
