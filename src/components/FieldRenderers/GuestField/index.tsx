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
  const { customText, priceLabel, isHomestay } = config.props || {};
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showPricePopup, setShowPricePopup] = useState(false);

  // Helper to format homestay selection text
  const getHomestayText = () => {
    // Helper function to format a list of numbers (with sorting and grouping)
    const formatNumberList = (val: number | number[], suffix: string) => {
      const arr = Array.isArray(val) ? val : [val];
      if (arr.length === 0) return `1${suffix}`; // Default fallback
      
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
              // Should not happen if 100 is sorted to end and treated separately, but just in case
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

    return `${adultsText} ${childrenText} ${roomsText}`;
  };

  const displayText = useMemo(() => {
    if (isHomestay) {
       // Check if user has made a selection? 
       // If value is default (1,1,1), maybe still show placeholder?
       // But user might explicitly want 1,1,1. 
       // Strategy: If customText is provided, use it as placeholder until changed?
       // But 'value' is controlled from outside. 
       // Let's assume if value matches default exactly AND we haven't touched it?
       // Hard to track "touched" here. 
       // Better approach: If customText is provided, show it initially?
       // Actually, the requirement is "after selection, update here".
       // So we should show formatted text always, UNLESS it's the very initial state?
       // Let's try to show formatted text. If it looks like default "1人 1床 1居", maybe that's fine?
       // Or compare with a "default" state if we want to show placeholder.
       
       // Let's assume we always show the dynamic text for Homestay if it's not the initial "empty" state.
       // But QueryConfig provides default values.
       // Let's toggle: if customText is present, use it ONLY if we think it's "unset".
       // But 'unset' is ambiguous.
       // Let's simply replace customText logic with dynamic text for Homestay 
       // and use customText as a fallback or label if needed.
       // Actually, the user wants the text to update.
       return getHomestayText();
    }
    return customText;
  }, [value, isHomestay, customText]);

  return (
    <View className='field-row guest-field'>
      {isHomestay ? (
        <>
          <Text className='custom-text' onClick={() => setShowGuestPopup(true)}>
             {/* If we have a placeholder-like customText and values are defaults, maybe show placeholder? 
                 Let's simply show the formatted text as requested. 
                 If the user wants "Placeholder" initially, we might need a flag. 
                 For now, displaying current value is the standard behavior for input fields. */}
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
           />
        </View>
      )}
    </View>
  );
};
