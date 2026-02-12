import React, { useState, useRef } from 'react';
import { View } from '@tarojs/components';
import { Popup, Tabs } from 'antd-mobile';
import { useThrottleFn } from 'ahooks';
import { SearchHeader } from './components/SearchHeader';
import { HistorySection } from './components/HistorySection';
import { LocationStatus } from './components/LocationStatus';
import { DomesticTab } from './components/TabContent/DomesticTab';
import { OverseasTab } from './components/TabContent/OverseasTab';
import { HotSearchTab } from './components/TabContent/HotSearchTab';
import { 
  historyCities, 
  hotCities, 
  domesticCities
} from './utils/cityData';
import { CityTab } from './types';
import './CitySelector.less';

export * from './types';

interface CitySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
  currentCity?: string;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ 
  visible, 
  onClose, 
  onSelect,
  currentCity 
}) => {
  const [activeTab, setActiveTab] = useState<CityTab>('domestic');
  const [isSticky, setIsSticky] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const handleSelect = (city: string) => {
    onSelect(city);
    onClose();
  };

  const { run: handleScroll } = useThrottleFn(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.target as HTMLDivElement;
      const scrollTop = container.scrollTop;
      const headerHeight = headerRef.current?.clientHeight || 0;
      
      // When scrollTop reaches header height, tabs header becomes sticky
      // We add a small buffer (e.g., 2px) to ensure smooth transition
      const stickyState = scrollTop >= headerHeight - 2;
      
      if (stickyState !== isSticky) {
        setIsSticky(stickyState);
      }
    },
    { wait: 16 } // ~60fps
  );

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh' }}
      destroyOnClose
      className='city-selector-popup'
    >
      <SearchHeader 
        onCancel={onClose}
      />
      
      <div 
        className='city-selector-body' 
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <div ref={headerRef} className='city-selector-header'>
          <LocationStatus status='disabled' />
          <HistorySection 
            cities={historyCities} 
            onSelect={handleSelect} 
            onClear={() => console.log('Clear history')} 
          />
          <View className='header-divider' />
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key as CityTab)}
          className='city-tabs'
        >
          <Tabs.Tab title='国内(含港澳台)' key='domestic'>
            <DomesticTab 
              groups={domesticCities} 
              hotCities={hotCities} 
              currentCity={currentCity}
              onSelect={handleSelect}
              scrollRef={scrollRef} // This ref might need adjustment if DomesticTab needs its own scroll control
              scrollEnabled={isSticky}
            />
          </Tabs.Tab>
          <Tabs.Tab title='海外' key='overseas'>
            <OverseasTab 
              onSelect={handleSelect} 
              scrollEnabled={isSticky}
            />
          </Tabs.Tab>
          <Tabs.Tab title='成都热搜' key='hot_search'>
            <HotSearchTab onSelect={handleSelect} />
          </Tabs.Tab>
        </Tabs>
      </div>
    </Popup>
  );
};
