import React from 'react'
import { View } from '@tarojs/components'
import './CityTag.less'

interface CityTagProps {
  text: string
  onClick?: () => void
}

export const CityTag: React.FC<CityTagProps> = ({ text, onClick }) => {
  return (
    <View className="city-tag" onClick={onClick}>
      {text}
    </View>
  )
}
