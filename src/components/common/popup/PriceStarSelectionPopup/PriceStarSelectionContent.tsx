import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { Slider, Selector, Switch } from 'antd-mobile'
import { StarExplanationPopup } from '../PriceStarSelectionPopup/StarExplanationPopup'
import '../PriceStarSelectionPopup/PriceStarSelectionPopup.less'

// 常量定义
export const DOMESTIC_STAR_OPTIONS = [
  { label: '2钻/星及以下', value: '2', description: '经济' },
  { label: '3钻/星', value: '3', description: '舒适' },
  { label: '4钻/星', value: '4', description: '高档' },
  { label: '5钻/星', value: '5', description: '豪华' },
  { label: '金钻酒店', value: 'gold', description: '奢华体验' },
  { label: '铂钻酒店', value: 'platinum', description: '超奢品质' },
]

export const INTERNATIONAL_STAR_OPTIONS = [
  { label: '2钻及以下', value: '2', description: '经济' },
  { label: '3钻', value: '3', description: '舒适' },
  { label: '4钻', value: '4', description: '高档' },
  { label: '5钻', value: '5', description: '豪华' },
  { label: '金钻酒店', value: 'gold', description: '奢华体验' },
  { label: '铂钻酒店', value: 'platinum', description: '超奢品质' },
]

export const DOMESTIC_PRICE_PRESETS = [
  { label: '¥150以下', min: 0, max: 150 },
  { label: '¥150-¥250', min: 150, max: 250 },
  { label: '¥250-¥300', min: 250, max: 300 },
  { label: '¥300-¥350', min: 300, max: 350 },
  { label: '¥350-¥550', min: 350, max: 550 },
  { label: '¥550-¥700', min: 550, max: 700 },
  { label: '¥700-¥900', min: 700, max: 900 },
  { label: '¥900以上', min: 900, max: 10000 },
]

export const INTERNATIONAL_PRICE_PRESETS = [
  { label: '¥450以下', min: 0, max: 450 },
  { label: '¥450-¥700', min: 450, max: 700 },
  { label: '¥700-¥800', min: 700, max: 800 },
  { label: '¥800-¥950', min: 800, max: 950 },
  { label: '¥950-¥1500', min: 950, max: 1500 },
  { label: '¥1500-¥1900', min: 1500, max: 1900 },
  { label: '¥1900-¥2300', min: 1900, max: 2300 },
  { label: '¥2300以上', min: 2300, max: 10000 },
]

export const MAX_LIMIT = 10000

export interface PriceStarSelectionContentProps {
  min: number
  max: number
  stars: string[]
  isTaxIncluded?: boolean
  isInternational?: boolean
  enableSpecialStars?: boolean
  visible: boolean
  onChange: (val: {
    min: number
    max: number
    stars: string[]
    isTaxIncluded?: boolean
  }) => void
}

export const PriceStarSelectionContent: React.FC<PriceStarSelectionContentProps> = ({
  min,
  max,
  stars,
  isTaxIncluded = false,
  isInternational = false,
  enableSpecialStars = true,
  visible,
  onChange,
}) => {
  // 虽然是受控组件，但为了 Slider 的流畅性以及 visible 重置逻辑，
  // 我们在内部维护状态，并在变化时通知父组件。
  // 当 props 变化时（由父组件传入新的值），我们同步更新内部状态。
  const [internalMin, setInternalMin] = useState(min)
  const [internalMax, setInternalMax] = useState(max)
  const [internalStars, setInternalStars] = useState(stars)
  const [internalTax, setInternalTax] = useState(isTaxIncluded)

  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  
  // Ref to track last value for slider direction detection
  const lastValueRef = useRef<[number, number]>([min, max])

  const starOptions = (isInternational
    ? INTERNATIONAL_STAR_OPTIONS
    : DOMESTIC_STAR_OPTIONS
  ).filter(option => enableSpecialStars || !['gold', 'platinum'].includes(option.value))
  const pricePresets = isInternational
    ? INTERNATIONAL_PRICE_PRESETS
    : DOMESTIC_PRICE_PRESETS
  const sliderMax = pricePresets[pricePresets.length - 1].min

  // 当 visible 变为 true 时，或者 props 改变时，同步 props 到 state
  useEffect(() => {
    setInternalMin(min)
    setInternalMax(max)
    setInternalStars(stars)
    setInternalTax(isTaxIncluded)
    lastValueRef.current = [min, Math.min(max, sliderMax)]
    
    if (visible) {
        // 重置 UI 状态
        setActiveThumb(null)
        setShowExplanation(false)
    }
  }, [visible, min, max, stars, isTaxIncluded, sliderMax])

  const updateValues = (updates: Partial<{ min: number, max: number, stars: string[], isTaxIncluded: boolean }>) => {
    const newMin = updates.min ?? internalMin
    const newMax = updates.max ?? internalMax
    const newStars = updates.stars ?? internalStars
    const newTax = updates.isTaxIncluded ?? internalTax

    // 更新内部状态
    if (updates.min !== undefined) setInternalMin(updates.min)
    if (updates.max !== undefined) setInternalMax(updates.max)
    if (updates.stars !== undefined) setInternalStars(updates.stars)
    if (updates.isTaxIncluded !== undefined) setInternalTax(updates.isTaxIncluded)

    // 通知父组件
    onChange({
      min: newMin,
      max: newMax,
      stars: newStars,
      isTaxIncluded: newTax,
    })
  }

  const handleMinInput = (e) => {
    const val = parseInt(e.detail.value)
    if (!isNaN(val)) {
      updateValues({ min: val })
    } else if (e.detail.value === '') {
      updateValues({ min: 0 })
    }
  }

  const handleMaxInput = (e) => {
    const val = parseInt(e.detail.value)
    if (!isNaN(val)) {
      updateValues({ max: val })
    } else if (e.detail.value === '') {
      updateValues({ max: MAX_LIMIT })
    }
  }

  const sliderValue = [internalMin, Math.min(internalMax, sliderMax)]

  return (
    <View className="popup-content">
      {/* Price Section */}
      <View className="section">
        <View className="price-header">
          <Text className="section-title">价格</Text>
          {isInternational && (
            <View className="tax-toggle">
              <Text className="toggle-label">主价格展示为含税价</Text>
              <Switch
                checked={internalTax}
                onChange={(checked) => updateValues({ isTaxIncluded: checked })}
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
            value={[internalMin, Math.min(internalMax, sliderMax)]}
            onChange={(val) => {
              const [minVal, maxVal] = val as [number, number]
              const [prevMin, prevMax] = lastValueRef.current

              if (minVal !== prevMin) {
                setActiveThumb('min')
              } else if (maxVal !== prevMax) {
                setActiveThumb('max')
              }

              lastValueRef.current = [minVal, maxVal]
              updateValues({ min: minVal, max: maxVal === sliderMax ? MAX_LIMIT : maxVal })
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
                value={internalMin.toString()}
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
                  internalMax >= MAX_LIMIT
                    ? sliderMax.toString()
                    : internalMax.toString()
                }
                onInput={handleMaxInput}
              />
              {internalMax >= MAX_LIMIT && (
                <Text className="suffix">以上</Text>
              )}
            </View>
          </View>
        </View>

        <View className="presets-grid">
          {pricePresets.map((preset, idx) => {
            const isActive =
              internalMin === preset.min &&
              (internalMax === preset.max ||
                (preset.max === MAX_LIMIT && internalMax >= MAX_LIMIT))
            return (
              <View
                key={idx}
                className={`preset-item ${isActive ? 'active' : ''}`}
                onClick={() => updateValues({ min: preset.min, max: preset.max })}
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
          value={internalStars}
          onChange={(v) => updateValues({ stars: v })}
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
      
      <StarExplanationPopup
        visible={showExplanation}
        onClose={() => setShowExplanation(false)}
      />
    </View>
  )
}
