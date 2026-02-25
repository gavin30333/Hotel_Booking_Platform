import mongoose from 'mongoose'
import { CityHotSearchModel } from '../src/schemas/cityHotSearch.schema'

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management'

interface HotSearchItemData {
  name: string
  rank: number
  score?: string
  price?: number
  description?: string
  imageUrl?: string
  tags?: string[]
}

interface RankingListData {
  title: string
  type: 'luxury' | 'family' | 'business' | 'romantic' | 'budget' | 'custom'
  items: HotSearchItemData[]
}

interface CityHotSearchData {
  city: string
  cityCode?: string
  hotTags: string[]
  rankingLists: RankingListData[]
  isActive: boolean
  priority: number
}

const cityHotSearchData: CityHotSearchData[] = [
  {
    city: '成都',
    cityCode: 'CD',
    hotTags: [
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
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '青城山六善酒店',
            rank: 1,
            score: '4.7分',
            description: '主打绿色环保理念，设施完备',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['温泉', '山景', 'SPA'],
          },
          {
            name: '成都博舍酒店',
            rank: 2,
            score: '4.8分',
            description: '环绕大慈寺而建的静谧奢华之所',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['太古里', '设计感', '米其林'],
          },
          {
            name: '成都尼依格罗酒店',
            rank: 3,
            score: '4.7分',
            description: '国际设计作品，鸟瞰成都时尚地标',
            imageUrl:
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
            tags: ['IFS', '高空', '网红'],
          },
          {
            name: '成都华尔道夫酒店',
            rank: 4,
            score: '4.8分',
            description: '落地窗尽览双子塔夜景，享米其林餐厅',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['高新', '米其林', '下午茶'],
          },
          {
            name: '成都W酒店',
            rank: 5,
            score: '4.7分',
            description: '饱览天府双塔交子之环独有夜景',
            imageUrl:
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
            tags: ['潮流', '夜生活', '酒吧'],
          },
        ],
      },
      {
        title: '亲子乐园榜',
        type: 'family',
        items: [
          {
            name: '成都海昌极地海洋公园酒店',
            rank: 1,
            score: '4.7分',
            description: '极地主题客房，与海洋动物亲密接触',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['海洋公园', '亲子', '主题房'],
          },
          {
            name: '成都欢乐谷主题酒店',
            rank: 2,
            score: '4.6分',
            description: '紧邻欢乐谷，畅玩主题乐园',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['欢乐谷', '主题', '家庭'],
          },
          {
            name: '青城山亲子度假酒店',
            rank: 3,
            score: '4.7分',
            description: '天然氧吧，儿童乐园设施齐全',
            imageUrl:
              'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500&q=80',
            tags: ['青城山', '自然', '儿童乐园'],
          },
        ],
      },
      {
        title: '商务出行榜',
        type: 'business',
        items: [
          {
            name: '成都香格里拉大酒店',
            rank: 1,
            score: '4.6分',
            description: '市中心商务首选，会议设施完善',
            imageUrl:
              'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&q=80',
            tags: ['商务', '会议', '市中心'],
          },
          {
            name: '成都世纪城天堂洲际大饭店',
            rank: 2,
            score: '4.5分',
            description: '会展中心旁，商务出行便利',
            imageUrl:
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
            tags: ['会展', '商务', '大型会议'],
          },
          {
            name: '成都希尔顿酒店',
            rank: 3,
            score: '4.5分',
            description: '高新区核心位置，商务设施齐全',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['高新', '商务', '健身房'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 1,
  },
  {
    city: '北京',
    cityCode: 'BJ',
    hotTags: [
      '天安门/故宫',
      '三里屯',
      '国贸CBD',
      '王府井',
      '北京首都国际机场',
      '北京大兴国际机场',
      '颐和园',
      '中关村',
      '西单',
      '什刹海',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '北京王府井文华东方酒店',
            rank: 1,
            score: '4.9分',
            description: '俯瞰紫禁城，顶级奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['故宫', '奢华', '景观'],
          },
          {
            name: '北京瑰丽酒店',
            rank: 2,
            score: '4.8分',
            description: '艺术与奢华的完美融合',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['艺术', '设计', '高端'],
          },
          {
            name: '北京柏悦酒店',
            rank: 3,
            score: '4.7分',
            description: '国贸核心，云端俯瞰京城',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['国贸', '高空', '商务'],
          },
          {
            name: '北京华尔道夫酒店',
            rank: 4,
            score: '4.8分',
            description: '百年传奇，王府井核心位置',
            imageUrl:
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
            tags: ['王府井', '历史', '经典'],
          },
        ],
      },
      {
        title: '亲子乐园榜',
        type: 'family',
        items: [
          {
            name: '北京环球影城大酒店',
            rank: 1,
            score: '4.8分',
            description: '环球影城主题，亲子游玩首选',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['环球影城', '主题', '亲子'],
          },
          {
            name: '北京欢乐谷玛雅海滩酒店',
            rank: 2,
            score: '4.6分',
            description: '水乐园主题，夏日亲子好去处',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['欢乐谷', '水上乐园', '家庭'],
          },
        ],
      },
      {
        title: '商务出行榜',
        type: 'business',
        items: [
          {
            name: '北京国贸大酒店',
            rank: 1,
            score: '4.6分',
            description: 'CBD核心，商务会议首选',
            imageUrl:
              'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&q=80',
            tags: ['CBD', '商务', '会议'],
          },
          {
            name: '北京金融街洲际酒店',
            rank: 2,
            score: '4.5分',
            description: '金融核心区，高端商务配套',
            imageUrl:
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
            tags: ['金融街', '商务', '高端'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 2,
  },
  {
    city: '上海',
    cityCode: 'SH',
    hotTags: [
      '外滩',
      '陆家嘴',
      '南京路步行街',
      '迪士尼',
      '浦东国际机场',
      '虹桥机场',
      '静安寺',
      '新天地',
      '淮海路',
      '人民广场',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '上海外滩华尔道夫酒店',
            rank: 1,
            score: '4.9分',
            description: '外滩百年建筑，经典与奢华并存',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['外滩', '历史', '经典'],
          },
          {
            name: '上海半岛酒店',
            rank: 2,
            score: '4.8分',
            description: '外滩核心，顶级下午茶体验',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['外滩', '下午茶', '奢华'],
          },
          {
            name: '上海浦东丽思卡尔顿酒店',
            rank: 3,
            score: '4.8分',
            description: '陆家嘴云端，俯瞰浦江两岸',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['陆家嘴', '高空', '景观'],
          },
          {
            name: '上海宝格丽酒店',
            rank: 4,
            score: '4.9分',
            description: '意大利奢华品牌，艺术与时尚融合',
            imageUrl:
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
            tags: ['艺术', '时尚', '奢华'],
          },
        ],
      },
      {
        title: '亲子乐园榜',
        type: 'family',
        items: [
          {
            name: '上海迪士尼乐园酒店',
            rank: 1,
            score: '4.8分',
            description: '迪士尼主题，童话世界体验',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['迪士尼', '主题', '亲子'],
          },
          {
            name: '上海玩具总动员酒店',
            rank: 2,
            score: '4.7分',
            description: '皮克斯主题，亲子互动乐趣多',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['迪士尼', '皮克斯', '家庭'],
          },
        ],
      },
      {
        title: '商务出行榜',
        type: 'business',
        items: [
          {
            name: '上海静安香格里拉大酒店',
            rank: 1,
            score: '4.6分',
            description: '静安核心，商务会议首选',
            imageUrl:
              'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&q=80',
            tags: ['静安', '商务', '会议'],
          },
          {
            name: '上海浦东香格里拉大酒店',
            rank: 2,
            score: '4.5分',
            description: '陆家嘴核心，高端商务配套',
            imageUrl:
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
            tags: ['陆家嘴', '商务', '高端'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 3,
  },
  {
    city: '广州',
    cityCode: 'GZ',
    hotTags: [
      '珠江新城',
      '北京路步行街',
      '白云国际机场',
      '广州塔',
      '天河城',
      '长隆野生动物世界',
      '沙面',
      '上下九',
      '琶洲会展中心',
      '越秀公园',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '广州四季酒店',
            rank: 1,
            score: '4.8分',
            description: '珠江新城地标，云端俯瞰羊城',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['珠江新城', '高空', '景观'],
          },
          {
            name: '广州文华东方酒店',
            rank: 2,
            score: '4.7分',
            description: '太古汇核心，东方美学典范',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['太古汇', '设计', '奢华'],
          },
          {
            name: '广州柏悦酒店',
            rank: 3,
            score: '4.7分',
            description: '珠江新城核心，现代奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['珠江新城', '现代', '商务'],
          },
        ],
      },
      {
        title: '亲子乐园榜',
        type: 'family',
        items: [
          {
            name: '广州长隆酒店',
            rank: 1,
            score: '4.8分',
            description: '野生动物园主题，亲子游玩首选',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['长隆', '野生动物', '亲子'],
          },
          {
            name: '广州长隆熊猫酒店',
            rank: 2,
            score: '4.7分',
            description: '熊猫主题，萌趣亲子体验',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['长隆', '熊猫', '主题'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 4,
  },
  {
    city: '深圳',
    cityCode: 'SZ',
    hotTags: [
      '华强北',
      '世界之窗',
      '深圳湾',
      '福田CBD',
      '宝安国际机场',
      '欢乐海岸',
      '大梅沙',
      '东门老街',
      '蛇口',
      '南山科技园',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '深圳柏悦酒店',
            rank: 1,
            score: '4.8分',
            description: '福田CBD核心，现代奢华典范',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['福田', '现代', '奢华'],
          },
          {
            name: '深圳四季酒店',
            rank: 2,
            score: '4.7分',
            description: '深圳湾畔，海景与城市景观兼得',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['深圳湾', '海景', '商务'],
          },
          {
            name: '深圳华侨城洲际大酒店',
            rank: 3,
            score: '4.6分',
            description: '华侨城核心，休闲度假首选',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['华侨城', '度假', '休闲'],
          },
        ],
      },
      {
        title: '商务出行榜',
        type: 'business',
        items: [
          {
            name: '深圳福田香格里拉大酒店',
            rank: 1,
            score: '4.6分',
            description: '福田CBD核心，商务会议首选',
            imageUrl:
              'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&q=80',
            tags: ['福田', '商务', '会议'],
          },
          {
            name: '深圳南山万豪酒店',
            rank: 2,
            score: '4.5分',
            description: '南山科技园旁，商务出行便利',
            imageUrl:
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
            tags: ['南山', '科技园', '商务'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 5,
  },
  {
    city: '杭州',
    cityCode: 'HZ',
    hotTags: [
      '西湖',
      '灵隐寺',
      '西溪湿地',
      '萧山国际机场',
      '河坊街',
      '宋城',
      '龙井村',
      '千岛湖',
      '武林广场',
      '钱江新城',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '杭州西子湖四季酒店',
            rank: 1,
            score: '4.9分',
            description: '西湖畔江南园林，顶级奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['西湖', '园林', '奢华'],
          },
          {
            name: '杭州法云安缦',
            rank: 2,
            score: '4.9分',
            description: '灵隐寺旁古村落，禅意奢华',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['灵隐', '禅意', '隐世'],
          },
          {
            name: '杭州柏悦酒店',
            rank: 3,
            score: '4.7分',
            description: '钱江新城核心，俯瞰钱塘江',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['钱江新城', '高空', '现代'],
          },
        ],
      },
      {
        title: '浪漫度假榜',
        type: 'romantic',
        items: [
          {
            name: '杭州西湖国宾馆',
            rank: 1,
            score: '4.8分',
            description: '西湖核心，国宾级服务体验',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['西湖', '国宾', '经典'],
          },
          {
            name: '杭州悦榕庄',
            rank: 2,
            score: '4.7分',
            description: '西溪湿地旁，浪漫度假首选',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['西溪', '浪漫', '度假'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 6,
  },
  {
    city: '三亚',
    cityCode: 'SY',
    hotTags: [
      '亚龙湾',
      '海棠湾',
      '三亚湾',
      '大东海',
      '凤凰国际机场',
      '蜈支洲岛',
      '天涯海角',
      '南山寺',
      '免税店',
      '鹿回头',
    ],
    rankingLists: [
      {
        title: '奢华度假榜',
        type: 'luxury',
        items: [
          {
            name: '三亚亚特兰蒂斯酒店',
            rank: 1,
            score: '4.8分',
            description: '海棠湾地标，水上乐园与奢华并存',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['海棠湾', '水上乐园', '亲子'],
          },
          {
            name: '三亚保利瑰丽酒店',
            rank: 2,
            score: '4.8分',
            description: '海棠湾核心，无边泳池网红打卡',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['海棠湾', '无边泳池', '网红'],
          },
          {
            name: '三亚亚龙湾丽思卡尔顿酒店',
            rank: 3,
            score: '4.7分',
            description: '亚龙湾核心，私人沙滩奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['亚龙湾', '私人沙滩', '奢华'],
          },
          {
            name: '三亚艾迪逊酒店',
            rank: 4,
            score: '4.8分',
            description: '设计感十足，时尚度假首选',
            imageUrl:
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
            tags: ['设计', '时尚', '度假'],
          },
        ],
      },
      {
        title: '亲子乐园榜',
        type: 'family',
        items: [
          {
            name: '三亚亚特兰蒂斯酒店',
            rank: 1,
            score: '4.8分',
            description: '水族馆+水上乐园，亲子天堂',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['水族馆', '水上乐园', '亲子'],
          },
          {
            name: '三亚Club Med度假村',
            rank: 2,
            score: '4.7分',
            description: '一价全包，亲子活动丰富',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['一价全包', '亲子活动', '度假'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 7,
  },
  {
    city: '西安',
    cityCode: 'XA',
    hotTags: [
      '钟楼/鼓楼',
      '大雁塔',
      '回民街',
      '兵马俑',
      '咸阳国际机场',
      '华清池',
      '大唐不夜城',
      '城墙',
      '小雁塔',
      '陕西历史博物馆',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '西安W酒店',
            rank: 1,
            score: '4.7分',
            description: '曲江新区核心，潮流与历史碰撞',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['曲江', '潮流', '设计'],
          },
          {
            name: '西安丽思卡尔顿酒店',
            rank: 2,
            score: '4.8分',
            description: '高新核心，古都奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['高新', '奢华', '商务'],
          },
          {
            name: '西安索菲特传奇酒店',
            rank: 3,
            score: '4.7分',
            description: '历史建筑改造，传奇体验',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['历史', '传奇', '经典'],
          },
        ],
      },
      {
        title: '文化体验榜',
        type: 'custom',
        items: [
          {
            name: '西安大唐芙蓉园酒店',
            rank: 1,
            score: '4.6分',
            description: '大唐风格，沉浸式文化体验',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['大唐', '文化', '主题'],
          },
          {
            name: '西安华清池温泉酒店',
            rank: 2,
            score: '4.5分',
            description: '皇家温泉，历史与养生结合',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['温泉', '历史', '养生'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 8,
  },
  {
    city: '南京',
    cityCode: 'NJ',
    hotTags: [
      '夫子庙',
      '中山陵',
      '总统府',
      '玄武湖',
      '禄口国际机场',
      '新街口',
      '明孝陵',
      '秦淮河',
      '南京南站',
      '紫金山',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '南京圣和府华酒店',
            rank: 1,
            score: '4.8分',
            description: '长江路核心，民国风情奢华',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['民国', '奢华', '历史'],
          },
          {
            name: '南京金鹰世界G酒店',
            rank: 2,
            score: '4.7分',
            description: '河西核心，现代奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['河西', '现代', '奢华'],
          },
          {
            name: '南京香格里拉大酒店',
            rank: 3,
            score: '4.6分',
            description: '新街口核心，商务休闲首选',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['新街口', '商务', '休闲'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 9,
  },
  {
    city: '重庆',
    cityCode: 'CQ',
    hotTags: [
      '解放碑',
      '洪崖洞',
      '江北国际机场',
      '磁器口',
      '长江索道',
      '南滨路',
      '观音桥',
      '武隆天坑',
      '大足石刻',
      '朝天门',
    ],
    rankingLists: [
      {
        title: '奢华酒店榜',
        type: 'luxury',
        items: [
          {
            name: '重庆来福士洲际酒店',
            rank: 1,
            score: '4.8分',
            description: '来福士核心，俯瞰两江交汇',
            imageUrl:
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
            tags: ['来福士', '两江', '高空'],
          },
          {
            name: '重庆尼依格罗酒店',
            rank: 2,
            score: '4.7分',
            description: '国金中心核心，山城奢华体验',
            imageUrl:
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            tags: ['国金', '山城', '奢华'],
          },
          {
            name: '重庆解放碑威斯汀酒店',
            rank: 3,
            score: '4.6分',
            description: '解放碑核心，网红打卡首选',
            imageUrl:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
            tags: ['解放碑', '网红', '打卡'],
          },
        ],
      },
      {
        title: '网红打卡榜',
        type: 'custom',
        items: [
          {
            name: '重庆洪崖洞酒店',
            rank: 1,
            score: '4.5分',
            description: '洪崖洞旁，夜景绝佳',
            imageUrl:
              'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80',
            tags: ['洪崖洞', '夜景', '网红'],
          },
          {
            name: '重庆南滨路江景酒店',
            rank: 2,
            score: '4.4分',
            description: '南滨路核心，两江夜景尽收眼底',
            imageUrl:
              'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=500&q=80',
            tags: ['南滨路', '江景', '夜景'],
          },
        ],
      },
    ],
    isActive: true,
    priority: 10,
  },
]

async function seedCityHotSearch() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB successfully')

    console.log('Clearing existing data...')
    await CityHotSearchModel.deleteMany({})
    console.log('Existing data cleared')

    console.log('Inserting new data...')
    const result = await CityHotSearchModel.insertMany(cityHotSearchData)
    console.log(
      `Successfully inserted ${result.length} city hot search records`
    )

    console.log('\nInserted cities:')
    result.forEach((item) => {
      console.log(
        `  - ${item.city} (${item.hotTags.length} tags, ${item.rankingLists.length} ranking lists)`
      )
    })

    await mongoose.disconnect()
    console.log('\nDatabase connection closed')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedCityHotSearch()
