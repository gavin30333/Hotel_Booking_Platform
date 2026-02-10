import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { amapService, LocationData, AMapError } from '@/utils/amap';

export interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  locateByIP: () => Promise<void>;
  locateByGPS: () => Promise<void>;
  resetError: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const locateByIP = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await amapService.getIPLocation();
      setLocation(result);
      Taro.showToast({
        title: `已定位到${result.city}`,
        icon: 'success',
        duration: 2000
      });
    } catch (err) {
      const errorMsg = err instanceof AMapError ? err.info : '定位失败，请重试';
      setError(errorMsg);
      Taro.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const locateByGPS = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await amapService.getCurrentLocation();
      setLocation(result);
      Taro.showToast({
        title: `已定位到${result.city}`,
        icon: 'success',
        duration: 2000
      });
    } catch (err) {
      const errorMsg = err instanceof AMapError ? err.info : '定位失败，请重试';
      setError(errorMsg);
      Taro.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      });

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
