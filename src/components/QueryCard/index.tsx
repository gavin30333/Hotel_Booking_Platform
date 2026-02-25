import React from 'react'
import { FormField } from '@/components/common/form/FormField'
import { SearchButton } from '@/components/common/form/SearchButton'
import { useQueryForm } from '@/hooks/useQueryForm'
import { SCENE_CONFIGS } from '@/constants/QueryConfig'
import { useQueryStore } from '@/store/useQueryStore'
import { TabType, SpecialFeature } from '@/types/query.types'
import { SoundOutline, SmileOutline } from 'antd-mobile-icons'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TabBar } from './TabBar'

import './QueryCard.less'

interface QueryCardProps {
  defaultTab?: TabType
  onSearch?: (data: any) => void
}

export const QueryCard: React.FC<QueryCardProps> = ({
  defaultTab = TabType.DOMESTIC,
  onSearch,
}) => {
  const { activeTab, formData, handleTabChange, updateField } =
    useQueryForm(defaultTab)

  const updateDates = useQueryStore((state) => state.updateDates)
  const updateGuests = useQueryStore((state) => state.updateGuests)
  const updateLocation = useQueryStore((state) => state.updateLocation)
  const updatePriceRange = useQueryStore((state) => state.updatePriceRange)
  const updateStarRating = useQueryStore((state) => state.updateStarRating)
  const getSearchParams = useQueryStore((state) => state.getSearchParams)

  const currentConfig = SCENE_CONFIGS[activeTab]

  const handleSearch = async (overrides?: any) => {
    const searchData = { ...formData, ...(overrides || {}), scene: activeTab }

    const dates = searchData.dates
    const guests = searchData.guests
    const location = searchData.location

    if (dates?.startDate && dates?.endDate) {
      updateDates(dates.startDate, dates.endDate)
    }

    if (guests) {
      const getNumber = (
        val: number | number[] | undefined,
        defaultVal: number
      ): number => {
        if (val === undefined) return defaultVal
        if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
        return val
      }
      updateGuests(
        getNumber(guests.rooms, 1),
        getNumber(guests.adults, 2),
        getNumber(guests.children, 0)
      )

      if (guests.priceStar) {
        updatePriceRange(
          guests.priceStar.minPrice || 0,
          guests.priceStar.maxPrice || 99999
        )
        updateStarRating(
          (guests.priceStar.starRatings || []).map((s: string) => Number(s))
        )
      }
    }

    if (location) {
      updateLocation(location)
    }

    const params = getSearchParams()
    const city = params.city || ''
    const checkInDate = params.checkInDate
    const checkOutDate = params.checkOutDate

    const urlParams = new URLSearchParams()
    urlParams.append('city', city)
    urlParams.append('checkInDate', checkInDate)
    urlParams.append('checkOutDate', checkOutDate)
    urlParams.append('rooms', String(params.rooms))
    urlParams.append('adults', String(params.adults))
    urlParams.append('children', String(params.children))
    urlParams.append('minPrice', String(params.minPrice))
    urlParams.append('maxPrice', String(params.maxPrice))
    if (params.starRatings && params.starRatings.length > 0) {
      urlParams.append('starRatings', params.starRatings.join(','))
    }

    Taro.navigateTo({
      url: `/pages/list/index?${urlParams.toString()}`,
    })

    if (onSearch) {
      onSearch(searchData)
    }
  }

  const renderSpecialFeature = (feature: SpecialFeature, index: number) => {
    let Icon: React.ReactNode = null
    if (feature.type === 'notice') Icon = <SoundOutline />
    if (feature.type === 'guarantee') Icon = <SmileOutline />

    return (
      <View
        key={index}
        className={`special-feature ${feature.style || 'gray'}`}
      >
        {Icon && <View className="icon">{Icon}</View>}
        <Text>{feature.content}</Text>
      </View>
    )
  }

  return (
    <View className="query-card">
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <View className="card-content">
        <FormField
          fields={currentConfig.fields}
          formData={formData}
          onUpdate={updateField}
          onSearch={handleSearch}
          onSceneChange={handleTabChange}
        />
        {currentConfig.specialFeatures
          ?.filter((f) => f.type === 'notice')
          .map((f, i) => renderSpecialFeature(f, i))}

        <SearchButton onClick={handleSearch} />

        {currentConfig.specialFeatures
          ?.filter((f) => f.type === 'guarantee')
          .map((f, i) => renderSpecialFeature(f, i))}
      </View>
    </View>
  )
}
