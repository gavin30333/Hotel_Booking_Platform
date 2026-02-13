import React, { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { Grid } from 'antd-mobile';
import { useThrottleFn } from 'ahooks';
import { RegionSidebar } from './components/RegionSidebar';
import { ImageCard } from '../../common/ImageCard';
import { CityTag } from '../../common/CityTag';
import { overseasCategories } from '../../../utils/overseasData';
import './OverseasTab.less';

interface OverseasTabProps {
  onSelect: (city: string) => void;
  scrollEnabled?: boolean;
}

export const OverseasTab: React.FC<OverseasTabProps> = ({ 
  onSelect,
  scrollEnabled = true 
}) => {
  const [activeKey, setActiveKey] = useState<string>(overseasCategories[0].key);
  const mainElementRef = useRef<HTMLDivElement>(null);

  const { run: handleScroll } = useThrottleFn(
    () => {
      let currentKey = overseasCategories[0].key;
      for (const item of overseasCategories) {
        const element = document.getElementById(`anchor-${item.key}`);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        // Check if the top of the element is near the top of the viewport
        if (rect.top <= 100) { 
          currentKey = item.key;
        } else {
          break;
        }
      }
      setActiveKey(currentKey);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  );

  useEffect(() => {
    const mainElement = mainElementRef.current;
    if (!mainElement) return;
    
    // Only attach listener if scrolling is enabled, or keep it attached but conditionally run logic?
    // Actually, we want to update the sidebar even if we are not scrolling *manually* but content moves.
    // But if scrollEnabled is false, the content shouldn't move anyway (except programmatically).
    mainElement.addEventListener('scroll', handleScroll);
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, []); // Re-attach if scrollEnabled changes? Not strictly needed if CSS controls overflow

  const handleSideBarChange = (key: string) => {
    const element = document.getElementById(`anchor-${key}`);
    if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        setActiveKey(key); 
    }
  };

  return (
    <View className='overseas-tab'>
      <View className='sidebar-container'>
        <RegionSidebar 
          categories={overseasCategories} 
          activeKey={activeKey} 
          onChange={handleSideBarChange} 
        />
      </View>
      
      {/* Use div to ensure ref works correctly with DOM API as per example */}
      <div 
        className='content-container' 
        ref={mainElementRef}
        style={{ overflowY: scrollEnabled ? 'auto' : 'hidden' }}
      >
        {overseasCategories.map(category => (
            <View key={category.key} className='category-content'>
              <div id={`anchor-${category.key}`}>
                <Text className='category-title'>{category.subTitle || category.title}</Text>
                
                {category.hotDestinations && (
                    <View className='hot-destinations-grid'>
                    <Grid columns={2} gap={8}>
                        {category.hotDestinations.map((city, index) => (
                        <Grid.Item key={index} onClick={() => onSelect(city.name)}>
                            <ImageCard 
                            title={city.name}
                            subTitle={city.description}
                            imageUrl={city.imageUrl}
                            tag={city.tag}
                            height={100}
                            />
                        </Grid.Item>
                        ))}
                    </Grid>
                    </View>
                )}
                
                {category.cities && (
                    <View className='cities-list-section'>
                    {category.hotDestinations && <View className='divider' />} 
                    <View className='cities-tags'>
                        {category.cities.map((city, index) => (
                        <CityTag 
                            key={index} 
                            text={city.tag ? `${city.name} ${city.tag}` : city.name} 
                            onClick={() => onSelect(city.name)} 
                        />
                        ))}
                    </View>
                    </View>
                )}
              </div>
            </View>
        ))}
      </div>
    </View>
  );
};
