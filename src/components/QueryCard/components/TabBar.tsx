import React from 'react';
import { View, Text } from '@tarojs/components';
import { TabType } from '@/types/query.types';
import classNames from 'classnames';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS = [
  { key: TabType.DOMESTIC, label: '国内' },
  { key: TabType.INTERNATIONAL, label: '海外' },
  { key: TabType.HOMESTAY, label: '民宿' },
  { key: TabType.HOURLY, label: '钟点房' },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className='tab-bar'>
      {TABS.map((tab) => (
        <View
          key={tab.key}
          className={classNames('tab-item', { active: activeTab === tab.key })}
          onClick={() => onTabChange(tab.key)}
        >
          <Text>{tab.label}</Text>
        </View>
      ))}
    </View>
  );
};
