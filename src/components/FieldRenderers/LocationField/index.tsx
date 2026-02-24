import React, { useState, useRef, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { DownOutline, CompassOutline, SearchOutline } from 'antd-mobile-icons'
import { FieldConfig, LocationData, TabType } from '@/types/query.types'
import { useLocation } from '@/hooks/useLocation'
import {
  CitySelector,
  CityTab,
  CitySelectResult,
  HotSearchSelectResult,
} from '@/components/CitySelector'
import Taro from '@tarojs/taro'
import './LocationField.less'

interface LocationFieldProps {
  config: FieldConfig
  value: LocationData
  keyword?: string
  onChange: (value: LocationData) => void
  onKeywordChange?: (keyword: string) => void
  onSceneChange?: (scene: TabType) => void
}

export const LocationField: React.FC<LocationFieldProps> = ({
  config,
  value,
  keyword,
  onChange,
  onKeywordChange,
  onSceneChange,
}) => {
  const { props } = config
  const isInternational = props?.isInternational
  const showSettings = props?.showSettings
  const [isLocating, setIsLocating] = useState(false)
  const [locationInfo, setLocationInfo] = useState<string | null>(null)
  const [showLocationInfo, setShowLocationInfo] = useState(false)
  const [citySelectorVisible, setCitySelectorVisible] = useState(false)
  const [citySelectorTab, setCitySelectorTab] = useState<CityTab>(
    isInternational ? 'overseas' : 'domestic'
  )
  const { location, locateByGPS, loading } = useLocation()
  const locationRef = useRef<LocationData | null>(null)

  useEffect(() => {
    setCitySelectorTab(isInternational ? 'overseas' : 'domestic')
  }, [isInternational])

  const handleCitySelectorTabChange = (tab: CityTab) => {
    setCitySelectorTab(tab)
    if (tab === 'domestic') {
      onSceneChange?.(TabType.DOMESTIC)
    } else if (tab === 'overseas') {
      onSceneChange?.(TabType.INTERNATIONAL)
    }
  }

  const handleCitySelect = (result: CitySelectResult) => {
    const { city, source } = result

    if (source === 'domestic') {
      onSceneChange?.(TabType.DOMESTIC)
    } else if (source === 'overseas') {
      onSceneChange?.(TabType.INTERNATIONAL)
    }

    onChange({
      ...value,
      city: city,
      district: '',
      country: source === 'overseas' ? '海外' : value.country,
    })
  }

  const handleHotSearchSelect = (result: HotSearchSelectResult) => {
    if (result.type === 'hotel' && result.hotelId) {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${result.hotelId}`,
      })
    } else if (result.type === 'keyword') {
      onKeywordChange?.(result.value)
    }
  }

  const extractDetailedAddress = (
    formattedAddress: string,
    city: string,
    district?: string,
    province?: string
  ): string => {
    let detailedAddress = formattedAddress

    if (province && detailedAddress.startsWith(province)) {
      detailedAddress = detailedAddress.replace(province, '')
    }

    if (detailedAddress.startsWith(city)) {
      detailedAddress = detailedAddress.replace(city, '')
    }

    if (district && detailedAddress.startsWith(district)) {
      detailedAddress = detailedAddress.replace(district, '')
    }

    const streetRegex =
      /^[\u4e00-\u9fa5]+街道|[\u4e00-\u9fa5]+路|[\u4e00-\u9fa5]+道/
    const streetMatch = detailedAddress.match(streetRegex)
    if (streetMatch) {
      detailedAddress = detailedAddress.replace(streetMatch[0], '')
    }

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
    <View className="field-row location-field">
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
              onClick={() => {
                setCitySelectorTab(isInternational ? 'overseas' : 'domestic')
                setCitySelectorVisible(true)
              }}
            >
              <Text className="city-text">{value.city}</Text>
              <DownOutline fontSize={12} color="#333" />
            </View>
          </View>

          <View className="divider" />

          <Text
            className={`placeholder-text ${keyword ? 'active' : ''}`}
            onClick={() => {
              setCitySelectorTab('hot_search')
              setCitySelectorVisible(true)
            }}
          >
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
        onHotSearchSelect={handleHotSearchSelect}
        currentCity={value.city}
        defaultTab={citySelectorTab}
        onTabChange={handleCitySelectorTabChange}
      />
    </View>
  )
}
