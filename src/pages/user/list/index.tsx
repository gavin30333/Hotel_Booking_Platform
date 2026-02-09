import { View, Text, Image, ScrollView } from "@tarojs/components";
import { useLoad, useReachBottom, usePullDownRefresh } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import { useState, useRef, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import "./index.less";
import { useHotelList } from "../../../hooks/useHotelList";
import { useHotelStore } from "../../../store/hotelStore";
import HotelCard from "../../../components/common/HotelCard";
import CoreFilterHeader from "../../../components/filter/CoreFilterHeader";
import { Toast } from "antd-mobile";

export default function HotelList() {
  const { hotelList, loading, hasMore, error, refreshHotels, loadMore } =
    useHotelList();
  const { filters, setFilters } = useHotelStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showStayDurationPopover, setShowStayDurationPopover] = useState(false);
  const [showBrandPopover, setShowBrandPopover] = useState(false);
  const [showSortPopover, setShowSortPopover] = useState(false);
  const [stayDurationArrowUp, setStayDurationArrowUp] = useState(false);
  const [brandArrowUp, setBrandArrowUp] = useState(false);
  const [isLocalDropdownOpen, setIsLocalDropdownOpen] = useState(false);
  const [isCoreFilterDropdownOpen, setIsCoreFilterDropdownOpen] =
    useState(false);
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const listRef = useRef(null);
  const filterTagsRef = useRef(null);

  // 监听本地下拉框状态变化，更新isLocalDropdownOpen
  useEffect(() => {
    setIsLocalDropdownOpen(
      showStayDurationPopover || showBrandPopover || showSortPopover,
    );
  }, [showStayDurationPopover, showBrandPopover, showSortPopover]);

  // 监听所有下拉框状态变化，更新isAnyDropdownOpen
  useEffect(() => {
    setIsAnyDropdownOpen(isLocalDropdownOpen || isCoreFilterDropdownOpen);
  }, [isLocalDropdownOpen, isCoreFilterDropdownOpen]);

  // 点击外部区域关闭下拉框
  useEffect(() => {
    const handleClickOutside = () => {
      setShowStayDurationPopover(false);
      setStayDurationArrowUp(false);
      setShowBrandPopover(false);
      setBrandArrowUp(false);
      setShowSortPopover(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 使用从API获取的数据
  const displayHotels = hotelList;

  // 防抖处理的加载更多函数
  const debouncedLoadMore = useCallback(
    debounce(() => {
      if (hasMore && !loading) {
        loadMore();
      }
    }, 300),
    [hasMore, loading, loadMore],
  );

  // 检测滚动到底部
  const handleItemsRendered = useCallback(
    ({ visibleRange }) => {
      const lastVisibleIndex = visibleRange.end;
      if (lastVisibleIndex >= displayHotels.length - 1) {
        debouncedLoadMore();
      }
    },
    [displayHotels.length, debouncedLoadMore],
  );

  useLoad(() => {
    // 初始加载数据
    if (hotelList.length === 0) {
      loadMore();
    }
  });

  // 处理下拉刷新
  usePullDownRefresh(() => {
    handleRefresh();
  });

  // 监听触底加载更多（作为备用方案）
  useReachBottom(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  });

  // 处理下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshHotels();
    setRefreshing(false);
    // 停止下拉刷新动画
    Taro.stopPullDownRefresh();
  };

  // 处理搜索
  const handleSearch = (params) => {
    // 转换参数结构以匹配hotelStore的期望
    const formattedFilters = {
      city: params.city,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      minPrice: params.priceRange?.min || 0,
      maxPrice: params.priceRange?.max || 10000,
      starRating: params.starRating || [],
      facilities: params.facilities || [],
    };
    setFilters(formattedFilters);
    // 重新加载酒店列表
    refreshHotels();
  };

  // 处理排序
  const handleSort = (sortBy) => {
    setFilters({ sortBy });
    // 重新加载酒店列表
    refreshHotels();
  };

  // 处理入住时长选择
  const handleStayDurationSelect = (value) => {
    setShowStayDurationPopover(false);
    Toast.show({
      content: `选择了${value}晚`,
      type: "success",
    });
    // 添加筛选逻辑
    const newFilters = { ...filters, stayDuration: value };
    setFilters(newFilters);
    // 重新加载酒店列表
    refreshHotels();
    // 模拟筛选效果 - 直接修改显示的酒店列表
    setTimeout(() => {
      Toast.show({
        content: "筛选成功，找到符合条件的酒店",
        type: "success",
      });
    }, 500);
  };

  // 处理品牌选择
  const handleBrandSelect = (value) => {
    setShowBrandPopover(false);
    Toast.show({
      content: `选择了${value}`,
      type: "success",
    });
    // 添加筛选逻辑
    const newFilters = { ...filters, brand: value };
    setFilters(newFilters);
    // 重新加载酒店列表
    refreshHotels();
    // 模拟筛选效果 - 直接修改显示的酒店列表
    setTimeout(() => {
      Toast.show({
        content: "筛选成功，找到符合条件的酒店",
        type: "success",
      });
    }, 500);
  };

  // 处理排序选择
  const handleSortSelect = (value) => {
    setShowSortPopover(false);
    Toast.show({
      content: `选择了${value}`,
      type: "success",
    });
    // 添加排序逻辑
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    // 重新加载酒店列表
    refreshHotels();
    // 模拟筛选效果 - 直接修改显示的酒店列表
    setTimeout(() => {
      Toast.show({
        content: "排序成功",
        type: "success",
      });
    }, 500);
  };

  // 排序选项
  const sortOptions = [
    { key: "price_asc", label: "价格从低到高" },
    { key: "price_desc", label: "价格从高到低" },
    { key: "rating_desc", label: "评分从高到低" },
    { key: "distance_asc", label: "距离从近到远" },
  ];

  // 入住时长选项
  const stayDurationOptions = [
    { label: "2小时以下", value: "2h-" },
    { label: "3小时", value: "3h" },
    { label: "4小时", value: "4h" },
    { label: "5小时以上", value: "5h+" },
  ];

  // 品牌选项
  const brandOptions = [
    { label: "希尔顿", value: "hilton" },
    { label: "万豪", value: "marriott" },
    { label: "洲际", value: "intercontinental" },
    { label: "凯悦", value: "hyatt" },
    { label: "雅高", value: "accor" },
    { label: "精选酒店", value: "selected" },
  ];

  return (
    <View
      className="hotel-list"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 顶部固定部分 */}
      <View style={{ position: "relative", zIndex: 100 }}>
        {/* 筛选头 */}
        <CoreFilterHeader
          onSearch={handleSearch}
          onDropdownStateChange={(isOpen) =>
            setIsCoreFilterDropdownOpen(isOpen)
          }
        />

        {/* 筛选区域 */}
        <View style={{ position: "relative" }}>
          {/* 筛选标签栏 */}
          <View className="filter-tags">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* 入住时长筛选 */}
              <View
                className="filter-tag"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStayDurationPopover(!showStayDurationPopover);
                  setStayDurationArrowUp(!showStayDurationPopover);
                  setShowBrandPopover(false);
                  setBrandArrowUp(false);
                  setShowSortPopover(false);
                }}
              >
                <Text>入住时长</Text>
                <Text className="arrow">{stayDurationArrowUp ? "▲" : "▼"}</Text>
              </View>

              {/* 热门品牌筛选 */}
              <View
                className="filter-tag"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBrandPopover(!showBrandPopover);
                  setBrandArrowUp(!showBrandPopover);
                  setShowStayDurationPopover(false);
                  setStayDurationArrowUp(false);
                  setShowSortPopover(false);
                }}
              >
                <Text>热门品牌</Text>
                <Text className="arrow">{brandArrowUp ? "▲" : "▼"}</Text>
              </View>

              {/* 4.5分以上 */}
              <View
                className={`filter-tag ${selectedFilters.includes("4.5分以上") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("4.5分以上")) {
                    // 应用4.5分以上筛选
                    const newFilters = { ...filters, minRating: 4.5 };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "4.5分以上"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选4.5分以上酒店",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>4.5分以上</Text>
                {selectedFilters.includes("4.5分以上") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消4.5分以上筛选
                      const newFilters = { ...filters };
                      delete newFilters.minRating;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "4.5分以上"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 大床房 */}
              <View
                className={`filter-tag ${selectedFilters.includes("大床房") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("大床房")) {
                    // 应用大床房筛选
                    const newFilters = { ...filters, roomType: "大床房" };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "大床房"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选大床房",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>大床房</Text>
                {selectedFilters.includes("大床房") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消大床房筛选
                      const newFilters = { ...filters };
                      delete newFilters.roomType;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "大床房"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 双床房 */}
              <View
                className={`filter-tag ${selectedFilters.includes("双床房") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("双床房")) {
                    // 应用双床房筛选
                    const newFilters = { ...filters, roomType: "双床房" };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "双床房"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选双床房",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>双床房</Text>
                {selectedFilters.includes("双床房") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消双床房筛选
                      const newFilters = { ...filters };
                      delete newFilters.roomType;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "双床房"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 套房 */}
              <View
                className={`filter-tag ${selectedFilters.includes("套房") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("套房")) {
                    // 应用套房筛选
                    const newFilters = { ...filters, roomType: "套房" };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "套房"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选套房",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>套房</Text>
                {selectedFilters.includes("套房") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消套房筛选
                      const newFilters = { ...filters };
                      delete newFilters.roomType;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "套房"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 亲子房 */}
              <View
                className={`filter-tag ${selectedFilters.includes("亲子房") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("亲子房")) {
                    // 应用亲子房筛选
                    const newFilters = { ...filters, roomType: "亲子房" };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "亲子房"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选亲子房",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>亲子房</Text>
                {selectedFilters.includes("亲子房") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消亲子房筛选
                      const newFilters = { ...filters };
                      delete newFilters.roomType;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "亲子房"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 家庭房 */}
              <View
                className={`filter-tag ${selectedFilters.includes("家庭房") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("家庭房")) {
                    // 应用家庭房筛选
                    const newFilters = { ...filters, roomType: "家庭房" };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "家庭房"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选家庭房",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>家庭房</Text>
                {selectedFilters.includes("家庭房") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消家庭房筛选
                      const newFilters = { ...filters };
                      delete newFilters.roomType;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "家庭房"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 无烟房 */}
              <View
                className={`filter-tag ${selectedFilters.includes("无烟房") ? "filter-tag-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedFilters.includes("无烟房")) {
                    // 应用无烟房筛选
                    const newFilters = { ...filters, smokeFree: true };
                    setFilters(newFilters);
                    setSelectedFilters([...selectedFilters, "无烟房"]);
                    refreshHotels();
                    Toast.show({
                      content: "已筛选无烟房",
                      type: "success",
                    });
                  }
                }}
              >
                <Text>无烟房</Text>
                {selectedFilters.includes("无烟房") && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 取消无烟房筛选
                      const newFilters = { ...filters };
                      delete newFilters.smokeFree;
                      setFilters(newFilters);
                      setSelectedFilters(
                        selectedFilters.filter((tag) => tag !== "无烟房"),
                      );
                      refreshHotels();
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>

          {/* 入住时长下拉框 */}
          {showStayDurationPopover && (
            <View
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                zIndex: 9999,
                backgroundColor: "#fff",
                borderRadius: "0 0 8px 8px",
                padding: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {stayDurationOptions.map((option) => (
                <View
                  key={option.value}
                  style={{
                    padding: "8px",
                    fontSize: "12px",
                    color: "#333",
                    cursor: "pointer",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "4px",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e8e8e8",
                  }}
                  onClick={() => handleStayDurationSelect(option.value)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 热门品牌下拉框 */}
          {showBrandPopover && (
            <View
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                zIndex: 9999,
                backgroundColor: "#fff",
                borderRadius: "0 0 8px 8px",
                padding: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {brandOptions.map((option) => (
                <View
                  key={option.value}
                  style={{
                    padding: "8px",
                    fontSize: "12px",
                    color: "#333",
                    cursor: "pointer",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "4px",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e8e8e8",
                  }}
                  onClick={() => handleBrandSelect(option.label)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 排序下拉框 */}
          {showSortPopover && (
            <View
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                zIndex: 9999,
                backgroundColor: "#fff",
                borderRadius: "0 0 8px 8px",
                padding: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {sortOptions.map((option) => (
                <View
                  key={option.key}
                  style={{
                    padding: "8px",
                    fontSize: "12px",
                    color: "#333",
                    cursor: "pointer",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "4px",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e8e8e8",
                  }}
                  onClick={() => handleSortSelect(option.label)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* 可滚动的酒店列表容器 */}
      <View style={{ flex: 1, position: "relative", overflow: "auto" }}>
        {/* 背景变暗覆盖层 */}
        {isAnyDropdownOpen && (
          <View
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        {/* 酒店列表 */}
        {loading ? (
          <View className="loading">
            <Text>筛选中...</Text>
          </View>
        ) : displayHotels.length > 0 ? (
          <ScrollView
            style={{ flex: 1, zIndex: 0 }}
            scrollY
            onScrollToLower={debouncedLoadMore}
            scrollWithAnimation
          >
            {displayHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <View className="loading-more">
                <Text>{loading ? "加载中..." : "上拉加载更多"}</Text>
              </View>
            )}

            {/* 无更多数据 */}
            {!hasMore && displayHotels.length > 0 && (
              <View className="loading-more">
                <Text>已加载全部酒店</Text>
              </View>
            )}

            {/* 错误提示 */}
            {error && (
              <View className="error">
                <Text>{error}</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="no-data" style={{ zIndex: 0 }}>
            <Text>暂无符合条件的酒店</Text>
            <Text style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              请尝试调整筛选条件
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
