import { Toast } from 'antd-mobile'
import { View } from '@tarojs/components'
import Taro, {
  useLoad,
  useReachBottom,
  usePullDownRefresh,
  useRouter,
} from '@tarojs/taro'
import { useState, useEffect, useCallback } from 'react'
import './index.less'
import { useHotelList } from '../../../hooks/useHotelList'
import { useHotelStore } from '../../../store/hotelStore'
import HotelListHeader from './components/HotelListHeader'
import FilterTags from './components/FilterTags'
import FilterDropdown from './components/FilterDropdown'
import HotelListContent from './components/HotelListContent'

export default function HotelList() {
  const router = useRouter()
  const { hotelList, loading, hasMore, error, refreshHotels, loadMore } =
    useHotelList()
  const { filters, setFilters, resetFilters } = useHotelStore()
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
  const [isInitialized, setIsInitialized] = useState(false)

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

  const initFromUrl = useCallback(() => {
    const {
      city,
      keyword,
      checkInDate,
      checkOutDate,
      rooms,
      adults,
      children,
    } = router.params

    const newFilters: any = {}
    let hasParams = false

    if (city) {
      newFilters.city = decodeURIComponent(city)
      hasParams = true
    }
    if (keyword) {
      newFilters.keyword = decodeURIComponent(keyword)
      hasParams = true
    }
    if (checkInDate) {
      newFilters.checkInDate = decodeURIComponent(checkInDate)
      hasParams = true
    }
    if (checkOutDate) {
      newFilters.checkOutDate = decodeURIComponent(checkOutDate)
      hasParams = true
    }
    if (rooms) {
      newFilters.rooms = Number(rooms)
    }
    if (adults) {
      newFilters.adults = Number(adults)
    }
    if (children) {
      newFilters.children = Number(children)
    }

    if (hasParams) {
      resetFilters()
      setFilters(newFilters)
    }

    return hasParams
  }, [router.params, resetFilters, setFilters])

  useLoad(() => {
    const hasParams = initFromUrl()
    setIsInitialized(true)

    if (!hasParams) {
      loadMore()
    }
  })

  useEffect(() => {
    if (isInitialized && hasMore && hotelList.length === 0) {
      loadMore()
    }
  }, [isInitialized])

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
    const formattedFilters: Record<string, unknown> = {
      city: params.city as string,
      keyword: params.keyword as string,
      checkInDate: params.checkInDate as string,
      checkOutDate: params.checkOutDate as string,
      minPrice: params.minPrice ?? 0,
      maxPrice: params.maxPrice ?? 10000,
      starRating: (params.starRating as number[]) || [],
      facilities: (params.facilities as string[]) || [],
      rooms: (params.rooms as number) || 1,
      adults: (params.adults as number) || 2,
      children: (params.children as number) || 0,
    }

    if (params.sortBy) {
      formattedFilters.sortBy = params.sortBy
    }

    if (params.location) {
      formattedFilters.location = params.location
    }

    if (params.brand) {
      formattedFilters.brand = params.brand
    }

    if (params.minRating !== undefined) {
      formattedFilters.minRating = params.minRating
    }

    if (params.roomType) {
      formattedFilters.roomType = params.roomType
    }

    setFilters(formattedFilters)
    refreshHotels()
  }

  const handleStayDurationSelect = (value: string, label: string) => {
    setShowStayDurationPopover(false)
    setStayDurationArrowUp(false)
    Toast.show({ content: `选择了${label}` })
    setFilters({ stayDuration: value })
    refreshHotels()
    setTimeout(() => {
      Toast.show({ content: '筛选成功，找到符合条件的酒店' })
    }, 500)
  }

  const handleBrandSelect = (value: string, label: string) => {
    setShowBrandPopover(false)
    setBrandArrowUp(false)
    Toast.show({ content: `选择了${label}` })
    setFilters({ brand: value })
    refreshHotels()
    setTimeout(() => {
      Toast.show({ content: '筛选成功，找到符合条件的酒店' })
    }, 500)
  }

  const handleSortSelect = (key: string, label: string) => {
    setShowSortPopover(false)
    Toast.show({ content: `选择了${label}` })
    setFilters({
      sortBy: key as
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

  const handleStayDurationClick = () => {
    setShowStayDurationPopover(!showStayDurationPopover)
    setStayDurationArrowUp(!showStayDurationPopover)
    setShowBrandPopover(false)
    setBrandArrowUp(false)
    setShowSortPopover(false)
  }

  const handleBrandClick = () => {
    setShowBrandPopover(!showBrandPopover)
    setBrandArrowUp(!showBrandPopover)
    setShowStayDurationPopover(false)
    setStayDurationArrowUp(false)
    setShowSortPopover(false)
  }

  const handleSortClick = () => {
    setShowSortPopover(!showSortPopover)
    setShowStayDurationPopover(false)
    setStayDurationArrowUp(false)
    setShowBrandPopover(false)
    setBrandArrowUp(false)
  }

  const sortOptions = [
    { key: 'price_asc', label: '价格从低到高', value: 'price_asc' },
    { key: 'price_desc', label: '价格从高到低', value: 'price_desc' },
    { key: 'rating_desc', label: '评分从高到低', value: 'rating_desc' },
    { key: 'distance_asc', label: '距离从近到远', value: 'distance_asc' },
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
      <HotelListHeader
        onSearch={handleSearch}
        onDropdownStateChange={setIsCoreFilterDropdownOpen}
        initialFilters={filters}
      />

      <View style={{ position: 'relative', zIndex: 100 }}>
        <FilterTags
          showStayDurationPopover={showStayDurationPopover}
          showBrandPopover={showBrandPopover}
          showSortPopover={showSortPopover}
          stayDurationArrowUp={stayDurationArrowUp}
          brandArrowUp={brandArrowUp}
          selectedFilters={selectedFilters}
          filterTags={filterTags}
          onStayDurationClick={handleStayDurationClick}
          onBrandClick={handleBrandClick}
          onSortClick={handleSortClick}
          onFilterTagClick={handleFilterTagClick}
          onRemoveFilter={handleRemoveFilter}
        />

        <FilterDropdown
          visible={showStayDurationPopover}
          options={stayDurationOptions}
          onSelect={handleStayDurationSelect}
        />

        <FilterDropdown
          visible={showBrandPopover}
          options={brandOptions}
          onSelect={handleBrandSelect}
        />

        <FilterDropdown
          visible={showSortPopover}
          options={sortOptions}
          onSelect={handleSortSelect}
        />
      </View>

      <HotelListContent
        hotelList={hotelList}
        loading={loading}
        hasMore={hasMore}
        error={error}
        isAnyDropdownOpen={isAnyDropdownOpen}
      />
    </View>
  )
}
