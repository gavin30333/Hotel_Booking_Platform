import dayjs from 'dayjs'

export const formatDate = (dateStr: string) => {
  const date = dayjs(dateStr)
  const month = date.month() + 1
  const day = date.date()
  // Simplified weekday logic for demo
  const isToday = dayjs().isSame(date, 'day')
  const isTomorrow = dayjs().add(1, 'day').isSame(date, 'day')
  const weekday = isToday
    ? '今天'
    : isTomorrow
      ? '明天'
      : '周' + '日一二三四五六'.charAt(date.day())

  return {
    text: `${month}月${day}日`,
    sub: weekday,
  }
}
