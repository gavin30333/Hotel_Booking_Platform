export interface CityGroup {
  title: string
  items: string[]
}

export type CityTab = 'domestic' | 'overseas' | 'hot_search'

export interface OverseasCity {
  name: string
  tag?: string // e.g. "免签"
  imageUrl?: string
  description?: string
}

export interface OverseasCategory {
  key: string
  title: string
  subTitle?: string // Optional subtitle for some sections
  cities?: OverseasCity[] // List of cities
  hotDestinations?: OverseasCity[] // For the "Hot" category with image cards
}

export interface HotSearchItem {
  id: string
  name: string
  rank?: number
  score?: string // e.g. "4.8分"
  price?: string
  tags?: string[]
  imageUrl?: string
  description?: string
  type: 'spot' | 'hotel' // Spot (Tag) or Hotel (Card)
}

export interface HotSearchCategory {
  title: string
  items: HotSearchItem[]
}

export interface CitySelectResult {
  city: string
  source: CityTab
}

export type HotSearchSelectType = 'keyword' | 'hotel'

export interface HotSearchSelectResult {
  type: HotSearchSelectType
  value: string
  hotelId?: string
}
