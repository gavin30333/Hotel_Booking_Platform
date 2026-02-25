import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from 'antd-mobile'
import './error.less'

export default function ServerErrorPage() {
  const handleGoHome = () => {
    Taro.reLaunch({ url: '/pages/search/index' })
  }

  const handleRefresh = () => {
    Taro.reLaunch({
      url: '/' + (Taro.getCurrentPages()[0]?.route || 'pages/search/index'),
    })
  }

  return (
    <View className="error-page">
      <View className="error-content">
        <View className="error-icon server-error">
          <Text className="error-code">500</Text>
        </View>
        <Text className="error-title">服务器错误</Text>
        <Text className="error-desc">抱歉，服务器出了点问题，请稍后再试</Text>
        <View className="error-actions">
          <Button className="action-btn primary" onClick={handleRefresh}>
            刷新页面
          </Button>
          <Button className="action-btn secondary" onClick={handleGoHome}>
            返回首页
          </Button>
        </View>
      </View>
    </View>
  )
}
