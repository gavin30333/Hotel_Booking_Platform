# FieldRenderers 组件集

## 概述

`FieldRenderers` 目录包含了 `QueryCard` 表单中使用的所有具体字段渲染组件。每个组件负责渲染特定类型的数据输入界面，并处理相关的交互逻辑。

## 目录结构

```
src/components/FieldRenderers/
├── DateField/         # 日期选择组件
├── GuestField/        # 入住人数/客房选择组件
├── LocationField/     # 目的地/位置选择组件
├── TagField/          # 关键词/标签选择组件
├── index.ts           # 统一导出入口
└── README.md          # 文档
```

## 组件详情

### LocationField
处理城市选择和定位功能。
- 集成了 `useLocation` Hook 进行 GPS 定位。
- 包含 `CitySelector` 用于手动选择城市。
- 支持国内/国际模式切换。

### DateField
处理入住和离店日期的选择。
- 逻辑已重构，核心日期计算逻辑提取至 `src/utils/dateFieldUtils.ts`。
- 支持显示入住晚数。

### GuestField
处理成人数、儿童数及儿童年龄的选择。
- 逻辑已重构，格式化和计算逻辑提取至 `src/utils/guestFieldUtils.ts`。
- 支持底部弹窗（ActionSheet）进行详细设置。

### TagField
处理搜索关键词和标签选择。
- 展示热门标签。
- 支持输入自定义关键词。

## 重构说明：提取工具函数

为了减轻组件负担并方便单元测试，复杂的业务逻辑已被提取到 `src/utils` 目录下的工具函数中：

*   **src/utils/dateFieldUtils.ts**: 包含日期格式化、晚数计算、日期范围校验等函数。
*   **src/utils/guestFieldUtils.ts**: 包含客人信息的格式化字符串生成、儿童年龄处理等函数。

这种分离确保了 `FieldRenderers` 中的组件主要关注 UI 渲染和用户交互，而纯粹的逻辑处理则由工具函数负责。

## 使用方法

这些组件通常不直接使用，而是通过 `src/components/common/FormFields` 组件根据配置动态加载。

此外，`GuestField` 依赖的弹窗组件（如 `GuestSelectionPopup`, `PriceStarSelectionPopup` 等）已迁移至 `src/components/common/` 目录下，以便于复用。

```typescript
// 示例：在 FormFields 中使用
import { LocationField, DateField, GuestField, TagField } from '@/components/FieldRenderers';

// 根据 field.type 渲染对应组件
const renderField = (field) => {
  switch (field.type) {
    case 'location': return <LocationField {...props} />;
    case 'date': return <DateField {...props} />;
    // ...
  }
}
```
