import Mock from 'mockjs'

type Banner = {
  id: number
  imgUrl: string
  title: string
  hotelId: string
  hotelName: string
  city: string
  price: number
}
type BannerResponse = {
  code: number
  msg: string
  data: Banner[]
}

const bannerAds: Banner[] = [
  {
    id: 1,
    imgUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    title: '杭州西湖畔奢华体验',
    hotelId: '699835352d89deaf4d16816f',
    hotelName: '杭州西子湖四季酒店',
    city: '杭州',
    price: 1680,
  },
  {
    id: 2,
    imgUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    title: '上海外滩江景房特惠',
    hotelId: '1',
    hotelName: '上海外滩华尔道夫酒店',
    city: '上海',
    price: 1280,
  },
  {
    id: 3,
    imgUrl:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    title: '浦东香格里拉尊享礼遇',
    hotelId: '2',
    hotelName: '上海浦东香格里拉大酒店',
    city: '上海',
    price: 1080,
  },
]

export const getBanners = () => {
  return bannerAds
}
export type { Banner, BannerResponse }

const hotelDetailMock1 = {
  id: '1',
  name: '上海外滩华尔道夫酒店',
  address: '上海市黄浦区中山东一路2号',
  city: '上海',
  latitude: 31.230416,
  longitude: 121.473701,
  starRating: 5,
  rating: 4.8,
  reviewCount: 1256,
  minPrice: 1280,
  imageUrl:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  ],
  tags: ['奢华酒店', '商务出行', '亲子友好', '近地铁'],
  facilities: [
    '免费WiFi',
    '停车场',
    '健身房',
    '游泳池',
    'SPA',
    '餐厅',
    '酒吧',
    '会议室',
    '商务中心',
    '24小时前台',
    '行李寄存',
    '洗衣服务',
    '叫车服务',
  ],
  description:
    '上海外滩华尔道夫酒店位于外滩核心地带，毗邻黄浦江，俯瞰陆家嘴天际线，是商务和休闲旅行者的理想选择。酒店拥有豪华客房和套房，配备现代化设施，提供卓越的服务体验。',
  rooms: [
    {
      id: '101',
      name: '豪华客房',
      size: 45,
      bedType: '特大床',
      price: 1280,
      description: '宽敞明亮的豪华客房，配备特大床，享有城市景观',
    },
    {
      id: '102',
      name: '江景客房',
      size: 45,
      bedType: '特大床',
      price: 1680,
      description: '俯瞰黄浦江的江景客房，配备特大床，享受壮丽江景',
    },
    {
      id: '103',
      name: '豪华套房',
      size: 70,
      bedType: '特大床',
      price: 2680,
      description: '豪华套房，配备独立起居室和卧室，享有城市景观',
    },
    {
      id: '104',
      name: '江景套房',
      size: 70,
      bedType: '特大床',
      price: 3280,
      description: '江景套房，配备独立起居室和卧室，俯瞰黄浦江',
    },
  ],
  reviews: [
    {
      id: '201',
      userName: '张先生',
      date: '2026-02-10',
      rating: 5,
      content:
        '酒店位置绝佳，就在外滩边上，可以看到美丽的江景。房间宽敞舒适，设施齐全，服务态度非常好。早餐种类丰富，味道也不错。下次来上海还会选择这家酒店。',
    },
    {
      id: '202',
      userName: '李女士',
      date: '2026-02-08',
      rating: 4,
      content:
        '酒店环境优雅，服务专业。房间干净整洁，床很舒适。地理位置优越，步行可达外滩和南京路。唯一的小缺点是价格有点高，但考虑到位置和服务，还是值得的。',
    },
    {
      id: '203',
      userName: '王先生',
      date: '2026-02-05',
      rating: 5,
      content:
        '商务出行选择了这家酒店，非常满意。酒店的商务中心设施齐全，会议室条件很好。房间安静，适合工作和休息。前台服务周到，办理入住和退房都很快捷。',
    },
  ],
}

const hotelDetailMock2 = {
  id: '2',
  name: '上海浦东香格里拉大酒店',
  address: '上海市浦东新区富城路33号',
  city: '上海',
  latitude: 31.231706,
  longitude: 121.508575,
  starRating: 5,
  rating: 4.7,
  reviewCount: 987,
  minPrice: 1080,
  imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  images: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  ],
  tags: ['豪华商务', '交通便利', '近地铁', '会议设施'],
  facilities: [
    '免费WiFi',
    '停车场',
    '健身房',
    '游泳池',
    'SPA',
    '餐厅',
    '酒吧',
    '大型会议室',
    '商务中心',
    '24小时前台',
    '行李寄存',
    '洗衣服务',
    '机场接送',
  ],
  description:
    '上海浦东香格里拉大酒店位于陆家嘴金融区核心地带，毗邻东方明珠和上海环球金融中心，交通便利，是商务和休闲旅行者的理想选择。酒店拥有豪华客房和套房，配备现代化设施，提供卓越的服务体验。',
  rooms: [
    {
      id: '201',
      name: '豪华客房',
      size: 42,
      bedType: '特大床',
      price: 1080,
      description: '宽敞明亮的豪华客房，配备特大床，享有城市景观',
    },
    {
      id: '202',
      name: '行政客房',
      size: 42,
      bedType: '特大床',
      price: 1480,
      description: '行政客房，配备特大床，享受行政酒廊礼遇',
    },
    {
      id: '203',
      name: '豪华套房',
      size: 80,
      bedType: '特大床',
      price: 2280,
      description: '豪华套房，配备独立起居室和卧室，享有城市景观',
    },
    {
      id: '204',
      name: '行政套房',
      size: 80,
      bedType: '特大床',
      price: 2880,
      description: '行政套房，配备独立起居室和卧室，享受行政酒廊礼遇',
    },
  ],
  reviews: [
    {
      id: '301',
      userName: '刘女士',
      date: '2026-02-09',
      rating: 5,
      content:
        '酒店位置很好，就在陆家嘴核心区，步行可达地铁站和购物中心。房间宽敞舒适，床很软，设施齐全。服务人员态度热情，办理入住和退房都很快捷。早餐种类丰富，味道不错。',
    },
    {
      id: '302',
      userName: '陈先生',
      date: '2026-02-07',
      rating: 4,
      content:
        '商务出差选择了这家酒店，会议室条件很好，设备齐全。房间安静，适合工作和休息。酒店的餐饮服务也不错，尤其是西餐。唯一的小缺点是价格有点高，但考虑到位置和服务，还是值得的。',
    },
    {
      id: '303',
      userName: '张先生',
      date: '2026-02-04',
      rating: 5,
      content:
        '带家人来上海旅游，选择了这家酒店。房间宽敞，设施齐全，服务态度很好。酒店离东方明珠很近，步行就能到达。早餐种类丰富，适合全家人的口味。下次来上海还会选择这家酒店。',
    },
  ],
}

const cityHotSearchMock = {
  code: 200,
  data: [
    '外滩',
    '南京路',
    '陆家嘴',
    '迪士尼',
    '新天地',
    '静安寺',
    '徐家汇',
    '五角场',
  ],
}

const cityHotSearchData: Record<string, string[]> = {
  上海: [
    '外滩',
    '南京路',
    '陆家嘴',
    '迪士尼',
    '新天地',
    '静安寺',
    '徐家汇',
    '五角场',
  ],
  杭州: [
    '西湖',
    '灵隐寺',
    '西溪湿地',
    '宋城',
    '龙井',
    '断桥',
    '雷峰塔',
    '千岛湖',
  ],
  北京: [
    '故宫',
    '天安门',
    '长城',
    '颐和园',
    '三里屯',
    '王府井',
    '鸟巢',
    '南锣鼓巷',
  ],
  成都: [
    '春熙路/太古里商业区',
    '成都东站',
    '宽窄巷子',
    '天府广场',
    '成都南站',
    '武侯区',
    '文殊院',
  ],
  广州: ['珠江新城', '天河城', '北京路', '上下九', '白云山', '长隆'],
  深圳: ['世界之窗', '欢乐谷', '东部华侨城', '大梅沙', '华强北', '深圳湾'],
  南京: ['夫子庙', '中山陵', '玄武湖', '新街口', '总统府', '秦淮河'],
  苏州: ['拙政园', '虎丘', '平江路', '观前街', '金鸡湖', '寒山寺'],
}

interface RankingHotel {
  hotelId: string
  name: string
  desc: string
  score?: string
  imageUrl?: string
}

const cityHotelRankingsData: Record<
  string,
  {
    luxuryHotels: RankingHotel[]
    familyHotels: RankingHotel[]
  }
> = {
  上海: {
    luxuryHotels: [
      {
        hotelId: 'sh-waldorf-001',
        name: '上海外滩华尔道夫酒店',
        desc: '奢华体验，江景绝佳',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'sh-shangri-002',
        name: '上海浦东香格里拉大酒店',
        desc: '豪华商务，交通便利',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'sh-peace-003',
        name: '上海和平饭店',
        desc: '历史悠久，文化底蕴',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
      {
        hotelId: 'sh-ritz-004',
        name: '上海浦东丽思卡尔顿酒店',
        desc: '高端奢华，服务一流',
        score: '4.9分',
        imageUrl:
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500',
      },
      {
        hotelId: 'sh-park-005',
        name: '上海柏悦酒店',
        desc: '现代简约，高空景观',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'sh-disney-101',
        name: '上海迪士尼乐园酒店',
        desc: '迪士尼主题，亲子友好',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'sh-toy-102',
        name: '上海玩具总动员酒店',
        desc: '玩具主题，适合儿童',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'sh-kerry-103',
        name: '上海浦东嘉里大酒店',
        desc: '儿童俱乐部，设施齐全',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
      {
        hotelId: 'sh-w-104',
        name: '上海外滩W酒店',
        desc: '时尚设计，家庭套房',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500',
      },
      {
        hotelId: 'sh-hyatt-105',
        name: '上海环球港凯悦酒店',
        desc: '购物便利，亲子设施',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
      },
    ],
  },
  杭州: {
    luxuryHotels: [
      {
        hotelId: 'hz-four-seasons-001',
        name: '杭州西子湖四季酒店',
        desc: '西湖畔奢华体验',
        score: '4.9分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'hz-aman-002',
        name: '杭州法云安缦',
        desc: '古村落中的隐世奢华',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'hz-banyan-003',
        name: '杭州西溪悦榕庄',
        desc: '湿地秘境，私密奢华',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
      {
        hotelId: 'hz-ic-004',
        name: '杭州洲际酒店',
        desc: '城市地标，高端商务',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500',
      },
      {
        hotelId: 'hz-jw-005',
        name: '杭州JW万豪酒店',
        desc: '钱江新城，现代奢华',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'hz-songcheng-101',
        name: '杭州宋城千古情酒店',
        desc: '主题乐园，亲子首选',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'hz-paradise-102',
        name: '杭州乐园酒店',
        desc: '欢乐时光，家庭出游',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'hz-zoo-103',
        name: '杭州野生动物世界酒店',
        desc: '亲近自然，寓教于乐',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
      {
        hotelId: 'hz-senbo-104',
        name: '杭州开元森泊度假酒店',
        desc: '水上乐园，亲子度假',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500',
      },
      {
        hotelId: 'hz-liangzhu-105',
        name: '杭州良渚君澜度假酒店',
        desc: '文化探索，家庭休闲',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
      },
    ],
  },
  北京: {
    luxuryHotels: [
      {
        hotelId: 'bj-mandarin-001',
        name: '北京王府井文华东方酒店',
        desc: '皇城根下的奢华',
        score: '4.9分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'bj-rosewood-002',
        name: '北京瑰丽酒店',
        desc: '现代艺术，极致体验',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'bj-waldorf-003',
        name: '北京华尔道夫酒店',
        desc: '胡同里的优雅',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
      {
        hotelId: 'bj-four-004',
        name: '北京四季酒店',
        desc: 'CBD核心，商务首选',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500',
      },
      {
        hotelId: 'bj-park-005',
        name: '北京柏悦酒店',
        desc: '高空景观，都市奢华',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'bj-universal-101',
        name: '北京环球影城酒店',
        desc: '电影主题，亲子乐园',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'bj-happy-102',
        name: '北京欢乐谷酒店',
        desc: '游乐天堂，家庭欢乐',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'bj-zoo-103',
        name: '北京动物园酒店',
        desc: '亲近动物，寓教于乐',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
      {
        hotelId: 'bj-gubei-104',
        name: '北京古北水镇酒店',
        desc: '长城脚下，古镇风情',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500',
      },
      {
        hotelId: 'bj-expo-105',
        name: '北京世园会酒店',
        desc: '自然探索，生态度假',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
      },
    ],
  },
  成都: {
    luxuryHotels: [
      {
        hotelId: 'cd-temple-001',
        name: '成都博舍酒店',
        desc: '太古里核心，设计精品',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'cd-stregis-002',
        name: '成都瑞吉酒店',
        desc: '天府广场，奢华标杆',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'cd-shangri-003',
        name: '成都香格里拉大酒店',
        desc: '锦江畔，商务首选',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
      {
        hotelId: 'cd-niccolo-004',
        name: '成都尼依格罗酒店',
        desc: '国际设计，城市地标',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500',
      },
      {
        hotelId: 'cd-six-005',
        name: '青城山六善酒店',
        desc: '山间隐逸，绿色环保',
        score: '4.9分',
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'cd-panda-101',
        name: '成都大熊猫基地酒店',
        desc: '熊猫主题，亲子必选',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'cd-happy-102',
        name: '成都欢乐谷酒店',
        desc: '游乐天堂，家庭欢乐',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'cd-ocean-103',
        name: '成都海昌极地海洋公园酒店',
        desc: '海洋主题，寓教于乐',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
      {
        hotelId: 'cd-flora-104',
        name: '成都国色天乡酒店',
        desc: '童话世界，亲子度假',
        score: '4.4分',
        imageUrl:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500',
      },
      {
        hotelId: 'cd-qingcheng-105',
        name: '都江堰青城山酒店',
        desc: '山水之间，家庭休闲',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
      },
    ],
  },
  广州: {
    luxuryHotels: [
      {
        hotelId: 'gz-ritz-001',
        name: '广州富力丽思卡尔顿酒店',
        desc: '珠江新城，奢华标杆',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'gz-four-002',
        name: '广州四季酒店',
        desc: '高空景观，俯瞰珠江',
        score: '4.9分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'gz-peninsula-003',
        name: '广州半岛酒店',
        desc: '经典奢华，服务一流',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'gz-chimelong-101',
        name: '广州长隆酒店',
        desc: '野生动物主题，亲子首选',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'gz-panda-102',
        name: '广州长隆熊猫酒店',
        desc: '熊猫主题，儿童乐园',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'gz-crocodile-103',
        name: '广州长隆鳄鱼酒店',
        desc: '鳄鱼主题，探险体验',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
    ],
  },
  深圳: {
    luxuryHotels: [
      {
        hotelId: 'sz-ritz-001',
        name: '深圳星河丽思卡尔顿酒店',
        desc: 'CBD核心，奢华体验',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'sz-four-002',
        name: '深圳四季酒店',
        desc: '福田中心，商务首选',
        score: '4.9分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'sz-peninsula-003',
        name: '深圳鹏瑞莱佛士酒店',
        desc: '深圳湾畔，高空景观',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'sz-window-101',
        name: '深圳世界之窗酒店',
        desc: '世界主题，亲子探索',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'sz-happy-102',
        name: '深圳欢乐谷酒店',
        desc: '游乐天堂，家庭欢乐',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'sz-oct-103',
        name: '深圳东部华侨城酒店',
        desc: '山海之间，生态度假',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
    ],
  },
  南京: {
    luxuryHotels: [
      {
        hotelId: 'nj-inter-001',
        name: '南京紫金山洲际酒店',
        desc: '紫金山畔，景观绝佳',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'nj-shangri-002',
        name: '南京香格里拉大酒店',
        desc: '玄武湖畔，商务首选',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'nj-ritz-003',
        name: '南京丽思卡尔顿酒店',
        desc: '新街口核心，奢华体验',
        score: '4.8分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'nj-tangshan-101',
        name: '南京汤山温泉酒店',
        desc: '温泉度假，家庭休闲',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'nj-confucius-102',
        name: '南京夫子庙酒店',
        desc: '文化体验，亲子教育',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'nj-hongshan-103',
        name: '南京红山森林动物园酒店',
        desc: '亲近动物，寓教于乐',
        score: '4.4分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
    ],
  },
  苏州: {
    luxuryHotels: [
      {
        hotelId: 'szhou-shangri-001',
        name: '苏州香格里拉大酒店',
        desc: '金鸡湖畔，现代奢华',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      },
      {
        hotelId: 'szhou-w-002',
        name: '苏州W酒店',
        desc: '设计时尚，年轻活力',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500',
      },
      {
        hotelId: 'szhou-niulang-003',
        name: '苏州尼依格罗酒店',
        desc: '国际品牌，商务首选',
        score: '4.7分',
        imageUrl:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
      },
    ],
    familyHotels: [
      {
        hotelId: 'szhou-garden-101',
        name: '苏州拙政园酒店',
        desc: '园林体验，文化传承',
        score: '4.6分',
        imageUrl:
          'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500',
      },
      {
        hotelId: 'szhou-zhouzhuang-102',
        name: '周庄水乡客栈',
        desc: '古镇风情，亲子体验',
        score: '4.5分',
        imageUrl:
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500',
      },
      {
        hotelId: 'szhou-land-103',
        name: '苏州乐园酒店',
        desc: '游乐天堂，家庭欢乐',
        score: '4.4分',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500',
      },
    ],
  },
}

export const getCityHotSearch = (cityName: string) => {
  const tags = cityHotSearchData[cityName] || cityHotSearchMock.data
  return Promise.resolve({ code: 200, data: tags })
}

export const getCityHotelRankings = (cityName: string) => {
  const rankings = cityHotelRankingsData[cityName] || {
    luxuryHotels: [],
    familyHotels: [],
  }
  return Promise.resolve({ code: 200, data: rankings })
}

export const getHotelDetail = (id: string) => {
  const hotelData = id === '1' ? hotelDetailMock1 : hotelDetailMock2
  return Promise.resolve({ code: 200, data: hotelData })
}

export const getHotelList = (params: any) => {
  return Promise.resolve({
    code: 200,
    data: {
      list: [hotelDetailMock1, hotelDetailMock2],
      total: 2,
      page: params.page,
      pageSize: params.pageSize,
    },
  })
}
