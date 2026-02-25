import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from 'antd-mobile'
import './error.less'

export default function ForbiddenPage() {
  const handleGoHome = () => {
    Taro.reLaunch({ url: '/pages/search/index' })
  }

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  return (
    <View className="error-page">
      <View className="error-content">
        <View className="error-icon forbidden">
          <Text className="error-code">403</Text>
        </View>
        <Text className="error-title">无访问权限</Text>
        <Text className="error-desc">抱歉，您没有权限访问此页面</Text>
        <View className="error-actions">
          <Button className="action-btn primary" onClick={handleLogin}>
            立即登录
          </Button>
          <Button className="action-btn secondary" onClick={handleGoHome}>
            返回首页
          </Button>
        </View>
      </View>
    </View>
  )
}
