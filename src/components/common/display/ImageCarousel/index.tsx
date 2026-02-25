import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { DEFAULT_HOTEL_IMAGE } from '@/constants'
import { useState, useRef, useMemo } from 'react'
import { ImageViewer } from 'antd-mobile'
import './ImageCarousel.less'

interface CarouselItem {
  id: string
  url: string
  category: string
  title: string
}

interface ImageCarouselProps {
  images?: string[]
  items?: CarouselItem[]
  /** @deprecated onImageClick is no longer supported */
  onImageClick?: (index: number) => void
}

export default function ImageCarousel({ images = [], items }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewerVisible, setViewerVisible] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const lastClickTimeRef = useRef<number>(0)

  // Determine if we are using items or images
  const hasItems = items && items.length > 0

  const sortedItems = useMemo(() => {
    if (!hasItems) return []
    const priority = ["封面", "精选", "位置", "点评", "相册"]
    return [...items!].sort((a, b) => {
      const indexA = priority.indexOf(a.category)
      const indexB = priority.indexOf(b.category)
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return 0
    })
  }, [items, hasItems])

  const displayImages = useMemo(() => {
    if (hasItems) {
      return sortedItems.map(item => item.url)
    }
    return images
  }, [hasItems, sortedItems, images])

  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    if (!hasItems) return []
    return Array.from(new Set(sortedItems.map(item => item.category)))
  }, [sortedItems, hasItems])

  // Map categories to their starting index
  const categoryStartIndices = useMemo(() => {
    if (!hasItems) return {}
    const indices: Record<string, number> = {}
    uniqueCategories.forEach(cat => {
      indices[cat] = sortedItems.findIndex(item => item.category === cat)
    })
    return indices
  }, [sortedItems, uniqueCategories, hasItems])

  // Determine current category based on current index
  const currentCategory = useMemo(() => {
    if (!hasItems) return null
    return sortedItems[currentIndex]?.category
  }, [currentIndex, sortedItems, hasItems])

  const handleImageClick = (index: number) => {
    setViewerIndex(index)
    setViewerVisible(true)
  }

  const handleTabClick = (category: string, e: any) => {
    e.stopPropagation()
    const index = categoryStartIndices[category]
    if (index !== undefined) {
      setCurrentIndex(index)
    }
  }

  return (
    <View className="image-carousel">
      <Swiper
        className="swiper"
        autoplay={!viewerVisible}
        interval={3000}
        duration={500}
        current={currentIndex}
        onChange={(e) => setCurrentIndex(e.detail.current)}
        circular
      >
        {displayImages.length > 0 ? (
          displayImages.map((image, index) => (
            <SwiperItem key={index}>
              <View
                className="image-container"
                onClick={() => handleImageClick(index)}
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

      {hasItems && uniqueCategories.length > 0 && (
        <View className="carousel-tabs">
          {uniqueCategories.map(cat => (
            <View
              key={cat}
              className={`tab-item ${currentCategory === cat ? 'active' : ''}`}
              onClick={(e) => handleTabClick(cat, e)}
            >
              {cat}
            </View>
          ))}
        </View>
      )}

      {viewerVisible && (
        <ImageViewer.Multi
          images={displayImages}
          visible={viewerVisible}
          defaultIndex={viewerIndex}
          onClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  )
}
