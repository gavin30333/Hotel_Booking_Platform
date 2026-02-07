import React from 'react';
import { View, Text } from '@tarojs/components';
import { FieldConfig } from '@/types/query.types';
import './TagField.less';

interface TagFieldProps {
  config: FieldConfig;
}

export const TagField: React.FC<TagFieldProps> = ({ config }) => {
  const items = config.props?.items || [];

  return (
    <View className='field-row tag-field'>
      {items.map((item: string, index: number) => (
        <View 
          key={index}
          className='tag-item'
        >
          <Text className='tag-text'>{item}</Text>
        </View>
      ))}
    </View>
  );
};
