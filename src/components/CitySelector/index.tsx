import React, { useState } from 'react';
import { View } from '@tarojs/components';
import { Popup, Tabs, List } from 'antd-mobile';
import { SearchHeader } from './components/SearchHeader';
import { HistorySection } from './components/HistorySection';
import { HotCitiesSection } from './components/HotCitiesSection';
import { CityIndexList } from './components/CityIndexList';
import { LocationStatus } from './components/LocationStatus';
import { 
  historyCities, 
  hotCities, 
  domesticCities, 
  overseasCities, 
  overseasHotCities,
  hotSearchList
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
  const [searchText, setSearchText] = useState('');
  const bodyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [activeTab, visible]);

  const handleSelect = (city: string) => {
    onSelect(city);
    onClose();
  };

  const renderDomestic = () => (
    <CityIndexList 
      groups={domesticCities} 
      onSelect={handleSelect}
    >
      <View>
        <HotCitiesSection 
          title='国内热门城市'
          cities={hotCities} 
          selectedCity={currentCity}
          onSelect={handleSelect} 
        />
      </View>
    </CityIndexList>
  );

  const renderOverseas = () => (
    <CityIndexList 
      groups={overseasCities} 
      onSelect={handleSelect}
    >
      <View>
        <HotCitiesSection 
          title='海外热门城市'
          cities={overseasHotCities} 
          selectedCity={currentCity}
          onSelect={handleSelect} 
        />
      </View>
    </CityIndexList>
  );

  const renderHotSearch = () => (
    <View className='hot-search-list' style={{ height: '100%', overflow: 'auto' }}>
      <List header='成都热搜'>
        {hotSearchList.map(item => (
          <List.Item key={item} onClick={() => handleSelect(item)}>
            {item}
          </List.Item>
        ))}
      </List>
    </View>
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
        onSearch={(val) => setSearchText(val)}
        onCancel={onClose}
      />
      
      <View className='city-selector-body' ref={bodyRef}>
        <View className='city-selector-header'>
          <LocationStatus status='disabled' />
          <HistorySection 
            cities={historyCities} 
            onSelect={handleSelect} 
            onClear={() => console.log('Clear history')} 
          />
          <View className='header-divider' />
        </View>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key as CityTab)}
          className='city-tabs'
        >
          <Tabs.Tab title='国内(含港澳台)' key='domestic'>
            {renderDomestic()}
          </Tabs.Tab>
          <Tabs.Tab title='海外' key='overseas'>
            {renderOverseas()}
          </Tabs.Tab>
          <Tabs.Tab title='成都热搜' key='hot_search'>
            {renderHotSearch()}
          </Tabs.Tab>
        </Tabs>
      </View>
    </Popup>
  );
};
