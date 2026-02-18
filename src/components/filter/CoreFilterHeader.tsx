import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState, useCallback, useEffect } from 'react'
import { SearchBar, Toast } from 'antd-mobile'
import AMapLoader from '@amap/amap-jsapi-loader'
import { CitySelector } from '@/components/CitySelector'
import { GuestSelectionPopup } from '@/components/FieldRenderers/GuestField/components/GuestSelectionPopup'
import { CalendarPicker } from '@/components/common/CalendarPicker'
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
    [key: string]: any
  }) => void
  onDropdownStateChange?: (isOpen: boolean) => void
}

interface SearchParams {
  city: string
  checkInDate: string
  checkOutDate: string
  rooms: number
  adults: number
  children: number
  advancedOptions: boolean
}

const sortOptions = [
  { label: '欢迎度', value: 'welcome' },
  { label: '位置', value: 'distance' },
  { label: '价格', value: 'price' },
  { label: '筛选', value: 'filter' },
]

export default function CoreFilterHeader({
  onSearch,
  onDropdownStateChange,
}: CoreFilterHeaderProps) {
  const [params, setParams] = useState<SearchParams>({
    city: '北京',
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    adults: 2,
    children: 0,
    advancedOptions: false,
  })

  const [showCityPicker, setShowCityPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [showWelcomeDropdown, setShowWelcomeDropdown] = useState(false)
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false)
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [welcomeArrowUp, setWelcomeArrowUp] = useState(false)
  const [distanceArrowUp, setDistanceArrowUp] = useState(false)
  const [priceArrowUp, setPriceArrowUp] = useState(false)
  const [filterArrowUp, setFilterArrowUp] = useState(false)
  const [showMainSelector, setShowMainSelector] = useState(false)
  const [activeSortTab, setActiveSortTab] = useState('welcome')
  const [searchValue, setSearchValue] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('')
  const [selectedDistanceOption, setSelectedDistanceOption] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [draggedHandle, setDraggedHandle] = useState<'min' | 'max' | null>(null)
  const [activeLocationCategory, setActiveLocationCategory] =
    useState('热门地标')
  const [activeFilterCategory, setActiveFilterCategory] = useState('品牌')
  const [expandedCategories, setExpandedCategories] = useState({
    热门筛选: false,
    品牌: false,
    类型特色: false,
    设施: false,
    床型: false,
    房间面积: false,
    点评: false,
    '服务/支付': false,
    适用人群: false,
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [locationPOIs, setLocationPOIs] = useState<{ [key: string]: string[] }>(
    {
      热门地标: [],
      地铁站: [],
      景点: [],
    }
  )
  const [isSearchingPOIs, setIsSearchingPOIs] = useState(false)

  const [advancedOptions, setAdvancedOptions] = useState({
    starRating: [] as number[],
    facilities: [] as string[],
    priceRange: {
      min: 0,
      max: 10000,
    },
  })

  const [historyCities, setHistoryCities] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<{
    start: string | null
    end: string | null
  }>({ start: null, end: null })

  const { location, locateByGPS, loading: locationLoading } = useLocation()
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'failed' | 'disabled'>('disabled')

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

      setShowWelcomeDropdown(false)
      setWelcomeArrowUp(false)
      setShowDistanceDropdown(false)
      setDistanceArrowUp(false)
      setShowPriceDropdown(false)
      setPriceArrowUp(false)
      setShowFilterDropdown(false)
      setFilterArrowUp(false)
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
      setParams(prev => ({ ...prev, city: location.city }))
      setLocationStatus('success')
    }
  }, [location])

  const searchPOIs = useCallback(
    async (category: string) => {
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
            plugins: ['AMap.PlaceSearch'],
          })
        }

        const city = params.city || '北京'
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
          extensions: 'base',
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
                const pois = result.pois.map((poi: any) => poi.name)
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
      showWelcomeDropdown ||
      showDistanceDropdown ||
      showPriceDropdown ||
      showFilterDropdown ||
      showMainSelector
    if (onDropdownStateChange) {
      onDropdownStateChange(isAnyDropdownOpen)
    }
  }, [
    showCityPicker,
    showDatePicker,
    showRoomPicker,
    showWelcomeDropdown,
    showDistanceDropdown,
    showPriceDropdown,
    showFilterDropdown,
    showMainSelector,
    onDropdownStateChange,
  ])

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
    if (validateForm()) {
      onSearch({
        ...params,
        ...advancedOptions,
      })
      Toast.success('搜索成功')
    } else {
      Toast.fail('请检查输入信息')
    }
  }, [params, advancedOptions, onSearch, validateForm])

  const handleCitySelect = useCallback(
    (cityValue: string) => {
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
    },
    [historyCities, handleParamChange]
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

  const handleGuestChange = useCallback(
    (guestInfo: GuestInfo) => {
      const getNumber = (val: number | number[] | undefined, defaultVal: number = 0): number => {
        if (val === undefined) return defaultVal
        if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
        return val
      }
      
      setParams(prev => ({
        ...prev,
        rooms: getNumber(guestInfo.rooms, 1),
        adults: getNumber(guestInfo.adults, 2),
        children: getNumber(guestInfo.children, 0),
      }))
    },
    []
  )

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

  const handlePriceSliderMove = (e: any) => {
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
    const price = Math.round(percentage * 100)
    const roundedPrice = Math.round(price / 10) * 10

    setPriceRange((prev) => {
      if (draggedHandle === 'min') {
        return { min: Math.min(roundedPrice, prev.max - 10), max: prev.max }
      } else {
        return { min: prev.min, max: Math.max(roundedPrice, prev.min + 10) }
      }
    })
  }

  const handlePriceSliderEnd = () => {
    setIsDragging(false)
    setDraggedHandle(null)
  }

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
        <View className="back-button">
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
            <View className="filter-item compact" onClick={(e) => {
              e.stopPropagation()
              setShowCityPicker(true)
            }}>
              <Text className="filter-value">{params.city}</Text>
            </View>

            <View className="filter-item compact" onClick={(e) => {
              e.stopPropagation()
              setShowDatePicker(true)
            }}>
              <Text className="filter-value">
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
              <Text className="filter-value">{params.rooms}间</Text>
              <Text className="filter-value">{params.adults}人</Text>
            </View>
          </View>

          <View className="search-item">
            <SearchBar
              placeholder="位置/品牌/酒店"
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearch}
              className="search-bar-compact"
            />
          </View>
        </View>

        <View className="map-icon">
          <Image
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=map%20icon%20simple%20outline%20style%20gray&image_size=square"
            className="icon-image"
          />
          <Text className="icon-text">地图</Text>
        </View>

        <View className="more-options">
          <Text className="more-dots">•••</Text>
          <Text className="icon-text">更多</Text>
        </View>
      </View>

      {showMainSelector && (
        <View
          className="main-selector"
          onClick={(e) => e.stopPropagation()}
        >
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

          <View className="confirm-button" onClick={() => setShowMainSelector(false)}>
            <Text className="confirm-text">确定</Text>
          </View>
        </View>
      )}

      <View className="sort-bar">
        <View
          className="sort-option"
          onClick={(e) => {
            e.stopPropagation()
            setActiveSortTab('welcome')
            setShowWelcomeDropdown(!showWelcomeDropdown)
            setWelcomeArrowUp(!showWelcomeDropdown)
            setShowDistanceDropdown(false)
            setDistanceArrowUp(false)
            setShowPriceDropdown(false)
            setPriceArrowUp(false)
            setShowFilterDropdown(false)
            setFilterArrowUp(false)
          }}
        >
          <Text>欢迎度排序</Text>
          <Text className="arrow">{welcomeArrowUp ? '▲' : '▼'}</Text>
        </View>

        <View
          className="sort-option"
          onClick={(e) => {
            e.stopPropagation()
            setActiveSortTab('distance')
            setShowWelcomeDropdown(false)
            setWelcomeArrowUp(false)
            setShowDistanceDropdown(!showDistanceDropdown)
            setDistanceArrowUp(!showDistanceDropdown)
            setShowPriceDropdown(false)
            setPriceArrowUp(false)
            setShowFilterDropdown(false)
            setFilterArrowUp(false)
          }}
        >
          <Text>位置距离</Text>
          <Text className="arrow">{distanceArrowUp ? '▲' : '▼'}</Text>
        </View>

        <View
          className="sort-option"
          onClick={(e) => {
            e.stopPropagation()
            setActiveSortTab('price')
            setShowWelcomeDropdown(false)
            setWelcomeArrowUp(false)
            setShowDistanceDropdown(false)
            setDistanceArrowUp(false)
            setShowPriceDropdown(!showPriceDropdown)
            setPriceArrowUp(!showPriceDropdown)
            setShowFilterDropdown(false)
            setFilterArrowUp(false)
          }}
        >
          <Text>价格/星级</Text>
          <Text className="arrow">{priceArrowUp ? '▲' : '▼'}</Text>
        </View>

        <View
          className="sort-option"
          onClick={(e) => {
            e.stopPropagation()
            setActiveSortTab('filter')
            setShowWelcomeDropdown(false)
            setWelcomeArrowUp(false)
            setShowDistanceDropdown(false)
            setDistanceArrowUp(false)
            setShowPriceDropdown(false)
            setPriceArrowUp(false)
            setShowFilterDropdown(!showFilterDropdown)
            setFilterArrowUp(!showFilterDropdown)
          }}
        >
          <Text>筛选</Text>
          <Text className="arrow">{filterArrowUp ? '▲' : '▼'}</Text>
        </View>

        {showWelcomeDropdown && (
          <View className="dropdown-panel" onClick={(e) => e.stopPropagation()}>
            {['价格从低到高', '价格从高到低', '评分从高到低', '距离从近到远'].map((option) => (
              <View
                key={option}
                className={`dropdown-item ${selectedSortOption === option ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedSortOption(option)
                  const sortBy = option === '价格从低到高' ? 'price_asc' :
                                option === '价格从高到低' ? 'price_desc' :
                                option === '评分从高到低' ? 'rating_desc' : 'distance_asc'
                  onSearch({
                    ...params,
                    ...advancedOptions,
                    sortBy,
                  })
                  setShowWelcomeDropdown(false)
                }}
              >
                <Text className="dropdown-text">{option}</Text>
                {selectedSortOption === option && (
                  <Text className="check-icon">✓</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {showDistanceDropdown && (
          <View className="dropdown-panel location-dropdown" onClick={(e) => e.stopPropagation()}>
            <View className="location-content">
              <View className="location-sidebar">
                {['热门地标', '地铁站', '景点'].map((category) => (
                  <View
                    key={category}
                    className={`sidebar-item ${activeLocationCategory === category ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveLocationCategory(category)
                      searchPOIs(category)
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
                    {locationPOIs[activeLocationCategory].map((item, index) => (
                      <View
                        key={index}
                        className={`poi-tag ${selectedDistanceOption === item ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDistanceOption(item)
                          setShowDistanceDropdown(false)
                        }}
                      >
                        <Text className="poi-text">{item}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="empty-container">
                    <Text className="empty-text">点击左侧分类搜索位置</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {showPriceDropdown && (
          <View className="dropdown-panel price-dropdown" onClick={(e) => e.stopPropagation()}>
            <View className="price-section">
              <Text className="section-title">价格区间</Text>
              <View className="price-slider-container">
                <View className="price-slider">
                  <View
                    className="slider-track"
                    style={{
                      left: `${(priceRange.min / 100) * 100}%`,
                      width: `${((priceRange.max - priceRange.min) / 100) * 100}%`,
                    }}
                  />
                  <View
                    className="slider-handle"
                    style={{ left: `${(priceRange.min / 100) * 100}%` }}
                    onMouseDown={handlePriceSliderStart('min')}
                    onTouchStart={handlePriceSliderStart('min')}
                  />
                  <View
                    className="slider-handle"
                    style={{ left: `${(priceRange.max / 100) * 100}%` }}
                    onMouseDown={handlePriceSliderStart('max')}
                    onTouchStart={handlePriceSliderStart('max')}
                  />
                </View>
                <View className="price-labels">
                  <Text className="price-label">¥0</Text>
                  <Text className="price-current">¥{priceRange.min}-¥{priceRange.max}</Text>
                  <Text className="price-label">¥100以上</Text>
                </View>
              </View>
              <View className="price-presets">
                {['¥50以下', '¥50-80', '¥80-100', '¥100以上'].map((item) => (
                  <View
                    key={item}
                    className="preset-tag"
                    onClick={() => {
                      if (item === '¥50以下') setPriceRange({ min: 0, max: 50 })
                      else if (item === '¥50-80') setPriceRange({ min: 50, max: 80 })
                      else if (item === '¥80-100') setPriceRange({ min: 80, max: 100 })
                      else setPriceRange({ min: 100, max: 100 })
                    }}
                  >
                    <Text className="preset-text">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="star-section">
              <Text className="section-title">星级/档次</Text>
              <View className="star-options">
                {['2星及以下', '3星/舒适', '4星/高档', '5星/豪华', '经济型', '舒适型', '高档型', '豪华型'].map((item) => (
                  <View key={item} className="star-tag">
                    <Text className="star-text">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="dropdown-actions">
              <View className="action-btn secondary" onClick={() => setPriceRange({ min: 0, max: 100 })}>
                <Text className="action-text">清除</Text>
              </View>
              <View className="action-btn primary" onClick={() => setShowPriceDropdown(false)}>
                <Text className="action-text primary">确定</Text>
              </View>
            </View>
          </View>
        )}

        {showFilterDropdown && (
          <View className="dropdown-panel filter-dropdown" onClick={(e) => e.stopPropagation()}>
            <View className="filter-content">
              <View className="filter-sidebar">
                {['热门筛选', '品牌', '类型特色', '设施', '床型', '房间面积', '点评', '服务/支付', '适用人群'].map((category) => (
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
                ))}
              </View>
              <View className="filter-options">
                {['免费WiFi', '停车场', '游泳池', '健身房', '餐厅', '无烟房', '商务中心', '会议室', 'SPA', '24小时前台', '行李寄存'].map((item) => (
                  <View
                    key={item}
                    className={`filter-tag ${selectedTags.includes(item) ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedTags.includes(item)) {
                        setSelectedTags(selectedTags.filter((tag) => tag !== item))
                      } else {
                        setSelectedTags([...selectedTags, item])
                      }
                    }}
                  >
                    <Text className="filter-tag-text">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      <CitySelector
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onSelect={handleCitySelect}
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
