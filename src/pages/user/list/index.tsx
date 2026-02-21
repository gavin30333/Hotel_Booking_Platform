import { Toast } from 'antd-mobile'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, {
  useLoad,
  useReachBottom,
  usePullDownRefresh,
  useRouter,
} from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.less'
import { useHotelList } from '../../../hooks/useHotelList'
import { useHotelStore } from '../../../store/hotelStore'
import HotelCard from '../../../components/common/HotelCard'
import CoreFilterHeader from '../../../components/filter/CoreFilterHeader'

export default function HotelList() {
  const router = useRouter()
  const { hotelList, loading, hasMore, error, refreshHotels, loadMore } =
    useHotelList()
  const { filters, setFilters } = useHotelStore()
  const [showStayDurationPopover, setShowStayDurationPopover] = useState(false)
  const [showBrandPopover, setShowBrandPopover] = useState(false)
  const [showSortPopover, setShowSortPopover] = useState(false)
  const [stayDurationArrowUp, setStayDurationArrowUp] = useState(false)
  const [brandArrowUp, setBrandArrowUp] = useState(false)
  const [isLocalDropdownOpen, setIsLocalDropdownOpen] = useState(false)
  const [isCoreFilterDropdownOpen, setIsCoreFilterDropdownOpen] =
    useState(false)
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setIsLocalDropdownOpen(
      showStayDurationPopover || showBrandPopover || showSortPopover
    )
  }, [showStayDurationPopover, showBrandPopover, showSortPopover])

  useEffect(() => {
    setIsAnyDropdownOpen(isLocalDropdownOpen || isCoreFilterDropdownOpen)
  }, [isLocalDropdownOpen, isCoreFilterDropdownOpen])

  useEffect(() => {
    const handleClickOutside = () => {
      setShowStayDurationPopover(false)
      setStayDurationArrowUp(false)
      setShowBrandPopover(false)
      setBrandArrowUp(false)
      setShowSortPopover(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const displayHotels = hotelList

  useLoad(() => {
    const { city, keyword, checkInDate, checkOutDate } = router.params

    if (city || keyword) {
      const newFilters: any = {}
      if (city) newFilters.city = decodeURIComponent(city)
      if (keyword) newFilters.keyword = decodeURIComponent(keyword)
      if (checkInDate) newFilters.checkInDate = decodeURIComponent(checkInDate)
      if (checkOutDate)
        newFilters.checkOutDate = decodeURIComponent(checkOutDate)

      setFilters(newFilters)
      setInitialized(true)
    } else if (hotelList.length === 0) {
      loadMore()
      setInitialized(true)
    }
  })

  useEffect(() => {
    if (initialized && (filters.city || filters.keyword)) {
      refreshHotels()
    }
  }, [initialized])

  usePullDownRefresh(() => {
    refreshHotels()
    Taro.stopPullDownRefresh()
  })

  useReachBottom(() => {
    if (hasMore && !loading) {
      loadMore()
    }
  })

  const handleSearch = (params: Record<string, unknown>) => {
    const formattedFilters = {
      city: params.city as string,
      checkInDate: params.checkInDate as string,
      checkOutDate: params.checkOutDate as string,
      minPrice: (params.priceRange as { min?: number })?.min || 0,
      maxPrice: (params.priceRange as { max?: number })?.max || 10000,
      starRating: (params.starRating as number[]) || [],
      facilities: (params.facilities as string[]) || [],
    }
    setFilters(formattedFilters)
    refreshHotels()
  }

  const handleStayDurationSelect = (value: string) => {
    setShowStayDurationPopover(false)
    Toast.show({ content: `选择了${value}晚` })
    setFilters({ stayDuration: value })
    refreshHotels()
    setTimeout(() => {
      Toast.show({ content: '筛选成功，找到符合条件的酒店' })
    }, 500)
  }

  const handleBrandSelect = (value: string) => {
    setShowBrandPopover(false)
    Toast.show({ content: `选择了${value}` })
    setFilters({ brand: value })
    refreshHotels()
    setTimeout(() => {
      Toast.show({ content: '筛选成功，找到符合条件的酒店' })
    }, 500)
  }

  const handleSortSelect = (value: string) => {
    setShowSortPopover(false)
    Toast.show({ content: `选择了${value}` })
    setFilters({
      sortBy: value as
        | 'price_asc'
        | 'price_desc'
        | 'rating_desc'
        | 'distance_asc',
    })
    refreshHotels()
    setTimeout(() => {
      Toast.show({ content: '排序成功' })
    }, 500)
  }

  const sortOptions = [
    { key: 'price_asc', label: '价格从低到高' },
    { key: 'price_desc', label: '价格从高到低' },
    { key: 'rating_desc', label: '评分从高到低' },
    { key: 'distance_asc', label: '距离从近到远' },
  ]

  const stayDurationOptions = [
    { label: '2小时以下', value: '2h-' },
    { label: '3小时', value: '3h' },
    { label: '4小时', value: '4h' },
    { label: '5小时以上', value: '5h+' },
  ]

  const brandOptions = [
    { label: '希尔顿', value: 'hilton' },
    { label: '万豪', value: 'marriott' },
    { label: '洲际', value: 'intercontinental' },
    { label: '凯悦', value: 'hyatt' },
    { label: '雅高', value: 'accor' },
    { label: '精选酒店', value: 'selected' },
  ]

  const handleFilterTagClick = (
    filterName: string,
    filterValue: Record<string, unknown>
  ) => {
    if (!selectedFilters.includes(filterName)) {
      setFilters(filterValue)
      setSelectedFilters([...selectedFilters, filterName])
      refreshHotels()
      Toast.show({ content: `已筛选${filterName}` })
    }
  }

  const handleRemoveFilter = (filterName: string, filterKey: string) => {
    const newFilters = { ...filters }
    delete (newFilters as Record<string, unknown>)[filterKey]
    setFilters(newFilters)
    setSelectedFilters(selectedFilters.filter((tag) => tag !== filterName))
    refreshHotels()
  }

  const filterTags = [
    { name: '4.5分以上', key: 'minRating', value: 4.5 },
    { name: '大床房', key: 'roomType', value: '大床房' },
    { name: '双床房', key: 'roomType', value: '双床房' },
    { name: '套房', key: 'roomType', value: '套房' },
    { name: '亲子房', key: 'roomType', value: '亲子房' },
    { name: '家庭房', key: 'roomType', value: '家庭房' },
    { name: '无烟房', key: 'smokeFree', value: true },
  ]

  return (
    <View
      className="hotel-list"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <View style={{ position: 'relative', zIndex: 100 }}>
        <CoreFilterHeader
          onSearch={handleSearch}
          onDropdownStateChange={(isOpen) =>
            setIsCoreFilterDropdownOpen(isOpen)
          }
        />

        <View style={{ position: 'relative' }}>
          <View className="filter-tags">
            <ScrollView scrollX>
              <View
                className="filter-tag"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowStayDurationPopover(!showStayDurationPopover)
                  setStayDurationArrowUp(!showStayDurationPopover)
                  setShowBrandPopover(false)
                  setBrandArrowUp(false)
                  setShowSortPopover(false)
                }}
              >
                <Text>入住时长</Text>
                <Text className="arrow">{stayDurationArrowUp ? '▲' : '▼'}</Text>
              </View>

              <View
                className="filter-tag"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowBrandPopover(!showBrandPopover)
                  setBrandArrowUp(!showBrandPopover)
                  setShowStayDurationPopover(false)
                  setStayDurationArrowUp(false)
                  setShowSortPopover(false)
                }}
              >
                <Text>热门品牌</Text>
                <Text className="arrow">{brandArrowUp ? '▲' : '▼'}</Text>
              </View>

              {filterTags.map((tag) => (
                <View
                  key={tag.name}
                  className={`filter-tag ${selectedFilters.includes(tag.name) ? 'filter-tag-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFilterTagClick(tag.name, { [tag.key]: tag.value })
                  }}
                >
                  <Text>{tag.name}</Text>
                  {selectedFilters.includes(tag.name) && (
                    <Text
                      className="filter-tag-close"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFilter(tag.name, tag.key)
                      }}
                    >
                      ×
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          {showStayDurationPopover && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                zIndex: 9999,
                backgroundColor: '#fff',
                borderRadius: '0 0 8px 8px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {stayDurationOptions.map((option) => (
                <View
                  key={option.value}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    color: '#333',
                    cursor: 'pointer',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e8e8e8',
                  }}
                  onClick={() => handleStayDurationSelect(option.value)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          )}

          {showBrandPopover && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                zIndex: 9999,
                backgroundColor: '#fff',
                borderRadius: '0 0 8px 8px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {brandOptions.map((option) => (
                <View
                  key={option.value}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    color: '#333',
                    cursor: 'pointer',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e8e8e8',
                  }}
                  onClick={() => handleBrandSelect(option.label)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          )}

          {showSortPopover && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                zIndex: 9999,
                backgroundColor: '#fff',
                borderRadius: '0 0 8px 8px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {sortOptions.map((option) => (
                <View
                  key={option.key}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    color: '#333',
                    cursor: 'pointer',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e8e8e8',
                  }}
                  onClick={() => handleSortSelect(option.label)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {isAnyDropdownOpen && (
          <View
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {loading ? (
          <View className="loading">
            <Text>筛选中...</Text>
          </View>
        ) : displayHotels.length > 0 ? (
          <ScrollView
            style={{ flex: 1, zIndex: 0 }}
            scrollY
            scrollWithAnimation
          >
            {displayHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}

            {hasMore && (
              <View className="loading-more">
                <Text>{loading ? '加载中...' : '上拉加载更多'}</Text>
              </View>
            )}

            {!hasMore && displayHotels.length > 0 && (
              <View className="loading-more">
                <Text>已加载全部酒店</Text>
              </View>
            )}

            {error && (
              <View className="error">
                <Text>{error}</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="no-data" style={{ zIndex: 0 }}>
            <Text>暂无符合条件的酒店</Text>
            <Text style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              请尝试调整筛选条件
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
