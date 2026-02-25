import { View } from '@tarojs/components'
import { SpinLoading } from 'antd-mobile'
import './LoadingSpinner.less'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  color?: 'primary' | 'white' | 'default'
  fullscreen?: boolean
  text?: string
}

export default function LoadingSpinner({
  size = 'default',
  color = 'primary',
  fullscreen = false,
  text,
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 18,
    default: 24,
    large: 32,
  }

  const content = (
    <View className={`loading-spinner ${color}`}>
      <SpinLoading
        style={{ '--size': `${sizeMap[size]}px` }}
        color={color === 'white' ? 'white' : 'currentColor'}
      />
      {text && <View className="loading-text">{text}</View>}
    </View>
  )

  if (fullscreen) {
    return <View className="loading-fullscreen">{content}</View>
  }

  return content
}
