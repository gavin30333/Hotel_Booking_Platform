import { View, Text } from '@tarojs/components'
import './CityFilter.less'

interface CityFilterProps {
  cities: string[]
  activeCity: string
  onCityChange: (city: string) => void
}

export default function CityFilter({
  cities,
  activeCity,
  onCityChange,
}: CityFilterProps) {
  return (
    <View className="city-filter">
      <View
        className={`filter-tag ${activeCity === 'all' ? 'active' : ''}`}
        onClick={() => onCityChange('all')}
      >
        <Text>全部收藏</Text>
      </View>
      {cities.map((city) => (
        <View
          key={city}
          className={`filter-tag ${activeCity === city ? 'active' : ''}`}
          onClick={() => onCityChange(city)}
        >
          <Text>{city}</Text>
        </View>
      ))}
    </View>
  )
}
