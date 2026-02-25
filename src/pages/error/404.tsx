import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from 'antd-mobile'
import './error.less'

export default function NotFoundPage() {
  const handleGoHome = () => {
    Taro.reLaunch({ url: '/pages/search/index' })
  }

  const handleGoBack = () => {
    Taro.navigateBack({
      fail: () => {
        Taro.reLaunch({ url: '/pages/search/index' })
      },
    })
  }

  return (
    <View className="error-page">
      <View className="error-content">
        <View className="error-icon">
          <Text className="error-code">404</Text>
        </View>
        <Text className="error-title">页面不存在</Text>
        <Text className="error-desc">抱歉，您访问的页面不存在或已被删除</Text>
        <View className="error-actions">
          <Button className="action-btn primary" onClick={handleGoHome}>
            返回首页
          </Button>
          <Button className="action-btn secondary" onClick={handleGoBack}>
            返回上一页
          </Button>
        </View>
      </View>
    </View>
  )
}
