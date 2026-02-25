import {
  historyCities,
  hotCities,
  domesticCities,
} from '@/constants/CitySelectorConfig/cityData'
import {
  CityTab,
  CitySelectResult,
  HotSearchSelectResult,
} from '@/types/citySelector'
import React, { useState, useRef } from 'react'
import { View } from '@tarojs/components'
import { Popup, Tabs } from 'antd-mobile'
import { useThrottleFn } from 'ahooks'
import Taro from '@tarojs/taro'
import useLocation from '@/hooks/useLocation'
import { SearchHeader } from '@/components/CitySelector/SearchHeader'
import { HistorySection } from '@/components/CitySelector/HistorySection'
import { LocationStatus } from '@/components/common/display/LocationStatus'
import { DomesticTab } from './components/TabContent/DomesticTab'
import { OverseasTab } from './components/TabContent/OverseasTab'
import { HotSearchTab } from './components/TabContent/HotSearchTab'
import { useQueryStore } from '@/store/useQueryStore'
import './CitySelector.less'

export * from '@/types/citySelector'

interface CitySelectorProps {
  visible: boolean
  onClose: () => void
  onSelect: (result: CitySelectResult) => void
  onHotSearchSelect?: (result: HotSearchSelectResult) => void
  currentCity?: string
  defaultTab?: CityTab
  onTabChange?: (tab: CityTab) => void
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  visible,
  onClose,
  onSelect,
  onHotSearchSelect,
  currentCity,
  defaultTab = 'domestic',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<CityTab>(defaultTab)
  const [isSticky, setIsSticky] = useState(false)
  const [viewingCity, setViewingCity] = useState(currentCity)
  const { location, loading, error, locateByGPS } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const getSearchParams = useQueryStore((state) => state.getSearchParams)

  React.useEffect(() => {
    if (visible) {
      setActiveTab(defaultTab)
    }
  }, [visible, defaultTab])

  React.useEffect(() => {
    setViewingCity(currentCity)
  }, [currentCity])

  React.useEffect(() => {
    if (location?.city) {
      setViewingCity(location.city)
    }
  }, [location?.city])

  const handleLocationClick = React.useCallback(() => {
    if (location?.city) {
      onSelect({ city: location.city, source: 'domestic' })
      onClose()
    } else {
      locateByGPS()
    }
  }, [location, onSelect, onClose, locateByGPS])

  const handleSelect = React.useCallback(
    (city: string) => {
      onSelect({ city, source: activeTab })
      onClose()
    },
    [onSelect, onClose, activeTab]
  )

  const handleHotSearchSelect = React.useCallback(
    (result: HotSearchSelectResult) => {
      if (result.type === 'hotel' && result.hotelId) {
        const params = getSearchParams()
        onClose()
        Taro.navigateTo({
          url: `/pages/detail/index?id=${result.hotelId}&checkInDate=${encodeURIComponent(params.checkInDate)}&checkOutDate=${encodeURIComponent(params.checkOutDate)}&roomCount=${params.rooms}&adultCount=${params.adults}&childCount=${params.children}`,
        })
        return
      }

      if (onHotSearchSelect) {
        onHotSearchSelect(result)
        onClose()
      } else {
        onSelect({ city: result.value, source: 'hot_search' })
        onClose()
      }
    },
    [onHotSearchSelect, onSelect, onClose, getSearchParams]
  )

  const memoizedDomesticTab = React.useMemo(
    () => (
      <DomesticTab
        groups={domesticCities}
        hotCities={hotCities}
        currentCity={viewingCity}
        onSelect={handleSelect}
        scrollEnabled={isSticky}
      />
    ),
    [domesticCities, hotCities, viewingCity, handleSelect, isSticky]
  )

  const memoizedOverseasTab = React.useMemo(
    () => <OverseasTab onSelect={handleSelect} scrollEnabled={isSticky} />,
    [handleSelect, isSticky]
  )

  const memoizedHotSearchTab = React.useMemo(
    () => (
      <HotSearchTab
        currentCity={viewingCity}
        onSelect={handleHotSearchSelect}
      />
    ),
    [viewingCity, handleHotSearchSelect]
  )

  const getHotSearchTabTitle = () => {
    if (viewingCity) {
      return `${viewingCity}热搜`
    }
    return '热搜推荐'
  }

  const { run: handleScroll } = useThrottleFn(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.target as HTMLDivElement
      const scrollTop = container.scrollTop
      const headerHeight = headerRef.current?.clientHeight || 0

      if (!isSticky && scrollTop >= headerHeight) {
        setIsSticky(true)
      } else if (isSticky && scrollTop < headerHeight - 5) {
        setIsSticky(false)
      }
    },
    { wait: 16 }
  )

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ height: '100vh' }}
      destroyOnClose
      className="city-selector-popup"
    >
      <SearchHeader onCancel={onClose} />

      <div
        className="city-selector-body"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <div ref={headerRef} className="city-selector-header">
          <LocationStatus
            status={
              loading
                ? 'loading'
                : error
                  ? 'failed'
                  : location
                    ? 'success'
                    : 'disabled'
            }
            city={location?.city}
            onClick={handleLocationClick}
          />
          <HistorySection
            cities={historyCities}
            onSelect={handleSelect}
            onClear={() => console.log('Clear history')}
          />
          <View className="header-divider" />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            const tab = key as CityTab
            setActiveTab(tab)
            onTabChange?.(tab)
          }}
          className="city-tabs"
        >
          <Tabs.Tab title="国内(含港澳台)" key="domestic">
            {memoizedDomesticTab}
          </Tabs.Tab>
          <Tabs.Tab title="海外" key="overseas">
            {memoizedOverseasTab}
          </Tabs.Tab>
          <Tabs.Tab title={getHotSearchTabTitle()} key="hot_search">
            {memoizedHotSearchTab}
          </Tabs.Tab>
        </Tabs>
      </div>
    </Popup>
  )
}
