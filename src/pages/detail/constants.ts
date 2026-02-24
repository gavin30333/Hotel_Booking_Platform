export const DEFAULT_HOTEL_RATING = 4.9
export const DEFAULT_RATING_LABEL = '很好'
export const DEFAULT_REVIEW_TAGS = '安静舒适 交通便利 服务周到'
export const DEFAULT_DISTANCE_TEXT = '距离地铁站500米'
export const DEFAULT_OPENING_DATE = '2024-01-01'

export const CAROUSEL_TABS = ['封面', '精选', '位置', '点评', '相册'] as const

export const HOLIDAY_DATA = {
  '2026-02-23': { type: 'holiday' as const, name: '春节' },
  '2026-02-24': { type: 'rest' as const },
  '2026-03-01': { type: 'work' as const },
}

export const LOWEST_PRICE_DATA = ['2026-02-25', '2026-02-29', '2026-03-02']

export const NEARBY_CONFIG = {
  attractions: {
    title: '周边景点',
    icon: 'location',
    maxItems: 3,
  },
  transportations: {
    title: '交通出行',
    icon: 'travel',
    maxItems: 3,
  },
  shoppingMalls: {
    title: '购物商场',
    icon: 'shopbag',
    maxItems: 3,
  },
} as const
