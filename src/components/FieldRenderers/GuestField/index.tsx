import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { DownOutline } from 'antd-mobile-icons'
import { FieldConfig, GuestInfo } from '@/types/query.types'
import { GuestSelectionPopup } from '@/components/common/popup/GuestSelectionPopup'
import { PriceStarSelectionPopup } from '@/components/common/popup/PriceStarSelectionPopup'
import { getHomestayText } from '@/utils/guestFieldUtils'
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

  const displayText = useMemo(() => {
    if (isHomestay) {
      const text = getHomestayText(value)
      // If text is empty, show default placeholder "人/床/居数不限"
      if (!text) return customText || '人/床/居数不限'
      return text
    }
    return customText
  }, [value, isHomestay, customText])

  const isPlaceholder = isHomestay && !getHomestayText(value)

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
            onChange={onChange}
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
            onChange={onChange}
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
              <Text className="price-text">{priceLabel}</Text>
            </View>
          )}

          <GuestSelectionPopup
            visible={showGuestPopup}
            onClose={() => setShowGuestPopup(false)}
            value={value}
            onChange={onChange}
          />

          <PriceStarSelectionPopup
            visible={showPricePopup}
            onClose={() => setShowPricePopup(false)}
            value={value}
            onChange={onChange}
            isInternational={isInternational}
          />
        </View>
      )}
    </View>
  )
}
