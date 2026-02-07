import React from 'react';
import { View, Text } from '@tarojs/components';
import { TabBar, FormFields, SearchButton } from './components';
import { useQueryForm } from '@/hooks/useQueryForm';
import { SCENE_CONFIGS } from '@/constants/QueryConfig';
import { TabType, SpecialFeature } from '@/types/query.types';
import { SoundOutline, SmileOutline } from 'antd-mobile-icons';
import './QueryCard.less';

interface QueryCardProps {
  defaultTab?: TabType;
  onSearch?: (data: any) => void;
}

export const QueryCard: React.FC<QueryCardProps> = ({ defaultTab = TabType.DOMESTIC, onSearch }) => {
  const { activeTab, formData, handleTabChange, updateField } = useQueryForm(defaultTab);
  
  const currentConfig = SCENE_CONFIGS[activeTab];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ ...formData, scene: activeTab });
    } else {
      console.log('Search:', { ...formData, scene: activeTab });
    }
  };

  const renderSpecialFeature = (feature: SpecialFeature, index: number) => {
    let Icon: React.ReactNode = null;
    if (feature.type === 'notice') Icon = <SoundOutline />;
    if (feature.type === 'guarantee') Icon = <SmileOutline />;

    return (
      <View key={index} className={`special-feature ${feature.style || 'gray'}`}>
        {Icon && <View className='icon'>{Icon}</View>}
        <Text>{feature.content}</Text>
      </View>
    );
  };

  return (
    <View className='query-card'>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <View className='card-content'>
        {currentConfig.specialFeatures?.filter(f => f.type === 'notice').map((f, i) => renderSpecialFeature(f, i))}

        <FormFields 
          fields={currentConfig.fields} 
          formData={formData} 
          onUpdate={updateField} 
        />

        <SearchButton onClick={handleSearch} />

        {currentConfig.specialFeatures?.filter(f => f.type === 'guarantee').map((f, i) => renderSpecialFeature(f, i))}
      </View>
    </View>
  );
};
