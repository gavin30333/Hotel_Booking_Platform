import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.less';

interface HotelInfoProps {
  name: string;
  stars: string | number;
  tags: string[];
}

const HotelInfo: React.FC<HotelInfoProps> = ({ name, stars, tags }) => {
  return (
    <View className="hotel-info">
      <View className="hotel-info-header">
        <Text className="name">{name}</Text>
        <Text className="stars">{stars}</Text>
      </View>
      <View className="hotel-info-tags">
        {tags.map((tag, index) => (
          <Text key={index} className="tag">
            {tag}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default HotelInfo;
