# 城市选择器模块 (CitySelector) 技术文档

## 1. 模块概述

本模块实现了基于 `antd-mobile` 的全屏城市选择器，旨在提供原生 App 级别的交互体验。核心特性包括：

* **统一滚动上下文**：采用单一滚动容器 (`city-selector-body`)，避免嵌套滚动带来的冲突与性能问题。

* **多级吸顶交互**：

  * **一级吸顶**：搜索框 (`SearchHeader`) 始终固定在顶部。

  * **二级吸顶**：Tab 切换栏 (`Tabs`) 在滚动时吸附于搜索框下方。

  * **三级吸顶**：城市列表的分组标题（如 "A", "B", "热门"）在 Tab 栏下方继续吸顶。

* **高性能索引导航**：支持点击与**滑动**（Touch Move）两种方式触发侧边索引定位。

* **多维度数据视图**：无缝切换“国内”、“海外”、“热门搜索”三种视图，且针对不同视图优化了布局策略（如海外城市的侧边栏 Sticky 布局）。

**模块路径**: `src/components/CitySelector`

***

## 2. 功能逻辑与交互流程

### 2.1 核心功能

* **多源数据切换**: 通过顶部 Tab 栏切换不同维度的数据视图。

* **智能吸顶 (Sticky Headers)**: 利用 CSS `position: sticky` 实现多层级吸顶，无需复杂的 JS 滚动计算，性能更优。

* **快速定位**:

  * **当前定位**: 顶部展示当前定位城市状态。

  * **历史记录**: 自动记录最近选择。

  * **热门推荐**: 网格化展示。

  * **交互式索引**: 右侧悬浮索引栏支持手指滑动快速检索，根据 Y 轴坐标实时计算命中字母。

* **海外城市适配**: 针对海外城市数据层级（区域 -> 国家/城市），采用左侧导航吸顶、右侧内容滚动的布局。

### 2.2 交互流程

1. **唤起**: 用户点击 `LocationField`。
2. **展示**: 底部弹出全屏 Popup。
3. **操作**:

   * **滚动**: 整个内容区域共用一个滚动条，Tab 栏和分组标题自动吸顶。

   * **索引**: 在右侧字母栏滑动手指，列表实时滚动到对应分组。

   * **切换 Tab**: 点击 Tab，重置滚动位置（可选）并展示新内容。
4. **关闭**: 选择城市或点击关闭按钮。

***

## 3. 组件结构与职责

模块采用**统一滚动源**的设计模式，核心状态由父组件管理并下发。

```
src/components/CitySelector/
├── index.tsx                 # [核心] 负责 Popup 容器、滚动引用 (scrollRef) 管理、Tab 状态
├── CitySelector.less         # [核心] 定义统一滚动容器 (.city-selector-body) 及吸顶样式
├── components/
│   ├── TabContent/
│   │   ├── DomesticTab/      # 国内城市 Tab
│   │   │   ├── index.tsx     # 接收 scrollRef 并传递给列表
│   │   │   └── components/CityIndexList/
│   │   │       ├── index.tsx # [核心] 实现索引计算、滑动监听 (TouchMove)、吸顶标题
│   │   ├── OverseasTab/      # 海外城市 Tab
│   │   │   ├── index.tsx     # 采用 Flex 布局 + Sticky Sidebar
│   │   │   └── components/RegionSidebar/
│   │   └── HotSearchTab/     # 热门搜索 Tab
└── ...
```

### 3.1 核心组件职责

* **CitySelector (index.tsx)**:

  * **滚动容器**: 维护 `useRef<HTMLDivElement>` (`scrollRef`)，指向 `.city-selector-body`。这是整个组件唯一的纵向滚动区域。

  * **状态管理**: 控制 `activeTab`。

  * **Context 提供**: 将 `scrollRef` 传递给子组件（如 `DomesticTab`），以便子组件进行滚动位置计算（如 `scrollTo`）。

* **DomesticTab**:

  * 作为中间层，将 `scrollRef` 透传给 `CityIndexList`。

* **CityIndexList**:

  * **索引逻辑**: 监听 `scrollRef.current` 的 `scroll` 事件，计算当前可视区域对应的字母分组。

  * **滑动交互**: 监听侧边栏的 `onTouchMove` 事件，根据触摸点坐标 (`document.elementFromPoint`) 实时触发滚动跳转 (`scrollTo`)。

  * **吸顶偏移**: 动态计算吸顶高度（SearchHeader 高度 + Tab 高度），确保分组标题准确吸附在 Tab 栏下方。

* **OverseasTab**:

  * **布局策略**: 利用 `position: sticky` 将左侧区域导航固定在视口左侧，右侧内容随主容器滚动。

***

## 4. 状态管理

| 状态名           | 类型          | 描述        | 管理位置            |
| :------------ | :---------- | :-------- | :-------------- |
| `activeTab`   | `CityTab`   | 当前激活的 Tab | `CitySelector`  |
| `scrollRef`   | `RefObject` | 滚动容器引用    | `CitySelector`  |
| `activeIndex` | `string`    | 当前高亮索引    | `CityIndexList` |

***

## 5. 关键实现细节

### 5.1 统一滚动与 CSS Sticky

放弃了在每个 Tab 内部使用 `ScrollView` 的做法，改为外层统一 `div` (`.city-selector-body`) 开启 `overflow-y: auto`。

* **优势**: 解决了不同 Tab 切换时滚动条状态管理复杂的问题，同时让 `position: sticky` 能够跨组件生效（只要在同一个滚动容器内）。

* **Tab 吸顶**: `.adm-tabs-header` 设置 `position: sticky; top: 0`。

* **分组标题吸顶**: `.city-group-title` 设置 `position: sticky; top: 42px` (Tab 栏高度)。

### 5.2 触摸滑动索引 (Touch-to-Scroll)

为了解决 `onClick` 只能点选的问题，实现了类似原生 App 的滑动索引：

```typescript
const handleTouchMove = (e: ITouchEvent) => {
  e.stopPropagation();
  const touch = e.touches[0];
  // 根据坐标获取当前手指下的元素
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const sidebarItem = target?.closest('.sidebar-item');
  // ...触发滚动
};
```

***

## 6. 性能优化

1. **原生滚动**: 使用浏览器原生滚动而非 JS 模拟滚动，保证在低端设备上的流畅度。
2. **DOM 操作最小化**: 仅在 `scroll` 事件和触摸滑动时进行必要的 DOM 查询（如 `getBoundingClientRect`），并利用 `requestAnimationFrame` (待实现) 或节流控制。
3. **层级优化**: 减少不必要的嵌套 `View`，扁平化 DOM 结构。

