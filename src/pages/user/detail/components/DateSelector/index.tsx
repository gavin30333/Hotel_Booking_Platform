import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.less';

interface DateSelectorProps {
  checkIn: string;
  checkOut: string;
  nights: number;
  guestInfo: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  checkIn,
  checkOut,
  nights,
  guestInfo,
}) => {
  return (
    <View className="date-selector">
      <View className="left-part">
        <View className="row-labels">
          <Text className="label">今天</Text>
          <Text className="label">明天</Text>
        </View>
        <View className="row-dates">
          <Text className="date">{checkIn}</Text>
          <Text className="separator">-</Text>
          <Text className="date">{checkOut}</Text>
          <View className="nights-tag">
            <Text>共{nights}晚</Text>
          </View>
        </View>
      </View>
      <View className="divider" />
      <View className="right-part">
        <Text>{guestInfo}</Text>
      </View>
    </View>
  );
};

export default DateSelector;
