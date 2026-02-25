import { View, Text } from '@tarojs/components'
import { useState, useEffect, useRef } from 'react'
import { Image, Tag, Button } from 'antd-mobile'
import { DEFAULT_HOTEL_IMAGE } from '@/constants'
import { RoomCountPopup } from '@/components/common/popup'
import {
  DownOutline,
  UpOutline,
  GiftOutline,
  TravelOutline,
} from 'antd-mobile-icons'
import { Room } from '../../types'

import './RoomItem.less'

interface RoomItemProps {
  room: Room
  index: number
  roomCount: number
  onBookNow: (index: number, breakfastCount?: number) => void
  onRoomCountChange?: (count: number) => void
  hotelImages: string[]
}

export default function RoomItem({
  room,
  index,
  roomCount,
  onBookNow,
  onRoomCountChange,
  hotelImages,
}: RoomItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showRoomCountPopup, setShowRoomCountPopup] = useState(false)
  const roomCardId = `room-card-${index}`

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleRoomCountConfirm = (count: number) => {
    onRoomCountChange?.(count)
  }

  const basePrice = room.price || room.currentPrice || 300
  const breakfastPricePerPerson = 30

  const breakfastOptions = [
    {
      count: 0,
      label: '无早餐',
      cancellation: '入住当天18:00前可免费取消',
      benefits: [
        '免费筒骨鸡汤小馄饨（夜宵） 1份/天+1.5米以下儿童免费',
        '浦东国际机场和迪士尼接送服务 1份/天+免费延迟退房',
      ],
      tags: ['在线付', '立即确认'],
      discount: '4.0折',
      originalPrice: Math.round(basePrice * 2.5),
      currentPrice: basePrice,
      promotions: ['会员特惠', '浦东消费券'],
      discountCount: 4,
      discountAmount: Math.round(basePrice * 1.5),
    },
    {
      count: 1,
      label: '1份早餐',
      cancellation: '入住当天18:00前可免费取消',
      benefits: [
        '免费筒骨鸡汤小馄饨（夜宵） 1份/天+1.5米以下儿童免费',
        '浦东国际机场和迪士尼接送服务 1份/天+免费延迟退房',
      ],
      tags: ['在线付', '立即确认'],
      discount: '4.1折',
      originalPrice: Math.round((basePrice + breakfastPricePerPerson) * 2.5),
      currentPrice: basePrice + breakfastPricePerPerson,
      promotions: ['会员特惠', '浦东消费券'],
      discountCount: 4,
      discountAmount: Math.round((basePrice + breakfastPricePerPerson) * 1.5),
    },
    {
      count: 2,
      label: '2份早餐',
      cancellation: '入住当天18:00前可免费取消',
      benefits: [
        '免费筒骨鸡汤小馄饨（夜宵） 1份/天+1.5米以下儿童免费',
        '浦东国际机场和迪士尼接送服务 1份/天+免费延迟退房',
      ],
      tags: ['在线付', '立即确认'],
      discount: '4.3折',
      originalPrice: Math.round((basePrice + breakfastPricePerPerson * 2) * 2.5),
      currentPrice: basePrice + breakfastPricePerPerson * 2,
      promotions: ['会员特惠', '浦东消费券'],
      discountCount: 4,
      discountAmount: Math.round((basePrice + breakfastPricePerPerson * 2) * 1.5),
    },
  ]

  return (
    <>
      <View id={roomCardId} className="room-card" data-index={index}>
        <View className={`room-item${isExpanded ? ' expanded' : ''}`}>
          {index === 0 && (
            <View className="sales-tag">
              <Text className="sales-tag-text">本店销量No.1</Text>
            </View>
          )}
          <View className="room-image">
            <Image
              src={room.images?.[0] || hotelImages[0] || DEFAULT_HOTEL_IMAGE}
              fit="cover"
              className="room-img"
            />
          </View>
          <View className="room-info">
            <View className="room-name-row">
              <Text className="room-name">
                {room.name || room.roomTypeName}
              </Text>
              {room.breakfast && (
                <View className="toggle-btn" onClick={handleToggle}>
                  {isExpanded ? (
                    <UpOutline className="toggle-arrow up" />
                  ) : (
                    <DownOutline className="toggle-arrow" />
                  )}
                </View>
              )}
            </View>
            <Text className="room-description">
              {room.description || '舒适温馨的客房'}
            </Text>
            <Text className="room-detail">
              {room.bedType || '大床'} {room.area || 30}㎡{' '}
              {room.maxOccupancy || 2}人入住
            </Text>
            {!room.breakfast && (
              <>
                <Text className="room-notice">
                  无早餐 入住当天18:00前可免费取消
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
                    <View
                      className="room-count"
                      onClick={() => setShowRoomCountPopup(true)}
                    >
                      <Text className="count-text">{roomCount}间</Text>
                      <Text className="count-arrow">▼</Text>
                    </View>
                    <View
                      className="book-btn"
                      onClick={() => onBookNow(index, 0)}
                    >
                      <Text className="book-btn-text">订</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
            {room.breakfast && (
              <Text className="room-notice">
                含早餐 入住当天18:00前可免费取消
              </Text>
            )}
          </View>
        </View>
        {room.breakfast && isExpanded && (
          <View className="breakfast-options">
            {breakfastOptions.map((option) => (
              <View key={option.count} className="breakfast-option">
                <View className="option-content">
                  <View className="option-header">
                    <Text className="breakfast-option-text">
                      {option.label}
                    </Text>
                    <Text className="cancellation-text">
                      | {option.cancellation} &gt;
                    </Text>
                  </View>

                  <View className="benefits-list">
                    {option.benefits.map((benefit, idx) => (
                      <View key={idx} className="benefit-item">
                        {idx === 0 ? (
                          <GiftOutline className="benefit-icon" />
                        ) : (
                          <TravelOutline className="benefit-icon" />
                        )}
                        <Text className="benefit-text">{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  <View className="option-tags">
                    {option.tags.map((tag, idx) => (
                      <Tag key={idx} className="tag-item" color="default">
                        <Text className="tag-text">{tag}</Text>
                      </Tag>
                    ))}
                    <Tag className="discount-tag" color="warning">
                      <Text className="discount-text">{option.discount}</Text>
                    </Tag>
                  </View>

                  <View className="price-section">
                    <View className="price-info">
                      <Text className="price-original">
                        ¥{option.originalPrice}
                      </Text>
                      <Text className="price-current">
                        ¥{option.currentPrice}
                      </Text>
                    </View>
                    <View className="promotions-info">
                      {option.promotions.map((promo, idx) => (
                        <Text key={idx} className="promotion-text">
                          {promo}
                        </Text>
                      ))}
                      <Text className="discount-info">
                        {option.discountCount}项优惠{option.discountAmount} &gt;
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="option-booking">
                  <View className="room-booking">
                    <View
                      className="room-count"
                      onClick={() => setShowRoomCountPopup(true)}
                    >
                      <Text className="count-text">{roomCount}间</Text>
                      <Text className="count-arrow">▼</Text>
                    </View>
                    <Button
                      className="book-btn"
                      color="primary"
                      onClick={() => onBookNow(index, option.count)}
                    >
                      订
                    </Button>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <RoomCountPopup
        visible={showRoomCountPopup}
        onClose={() => setShowRoomCountPopup(false)}
        count={roomCount}
        onConfirm={handleRoomCountConfirm}
      />
    </>
  )
}
