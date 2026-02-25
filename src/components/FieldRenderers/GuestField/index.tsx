import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { DownOutline } from 'antd-mobile-icons'
import { FieldConfig, GuestInfo } from '@/types/query.types'
import { GuestSelectionPopup } from '@/components/common/popup/GuestSelectionPopup'
import { PriceStarSelectionPopup } from '@/components/common/popup/PriceStarSelectionPopup'
import { getHomestayText } from '@/utils/guestFieldUtils'
import { useQueryStore } from '@/store/useQueryStore'
import './GuestField.less'

interface GuestFieldProps {
  config: FieldConfig
  value: GuestInfo
  onChange: (value: GuestInfo) => void
}

export const GuestField: React.FC<GuestFieldProps> = ({
  config,
  value,
  onChange,
}) => {
  const { customText, priceLabel, isHomestay, isInternational } =
    config.props || {}
  const [showGuestPopup, setShowGuestPopup] = useState(false)
  const [showPricePopup, setShowPricePopup] = useState(false)

  const updateGuests = useQueryStore((state) => state.updateGuests)
  const updatePriceRange = useQueryStore((state) => state.updatePriceRange)
  const updateStarRating = useQueryStore((state) => state.updateStarRating)

  const displayText = useMemo(() => {
    if (isHomestay) {
      const text = getHomestayText(value)
      if (!text) return customText || '人/床/居数不限'
      return text
    }
    return customText
  }, [value, isHomestay, customText])

  const isPlaceholder = isHomestay && !getHomestayText(value)

  const handleGuestChange = (guestInfo: GuestInfo) => {
    onChange(guestInfo)
    const getNumber = (
      val: number | number[] | undefined,
      defaultVal: number
    ): number => {
      if (val === undefined) return defaultVal
      if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
      return val
    }
    updateGuests(
      getNumber(guestInfo.rooms, 1),
      getNumber(guestInfo.adults, 2),
      getNumber(guestInfo.children, 0)
    )
  }

  const handlePriceStarChange = (guestInfo: GuestInfo) => {
    onChange(guestInfo)
    if (guestInfo.priceStar) {
      updatePriceRange(
        guestInfo.priceStar.minPrice || 0,
        guestInfo.priceStar.maxPrice || 99999
      )
      updateStarRating(
        (guestInfo.priceStar.starRatings || []).map((s) => Number(s))
      )
    }
  }

  const getPriceDisplayText = () => {
    const ps = value.priceStar
    if (!ps) return priceLabel || '价格/星级'

    const parts: string[] = []
    if (ps.minPrice || ps.maxPrice) {
      if (ps.maxPrice && ps.maxPrice >= 99999) {
        parts.push(`¥${ps.minPrice || 0}+`)
      } else if (ps.minPrice || ps.maxPrice) {
        parts.push(`¥${ps.minPrice || 0}-${ps.maxPrice || 99999}`)
      }
    }
    if (ps.starRatings && ps.starRatings.length > 0) {
      parts.push(`${ps.starRatings.join('/')}星`)
    }

    return parts.length > 0 ? parts.join(' · ') : priceLabel || '价格/星级'
  }

  return (
    <View className="field-row guest-field">
      {isHomestay ? (
        <>
          <Text
            className={`custom-text ${isPlaceholder ? 'placeholder' : ''}`}
            onClick={() => setShowGuestPopup(true)}
          >
            {displayText}
          </Text>
          <GuestSelectionPopup
            type="homestay"
            visible={showGuestPopup}
            onClose={() => setShowGuestPopup(false)}
            value={value}
            onChange={handleGuestChange}
          />
        </>
      ) : customText ? (
        <>
          <Text className="custom-text" onClick={() => setShowGuestPopup(true)}>
            {customText}
          </Text>
          <GuestSelectionPopup
            visible={showGuestPopup}
            onClose={() => setShowGuestPopup(false)}
            value={value}
            onChange={handleGuestChange}
          />
        </>
      ) : (
        <View className="guest-content">
          <View className="guest-info" onClick={() => setShowGuestPopup(true)}>
            <Text className="info-text">
              {value.rooms}间房 {value.adults}成人 {value.children}儿童
            </Text>
            <DownOutline fontSize={10} color="#333" />
          </View>

          {priceLabel && (
            <View
              className="price-info"
              onClick={() => setShowPricePopup(true)}
            >
              <View className="divider" />
              <Text className="price-text">{getPriceDisplayText()}</Text>
            </View>
          )}

          <GuestSelectionPopup
            visible={showGuestPopup}
            onClose={() => setShowGuestPopup(false)}
            value={value}
            onChange={handleGuestChange}
          />

          <PriceStarSelectionPopup
            visible={showPricePopup}
            onClose={() => setShowPricePopup(false)}
            value={value}
            onChange={handlePriceStarChange}
            isInternational={isInternational}
          />
        </View>
      )}
    </View>
  )
}
