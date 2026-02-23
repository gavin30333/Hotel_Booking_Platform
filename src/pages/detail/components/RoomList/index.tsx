import { View } from '@tarojs/components'
import RoomItem from '../RoomItem'
import { Room } from '../../types'
import './RoomList.less'

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
