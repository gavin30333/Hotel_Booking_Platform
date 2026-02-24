import { Toast } from 'antd-mobile'
import { View } from '@tarojs/components'
import Taro, {
  useLoad,
  useReachBottom,
  usePullDownRefresh,
  useRouter,
} from '@tarojs/taro'
import { useState, useEffect, useCallback } from 'react'
import './ListPage.less'
import { useHotelList } from '@/hooks/useHotelList'
import { useHotelStore } from '@/store/hotelStore'
import HotelListHeader from './components/HotelListHeader'
import FilterTags, { FilterTagProps } from './components/FilterTags'
import Dropdown from '@/components/common/display/Dropdown'
import HotelListContent from './components/HotelListContent'
import {
  sortOptions,
  stayDurationOptions,
  brandOptions,
  filterTags,
} from './constants'
import { formatSearchFilters } from './utils'

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
    const formattedFilters = formatSearchFilters(params)
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

  const tags: FilterTagProps[] = [
    {
      label: '入住时长',
      icon: stayDurationArrowUp ? '▲' : '▼',
      onClick: handleStayDurationClick,
    },
    {
      label: '热门品牌',
      icon: brandArrowUp ? '▲' : '▼',
      onClick: handleBrandClick,
    },
    ...filterTags.map((tag) => {
      const isActive = selectedFilters.includes(tag.name)
      return {
        label: tag.name,
        onClick: () => handleFilterTagClick(tag.name, { [tag.key]: tag.value }),
        isActive,
        closable: isActive,
        onClose: () => handleRemoveFilter(tag.name, tag.key),
      }
    }),
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
        <FilterTags tags={tags} />

        <Dropdown
          visible={showStayDurationPopover}
          options={stayDurationOptions}
          onSelect={handleStayDurationSelect}
        />

        <Dropdown
          visible={showBrandPopover}
          options={brandOptions}
          onSelect={handleBrandSelect}
        />

        <Dropdown
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
