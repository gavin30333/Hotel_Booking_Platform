import React from 'react';
import { View, Text } from '@tarojs/components';
import { DownOutline, CompassOutline, SearchOutline } from 'antd-mobile-icons';
import { FieldConfig, LocationData } from '@/types/query.types';
import './LocationField.less';

interface LocationFieldProps {
  config: FieldConfig;
  value: LocationData;
  onChange: (value: LocationData) => void;
}

export const LocationField: React.FC<LocationFieldProps> = ({ config, value }) => {
  const { props } = config;
  const isInternational = props?.isInternational;
  const showSettings = props?.showSettings;

  return (
    <View className='field-row location-field'>
      <View className='location-main'>
        <View className='city-section'>
          {isInternational && (
            <Text className='country-text'>
              {value.country || '国家'}
            </Text>
          )}
          <View className='city-wrapper'>
            <Text className='city-text'>
              {value.city}
            </Text>
            <DownOutline fontSize={12} color='#333' />
          </View>
        </View>
        
        <View className='divider' />
        
        <Text className='placeholder-text'>
          {config.placeholder}
        </Text>
      </View>

      <View className='location-icon'>
        {showSettings ? (
          <SearchOutline fontSize={20} color='#1890ff' />
        ) : (
          <CompassOutline fontSize={20} color='#1890ff' />
        )}
      </View>
    </View>
  );
};
