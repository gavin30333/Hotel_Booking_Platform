import React, { useState } from 'react';
import { View } from '@tarojs/components';
import { Popup, Tabs } from 'antd-mobile';
import { SearchHeader } from './components/SearchHeader';
import { HistorySection } from './components/HistorySection';
import { HotCitiesSection } from './components/HotCitiesSection';
import { CityIndexList } from './components/CityIndexList';
import { 
  historyCities, 
  hotCities, 
  domesticCities, 
  overseasCities, 
  overseasHotCities 
} from './utils/cityData';
import { CityTab } from './types';
import './CitySelector.less';

export * from './types';

interface CitySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ visible, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState<CityTab>('domestic');
  const [searchText, setSearchText] = useState('');

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
        <HistorySection 
          cities={historyCities} 
          onSelect={handleSelect} 
          onClear={() => console.log('Clear history')} 
        />
        <HotCitiesSection 
          title='国内热门城市'
          cities={hotCities} 
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
        {/* Overseas might not have history or shared history */}
        <HotCitiesSection 
          title='海外热门城市'
          cities={overseasHotCities} 
          onSelect={handleSelect} 
        />
      </View>
    </CityIndexList>
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
      </Tabs>
    </Popup>
  );
};
