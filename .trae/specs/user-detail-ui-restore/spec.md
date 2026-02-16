# 用户详情页 UI 还原 Spec

## 阶段1：实现计划 (Phase 1: Plan)

### 1.1 图片分析与还原策略
- **布局结构**：
  - **顶部**：沉浸式轮播图（DetailHeader），包含返回按钮、收藏/分享操作区。
  - **信息区**：酒店名称、星级（金色五星）、标签（2017年开业等）、评分（4.5 很好）、评价摘要。
  - **设施区**：横向滚动的图标列表（泳池、健身房等）及“设施/政策”入口。
  - **地图区**：地址文本、距离提示、地图入口。
  - **日期选择**：入住/离店日期、晚数、间数/人数选择器。
  - **筛选区**：横向滚动的房型筛选标签（双床房、含早餐等）。
  - **房型列表**：卡片式列表，每项包含图片、房型名、标签、价格、预订按钮。
  - **底部栏**：固定底部，显示起价和“查看房型”按钮（部分场景）。
- **样式参考**：
  - **详情页目标**：严格还原布局、间距、字号、颜色（主要参考）。
  - **查询页参考**：复用字体体系（PingFang SC）、基础圆角（8px/12px）、阴影风格、品牌色（蓝色 #0086F6）。

### 1.2 组件拆分规划
| 组件名 | 路径 | 职责 |
| :--- | :--- | :--- |
| **DetailHeader** | `pages/user/detail/components/DetailHeader` | 顶部轮播图、导航栏背景渐变、操作按钮 |
| **HotelInfo** | `pages/user/detail/components/HotelInfo` | 酒店名、星级、标签、评分区块 |
| **Facilities** | `pages/user/detail/components/Facilities` | 设施图标列表、政策入口 |
| **MapEntry** | `pages/user/detail/components/MapEntry` | 地址、地图图标、距离信息 |
| **ReviewPreview** | `pages/user/detail/components/ReviewPreview` | 评价摘要、用户评论轮播或展示 |
| **DateSelector** | `pages/user/detail/components/DateSelector` | 日期选择、住客人数筛选 |
| **RoomList** | `pages/user/detail/components/RoomList` | 房型筛选标签、房型列表容器 |
| **RoomItem** | `pages/user/detail/components/RoomItem` | 单个房型卡片（图片、信息、价格、按钮） |
| **BottomBar** | `pages/user/detail/components/BottomBar` | 底部价格与操作栏 |

### 1.3 技术方案
- **框架**：Taro 3.x + React + TypeScript。
- **组件库**：`antd-mobile`（Swiper, ImageViewer, Button, Toast, Icons）。
- **样式**：Less，使用 px 单位（Taro 自动转 rpx）。
- **样式隔离**：
  - 页面根类名 `.detail-page`。
  - 组件根类名 `.detail-header`, `.hotel-info` 等 (BEM 规范)。
  - 禁止修改 `app.less`。
- **类型定义**：
  - 定义 `HotelDetail` 接口。
  - 定义 `RoomType` 接口。
  - 定义组件 Props 接口。

### 1.4 开发步骤
1. **基础搭建**：创建目录结构，定义 TS 类型。
2. **组件开发**：按从上到下的顺序依次开发子组件（Header -> Info -> Facilities -> ...）。
3. **页面组装**：在 `index.tsx` 中引入组件，注入 Mock 数据。
4. **样式调优**：对比图片调整间距、字号、颜色。

---

## 阶段2：开发文档 (Phase 2: Documentation)

### 2.1 页面结构 (DOM Tree)
```tsx
<div className="detail-page">
  <DetailHeader />      {/* 顶部轮播与导航 */}
  <div className="content-scroll">
    <HotelInfo />       {/* 基础信息 */}
    <Facilities />      {/* 设施 */}
    <ReviewPreview />   {/* 评价 */}
    <MapEntry />        {/* 地图 */}
    <DateSelector />    {/* 日期 */}
    <RoomList />        {/* 房型列表 */}
  </div>
  <BottomBar />         {/* 底部固定栏 */}
</div>
```

### 2.2 组件清单与依赖
1. **DetailHeader**
   - 依赖：`antd-mobile/Swiper`, `antd-mobile-icons/LeftOutline`, `MoreOutline`
   - Props: `images: string[]`
2. **HotelInfo**
   - 依赖：无
   - Props: `name`, `stars`, `tags`, `score`, `reviewCount`
3. **Facilities**
   - 依赖：`antd-mobile-icons` (自定义图标或图片)
   - Props: `items: FacilityItem[]`
4. **ReviewPreview**
   - 依赖：无
   - Props: `score`, `tags`, `topReview`
5. **MapEntry**
   - 依赖：`antd-mobile-icons/EnvironmentOutline`
   - Props: `address`, `distance`
6. **DateSelector**
   - 依赖：无 (纯展示或模拟点击)
   - Props: `checkIn`, `checkOut`, `nights`, `guests`
7. **RoomList**
   - 依赖：`RoomItem`
   - Props: `rooms: RoomType[]`
8. **RoomItem**
   - 依赖：`antd-mobile/Button`, `Image`
   - Props: `data: RoomType`

### 2.3 样式规范
- **颜色**：
  - 主色：`#0086F6` (蓝色按钮/文字)
  - 金色：`#FF9900` (星级/评分)
  - 黑色：`#333333` (主要文字)
  - 灰色：`#666666` (次要文字), `#999999` (辅助文字)
  - 背景：`#F5F5F5` (页面背景), `#FFFFFF` (卡片背景)
- **字体**：
  - 标题：18px / 20px, bold
  - 正文：14px / 16px
  - 辅助：12px
- **间距**：
  - 模块间距：12px
  - 内部内边距：16px
  - 圆角：12px (卡片), 8px (按钮/图片)

### 2.4 文件结构
```
src/pages/user/detail/
├── components/
│   ├── DetailHeader/
│   │   ├── index.tsx
│   │   └── index.less
│   ├── HotelInfo/
│   │   ├── index.tsx
│   │   └── index.less
│   ├── Facilities/
│   │   ├── index.tsx
│   │   └── index.less
│   ├── MapEntry/ ...
│   ├── ReviewPreview/ ...
│   ├── DateSelector/ ...
│   ├── RoomList/ ...
│   ├── RoomItem/ ...
│   └── BottomBar/ ...
├── types/
│   └── index.ts        // 类型定义
├── mock/
│   └── data.ts         // Mock 数据
├── index.tsx           // 页面入口
└── index.less          // 页面样式
```

### 2.5 类型定义 (TypeScript)
```typescript
export interface HotelDetail {
  id: string;
  name: string;
  stars: number;
  tags: string[];
  score: number;
  reviewCount: number;
  address: string;
  distance: string;
  images: string[];
  facilities: Facility[];
  topReview: Review;
}

export interface RoomType {
  id: string;
  name: string;
  image: string;
  tags: string[];
  price: number;
  features: string[]; // e.g. ["25m²", "有窗"]
}
```

### 2.6 样式隔离
- 所有样式文件首行使用组件根类名包裹：
  ```less
  .detail-header {
    // styles
  }
  ```
- 禁止使用 `view`, `text` 等标签选择器，必须使用类名。
