import React, { useState, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import { DownOutline, CompassOutline, SearchOutline } from 'antd-mobile-icons';
import { FieldConfig, LocationData } from '@/types/query.types';
import { useLocation } from '@/hooks/useLocation';
import './LocationField.less';

interface LocationFieldProps {
  config: FieldConfig;
  value: LocationData;
  keyword?: string;
  onChange: (value: LocationData) => void;
}

export const LocationField: React.FC<LocationFieldProps> = ({ config, value, keyword, onChange }) => {
  const { props } = config;
  const isInternational = props?.isInternational;
  const showSettings = props?.showSettings;
  const [isLocating, setIsLocating] = useState(false);
  const { location, locateByIP, loading } = useLocation();
  const locationRef = useRef<LocationData | null>(null);

  React.useEffect(() => {
    if (location) {
      locationRef.current = location;
    }
  }, [location]);

  const handleLocationClick = async () => {
    if (isLocating || loading) return;

    setIsLocating(true);

    try {
      await locateByIP();

      setTimeout(() => {
        if (locationRef.current) {
          onChange({
            city: locationRef.current.city,
            country: locationRef.current.country,
            district: locationRef.current.district
          });
        }
        setIsLocating(false);
      }, 100);
    } catch (error) {
      console.error('定位失败:', error);
      setIsLocating(false);
    }
  };

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

        <Text className={`placeholder-text ${keyword ? 'active' : ''}`}>
          {keyword || config.placeholder}
        </Text>
      </View>

      <View
        className={`location-icon ${showSettings ? '' : 'clickable'} ${isLocating || loading ? 'rotating' : ''}`}
        onClick={!showSettings ? handleLocationClick : undefined}
      >
        {showSettings ? (
          <SearchOutline fontSize={20} color='#1890ff' />
        ) : (
          <CompassOutline fontSize={20} color='#1890ff' />
        )}
      </View>
    </View>
  );
};
