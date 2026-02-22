import React from 'react'
import { useQueryForm } from '@/hooks/useQueryForm'
import { SCENE_CONFIGS } from '@/constants/QueryConfig'
import { TabType, SpecialFeature } from '@/types/query.types'
import { SoundOutline, SmileOutline } from 'antd-mobile-icons'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TabBar, FormFields, SearchButton } from './components'

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

  const currentConfig = SCENE_CONFIGS[activeTab]

  const handleSearch = async (overrides?: any) => {
    const searchData = { ...formData, ...(overrides || {}), scene: activeTab }

    const city = searchData.location?.city || ''
    const keyword = searchData.location?.keyword || ''
    const checkInDate = searchData.dates?.startDate || ''
    const checkOutDate = searchData.dates?.endDate || ''

    Taro.navigateTo({
      url: `/pages/user/list/index?city=${encodeURIComponent(city)}&keyword=${encodeURIComponent(keyword)}&checkInDate=${encodeURIComponent(checkInDate)}&checkOutDate=${encodeURIComponent(checkOutDate)}`,
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
        <FormFields
          fields={currentConfig.fields}
          formData={formData}
          onUpdate={updateField}
          onSearch={handleSearch}
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
