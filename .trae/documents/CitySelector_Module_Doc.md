# 城市选择器模块 (CitySelector) 技术文档

## 1. 模块概述

本模块实现了基于 `antd-mobile` 的全屏城市选择器，支持国内/海外城市切换、热门城市推荐、历史搜索记录以及 A-Z 字母索引导航。旨在为用户提供高效、流畅的地理位置选择体验。

**模块路径**: `src/components/CitySelector`

***

## 2. 功能逻辑与交互流程

### 2.1 核心功能

* **多源数据切换**: 通过 Tab 切换“国内(含港澳台)”与“海外”城市数据。

* **快速定位**:

  * **历史记录**: 自动记录并展示用户最近选择的城市。

  * **热门推荐**: 网格化展示高频选择城市。

  * **字母索引**: 右侧悬浮索引栏 (IndexBar)，支持点击/滑动快速跳转至对应首字母区域。

* **搜索功能**: 顶部固定搜索栏，支持实时过滤城市列表（目前预留接口）。

### 2.2 交互流程

1. **唤起**: 用户点击 `LocationField` 组件中的城市名称区域。
2. **展示**: 底部向上弹出全屏 Popup，默认展示“国内”标签页。
3. **操作**:

   * **切换 Tab**: 点击顶部 Tab 切换国内/海外视图。

   * **滚动/索引**: 滑动列表或点击右侧字母跳转。

   * **搜索**: 点击搜索框输入关键词（待联调）。

   * **选择**: 点击任意城市项 -> 触发 `onSelect` 回调 -> 关闭弹窗 -> 更新父组件状态。
4. **关闭**: 点击左上角“取消”按钮或点击遮罩层关闭弹窗。

***

## 3. 组件结构

模块采用原子化设计，遵循**组件目录化**（Component-per-folder）原则，结构如下：

```
src/components/CitySelector/
├── index.tsx                 # 模块入口 (原 CitySelector.tsx)
├── types.ts                  # 类型定义
├── CitySelector.less         # 主样式
├── utils/
│   └── cityData.ts           # 静态模拟数据源
└── components/
    ├── SearchHeader/
    │   ├── index.tsx         # 搜索组件实现
    │   └── SearchHeader.less # 搜索组件样式
    ├── HistorySection/
    │   ├── index.tsx         # 历史记录组件
    │   └── HistorySection.less
    ├── HotCitiesSection/
    │   ├── index.tsx         # 热门城市组件
    │   └── HotCitiesSection.less
    └── CityIndexList/
        ├── index.tsx         # 列表组件
        └── CityIndexList.less
```

### 3.1 核心组件职责

* **CitySelector/index.tsx**: 负责弹窗的可见性控制 (`visible`)、Tab 状态管理 (`activeTab`) 以及数据源的分发。

* **components/CityIndexList/index.tsx**: 封装 `IndexBar` 和 `List`，支持 `children` 插槽以容纳非索引内容（如历史/热门区域）。

***

## 4. 状态管理

组件内部状态较少，主要依赖 Props 通信，符合展示型组件特征。

| 状态名          | 类型                         | 描述           | 管理位置                  |
| :----------- | :------------------------- | :----------- | :-------------------- |
| `visible`    | `boolean`                  | 控制弹窗显示/隐藏    | 父组件 (`LocationField`) |
| `activeTab`  | `'domestic' \| 'overseas'` | 当前激活的 Tab 面板 | `CitySelector`        |
| `searchText` | `string`                   | 搜索框输入内容      | `CitySelector`        |

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
```

### 5.2 接口扩展建议

在接入后端 API 时，建议在 `CitySelector` 中使用 `useEffect` 或 `useRequest` (ahooks) 获取数据，替换当前的静态导入：

```typescript
// 示例：异步加载逻辑
const { data: cityGroups } = useRequest(fetchCityList);
```

***

## 6. 样式规范

* **基础库**: 严格遵循 `antd-mobile` 默认样式，仅通过 Less 变量覆盖必要的间距和颜色。

* **布局**:

  * `SearchHeader`: 固定高度，底部边框分隔。

  * `Grid`: 使用 `gap` 属性控制热门城市间距。

  * `IndexBar`: 设为 `height: 100%` 以适应全屏滚动。

* **层级**: `Popup` 的 `z-index` 由 `antd-mobile` 自动管理，通常为 1000+。

***

## 7. 性能优化要点

1. **长列表渲染**: `antd-mobile` 的 `List` 组件处理千级数据性能尚可。若城市数据量极大（>5000），建议替换为 `react-window` 或 `react-virtualized` 进行虚拟滚动优化。
2. **按需加载**: 考虑到城市数据较大，可使用 `React.lazy` 动态加载 `CitySelector` 组件，避免阻塞首屏 Bundle。
3. **Memoization**: 对 `CityIndexList` 进行 `React.memo` 包裹，防止父组件状态更新导致不必要的列表重渲染。

***

## 8. 异常处理

* **空数据**: `HistorySection` 在 `cities` 为空时返回 `null`，不渲染 DOM。

* **定位失败**: 虽本模块不负责定位，但 `LocationField` 已包含定位失败的 `try-catch` 处理，确保 UI 不崩溃。

* **类型安全**: 全量使用 TypeScript 定义，编译期拦截类型错误。

***

## 9. 测试用例

| ID   | 测试场景                 | 预期结果                      |
| :--- | :------------------- | :------------------------ |
| TC01 | 点击 LocationField 城市名 | 唤起城市选择器弹窗，默认选中“国内”Tab     |
| TC02 | 切换 Tab 至“海外”         | 列表更新为海外热门及 A-Z 数据         |
| TC03 | 点击“热门城市”中的“北京”       | 弹窗关闭，LocationField 显示“北京” |
| TC04 | 点击右侧索引“G”            | 列表平滑滚动至“G”分组              |
| TC05 | 点击历史记录清除按钮           | 历史记录区域消失 (需实现 onClear 逻辑) |
| TC06 | 点击搜索框取消按钮            | 弹窗关闭                      |

***

## 10. 后续可扩展方向

1. **真实搜索实现**:

   * 监听 `SearchHeader` 输入。

   * 前端过滤 `domesticCities` 和 `overseasCities` 聚合数据。

   * 展示搜索结果列表覆盖当前视图。
2. **定位集成**:

   * 在“国内”列表顶部增加“当前定位”行，点击重新触发 GPS 定位。
3. **多语言支持**:

   * 数据结构扩展支持 `nameEn`，根据全局 Locale 显示对应语言。
4. **行政区划联动**:

   * 选择城市后，继续请求该城市的区/县数据，支持二级选择。

