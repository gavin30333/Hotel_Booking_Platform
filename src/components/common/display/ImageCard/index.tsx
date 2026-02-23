import React from 'react'
import { View, Image } from '@tarojs/components'
import './ImageCard.less'

interface ImageCardProps {
  imageUrl?: string
  title: string
  subTitle?: string
  tag?: string
  width?: string | number
  height?: string | number
  onClick?: () => void
}

export const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  title,
  subTitle,
  tag,
  width = '100%',
  height = 100,
  onClick,
}) => {
  return (
    <View className="image-card" style={{ width, height }} onClick={onClick}>
      {imageUrl && (
        <Image src={imageUrl} className="card-image" mode="aspectFill" />
      )}

      {tag && <View className="card-tag">{tag}</View>}

      <View className="card-overlay">
        <View className="card-title">{title}</View>
        {subTitle && <View className="card-subtitle">{subTitle}</View>}
      </View>
    </View>
  )
}
