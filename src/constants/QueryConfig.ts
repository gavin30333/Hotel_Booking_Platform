import { SceneConfig, TabType } from '../types/query.types';

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
        props: { showIcon: true }
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        required: true
      },
      {
        type: 'guest',
        key: 'guests',
        label: '人数',
        props: { showPriceFilter: true, priceLabel: '价格/星级' }
      },
      {
        type: 'tags',
        key: 'tags',
        props: {
          items: ['迪士尼', '双床房', '南京路步行街', '外滩']
        }
      }
    ]
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
        props: { isInternational: true }
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        required: true
      },
      {
        type: 'guest',
        key: 'guests',
        label: '人数',
        props: { showPriceFilter: true, priceLabel: '价格/钻级', isInternational: true }
      },
      {
        type: 'tags',
        key: 'tags',
        props: {
          items: ['KSPO DOME', '明洞', '双床房', '江南区']
        }
      }
    ],
    specialFeatures: [
      {
        type: 'notice',
        content: '海外酒店按人数收费，请准确选择成人和儿童数',
        style: 'blue'
      },
      {
        type: 'guarantee',
        content: '安心出境游 入住保障·7x24h客服·应急支援',
        style: 'green'
      }
    ]
  },
  [TabType.HOMESTAY]: {
    key: TabType.HOMESTAY,
    label: '民宿',
    fields: [
      {
        type: 'location',
        key: 'location',
        label: '城市',
        placeholder: '关键词/位置',
        props: { showSettings: false }
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        required: true
      },
      {
        type: 'guest',
        key: 'guests',
        label: '人数',
        props: { customText: '人/床/居数不限', isHomestay: true }
      },
      {
        type: 'tags',
        key: 'tags',
        props: {
          items: ['今夜特价', '积分当钱花', '私汤', '天安门广场']
        }
      }
    ]
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
        props: { showSettings: false }
      },
      {
        type: 'date',
        key: 'dates',
        label: '日期',
        props: { singleDay: true }
      }
    ],
    specialFeatures: [
      {
        type: 'notice',
        content: '当前定位获取失败，请重新尝试获取',
        style: 'gray'
      }
    ]
  }
};
