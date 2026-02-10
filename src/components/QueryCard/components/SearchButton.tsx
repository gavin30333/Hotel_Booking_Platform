import React from 'react';
import { Button } from 'antd-mobile';
import { View } from '@tarojs/components';

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <View className='search-btn-container'>
      <Button
        block
        type='submit'
        className='search-btn'
        onClick={onClick}
      >
        查询
      </Button>
    </View>
  );
};
