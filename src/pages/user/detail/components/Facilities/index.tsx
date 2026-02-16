import React from 'react';
import { View, Text } from '@tarojs/components';
import { AppOutline } from 'antd-mobile-icons';
import { Facility } from '../../types';
import './index.less';

interface Props {
  items: Facility[];
}

const Facilities: React.FC<Props> = ({ items }) => {
  return (
    <View className="facilities-container">
      <View className="scroll-view">
        <View className="scroll-content">
          {items.map((item) => (
            <View key={item.id} className="facility-item">
              <View className="icon">
                {/* Use a placeholder icon as requested */}
                <AppOutline fontSize={24} color="#333" />
              </View>
              <Text className="name">{item.name}</Text>
            </View>
          ))}
          
          <View className="more-link">
            <Text className="text">Facilities/Policy &gt;</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Facilities;
