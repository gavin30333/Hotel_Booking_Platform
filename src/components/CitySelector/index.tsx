import React, { useState, useRef, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { Popup, Tabs, Loading } from "antd-mobile";
import { SearchHeader } from "./components/SearchHeader";
import { HistorySection } from "./components/HistorySection";
import { LocationStatus } from "./components/LocationStatus";
import { DomesticTab } from "./components/TabContent/DomesticTab";
import { OverseasTab } from "./components/TabContent/OverseasTab";
import { HotSearchTab } from "./components/TabContent/HotSearchTab";
import { CityTab } from "./types";
import { getCityData, getCityHotSearch } from "../../mock";
import "./CitySelector.less";

export * from "./types";

interface CitySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
  currentCity?: string;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  visible,
  onClose,
  onSelect,
  currentCity,
}) => {
  const [activeTab, setActiveTab] = useState<CityTab>("domestic");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cityData, setCityData] = useState({
    historyCities: [] as string[],
    hotCities: [] as string[],
    domesticCities: [] as any[],
    overseasHotCities: [] as string[],
    overseasCities: [] as any[],
    hotSearchList: [] as string[],
  });
  const [selectedCity, setSelectedCity] = useState<string>(
    currentCity || "成都",
  );
  const [hotSearchList, setHotSearchList] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      fetchCityData();
    }
  }, [visible]);

  const fetchCityData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCityData();
      if (response.code === 200) {
        setCityData(response.data);
        // 获取当前城市的热搜数据
        fetchCityHotSearch(selectedCity);
      } else {
        setError("获取城市数据失败");
      }
    } catch (err) {
      setError("网络错误，请稍后重试");
      console.error("获取城市数据失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 获取特定城市的热搜数据
  const fetchCityHotSearch = async (cityName: string) => {
    try {
      const response = await getCityHotSearch(cityName);
      if (response.code === 200) {
        setHotSearchList(response.data);
      }
    } catch (err) {
      console.error("获取城市热搜数据失败:", err);
    }
  };

  const handleSelect = (city: string) => {
    // 更新选中的城市
    setSelectedCity(city);
    // 获取对应城市的热搜数据
    fetchCityHotSearch(city);
    // 调用父组件的回调函数
    onSelect(city);
    // 关闭选择器
    onClose();
  };

  // 渲染加载状态
  if (loading) {
    return (
      <Popup
        visible={visible}
        onMaskClick={onClose}
        position="bottom"
        bodyStyle={{ height: "100vh" }}
        destroyOnClose
        className="city-selector-popup"
      >
        <SearchHeader onCancel={onClose} />
        <View className="city-selector-loading">
          <Loading size="large" />
          <Text style={{ marginTop: "16px" }}>加载城市数据中...</Text>
        </View>
      </Popup>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <Popup
        visible={visible}
        onMaskClick={onClose}
        position="bottom"
        bodyStyle={{ height: "100vh" }}
        destroyOnClose
        className="city-selector-popup"
      >
        <SearchHeader onCancel={onClose} />
        <View className="city-selector-error">
          <Text style={{ color: "#ff4d4f", marginBottom: "16px" }}>
            {error}
          </Text>
          <Text
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={fetchCityData}
          >
            重新加载
          </Text>
        </View>
      </Popup>
    );
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ height: "100vh" }}
      destroyOnClose
      className="city-selector-popup"
    >
      <SearchHeader onCancel={onClose} />

      <View className="city-selector-body">
        <View className="city-selector-header">
          <LocationStatus status="disabled" />
          <HistorySection
            cities={cityData.historyCities}
            onSelect={handleSelect}
            onClear={() => console.log("Clear history")}
          />
          <View className="header-divider" />
        </View>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as CityTab)}
          className="city-tabs"
        >
          <Tabs.Tab title="国内(含港澳台)" key="domestic">
            <DomesticTab
              groups={cityData.domesticCities}
              hotCities={cityData.hotCities}
              currentCity={currentCity}
              onSelect={handleSelect}
              scrollRef={scrollRef}
            />
          </Tabs.Tab>
          <Tabs.Tab title="海外" key="overseas">
            <OverseasTab
              onSelect={handleSelect}
              overseasHotCities={cityData.overseasHotCities}
              overseasCities={cityData.overseasCities}
            />
          </Tabs.Tab>
          <Tabs.Tab title={`${selectedCity}热搜`} key="hot_search">
            <HotSearchTab
              onSelect={handleSelect}
              hotSearchList={
                hotSearchList.length > 0
                  ? hotSearchList
                  : cityData.hotSearchList
              }
            />
          </Tabs.Tab>
        </Tabs>
      </View>
    </Popup>
  );
};
