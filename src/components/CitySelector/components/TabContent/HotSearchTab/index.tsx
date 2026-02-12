import React from "react";
import { View, ScrollView } from "@tarojs/components";
import { HotSearchItems } from "./components/HotSearchItems";
import { RankingList } from "./components/RankingList";
import { hotSearchTags, rankingLists } from "../../../utils/hotSearchData";
import "./HotSearchTab.less";

interface HotSearchTabProps {
  onSelect: (item: string) => void;
  hotSearchList?: string[];
}

export const HotSearchTab: React.FC<HotSearchTabProps> = ({
  onSelect,
  hotSearchList = [],
}) => {
  // 使用mock数据中的hotSearchList，如果没有则使用默认的hotSearchTags
  const items = hotSearchList.length > 0 ? hotSearchList : hotSearchTags;

  return (
    <View className="hot-search-tab">
      <View className="hot-search-content">
        <HotSearchItems items={items} onSelect={onSelect} />

        <ScrollView scrollX className="ranking-lists-scroll" enableFlex>
          {rankingLists.map((list, index) => (
            <View key={index} className="ranking-list-wrapper">
              <RankingList ranking={list} onSelect={onSelect} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
