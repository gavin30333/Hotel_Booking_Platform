import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { DEFAULT_HOTEL_IMAGE } from '../../constants'
import './ImageCarousel.less'

interface ImageCarouselProps {
  images: string[]
  onImageClick: (index: number) => void
}

export default function ImageCarousel({ images, onImageClick }: ImageCarouselProps) {
  return (
    <View className="image-carousel">
      <Swiper
        className="swiper"
        indicatorDots
        indicatorColor="rgba(255, 255, 255, 0.5)"
        indicatorActiveColor="#fff"
        autoplay
        interval={3000}
        duration={500}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <SwiperItem key={index}>
              <View
                className="image-container"
                onClick={() => onImageClick(index)}
              >
                <Image
                  src={image}
                  mode="aspectFill"
                  className="carousel-image"
                />
              </View>
            </SwiperItem>
          ))
        ) : (
          <SwiperItem>
            <View className="image-container">
              <Image
                src={DEFAULT_HOTEL_IMAGE}
                mode="aspectFill"
                className="carousel-image"
              />
            </View>
          </SwiperItem>
        )}
      </Swiper>
      <View className="carousel-tabs">
        <Text className="tab-item active">封面</Text>
        <Text className="tab-item">精选</Text>
        <Text className="tab-item">位置</Text>
        <Text className="tab-item">点评</Text>
        <Text className="tab-item">相册</Text>
      </View>
    </View>
  )
}
