import { View } from '@tarojs/components'
import RoomItem from '../RoomItem'
import { Room } from '../../types'
import './RoomList.less'

interface RoomListProps {
  rooms: Room[]
  roomCount: number
  onBookNow: (index: number, breakfastCount?: number) => void
  onRoomCountChange?: (count: number) => void
  hotelImages: string[]
  datePriceMainHeight?: number
  fixedRoomIndex?: number
  onExpandChange?: (index: number, isExpanded: boolean) => void
}

export default function RoomList({
  rooms,
  roomCount,
  onBookNow,
  onRoomCountChange,
  hotelImages,
  datePriceMainHeight = 0,
  fixedRoomIndex,
  onExpandChange,
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
          onRoomCountChange={onRoomCountChange}
          hotelImages={hotelImages}
          topOffset={datePriceMainHeight}
          isFixed={fixedRoomIndex === index}
          onExpandChange={onExpandChange}
        />
      ))}
    </View>
  )
}
