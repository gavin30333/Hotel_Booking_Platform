import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import { Grid } from "antd-mobile";
import { RegionSidebar } from "./components/RegionSidebar";
import { ImageCard } from "../../common/ImageCard";
import { CityTag } from "../../common/CityTag";
import { overseasCategories } from "../../../utils/overseasData";
import { CityGroup, OverseasCategory } from "../../../../types";
import "./OverseasTab.less";

interface OverseasTabProps {
  onSelect: (city: string) => void;
  overseasHotCities?: string[];
  overseasCities?: CityGroup[];
}

export const OverseasTab: React.FC<OverseasTabProps> = ({
  onSelect,
  overseasHotCities = [],
  overseasCities = [],
}) => {
  const [activeKey, setActiveKey] = useState<string>(overseasCategories[0].key);

  const currentCategory =
    overseasCategories.find((c) => c.key === activeKey) ||
    overseasCategories[0];

  return (
    <View className="overseas-tab">
      <View className="sidebar-container">
        <RegionSidebar
          categories={overseasCategories}
          activeKey={activeKey}
          onChange={setActiveKey}
        />
      </View>

      <View className="content-container">
        <View className="category-content">
          <Text className="category-title">
            {currentCategory.subTitle || currentCategory.title}
          </Text>

          {/* Render Hot Destinations with Images if available */}
          {currentCategory.hotDestinations && (
            <View className="hot-destinations-grid">
              <Grid columns={2} gap={8}>
                {currentCategory.hotDestinations.map((city, index) => (
                  <Grid.Item key={index} onClick={() => onSelect(city.name)}>
                    <ImageCard
                      title={city.name}
                      subTitle={city.description}
                      imageUrl={city.imageUrl}
                      tag={city.tag}
                      height={100}
                    />
                  </Grid.Item>
                ))}
              </Grid>
            </View>
          )}

          {/* Render Regular Cities as Tags/Grid */}
          {currentCategory.cities && (
            <View className="cities-list-section">
              {currentCategory.hotDestinations && <View className="divider" />}
              <View className="cities-tags">
                {currentCategory.cities.map((city, index) => (
                  <CityTag
                    key={index}
                    text={city.tag ? `${city.name} ${city.tag}` : city.name}
                    onClick={() => onSelect(city.name)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Render mock overseas hot cities if available */}
          {overseasHotCities.length > 0 && activeKey === "hot" && (
            <View className="cities-list-section">
              <View className="divider" />
              <Text className="category-title">热门海外城市</Text>
              <View className="cities-tags">
                {overseasHotCities.map((city, index) => (
                  <CityTag
                    key={index}
                    text={city}
                    onClick={() => onSelect(city)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
