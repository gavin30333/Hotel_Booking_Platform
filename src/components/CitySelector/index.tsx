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
import { SearchHeader } from '@/components/CitySelector/SearchHeader'
import { HistorySection } from '@/components/CitySelector/HistorySection'
import { LocationStatus } from '@/components/common/display/LocationStatus'
import { DomesticTab } from './components/TabContent/DomesticTab'
import { OverseasTab } from './components/TabContent/OverseasTab'
import { HotSearchTab } from './components/TabContent/HotSearchTab'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (visible) {
      setActiveTab(defaultTab)
    }
  }, [visible, defaultTab])

  const handleSelect = React.useCallback(
    (city: string) => {
      onSelect({ city, source: activeTab })
      onClose()
    },
    [onSelect, onClose, activeTab]
  )

  const handleHotSearchSelect = React.useCallback(
    (result: HotSearchSelectResult) => {
      if (onHotSearchSelect) {
        onHotSearchSelect(result)
        onClose()
      } else {
        onSelect({ city: result.value, source: 'hot_search' })
        onClose()
      }
    },
    [onHotSearchSelect, onSelect, onClose]
  )

  const memoizedDomesticTab = React.useMemo(
    () => (
      <DomesticTab
        groups={domesticCities}
        hotCities={hotCities}
        currentCity={currentCity}
        onSelect={handleSelect}
        scrollEnabled={isSticky}
      />
    ),
    [domesticCities, hotCities, currentCity, handleSelect, isSticky]
  )

  const memoizedOverseasTab = React.useMemo(
    () => <OverseasTab onSelect={handleSelect} scrollEnabled={isSticky} />,
    [handleSelect, isSticky]
  )

  const memoizedHotSearchTab = React.useMemo(
    () => (
      <HotSearchTab
        currentCity={currentCity}
        onSelect={handleHotSearchSelect}
      />
    ),
    [currentCity, handleHotSearchSelect]
  )

  const getHotSearchTabTitle = () => {
    if (currentCity) {
      return `${currentCity}热搜`
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
          <LocationStatus status="disabled" />
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
