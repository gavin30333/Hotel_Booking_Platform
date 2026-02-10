import { useEffect, useCallback, useState } from 'react'
import { getHotelList, HotelListParams } from '../services/hotel'
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
    resetHotelList
  } = useHotelStore()

  const [error, setError] = useState<string | null>(null)

  // 构建请求参数
  const buildParams = useCallback((): HotelListParams => {
    return {
      page,
      pageSize,
      city: filters.city,
      checkInDate: filters.checkInDate,
      checkOutDate: filters.checkOutDate,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      starRating: filters.starRating,
      facilities: filters.facilities,
      sortBy: filters.sortBy,
      stayDuration: filters.stayDuration,
      brand: filters.brand
    }
  }, [filters, page, pageSize])

  // 加载酒店列表
  const loadHotels = useCallback(async (isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return

    setLoading(true)
    setError(null)

    try {
      const params = buildParams()
      // 暂时注释掉API请求，避免无限循环
      // const response = await getHotelList(params)

      // 模拟API响应，生成一些随机酒店数据
      const generateMockHotels = (count: number, page: number) => {
        const hotels = []
        for (let i = 0; i < count; i++) {
          const id = ((page - 1) * 10 + i + 1).toString()
          hotels.push({
            id,
            name: `酒店${id}`,
            address: `地址${id}`,
            city: "北京",
            latitude: 39.9 + Math.random() * 0.1,
            longitude: 116.4 + Math.random() * 0.1,
            starRating: Math.floor(Math.random() * 5) + 1,
            rating: (4 + Math.random() * 1).toFixed(1),
            reviewCount: Math.floor(Math.random() * 1000) + 100,
            minPrice: Math.floor(Math.random() * 1000) + 500,
            imageUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20hotel%20exterior&image_size=square_hd",
            tags: ["标签1", "标签2"],
            facilities: ["游泳池", "健身房"],
            description: `酒店${id}的描述`
          })
        }
        return hotels
      }

      // 生成模拟酒店数据
      let hotels = generateMockHotels(10, params.page)

      // 根据排序方式对酒店数据进行排序
      const sortHotels = (hotels: any[], sortBy: string) => {
        return [...hotels].sort((a, b) => {
          switch (sortBy) {
            case 'price_asc':
              return a.minPrice - b.minPrice
            case 'price_desc':
              return b.minPrice - a.minPrice
            case 'rating_desc':
              return parseFloat(b.rating) - parseFloat(a.rating)
            case 'distance_asc':
              // 这里使用模拟的距离计算
              return (a.latitude + a.longitude) - (b.latitude + b.longitude)
            default:
              return 0
          }
        })
      }

      // 应用排序
      hotels = sortHotels(hotels, params.sortBy)

      // 模拟API响应
      const response = {
        list: hotels,
        total: 50,
        page: params.page,
        pageSize: params.pageSize
      }

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
  }, [loading, hasMore, page, buildParams, hotelList.length, setHotelList, addHotelList, setTotal, setHasMore, setPage, setLoading])

  // 刷新酒店列表
  const refreshHotels = useCallback(() => {
    resetHotelList()
    loadHotels(true)
  }, [resetHotelList, loadHotels])

  // 加载更多
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
    loadMore
  }
}
