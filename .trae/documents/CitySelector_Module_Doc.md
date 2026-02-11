# 城市选择器模块 (CitySelector) 技术文档

## 1. 模块概述

本模块实现了基于 `antd-mobile` 的全屏城市选择器，支持国内/海外城市切换、热门搜素、热门城市推荐、历史搜索记录以及 A-Z 字母索引导航。
针对移动端交互进行了深度优化，实现了 Tab 栏吸顶、自定义侧边索引栏 (Sidebar) 及滚动联动高亮功能，旨在为用户提供高效、流畅的地理位置选择体验。

**模块路径**: `src/components/CitySelector`

***

## 2. 功能逻辑与交互流程

### 2.1 核心功能

* **多源数据切换**: 通过顶部 Tab 栏切换“国内”、“海外”、“热门搜索”三个维度的数据视图。
* **Tab 栏吸顶**: 当列表向上滚动时，Tab 栏会自动吸顶，保证分类切换随时可用。
* **快速定位**:
  * **当前定位**: 顶部展示当前定位城市状态 (LocationStatus)。
  * **历史记录**: 自动记录并展示用户最近选择的城市。
  * **热门推荐**: 网格化展示高频选择城市。
  * **自定义字母索引**: 右侧悬浮自定义索引栏 (Sidebar)，支持点击跳转至对应首字母区域，并支持滚动监听自动高亮当前字母。
* **UI 细节优化**:
  * 城市列表去除默认箭头，保持界面简洁。
  * 分组标题 (Sticky Header) 吸顶效果。

### 2.2 交互流程

1. **唤起**: 用户点击 `LocationField` 组件中的城市名称区域。
2. **展示**: 底部向上弹出全屏 Popup，默认展示“国内”标签页。
3. **操作**:
   * **切换 Tab**: 点击顶部 Tab 切换 国内/海外/热门搜索 视图。
   * **滚动/索引**: 滑动列表，右侧索引栏自动更新高亮；点击右侧字母，列表瞬间跳转至对应位置。
   * **选择**: 点击任意城市项 -> 触发 `onSelect` 回调 -> 关闭弹窗 -> 更新父组件状态。
4. **关闭**: 点击左上角“取消”按钮或点击遮罩层关闭弹窗。

***

## 3. 组件结构

模块采用原子化设计，遵循**组件目录化**（Component-per-folder）原则，每个组件拥有独立的目录、入口文件及样式文件。

```
src/components/CitySelector/
├── index.tsx                 # 模块入口 (CitySelector 主逻辑)
├── types.ts                  # 类型定义
├── CitySelector.less         # 主样式
├── utils/
│   └── cityData.ts           # 静态模拟数据源 (含国内、海外、热搜数据)
└── components/
    ├── SearchHeader/
    │   ├── index.tsx         # 搜索组件实现
    │   └── SearchHeader.less # 搜索组件样式
    ├── LocationStatus/       # [新增] 定位状态组件
    │   ├── index.tsx
    │   └── LocationStatus.less
    ├── HistorySection/
    │   ├── index.tsx         # 历史记录组件
    │   └── HistorySection.less
    ├── HotCitiesSection/
    │   ├── index.tsx         # 热门城市组件
    │   └── HotCitiesSection.less
    └── CityIndexList/
        ├── index.tsx         # 列表组件 (含自定义索引栏逻辑)
        └── CityIndexList.less
```

### 3.1 核心组件职责

* **CitySelector/index.tsx**: 负责弹窗的可见性控制 (`visible`)、Tab 状态管理 (`activeTab`)、Tab 吸顶逻辑以及数据源的分发。
* **components/CityIndexList/index.tsx**: 
  * 实现了自定义的侧边索引栏 (`sidebar-item`)。
  * 实现了 `scrollToAnchor` 点击跳转逻辑。
  * 实现了 `scroll` 事件监听与 Active Index 自动计算。
  * 列表项去除了默认箭头 (`arrow={false}`)。

***

## 4. 状态管理

组件内部状态较少，主要依赖 Props 通信，符合展示型组件特征。

| 状态名          | 类型                         | 描述           | 管理位置                  |
| :----------- | :------------------------- | :----------- | :-------------------- |
| `visible`    | `boolean`                  | 控制弹窗显示/隐藏    | 父组件 (`LocationField`) |
| `activeTab`  | `'domestic' \| 'overseas' \| 'hotSearch'` | 当前激活的 Tab 面板 | `CitySelector`        |
| `activeIndex`| `string`                   | 当前高亮的索引字母   | `CityIndexList`       |

**数据流向**:
`LocationField` (State: `citySelectorVisible`) -> Props -> `CitySelector` -> Props -> `CityIndexList` -> Event -> `onSelect` 回调。

***

## 5. 接口调用与数据源

目前使用本地 Mock 数据 (`utils/cityData.ts`)。

### 5.1 数据结构 (`types.ts`)

```typescript
export interface CityGroup {
  title: string;   // 索引标题，如 "A", "Hot"
  items: string[]; // 城市名称列表
}

export type CityTab = 'domestic' | 'overseas' | 'hotSearch';
```

***

## 6. 样式规范与实现细节

* **Tab 吸顶实现**:
  * 使用 CSS `position: sticky; top: 0; z-index: 99;` 实现 Tab 栏在滚动时的吸顶效果。
  * 索引标题 (`.city-group-title`) 同样使用了 `sticky` 定位，但 `top` 值设为 Tab 栏高度 (约 42px)，形成层叠吸顶效果。

* **自定义 IndexBar**:
  * 放弃 `antd-mobile` 原生 `IndexBar`，改为自定义实现，以解决 Flex 布局冲突和特定交互需求。
  * 使用 `position: fixed` 将侧边栏固定在屏幕右侧垂直居中位置。

* **列表样式**:
  * `List.Item` 显式设置 `arrow={false}` 去除右侧箭头。
  * 历史记录与热门城市板块增加了顶部/底部间距，提升视觉呼吸感。

***

## 7. 性能优化要点

1. **滚动监听节流**: 目前 `scroll` 事件直接绑定，若后续性能有瓶颈，建议使用 `lodash.throttle` 对 `handleScroll` 进行节流处理。
2. **长列表渲染**: 若城市数据量极大（>5000），建议替换为 `react-window` 或 `react-virtualized` 进行虚拟滚动优化。
3. **Memoization**: 对 `CityIndexList` 进行 `React.memo` 包裹，防止父组件状态更新导致不必要的列表重渲染。

***

## 8. 测试用例

| ID   | 测试场景                 | 预期结果                      |
| :--- | :------------------- | :------------------------ |
| TC01 | 点击 LocationField 城市名 | 唤起城市选择器弹窗，默认选中“国内”Tab     |
| TC02 | 向上滑动列表              | Tab 栏吸顶，不随列表滚动消失；右侧索引随内容自动高亮 |
| TC03 | 切换 Tab 至“海外”         | 列表更新为海外热门及 A-Z 数据         |
| TC04 | 切换 Tab 至“热门搜索”      | 展示热搜榜单列表                    |
| TC05 | 点击右侧索引“G”            | 列表瞬间跳转至“G”分组顶部              |
| TC06 | 验证列表项样式             | 城市名称右侧无箭头图标                |
