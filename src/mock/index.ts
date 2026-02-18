import Mock from 'mockjs'

type Banner = {
  id: number
  imgUrl: string
  title: string
}
type BannerResponse = {
  code: number
  msg: string
  data: Banner[]
}
export const getBanners = () => {
  const data = Mock.mock({
    'list|3-8': [
      {
        'id|+1': 1,
        imgUrl: 'https://picsum.photos/750/350?random=@integer(1, 1000)',
        title: '@ctitle(4, 8)',
      },
    ],
  })
  return data.list
}
export type { Banner, BannerResponse }

const hotelDetailMock1 = {
  id: "1",
  name: "上海外滩华尔道夫酒店",
  address: "上海市黄浦区中山东一路2号",
  city: "上海",
  latitude: 31.230416,
  longitude: 121.473701,
  starRating: 5,
  rating: 4.8,
  reviewCount: 1256,
  minPrice: 1280,
  imageUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20with%20modern%20architecture%20in%20city%20center&image_size=landscape_16_9",
  images: [
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20with%20modern%20architecture%20in%20city%20center&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20lobby%20with%20high%20ceiling%20and%20elegant%20decor&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20room%20with%20king%20bed%20and%20city%20view&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20bathroom%20with%20bathtub%20and%20modern%20fixtures&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20restaurant%20with%20elegant%20dining%20area&image_size=landscape_16_9"
  ],
  tags: ["奢华酒店", "商务出行", "亲子友好", "近地铁"],
  facilities: [
    "免费WiFi",
    "停车场",
    "健身房",
    "游泳池",
    "SPA",
    "餐厅",
    "酒吧",
    "会议室",
    "商务中心",
    "24小时前台",
    "行李寄存",
    "洗衣服务",
    "叫车服务"
  ],
  description: "上海外滩华尔道夫酒店位于外滩核心地带，毗邻黄浦江，俯瞰陆家嘴天际线，是商务和休闲旅行者的理想选择。酒店拥有豪华客房和套房，配备现代化设施，提供卓越的服务体验。",
  rooms: [
    {
      id: "101",
      name: "豪华客房",
      size: 45,
      bedType: "特大床",
      price: 1280,
      description: "宽敞明亮的豪华客房，配备特大床，享有城市景观"
    },
    {
      id: "102",
      name: "江景客房",
      size: 45,
      bedType: "特大床",
      price: 1680,
      description: "俯瞰黄浦江的江景客房，配备特大床，享受壮丽江景"
    },
    {
      id: "103",
      name: "豪华套房",
      size: 70,
      bedType: "特大床",
      price: 2680,
      description: "豪华套房，配备独立起居室和卧室，享有城市景观"
    },
    {
      id: "104",
      name: "江景套房",
      size: 70,
      bedType: "特大床",
      price: 3280,
      description: "江景套房，配备独立起居室和卧室，俯瞰黄浦江"
    }
  ],
  reviews: [
    {
      id: "201",
      userName: "张先生",
      date: "2026-02-10",
      rating: 5,
      content: "酒店位置绝佳，就在外滩边上，可以看到美丽的江景。房间宽敞舒适，设施齐全，服务态度非常好。早餐种类丰富，味道也不错。下次来上海还会选择这家酒店。"
    },
    {
      id: "202",
      userName: "李女士",
      date: "2026-02-08",
      rating: 4,
      content: "酒店环境优雅，服务专业。房间干净整洁，床很舒适。地理位置优越，步行可达外滩和南京路。唯一的小缺点是价格有点高，但考虑到位置和服务，还是值得的。"
    },
    {
      id: "203",
      userName: "王先生",
      date: "2026-02-05",
      rating: 5,
      content: "商务出行选择了这家酒店，非常满意。酒店的商务中心设施齐全，会议室条件很好。房间安静，适合工作和休息。前台服务周到，办理入住和退房都很快捷。"
    }
  ]
};

const hotelDetailMock2 = {
  id: "2",
  name: "上海浦东香格里拉大酒店",
  address: "上海市浦东新区富城路33号",
  city: "上海",
  latitude: 31.231706,
  longitude: 121.508575,
  starRating: 5,
  rating: 4.7,
  reviewCount: 987,
  minPrice: 1080,
  imageUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20in%20pudong%20shanghai%20with%20modern%20design&image_size=landscape_16_9",
  images: [
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20in%20pudong%20shanghai%20with%20modern%20design&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20lobby%20with%20crystal%20chandelier&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20room%20with%20pudong%20skyline%20view&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20bathroom%20with%20rain%20shower&image_size=landscape_16_9",
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20restaurant%20with%20international%20cuisine&image_size=landscape_16_9"
  ],
  tags: ["豪华商务", "交通便利", "近地铁", "会议设施"],
  facilities: [
    "免费WiFi",
    "停车场",
    "健身房",
    "游泳池",
    "SPA",
    "餐厅",
    "酒吧",
    "大型会议室",
    "商务中心",
    "24小时前台",
    "行李寄存",
    "洗衣服务",
    "机场接送"
  ],
  description: "上海浦东香格里拉大酒店位于陆家嘴金融区核心地带，毗邻东方明珠和上海环球金融中心，交通便利，是商务和休闲旅行者的理想选择。酒店拥有豪华客房和套房，配备现代化设施，提供卓越的服务体验。",
  rooms: [
    {
      id: "201",
      name: "豪华客房",
      size: 42,
      bedType: "特大床",
      price: 1080,
      description: "宽敞明亮的豪华客房，配备特大床，享有城市景观"
    },
    {
      id: "202",
      name: "行政客房",
      size: 42,
      bedType: "特大床",
      price: 1480,
      description: "行政客房，配备特大床，享受行政酒廊礼遇"
    },
    {
      id: "203",
      name: "豪华套房",
      size: 80,
      bedType: "特大床",
      price: 2280,
      description: "豪华套房，配备独立起居室和卧室，享有城市景观"
    },
    {
      id: "204",
      name: "行政套房",
      size: 80,
      bedType: "特大床",
      price: 2880,
      description: "行政套房，配备独立起居室和卧室，享受行政酒廊礼遇"
    }
  ],
  reviews: [
    {
      id: "301",
      userName: "刘女士",
      date: "2026-02-09",
      rating: 5,
      content: "酒店位置很好，就在陆家嘴核心区，步行可达地铁站和购物中心。房间宽敞舒适，床很软，设施齐全。服务人员态度热情，办理入住和退房都很快捷。早餐种类丰富，味道不错。"
    },
    {
      id: "302",
      userName: "陈先生",
      date: "2026-02-07",
      rating: 4,
      content: "商务出差选择了这家酒店，会议室条件很好，设备齐全。房间安静，适合工作和休息。酒店的餐饮服务也不错，尤其是西餐。唯一的小缺点是价格有点高，但考虑到位置和服务，还是值得的。"
    },
    {
      id: "303",
      userName: "张先生",
      date: "2026-02-04",
      rating: 5,
      content: "带家人来上海旅游，选择了这家酒店。房间宽敞，设施齐全，服务态度很好。酒店离东方明珠很近，步行就能到达。早餐种类丰富，适合全家人的口味。下次来上海还会选择这家酒店。"
    }
  ]
};

const cityHotSearchMock = {
  code: 200,
  data: [
    "外滩",
    "南京路",
    "陆家嘴",
    "迪士尼",
    "新天地",
    "静安寺",
    "徐家汇",
    "五角场"
  ]
};

const cityHotelRankingsMock = {
  code: 200,
  data: {
    luxuryHotels: [
      { name: "上海外滩华尔道夫酒店", desc: "奢华体验，江景绝佳" },
      { name: "上海浦东香格里拉大酒店", desc: "豪华商务，交通便利" },
      { name: "上海和平饭店", desc: "历史悠久，文化底蕴" },
      { name: "上海浦东丽思卡尔顿酒店", desc: "高端奢华，服务一流" },
      { name: "上海柏悦酒店", desc: "现代简约，高空景观" }
    ],
    familyHotels: [
      { name: "上海迪士尼乐园酒店", desc: "迪士尼主题，亲子友好" },
      { name: "上海玩具总动员酒店", desc: "玩具主题，适合儿童" },
      { name: "上海浦东嘉里大酒店", desc: "儿童俱乐部，设施齐全" },
      { name: "上海外滩W酒店", desc: "时尚设计，家庭套房" },
      { name: "上海环球港凯悦酒店", desc: "购物便利，亲子设施" }
    ]
  }
};

export const getCityHotSearch = (cityName: string) => {
  return Promise.resolve(cityHotSearchMock);
};

export const getCityHotelRankings = (cityName: string) => {
  return Promise.resolve(cityHotelRankingsMock);
};

export const getHotelDetail = (id: string) => {
  const hotelData = id === "1" ? hotelDetailMock1 : hotelDetailMock2;
  return Promise.resolve({ code: 200, data: hotelData });
};

export const getHotelList = (params: any) => {
  return Promise.resolve({
    code: 200,
    data: {
      list: [hotelDetailMock1, hotelDetailMock2],
      total: 2,
      page: params.page,
      pageSize: params.pageSize
    }
  });
};
