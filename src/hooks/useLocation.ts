import { useState, useCallback, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { amapService, LocationData, AMapError } from '@/utils/amap';

export interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  locateByIP: () => Promise<LocationData | null>;
  locateByGPS: () => Promise<LocationData | null>;
  resetError: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locationRef = useRef<LocationData | null>(null);

  useEffect(() => {
    if (location) {
      locationRef.current = location;
    }
  }, [location]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const locateByIP = useCallback(async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await amapService.getIPLocation();
      setLocation(result);
      return result;
    } catch (err) {
      const errorMsg = (err instanceof AMapError ? err.info : '定位失败，请重试') || '定位失败，请重试';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const locateByGPS = useCallback(async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await amapService.getCurrentLocation();
      setLocation(result);
      return result;
    } catch (err) {
      const errorMsg = (err instanceof AMapError ? err.info : '定位失败，请重试') || '定位失败，请重试';
      setError(errorMsg);

      if (err instanceof AMapError && err.code === 'PERMISSION_DENIED') {
        Taro.showModal({
          title: '提示',
          content: '需要获取您的位置信息才能提供更精准的服务',
          showCancel: true,
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting();
            }
          }
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    loading,
    error,
    locateByIP,
    locateByGPS,
    resetError
  };
};

export default useLocation;
