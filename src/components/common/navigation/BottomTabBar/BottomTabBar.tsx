import { TabBar } from 'antd-mobile'
import {
  FireFill,
  GiftOutline,
  FileOutline,
  ArrowDownCircleOutline,
  UnorderedListOutline,
} from 'antd-mobile-icons'
import Taro from '@tarojs/taro'

interface BottomTabBarProps {
  activeKey: string
}

export default function BottomTabBar({ activeKey }: BottomTabBarProps) {
  const tabs = [
    {
      key: 'recommend',
      title: '首页',
      icon: (active: boolean) =>
        active ? <FireFill /> : <ArrowDownCircleOutline />,
    },
    {
      key: 'favorite',
      title: '收藏',
      icon: <GiftOutline />,
    },
    {
      key: 'order',
      title: '订单',
      icon: <UnorderedListOutline />,
    },
    {
      key: 'profile',
      title: '我的',
      icon: <FileOutline />,
    },
  ]

  const handleTabChange = (key: string) => {
    switch (key) {
      case 'recommend':
        Taro.redirectTo({ url: '/pages/search/index' })
        break
      case 'favorite':
        Taro.redirectTo({ url: '/pages/favorite/index' })
        break
      case 'order':
        Taro.redirectTo({ url: '/pages/order/index' })
        break
      case 'profile':
        Taro.redirectTo({ url: '/pages/profile/index' })
        break
      default:
        break
    }
  }

  return (
    <TabBar
      className="bottom-tab-bar"
      activeKey={activeKey}
      onChange={handleTabChange}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
