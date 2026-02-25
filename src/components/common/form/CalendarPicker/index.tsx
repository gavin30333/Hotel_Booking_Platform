import React, { useState, useMemo, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup } from 'antd-mobile'
import dayjs, { Dayjs } from 'dayjs'
import './CalendarPicker.less'

// 模拟获取节假日数据的API函数
const fetchHolidayData = async (
  year: number,
  month: number
): Promise<Record<string, HolidayInfo>> => {
  // 实际项目中，这里应该调用真实的API
  // 这里使用模拟数据，包含2026年的一些节假日
  // 2026年实际节假日日期（根据农历计算）
  const mockHolidayData: Record<string, HolidayInfo> = {
    // 2026年春节（农历正月初一：2月17日）
    '2026-02-17': { type: 'holiday', name: '春节' },
    '2026-02-18': { type: 'rest' },
    '2026-02-19': { type: 'rest' },
    '2026-02-20': { type: 'rest' },
    '2026-02-21': { type: 'rest' },
    '2026-02-22': { type: 'rest' },
    '2026-02-23': { type: 'rest' },
    // 2026年清明节（4月4日）
    '2026-04-04': { type: 'holiday', name: '清明' },
    '2026-04-05': { type: 'rest' },
    '2026-04-06': { type: 'rest' },
    // 2026年劳动节（5月1日）
    '2026-05-01': { type: 'holiday', name: '劳动节' },
    '2026-05-02': { type: 'rest' },
    '2026-05-03': { type: 'rest' },
    '2026-05-04': { type: 'rest' },
    '2026-05-05': { type: 'rest' },
    // 2026年端午节（农历五月初五：6月21日）
    '2026-06-21': { type: 'holiday', name: '端午' },
    '2026-06-22': { type: 'rest' },
    '2026-06-23': { type: 'rest' },
    // 2026年中秋节（农历八月十五：9月29日）
    '2026-09-29': { type: 'holiday', name: '中秋' },
    '2026-09-30': { type: 'rest' },
    '2026-10-01': { type: 'rest' },
    // 2026年国庆节（10月1日）
    '2026-10-02': { type: 'rest' },
    '2026-10-03': { type: 'rest' },
    '2026-10-04': { type: 'rest' },
    '2026-10-05': { type: 'rest' },
    '2026-10-06': { type: 'rest' },
    // 调休
    '2026-02-15': { type: 'work' },
    '2026-02-16': { type: 'work' },
    '2026-04-03': { type: 'work' },
    '2026-04-26': { type: 'work' },
    '2026-05-09': { type: 'work' },
    '2026-06-20': { type: 'work' },
    '2026-09-26': { type: 'work' },
    '2026-10-07': { type: 'work' },
    '2026-10-08': { type: 'work' },
  }

  // 过滤出指定月份的数据
  const filteredData: Record<string, HolidayInfo> = {}
  Object.keys(mockHolidayData).forEach((dateStr) => {
    const date = dayjs(dateStr)
    if (date.year() === year && date.month() + 1 === month) {
      filteredData[dateStr] = mockHolidayData[dateStr]
    }
  })

  return filteredData
}

// 模拟获取价格数据的API函数
const fetchPriceData = async (
  year: number,
  month: number
): Promise<Record<string, number>> => {
  // 实际项目中，这里应该调用真实的API
  // 这里使用模拟数据，生成指定月份的价格数据
  const priceData: Record<string, number> = {}
  const startDate = dayjs(`${year}-${month}-01`)
  const daysInMonth = startDate.daysInMonth()

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = startDate.date(i).format('YYYY-MM-DD')
    // 生成随机价格，范围在300-600之间
    const price = Math.floor(Math.random() * 300) + 300
    priceData[dateStr] = price
  }

  return priceData
}

interface DateRange {
  start: string | null
  end: string | null
}

interface HolidayInfo {
  type: 'holiday' | 'rest' | 'work'
  name?: string
}

interface CalendarPickerProps {
  visible: boolean
  onClose: () => void
  onConfirm: (range: DateRange) => void
  defaultStartDate?: string
  defaultEndDate?: string
  minDate?: string
  maxDate?: string
  title?: string
  priceData?: Record<string, number>
  holidayData?: Record<string, HolidayInfo>
  showPrice?: boolean
  lowestPriceData?: string[]
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  defaultStartDate,
  defaultEndDate,
  minDate,
  maxDate,
  title = '选择日期',
  priceData: initialPriceData = {},
  holidayData: initialHolidayData = {},
  showPrice = false,
  lowestPriceData = [],
}) => {
  const today = dayjs()
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<DateRange>({
    start: defaultStartDate || null,
    end: defaultEndDate || null,
  })
  const [priceData, setPriceData] =
    useState<Record<string, number>>(initialPriceData)
  const [holidayData, setHolidayData] =
    useState<Record<string, HolidayInfo>>(initialHolidayData)
  const [loading, setLoading] = useState(false)

  const minDateDayjs = minDate ? dayjs(minDate) : today
  const maxDateDayjs = maxDate ? dayjs(maxDate) : today.add(1, 'year')

  // 当月份变化时，获取对应月份的节假日和价格数据
  useEffect(() => {
    const loadData = async () => {
      if (!visible) return

      setLoading(true)
      try {
        const year = currentMonth.year()
        const month = currentMonth.month() + 1

        // 并行获取节假日和价格数据
        const [holidays, prices] = await Promise.all([
          fetchHolidayData(year, month),
          fetchPriceData(year, month),
        ])

        // 合并初始数据和新获取的数据
        setHolidayData((prev) => ({
          ...prev,
          ...holidays,
        }))
        setPriceData((prev) => ({
          ...prev,
          ...prices,
        }))
      } catch (error) {
        console.error('Failed to fetch calendar data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentMonth, visible])

  // 当组件首次加载时，获取当前月份的节假日和价格数据
  useEffect(() => {
    if (visible) {
      const loadInitialData = async () => {
        setLoading(true)
        try {
          const year = currentMonth.year()
          const month = currentMonth.month() + 1

          // 并行获取节假日和价格数据
          const [holidays, prices] = await Promise.all([
            fetchHolidayData(year, month),
            fetchPriceData(year, month),
          ])

          // 直接设置初始数据
          setHolidayData(holidays)
          setPriceData(prices)
        } catch (error) {
          console.error('Failed to fetch initial calendar data:', error)
        } finally {
          setLoading(false)
        }
      }

      loadInitialData()
    }
  }, [visible])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startDay = startOfMonth.day()
    const daysInMonth = endOfMonth.date()

    const days: Array<{ date: Dayjs | null; isCurrentMonth: boolean }> = []

    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, isCurrentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: currentMonth.date(i),
        isCurrentMonth: true,
      })
    }

    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push({ date: null, isCurrentMonth: false })
      }
    }

    return days
  }, [currentMonth])

  const handlePrevMonth = () => {
    const prevMonth = currentMonth.subtract(1, 'month')
    if (prevMonth.isAfter(minDateDayjs.subtract(1, 'month'))) {
      setCurrentMonth(prevMonth)
    }
  }

  const handleNextMonth = () => {
    const nextMonth = currentMonth.add(1, 'month')
    if (nextMonth.isBefore(maxDateDayjs.add(1, 'month'))) {
      setCurrentMonth(nextMonth)
    }
  }

  const handleDateClick = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')

    if (date.isBefore(minDateDayjs, 'day')) return
    if (date.isAfter(maxDateDayjs, 'day')) return

    if (!selectedDate.start || (selectedDate.start && selectedDate.end)) {
      setSelectedDate({ start: dateStr, end: null })
    } else {
      const startDate = dayjs(selectedDate.start)
      if (date.isBefore(startDate, 'day')) {
        setSelectedDate({ start: dateStr, end: selectedDate.start })
      } else {
        setSelectedDate({ start: selectedDate.start, end: dateStr })
      }
    }
  }

  const getDateStatus = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')
    const isStart = selectedDate.start === dateStr
    const isEnd = selectedDate.end === dateStr
    let isBetween = false

    if (selectedDate.start && selectedDate.end) {
      const startDate = dayjs(selectedDate.start)
      const endDate = dayjs(selectedDate.end)
      isBetween =
        date.isAfter(startDate, 'day') && date.isBefore(endDate, 'day')
    }

    const isDisabled =
      date.isBefore(minDateDayjs, 'day') || date.isAfter(maxDateDayjs, 'day')
    const isToday = date.isSame(today, 'day')
    const holidayInfo = holidayData[dateStr]
    const price = priceData[dateStr]
    const isLowestPrice = lowestPriceData.includes(dateStr)

    return {
      isStart,
      isEnd,
      isBetween,
      isDisabled,
      isToday,
      holidayInfo,
      price,
      isLowestPrice,
    }
  }

  const handleConfirm = () => {
    if (selectedDate.start && selectedDate.end) {
      onConfirm(selectedDate)
    }
    onClose()
  }

  const handleCancel = () => {
    setSelectedDate({
      start: defaultStartDate || null,
      end: defaultEndDate || null,
    })
    onClose()
  }

  const nightsCount = useMemo(() => {
    if (selectedDate.start && selectedDate.end) {
      return dayjs(selectedDate.end).diff(dayjs(selectedDate.start), 'day')
    }
    return 0
  }, [selectedDate])

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        maxHeight: '80vh',
      }}
      className="calendar-picker-popup"
    >
      <View className="calendar-picker-container">
        <View className="calendar-header">
          <View className="header-title">{title}</View>
          {nightsCount > 0 && (
            <View className="nights-count">共{nightsCount}晚</View>
          )}
        </View>

        <View className="month-selector">
          <View className="month-arrow" onClick={handlePrevMonth}>
            <Text>‹</Text>
          </View>
          <Text className="month-text">{currentMonth.format('YYYY年M月')}</Text>
          <View className="month-arrow" onClick={handleNextMonth}>
            <Text>›</Text>
          </View>
        </View>

        <View className="week-header">
          {weekDays.map((day, index) => {
            const isWeekend = index === 0 || index === 6
            return (
              <View
                key={day}
                className={`week-day ${isWeekend ? 'weekend' : ''}`}
              >
                <Text>{day}</Text>
              </View>
            )
          })}
        </View>

        <View className="calendar-grid">
          {calendarDays.map((item, index) => {
            if (!item.date) {
              return (
                <View key={`empty-${index}`} className="calendar-day empty">
                  <Text></Text>
                </View>
              )
            }

            const status = getDateStatus(item.date)
            const dayOfWeek = item.date.day()
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
            let dayClass = 'calendar-day'
            if (isWeekend) dayClass += ' weekend'
            if (status.isStart) dayClass += ' start'
            if (status.isEnd) dayClass += ' end'
            if (status.isBetween) dayClass += ' between'
            if (status.isDisabled) dayClass += ' disabled'
            if (status.isToday) dayClass += ' today'
            if (status.holidayInfo) {
              if (status.holidayInfo.type === 'holiday') dayClass += ' holiday'
              if (status.holidayInfo.type === 'rest') dayClass += ' rest'
            }
            if (status.isLowestPrice && !status.isStart && !status.isEnd)
              dayClass += ' lowest-price'

            return (
              <View
                key={`day-${index}`}
                className={dayClass}
                onClick={() => !status.isDisabled && handleDateClick(item.date)}
              >
                {status.holidayInfo && (
                  <Text className="holiday-label">
                    {status.holidayInfo.name ||
                      (status.holidayInfo.type === 'rest'
                        ? '休'
                        : status.holidayInfo.type === 'work'
                          ? '班'
                          : '')}
                  </Text>
                )}
                {status.isLowestPrice && !status.isStart && !status.isEnd && (
                  <Text className="select-label">低价</Text>
                )}
                <Text className="day-text">{item.date.date()}</Text>
                {showPrice && status.price !== undefined && (
                  <Text className="price-text">¥{status.price}</Text>
                )}
                {status.isStart && <Text className="select-label">入住</Text>}
                {status.isEnd && <Text className="select-label">离店</Text>}
              </View>
            )
          })}
        </View>

        <View className="calendar-footer">
          <View className="btn-cancel" onClick={handleCancel}>
            <Text>取消</Text>
          </View>
          <View className="btn-confirm" onClick={handleConfirm}>
            <Text>确定</Text>
          </View>
        </View>
      </View>
    </Popup>
  )
}
