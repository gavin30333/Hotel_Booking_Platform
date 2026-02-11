import { OverseasCategory } from '../types';

export const overseasCategories: OverseasCategory[] = [
  {
    key: 'hot',
    title: '热门',
    subTitle: '热门 免签/落地签',
    hotDestinations: [
      { name: '曼谷', tag: 'SPA看秀不能少', imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=500&q=80', description: 'SPA看秀不能少' },
      { name: '普吉岛', tag: '三大海滩不容错过', imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=500&q=80', description: '三大海滩不容错过' },
      { name: '吉隆坡', tag: '萤火虫 夜生活', imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&q=80', description: '萤火虫 夜生活' },
      { name: '哥打京那巴鲁', tag: '夕阳 海滩 徒步', imageUrl: 'https://images.unsplash.com/photo-1540202404-a6f74cc2098d?w=500&q=80', description: '夕阳 海滩 徒步' },
    ],
    cities: [
      { name: '新加坡' }, { name: '东京' }, { name: '曼谷' },
      { name: '首尔' }, { name: '普吉岛' }, { name: '巴黎' },
      { name: '吉隆坡' }, { name: '迪拜' }, { name: '悉尼' },
      { name: '伦敦' }, { name: '大阪' }, { name: '更多' }
    ]
  },
  {
    key: 'visa_free',
    title: '热门 免签/落地签',
    cities: [
      { name: '曼谷', tag: '免签' }, { name: '普吉岛', tag: '免签' },
      { name: '吉隆坡', tag: '免签' }, { name: '巴厘岛', tag: '免签' },
      { name: '迪拜', tag: '免签' }, { name: '马尔代夫', tag: '免签' }
    ]
  },
  {
    key: 'japan_korea',
    title: '日韩',
    cities: [
      { name: '东京' }, { name: '大阪' }, { name: '京都' },
      { name: '首尔' }, { name: '济州岛' }, { name: '釜山' },
      { name: '名古屋' }, { name: '福冈' }, { name: '札幌' }
    ]
  },
  {
    key: 'sea',
    title: '东南亚',
    cities: [
      { name: '新加坡' }, { name: '吉隆坡' }, { name: '曼谷' },
      { name: '清迈' }, { name: '胡志明市' }, { name: '河内' }
    ]
  },
  {
    key: 'europe',
    title: '欧洲',
    cities: [
      { name: '伦敦' }, { name: '巴黎' }, { name: '罗马' },
      { name: '米兰' }, { name: '巴塞罗那' }, { name: '马德里' }
    ]
  },
  {
    key: 'americas',
    title: '美洲',
    cities: [
      { name: '纽约' }, { name: '洛杉矶' }, { name: '旧金山' },
      { name: '多伦多' }, { name: '温哥华' }, { name: '拉斯维加斯' }
    ]
  }
];
