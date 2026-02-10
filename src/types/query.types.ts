export enum TabType {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
  HOMESTAY = 'homestay',
  HOURLY = 'hourly'
}

export type FieldType = 'location' | 'date' | 'guest' | 'tags';

export interface FieldConfig {
  type: FieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  key: string; // Key to map in formData
  props?: Record<string, any>;
}

export interface SpecialFeature {
  type: 'notice' | 'guarantee' | 'entry';
  content: string;
  icon?: string;
  style?: 'blue' | 'green' | 'gray';
}

export interface ThemeConfig {
  primaryColor?: string;
  activeColor?: string;
}

export interface SceneConfig {
  key: TabType;
  label: string;
  fields: FieldConfig[];
  specialFeatures?: SpecialFeature[];
}

export interface LocationData {
  city: string;
  district?: string;
  country?: string;
}

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  nights: number;
}

export interface GuestInfo {
  rooms: number | number[];
  adults: number | number[];
  children: number | number[];
  childAges?: number[];
  priceStar?: {
    minPrice?: number;
    maxPrice?: number;
    starRatings?: string[];
    /**
     * 是否包含税费
     * @description 控制价格展示是否包含税费及服务费
     * @scene 仅在 {@link TabType.INTERNATIONAL} 海外酒店场景下有效
     * @value true - 展示含税价
     * @value false - 展示不含税价
     * @value undefined - 国内场景或未设置（默认处理）
     */
    isTaxIncluded?: boolean;
  };
}

export interface SearchParams {
  scene: TabType;
  location: LocationData;
  dates: DateRange;
  guests?: GuestInfo;
  tags?: string[];
  keyword?: string; // For homestay/hourly
}
