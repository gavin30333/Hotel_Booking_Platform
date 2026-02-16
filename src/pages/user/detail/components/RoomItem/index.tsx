import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { RoomType } from '../../types';
import './index.less';

interface RoomItemProps {
  data: RoomType;
}

const RoomItem: React.FC<RoomItemProps> = ({ data }) => {
  const { name, images, area, bedType, facilities, price, originalPrice, currency, breakfast } = data;
  
  // Construct features string
  const features = [area, bedType, breakfast].filter(Boolean).join(' | ');
  
  // Show first 3 tags max
  const tags = facilities.slice(0, 3);

  return (
    <View className="room-item">
      <View className="room-item-left">
        <Image 
          className="room-image" 
          src={images[0] || ''} 
          mode="aspectFill" 
        />
      </View>
      
      <View className="room-item-middle">
        <View>
          <View className="room-name">{name}</View>
          <View className="room-features">{features}</View>
        </View>
        <View className="room-tags">
          {tags.map((tag, index) => (
            <Text key={index} className="tag">{tag}</Text>
          ))}
        </View>
      </View>
      
      <View className="room-item-right">
        <View className="price-container">
          {originalPrice && (
            <Text className="original-price">
              {currency}{originalPrice}
            </Text>
          )}
          <View className="current-price">
            <Text className="currency">{currency}</Text>
            <Text className="amount">{price}</Text>
          </View>
        </View>
        <View className="book-btn">查看房型</View>
      </View>
    </View>
  );
};

export default RoomItem;
