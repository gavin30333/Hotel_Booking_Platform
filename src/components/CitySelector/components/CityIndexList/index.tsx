import React from 'react';
import { View } from '@tarojs/components';
import { IndexBar, List } from 'antd-mobile';
import { CityGroup } from '../../types';
import './CityIndexList.less';

interface CityIndexListProps {
  groups: CityGroup[];
  onSelect: (city: string) => void;
  children?: React.ReactNode; // For Top sections like History/Hot
}

export const CityIndexList: React.FC<CityIndexListProps> = ({ groups, onSelect, children }) => {
  return (
    <View className='city-index-list' style={{ height: '100%' }}>
      <IndexBar>
        {children && (
           <IndexBar.Panel index='热门' title='热门'>
             {children}
           </IndexBar.Panel>
        )}
        
        {groups.map((group) => (
          <IndexBar.Panel
            key={group.title}
            index={group.title}
            title={group.title}
          >
            <List>
              {group.items.map((city) => (
                <List.Item key={city} onClick={() => onSelect(city)}>
                  {city}
                </List.Item>
              ))}
            </List>
          </IndexBar.Panel>
        ))}
      </IndexBar>
    </View>
  );
};
