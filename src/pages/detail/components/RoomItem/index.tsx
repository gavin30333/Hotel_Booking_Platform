import { View, Text, Image } from '@tarojs/components'
import { Room } from '../../types'
import { DEFAULT_HOTEL_IMAGE } from '../../constants'
import './RoomItem.less'

interface RoomItemProps {
  room: Room
  index: number
  roomCount: number
  onBookNow: (index: number) => void
  hotelImages: string[]
}

export default function RoomItem({
  room,
  index,
  roomCount,
  onBookNow,
  hotelImages,
}: RoomItemProps) {
  return (
    <View key={room.id || room._id || index} className="room-item">
      <View className="room-image">
        <Image
          src={
            room.images?.[0] ||
            hotelImages[0] ||
            DEFAULT_HOTEL_IMAGE
          }
          mode="aspectFill"
          className="room-img"
        />
        {index === 0 && (
          <View className="sales-tag">
            <Text className="sales-tag-text">本店销量No.1</Text>
          </View>
        )}
      </View>
      <View className="room-info">
        <Text className="room-name">
          {room.name || room.roomTypeName}
        </Text>
        <Text className="room-description">
          {room.description || '舒适温馨的客房'}
        </Text>
        <Text className="room-detail">
          {room.bedType || '大床'} {room.area || 30}㎡{' '}
          {room.maxOccupancy || 2}人入住
        </Text>
        <Text className="room-notice">
          {room.breakfast ? '含早餐' : '无早餐'}{' '}
          入住当天18:00前可免费取消
        </Text>
        <View className="room-bottom">
          <View className="room-price">
            {room.originalPrice && (
              <Text className="price-original">
                ¥{room.originalPrice}
              </Text>
            )}
            <Text className="price-current">
              ¥{room.price || room.currentPrice}
            </Text>
          </View>
          <View className="room-booking">
            <View className="room-count">
              <Text className="count-text">{roomCount}间</Text>
              <Text className="count-arrow">▼</Text>
            </View>
            <View
              className="book-btn"
              onClick={() => onBookNow(index)}
            >
              <Text className="book-btn-text">订</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
