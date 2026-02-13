import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Button, Toast } from 'antd-mobile'
import { GuestInfo } from '@/types/query.types'
import './HomestayGuestSelectionPopup.less'

interface Props {
  visible: boolean
  onClose: () => void
  value: GuestInfo
  onChange: (val: GuestInfo) => void
}

const PEOPLE_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']
const BED_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']
const ROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']

export const HomestayGuestSelectionPopup: React.FC<Props> = ({
  visible,
  onClose,
  value,
  onChange,
}) => {
  // Use local state to manage selection before confirming
  // Mapping GuestInfo fields to the homestay specific concepts:
  // adults -> 人数 (people)
  // children -> 床铺数 (beds)
  // rooms -> 居室数 (rooms)
  // All support multiple selection now

  const initArray = (
    val: number | number[] | undefined
  ): (number | string)[] => {
    if (val === undefined) return [] // Default to empty
    const arr = Array.isArray(val) ? val : [val]
    // Filter out 0 or invalid values
    const validArr = arr
      .map((v) => (typeof v === 'number' && v < 1 ? 0 : v))
      .filter((v) => v !== 0)
    // Deduplicate
    const unique = Array.from(new Set(validArr))
    return unique
  }

  const [people, setPeople] = useState<(number | string)[]>(
    initArray(value.adults)
  )
  const [beds, setBeds] = useState<(number | string)[]>(
    initArray(value.children)
  )
  const [rooms, setRooms] = useState<(number | string)[]>(
    initArray(value.rooms)
  )

  const [expandedSections, setExpandedSections] = useState({
    people: false,
    beds: false,
    rooms: false,
  })

  useEffect(() => {
    if (visible) {
      setPeople(initArray(value.adults))
      setBeds(initArray(value.children))
      setRooms(initArray(value.rooms))
    }
  }, [visible, value])

  const handleConfirm = () => {
    const parseValue = (val: string | number) => {
      if (typeof val === 'number') return val
      if (val === '自定义') return 100
      if (val.endsWith('+')) return parseInt(val)
      return parseInt(val)
    }

    const processSelection = (selection: (number | string)[]) => {
      const parsed = selection.map((v) => parseValue(v))
      // If single value, keep as array or number?
      // Type definition allows number | number[].
      // To be consistent with "multi-select", let's return array if length > 1,
      // or maybe always array if the backend supports it.
      // The previous code returned single number if length 1. Let's stick to that for compatibility.
      return parsed.length === 1 ? parsed[0] : parsed
    }

    onChange({
      ...value,
      adults: processSelection(people),
      children: processSelection(beds),
      rooms: processSelection(rooms),
    })
    onClose()
  }

  const handleClear = () => {
    setPeople([])
    setBeds([])
    setRooms([])
  }

  const toggleExpand = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleSelection = (
    current: (number | string)[],
    setter: React.Dispatch<React.SetStateAction<(number | string)[]>>,
    val: number | string
  ) => {
    // Ensure we are working with clean data
    const cleanCurrent = current.filter((p) => typeof p === 'string' || p > 0)
    const exists = cleanCurrent.includes(val)

    if (exists) {
      const newVal = cleanCurrent.filter((item) => item !== val)
      setter(newVal)
    } else {
      if (cleanCurrent.length >= 4) {
        Toast.show({
          content: '最多只能选择4项',
        })
        return
      }
      setter([...cleanCurrent, val])
    }
  }

  const renderGrid = (
    title: string,
    options: string[],
    currentValue: (number | string)[],
    setter: React.Dispatch<React.SetStateAction<(number | string)[]>>,
    sectionKey: keyof typeof expandedSections,
    suffix: string = ''
  ) => {
    const isExpanded = expandedSections[sectionKey]
    const displayOptions = isExpanded ? options : options.slice(0, 5)
    const isMulti = true // All sections are now multi-select

    return (
      <View className="selection-section">
        <View className="section-header">
          <View className="title-group">
            <Text className="title">{title}</Text>
            {isMulti && <Text className="subtitle">可多选</Text>}
          </View>
          <Text className="expand-btn" onClick={() => toggleExpand(sectionKey)}>
            {isExpanded ? '收起' : '更多'}
            <Text className={`arrow ${isExpanded ? 'up' : 'down'}`}>^</Text>
          </Text>
        </View>
        <View className="options-grid">
          {displayOptions.map((opt) => {
            const optVal =
              opt === '自定义'
                ? 100
                : opt.endsWith('+')
                  ? parseInt(opt)
                  : parseInt(opt)

            // Check if selected
            // currentValue is array of numbers (mostly)
            const isSelected = currentValue.includes(optVal)

            return (
              <View
                key={opt}
                className={`option-item ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleSelection(currentValue, setter, optVal)}
              >
                <Text>
                  {opt}
                  {suffix}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
    >
      <View className="homestay-popup-container">
        <View className="popup-header">
          <View className="close-icon" onClick={onClose}>
            ×
          </View>
          <Text className="title">选择人/床/居数</Text>
          <View className="placeholder" />
        </View>

        <View className="notice-bar">
          <Text className="notice-text">不确定居室时，试试多选居室</Text>
        </View>

        <View className="popup-content">
          {renderGrid(
            '人数',
            PEOPLE_OPTIONS,
            people,
            setPeople,
            'people',
            '人'
          )}
          {renderGrid('床铺数', BED_OPTIONS, beds, setBeds, 'beds', '床')}
          {renderGrid('居室数', ROOM_OPTIONS, rooms, setRooms, 'rooms', '居')}
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
    </Popup>
  )
}
