import React, { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { RoomType } from '../../types';
import RoomItem from '../RoomItem';
import './index.less';

interface RoomListProps {
  rooms: RoomType[];
}

const FILTERS = ["江河景房", "双床房", "大床房", "含早餐"];

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  const [activeFilter, setActiveFilter] = useState<string>('');

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? '' : filter);
  };

  return (
    <View className="room-list">
      <ScrollView 
        scrollX 
        className="filter-tags"
        showScrollbar={false}
      >
        <View className="filter-scroll-content">
          {FILTERS.map((filter) => (
            <View 
              key={filter} 
              className={`filter-tag ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View className="list-content">
        {rooms.map((room) => (
          <RoomItem key={room.id} data={room} />
        ))}
      </View>
    </View>
  );
};

export default RoomList;
