import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { List, ListImperativeAPI, RowComponentProps } from 'react-window'
import { View, Text } from '@tarojs/components'
import HotelCard from '@/components/common/display/HotelCard'
import { Hotel } from '@/services/hotel'
import './VirtualHotelList.less'

interface VirtualHotelListProps {
  hotelList: Hotel[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  error: string | null
}

interface RowProps {
  hotelList: Hotel[]
}

const ITEM_HEIGHT = 196
const LOAD_MORE_THRESHOLD = 3

function RowComponent({
  index,
  style,
  hotelList,
}: RowComponentProps<RowProps>) {
  const hotel = hotelList[index]
  if (!hotel) return null

  return (
    <View style={style} className="virtual-list-item">
      <HotelCard hotel={hotel} />
    </View>
  )
}

export default function VirtualHotelList({
  hotelList,
  loading,
  hasMore,
  onLoadMore,
  error,
}: VirtualHotelListProps) {
  const listRef = useRef<ListImperativeAPI | null>(null)
  const [listHeight, setListHeight] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(loading)
  const hasMoreRef = useRef(hasMore)

  useEffect(() => {
    loadingRef.current = loading
    hasMoreRef.current = hasMore
  }, [loading, hasMore])

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setListHeight(rect.height || 600)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  useEffect(() => {
    if (listRef.current && listRef.current.element) {
      listRef.current.element.scrollTop = 0
    }
  }, [hotelList.length > 0 ? hotelList[0]?.id : null])

  const handleRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      if (loadingRef.current || !hasMoreRef.current) return
      if (hotelList.length === 0) return

      const { stopIndex } = visibleRows
      const remainingItems = hotelList.length - stopIndex

      if (remainingItems <= LOAD_MORE_THRESHOLD) {
        onLoadMore()
      }
    },
    [hotelList.length, onLoadMore]
  )

  const rowProps = useMemo<RowProps>(() => ({ hotelList }), [hotelList])

  const listStyle = useMemo(
    () => ({
      height: listHeight,
      width: '100%',
    }),
    [listHeight]
  )

  return (
    <View ref={containerRef as any} className="virtual-hotel-list">
      <List
        key={hotelList.length > 0 ? hotelList[0]?.id : 'empty'}
        listRef={listRef}
        rowComponent={RowComponent}
        rowProps={rowProps}
        rowCount={hotelList.length}
        rowHeight={ITEM_HEIGHT}
        style={listStyle}
        overscanCount={3}
        onRowsRendered={handleRowsRendered}
      />
      {error && (
        <View className="virtual-list-error">
          <Text className="error-text">{error}</Text>
        </View>
      )}
    </View>
  )
}
