import { View, Text, ScrollView, Image } from "@tarojs/components";
import { useState, useCallback, useEffect } from "react";
import { Picker, DatePicker, SearchBar, Toast, Segmented } from "antd-mobile";
import AMapLoader from "@amap/amap-jsapi-loader";
import "./CoreFilterHeader.less";

let AMap: any = null;

interface CoreFilterHeaderProps {
  onSearch: (params: {
    city: string;
    checkInDate: string;
    checkOutDate: string;
    rooms: number;
    adults: number;
    children: number;
    [key: string]: any;
  }) => void;
  onDropdownStateChange?: (isOpen: boolean) => void;
}

interface SearchParams {
  city: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: number;
  adults: number;
  children: number;
  advancedOptions: boolean;
}

// 城市数据
const HOT_CITIES = [
  { label: "北京", value: "北京" },
  { label: "上海", value: "上海" },
  { label: "广州", value: "广州" },
  { label: "深圳", value: "深圳" },
  { label: "杭州", value: "杭州" },
  { label: "成都", value: "成都" },
  { label: "重庆", value: "重庆" },
  { label: "西安", value: "西安" },
  { label: "南京", value: "南京" },
  { label: "武汉", value: "武汉" },
];

// 排序选项
const sortOptions = [
  { label: "欢迎度", value: "welcome" },
  { label: "位置", value: "distance" },
  { label: "价格", value: "price" },
  { label: "筛选", value: "filter" },
];

export default function CoreFilterHeader({
  onSearch,
  onDropdownStateChange,
}: CoreFilterHeaderProps) {
  const [params, setParams] = useState<SearchParams>({
    city: "北京",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 2,
    children: 0,
    advancedOptions: false,
  });

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [showWelcomeDropdown, setShowWelcomeDropdown] = useState(false);
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [welcomeArrowUp, setWelcomeArrowUp] = useState(false);
  const [distanceArrowUp, setDistanceArrowUp] = useState(false);
  const [priceArrowUp, setPriceArrowUp] = useState(false);
  const [filterArrowUp, setFilterArrowUp] = useState(false);
  const [showMainSelector, setShowMainSelector] = useState(false);
  const [activeSortTab, setActiveSortTab] = useState("welcome");
  const [searchValue, setSearchValue] = useState("");
  const [currentMonth, setCurrentMonth] = useState(2); // 当前月份
  const [currentYear, setCurrentYear] = useState(2026); // 当前年份
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [selectedDistanceOption, setSelectedDistanceOption] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedHandle, setDraggedHandle] = useState<"min" | "max" | null>(
    null,
  );
  const [activeLocationCategory, setActiveLocationCategory] =
    useState("热门地标");
  const [activeFilterCategory, setActiveFilterCategory] = useState("品牌");
  const [expandedCategories, setExpandedCategories] = useState({
    热门筛选: false,
    品牌: false,
    类型特色: false,
    设施: false,
    床型: false,
    房间面积: false,
    点评: false,
    "服务/支付": false,
    适用人群: false,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationPOIs, setLocationPOIs] = useState<{ [key: string]: string[] }>(
    {
      热门地标: [],
      地铁站: [],
      景点: [],
    },
  );
  const [isSearchingPOIs, setIsSearchingPOIs] = useState(false);

  // 高级搜索选项
  const [advancedOptions, setAdvancedOptions] = useState({
    starRating: [] as number[],
    facilities: [] as string[],
    priceRange: {
      min: 0,
      max: 10000,
    },
  });

  // 城市选择器状态
  const [historyCities, setHistoryCities] = useState<string[]>([]);

  // 日期选择器状态
  const [selectedDate, setSelectedDate] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });

  // 加载历史城市
  useEffect(() => {
    const savedHistory = localStorage.getItem("hotel_search_history_cities");
    if (savedHistory) {
      try {
        setHistoryCities(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse history cities:", error);
      }
    }
  }, []);

  // 点击外部区域关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 检查点击的元素是否在主选择器容器内
      const mainSelectorContainer = document.querySelector(
        ".main-selector-container",
      );
      if (
        mainSelectorContainer &&
        mainSelectorContainer.contains(e.target as Node)
      ) {
        return;
      }

      // 检查点击的元素是否在主选择器内
      const mainSelector = document.querySelector(".main-selector");
      if (mainSelector && mainSelector.contains(e.target as Node)) {
        return;
      }

      setShowWelcomeDropdown(false);
      setWelcomeArrowUp(false);
      setShowDistanceDropdown(false);
      setDistanceArrowUp(false);
      setShowPriceDropdown(false);
      setPriceArrowUp(false);
      setShowFilterDropdown(false);
      setFilterArrowUp(false);
      setShowMainSelector(false);
      setShowCityPicker(false);
      setShowDatePicker(false);
      setShowRoomPicker(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 初始化日期
  useEffect(() => {
    if (params.checkInDate && params.checkOutDate) {
      setSelectedDate({ start: params.checkInDate, end: params.checkOutDate });
    }
  }, [params.checkInDate, params.checkOutDate]);

  // 搜索POI（兴趣点）
  const searchPOIs = useCallback(
    async (category: string) => {
      // 获取API密钥
      const apiKey = process.env.AMAP_API_KEY || "your_amap_api_key_here";

      if (!apiKey || apiKey === "your_amap_api_key_here") {
        Toast.fail("高德地图API密钥未配置");
        return;
      }

      try {
        setIsSearchingPOIs(true);

        // 加载高德地图API
        if (!AMap) {
          AMap = await AMapLoader.load({
            key: apiKey,
            version: "2.0",
            plugins: ["AMap.PlaceSearch"],
          });
        }

        // 获取当前城市坐标
        const city = params.city || "北京";
        let cityCenter: [number, number] = [116.397428, 39.90923]; // 默认北京

        // 根据城市名获取坐标
        const geocoder = new AMap.Geocoder({
          city: city,
          radius: 1000,
        });

        // 地理编码获取城市坐标
        await new Promise<void>((resolve, reject) => {
          geocoder.getLocation(city, (status: string, result: any) => {
            if (status === "complete" && result.info === "OK") {
              cityCenter = [
                result.geocodes[0].location.getLng(),
                result.geocodes[0].location.getLat(),
              ];
              resolve();
            } else {
              reject(new Error("获取城市坐标失败"));
            }
          });
        });

        // 创建PlaceSearch实例
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 20,
          pageIndex: 1,
          city: city,
          extensions: "base",
        });

        // 根据分类搜索POI
        let keywords = "";
        let types = "";

        switch (category) {
          case "热门地标":
            keywords = "地标";
            types = "080000"; // 楼宇
            break;
          case "地铁站":
            keywords = "地铁站";
            types = "150500"; // 地铁站
            break;
          case "景点":
            keywords = "景点";
            types = "110000"; // 风景名胜
            break;
          default:
            keywords = "地标";
            types = "080000";
        }

        // 执行搜索
        await new Promise<void>((resolve, reject) => {
          placeSearch.searchNearBy(
            keywords,
            cityCenter,
            5000,
            (status: string, result: any) => {
              if (status === "complete" && result.info === "OK") {
                const pois = result.pois.map((poi: any) => poi.name);
                setLocationPOIs((prev) => ({
                  ...prev,
                  [category]: pois,
                }));
                resolve();
              } else {
                reject(new Error("搜索POI失败"));
              }
            },
            {
              types: types,
            },
          );
        });
      } catch (error) {
        console.error("搜索POI出错:", error);
        Toast.fail("搜索位置信息失败，请稍后重试");
      } finally {
        setIsSearchingPOIs(false);
      }
    },
    [params.city],
  );

  // 监听下拉框状态变化，通知父组件
  useEffect(() => {
    const isAnyDropdownOpen =
      showCityPicker ||
      showDatePicker ||
      showRoomPicker ||
      showWelcomeDropdown ||
      showDistanceDropdown ||
      showPriceDropdown ||
      showFilterDropdown ||
      showMainSelector;
    if (onDropdownStateChange) {
      onDropdownStateChange(isAnyDropdownOpen);
    }
  }, [
    showCityPicker,
    showDatePicker,
    showRoomPicker,
    showWelcomeDropdown,
    showDistanceDropdown,
    showPriceDropdown,
    showFilterDropdown,
    showMainSelector,
    onDropdownStateChange,
  ]);

  const handleParamChange = useCallback(
    (key: keyof SearchParams, value: any) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // 表单验证状态
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // 日期格式化函数
  const formatDate = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // 解析日期字符串
  const parseDate = useCallback((dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, []);

  // 验证表单
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // 验证城市
    if (!params.city) {
      errors.city = "请选择城市";
    }

    // 验证日期
    if (!params.checkInDate) {
      errors.checkInDate = "请选择入住日期";
    }
    if (!params.checkOutDate) {
      errors.checkOutDate = "请选择离店日期";
    }
    if (params.checkInDate && params.checkOutDate) {
      const checkIn = parseDate(params.checkInDate);
      const checkOut = parseDate(params.checkOutDate);
      if (checkOut < checkIn) {
        errors.dateRange = "离店日期必须晚于入住日期";
      }
    }

    // 验证价格范围
    if (advancedOptions.priceRange.min > advancedOptions.priceRange.max) {
      errors.priceRange = "最低价格不能大于最高价格";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [
    params.city,
    params.checkInDate,
    params.checkOutDate,
    advancedOptions.priceRange,
    parseDate,
  ]);

  // 处理搜索
  const handleSearch = useCallback(() => {
    if (validateForm()) {
      onSearch({
        ...params,
        ...advancedOptions,
      });
      Toast.success("搜索成功");
    } else {
      Toast.fail("请检查输入信息");
    }
  }, [params, advancedOptions, onSearch, validateForm]);

  // 选择城市
  const handleCitySelect = useCallback(
    (cityValue: string) => {
      handleParamChange("city", cityValue);

      // 更新历史城市
      const newHistory = [
        cityValue,
        ...historyCities.filter((city) => city !== cityValue),
      ].slice(0, 5);
      setHistoryCities(newHistory);
      try {
        localStorage.setItem(
          "hotel_search_history_cities",
          JSON.stringify(newHistory),
        );
      } catch (error) {
        console.error("Failed to save history cities:", error);
      }

      setShowCityPicker(false);
    },
    [historyCities, handleParamChange],
  );

  // 处理日期选择
  const handleDateSelect = useCallback(
    (dates: any) => {
      if (dates && dates.length === 2) {
        const [start, end] = dates;
        const checkInDate = formatDate(start);
        const checkOutDate = formatDate(end);

        handleParamChange("checkInDate", checkInDate);
        handleParamChange("checkOutDate", checkOutDate);
        setSelectedDate({ start: checkInDate, end: checkOutDate });
        setShowDatePicker(false);
      }
    },
    [formatDate, handleParamChange],
  );

  // 处理入住信息选择
  const handleRoomSelect = useCallback(
    (values: any) => {
      const [rooms, adults, children] = values;
      handleParamChange("rooms", rooms);
      handleParamChange("adults", adults);
      handleParamChange("children", children);
      setShowRoomPicker(false);
    },
    [handleParamChange],
  );

  // 生成日期范围选项
  const generateDateRange = () => {
    const ranges = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const start = new Date(today);
      const end = new Date(today);
      start.setDate(today.getDate());
      end.setDate(today.getDate() + i);

      ranges.push({
        label: `${i}晚`,
        value: [start, end],
      });
    }

    return ranges;
  };

  // 价格滑块事件处理
  const handlePriceSliderStart = (handle: "min" | "max") => (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedHandle(handle);
  };

  const handlePriceSliderMove = (e: any) => {
    if (!isDragging || !draggedHandle) return;

    const slider = document.querySelector(".price-slider");
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    let x: number;

    // 处理鼠标事件和触摸事件
    if (e.touches) {
      // 触摸事件
      x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    } else if (e.clientX) {
      // 鼠标事件
      x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    } else {
      return;
    }

    const percentage = x / rect.width;
    const price = Math.round(percentage * 100); // Max price is 100
    const roundedPrice = Math.round(price / 10) * 10; // Round to nearest 10

    setPriceRange((prev) => {
      if (draggedHandle === "min") {
        return { min: Math.min(roundedPrice, prev.max - 10), max: prev.max };
      } else {
        return { min: prev.min, max: Math.max(roundedPrice, prev.min + 10) };
      }
    });
  };

  const handlePriceSliderEnd = () => {
    setIsDragging(false);
    setDraggedHandle(null);
  };

  // Add global event listeners for both mouse and touch
  useEffect(() => {
    if (isDragging) {
      // 添加鼠标事件监听器
      document.addEventListener("mousemove", handlePriceSliderMove);
      document.addEventListener("mouseup", handlePriceSliderEnd);
      // 添加触摸事件监听器
      document.addEventListener("touchmove", handlePriceSliderMove);
      document.addEventListener("touchend", handlePriceSliderEnd);

      return () => {
        // 移除鼠标事件监听器
        document.removeEventListener("mousemove", handlePriceSliderMove);
        document.removeEventListener("mouseup", handlePriceSliderEnd);
        // 移除触摸事件监听器
        document.removeEventListener("touchmove", handlePriceSliderMove);
        document.removeEventListener("touchend", handlePriceSliderEnd);
      };
    }
  }, [isDragging, draggedHandle, handlePriceSliderMove, handlePriceSliderEnd]);

  return (
    <View className="core-filter-header">
      {/* 顶部筛选栏 */}
      <View className="top-filter-bar">
        {/* 回退按钮 */}
        <View className="back-button">
          <Text style={{ fontSize: "16px", color: "#333" }}>‹</Text>
        </View>

        {/* 胶囊样式的搜索区域 */}
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: "20px",
            padding: "4px",
            marginRight: "16px",
          }}
        >
          {/* 城市、日期、房型选择整体 */}
          <View
            className="main-selector-container"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              flex: 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Main selector container clicked");
              setShowMainSelector(true);
            }}
          >
            {/* 城市选择 */}
            <View className="filter-item compact" style={{ cursor: "pointer" }}>
              <Text className="filter-value">{params.city}</Text>
            </View>

            {/* 日期选择 */}
            <View className="filter-item compact" style={{ cursor: "pointer" }}>
              <Text className="filter-value">
                {params.checkInDate && params.checkOutDate
                  ? `${params.checkInDate.split("-")[1]}-${params.checkInDate.split("-")[2]} 至 ${params.checkOutDate.split("-")[1]}-${params.checkOutDate.split("-")[2]}`
                  : "选择日期"}
              </Text>
            </View>

            {/* 入住信息 */}
            <View
              className="filter-item compact"
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text className="filter-value">{params.rooms}间</Text>
              <Text className="filter-value">{params.adults}人</Text>
            </View>
          </View>

          {/* 搜索框 */}
          <View className="search-item" style={{ flex: 1, marginRight: 0 }}>
            <SearchBar
              placeholder="位置/品牌/酒店"
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearch}
              style={{
                borderRadius: "16px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "12px",
              }}
            />
          </View>
        </View>

        {/* 地图图标 */}
        <View
          className="map-icon"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: "16px",
          }}
        >
          <Image
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=map%20icon%20simple%20outline%20style%20gray&image_size=square"
            style={{ width: "20px", height: "20px", marginBottom: "4px" }}
          />
          <Text style={{ fontSize: "10px", color: "#666" }}>地图</Text>
        </View>

        {/* 更多选项 */}
        <View
          className="more-options"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: "16px", color: "#666", marginBottom: "4px" }}
          >
            •••
          </Text>
          <Text style={{ fontSize: "10px", color: "#666" }}>更多</Text>
        </View>
      </View>

      {/* 主选择器 - 三行大字显示 */}
      {showMainSelector && (
        <View
          className="main-selector"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "#fff",
            borderRadius: "0 0 8px 8px",
            padding: "16px",
            margin: "0 auto",
            maxWidth: "100%",
            minHeight: "300px",
            transformOrigin: "top center",
            animation: "slideDown 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
            boxSizing: "border-box",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 城市选择行 */}
          <View
            style={{
              padding: "24px 0",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("City row clicked");
              setShowCityPicker(true);
            }}
          >
            <Text
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              {params.city}
            </Text>
            <Text style={{ fontSize: "16px", color: "#1890ff" }}>📍</Text>
          </View>

          {/* 日期选择行 */}
          <View
            style={{
              padding: "24px 0",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: "100px",
              backgroundColor: "#fff",
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Date row clicked");
              setShowDatePicker(true);
            }}
          >
            <Text
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              {params.checkInDate && params.checkOutDate
                ? `${params.checkInDate.split("-")[1]}月${params.checkInDate.split("-")[2]}日 至 ${params.checkOutDate.split("-")[1]}月${params.checkOutDate.split("-")[2]}日`
                : `${currentMonth}月${new Date().getDate()}日 今天`}
            </Text>
          </View>

          {/* 入住信息选择行 */}
          <View
            style={{
              padding: "24px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: "200px",
              backgroundColor: "#fff",
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Room row clicked");
              setShowRoomPicker(true);
            }}
          >
            <Text
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              {params.rooms}间房 {params.adults}成人 {params.children}儿童
            </Text>
          </View>

          {/* 确定按钮 */}
          <View
            style={{
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#1890ff",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
            onClick={() => setShowMainSelector(false)}
          >
            <Text
              style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}
            >
              确定
            </Text>
          </View>
        </View>
      )}

      {/* 排序栏 */}
      <View
        className="sort-bar"
        style={{
          position: "relative",
          zIndex: 100,
          overflow: "visible",
        }}
      >
        {/* 欢迎度排序 */}
        <View
          className="sort-option"
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Welcome sort clicked");
            setActiveSortTab("welcome");
            setShowWelcomeDropdown(!showWelcomeDropdown);
            setWelcomeArrowUp(!showWelcomeDropdown);
            setShowDistanceDropdown(false);
            setDistanceArrowUp(false);
            setShowPriceDropdown(false);
            setPriceArrowUp(false);
            setShowFilterDropdown(false);
            setFilterArrowUp(false);
            console.log("Welcome dropdown state:", {
              showWelcomeDropdown: !showWelcomeDropdown,
            });
          }}
        >
          <Text>欢迎度排序</Text>
          <Text className="arrow">{welcomeArrowUp ? "▲" : "▼"}</Text>
        </View>

        {/* 位置距离 */}
        <View
          className="sort-option"
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSortTab("distance");
            setShowWelcomeDropdown(false);
            setWelcomeArrowUp(false);
            setShowDistanceDropdown(!showDistanceDropdown);
            setDistanceArrowUp(!showDistanceDropdown);
            setShowPriceDropdown(false);
            setPriceArrowUp(false);
            setShowFilterDropdown(false);
            setFilterArrowUp(false);
          }}
        >
          <Text>位置距离</Text>
          <Text className="arrow">{distanceArrowUp ? "▲" : "▼"}</Text>
        </View>

        {/* 价格/星级 */}
        <View
          className="sort-option"
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSortTab("price");
            setShowWelcomeDropdown(false);
            setWelcomeArrowUp(false);
            setShowDistanceDropdown(false);
            setDistanceArrowUp(false);
            setShowPriceDropdown(!showPriceDropdown);
            setPriceArrowUp(!showPriceDropdown);
            setShowFilterDropdown(false);
            setFilterArrowUp(false);
          }}
        >
          <Text>价格/星级</Text>
          <Text className="arrow">{priceArrowUp ? "▲" : "▼"}</Text>
        </View>

        {/* 筛选 */}
        <View
          className="sort-option"
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSortTab("filter");
            setShowWelcomeDropdown(false);
            setWelcomeArrowUp(false);
            setShowDistanceDropdown(false);
            setDistanceArrowUp(false);
            setShowPriceDropdown(false);
            setPriceArrowUp(false);
            setShowFilterDropdown(!showFilterDropdown);
            setFilterArrowUp(!showFilterDropdown);
          }}
        >
          <Text>筛选</Text>
          <Text className="arrow">{filterArrowUp ? "▲" : "▼"}</Text>
        </View>

        {/* 欢迎度排序下拉框 */}
        {showWelcomeDropdown && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "#fff",
              borderRadius: "0 0 8px 8px",
              padding: "0 16px",
              margin: "0 auto",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <View>
              {/* 价格从低到高 */}
              <View
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Selecting 价格从低到高");
                  setSelectedSortOption("价格从低到高");
                  onSearch({
                    ...params,
                    ...advancedOptions,
                    sortBy: "price_asc",
                  });
                  setShowWelcomeDropdown(false);
                }}
              >
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  价格从低到高
                </Text>
                {selectedSortOption === "价格从低到高" && (
                  <Text style={{ fontSize: "14px", color: "#1890ff" }}>✓</Text>
                )}
              </View>
              {/* 价格从高到低 */}
              <View
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Selecting 价格从高到低");
                  setSelectedSortOption("价格从高到低");
                  onSearch({
                    ...params,
                    ...advancedOptions,
                    sortBy: "price_desc",
                  });
                  setShowWelcomeDropdown(false);
                }}
              >
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  价格从高到低
                </Text>
                {selectedSortOption === "价格从高到低" && (
                  <Text style={{ fontSize: "14px", color: "#1890ff" }}>✓</Text>
                )}
              </View>
              {/* 评分从高到低 */}
              <View
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Selecting 评分从高到低");
                  setSelectedSortOption("评分从高到低");
                  onSearch({
                    ...params,
                    ...advancedOptions,
                    sortBy: "rating_desc",
                  });
                  setShowWelcomeDropdown(false);
                }}
              >
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  评分从高到低
                </Text>
                {selectedSortOption === "评分从高到低" && (
                  <Text style={{ fontSize: "14px", color: "#1890ff" }}>✓</Text>
                )}
              </View>
              {/* 距离从近到远 */}
              <View
                style={{
                  padding: "12px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Selecting 距离从近到远");
                  setSelectedSortOption("距离从近到远");
                  onSearch({
                    ...params,
                    ...advancedOptions,
                    sortBy: "distance_asc",
                  });
                  setShowWelcomeDropdown(false);
                }}
              >
                <Text style={{ fontSize: "14px", color: "#333" }}>
                  距离从近到远
                </Text>
                {selectedSortOption === "距离从近到远" && (
                  <Text style={{ fontSize: "14px", color: "#1890ff" }}>✓</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* 位置距离下拉框 */}
        {showDistanceDropdown && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "#fff",
              borderRadius: "0 0 8px 8px",
              padding: "16px",
              margin: "0 auto",
              width: "100%",
              maxWidth: "100%",
              minHeight: "300px",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <View style={{ display: "flex", height: "240px" }}>
              {/* 左侧分类 */}
              <View
                style={{
                  width: "30%",
                  borderRight: "1px solid #f0f0f0",
                  paddingRight: "12px",
                  zIndex: 1,
                }}
              >
                {["热门地标", "地铁站", "景点"].map((category) => (
                  <View
                    key={category}
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                      borderRadius: "4px",
                      backgroundColor:
                        category === activeLocationCategory
                          ? "#f0f8ff"
                          : "#fff",
                      borderLeft:
                        category === activeLocationCategory
                          ? "3px solid #1890ff"
                          : "3px solid transparent",
                      marginBottom: "8px",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Selecting category:", category);
                      setActiveLocationCategory(category);
                      // 搜索该分类下的POI
                      searchPOIs(category);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "13px",
                        color:
                          category === activeLocationCategory
                            ? "#1890ff"
                            : "#333",
                      }}
                    >
                      {category}
                    </Text>
                  </View>
                ))}
              </View>
              {/* 右侧选项 */}
              <View style={{ flex: 1, paddingLeft: "16px", overflowY: "auto" }}>
                {isSearchingPOIs ? (
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                    }}
                  >
                    <Text style={{ fontSize: "14px", color: "#666" }}>
                      搜索中...
                    </Text>
                  </View>
                ) : locationPOIs[activeLocationCategory] &&
                  locationPOIs[activeLocationCategory].length > 0 ? (
                  <View
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {locationPOIs[activeLocationCategory].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          border: "1px solid #e0e0e0",
                          backgroundColor: "#f8f8f8",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Selecting location:", item);
                          setSelectedDistanceOption(item);
                          setShowDistanceDropdown(false);
                        }}
                      >
                        <Text style={{ fontSize: "12px", color: "#666" }}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                    }}
                  >
                    <Text style={{ fontSize: "14px", color: "#666" }}>
                      点击左侧分类搜索位置
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* 价格/星级下拉框 */}
        {showPriceDropdown && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "#fff",
              borderRadius: "0 0 8px 8px",
              padding: "16px 24px",
              margin: "0 auto",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Price dropdown clicked");
            }}
          >
            <View>
              <View style={{ marginBottom: "24px" }}>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#333",
                    marginBottom: "16px",
                    display: "block",
                  }}
                >
                  价格区间
                </Text>
                {/* 价格滑块 */}
                <View style={{ padding: "0 24px", marginBottom: "16px" }}>
                  <View
                    className="price-slider"
                    style={{
                      height: "4px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "2px",
                      position: "relative",
                    }}
                  >
                    <View
                      style={{
                        height: "4px",
                        backgroundColor: "#1890ff",
                        borderRadius: "2px",
                        position: "absolute",
                        left: `${(priceRange.min / 100) * 100}%`,
                        width: `${((priceRange.max - priceRange.min) / 100) * 100}%`,
                      }}
                    ></View>
                    <View
                      style={{
                        position: "absolute",
                        left: `${(priceRange.min / 100) * 100}%`,
                        top: "-6px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#1890ff",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                      }}
                      onMouseDown={handlePriceSliderStart("min")}
                      onTouchStart={handlePriceSliderStart("min")}
                    ></View>
                    <View
                      style={{
                        position: "absolute",
                        left: `${(priceRange.max / 100) * 100}%`,
                        top: "-6px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#1890ff",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                      }}
                      onMouseDown={handlePriceSliderStart("max")}
                      onTouchStart={handlePriceSliderStart("max")}
                    ></View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "12px",
                    }}
                  >
                    <Text style={{ fontSize: "12px", color: "#666" }}>¥0</Text>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      ¥{priceRange.min}-¥{priceRange.max}
                    </Text>
                    <Text style={{ fontSize: "12px", color: "#666" }}>
                      ¥100以上
                    </Text>
                  </View>
                </View>

                {/* 价格输入区域 */}
                <View
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px",
                    padding: "0 24px",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      最低价格
                    </Text>
                    <View
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginRight: "8px",
                        }}
                      >
                        ¥
                      </Text>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          const clampedValue = Math.max(
                            0,
                            Math.min(100, value),
                          );
                          const roundedValue =
                            Math.round(clampedValue / 10) * 10;
                          setPriceRange((prev) => ({
                            min: Math.min(roundedValue, prev.max - 10),
                            max: prev.max,
                          }));
                        }}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          color: "#333",
                        }}
                        min="0"
                        max="100"
                        step="10"
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      最高价格
                    </Text>
                    <View
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginRight: "8px",
                        }}
                      >
                        ¥
                      </Text>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          const clampedValue = Math.max(
                            0,
                            Math.min(100, value),
                          );
                          const roundedValue =
                            Math.round(clampedValue / 10) * 10;
                          setPriceRange((prev) => ({
                            min: prev.min,
                            max: Math.max(roundedValue, prev.min + 10),
                          }));
                        }}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          color: "#333",
                        }}
                        min="0"
                        max="100"
                        step="10"
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  {["¥50以下", "¥50-80", "¥80-100", "¥100以上"].map(
                    (item, index) => (
                      <View
                        key={index}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #e0e0e0",
                          backgroundColor: "#f8f8f8",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Selecting price:", item);
                          // 根据选择的区间更新价格范围
                          if (item === "¥50以下") {
                            setPriceRange({ min: 0, max: 50 });
                          } else if (item === "¥50-80") {
                            setPriceRange({ min: 50, max: 80 });
                          } else if (item === "¥80-100") {
                            setPriceRange({ min: 80, max: 100 });
                          } else if (item === "¥100以上") {
                            setPriceRange({ min: 100, max: 100 });
                          }
                        }}
                      >
                        <Text style={{ fontSize: "12px", color: "#666" }}>
                          {item}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
              <View style={{ marginBottom: "16px" }}>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#333",
                    marginBottom: "12px",
                    display: "block",
                  }}
                >
                  星级/档次
                </Text>
                <View style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[
                    "2星及以下",
                    "3星/星",
                    "4星/星",
                    "5星/星",
                    "经济型",
                    "舒适型",
                    "高档型",
                    "豪华型",
                  ].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#f8f8f8",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Selecting star rating:", item);
                        setShowPriceDropdown(false);
                      }}
                    >
                      <Text style={{ fontSize: "12px", color: "#666" }}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* 操作按钮 */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                marginTop: "32px",
              }}
            >
              {/* 清除按钮 */}
              <View
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                onClick={() => {
                  // 恢复默认值
                  setPriceRange({ min: 0, max: 100 });
                }}
              >
                <Text style={{ fontSize: "16px", color: "#333" }}>清除</Text>
              </View>

              {/* 确定按钮 */}
              <View
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#1890ff",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                onClick={() => {
                  setShowPriceDropdown(false);
                }}
              >
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  确定
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 筛选下拉框 */}
        {showFilterDropdown && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "#fff",
              borderRadius: "0 0 8px 8px",
              padding: "16px",
              margin: "0 auto",
              width: "100%",
              maxWidth: "100%",
              minHeight: "300px",
              maxHeight: "70vh",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <View style={{ display: "flex", height: "calc(70vh - 80px)" }}>
              {/* 左侧分类 */}
              <View
                style={{
                  width: "25%",
                  maxWidth: "120px",
                  borderRight: "1px solid #f0f0f0",
                  paddingRight: "8px",
                  zIndex: 1,
                  overflowY: "auto",
                }}
              >
                {[
                  "热门筛选",
                  "品牌",
                  "类型特色",
                  "设施",
                  "床型",
                  "房间面积",
                  "点评",
                  "服务/支付",
                  "适用人群",
                ].map((category) => (
                  <View
                    key={category}
                    style={{
                      padding: "10px 6px",
                      textAlign: "center",
                      borderRadius: "4px",
                      backgroundColor:
                        category === activeFilterCategory ? "#f0f8ff" : "#fff",
                      borderLeft:
                        category === activeFilterCategory
                          ? "3px solid #1890ff"
                          : "3px solid transparent",
                      marginBottom: "6px",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Selecting filter category:", category);
                      setActiveFilterCategory(category);

                      // 滚动定位到右侧对应分类标签区域
                      const rightContainer = document.querySelector(
                        ".filter-right-container",
                      );
                      if (rightContainer) {
                        // 使用data属性定位元素，避免CSS选择器中的特殊字符问题
                        const categoryElements =
                          rightContainer.querySelectorAll("[data-category]");
                        let categoryElement: HTMLElement | null = null;

                        categoryElements.forEach((element) => {
                          if (
                            element.getAttribute("data-category") === category
                          ) {
                            categoryElement = element as HTMLElement;
                          }
                        });

                        if (categoryElement) {
                          rightContainer.scrollTo({
                            top: categoryElement.offsetTop - 20,
                            behavior: "smooth",
                          });
                        }
                      }
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "12px",
                        color:
                          category === activeFilterCategory
                            ? "#1890ff"
                            : "#333",
                      }}
                    >
                      {category}
                    </Text>
                  </View>
                ))}
              </View>
              {/* 右侧选项 */}
              <View
                style={{ flex: 1, paddingLeft: "12px", overflowY: "auto" }}
                className="filter-right-container"
              >
                {/* 热门筛选 */}
                <View
                  className="filter-category-热门筛选"
                  data-category="热门筛选"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      热门筛选
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          热门筛选: !prev["热门筛选"],
                        }));
                      }}
                    >
                      {expandedCategories["热门筛选"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "免费WiFi",
                      "停车场",
                      "游泳池",
                      "健身房",
                      "餐厅",
                      "无烟房",
                      "商务中心",
                      "会议室",
                      "SPA",
                      "24小时前台",
                      "行李寄存",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["热门筛选"] && index < 6) ||
                          expandedCategories["热门筛选"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 品牌 */}
                <View
                  className="filter-category-品牌"
                  data-category="品牌"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      品牌
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          品牌: !prev["品牌"],
                        }));
                      }}
                    >
                      {expandedCategories["品牌"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "希尔顿",
                      "万豪",
                      "洲际",
                      "凯悦",
                      "雅高",
                      "精选酒店",
                      "皇冠假日",
                      "四季",
                      "丽思卡尔顿",
                      "温德姆",
                      "喜来登",
                      "索菲特",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["品牌"] && index < 6) ||
                          expandedCategories["品牌"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 类型特色 */}
                <View
                  className="filter-category-类型特色"
                  data-category="类型特色"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      类型特色
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          类型特色: !prev["类型特色"],
                        }));
                      }}
                    >
                      {expandedCategories["类型特色"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "经济型",
                      "舒适型",
                      "高档型",
                      "豪华型",
                      "精品酒店",
                      "主题酒店",
                      "度假酒店",
                      "商务酒店",
                      "公寓酒店",
                      "民宿",
                      "别墅",
                      "青年旅舍",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["类型特色"] && index < 6) ||
                          expandedCategories["类型特色"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 设施 */}
                <View
                  className="filter-category-设施"
                  data-category="设施"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      设施
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          设施: !prev["设施"],
                        }));
                      }}
                    >
                      {expandedCategories["设施"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "免费WiFi",
                      "停车场",
                      "游泳池",
                      "健身房",
                      "餐厅",
                      "商务中心",
                      "会议室",
                      "SPA",
                      "24小时前台",
                      "行李寄存",
                      "洗衣服务",
                      "接机服务",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["设施"] && index < 6) ||
                          expandedCategories["设施"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 床型 */}
                <View
                  className="filter-category-床型"
                  data-category="床型"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      床型
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          床型: !prev["床型"],
                        }));
                      }}
                    >
                      {expandedCategories["床型"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "大床房",
                      "双床房",
                      "套房",
                      "亲子房",
                      "家庭房",
                      "无烟房",
                      "单人房",
                      "三人房",
                      "四人房",
                      "连通房",
                      "无障碍房",
                      "海景房",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["床型"] && index < 6) ||
                          expandedCategories["床型"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 房间面积 */}
                <View
                  className="filter-category-房间面积"
                  data-category="房间面积"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      房间面积
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          房间面积: !prev["房间面积"],
                        }));
                      }}
                    >
                      {expandedCategories["房间面积"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "20㎡以下",
                      "20-30㎡",
                      "30-40㎡",
                      "40-50㎡",
                      "50-60㎡",
                      "60㎡以上",
                      "60-70㎡",
                      "70-80㎡",
                      "80-90㎡",
                      "90-100㎡",
                      "100㎡以上",
                      "超大空间",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["房间面积"] && index < 6) ||
                          expandedCategories["房间面积"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 点评 */}
                <View
                  className="filter-category-点评"
                  data-category="点评"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      点评
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          点评: !prev["点评"],
                        }));
                      }}
                    >
                      {expandedCategories["点评"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "4.5分以上",
                      "4分以上",
                      "有图点评",
                      "安静",
                      "干净",
                      "服务好",
                      "性价比高",
                      "交通便利",
                      "周边繁华",
                      "环境优雅",
                      "隔音好",
                      "视野好",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["点评"] && index < 6) ||
                          expandedCategories["点评"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 服务/支付 */}
                <View
                  className="filter-category-服务/支付"
                  data-category="服务/支付"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      服务/支付
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          "服务/支付": !prev["服务/支付"],
                        }));
                      }}
                    >
                      {expandedCategories["服务/支付"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "免费停车",
                      "免费早餐",
                      "洗衣服务",
                      "接送服务",
                      "刷卡支付",
                      "移动支付",
                      "叫醒服务",
                      "行李寄存",
                      "租车服务",
                      "叫车服务",
                      "外币兑换",
                      "优惠券",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["服务/支付"] && index < 6) ||
                          expandedCategories["服务/支付"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* 适用人群 */}
                <View
                  className="filter-category-适用人群"
                  data-category="适用人群"
                  style={{ marginBottom: "24px" }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      适用人群
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#1890ff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategories((prev) => ({
                          ...prev,
                          适用人群: !prev["适用人群"],
                        }));
                      }}
                    >
                      {expandedCategories["适用人群"] ? "收起" : "展开"}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "亲子",
                      "情侣",
                      "商务",
                      "家庭",
                      "朋友",
                      " solo旅行",
                      "老年人",
                      "残疾人",
                      "学生",
                      "宠物友好",
                      "新婚",
                      "团队",
                    ]
                      .filter(
                        (_, index) =>
                          (!expandedCategories["适用人群"] && index < 6) ||
                          expandedCategories["适用人群"],
                      )
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${selectedTags.includes(item) ? "#1890ff" : "#e0e0e0"}`,
                            backgroundColor: selectedTags.includes(item)
                              ? "#e6f7ff"
                              : "#f8f8f8",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Selecting filter:", item);

                            if (selectedTags.includes(item)) {
                              setSelectedTags(
                                selectedTags.filter((tag) => tag !== item),
                              );
                            } else {
                              setSelectedTags([...selectedTags, item]);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              color: selectedTags.includes(item)
                                ? "#1890ff"
                                : "#666",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 城市选择器下拉框 */}
      {showCityPicker && (
        <View
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            backgroundColor: "#fff",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "300px",
            maxHeight: "70vh",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            boxSizing: "border-box",
            padding: "0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {HOT_CITIES.map((city) => (
            <View
              key={city.value}
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                color: "#333",
                cursor: "pointer",
                borderBottom:
                  city.value !== HOT_CITIES[HOT_CITIES.length - 1].value
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
              onClick={() => handleCitySelect(city.value)}
            >
              <Text>{city.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 日期选择器 - 日历视图 */}
      {showDatePicker && (
        <View
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            backgroundColor: "#fff",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "320px",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            boxSizing: "border-box",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <View
            style={{
              paddingBottom: "16px",
              borderBottom: "1px solid #f0f0f0",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}
            >
              选择日期
            </Text>
          </View>

          {/* 日历头部 - 月份和星期 */}
          <View style={{ marginBottom: "16px" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                gap: "16px",
              }}
            >
              <View
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // 上一个月
                  if (currentMonth === 1) {
                    setCurrentMonth(12);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
              >
                <Text style={{ fontSize: "14px", color: "#333" }}>‹</Text>
              </View>
              <Text
                style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
              >
                {currentYear}年{currentMonth}月
              </Text>
              <View
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // 下一个月
                  if (currentMonth === 12) {
                    setCurrentMonth(1);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
              >
                <Text style={{ fontSize: "14px", color: "#333" }}>›</Text>
              </View>
            </View>
            <View
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "4px",
                marginBottom: "8px",
              }}
            >
              {["日", "一", "二", "三", "四", "五", "六"].map((day, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>
          </View>

          {/* 日历主体 - 日期格子 */}
          <View
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
            }}
          >
            {/* 计算当前月份的天数 */}
            {(() => {
              // 计算当前月份的天数
              const daysInMonth = new Date(
                currentYear,
                currentMonth,
                0,
              ).getDate();
              // 计算当前月份第一天是星期几 (0-6, 0表示星期日)
              const firstDayOfMonth = new Date(
                currentYear,
                currentMonth - 1,
                1,
              ).getDay();
              console.log(
                `当前月份: ${currentYear}-${currentMonth}, 第一天是星期${firstDayOfMonth}, 共有${daysInMonth}天`,
              );

              // 生成日历格子
              const calendarCells = [];

              // 添加前面的空白格子
              for (let i = 0; i < firstDayOfMonth; i++) {
                calendarCells.push(
                  <View
                    key={`empty-${i}`}
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Text style={{ fontSize: "14px", color: "#999" }}></Text>
                  </View>,
                );
              }

              // 添加日期格子
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                const isStartDate = selectedDate.start === dateStr;
                const isEndDate = selectedDate.end === dateStr;

                let isBetweenDate = false;
                if (selectedDate.start && selectedDate.end) {
                  const startDate = new Date(selectedDate.start);
                  const endDate = new Date(selectedDate.end);
                  const currentDate = new Date(dateStr);
                  isBetweenDate =
                    currentDate > startDate && currentDate < endDate;
                }

                let backgroundColor = "#fff";
                if (isStartDate || isEndDate) {
                  backgroundColor = "#1890ff";
                } else if (isBetweenDate) {
                  backgroundColor = "#e6f7ff";
                }

                let textColor = "#333";
                if (isStartDate || isEndDate) {
                  textColor = "#fff";
                }

                calendarCells.push(
                  <View
                    key={`day-${day}`}
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor: backgroundColor,
                      border: "1px solid #e8e8e8",
                    }}
                    onClick={() => {
                      if (
                        !selectedDate.start ||
                        (selectedDate.start && selectedDate.end)
                      ) {
                        setSelectedDate({ start: dateStr, end: null });
                      } else if (selectedDate.start && !selectedDate.end) {
                        const startDate = new Date(selectedDate.start);
                        const currentDate = new Date(dateStr);
                        if (currentDate < startDate) {
                          setSelectedDate({
                            start: dateStr,
                            end: selectedDate.start,
                          });
                        } else {
                          setSelectedDate({
                            start: selectedDate.start,
                            end: dateStr,
                          });
                        }
                      }
                    }}
                  >
                    <Text style={{ fontSize: "14px", color: textColor }}>
                      {day}
                    </Text>
                  </View>,
                );
              }

              // 添加后面的空白格子，确保最后一行也是7个格子
              const totalCells = calendarCells.length;
              const remainingCells = 7 - (totalCells % 7);
              if (remainingCells < 7) {
                for (let i = 0; i < remainingCells; i++) {
                  calendarCells.push(
                    <View
                      key={`empty-end-${i}`}
                      style={{
                        aspectRatio: "1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <Text style={{ fontSize: "14px", color: "#999" }}></Text>
                    </View>,
                  );
                }
              }

              return calendarCells;
            })()}
          </View>

          {/* 底部按钮 */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <View
              style={{
                padding: "10px 20px",
                borderRadius: "4px",
                border: "1px solid #d9d9d9",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedDate({ start: null, end: null });
                setShowDatePicker(false);
              }}
            >
              <Text style={{ fontSize: "14px", color: "#333" }}>取消</Text>
            </View>
            <View
              style={{
                padding: "10px 20px",
                borderRadius: "4px",
                backgroundColor: "#1890ff",
                cursor: "pointer",
              }}
              onClick={() => {
                if (selectedDate.start && selectedDate.end) {
                  const start = new Date(selectedDate.start);
                  const end = new Date(selectedDate.end);
                  handleDateSelect([start, end]);
                }
                setShowDatePicker(false);
              }}
            >
              <Text style={{ fontSize: "14px", color: "#fff" }}>确定</Text>
            </View>
          </View>
        </View>
      )}

      {/* 入住信息选择器下拉框 - 新样式 */}
      {showRoomPicker && (
        <View
          style={{
            position: "fixed",
            top: "50px",
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            padding: "16px",
            margin: "16px",
            maxWidth: "calc(100% - 32px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <View
            style={{
              paddingBottom: "16px",
              borderBottom: "1px solid #f0f0f0",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}
            >
              选择客房和入住人数
            </Text>
          </View>

          <View
            style={{
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Text
              style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}
            >
              <Text style={{ color: "#1890ff", marginRight: "4px" }}>i</Text>
              入住人数较多时，试试增加间数
            </Text>
          </View>

          {/* 间数选择 */}
          <View
            style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Text style={{ fontSize: "16px", color: "#333" }}>间数</Text>
              <View
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <View
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "1px solid #d9d9d9",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: params.rooms > 1 ? "#fff" : "#f5f5f5",
                  }}
                  onClick={() => {
                    if (params.rooms > 1) {
                      handleParamChange("rooms", params.rooms - 1);
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      color: params.rooms > 1 ? "#333" : "#999",
                    }}
                  >
                    -
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {params.rooms}
                </Text>
                <View
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "1px solid #1890ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#e6f7ff",
                  }}
                  onClick={() => {
                    handleParamChange("rooms", params.rooms + 1);
                  }}
                >
                  <Text style={{ fontSize: "16px", color: "#1890ff" }}>+</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 成人数选择 */}
          <View
            style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Text style={{ fontSize: "16px", color: "#333" }}>成人数</Text>
              <View
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <View
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "1px solid #d9d9d9",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: params.adults > 1 ? "#fff" : "#f5f5f5",
                  }}
                  onClick={() => {
                    if (params.adults > 1) {
                      handleParamChange("adults", params.adults - 1);
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      color: params.adults > 1 ? "#333" : "#999",
                    }}
                  >
                    -
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {params.adults}
                </Text>
                <View
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "1px solid #1890ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#e6f7ff",
                  }}
                  onClick={() => {
                    handleParamChange("adults", params.adults + 1);
                  }}
                >
                  <Text style={{ fontSize: "16px", color: "#1890ff" }}>+</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 儿童数选择 */}
          <View style={{ padding: "16px 0" }}>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  儿童数
                </Text>
                <Text style={{ fontSize: "12px", color: "#999" }}>0-17岁</Text>
              </View>
              <View
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <View
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "1px solid #d9d9d9",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: params.children > 0 ? "#fff" : "#f5f5f5",
                  }}
                  onClick={() => {
                    if (params.children > 0) {
                      handleParamChange("children", params.children - 1);
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      color: params.children > 0 ? "#333" : "#999",
                    }}
                  >
                    -
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {params.children}
                </Text>
                <View
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "1px solid #1890ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#e6f7ff",
                  }}
                  onClick={() => {
                    handleParamChange("children", params.children + 1);
                  }}
                >
                  <Text style={{ fontSize: "16px", color: "#1890ff" }}>+</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 操作按钮 */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            {/* 清除按钮 */}
            <View
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
              onClick={() => {
                // 恢复默认值
                handleParamChange("rooms", 1);
                handleParamChange("adults", 2);
                handleParamChange("children", 0);
              }}
            >
              <Text style={{ fontSize: "16px", color: "#333" }}>清除</Text>
            </View>

            {/* 确定按钮 */}
            <View
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "#1890ff",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
              onClick={() => {
                setShowRoomPicker(false);
              }}
            >
              <Text
                style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}
              >
                确定
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 错误提示 */}
      {Object.keys(validationErrors).length > 0 && (
        <View className="error-messages">
          {Object.values(validationErrors).map((error, index) => (
            <Text key={index} className="error-message">
              {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
