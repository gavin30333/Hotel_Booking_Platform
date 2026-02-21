import { useCallback, useState } from 'react'
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

  const buildParams = useCallback((): HotelListParams => {
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

    const sortBy = filters.sortBy || 'price_asc'

    return {
      page,
      pageSize,
      city: filters.city,
      keyword: filters.keyword,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      starRating: filters.starRating,
      facilities: filters.facilities,
      sortBy: sortByMap[sortBy] || 'viewCount',
      sortOrder: sortOrderMap[sortBy] || 'desc',
    }
  }, [filters, page, pageSize])

  const loadHotels = useCallback(
    async (isRefresh = false) => {
      if (loading || (!hasMore && !isRefresh)) return

      setLoading(true)
      setError(null)

      try {
        const params = buildParams()
        const response: HotelListResult = await getHotelList(params)

        if (isRefresh) {
          setHotelList(response.list)
        } else {
          addHotelList(response.list)
        }

        setTotal(response.total)
        setHasMore(hotelList.length + response.list.length < response.total)
        setPage(page + 1)
      } catch (err) {
        setError('加载酒店列表失败，请稍后重试')
        console.error('Failed to load hotels:', err)
      } finally {
        setLoading(false)
      }
    },
    [
      loading,
      hasMore,
      page,
      buildParams,
      hotelList.length,
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
    loadHotels(true)
  }, [resetHotelList, loadHotels])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
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
