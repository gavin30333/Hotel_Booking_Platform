import { View, Text, Image, ScrollView } from '@tarojs/components'
import './HotelRanking.less'

interface Hotel {
  name: string
  desc: string
}

interface HotelRankingProps {
  luxuryHotels: Hotel[]
  familyHotels: Hotel[]
}

export default function HotelRanking({ luxuryHotels, familyHotels }: HotelRankingProps) {
  return (
    <View className="hotel-ranking-section">
      <ScrollView scrollX className="ranking-lists-scroll" enableFlex>
        {/* 奢华酒店榜单 */}
        <View className="ranking-list-wrapper">
          <View className="ranking-list-card">
            <View className="ranking-header-card">
              <Text className="ranking-title-card">🏆 奢华酒店榜</Text>
              <Text className="ranking-more">更多酒店 {'>'}</Text>
            </View>
            <View className="ranking-items">
              {luxuryHotels.map((hotel, index) => (
                <View key={index} className="ranking-item">
                  <View className="item-image-box">
                    <Image
                      src={`https://picsum.photos/100/100?random=${index}`}
                      className="item-image"
                      mode="aspectFill"
                    />
                    <View className={`rank-badge rank-${index + 1}`}>
                      {index + 1}
                    </View>
                  </View>
                  <View className="item-info">
                    <Text className="item-name">{hotel.name}</Text>
                    <View className="item-meta">
                      <Text className="item-score">4.{8 - index}</Text>
                      <Text className="item-desc">{hotel.desc}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 亲子酒店榜单 */}
        <View className="ranking-list-wrapper">
          <View className="ranking-list-card">
            <View className="ranking-header-card">
              <Text className="ranking-title-card">🏆 亲子酒店榜</Text>
              <Text className="ranking-more">更多酒店 {'>'}</Text>
            </View>
            <View className="ranking-items">
              {familyHotels.map((hotel, index) => (
                <View key={index} className="ranking-item">
                  <View className="item-image-box">
                    <Image
                      src={`https://picsum.photos/100/100?random=${index + 10}`}
                      className="item-image"
                      mode="aspectFill"
                    />
                    <View className={`rank-badge rank-${index + 1}`}>
                      {index + 1}
                    </View>
                  </View>
                  <View className="item-info">
                    <Text className="item-name">{hotel.name}</Text>
                    <View className="item-meta">
                      <Text className="item-score">4.{7 - index}</Text>
                      <Text className="item-desc">{hotel.desc}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
