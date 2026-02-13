import { HotSearchCategory } from '../types'

export const hotSearchTags: string[] = [
  '春熙路/太古里商业区',
  '成都东站',
  '宽窄巷子',
  '天府广场',
  '成都南站',
  '武侯区',
  '温江区',
  '成都天府国际机场',
  '成都双流国际机场',
  '文殊院',
]

export const rankingLists: HotSearchCategory[] = [
  {
    title: '奢华酒店榜',
    items: [
      {
        id: '1',
        name: '青城山六善酒店',
        rank: 1,
        score: '4.7分',
        description: '主打绿色环保理念，设施完备',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
        type: 'hotel',
      },
      {
        id: '2',
        name: '成都居舍',
        rank: 2,
        score: '4.8分',
        description: 'BOSS:环绕大慈寺而建的静谧...',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
        type: 'hotel',
      },
      {
        id: '3',
        name: '成都尼依格罗酒店',
        rank: 3,
        score: '4.7分',
        description: '国际设计作品，鸟瞰成都时...',
        imageUrl:
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
        type: 'hotel',
      },
      {
        id: '4',
        name: '成都华尔道夫酒店',
        rank: 4,
        score: '4.8分',
        description: '落地窗尽览双子塔夜景，享米...',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
        type: 'hotel',
      },
      {
        id: '5',
        name: '成都 W 酒店',
        rank: 5,
        score: '4.7分',
        description: '饱览天府双塔交子之环独有夜景',
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
        type: 'hotel',
      },
    ],
  },
  {
    title: '亲子乐园榜',
    items: [
      {
        id: '1',
        name: '成都海昌极地海洋公园',
        rank: 1,
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
        type: 'hotel',
      },
      {
        id: '2',
        name: '成都欢乐谷',
        rank: 2,
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
        type: 'hotel',
      },
      {
        id: '3',
        name: '青城山',
        rank: 3,
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500&q=80',
        type: 'hotel',
      },
    ],
  },
]
