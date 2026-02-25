import { SceneConfig, TabType } from '../types/query.types'

export const SCENE_CONFIGS: Record<TabType, SceneConfig> = {
  [TabType.DOMESTIC]: {
    key: TabType.DOMESTIC,
    label: '国内',
    fields: [
      {
        type: 'location',
        key: 'location',
        label: '地点',
        placeholder: '位置/品牌/酒店',
        props: { showIcon: true },
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        required: true,
      },
      {
        type: 'guest',
        key: 'guests',
        label: '人数',
        props: { priceLabel: '价格/星级' },
      },
      {
        type: 'tags',
        key: 'tags',
        props: {
          items: ['迪士尼', '双床房', '南京路步行街', '外滩'],
        },
      },
    ],
    specialFeatures: [
      {
        type: 'notice',
        content: '超级会员专享价，预订立省¥30',
        style: 'blue',
      },
      {
        type: 'guarantee',
        content: '安心订 · 入住前免费取消',
        style: 'green',
      },
    ],
  },
  [TabType.INTERNATIONAL]: {
    key: TabType.INTERNATIONAL,
    label: '海外',
    fields: [
      {
        type: 'location',
        key: 'location',
        label: '国家/城市',
        placeholder: '位置/品牌/酒店',
        props: { showIcon: true },
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        required: true,
      },
      {
        type: 'guest',
        key: 'guests',
        label: '人数',
        props: { priceLabel: '价格/星级', isInternational: true },
      },
      {
        type: 'tags',
        key: 'tags',
        props: {
          items: ['KSPO DOME', '明洞', '双床房', '江南区'],
        },
      },
    ],
    specialFeatures: [
      {
        type: 'notice',
        content: '海外酒店特惠，最高立减500',
        style: 'blue',
      },
    ],
  },
  [TabType.HOMESTAY]: {
    key: TabType.HOMESTAY,
    label: '民宿',
    fields: [
      {
        type: 'location',
        key: 'location',
        label: '地点',
        placeholder: '位置/品牌/民宿',
        props: { showIcon: true },
      },
      {
        type: 'guest',
        key: 'guests',
        label: '人数',
        props: { customText: '人/床/居数不限', isHomestay: true },
      },
      {
        type: 'tags',
        key: 'tags',
        props: {
          items: ['今夜特价', '积分当钱花', '私汤', '天安门广场'],
        },
      },
    ],
  },
  [TabType.HOURLY]: {
    key: TabType.HOURLY,
    label: '钟点房',
    fields: [
      {
        type: 'location',
        key: 'location',
        label: '城市',
        placeholder: '位置/品牌/酒店',
        props: { showSettings: false },
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        props: { singleDay: true },
      },
    ],
  },
}
