import { OverseasCategory } from '@/types/citySelector'

export const overseasCategories: OverseasCategory[] = [
  {
    key: 'hot',
    title: '热门',
    subTitle: '热门 免签/落地签',
    hotDestinations: [
      {
        name: '曼谷',
        tag: 'SPA看秀不能少',
        imageUrl:
          'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=500&q=80',
        description: 'SPA看秀不能少',
      },
      {
        name: '普吉岛',
        tag: '三大海滩不容错过',
        imageUrl:
          'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=500&q=80',
        description: '三大海滩不容错过',
      },
      {
        name: '吉隆坡',
        tag: '萤火虫 夜生活',
        imageUrl:
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&q=80',
        description: '萤火虫 夜生活',
      },
      {
        name: '哥打京那巴鲁',
        tag: '夕阳 海滩 徒步',
        imageUrl:
          'https://images.unsplash.com/photo-1540202404-a6f74cc2098d?w=500&q=80',
        description: '夕阳 海滩 徒步',
      },
    ],
    cities: [
      { name: '新加坡' },
      { name: '东京' },
      { name: '曼谷' },
      { name: '首尔' },
      { name: '普吉岛' },
      { name: '巴黎' },
      { name: '吉隆坡' },
      { name: '迪拜' },
      { name: '悉尼' },
      { name: '伦敦' },
      { name: '大阪' },
      { name: '更多' },
    ],
  },
  {
    key: 'visa_free',
    title: '热门 免签/落地签',
    cities: [
      { name: '曼谷', tag: '免签' },
      { name: '普吉岛', tag: '免签' },
      { name: '吉隆坡', tag: '免签' },
      { name: '巴厘岛', tag: '免签' },
      { name: '迪拜', tag: '免签' },
      { name: '马尔代夫', tag: '免签' },
    ],
  },
  {
    key: 'japan_korea',
    title: '日韩',
    subTitle: '日韩热门城市',
    hotDestinations: [
      {
        name: '东京',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80',
        description: '',
      },
      {
        name: '首尔',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&q=80',
        description: '',
      },
      {
        name: '大阪',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1590559399607-e00a8a9781d6?w=500&q=80',
        description: '',
      },
      {
        name: '札幌',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1539665738809-51c398334465?w=500&q=80',
        description: '',
      },
    ],
    cities: [
      { name: '京都' },
      { name: '济州市' },
      { name: '福冈' },
      { name: '釜山' },
      { name: '仁川' },
      { name: '横滨' },
      { name: '神户' },
      { name: '箱根' },
      { name: '名古屋' },
    ],
  },
  {
    key: 'sea',
    title: '东南亚',
    subTitle: '东南亚热门城市',
    hotDestinations: [
      {
        name: '新加坡',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&q=80',
        description: '',
      },
      {
        name: '曼谷',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=500&q=80',
        description: '',
      },
      {
        name: '普吉岛',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=500&q=80',
        description: '',
      },
      {
        name: '吉隆坡',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&q=80',
        description: '',
      },
    ],
    cities: [
      { name: '巴厘岛' },
      { name: '芭堤雅' },
      { name: '清迈' },
      { name: '亚庇' },
      { name: '富国岛' },
      { name: '胡志明市' },
      { name: '苏梅岛' },
      { name: '岘港' },
      { name: '仙本那' },
    ],
  },
  {
    key: 'europe',
    title: '欧洲',
    subTitle: '欧洲热门城市',
    hotDestinations: [
      {
        name: '巴黎',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80',
        description: '',
      },
      {
        name: '伦敦',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80',
        description: '',
      },
      {
        name: '巴塞罗那',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=500&q=80',
        description: '',
      },
      {
        name: '马德里',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=500&q=80',
        description: '',
      },
    ],
    cities: [
      { name: '罗马' },
      { name: '米兰' },
      { name: '莫斯科' },
      { name: '尼斯' },
      { name: '佛罗伦萨' },
      { name: '阿姆斯特丹' },
      { name: '法兰克福' },
      { name: '爱丁堡' },
      { name: '慕尼黑' },
    ],
  },
  {
    key: 'americas',
    title: '美洲',
    subTitle: '美洲热门城市',
    hotDestinations: [
      {
        name: '纽约',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80',
        description: '',
      },
      {
        name: '洛杉矶',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1580655653885-65763b843ba2?w=500&q=80',
        description: '',
      },
      {
        name: '拉斯维加斯',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=500&q=80',
        description: '',
      },
      {
        name: '檀香山',
        tag: '',
        imageUrl:
          'https://images.unsplash.com/photo-1542259498-271836597152?w=500&q=80',
        description: '',
      },
    ],
    cities: [
      { name: '波士顿' },
      { name: '旧金山' },
      { name: '奥兰多' },
      { name: '圣地亚哥' },
      { name: '温哥华' },
      { name: '多伦多' },
      { name: '芝加哥' },
      { name: '迈阿密' },
      { name: '华盛顿' },
    ],
  },
]
