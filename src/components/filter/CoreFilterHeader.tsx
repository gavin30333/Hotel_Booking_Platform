import { View, Text } from '@tarojs/components'
import { useState, useCallback, useEffect, useRef } from 'react'
import { SearchBar, Toast, Dropdown, DropdownRef } from 'antd-mobile'
import { MoreOutline } from 'antd-mobile-icons'
import AMapLoader from '@amap/amap-jsapi-loader'
import {
  CitySelector,
  CitySelectResult,
  HotSearchSelectResult,
} from '@/components/CitySelector'
import { GuestSelectionPopup } from '@/components/common/popup/GuestSelectionPopup'
import { CalendarPicker } from '@/components/common/form/CalendarPicker'
import { useLocation } from '@/hooks/useLocation'
import { GuestInfo } from '@/types/query.types'
import './CoreFilterHeader.less'

let AMap: any = null

interface CoreFilterHeaderProps {
  onSearch: (params: {
    city: string
    checkInDate: string
    checkOutDate: string
    rooms: number
    adults: number
    children: number
    minPrice?: number
    maxPrice?: number
    starRating?: number[]
    facilities?: string[]
    sortBy?: string
    location?: {
      name: string
      lat: number
      lng: number
    }
    [key: string]: any
  }) => void
  onDropdownStateChange?: (isOpen: boolean) => void
  initialFilters?: {
    city?: string
    checkInDate?: string
    checkOutDate?: string
    rooms?: number
    adults?: number
    children?: number
    minPrice?: number
    maxPrice?: number
    keyword?: string
    starRating?: number[]
    facilities?: string[]
    sortBy?: string
    location?: {
      name: string
      lat: number
      lng: number
    }
  }
}

interface SearchParams {
  city: string
  keyword: string
  checkInDate: string
  checkOutDate: string
  rooms: number
  adults: number
  children: number
  advancedOptions: boolean
}

export default function CoreFilterHeader({
  onSearch,
  onDropdownStateChange,
  initialFilters,
}: CoreFilterHeaderProps) {
  const [params, setParams] = useState<SearchParams>({
    city: initialFilters?.city || '北京',
    keyword: initialFilters?.keyword || '',
    checkInDate: initialFilters?.checkInDate || '',
    checkOutDate: initialFilters?.checkOutDate || '',
    rooms: initialFilters?.rooms || 1,
    adults: initialFilters?.adults || 2,
    children: initialFilters?.children || 0,
    advancedOptions: false,
  })

  const [showCityPicker, setShowCityPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [showMainSelector, setShowMainSelector] = useState(false)
  const [activeSortTab, setActiveSortTab] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('')
  const [selectedDistanceOption, setSelectedDistanceOption] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [selectedStarRating, setSelectedStarRating] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedHandle, setDraggedHandle] = useState<'min' | 'max' | null>(null)
  const [activeLocationCategory, setActiveLocationCategory] =
    useState('热门地标')
  const [activeFilterCategory, setActiveFilterCategory] = useState('品牌')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [locationPOIs, setLocationPOIs] = useState<{
    [key: string]: Array<{ name: string; lat: number; lng: number }>
  }>({
    热门地标: [],
    地铁站: [],
    景点: [],
  })
  const [isSearchingPOIs, setIsSearchingPOIs] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string
    lat: number
    lng: number
  } | null>(null)

  const dropdownRef = useRef<DropdownRef>(null)

  const [advancedOptions, setAdvancedOptions] = useState({
    starRating: [] as number[],
    facilities: [] as string[],
    priceRange: {
      min: initialFilters?.minPrice || 0,
      max: initialFilters?.maxPrice || 10000,
    },
    brand: undefined as string | undefined,
    minRating: undefined as number | undefined,
    roomType: undefined as string | undefined,
  })

  const [historyCities, setHistoryCities] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<{
    start: string | null
    end: string | null
  }>({ start: null, end: null })

  const { location, locateByGPS, loading: locationLoading } = useLocation()
  const [locationStatus, setLocationStatus] = useState<
    'loading' | 'success' | 'failed' | 'disabled'
  >('disabled')

  useEffect(() => {
    if (initialFilters) {
      setParams((prev) => ({
        ...prev,
        city: initialFilters.city || prev.city,
        keyword: initialFilters.keyword || prev.keyword,
        checkInDate: initialFilters.checkInDate || prev.checkInDate,
        checkOutDate: initialFilters.checkOutDate || prev.checkOutDate,
        rooms: initialFilters.rooms || prev.rooms,
        adults: initialFilters.adults || prev.adults,
        children: initialFilters.children || prev.children,
      }))
      if (
        initialFilters.minPrice !== undefined ||
        initialFilters.maxPrice !== undefined
      ) {
        setAdvancedOptions((prev) => ({
          ...prev,
          priceRange: {
            min: initialFilters.minPrice || 0,
            max: initialFilters.maxPrice || 10000,
          },
        }))
      }
      if (initialFilters.checkInDate && initialFilters.checkOutDate) {
        setSelectedDate({
          start: initialFilters.checkInDate,
          end: initialFilters.checkOutDate,
        })
      }
    }
  }, [initialFilters])

  useEffect(() => {
    const savedHistory = localStorage.getItem('hotel_search_history_cities')
    if (savedHistory) {
      try {
        setHistoryCities(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to parse history cities:', error)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const mainSelectorContainer = document.querySelector(
        '.main-selector-container'
      )
      if (
        mainSelectorContainer &&
        mainSelectorContainer.contains(e.target as Node)
      ) {
        return
      }

      const mainSelector = document.querySelector('.main-selector')
      if (mainSelector && mainSelector.contains(e.target as Node)) {
        return
      }

      // Close Dropdown if click outside
      // Note: antd-mobile Dropdown handles click outside internally for its overlay,
      // but if we have other popups we might want to close them.
      setShowMainSelector(false)
      setShowCityPicker(false)
      setShowDatePicker(false)
      setShowRoomPicker(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])


  useEffect(() => {
    if (params.checkInDate && params.checkOutDate) {
      setSelectedDate({ start: params.checkInDate, end: params.checkOutDate })
    }
  }, [params.checkInDate, params.checkOutDate])

  useEffect(() => {
    if (location) {
      setParams((prev) => ({ ...prev, city: location.city }))
      setLocationStatus('success')
    }
  }, [location])

  const searchPOIs = useCallback(
    async (category: string, cityOverride?: string) => {
      const apiKey = process.env.AMAP_API_KEY || 'your_amap_api_key_here'

      if (!apiKey || apiKey === 'your_amap_api_key_here') {
        Toast.fail('高德地图API密钥未配置')
        return
      }

      try {
        setIsSearchingPOIs(true)

        if (!AMap) {
          AMap = await AMapLoader.load({
            key: apiKey,
            version: '2.0',
            plugins: ['AMap.PlaceSearch', 'AMap.Geocoder'],
          })
        }

        const city = cityOverride || params.city || '北京'
        let cityCenter: [number, number] = [116.397428, 39.90923]

        const geocoder = new AMap.Geocoder({
          city: city,
          radius: 1000,
        })

        await new Promise<void>((resolve, reject) => {
          geocoder.getLocation(city, (status: string, result: any) => {
            if (status === 'complete' && result.info === 'OK') {
              cityCenter = [
                result.geocodes[0].location.getLng(),
                result.geocodes[0].location.getLat(),
              ]
              resolve()
            } else {
              reject(new Error('获取城市坐标失败'))
            }
          })
        })

        const placeSearch = new AMap.PlaceSearch({
          pageSize: 20,
          pageIndex: 1,
          city: city,
          extensions: 'all',
        })

        let keywords = ''
        let types = ''

        switch (category) {
          case '热门地标':
            keywords = '地标'
            types = '080000'
            break
          case '地铁站':
            keywords = '地铁站'
            types = '150500'
            break
          case '景点':
            keywords = '景点'
            types = '110000'
            break
          default:
            keywords = '地标'
            types = '080000'
        }

        await new Promise<void>((resolve, reject) => {
          placeSearch.searchNearBy(
            keywords,
            cityCenter,
            5000,
            (status: string, result: any) => {
              if (status === 'complete' && result.info === 'OK') {
                const pois = result.pois.map((poi: any) => ({
                  name: poi.name,
                  lat: poi.location.getLat(),
                  lng: poi.location.getLng(),
                }))
                setLocationPOIs((prev) => ({
                  ...prev,
                  [category]: pois,
                }))
                resolve()
              } else {
                reject(new Error('搜索POI失败'))
              }
            },
            {
              types: types,
            }
          )
        })
      } catch (error) {
        console.error('搜索POI出错:', error)
        Toast.fail('搜索位置信息失败，请稍后重试')
      } finally {
        setIsSearchingPOIs(false)
      }
    },
    [params.city]
  )

  useEffect(() => {
    const isAnyDropdownOpen =
      showCityPicker ||
      showDatePicker ||
      showRoomPicker ||
      activeSortTab !== null ||
      showMainSelector
    if (onDropdownStateChange) {
      onDropdownStateChange(isAnyDropdownOpen)
    }
  }, [
    showCityPicker,
    showDatePicker,
    showRoomPicker,
    activeSortTab,
    showMainSelector,
    onDropdownStateChange,
  ])

  useEffect(() => {
    if (
      activeSortTab === 'distance' &&
      locationPOIs[activeLocationCategory].length === 0
    ) {
      searchPOIs(activeLocationCategory)
    }
  }, [activeSortTab, activeLocationCategory, searchPOIs, locationPOIs])

  const handleParamChange = useCallback(
    (key: keyof SearchParams, value: any) => {
      setParams((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const formatDate = useCallback((date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [])

  const parseDate = useCallback((dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }, [])

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}

    if (!params.city) {
      errors.city = '请选择城市'
    }

    if (!params.checkInDate) {
      errors.checkInDate = '请选择入住日期'
    }
    if (!params.checkOutDate) {
      errors.checkOutDate = '请选择离店日期'
    }
    if (params.checkInDate && params.checkOutDate) {
      const checkIn = parseDate(params.checkInDate)
      const checkOut = parseDate(params.checkOutDate)
      if (checkOut < checkIn) {
        errors.dateRange = '离店日期必须晚于入住日期'
      }
    }

    if (advancedOptions.priceRange.min > advancedOptions.priceRange.max) {
      errors.priceRange = '最低价格不能大于最高价格'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [
    params.city,
    params.checkInDate,
    params.checkOutDate,
    advancedOptions.priceRange,
    parseDate,
  ])

  const handleSearch = useCallback(() => {
    onSearch({
      ...params,
      keyword: searchValue || params.keyword,
      ...advancedOptions,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      starRating: selectedStarRating,
      facilities: selectedTags,
    })
    Toast.success('搜索成功')
  }, [
    params,
    searchValue,
    advancedOptions,
    priceRange,
    selectedStarRating,
    selectedTags,
    onSearch,
  ])

  const handleCitySelect = useCallback(
    (result: CitySelectResult) => {
      const cityValue = result.city
      handleParamChange('city', cityValue)

      const newHistory = [
        cityValue,
        ...historyCities.filter((city) => city !== cityValue),
      ].slice(0, 5)
      setHistoryCities(newHistory)
      try {
        localStorage.setItem(
          'hotel_search_history_cities',
          JSON.stringify(newHistory)
        )
      } catch (error) {
        console.error('Failed to save history cities:', error)
      }

      setShowCityPicker(false)

      setLocationPOIs({
        热门地标: [],
        地铁站: [],
        景点: [],
      })

      searchPOIs(activeLocationCategory, cityValue)

      onSearch({
        ...params,
        keyword: searchValue || params.keyword,
        city: cityValue,
        ...advancedOptions,
      })
    },
    [
      historyCities,
      handleParamChange,
      params,
      searchValue,
      advancedOptions,
      onSearch,
      searchPOIs,
      activeLocationCategory,
    ]
  )

  const handleHotSearchSelect = useCallback(
    (result: HotSearchSelectResult) => {
      setShowCityPicker(false)

      if (result.type === 'hotel' && result.hotelId) {
        const searchParams = new URLSearchParams()
        searchParams.append('id', result.hotelId)
        if (params.checkInDate) {
          searchParams.append('checkInDate', params.checkInDate)
        }
        if (params.checkOutDate) {
          searchParams.append('checkOutDate', params.checkOutDate)
        }
        searchParams.append('roomCount', String(params.rooms || 1))
        searchParams.append('adultCount', String(params.adults || 2))
        searchParams.append('childCount', String(params.children || 0))
        window.location.href = `/#/pages/detail/index?${searchParams.toString()}`
      } else {
        // 当没有 hotelId 时，用酒店名作为关键词搜索列表页
        const keyword = result.value || (result as any).name || ''
        setSearchValue(keyword)
        setParams((prev) => ({ ...prev, keyword }))
        onSearch({
          ...params,
          keyword,
          ...advancedOptions,
        })
      }
    },
    [params, advancedOptions, onSearch]
  )

  const handleDateConfirm = useCallback(
    (range: { start: string | null; end: string | null }) => {
      if (range.start && range.end) {
        handleParamChange('checkInDate', range.start)
        handleParamChange('checkOutDate', range.end)
        setSelectedDate({ start: range.start, end: range.end })
      }
    },
    [handleParamChange]
  )

  const handleGuestChange = useCallback((guestInfo: GuestInfo) => {
    const getNumber = (
      val: number | number[] | undefined,
      defaultVal: number = 0
    ): number => {
      if (val === undefined) return defaultVal
      if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
      return val
    }

    setParams((prev) => ({
      ...prev,
      rooms: getNumber(guestInfo.rooms, 1),
      adults: getNumber(guestInfo.adults, 2),
      children: getNumber(guestInfo.children, 0),
    }))
  }, [])

  const handleLocationClick = async () => {
    if (locationLoading) return
    setLocationStatus('loading')

    try {
      const result = await locateByGPS()
      if (result) {
        setLocationStatus('success')
      } else {
        setLocationStatus('failed')
      }
    } catch (error) {
      setLocationStatus('failed')
    }
  }

  const handlePriceSliderStart = (handle: 'min' | 'max') => (e: any) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedHandle(handle)
  }

  const handlePriceSliderMove = useCallback(
    (e: any) => {
      if (!isDragging || !draggedHandle) return

      const slider = document.querySelector('.price-slider')
      if (!slider) return

      const rect = slider.getBoundingClientRect()
      let x: number

      if (e.touches) {
        x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
      } else if (e.clientX) {
        x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      } else {
        return
      }

      const percentage = x / rect.width
      const price = Math.round(percentage * 10000)
      const roundedPrice = Math.round(price / 100) * 100

      setPriceRange((prev) => {
        if (draggedHandle === 'min') {
          return { min: Math.min(roundedPrice, prev.max - 100), max: prev.max }
        } else {
          return { min: prev.min, max: Math.max(roundedPrice, prev.min + 100) }
        }
      })
    },
    [isDragging, draggedHandle]
  )

  const handlePriceSliderEnd = useCallback(() => {
    setIsDragging(false)
    setDraggedHandle(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handlePriceSliderMove)
      document.addEventListener('mouseup', handlePriceSliderEnd)
      document.addEventListener('touchmove', handlePriceSliderMove)
      document.addEventListener('touchend', handlePriceSliderEnd)

      return () => {
        document.removeEventListener('mousemove', handlePriceSliderMove)
        document.removeEventListener('mouseup', handlePriceSliderEnd)
        document.removeEventListener('touchmove', handlePriceSliderMove)
        document.removeEventListener('touchend', handlePriceSliderEnd)
      }
    }
  }, [isDragging, draggedHandle, handlePriceSliderMove, handlePriceSliderEnd])

  const guestInfo: GuestInfo = {
    rooms: params.rooms,
    adults: params.adults,
    children: params.children,
    childAges: [],
  }

  return (
    <View className="core-filter-header">
      <View className="top-filter-bar">
        <View className="back-button" onClick={() => window.history.back()}>
          <Text className="back-icon">‹</Text>
        </View>

        <View className="search-capsule">
          <View
            className="main-selector-container"
            onClick={(e) => {
              e.stopPropagation()
              setShowMainSelector(true)
            }}
          >
            <View
              className="filter-item compact"
              onClick={(e) => {
                e.stopPropagation()
                setShowCityPicker(true)
              }}
            >
              <Text className="filter-value filter-value-xs">
                {params.city}
              </Text>
            </View>

            <View
              className="filter-item compact"
              onClick={(e) => {
                e.stopPropagation()
                setShowDatePicker(true)
              }}
            >
              <Text className="filter-value filter-value-xs">
                {params.checkInDate && params.checkOutDate
                  ? `${params.checkInDate.split('-')[1]}-${params.checkInDate.split('-')[2]} 至 ${params.checkOutDate.split('-')[1]}-${params.checkOutDate.split('-')[2]}`
                  : '选择日期'}
              </Text>
            </View>

            <View
              className="filter-item compact"
              onClick={(e) => {
                e.stopPropagation()
                setShowRoomPicker(true)
              }}
            >
              <Text className="filter-value filter-value-xs">
                {params.rooms}间
              </Text>
              <Text className="filter-value filter-value-xs">
                {params.adults}人
              </Text>
            </View>
          </View>

          <View className="search-item">
            <SearchBar
              placeholder="位置/品牌/酒店"
              value={searchValue || params.keyword}
              onChange={(val) => {
                setSearchValue(val)
                setParams((prev) => ({ ...prev, keyword: val }))
              }}
              onSubmit={() => {
                handleSearch()
              }}
              className="search-bar-compact"
            />
          </View>
        </View>

        {/* <View className="map-icon">
          <EnvironmentOutline fontSize={20} color="#666" />
          <Text className="icon-text">地图</Text>
        </View> */}

        <View className="more-options">
          <MoreOutline fontSize={20} color="#666" />
          <Text className="icon-text">更多</Text>
        </View>
      </View>

      {showMainSelector && (
        <View className="main-selector" onClick={(e) => e.stopPropagation()}>
          <View
            className="selector-row"
            onClick={(e) => {
              e.stopPropagation()
              setShowCityPicker(true)
            }}
          >
            <Text className="selector-value">{params.city}</Text>
            <Text className="location-icon">📍</Text>
          </View>

          <View
            className="selector-row"
            onClick={(e) => {
              e.stopPropagation()
              setShowDatePicker(true)
            }}
          >
            <Text className="selector-value">
              {params.checkInDate && params.checkOutDate
                ? `${params.checkInDate.split('-')[1]}月${params.checkInDate.split('-')[2]}日 至 ${params.checkOutDate.split('-')[1]}月${params.checkOutDate.split('-')[2]}日`
                : '选择日期'}
            </Text>
          </View>

          <View
            className="selector-row"
            onClick={(e) => {
              e.stopPropagation()
              setShowRoomPicker(true)
            }}
          >
            <Text className="selector-value">
              {params.rooms}间房 {params.adults}成人 {params.children}儿童
            </Text>
          </View>

          <View
            className="confirm-button"
            onClick={() => setShowMainSelector(false)}
          >
            <Text className="confirm-text">确定</Text>
          </View>
        </View>
      )}

      <View className="sort-bar-container">
        <Dropdown
          activeKey={activeSortTab}
          onChange={(key) => setActiveSortTab(key)}
          className="core-filter-dropdown"
        >
          <Dropdown.Item key="welcome" title="欢迎度排序">
            <View className="dropdown-panel-content">
              {[
                '价格从低到高',
                '价格从高到低',
                '评分从高到低',
                '距离从近到远',
              ].map((option) => (
                <View
                  key={option}
                  className={`dropdown-item ${selectedSortOption === option ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSortOption(option)
                    const sortBy =
                      option === '价格从低到高'
                        ? 'price_asc'
                        : option === '价格从高到低'
                          ? 'price_desc'
                          : option === '评分从高到低'
                            ? 'rating_desc'
                            : 'distance_asc'
                    onSearch({
                      ...params,
                      keyword: searchValue || params.keyword,
                      ...advancedOptions,
                      minPrice: priceRange.min,
                      maxPrice: priceRange.max,
                      starRating: selectedStarRating,
                      facilities: selectedTags,
                      sortBy,
                    })
                    setActiveSortTab(null)
                  }}
                >
                  <Text className="dropdown-text">{option}</Text>
                  {selectedSortOption === option && (
                    <Text className="check-icon">✓</Text>
                  )}
                </View>
              ))}
            </View>
          </Dropdown.Item>

          <Dropdown.Item key="distance" title="位置距离">
            <View className="dropdown-panel-content location-dropdown">
              <View className="location-content">
                <View className="location-sidebar">
                  {['热门地标', '地铁站', '景点'].map((category) => (
                    <View
                      key={category}
                      className={`sidebar-item ${activeLocationCategory === category ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveLocationCategory(category)
                        // searchPOIs will be triggered by useEffect when category changes if needed
                        // or we can call it directly here to be safe/faster response
                        if (locationPOIs[category].length === 0) {
                          searchPOIs(category)
                        }
                      }}
                    >
                      <Text className="sidebar-text">{category}</Text>
                    </View>
                  ))}
                </View>
                <View className="location-options">
                  {isSearchingPOIs ? (
                    <View className="loading-container">
                      <Text className="loading-text">搜索中...</Text>
                    </View>
                  ) : locationPOIs[activeLocationCategory]?.length > 0 ? (
                    <View className="poi-list">
                      {locationPOIs[activeLocationCategory].map(
                        (item, index) => (
                          <View
                            key={index}
                            className={`poi-tag ${selectedLocation?.name === item.name ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedLocation({
                                name: item.name,
                                lat: item.lat,
                                lng: item.lng,
                              })
                              setSelectedDistanceOption(item.name)
                              onSearch({
                                ...params,
                                keyword: item.name,
                                ...advancedOptions,
                                minPrice: priceRange.min,
                                maxPrice: priceRange.max,
                                starRating: selectedStarRating,
                                facilities: selectedTags,
                              })
                              setActiveSortTab(null)
                            }}
                          >
                            <Text className="poi-text">{item.name}</Text>
                          </View>
                        )
                      )}
                    </View>
                  ) : (
                    <View className="empty-container">
                      <Text className="empty-text">点击左侧分类搜索位置</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Dropdown.Item>

          <Dropdown.Item key="price" title="价格/星级">
            <View className="dropdown-panel-content price-dropdown">
              <View className="price-section">
                <Text className="section-title">价格区间</Text>
                <View className="price-slider-container">
                  <View className="price-slider">
                    <View
                      className="slider-track"
                      style={{
                        left: `${(priceRange.min / 10000) * 100}%`,
                        width: `${((priceRange.max - priceRange.min) / 10000) * 100}%`,
                      }}
                    />
                    <View
                      className="slider-handle"
                      style={{ left: `${(priceRange.min / 10000) * 100}%` }}
                      onMouseDown={handlePriceSliderStart('min')}
                      onTouchStart={handlePriceSliderStart('min')}
                    />
                    <View
                      className="slider-handle"
                      style={{ left: `${(priceRange.max / 10000) * 100}%` }}
                      onMouseDown={handlePriceSliderStart('max')}
                      onTouchStart={handlePriceSliderStart('max')}
                    />
                  </View>
                  <View className="price-labels">
                    <Text className="price-label">¥0</Text>
                    <Text className="price-current">
                      ¥{priceRange.min}-¥{priceRange.max}
                    </Text>
                    <Text className="price-label">¥10000以上</Text>
                  </View>
                </View>
                <View className="price-presets">
                  {['¥200以下', '¥200-500', '¥500-1000', '¥1000以上'].map(
                    (item) => (
                      <View
                        key={item}
                        className="preset-tag"
                        onClick={() => {
                          if (item === '¥200以下')
                            setPriceRange({ min: 0, max: 200 })
                          else if (item === '¥200-500')
                            setPriceRange({ min: 200, max: 500 })
                          else if (item === '¥500-1000')
                            setPriceRange({ min: 500, max: 1000 })
                          else setPriceRange({ min: 1000, max: 10000 })
                        }}
                      >
                        <Text className="preset-text">{item}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
              <View className="star-section">
                <Text className="section-title">星级/档次</Text>
                <View className="star-options">
                  {[
                    { label: '2星及以下', value: 2 },
                    { label: '3星/舒适', value: 3 },
                    { label: '4星/高档', value: 4 },
                    { label: '5星/豪华', value: 5 },
                  ].map((item) => (
                    <View
                      key={item.label}
                      className={`star-tag ${selectedStarRating.includes(item.value) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedStarRating.includes(item.value)) {
                          setSelectedStarRating(
                            selectedStarRating.filter((s) => s !== item.value)
                          )
                        } else {
                          setSelectedStarRating([
                            ...selectedStarRating,
                            item.value,
                          ])
                        }
                      }}
                    >
                      <Text className="star-text">{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className="dropdown-actions">
                <View
                  className="action-btn secondary"
                  onClick={() => {
                    setPriceRange({ min: 0, max: 10000 })
                    setSelectedStarRating([])
                  }}
                >
                  <Text className="action-text">清除</Text>
                </View>
                <View
                  className="action-btn primary"
                  onClick={() => {
                    onSearch({
                      ...params,
                      keyword: searchValue || params.keyword,
                      ...advancedOptions,
                      minPrice: priceRange.min,
                      maxPrice: priceRange.max,
                      starRating: selectedStarRating,
                      facilities: selectedTags,
                    })
                    setActiveSortTab(null)
                  }}
                >
                  <Text className="action-text primary">确定</Text>
                </View>
              </View>
            </View>
          </Dropdown.Item>

          <Dropdown.Item key="filter" title="筛选">
            <View className="dropdown-panel-content filter-dropdown">
              <View className="filter-content">
                <View className="filter-sidebar">
                  {['热门筛选', '品牌', '类型特色', '设施', '床型', '点评'].map(
                    (category) => (
                      <View
                        key={category}
                        className={`sidebar-item ${activeFilterCategory === category ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveFilterCategory(category)
                        }}
                      >
                        <Text className="sidebar-text">{category}</Text>
                      </View>
                    )
                  )}
                </View>
                <View className="filter-options">
                  {activeFilterCategory === '热门筛选' && (
                    <>
                      {[
                        { label: '免费WiFi', value: '免费WiFi' },
                        { label: '停车场', value: '停车场' },
                        { label: '含早餐', value: '含早餐' },
                        { label: '游泳池', value: '游泳池' },
                        { label: '健身房', value: '健身房' },
                        { label: '无烟房', value: '无烟房' },
                      ].map((item) => (
                        <View
                          key={item.value}
                          className={`filter-tag ${selectedTags.includes(item.value) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (selectedTags.includes(item.value)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item.value)
                              )
                            } else {
                              setSelectedTags([...selectedTags, item.value])
                            }
                          }}
                        >
                          <Text className="filter-tag-text">{item.label}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {activeFilterCategory === '品牌' && (
                    <>
                      {[
                        { label: '希尔顿', value: '希尔顿' },
                        { label: '万豪', value: '万豪' },
                        { label: '洲际', value: '洲际' },
                        { label: '凯悦', value: '凯悦' },
                        { label: '雅高', value: '雅高' },
                        { label: '锦江', value: '锦江' },
                        { label: '如家', value: '如家' },
                        { label: '汉庭', value: '汉庭' },
                      ].map((item) => (
                        <View
                          key={item.value}
                          className={`filter-tag ${advancedOptions.brand === item.value ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setAdvancedOptions((prev) => ({
                              ...prev,
                              brand:
                                prev.brand === item.value
                                  ? undefined
                                  : item.value,
                            }))
                          }}
                        >
                          <Text className="filter-tag-text">{item.label}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {activeFilterCategory === '类型特色' && (
                    <>
                      {[
                        { label: '亲子酒店', value: '亲子酒店' },
                        { label: '情侣酒店', value: '情侣酒店' },
                        { label: '商务酒店', value: '商务酒店' },
                        { label: '度假酒店', value: '度假酒店' },
                        { label: '民宿', value: '民宿' },
                        { label: '公寓', value: '公寓' },
                      ].map((item) => (
                        <View
                          key={item.value}
                          className={`filter-tag ${selectedTags.includes(item.value) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (selectedTags.includes(item.value)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item.value)
                              )
                            } else {
                              setSelectedTags([...selectedTags, item.value])
                            }
                          }}
                        >
                          <Text className="filter-tag-text">{item.label}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {activeFilterCategory === '设施' && (
                    <>
                      {[
                        '免费WiFi',
                        '停车场',
                        '游泳池',
                        '健身房',
                        '餐厅',
                        'SPA',
                        '商务中心',
                        '会议室',
                        '24小时前台',
                        '行李寄存',
                        '洗衣服务',
                        '接机服务',
                      ].map((item) => (
                        <View
                          key={item}
                          className={`filter-tag ${selectedTags.includes(item) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item)
                              )
                            } else {
                              setSelectedTags([...selectedTags, item])
                            }
                          }}
                        >
                          <Text className="filter-tag-text">{item}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {activeFilterCategory === '床型' && (
                    <>
                      {[
                        { label: '大床房', value: '大床房' },
                        { label: '双床房', value: '双床房' },
                        { label: '套房', value: '套房' },
                        { label: '家庭房', value: '家庭房' },
                        { label: '亲子房', value: '亲子房' },
                      ].map((item) => (
                        <View
                          key={item.value}
                          className={`filter-tag ${advancedOptions.roomType === item.value ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setAdvancedOptions((prev) => ({
                              ...prev,
                              roomType:
                                prev.roomType === item.value
                                  ? undefined
                                  : item.value,
                            }))
                          }}
                        >
                          <Text className="filter-tag-text">{item.label}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  {activeFilterCategory === '点评' && (
                    <>
                      {[
                        { label: '4.5分以上', value: 4.5 },
                        { label: '4.0分以上', value: 4.0 },
                        { label: '3.5分以上', value: 3.5 },
                        { label: '3.0分以上', value: 3.0 },
                      ].map((item) => (
                        <View
                          key={item.value}
                          className={`filter-tag ${advancedOptions.minRating === item.value ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setAdvancedOptions((prev) => ({
                              ...prev,
                              minRating:
                                prev.minRating === item.value
                                  ? undefined
                                  : item.value,
                            }))
                          }}
                        >
                          <Text className="filter-tag-text">{item.label}</Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              </View>
              <View className="dropdown-actions">
                <View
                  className="action-btn secondary"
                  onClick={() => {
                    setSelectedTags([])
                    setAdvancedOptions({
                      starRating: [],
                      facilities: [],
                      priceRange: { min: 0, max: 10000 },
                    })
                  }}
                >
                  <Text className="action-text">清除</Text>
                </View>
                <View
                  className="action-btn primary"
                  onClick={() => {
                    onSearch({
                      ...params,
                      keyword: searchValue || params.keyword,
                      ...advancedOptions,
                      minPrice: priceRange.min,
                      maxPrice: priceRange.max,
                      starRating: selectedStarRating,
                      facilities: selectedTags,
                    })
                    setActiveSortTab(null)
                  }}
                >
                  <Text className="action-text primary">确定</Text>
                </View>
              </View>
            </View>
          </Dropdown.Item>
        </Dropdown>
      </View>

      <CitySelector
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onSelect={handleCitySelect}
        onHotSearchSelect={handleHotSearchSelect}
        currentCity={params.city}
      />

      <CalendarPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        defaultStartDate={params.checkInDate}
        defaultEndDate={params.checkOutDate}
        title="选择入住和离店日期"
      />

      <GuestSelectionPopup
        visible={showRoomPicker}
        onClose={() => setShowRoomPicker(false)}
        value={guestInfo}
        onChange={handleGuestChange}
      />

      {Object.keys(validationErrors).length > 0 && (
        <View className="error-messages">
          {Object.values(validationErrors).map((error, index) => (
            <Text key={index} className="error-message">
              {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}
