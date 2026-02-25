export interface Room {
  id?: string
  _id?: string
  name?: string
  roomTypeName?: string
  description?: string
  bedType?: string
  area?: number
  maxOccupancy?: number
  breakfast?: boolean
  price?: number
  currentPrice?: number
  originalPrice?: number
  images?: string[]
}
