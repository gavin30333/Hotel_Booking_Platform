import Taro from '@tarojs/taro';

const AMAP_KEY = '1f8c29198ea34251483deb8a7f0d4201';

export interface IPLocationResponse {
  status: string;
  info: string;
  infocode: string;
  province: string;
  city: string;
  adcode: string;
  rectangle: string;
}

export interface RegeoResponse {
  status: string;
  info: string;
  infocode: string;
  regeocode: {
    formatted_address: string;
    addressComponent: {
      country: string;
      province: string;
      city: string;
      citycode: string;
      district: string;
      adcode: string;
      township: string;
    };
  };
}

export interface LocationData {
  city: string;
  district?: string;
  country?: string;
  province?: string;
  adcode?: string;
}

export class AMapError extends Error {
  constructor(
    message: string,
    public code?: string,
    public info?: string
  ) {
    super(message);
    this.name = 'AMapError';
  }
}

export const amapService = {
  async getIPLocation(): Promise<LocationData> {
    try {
      const response = await Taro.request<IPLocationResponse>({
        url: 'https://restapi.amap.com/v3/ip',
        data: {
          key: AMAP_KEY
        },
        method: 'GET'
      });

      const { data } = response;

      if (data.status !== '1') {
        throw new AMapError(data.info, data.infocode, data.info);
      }

      return {
        city: data.city,
        country: '中国',
        province: data.province,
        adcode: data.adcode
      };
    } catch (error) {
      if (error instanceof AMapError) {
        throw error;
      }
      throw new AMapError('获取IP位置失败', 'NETWORK_ERROR', '网络请求失败');
    }
  },

  async reverseGeocode(location: { longitude: number; latitude: number }): Promise<LocationData> {
    try {
      const response = await Taro.request<RegeoResponse>({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data: {
          key: AMAP_KEY,
          location: `${location.longitude},${location.latitude}`,
          extensions: 'base'
        },
        method: 'GET'
      });

      const { data } = response;

      if (data.status !== '1') {
        throw new AMapError(data.info, data.infocode, data.info);
      }

      const { addressComponent } = data.regeocode;
      
      return {
        city: addressComponent.city || addressComponent.province,
        district: addressComponent.district,
        country: addressComponent.country,
        province: addressComponent.province,
        adcode: addressComponent.adcode
      };
    } catch (error) {
      if (error instanceof AMapError) {
        throw error;
      }
      throw new AMapError('逆地理编码失败', 'NETWORK_ERROR', '网络请求失败');
    }
  },

  async getCurrentLocation(): Promise<LocationData> {
    try {
      const location = await Taro.getLocation({
        type: 'gcj02'
      });

      return await this.reverseGeocode({
        longitude: location.longitude,
        latitude: location.latitude
      });
    } catch (error) {
      if ((error as any).errMsg?.includes('auth deny')) {
        throw new AMapError('位置权限被拒绝', 'PERMISSION_DENIED', '请允许获取位置权限');
      }
      throw new AMapError('获取当前位置失败', 'LOCATION_ERROR', (error as Error).message);
    }
  }
};

export default amapService;
