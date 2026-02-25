import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Button } from 'antd-mobile'
import { GuestInfo } from '@/types/query.types'
import { PriceStarSelectionContent, MAX_LIMIT } from './PriceStarSelectionContent'
import './PriceStarSelectionPopup.less'

interface Props {
  visible: boolean
  onClose: () => void
  value: GuestInfo
  onChange: (val: GuestInfo) => void
  isInternational?: boolean
}

interface TempState {
  min: number
  max: number
  stars: string[]
  isTaxIncluded: boolean
}

export const PriceStarSelectionPopup: React.FC<Props> = ({
  visible,
  onClose,
  value,
  onChange,
  isInternational = false,
}) => {
  const [tempState, setTempState] = useState<TempState>({
    min: 0,
    max: MAX_LIMIT,
    stars: [],
    isTaxIncluded: false,
  })

  // When popup opens or value changes, reset temp state
  useEffect(() => {
    if (visible) {
      const ps = value.priceStar || {}
      setTempState({
        min: ps.minPrice ?? 0,
        max: ps.maxPrice ?? MAX_LIMIT,
        stars: ps.starRatings || [],
        isTaxIncluded: ps.isTaxIncluded || false,
      })
    }
  }, [visible, value])

  const handleContentChange = (val: {
    min: number
    max: number
    stars: string[]
    isTaxIncluded?: boolean
  }) => {
    setTempState({
      min: val.min,
      max: val.max,
      stars: val.stars,
      isTaxIncluded: val.isTaxIncluded || false,
    })
  }

  const handleConfirm = () => {
    onChange({
      ...value,
      priceStar: {
        minPrice: tempState.min,
        maxPrice: tempState.max,
        starRatings: tempState.stars,
        /**
         * 税费包含标识
         * 业务规则：仅在海外场景下传递该字段，国内场景保持为 undefined 以减少传输数据冗余
         */
        isTaxIncluded: isInternational ? tempState.isTaxIncluded : undefined,
      },
    })
    onClose()
  }

  const handleClear = () => {
    setTempState({
      min: 0,
      max: MAX_LIMIT,
      stars: [],
      isTaxIncluded: false,
    })
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
    >
      <View className="price-popup-container">
        <View className="popup-header">
          <View className="close-icon" onClick={onClose}>
            ×
          </View>
          <Text className="title">选择价格/星级</Text>
          <View className="placeholder" />
        </View>

        <PriceStarSelectionContent
          min={tempState.min}
          max={tempState.max}
          stars={tempState.stars}
          isTaxIncluded={tempState.isTaxIncluded}
          isInternational={isInternational}
          visible={visible}
          onChange={handleContentChange}
        />

        <View className="popup-footer">
          <Button className="clear-btn" onClick={handleClear}>
            清空
          </Button>
          <Button
            className="confirm-btn"
            color="primary"
            onClick={handleConfirm}
          >
            完成
          </Button>
        </View>
      </View>
    </Popup>
  )
}
