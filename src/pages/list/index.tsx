import { Toast } from 'antd-mobile'
import { View } from '@tarojs/components'
import { useHotelList } from '@/hooks/useHotelList'
import { useHotelStore } from '@/store/hotelStore'
import { useListPageStore } from '@/store/listPageStore'
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
    resetList()
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
