import React, { useEffect, useState } from 'react';
import { View, Text, ITouchEvent } from '@tarojs/components';
import { List } from 'antd-mobile';
import { CityGroup } from '../../../../../types';
import './CityIndexList.less';

interface CityIndexListProps {
  groups: CityGroup[];
  onSelect: (city: string) => void;
  children?: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const CityIndexList: React.FC<CityIndexListProps> = ({ groups, onSelect, children, scrollRef }) => {
  const [activeIndex, setActiveIndex] = useState<string>('');
  
  // Calculate sidebar items: "热门" if children exists, then group titles
  const sidebarItems = [
    ...(children ? ['热门'] : []),
    ...groups.map(g => g.title)
  ];

  const getHeaderHeight = () => {
    const tabsHeader = document.querySelector('.adm-tabs-header');
    return tabsHeader ? tabsHeader.clientHeight : 44;
  };

  const scrollToAnchor = (index: string) => {
    // 1. Find the anchor element
    const id = `anchor-${index}`;
    const element = document.getElementById(id);
    // 2. Use the ref for container
    const container = scrollRef.current;
    
    if (element && container) {
      const headerHeight = getHeaderHeight();
      
      // Calculate absolute offset in scroll container
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = elementRect.top - containerRect.top + container.scrollTop;
      
      const top = offset - headerHeight;
      
      container.scrollTo({
        top: top,
        behavior: 'auto'
      });
      
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const headerHeight = getHeaderHeight();
      const containerRect = container.getBoundingClientRect();
      
      // Find the current active anchor
      for (let i = sidebarItems.length - 1; i >= 0; i--) {
        const index = sidebarItems[i];
        const element = document.getElementById(`anchor-${index}`);
        if (element) {
          const elementRect = element.getBoundingClientRect();
          // Calculate relative top position of element in container
          const relativeTop = elementRect.top - containerRect.top;
          
          // Check if element is near the sticky header position
          if (relativeTop <= headerHeight + 10) { 
            setActiveIndex(index);
            return;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sidebarItems, scrollRef]);

  // Touch sliding logic
  const handleTouchMove = (e: ITouchEvent) => {
    e.stopPropagation();
    
    // Get touch position
    const touch = e.touches[0];
    const clientY = touch.clientY;
    
    // Find element at this position
    const target = document.elementFromPoint(touch.clientX, clientY);
    if (!target) return;
    
    // Check if it's a sidebar item or inside one
    const sidebarItem = target.closest('.sidebar-item');
    if (sidebarItem) {
      const index = sidebarItem.getAttribute('data-index');
      if (index && index !== activeIndex) {
        scrollToAnchor(index);
      }
    }
  };

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

      <View 
        className='city-sidebar'
        onTouchStart={(e) => { e.stopPropagation(); }} 
        onTouchMove={handleTouchMove}
        onClick={(e) => e.stopPropagation()}
      >
        {sidebarItems.map((item) => (
          <View 
            key={item} 
            data-index={item}
            className={`sidebar-item ${activeIndex === item ? 'active' : ''}`}
            onClick={() => scrollToAnchor(item)}
          >
            <Text>{item === '热门' ? '热' : item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
