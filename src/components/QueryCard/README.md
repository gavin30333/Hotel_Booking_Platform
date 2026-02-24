# QueryCard 组件

## 概述

`QueryCard` 是酒店预订平台的核心查询组件，位于首页顶部。它支持多种业务场景（如国内酒店、海外酒店、钟点房等）的切换，并根据不同场景动态渲染相应的查询表单。

## 目录结构

```
src/components/QueryCard/
├── index.tsx          # 组件主入口
├── QueryCard.less     # 组件样式
└── README.md          # 组件文档
```

## 组件关系与重构

为了提高代码的可维护性和复用性，`QueryCard` 进行了重构，将部分功能拆分为独立的子组件：

*   **TabBar**: 负责顶部的场景标签切换，位于 `src/components/common/TabBar`。
*   **FormFields**: 负责根据配置渲染具体的表单字段列表，位于 `src/components/common/FormFields`。
*   **SearchButton**: 独立的搜索按钮组件，位于 `src/components/common/SearchButton`。

`QueryCard` 现在主要负责：
1.  集成上述子组件。
2.  使用 `useQueryForm` Hook 管理整体表单状态。
3.  处理搜索逻辑和页面跳转。
4.  渲染特定场景的特殊功能模块（如“优惠通知”、“担保”等）。

## 配置驱动

组件完全由配置驱动，依赖 `src/constants/QueryConfig.ts` 中的 `SCENE_CONFIGS`。这使得添加新场景或修改现有场景的表单项变得非常简单，无需修改组件代码。

## 使用方法

```tsx
import { QueryCard } from '@/components/QueryCard';
import { TabType } from '@/types/query.types';

// ...

<QueryCard 
  defaultTab={TabType.DOMESTIC} 
  onSearch={(data) => console.log('Search:', data)} 
/>
```

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|Ref | --- | --- | --- |
| `defaultTab` | `TabType` | `TabType.DOMESTIC` | 初始选中的标签页 |
| `onSearch` | `(data: any) => void` | - | 点击搜索按钮时的回调函数 |
