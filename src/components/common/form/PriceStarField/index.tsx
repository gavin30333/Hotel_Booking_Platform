import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Slider, Checkbox } from 'antd-mobile'
import { DownOutline } from 'antd-mobile-icons'
import { useQueryStore } from '@/store/useQueryStore'
import './PriceStarField.less'

interface PriceStarFieldProps {
  value?: { min: number; max: number; stars: number[] }
  onChange?: (value: { min: number; max: number; stars: number[] }) => void
}

const PRICE_RANGES = [
  { label: '不限', min: 0, max: 99999 },
  { label: '0-200', min: 0, max: 200 },
  { label: '200-400', min: 200, max: 400 },
  { label: '400-600', min: 400, max: 600 },
  { label: '600-1000', min: 600, max: 1000 },
  { label: '1000以上', min: 1000, max: 99999 },
]

const STAR_OPTIONS = [5, 4, 3]

export const PriceStarField: React.FC<PriceStarFieldProps> = (props) => {
  const getPriceRange = useQueryStore((state) => state.getPriceRange)
  const getStarRating = useQueryStore((state) => state.getStarRating)
  const updatePriceRange = useQueryStore((state) => state.updatePriceRange)
  const updateStarRating = useQueryStore((state) => state.updateStarRating)

  const storePriceRange = getPriceRange()
  const storeStarRating = getStarRating()

  const [visible, setVisible] = useState(false)
  const [priceMin, setPriceMin] = useState(storePriceRange.min)
  const [priceMax, setPriceMax] = useState(storePriceRange.max)
  const [selectedStars, setSelectedStars] = useState<number[]>(
    storeStarRating.ratings
  )

  useEffect(() => {
    setPriceMin(storePriceRange.min)
    setPriceMax(storePriceRange.max)
    setSelectedStars(storeStarRating.ratings)
  }, [storePriceRange, storeStarRating])

  const getDisplayText = () => {
    const parts: string[] = []

    if (priceMin > 0 || priceMax < 99999) {
      if (priceMax >= 99999) {
        parts.push(`¥${priceMin}+`)
      } else {
        parts.push(`¥${priceMin}-${priceMax}`)
      }
    }

    if (selectedStars.length > 0) {
      parts.push(`${selectedStars.join('/')}星`)
    }

    return parts.length > 0 ? parts.join(' · ') : '价格/星级'
  }

  const handleConfirm = () => {
    updatePriceRange(priceMin, priceMax)
    updateStarRating(selectedStars)
    props.onChange?.({ min: priceMin, max: priceMax, stars: selectedStars })
    setVisible(false)
  }

  const handlePriceRangeClick = (range: (typeof PRICE_RANGES)[0]) => {
    setPriceMin(range.min)
    setPriceMax(range.max)
  }

  const handleStarChange = (star: number, checked: boolean) => {
    if (checked) {
      setSelectedStars([...selectedStars, star].sort((a, b) => b - a))
    } else {
      setSelectedStars(selectedStars.filter((s) => s !== star))
    }
  }

  return (
    <View className="price-star-field">
      <View className="field-trigger" onClick={() => setVisible(true)}>
        <Text className="field-text">{getDisplayText()}</Text>
        <DownOutline className="field-arrow" />
      </View>

      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        position="bottom"
        bodyStyle={{ height: '50vh' }}
      >
        <View className="price-star-popup">
          <View className="popup-header">
            <Text className="popup-title">价格/星级</Text>
            <Text className="popup-confirm" onClick={handleConfirm}>
              确定
            </Text>
          </View>

          <View className="popup-section">
            <Text className="section-title">价格区间</Text>
            <View className="price-ranges">
              {PRICE_RANGES.map((range) => (
                <View
                  key={range.label}
                  className={`price-range-item ${priceMin === range.min && priceMax === range.max ? 'active' : ''}`}
                  onClick={() => handlePriceRangeClick(range)}
                >
                  <Text>{range.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="popup-section">
            <Text className="section-title">酒店星级</Text>
            <View className="star-options">
              {STAR_OPTIONS.map((star) => (
                <View
                  key={star}
                  className={`star-option ${selectedStars.includes(star) ? 'active' : ''}`}
                  onClick={() =>
                    handleStarChange(star, !selectedStars.includes(star))
                  }
                >
                  <Text>{star}星级</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Popup>
    </View>
  )
}
