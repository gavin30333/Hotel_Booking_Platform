import { View } from '@tarojs/components'
import './Skeleton.less'

interface SkeletonProps {
  type?: 'hotel-card' | 'room-card' | 'text' | 'image' | 'custom'
  rows?: number
  avatar?: boolean
  animated?: boolean
}

export default function Skeleton({
  type = 'text',
  rows = 3,
  avatar = false,
  animated = true,
}: SkeletonProps) {
  const baseClass = animated ? 'skeleton animated' : 'skeleton'

  if (type === 'hotel-card') {
    return (
      <View className="skeleton-hotel-card">
        <View className={`${baseClass} skeleton-image`} />
        <View className="skeleton-content">
          <View className={`${baseClass} skeleton-title`} />
          <View className={`${baseClass} skeleton-text`} />
          <View className={`${baseClass} skeleton-text short`} />
          <View className="skeleton-footer">
            <View className={`${baseClass} skeleton-price`} />
            <View className={`${baseClass} skeleton-tag`} />
          </View>
        </View>
      </View>
    )
  }

  if (type === 'room-card') {
    return (
      <View className="skeleton-room-card">
        <View className={`${baseClass} skeleton-room-image`} />
        <View className="skeleton-room-content">
          <View className={`${baseClass} skeleton-title`} />
          <View className={`${baseClass} skeleton-text`} />
          <View className="skeleton-room-footer">
            <View className={`${baseClass} skeleton-price`} />
            <View className={`${baseClass} skeleton-button`} />
          </View>
        </View>
      </View>
    )
  }

  if (type === 'image') {
    return <View className={`${baseClass} skeleton-image-full`} />
  }

  return (
    <View className="skeleton-text-block">
      {avatar && <View className={`${baseClass} skeleton-avatar`} />}
      <View className="skeleton-lines">
        {Array.from({ length: rows }).map((_, index) => (
          <View
            key={index}
            className={`${baseClass} skeleton-text ${index === rows - 1 ? 'short' : ''}`}
          />
        ))}
      </View>
    </View>
  )
}
