import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import { List } from 'antd-mobile';
import { CityGroup } from '../../types';
import './CityIndexList.less';

interface CityIndexListProps {
  groups: CityGroup[];
  onSelect: (city: string) => void;
  children?: React.ReactNode;
}

export const CityIndexList: React.FC<CityIndexListProps> = ({ groups, onSelect, children }) => {
  const [activeIndex, setActiveIndex] = useState<string>('');
  
  // Calculate sidebar items: "热门" if children exists, then group titles
  const sidebarItems = [
    ...(children ? ['热门'] : []),
    ...groups.map(g => g.title)
  ];

  const scrollToAnchor = (index: string) => {
    // 1. Find the anchor element
    const id = `anchor-${index}`;
    const element = document.getElementById(id);
    // 2. Find the scroll container
    const container = document.querySelector('.city-selector-body');
    
    if (element && container) {
      // 3. Calculate offset
      // We want the element to be at the top of the container, minus some header height if needed
      // The container scrolls, so we set container.scrollTop
      // element.offsetTop is relative to the closest positioned ancestor.
      // We need element's position relative to the container's content top.
      
      // A simpler way is scrollIntoView, but we need to account for sticky header height (approx 42px for Tabs header)
      // element.scrollIntoView() might put it behind the sticky header.
      
      const headerHeight = 42; // Height of sticky tab header
      const top = element.offsetTop - headerHeight;
      
      container.scrollTo({
        top: top,
        behavior: 'auto' // Instant jump is usually better for index bars
      });
      
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.city-selector-body');
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const headerHeight = 44; // Approx offset
      
      // Find the current active anchor
      // Iterate backwards to find the last one that is above the scroll line
      for (let i = sidebarItems.length - 1; i >= 0; i--) {
        const index = sidebarItems[i];
        const element = document.getElementById(`anchor-${index}`);
        if (element) {
          if (element.offsetTop - headerHeight <= scrollTop + 10) { // +10 buffer
            setActiveIndex(index);
            return;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sidebarItems]);

  return (
    <View className='city-index-list'>
      <View className='city-list-content'>
        {children && (
          <View id='anchor-热门'>
             <View className='city-group-title'>热门城市</View>
             {children}
          </View>
        )}
        
        {groups.map((group) => (
          <View key={group.title} id={`anchor-${group.title}`}>
            <View className='city-group-title'>{group.title}</View>
            <List>
              {group.items.map((city) => (
                <List.Item key={city} onClick={() => onSelect(city)}>
                  {city}
                </List.Item>
              ))}
            </List>
          </View>
        ))}
      </View>

      <View className='city-sidebar'>
        {sidebarItems.map((item) => (
          <View 
            key={item} 
            className={`sidebar-item ${activeIndex === item ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              scrollToAnchor(item);
            }}
          >
            <Text>{item === '热门' ? '热' : item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
