import React from 'react';
import { View, Text } from '@tarojs/components';
import { EnvironmentOutline } from 'antd-mobile-icons';
import './index.less';

interface MapEntryProps {
  address: string;
  distance: string;
}

const MapEntry: React.FC<MapEntryProps> = ({ address, distance }) => {
  return (
    <View className="map-entry-container">
      <View className="map-entry-left">
        <Text className="address-text">{address}</Text>
        <Text className="distance-text">{distance}</Text>
      </View>
      <View className="divider" />
      <View className="map-entry-right">
        <EnvironmentOutline fontSize={18} color="#0086F6" />
        <Text className="map-text">地图</Text>
      </View>
    </View>
  );
};

export default MapEntry;
