import { HotelDetail } from '../types';

export const mockHotelDetail: HotelDetail = {
  id: 1,
  name: '上海外滩W酒店',
  englishName: 'W Shanghai - The Bund',
  rating: 4.8,
  reviewCount: 3240,
  address: '上海市虹口区旅顺路66号',
  description: '上海外滩W酒店坐落于北外滩，拥有得天户外的地理位置，可饱览黄浦江全景及浦东陆家嘴天际线。酒店设计融合了上海的传统弄堂文化与现代时尚元素，展现出独具一格的海派风情。每间客房均配有标志性的W睡床，让您尽享舒适睡眠。',
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ],
  tags: ['豪华型', '外滩景观', '网红酒店', 'SPA', '泳池'],
  coordinates: {
    latitude: 31.2513,
    longitude: 121.4937,
  },
  facilities: [
    { id: 1, icon: 'wifi', name: '免费WiFi' },
    { id: 2, icon: 'pool', name: '室内泳池' },
    { id: 3, icon: 'gym', name: '健身房' },
    { id: 4, icon: 'parking', name: '停车场' },
    { id: 5, icon: 'restaurant', name: '餐厅' },
    { id: 6, icon: 'bar', name: '酒吧' },
    { id: 7, icon: 'spa', name: 'SPA' },
    { id: 8, icon: 'meeting', name: '会议室' },
  ],
  reviews: [
    {
      id: 101,
      userName: 'Alice',
      userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      date: '2023-10-15',
      content: '景色无敌，服务也非常棒！特别是W层酒吧的夜景，简直太美了。房间很大，设计感十足，床也很舒服。下次还会再来！',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60']
    },
    {
      id: 102,
      userName: 'Bob',
      userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 4.5,
      date: '2023-09-28',
      content: '位置很好，去哪里都方便。早餐种类丰富，中西式都有。唯一的小缺点是电梯有时候要等比较久。总体体验还是很好的。',
    },
    {
      id: 103,
      userName: 'Charlie',
      userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 5,
      date: '2023-08-10',
      content: '带女朋友来过生日，酒店还特意布置了房间，送了蛋糕，非常贴心。泳池也很赞，拍照很出片。强烈推荐！',
    }
  ],
  roomTypes: [
    {
      id: 201,
      name: '奇妙客房 (Wonderful Room)',
      description: '46平方米，大床，外滩景观',
      price: 2388,
      originalPrice: 2888,
      currency: 'CNY',
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      area: '46㎡',
      bedType: '大床',
      facilities: ['免费WiFi', '独立卫浴', '浴缸', '迷你吧'],
      breakfast: '不含早',
      cancellationPolicy: '不可取消',
      stock: 5
    },
    {
      id: 202,
      name: '绝佳客房 (Fabulous Room)',
      description: '46平方米，双床，城市景观',
      price: 2588,
      currency: 'CNY',
      images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      area: '46㎡',
      bedType: '双床',
      facilities: ['免费WiFi', '独立卫浴', '浴缸', '迷你吧', '江景'],
      breakfast: '含双早',
      cancellationPolicy: '入住前24小时可免费取消',
      stock: 3
    },
    {
      id: 203,
      name: '壮美客房 (Spectacular Room)',
      description: '50平方米，大床，全景外滩景观',
      price: 3288,
      currency: 'CNY',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      area: '50㎡',
      bedType: '大床',
      facilities: ['免费WiFi', '独立卫浴', '智能马桶', 'BOSE音响', '全景落地窗'],
      breakfast: '含双早',
      cancellationPolicy: '入住前24小时可免费取消',
      stock: 2
    }
  ]
};
