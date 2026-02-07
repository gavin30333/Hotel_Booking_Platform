import React from 'react';
import { View, Text } from '@tarojs/components';
import { DownOutline } from 'antd-mobile-icons';
import { FieldConfig, GuestInfo } from '@/types/query.types';
import './GuestField.less';

interface GuestFieldProps {
  config: FieldConfig;
  value: GuestInfo;
  onChange: (value: GuestInfo) => void;
}

export const GuestField: React.FC<GuestFieldProps> = ({ config, value }) => {
  const { customText, priceLabel } = config.props || {};

  return (
    <View className='field-row guest-field'>
      {customText ? (
        <Text className='custom-text'>{customText}</Text>
      ) : (
        <View className='guest-content'>
           <View className='guest-info'>
             <Text className='info-text'>
                {value.rooms}间房 {value.adults}成人 {value.children}儿童
             </Text>
             <DownOutline fontSize={10} color='#333' />
           </View>
           
           {priceLabel && (
             <View className='price-info'>
               <View className='divider' />
               <Text className='price-text'>{priceLabel}</Text>
             </View>
           )}
        </View>
      )}
    </View>
  );
};
