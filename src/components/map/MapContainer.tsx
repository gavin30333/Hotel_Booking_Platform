import { View, Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import './MapContainer.less'

interface MapContainerProps {
  center?: [number, number]
  zoom?: number
  onMapClick?: (lng: number, lat: number, address: string) => void
  className?: string
}

let AMap: any = null

export default function MapContainer({
  center = [116.397428, 39.90923],
  zoom = 13,
  onMapClick,
  className = '',
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return

    // 获取API密钥
    const apiKey = process.env.AMAP_API_KEY || 'your_amap_api_key_here'

    if (!apiKey || apiKey === 'your_amap_api_key_here') {
      setError('高德地图API密钥未配置')
      setLoading(false)
      return
    }

    // 加载高德地图API
    AMapLoader.load({
      key: apiKey,
      version: '2.0',
      plugins: ['AMap.Geocoder'],
    })
      .then((amap: any) => {
        AMap = amap

        // 创建地图实例
        const mapInstance = new AMap.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          resizeEnable: true,
        })

        setMap(mapInstance)
        setLoading(false)

        // 添加地图点击事件
        if (onMapClick) {
          mapInstance.on('click', (e: any) => {
            const lng = e.lnglat.getLng()
            const lat = e.lnglat.getLat()

            // 逆地理编码获取地址信息
            const geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all',
            })

            geocoder.getAddress([lng, lat], (status: string, result: any) => {
              if (status === 'complete' && result.info === 'OK') {
                const address = result.regeocode.formattedAddress
                onMapClick(lng, lat, address)
              } else {
                onMapClick(lng, lat, '未知地址')
              }
            })
          })
        }
      })
      .catch((err: any) => {
        console.error('高德地图API加载失败:', err)
        setError('地图加载失败，请检查API密钥是否正确')
        setLoading(false)
      })

    // 清理函数
    return () => {
      if (map) {
        map.destroy()
      }
    }
  }, [center, zoom, onMapClick])

  // 处理地图容器大小变化
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.resize()
      }, 100)
    }
  }, [map])

  return (
    <View className={`map-container ${className}`}>
      {loading ? (
        <View className="map-loading">
          <Text>地图加载中...</Text>
        </View>
      ) : error ? (
        <View className="map-error">
          <Text>{error}</Text>
        </View>
      ) : (
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
          }}
        />
      )}
    </View>
  )
}
