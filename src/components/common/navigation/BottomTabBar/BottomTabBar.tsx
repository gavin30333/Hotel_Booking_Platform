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
        Taro.switchTab({ url: '/search' })
        break
      case 'favorite':
        Taro.switchTab({ url: '/favorite' })
        break
      case 'order':
        Taro.switchTab({ url: '/order' })
        break
      case 'profile':
        Taro.switchTab({ url: '/profile' })
        break
      default:
        break
    }
  }

  return (
    <TabBar
      className="bottom-tab-bar"
      defaultActiveKey={activeKey}
      onChange={handleTabChange}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
