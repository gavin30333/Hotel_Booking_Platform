import { View } from '@tarojs/components'
import RoomItem from './RoomItem'

interface Room {
  id?: string
  _id?: string
  name?: string
  roomTypeName?: string
  description?: string
  bedType?: string
  area?: number
  maxOccupancy?: number
  breakfast?: boolean
  price?: number
  currentPrice?: number
  originalPrice?: number
  images?: string[]
}

interface RoomListProps {
  rooms: Room[]
  roomCount: number
  onBookNow: (index: number) => void
  hotelImages: string[]
}

export default function RoomList({
  rooms,
  roomCount,
  onBookNow,
  hotelImages,
}: RoomListProps) {
  return (
    <View className="rooms-section">
      {rooms.map((room, index) => (
        <RoomItem
          key={room.id || room._id || index}
          room={room}
          index={index}
          roomCount={roomCount}
          onBookNow={onBookNow}
          hotelImages={hotelImages}
        />
      ))}
    </View>
  )
}
