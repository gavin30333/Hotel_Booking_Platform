# CitySelector 组件滑动逻辑技术文档

## 1. 概述

CitySelector（城市选择器）组件包含三个核心标签页，其中「国内」和「海外」板块涉及复杂的滑动交互逻辑。本文档旨在系统梳理各板块的滚动实现方案、技术选型及关键逻辑，协助开发人员维护及优化相关功能。

主要涉及的滑动模式：

* **国内板块 (DomesticTab)**：基于字母索引栏 (IndexBar) 的双向联动（点击索引滚动列表、滑动列表更新索引），以及侧边栏的手势滑动定位。

* **海外板块 (OverseasTab)**：基于侧边栏 (SideBar) 的锚点导航（Scroll Spy），实现左侧菜单与右侧内容的双向同步。

***

## 2. 滑动逻辑清单

| 功能模块     | 交互场景       | 实现目的                  | 关键技术/API                                            | 涉及文件                      |
| :------- | :--------- | :-------------------- | :-------------------------------------------------- | :------------------------ |
| **海外板块** | **内容滚动监听** | 滚动右侧内容时，左侧侧边栏自动高亮对应分类 | `ahooks` (`useThrottleFn`), `getBoundingClientRect` | `OverseasTab/index.tsx`   |
| **海外板块** | **侧边栏点击**  | 点击左侧菜单，右侧内容平滑滚动到指定锚点  | `element.scrollIntoView`, `activeKey`               | `OverseasTab/index.tsx`   |
| **国内板块** | **索引点击跳转** | 点击右侧字母索引，列表滚动到对应字母分组  | `container.scrollTo`, 偏移量计算                         | `CityIndexList/index.tsx` |
| **国内板块** | **索引手势滑动** | 在索引栏上滑动手指，列表实时跟随滚动    | `onTouchMove`, `document.elementFromPoint`          | `CityIndexList/index.tsx` |
| **国内板块** | **列表滚动监听** | 滚动城市列表时，右侧索引栏高亮当前字母   | `scroll` 事件监听, `getBoundingClientRect`              | `CityIndexList/index.tsx` |

***

## 3. 核心实现方案

### 3.1 海外板块 (OverseasTab) - 锚点导航

**核心策略**：使用 `ahooks` 进行滚动节流，配合 DOM API 实现“滚动侦测 (Scroll Spy)”。

#### 3.1.1 关键代码路径

* 文件：`src/components/CitySelector/components/TabContent/OverseasTab/index.tsx`

* 依赖：`ahooks`, `antd-mobile`

#### 3.1.2 实现步骤

1. **布局隔离**：
   右侧内容容器设置为独立滚动区域，固定高度并开启 `overflow-y: auto`。

   ```less
   // OverseasTab.less
   .content-container {
     height: calc(100vh - 92px); // 减去头部高度
     overflow-y: auto;
   }
   ```

2. **滚动监听与节流**：
   使用 `useThrottleFn` 限制滚动事件触发频率（100ms），避免性能损耗。

   ```typescript
   // 监听滚动，计算当前可视区域顶部的分类
   const { run: handleScroll } = useThrottleFn(
     () => {
       let currentKey = overseasCategories[0].key;
       for (const item of overseasCategories) {
         const element = document.getElementById(`anchor-${item.key}`);
         if (!element) continue;
         const rect = element.getBoundingClientRect();
         // 阈值判断：当元素顶部接近视口顶部（<= 100px）时更新选中态
         if (rect.top <= 100) { 
           currentKey = item.key;
         } else {
           break; // 列表按顺序排列，一旦不满足即可停止遍历
         }
       }
       setActiveKey(currentKey);
     },
     { wait: 100, leading: true, trailing: true }
   );
   ```

3. **点击跳转**：
   利用原生 `scrollIntoView` 实现平滑滚动。

   ```typescript
   const handleSideBarChange = (key: string) => {
     const element = document.getElementById(`anchor-${key}`);
     if (element) {
       element.scrollIntoView({ behavior: 'auto' }); // 或 'smooth'
       setActiveKey(key);
     }
   };
   ```

***

### 3.2 国内板块 (DomesticTab) - 索引手势联动

**核心策略**：手动计算滚动偏移量，并利用 Touch 事件实现索引栏的“拖拽查找”功能。

#### 3.2.1 关键代码路径

* 文件：`src/components/CitySelector/components/TabContent/DomesticTab/components/CityIndexList/index.tsx`

#### 3.2.2 实现步骤

1. **精确跳转 (scrollTo)**：
   不同于 `scrollIntoView`，这里采用 `container.scrollTo` 配合手动偏移量计算，以精确控制吸顶位置（扣除 Header 高度）。

   ```typescript
   const scrollToAnchor = (index: string) => {
     const element = document.getElementById(`anchor-${index}`);
     const container = scrollRef.current; // 需确保 ref 正确绑定到滚动容器
     if (element && container) {
       // 计算元素相对于容器的绝对偏移量
       const offset = element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
       const top = offset - headerHeight; // 扣除吸顶 Header 高度
       container.scrollTo({ top: top, behavior: 'auto' });
       setActiveIndex(index);
     }
   };
   ```

2. **索引栏手势滑动 (Touch Move)**：
   当用户手指在索引栏上滑动时，需要实时获取手指下方的字母并触发滚动。

   ```typescript
   const handleTouchMove = (e: ITouchEvent) => {
     e.stopPropagation(); // 阻止冒泡，防止页面整体滚动
     const touch = e.touches[0];
     // 根据坐标获取 DOM 元素
     const target = document.elementFromPoint(touch.clientX, touch.clientY);
     if (!target) return;
     
     // 查找最近的 sidebar-item
     const sidebarItem = target.closest('.sidebar-item');
     if (sidebarItem) {
       const index = sidebarItem.getAttribute('data-index');
       // 如果索引变化，触发滚动
       if (index && index !== activeIndex) {
         scrollToAnchor(index);
       }
     }
   };
   ```

***

## 4. 注意事项与避坑点

1. **滚动容器的高度与 Ref 绑定**

   * **问题**：若滚动容器没有固定的高度（或 `max-height`）且未设置 `overflow: auto`，`scroll` 事件将不会触发，或者会冒泡到 `window` 上导致逻辑失效。

   * **对策**：确保 `OverseasTab.less` 和 `CityIndexList` 的容器样式正确，并且 `useRef` 必须准确绑定到该滚动容器 DOM 上。

2. **滚动冲突处理**

   * **问题**：CitySelector 是一个 Popup 弹窗，内部滚动可能导致底部页面跟随滚动（滚动穿透）。

   * **对策**：

     * 在 Popup 内容区域使用 `stopPropagation`。

     * `TouchMove` 事件中调用 `e.preventDefault()` (视具体框架行为而定) 或 `e.stopPropagation()`。

3. **性能优化**

   * **Scroll 事件**：必须使用防抖（debounce）或节流（throttle）。推荐使用 `ahooks` 的 `useThrottleFn`，设置 100ms 左右的延迟，既保证流畅度又减少计算量。

   * **DOM 操作**：尽量减少 `getBoundingClientRect` 的调用次数。在 `OverseasTab` 的逻辑中，一旦找到符合条件的元素即 `break` 循环，避免无效计算。

4. **偏移量计算**

   * 在使用 `scrollTo` 时，务必考虑顶部固定 Header（如搜索框、Tabs栏）的高度，否则锚点内容会被遮挡。

***

## 5. 验证方式

| 测试场景        | 操作步骤          | 预期结果                          |
| :---------- | :------------ | :---------------------------- |
| **海外板块-点击** | 点击左侧“日韩”菜单    | 右侧内容立即滚动，使“日韩”标题置顶            |
| **海外板块-滚动** | 缓慢向下滚动右侧内容    | 当“欧洲”标题进入视口顶部区域时，左侧“欧洲”菜单自动高亮 |
| **国内板块-手势** | 在右侧字母栏按住并上下拖动 | 列表随手指位置快速跳变，且无明显卡顿            |
| **边界测试**    | 快速滑动到底部       | 左侧菜单应正确高亮最后一个分类               |

