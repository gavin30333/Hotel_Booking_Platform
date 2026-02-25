import {
  GlobalOutline,
  TruckOutline,
  GiftOutline,
  ScanningFaceOutline,
  SmileOutline,
  SetOutline,
  ClockCircleOutline,
  FireFill,
  TravelOutline,
  LocationOutline,
} from 'antd-mobile-icons'

export const getNightsCount = (checkInDate: string, checkOutDate: string) => {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getFacilityIcon = (facility: string) => {
  const facilityLower = facility.toLowerCase()
  if (
    facilityLower.includes('wifi') ||
    facilityLower.includes('网络') ||
    facilityLower.includes('无线')
  ) {
    return GlobalOutline
  }
  if (
    facilityLower.includes('停车') ||
    facilityLower.includes('车位') ||
    facilityLower.includes('车库')
  ) {
    return TruckOutline
  }
  if (
    facilityLower.includes('早餐') ||
    facilityLower.includes('餐厅') ||
    facilityLower.includes('餐饮')
  ) {
    return GiftOutline
  }
  if (
    facilityLower.includes('健身') ||
    facilityLower.includes('泳池') ||
    facilityLower.includes('运动')
  ) {
    return ScanningFaceOutline
  }
  if (
    facilityLower.includes('前台') ||
    facilityLower.includes('服务') ||
    facilityLower.includes('接待')
  ) {
    return SmileOutline
  }
  if (facilityLower.includes('空调') || facilityLower.includes('暖气')) {
    return SetOutline
  }
  if (facilityLower.includes('洗浴') || facilityLower.includes('淋浴')) {
    return ClockCircleOutline
  }
  return FireFill
}

export const getTransportIcon = (type: string) => {
  switch (type) {
    case 'subway':
    case 'highspeed':
    case 'train':
      return TravelOutline
    case 'bus':
      return TruckOutline
    case 'airport':
      return GlobalOutline
    default:
      return LocationOutline
  }
}
