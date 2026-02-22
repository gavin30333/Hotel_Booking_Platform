import React, { useEffect, useState } from 'react'
import { View, Text, ITouchEvent } from '@tarojs/components'
import { List } from 'antd-mobile'
import { CityGroup } from '@/types/citySelector'
import './CityIndexList.less'

interface CityIndexListProps {
  groups: CityGroup[]
  onSelect: (city: string) => void
  children?: React.ReactNode
  scrollEnabled?: boolean
}

export const CityIndexList: React.FC<CityIndexListProps> = ({
  groups,
  onSelect,
  children,
  // scrollEnabled = true // Unused in this component but kept in interface for consistency
}) => {
  const [activeIndex, setActiveIndex] = useState<string>('')

  // 计算侧边栏项：如果有 children（热门城市等），则添加“热门”，然后是各组标题
  const sidebarItems = [
    ...(children ? ['热门'] : []),
    ...groups.map((g) => g.title),
  ]

  const getHeaderHeight = () => {
    // 动态获取吸顶高度，包含搜索栏和Tabs头部
    // 搜索栏 ~50px, Tabs头部 ~42px
    return 92
  }

  const scrollToAnchor = (index: string) => {
    const id = `anchor-${index}`
    const element = document.getElementById(id)
    const container = document.querySelector('.city-selector-body')

    if (element && container) {
      const headerHeight = getHeaderHeight()
      const elementRect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      const relativeTop = elementRect.top - containerRect.top
      const targetScrollTop = container.scrollTop + relativeTop - headerHeight

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'auto'
      })

      setActiveIndex(index)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = getHeaderHeight()

      let currentActive = sidebarItems[0]

      for (const item of sidebarItems) {
        const element = document.getElementById(`anchor-${item}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          // 检查元素顶部是否接近视口顶部（考虑header高度）
          // 由于 sticky header 的存在，我们需要加上 headerHeight 的偏移量
          if (rect.top <= headerHeight + 10) {
            currentActive = item
          }
        }
      }

      setActiveIndex(currentActive)
    }

    // 使用 document.querySelector 可能会在组件未挂载时找不到元素
    // 但在这个 useEffect 中，组件已经挂载。
    // 为了更稳健，我们可以尝试通过 props 传入 container 的 ID 或 class，或者直接查找。
    const container = document.querySelector('.city-selector-body')
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // 初始化执行一次，设置正确的 activeIndex
      handleScroll()
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [sidebarItems])

  // 触摸滑动逻辑
  const handleTouchMove = (e: ITouchEvent) => {
    e.stopPropagation()

    // 获取触摸位置
    const touch = e.touches[0]
    const clientY = touch.clientY

    // 查找该位置下的元素
    const target = document.elementFromPoint(touch.clientX, clientY)
    if (!target) return

    // 检查是否是侧边栏项或在其内部
    const sidebarItem = target.closest('.sidebar-item')
    if (sidebarItem) {
      const index = sidebarItem.getAttribute('data-index')
      if (index && index !== activeIndex) {
        scrollToAnchor(index)
      }
    }
  }

  return (
    <View
      className="city-index-list"
      style={
        {
          // 注意：在 DomesticTab（国内标签页）中，滚动容器是从父组件传递下来的（scrollRef）。
          // CityIndexList 的内容仅仅是该容器内部的子元素。
          // 因此，如果（为了禁止滚动而）设置 pointerEvents 'none' 可能会导致无法点击列表项，这是不妥的。
          // 我们实际上是想禁用“滚动”，但这个组件并不直接控制滚动容器。
          // 不过，由于 DomesticTab 使用主容器（外层容器）来进行滚动，
          // 我们直接依赖主容器的滚动行为即可。
          // DomesticTab 的 'scrollEnabled'（启用滚动）逻辑主要是隐式的，因为：
          // 如果主容器还没达到吸顶状态，滚动操作会带动头部一起移动。
          // 一旦达到吸顶状态，主容器会继续滚动内容部分。
          // 实际上 scrollRef 指向的是 .city-selector-body。
          // 所以对于 DomesticTab，我们不需要为锁定 *内部* 滚动做任何特殊处理，
          // 因为它根本没有内部滚动（它直接使用主窗口/主体的滚动条）。
          // 唯一需要注意的是，如果我们像 OverseasTab（海外标签页）那样拥有独立的内部滚动区域，我们就需要锁定它。
          // 但 DomesticTab 的内容是在主容器中自然流式排布的。
          // 所以吸顶逻辑是自动生效的：头部吸顶固定，内容继续在下方滚动。
          // 因此，在标准流程下，这里严格来说不需要做任何样式变更。
          // 但为了与要求的架构保持一致，我们保留接收这个属性。
        }
      }
    >
      <View className="city-list-content">
        {children && (
          <View id="anchor-热门">
            <View className="city-group-title">{'国内热门城市'}</View>
            {children}
          </View>
        )}

        {groups.map((group) => (
          <View key={group.title} id={`anchor-${group.title}`}>
            <View className="city-group-title">{group.title}</View>
            <List>
              {group.items.map((city) => (
                <List.Item key={city} onClick={() => onSelect(city)} arrowIcon={false}>
                  {city}
                </List.Item>
              ))}
            </List>
          </View>
        ))}
      </View>

      <View
        className="city-sidebar"
        onTouchStart={(e) => {
          e.stopPropagation()
        }}
        onTouchMove={handleTouchMove}
        onClick={(e) => e.stopPropagation()}
      >
        {sidebarItems.map((item) => (
          <View
            key={item}
            data-index={item}
            className={`sidebar-item ${activeIndex === item ? 'active' : ''}`}
            onClick={() => scrollToAnchor(item)}
          >
            <Text>{item === '热门' ? '热' : item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
