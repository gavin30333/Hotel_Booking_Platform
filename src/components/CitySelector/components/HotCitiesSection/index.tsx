import React from 'react';
import { View, Text } from '@tarojs/components';
import { Grid } from 'antd-mobile';
import './HotCitiesSection.less';

interface HotCitiesSectionProps {
  title?: string;
  cities: string[];
  onSelect: (city: string) => void;
}

export const HotCitiesSection: React.FC<HotCitiesSectionProps> = ({ 
  title = '国内热门城市', 
  cities, 
  onSelect 
}) => {
  return (
    <View className='city-hot-section'>
      <Text className='section-title'>{title}</Text>
      <Grid columns={4} gap={10}>
        {cities.map((city) => (
          <Grid.Item key={city} onClick={() => onSelect(city)}>
            <View className='hot-city-item'>
              <Text className='hot-city-text'>{city}</Text>
            </View>
          </Grid.Item>
        ))}
      </Grid>
    </View>
  );
};
