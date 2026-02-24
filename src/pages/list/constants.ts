export const sortOptions = [
  { key: 'price_asc', label: '价格从低到高', value: 'price_asc' },
  { key: 'price_desc', label: '价格从高到低', value: 'price_desc' },
  { key: 'rating_desc', label: '评分从高到低', value: 'rating_desc' },
  { key: 'distance_asc', label: '距离从近到远', value: 'distance_asc' },
]

export const stayDurationOptions = [
  { label: '2小时以下', value: '2h-' },
  { label: '3小时', value: '3h' },
  { label: '4小时', value: '4h' },
  { label: '5小时以上', value: '5h+' },
]

export const brandOptions = [
  { label: '希尔顿', value: 'hilton' },
  { label: '万豪', value: 'marriott' },
  { label: '洲际', value: 'intercontinental' },
  { label: '凯悦', value: 'hyatt' },
  { label: '雅高', value: 'accor' },
  { label: '精选酒店', value: 'selected' },
]

export const filterTags = [
  { name: '4.5分以上', key: 'minRating', value: 4.5 },
  { name: '大床房', key: 'roomType', value: '大床房' },
  { name: '双床房', key: 'roomType', value: '双床房' },
  { name: '套房', key: 'roomType', value: '套房' },
  { name: '亲子房', key: 'roomType', value: '亲子房' },
  { name: '家庭房', key: 'roomType', value: '家庭房' },
  { name: '无烟房', key: 'smokeFree', value: true },
]
