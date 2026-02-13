import React, { useState, useRef, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { DownOutline, CompassOutline, SearchOutline } from 'antd-mobile-icons'
import { FieldConfig, LocationData } from '@/types/query.types'
import { useLocation } from '@/hooks/useLocation'
import { CitySelector } from '@/components/CitySelector'
import './LocationField.less'

interface LocationFieldProps {
  config: FieldConfig
  value: LocationData
  keyword?: string
  onChange: (value: LocationData) => void
}

export const LocationField: React.FC<LocationFieldProps> = ({
  config,
  value,
  keyword,
  onChange,
}) => {
  const { props } = config
  const isInternational = props?.isInternational
  const showSettings = props?.showSettings
  const [isLocating, setIsLocating] = useState(false)
  const [locationInfo, setLocationInfo] = useState<string | null>(null)
  const [showLocationInfo, setShowLocationInfo] = useState(false)
  const [citySelectorVisible, setCitySelectorVisible] = useState(false)
  const { location, locateByGPS, loading } = useLocation()
  const locationRef = useRef<LocationData | null>(null)

  const handleCitySelect = (cityName: string) => {
    onChange({
      ...value,
      city: cityName,
      district: '', // Reset district when city changes
      // In a real app, we would also fetch the adcode, province, etc. for the new city
    })
  }

  // 提取具体地址（去掉省份、城市、区、街道等前缀）
  const extractDetailedAddress = (
    formattedAddress: string,
    city: string,
    district?: string,
    province?: string
  ): string => {
    let detailedAddress = formattedAddress

    // 去掉省份
    if (province && detailedAddress.startsWith(province)) {
      detailedAddress = detailedAddress.replace(province, '')
    }

    // 去掉城市
    if (detailedAddress.startsWith(city)) {
      detailedAddress = detailedAddress.replace(city, '')
    }

    // 去掉区县
    if (district && detailedAddress.startsWith(district)) {
      detailedAddress = detailedAddress.replace(district, '')
    }

    // 去掉街道
    const streetRegex =
      /^[\u4e00-\u9fa5]+街道|[\u4e00-\u9fa5]+路|[\u4e00-\u9fa5]+道/
    const streetMatch = detailedAddress.match(streetRegex)
    if (streetMatch) {
      detailedAddress = detailedAddress.replace(streetMatch[0], '')
    }

    // 去掉多余的标点和空格
    detailedAddress = detailedAddress.replace(/^[\s,，]+/, '')

    return detailedAddress
  }

  useEffect(() => {
    if (location) {
      locationRef.current = location
      if (location.formattedAddress && location.city) {
        const detailedAddress = extractDetailedAddress(
          location.formattedAddress,
          location.city,
          location.district,
          location.province
        )
        setLocationInfo(`已定位到 ${location.city}，${detailedAddress}`)
      } else if (location.city) {
        setLocationInfo(`已定位到 ${location.city}`)
      }
      setShowLocationInfo(true)
      setTimeout(() => {
        setShowLocationInfo(false)
      }, 3000)
    }
  }, [location])

  const handleLocationClick = async () => {
    if (isLocating || loading) return

    setIsLocating(true)

    try {
      const result = await locateByGPS()

      if (result) {
        onChange({
          city: result.city,
          district: result.district,
          country: result.country,
          province: result.province,
          adcode: result.adcode,
          address: result.address,
          formattedAddress: result.formattedAddress,
          longitude: result.longitude,
          latitude: result.latitude,
        })
      }
    } catch (error) {
      console.error('定位失败:', error)
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <View className="location-field">
      {showLocationInfo && locationInfo && (
        <View className="location-info">
          <Text className="location-info-text">📍 {locationInfo}</Text>
        </View>
      )}

      <View className="location-content">
        <View className="location-main">
          <View className="city-section">
            {isInternational && (
              <Text className="country-text">{value.country || '国家'}</Text>
            )}
            <View
              className="city-wrapper"
              onClick={() => setCitySelectorVisible(true)}
            >
              <Text className="city-text">{value.city}</Text>
              <DownOutline fontSize={12} color="#333" />
            </View>
          </View>

          <View className="divider" />

          <Text className={`placeholder-text ${keyword ? 'active' : ''}`}>
            {keyword || config.placeholder}
          </Text>
        </View>

        <View
          className={`location-icon ${showSettings ? '' : 'clickable'} ${isLocating || loading ? 'rotating' : ''}`}
          onClick={!showSettings ? handleLocationClick : undefined}
        >
          {showSettings ? (
            <SearchOutline fontSize={20} color="#1890ff" />
          ) : (
            <CompassOutline fontSize={20} color="#1890ff" />
          )}
        </View>
      </View>

      <CitySelector
        visible={citySelectorVisible}
        onClose={() => setCitySelectorVisible(false)}
        onSelect={handleCitySelect}
        currentCity={value.city}
      />
    </View>
  )
}
