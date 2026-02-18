import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./HotelCard.less";
import { Hotel } from "../../services/hotel";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotel.id}`,
    });
  };

  return (
    <View className="hotel-card" onClick={handleCardClick}>
      {/* 酒店图片 */}
      <View className="hotel-image">
        <Image
          src={hotel.imageUrl}
          mode="aspectFill"
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      {/* 酒店信息 */}
      <View className="hotel-info">
        {/* 酒店名称 */}
        <Text className="hotel-name">{hotel.name}</Text>

        {/* 评分和评价 */}
        <View className="hotel-rating">
          <Text className="rating">{hotel.rating}</Text>
          <Text className="rating-label">超棒</Text>
          <Text className="review-count">{hotel.reviewCount}点评</Text>
          <Text className="favorite-count">
            · {Math.floor(hotel.reviewCount * 10)}收藏
          </Text>
        </View>

        {/* 位置信息 */}
        <Text className="hotel-location">
          近{hotel.address.split("市")[1]?.split("区")[1] || hotel.address}
        </Text>

        {/* 酒店特色 */}
        <Text className="hotel-feature">{hotel.description}</Text>

        {/* 标签 */}
        <View className="hotel-tags">
          {hotel.tags.map((tag, tagIndex) => (
            <View key={tagIndex} className="tag">
              <Text>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 价格信息 */}
        <View className="hotel-price">
          <Text className="price-label">4小时</Text>
          <View className="price-info">
            <Text className="price">¥{hotel.minPrice}</Text>
            <Text className="price-unit">起</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
