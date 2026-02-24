import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { Popup, Button, Slider, Selector, Switch } from 'antd-mobile'
import { GuestInfo } from '@/types/query.types'
import { StarExplanationPopup } from './StarExplanationPopup'
import './PriceStarSelectionPopup.less'

interface Props {
  visible: boolean
  onClose: () => void
  value: GuestInfo
  onChange: (val: GuestInfo) => void
  isInternational?: boolean
}

const DOMESTIC_STAR_OPTIONS = [
  { label: '2钻/星及以下', value: '2', description: '经济' },
  { label: '3钻/星', value: '3', description: '舒适' },
  { label: '4钻/星', value: '4', description: '高档' },
  { label: '5钻/星', value: '5', description: '豪华' },
  { label: '金钻酒店', value: 'gold', description: '奢华体验' },
  { label: '铂钻酒店', value: 'platinum', description: '超奢品质' },
]

const INTERNATIONAL_STAR_OPTIONS = [
  { label: '2钻及以下', value: '2', description: '经济' },
  { label: '3钻', value: '3', description: '舒适' },
  { label: '4钻', value: '4', description: '高档' },
  { label: '5钻', value: '5', description: '豪华' },
  { label: '金钻酒店', value: 'gold', description: '奢华体验' },
  { label: '铂钻酒店', value: 'platinum', description: '超奢品质' },
]

const DOMESTIC_PRICE_PRESETS = [
  { label: '¥150以下', min: 0, max: 150 },
  { label: '¥150-¥250', min: 150, max: 250 },
  { label: '¥250-¥300', min: 250, max: 300 },
  { label: '¥300-¥350', min: 300, max: 350 },
  { label: '¥350-¥550', min: 350, max: 550 },
  { label: '¥550-¥700', min: 550, max: 700 },
  { label: '¥700-¥900', min: 700, max: 900 },
  { label: '¥900以上', min: 900, max: 10000 },
]

const INTERNATIONAL_PRICE_PRESETS = [
  { label: '¥450以下', min: 0, max: 450 },
  { label: '¥450-¥700', min: 450, max: 700 },
  { label: '¥700-¥800', min: 700, max: 800 },
  { label: '¥800-¥950', min: 800, max: 950 },
  { label: '¥950-¥1500', min: 950, max: 1500 },
  { label: '¥1500-¥1900', min: 1500, max: 1900 },
  { label: '¥1900-¥2300', min: 1900, max: 2300 },
  { label: '¥2300以上', min: 2300, max: 10000 },
]

export const PriceStarSelectionPopup: React.FC<Props> = ({
  visible,
  onClose,
  value,
  onChange,
  isInternational = false,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedStars, setSelectedStars] = useState<string[]>([])
  const [isTaxIncluded, setIsTaxIncluded] = useState(false)
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const lastValueRef = useRef<[number, number]>([0, 10000])

  const starOptions = isInternational
    ? INTERNATIONAL_STAR_OPTIONS
    : DOMESTIC_STAR_OPTIONS
  const pricePresets = isInternational
    ? INTERNATIONAL_PRICE_PRESETS
    : DOMESTIC_PRICE_PRESETS
  const maxLimit = 10000
  // Get the max threshold from the last preset's min value (e.g. 900 for Domestic, 2300 for International)
  const sliderMax = pricePresets[pricePresets.length - 1].min

  useEffect(() => {
    if (visible) {
      const ps = value.priceStar || {}
      const min = ps.minPrice ?? 0
      const max = ps.maxPrice ?? maxLimit
      setPriceRange([min, max])
      lastValueRef.current = [min, Math.min(max, sliderMax)]
      setSelectedStars(ps.starRatings || [])
      setIsTaxIncluded(ps.isTaxIncluded || false)
    }
  }, [visible, value, sliderMax])

  const handleConfirm = () => {
    onChange({
      ...value,
      priceStar: {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        starRatings: selectedStars,
        /**
         * 税费包含标识
         * 业务规则：仅在海外场景下传递该字段，国内场景保持为 undefined 以减少传输数据冗余
         */
        isTaxIncluded: isInternational ? isTaxIncluded : undefined,
      },
    })
    onClose()
  }

  const handleClear = () => {
    setPriceRange([0, maxLimit])
    setSelectedStars([])
    setIsTaxIncluded(false)
  }

  const handleMinInput = (e) => {
    const val = parseInt(e.detail.value)
    if (!isNaN(val)) {
      setPriceRange([val, priceRange[1]])
    } else if (e.detail.value === '') {
      setPriceRange([0, priceRange[1]])
    }
  }

  const handleMaxInput = (e) => {
    const val = parseInt(e.detail.value)
    if (!isNaN(val)) {
      setPriceRange([priceRange[0], val])
    } else if (e.detail.value === '') {
      setPriceRange([priceRange[0], maxLimit])
    }
  }

  const sliderValue = [priceRange[0], Math.min(priceRange[1], sliderMax)]

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

        <View className="popup-content">
          {/* Price Section */}
          <View className="section">
            <View className="price-header">
              <Text className="section-title">价格</Text>
              {isInternational && (
                <View className="tax-toggle">
                  <Text className="toggle-label">主价格展示为含税价</Text>
                  <Switch
                    checked={isTaxIncluded}
                    onChange={setIsTaxIncluded}
                    style={{ '--height': '24px', '--width': '40px' }}
                  />
                </View>
              )}
            </View>

            <View className="slider-container">
              {/* Custom floating labels */}
              <View
                className="slider-labels"
                style={{
                  position: 'relative',
                  height: '24px',
                  marginBottom: '10px',
                }}
              >
                <View
                  className="floating-label"
                  style={{
                    position: 'absolute',
                    left: `${(sliderValue[0] / sliderMax) * 100}%`,
                    transform: 'translateX(-50%)',
                    backgroundColor: '#0086F6',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    top: 0,
                    opacity: activeThumb === 'min' ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  ¥{sliderValue[0]}
                </View>
                {/* Only show max label if different enough to avoid overlap, or implement collision logic */}
                <View
                  className="floating-label"
                  style={{
                    position: 'absolute',
                    left: `${(sliderValue[1] / sliderMax) * 100}%`,
                    transform: 'translateX(-50%)',
                    backgroundColor: '#0086F6',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    top: 0,
                    opacity: activeThumb === 'max' ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  ¥
                  {sliderValue[1] >= sliderMax
                    ? `${sliderMax}+`
                    : sliderValue[1]}
                </View>
              </View>

              <Slider
                range
                min={0}
                max={sliderMax}
                step={50}
                value={[priceRange[0], Math.min(priceRange[1], sliderMax)]}
                onChange={(val) => {
                  const [min, max] = val as [number, number]
                  const [prevMin, prevMax] = lastValueRef.current

                  if (min !== prevMin) {
                    setActiveThumb('min')
                  } else if (max !== prevMax) {
                    setActiveThumb('max')
                  }

                  lastValueRef.current = [min, max]
                  setPriceRange([min, max === sliderMax ? maxLimit : max])
                }}
                onAfterChange={() => setActiveThumb(null)}
                style={{ '--fill-color': '#0086F6' }}
              />
            </View>

            <View className="price-inputs">
              <View className="input-box">
                <Text className="label">最低</Text>
                <View className="input-wrapper">
                  <Text className="currency">¥</Text>
                  <Input
                    className="price-input"
                    type="number"
                    value={priceRange[0].toString()}
                    onInput={handleMinInput}
                  />
                </View>
              </View>
              <View className="separator">—</View>
              <View className="input-box">
                <Text className="label">最高</Text>
                <View className="input-wrapper">
                  <Text className="currency">¥</Text>
                  <Input
                    className="price-input"
                    type="number"
                    value={
                      priceRange[1] >= maxLimit
                        ? sliderMax.toString()
                        : priceRange[1].toString()
                    }
                    onInput={handleMaxInput}
                  />
                  {priceRange[1] >= maxLimit && (
                    <Text className="suffix">以上</Text>
                  )}
                </View>
              </View>
            </View>

            <View className="presets-grid">
              {pricePresets.map((preset, idx) => {
                // Approximate matching for active state
                const isActive =
                  priceRange[0] === preset.min &&
                  (priceRange[1] === preset.max ||
                    (preset.max === maxLimit && priceRange[1] >= maxLimit))
                return (
                  <View
                    key={idx}
                    className={`preset-item ${isActive ? 'active' : ''}`}
                    onClick={() => setPriceRange([preset.min, preset.max])}
                  >
                    <Text>{preset.label}</Text>
                  </View>
                )
              })}
            </View>
          </View>

          {/* Star Rating Section */}
          <View className="section">
            <View className="section-header">
              <Text className="section-title">星级/钻级</Text>
              <Text className="link" onClick={() => setShowExplanation(true)}>
                国内星级/钻级说明 &gt;
              </Text>
            </View>
            <Selector
              columns={3}
              multiple
              options={starOptions}
              value={selectedStars}
              onChange={(v) => setSelectedStars(v)}
              style={{
                '--gap': '8px',
                '--border-radius': '4px',
                '--checked-color': '#e6f7ff',
                '--checked-text-color': '#0086F6',
                '--checked-border': 'solid 1px #0086F6',
                '--color': '#f5f5f5',
              }}
            />
            <Text className="disclaimer-text">
              酒店未参加星级评定但设施服务达到相应水平，采用钻级分类，仅供参考
            </Text>
          </View>
        </View>

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

      <StarExplanationPopup
        visible={showExplanation}
        onClose={() => setShowExplanation(false)}
      />
    </Popup>
  )
}
