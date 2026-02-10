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
      neighborhood: {
        name: string;
        type: string;
      };
      building: {
        name: string;
        type: string;
      };
    };
  };
}

export interface LocationData {
  city: string;
  district?: string;
  country?: string;
  province?: string;
  adcode?: string;
  address?: string;
  formattedAddress?: string;
  longitude?: number;
  latitude?: number;
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
      console.log('开始 IP 定位...');
      const response = await Taro.request<IPLocationResponse>({
        url: 'https://restapi.amap.com/v3/ip',
        data: {
          key: AMAP_KEY
        },
        method: 'GET'
      });

      console.log('IP 定位响应:', response);
      const { data } = response;

      if (data.status !== '1') {
        console.error('IP 定位失败:', data);
        throw new AMapError(data.info, data.infocode, data.info);
      }

      console.log('IP 定位成功:', data);
      return {
        city: data.city,
        country: '中国',
        province: data.province,
        adcode: data.adcode
      };
    } catch (error) {
      console.error('IP 定位异常:', error);
      if (error instanceof AMapError) {
        throw error;
      }
      throw new AMapError('获取IP位置失败', 'NETWORK_ERROR', (error as Error).message);
    }
  },

  async reverseGeocode(location: { longitude: number; latitude: number }): Promise<LocationData> {
    try {
      console.log('开始逆地理编码:', location);
      const response = await Taro.request<RegeoResponse>({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data: {
          key: AMAP_KEY,
          location: `${location.longitude},${location.latitude}`,
          extensions: 'all'
        },
        method: 'GET'
      });

      console.log('逆地理编码响应:', response);
      const { data } = response;

      if (data.status !== '1') {
        console.error('逆地理编码失败:', data);
        throw new AMapError(data.info, data.infocode, data.info);
      }

      const { addressComponent, formatted_address } = data.regeocode;
      const { neighborhood, building } = addressComponent;

      console.log('逆地理编码成功:', { addressComponent, formatted_address });

      const detailedAddress = neighborhood?.name || building?.name || '';

      return {
        city: addressComponent.city || addressComponent.province,
        district: addressComponent.district,
        country: addressComponent.country,
        province: addressComponent.province,
        adcode: addressComponent.adcode,
        address: detailedAddress,
        formattedAddress: formatted_address,
        longitude: location.longitude,
        latitude: location.latitude
      };
    } catch (error) {
      console.error('逆地理编码异常:', error);
      if (error instanceof AMapError) {
        throw error;
      }
      throw new AMapError('逆地理编码失败', 'NETWORK_ERROR', (error as Error).message);
    }
  },

  async getCurrentLocation(): Promise<LocationData> {
    try {
      console.log('开始获取当前位置...');
      const location = await Taro.getLocation({
        type: 'wgs84'
      });

      console.log('获取到 GPS 位置:', location);
      return await this.reverseGeocode({
        longitude: location.longitude,
        latitude: location.latitude
      });
    } catch (error) {
      console.error('获取当前位置异常:', error);
      const errMsg = (error as any).errMsg || '';
      if (errMsg.includes('auth deny') || errMsg.includes('authorize')) {
        throw new AMapError('位置权限被拒绝', 'PERMISSION_DENIED', '请允许获取位置权限');
      }
      throw new AMapError('获取当前位置失败', 'LOCATION_ERROR', errMsg || (error as Error).message);
    }
  }
};

export default amapService;
