import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import { DownOutline } from 'antd-mobile-icons';
import { FieldConfig, GuestInfo } from '@/types/query.types';
import { GuestSelectionPopup } from './components/GuestSelectionPopup';
import { HomestayGuestSelectionPopup } from './components/HomestayGuestSelectionPopup';
import { PriceStarSelectionPopup } from './components/PriceStarSelectionPopup';
import './GuestField.less';

interface GuestFieldProps {
  config: FieldConfig;
  value: GuestInfo;
  onChange: (value: GuestInfo) => void;
}

export const GuestField: React.FC<GuestFieldProps> = ({ config, value, onChange }) => {
  const { customText, priceLabel, isHomestay, isInternational } = config.props || {};
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showPricePopup, setShowPricePopup] = useState(false);

  // Helper to format homestay selection text
  const getHomestayText = () => {
    // Helper function to format a list of numbers (with sorting and grouping)
    const formatNumberList = (val: number | number[], suffix: string) => {
      const arr = Array.isArray(val) ? val : [val];
      if (arr.length === 0) return ''; // Empty return for empty selection

      const sorted = [...arr].sort((a, b) => a - b);
      const parts: string[] = [];
      let start = sorted[0];
      let prev = sorted[0];

      const pushRange = (s: number, e: number) => {
        if (s === e) {
          if (s === 100) parts.push('自定义');
          else parts.push(`${s}${suffix}`);
        } else {
           if (s === 100) parts.push('自定义');
           else if (e === 100) {
              parts.push(`${s}${suffix}`);
              parts.push('自定义');
           } else {
              parts.push(`${s}-${e}${suffix}`);
           }
        }
      };

      for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        if (current === prev + 1 && current !== 100 && prev !== 100) {
          prev = current;
        } else {
          pushRange(start, prev);
          start = current;
          prev = current;
        }
      }
      pushRange(start, prev);

      return parts.join(',');
    };

    const adultsText = formatNumberList(value.adults, '人');
    const childrenText = formatNumberList(value.children, '床');
    const roomsText = formatNumberList(value.rooms, '居');

    const parts = [adultsText, childrenText, roomsText].filter(p => p !== '');
    if (parts.length === 0) return ''; // Return empty string if no selections
    return parts.join(' ');
  };

  const displayText = useMemo(() => {
    if (isHomestay) {
       const text = getHomestayText();
       // If text is empty, show default placeholder "人/床/居数不限"
       if (!text) return customText || '人/床/居数不限';
       return text;
    }
    return customText;
  }, [value, isHomestay, customText]);

  const isPlaceholder = isHomestay && (!getHomestayText());

  return (
    <View className='field-row guest-field'>
      {isHomestay ? (
        <>
          <Text
            className={`custom-text ${isPlaceholder ? 'placeholder' : ''}`}
            onClick={() => setShowGuestPopup(true)}
          >
             {displayText}
          </Text>
          <HomestayGuestSelectionPopup
            visible={showGuestPopup}
            onClose={() => setShowGuestPopup(false)}
            value={value}
            onChange={onChange}
          />
        </>
      ) : customText ? (
        <>
          <Text className='custom-text' onClick={() => setShowGuestPopup(true)}>{customText}</Text>
          <GuestSelectionPopup
            visible={showGuestPopup}
            onClose={() => setShowGuestPopup(false)}
            value={value}
            onChange={onChange}
          />
        </>
      ) : (
        <View className='guest-content'>
           <View className='guest-info' onClick={() => setShowGuestPopup(true)}>
             <Text className='info-text'>
                {value.rooms}间房 {value.adults}成人 {value.children}儿童
             </Text>
             <DownOutline fontSize={10} color='#333' />
           </View>


           {priceLabel && (
             <View className='price-info' onClick={() => setShowPricePopup(true)}>
               <View className='divider' />
               <Text className='price-text'>{priceLabel}</Text>
             </View>
           )}

           <GuestSelectionPopup
             visible={showGuestPopup}
             onClose={() => setShowGuestPopup(false)}
             value={value}
             onChange={onChange}
           />

           <PriceStarSelectionPopup
             visible={showPricePopup}
             onClose={() => setShowPricePopup(false)}
             value={value}
             onChange={onChange}
             isInternational={isInternational}
           />
        </View>
      )}
    </View>
  );
};
