import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { Popup, Button, Slider, Selector } from 'antd-mobile';
import { GuestInfo } from '@/types/query.types';
import './PriceStarSelectionPopup.less';

interface Props {
  visible: boolean;
  onClose: () => void;
  value: GuestInfo;
  onChange: (val: GuestInfo) => void;
}

const STAR_OPTIONS = [
  { label: '2钻/星及以下', value: '2', description: '经济' },
  { label: '3钻/星', value: '3', description: '舒适' },
  { label: '4钻/星', value: '4', description: '高档' },
  { label: '5钻/星', value: '5', description: '豪华' },
  { label: '金钻酒店', value: 'gold', description: '奢华体验' },
  { label: '铂钻酒店', value: 'platinum', description: '超奢品质' },
];

const PRICE_PRESETS = [
  { label: '¥150以下', min: 0, max: 150 },
  { label: '¥150-¥250', min: 150, max: 250 },
  { label: '¥250-¥300', min: 250, max: 300 },
  { label: '¥300-¥350', min: 300, max: 350 },
  { label: '¥350-¥500', min: 350, max: 500 },
  { label: '¥500-¥700', min: 500, max: 700 },
  { label: '¥700-¥900', min: 700, max: 900 },
  { label: '¥900以上', min: 900, max: 10000 },
];

export const PriceStarSelectionPopup: React.FC<Props> = ({
  visible,
  onClose,
  value,
  onChange,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      const ps = value.priceStar || {};
      setPriceRange([ps.minPrice ?? 0, ps.maxPrice ?? 1000]);
      setSelectedStars(ps.starRatings || []);
    }
  }, [visible, value]);

  const handleConfirm = () => {
    onChange({
      ...value,
      priceStar: {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        starRatings: selectedStars,
      }
    });
    onClose();
  };

  const handleClear = () => {
    setPriceRange([0, 1000]);
    setSelectedStars([]);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
    >
      <View className='price-popup-container'>
        <View className='popup-header'>
          <View className='close-icon' onClick={onClose}>×</View>
          <Text className='title'>选择价格/星级</Text>
          <View className='placeholder' />
        </View>

        <View className='popup-content'>
          {/* Price Section */}
          <View className='section'>
            <Text className='section-title'>价格</Text>
            <View className='price-display'>
              <Text>¥{priceRange[0]}</Text>
              <Text>-</Text>
              <Text>¥{priceRange[1] >= 10000 ? '不限' : priceRange[1]}</Text>
            </View>
            <View className='slider-container'>
              <Slider
                range
                min={0}
                max={1000}
                step={50}
                value={[priceRange[0], Math.min(priceRange[1], 1000)]}
                onChange={(val) => {
                  const [min, max] = val as [number, number];
                  setPriceRange([min, max === 1000 ? 10000 : max]);
                }}
              />
            </View>
            <View className='presets-grid'>
              {PRICE_PRESETS.map((preset, idx) => (
                <View 
                  key={idx} 
                  className='preset-item'
                  onClick={() => setPriceRange([preset.min, preset.max])}
                >
                  <Text>{preset.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Star Rating Section */}
          <View className='section'>
            <View className='section-header'>
              <Text className='section-title'>星级/钻级</Text>
              <Text className='link'>国内星级/钻级说明 &gt;</Text>
            </View>
            <Selector
              columns={3}
              multiple
              options={STAR_OPTIONS}
              value={selectedStars}
              onChange={v => setSelectedStars(v)}
              style={{ '--gap': '8px' }}
            />
          </View>
        </View>

        <View className='popup-footer'>
          <Button className='clear-btn' onClick={handleClear}>
            清空
          </Button>
          <Button className='confirm-btn' color='primary' onClick={handleConfirm}>
            完成
          </Button>
        </View>
      </View>
    </Popup>
  );
};
