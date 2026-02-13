import React from 'react'
import { useQueryForm } from '@/hooks/useQueryForm'
import { SCENE_CONFIGS } from '@/constants/QueryConfig'
import { TabType, SpecialFeature } from '@/types/query.types'
import { SoundOutline, SmileOutline } from 'antd-mobile-icons'
import { View, Text } from '@tarojs/components'
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
    // Merge overrides (e.g. from immediate tag selection) with current formData
    // Note: formData might be stale in this closure if state update hasn't propagated,
    // so overrides are crucial for immediate actions.
    const searchData = { ...formData, ...(overrides || {}), scene: activeTab }

    // 调用后端API查询酒店
    try {
      const response = await fetch('http://localhost:3000/api/hotel/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: searchData.location.city,
          checkInDate: searchData.dates.startDate,
          checkOutDate: searchData.dates.endDate,
          filters: {
            star: [],
          },
          pageNum: 1,
          pageSize: 20,
        }),
      })

      const data = await response.json()
      console.log('API Response:', data)
    } catch (error) {
      console.error('API Error:', error)
    }

    if (onSearch) {
      onSearch(searchData)
    } else {
      console.log('Search:', searchData)
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
