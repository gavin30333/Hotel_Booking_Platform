import { useState, useCallback } from 'react';
import { TabType, SearchParams, LocationData, DateRange, GuestInfo } from '../types/query.types';

const DEFAULT_LOCATION: LocationData = {
  city: '上海',
  country: '中国'
};

const DEFAULT_DATES: DateRange = {
  startDate: '2026-02-01',
  endDate: '2026-02-02',
  nights: 1
};

const DEFAULT_GUESTS: GuestInfo = {
  rooms: 1,
  adults: 1,
  children: 0
};

export const useQueryForm = (initialTab: TabType = TabType.DOMESTIC) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [formData, setFormData] = useState<Partial<SearchParams>>({
    location: DEFAULT_LOCATION,
    dates: DEFAULT_DATES,
    guests: DEFAULT_GUESTS,
    tags: []
  });

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    // Logic to reset or adapt form data based on tab can go here
    // For now, we preserve location/dates as they might be relevant
    if (tab === TabType.HOURLY) {
      // Hourly usually implies same day
      setFormData(prev => ({
        ...prev,
        dates: { ...prev.dates!, nights: 0, endDate: prev.dates!.startDate }
      }));
    } else if (tab === TabType.INTERNATIONAL) {
        setFormData(prev => ({
            ...prev,
            location: { city: '首尔', country: '韩国' } // Demo data
        }));
    } else if (tab === TabType.HOMESTAY) {
         setFormData(prev => ({
            ...prev,
            location: { city: '北京', country: '中国' } // Demo data
        }));
    }
  }, []);

  const updateField = useCallback((key: keyof SearchParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    activeTab,
    formData,
    handleTabChange,
    updateField
  };
};
