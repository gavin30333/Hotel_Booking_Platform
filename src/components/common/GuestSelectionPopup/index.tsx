import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Stepper, Button } from 'antd-mobile'
import { GuestInfo } from '@/types/query.types'
import { ChildAgeSelectionPopup } from '../ChildAgeSelectionPopup'
import './GuestSelectionPopup.less'

interface Props {
  visible: boolean
  onClose: () => void
  value: GuestInfo
  onChange: (val: GuestInfo) => void
}

export const GuestSelectionPopup: React.FC<Props> = ({
  visible,
  onClose,
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<GuestInfo>(value)
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(
    null
  )

  const getNumber = (
    val: number | number[] | undefined,
    defaultVal: number = 0
  ): number => {
    if (val === undefined) return defaultVal
    if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
    return val
  }

  useEffect(() => {
    if (visible) {
      const count = getNumber(value.children, 0)
      let ages = value.childAges ? [...value.childAges] : []

      // Sync ages array with children count
      if (ages.length < count) {
        ages = [...ages, ...Array(count - ages.length).fill(-1)] // -1 indicates unselected
      } else if (ages.length > count) {
        ages = ages.slice(0, count)
      }

      setInternalValue({
        ...value,
        childAges: ages,
      })
    }
  }, [visible, value])

  const handleConfirm = () => {
    onChange(internalValue)
    onClose()
  }

  const updateField = (field: keyof GuestInfo, val: number) => {
    // If adding a new child, open the age selection popup for it
    if (field === 'children') {
      const currentCount = getNumber(internalValue.children, 0)
      if (val > currentCount) {
        // The new child index is the last one (0-based)
        setEditingChildIndex(val - 1)
      }
    }

    setInternalValue((prev) => {
      const newVal = { ...prev, [field]: val }

      if (field === 'children') {
        const count = val
        let ages = prev.childAges ? [...prev.childAges] : []
        if (ages.length < count) {
          ages = [...ages, ...Array(count - ages.length).fill(-1)]
        } else {
          ages = ages.slice(0, count)
        }
        newVal.childAges = ages
      }

      return newVal
    })
  }

  const handleAgeSelect = (age: number) => {
    if (editingChildIndex !== null) {
      setInternalValue((prev) => {
        const ages = [...(prev.childAges || [])]
        ages[editingChildIndex] = age
        return { ...prev, childAges: ages }
      })
      setEditingChildIndex(null)
    }
  }

  const formatAge = (age: number) => {
    if (age === -1) return '必选'
    if (age === 0) return '1岁以下'
    return `${age}岁`
  }

  const currentAdults = getNumber(internalValue.adults, 1)
  const currentChildren = getNumber(internalValue.children, 0)
  const currentRooms = getNumber(internalValue.rooms, 1)
  const currentChildAges = internalValue.childAges || []

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
    >
      <View className="guest-popup-container">
        <View className="popup-header">
          <View className="close-icon" onClick={onClose}>
            ×
          </View>
          <Text className="title">选择客房和入住人数</Text>
          <View className="placeholder" />
        </View>

        <View className="popup-content">
          <View className="notice-bar">
            <Text className="notice-text">入住人数较多时，试试增加间数</Text>
          </View>

          <View className="stepper-row">
            <Text className="label">间数</Text>
            <Stepper
              value={currentRooms}
              min={1}
              max={10}
              onChange={(val) => updateField('rooms', val)}
            />
          </View>

          <View className="stepper-row">
            <Text className="label">成人数</Text>
            <Stepper
              value={currentAdults}
              min={1}
              max={20}
              onChange={(val) => updateField('adults', val)}
            />
          </View>

          <View className="stepper-row">
            <View className="label-group">
              <Text className="label">儿童数</Text>
              <Text className="sub-label">0-17岁</Text>
            </View>
            <Stepper
              value={currentChildren}
              min={0}
              max={10}
              onChange={(val) => updateField('children', val)}
            />
          </View>

          {currentChildren > 0 && (
            <View className="child-age-section">
              <Text className="section-title">儿童年龄</Text>
              <Text className="section-desc">
                请准确维护儿童年龄，以便我们为您查找最合适的房型及优惠
              </Text>
              <View className="child-list">
                {Array.from({ length: currentChildren }).map((_, idx) => {
                  const age =
                    currentChildAges[idx] !== undefined
                      ? currentChildAges[idx]
                      : -1
                  return (
                    <View
                      key={idx}
                      className="child-item"
                      onClick={() => setEditingChildIndex(idx)}
                    >
                      <Text>儿童 {idx + 1}</Text>
                      <View style={{ display: 'flex', alignItems: 'center' }}>
                        <Text className={age === -1 ? 'required' : 'value'}>
                          {formatAge(age)}
                        </Text>
                        <Text className="arrow"> &gt;</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          )}
        </View>

        <View className="popup-footer">
          <Button block color="primary" size="large" onClick={handleConfirm}>
            完成
          </Button>
        </View>

        <ChildAgeSelectionPopup
          visible={editingChildIndex !== null}
          onClose={() => setEditingChildIndex(null)}
          onSelect={handleAgeSelect}
          childIndex={editingChildIndex || 0}
          currentAge={
            editingChildIndex !== null
              ? currentChildAges[editingChildIndex]
              : undefined
          }
        />
      </View>
    </Popup>
  )
}
