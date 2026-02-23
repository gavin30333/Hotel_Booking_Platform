import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import MapContainer from '../../components/map/MapContainer'
import './index.less'

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number
    lat: number
    address: string
  } | null>(null)

  // 处理地图点击事件
  const handleMapClick = (lng: number, lat: number, address: string) => {
    setSelectedLocation({
      lng,
      lat,
      address,
    })
  }

  // 清除选中位置
  const clearSelectedLocation = () => {
    setSelectedLocation(null)
  }

  return (
    <View className="map-page">
      <View className="map-header">
        <Text className="map-title">地图选择</Text>
      </View>

      <View className="map-container-wrapper">
        <MapContainer onMapClick={handleMapClick} className="full-height" />
      </View>

      {selectedLocation && (
        <View className="location-info">
          <View className="info-header">
            <Text className="info-title">选中位置</Text>
            <Button className="clear-btn" onClick={clearSelectedLocation}>
              清除
            </Button>
          </View>
          <View className="info-content">
            <Text className="address">{selectedLocation.address}</Text>
            <Text className="coordinates">
              经纬度: {selectedLocation.lng.toFixed(6)},{' '}
              {selectedLocation.lat.toFixed(6)}
            </Text>
          </View>
          <Button className="confirm-btn">确认选择</Button>
        </View>
      )}
    </View>
  )
}
