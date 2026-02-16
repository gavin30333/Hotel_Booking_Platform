import React from 'react';
import { View, Text } from '@tarojs/components';
import { MessageOutline } from 'antd-mobile-icons';
import './index.less';

interface BottomBarProps {
  price: number;
}

const BottomBar: React.FC<BottomBarProps> = ({ price }) => {
  return (
    <View className="bottom-bar-container">
      <View className="left-section">
        <MessageOutline fontSize={20} />
        <Text className="ask-text">问酒店</Text>
      </View>
      <View className="center-section">
        <Text className="price-symbol">¥</Text>
        <Text className="price-value">{price}</Text>
        <Text className="price-suffix">起</Text>
      </View>
      <View className="right-section">
        <View className="booking-button">
          <Text className="button-text">查看房型</Text>
        </View>
      </View>
    </View>
  );
};

export default BottomBar;
