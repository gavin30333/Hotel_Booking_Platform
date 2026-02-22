import React from 'react'
import { View } from '@tarojs/components'
import { CityIndexList } from './components/CityIndexList'
import { HotCitiesSection } from './components/HotCitiesSection'
import { CityGroup } from '../../../types'
import './DomesticTab.less'

interface DomesticTabProps {
  groups: CityGroup[]
  hotCities: string[]
  currentCity?: string
  onSelect: (city: string) => void
  scrollEnabled?: boolean
}

export const DomesticTab: React.FC<DomesticTabProps> = ({
  groups,
  hotCities,
  currentCity,
  onSelect,
  scrollEnabled = true,
}) => {
  return (
    <View className="domestic-tab">
      <CityIndexList
        groups={groups}
        onSelect={onSelect}
        scrollEnabled={scrollEnabled}
      >
        <HotCitiesSection
          cities={hotCities}
          selectedCity={currentCity}
          onSelect={onSelect}
        />
      </CityIndexList>
    </View>
  )
}
