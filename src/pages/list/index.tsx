import { Toast } from 'antd-mobile'
import { View } from '@tarojs/components'
import { useHotelList } from '@/hooks/useHotelList'
import { useHotelStore } from '@/store/hotelStore'
import { useListPageStore } from '@/store/listPageStore'
import { useQueryStore } from '@/store/useQueryStore'
import Taro, { useLoad, usePullDownRefresh, useRouter } from '@tarojs/taro'
import { useState, useEffect, useCallback } from 'react'
import './ListPage.less'
import HotelListHeader from './components/HotelListHeader'
import FilterTags, { FilterTagProps } from './components/FilterTags'
import HotelListContent from './components/HotelListContent'
import { filterTags } from './constants'
import { formatSearchFilters } from './utils'

export default function HotelList() {
  const router = useRouter()
  const { hotelList, loading, hasMore, error, refreshHotels, loadMore } =
    useHotelList()
  const { filters, setFilters, resetFilters } = useHotelStore()
  const { resetList } = useListPageStore()
  const [isCoreFilterDropdownOpen, setIsCoreFilterDropdownOpen] =
    useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  const updateDates = useQueryStore((state) => state.updateDates)
  const updateGuests = useQueryStore((state) => state.updateGuests)
  const updateLocation = useQueryStore((state) => state.updateLocation)
  const getSearchParams = useQueryStore((state) => state.getSearchParams)
  const getGuests = useQueryStore((state) => state.getGuests)

  const initFromUrlAndStore = useCallback(() => {
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
    if (checkInDate && checkOutDate) {
      updateDates(
        decodeURIComponent(checkInDate),
        decodeURIComponent(checkOutDate)
      )
    }
    if (rooms || adults || children) {
      updateGuests(
        rooms ? Number(rooms) : 1,
        adults ? Number(adults) : 2,
        children ? Number(children) : 0
      )
    }

    if (hasParams) {
      resetFilters()
      setFilters(newFilters)
    }

    return hasParams
  }, [router.params, resetFilters, setFilters, updateDates, updateGuests])

  useLoad(() => {
    resetList()
    const hasParams = initFromUrlAndStore()
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

  const handleSearch = (params: Record<string, unknown>) => {
    const formattedFilters = formatSearchFilters(params)
    setFilters(formattedFilters)
    refreshHotels()
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

  const tags: FilterTagProps[] = filterTags.map((tag) => {
    const isActive = selectedFilters.includes(tag.name)
    return {
      label: tag.name,
      onClick: () => handleFilterTagClick(tag.name, { [tag.key]: tag.value }),
      isActive,
      closable: isActive,
      onClose: () => handleRemoveFilter(tag.name, tag.key),
    }
  })

  const storeGuests = getGuests()
  const storeParams = getSearchParams()

  const getNumber = (
    val: number | number[] | undefined,
    defaultVal: number
  ): number => {
    if (val === undefined) return defaultVal
    if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
    return val
  }

  const headerFilters = {
    ...filters,
    rooms: getNumber(storeGuests.rooms, 1),
    adults: getNumber(storeGuests.adults, 2),
    children: getNumber(storeGuests.children, 0),
    checkInDate: storeParams.checkInDate,
    checkOutDate: storeParams.checkOutDate,
  }

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
        initialFilters={headerFilters}
      />

      <View style={{ position: 'relative', zIndex: 1 }}>
        <FilterTags tags={tags} />
      </View>

      <HotelListContent
        hotelList={hotelList}
        loading={loading}
        hasMore={hasMore}
        error={error}
        isAnyDropdownOpen={isCoreFilterDropdownOpen}
        onLoadMore={loadMore}
      />
    </View>
  )
}
