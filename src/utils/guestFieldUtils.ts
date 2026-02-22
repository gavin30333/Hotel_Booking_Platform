import { GuestInfo } from '@/types/query.types'

// Helper function to format a list of numbers (with sorting and grouping)
export const formatNumberList = (val: number | number[], suffix: string) => {
  const arr = Array.isArray(val) ? val : [val]
  if (arr.length === 0) return '' // Empty return for empty selection

  const sorted = [...arr].sort((a, b) => a - b)
  const parts: string[] = []
  let start = sorted[0]
  let prev = sorted[0]

  const pushRange = (s: number, e: number) => {
    if (s === e) {
      if (s === 100) parts.push('自定义')
      else parts.push(`${s}${suffix}`)
    } else {
      if (s === 100) parts.push('自定义')
      else if (e === 100) {
        parts.push(`${s}${suffix}`)
        parts.push('自定义')
      } else {
        parts.push(`${s}-${e}${suffix}`)
      }
    }
  }

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    if (current === prev + 1 && current !== 100 && prev !== 100) {
      prev = current
    } else {
      pushRange(start, prev)
      start = current
      prev = current
    }
  }
  pushRange(start, prev)

  return parts.join(',')
}

// Helper to format homestay selection text
export const getHomestayText = (value: GuestInfo) => {
  const adultsText = formatNumberList(value.adults, '人')
  const childrenText = formatNumberList(value.children, '床')
  const roomsText = formatNumberList(value.rooms, '居')

  const parts = [adultsText, childrenText, roomsText].filter((p) => p !== '')
  if (parts.length === 0) return '' // Return empty string if no selections
  return parts.join(' ')
}
