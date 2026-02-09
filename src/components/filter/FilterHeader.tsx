import { View, Text, ScrollView } from "@tarojs/components";
import "./FilterHeader.less";

interface FilterHeaderProps {
  filters: {
    sortBy: "price_asc" | "price_desc" | "rating_desc" | "distance_asc";
    starRating: number[];
    facilities: string[];
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterHeader({
  filters,
  onFilterChange,
}: FilterHeaderProps) {
  // 排序选项
  const sortOptions = [
    { key: "price_asc", label: "价格从低到高" },
    { key: "price_desc", label: "价格从高到低" },
    { key: "rating_desc", label: "评分从高到低" },
    { key: "distance_asc", label: "距离从近到远" },
  ];

  // 处理排序方式变化
  const handleSortChange = (
    sortBy: "price_asc" | "price_desc" | "rating_desc" | "distance_asc",
  ) => {
    onFilterChange({ sortBy });
  };

  // 处理筛选按钮点击
  const handleFilterClick = () => {
    // 这里可以打开详细筛选面板
    console.log("Open filter panel");
  };

  return (
    <View className="filter-header">
      <ScrollView horizontal scrollX showsHorizontalScrollIndicator={false}>
        {/* 排序选项 */}
        <View className="filter-item">
          <Text className="filter-label">排序</Text>
          <View className="filter-options">
            {sortOptions.map((option) => (
              <View
                key={option.key}
                className={`filter-option ${filters.sortBy === option.key ? "active" : ""}`}
                onClick={() => handleSortChange(option.key as any)}
              >
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 价格筛选 */}
        <View className="filter-item">
          <Text className="filter-label">价格</Text>
          <View className="filter-button" onClick={handleFilterClick}>
            <Text>不限</Text>
          </View>
        </View>

        {/* 星级筛选 */}
        <View className="filter-item">
          <Text className="filter-label">星级</Text>
          <View className="filter-button" onClick={handleFilterClick}>
            <Text>
              {filters.starRating.length > 0
                ? `${filters.starRating.join(",")}星`
                : "不限"}
            </Text>
          </View>
        </View>

        {/* 设施筛选 */}
        <View className="filter-item">
          <Text className="filter-label">设施</Text>
          <View className="filter-button" onClick={handleFilterClick}>
            <Text>
              {filters.facilities.length > 0
                ? `${filters.facilities.length}项`
                : "不限"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
