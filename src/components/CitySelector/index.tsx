import React, { useState, useRef } from 'react'
import { View } from '@tarojs/components'
import { Popup, Tabs } from 'antd-mobile'
import { useThrottleFn } from 'ahooks'
import { SearchHeader } from './components/SearchHeader'
import { HistorySection } from './components/HistorySection'
import { LocationStatus } from './components/LocationStatus'
import { DomesticTab } from './components/TabContent/DomesticTab'
import { OverseasTab } from './components/TabContent/OverseasTab'
import { HotSearchTab } from './components/TabContent/HotSearchTab'
import { historyCities, hotCities, domesticCities } from './utils/cityData'
import { CityTab } from './types'
import './CitySelector.less'

export * from './types'

interface CitySelectorProps {
  visible: boolean
  onClose: () => void
  onSelect: (city: string) => void
  currentCity?: string
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  visible,
  onClose,
  onSelect,
  currentCity,
}) => {
  const [activeTab, setActiveTab] = useState<CityTab>('domestic')
  const [isSticky, setIsSticky] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const handleSelect = React.useCallback(
    (city: string) => {
      onSelect(city)
      onClose()
    },
    [onSelect, onClose]
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
    () => <HotSearchTab onSelect={handleSelect} />,
    [handleSelect]
  )

  const { run: handleScroll } = useThrottleFn(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.target as HTMLDivElement
      const scrollTop = container.scrollTop
      const headerHeight = headerRef.current?.clientHeight || 0

      // Hysteresis logic to prevent jitter at the sticky threshold
      // Enter sticky state when scrolled past header
      if (!isSticky && scrollTop >= headerHeight) {
        setIsSticky(true)
      }
      // Exit sticky state when scrolled back up with a buffer
      else if (isSticky && scrollTop < headerHeight - 5) {
        setIsSticky(false)
      }
    },
    { wait: 16 } // ~60fps
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
          onChange={(key) => setActiveTab(key as CityTab)}
          className="city-tabs"
        >
          <Tabs.Tab title="国内(含港澳台)" key="domestic">
            {memoizedDomesticTab}
          </Tabs.Tab>
          <Tabs.Tab title="海外" key="overseas">
            {memoizedOverseasTab}
          </Tabs.Tab>
          <Tabs.Tab title="成都热搜" key="hot_search">
            {memoizedHotSearchTab}
          </Tabs.Tab>
        </Tabs>
      </div>
    </Popup>
  )
}
