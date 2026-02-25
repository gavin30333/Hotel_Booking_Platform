# 酒店卡片UI还原交付说明文档

## 1. 样式优化总结 (Styles Optimization)
本部分详细记录了参照 Ritz-Carlton 设计稿进行的像素级视觉还原工作。

### 1.1 布局与尺寸
- **卡片容器**: 适配大屏设备（如 iPhone 16），左侧图片区高度从 `146px` 调整为 `168px`，使整体卡片高度达到约 `200px`，实现一屏三卡的舒适浏览比例。
- **图片比例**: 宽高比优化为约 1.5:1，视觉更加修长优雅。
- **Flex 对齐**:
  - 底部 `.footer-row` 采用 `align-items: flex-start` 并配合精准的 `margin-top` 计算，确保左侧榜单徽章与右侧价格底部完美对齐。
  - 标题行 `.title-row` 使用 `align="center"` 确保钻级图标与酒店名称垂直居中。

### 1.2 排版与字体
- **字体标准化**: 统一正文信息（评分标签、点评数、距离、地标、服务）字号为 **11px**，行高统一为 **16px**，消除视觉杂乱感。
- **钻级区域**: 增加水平间距 (`--gap: 4px`)，避免图标与标题过于拥挤。

### 1.3 形状与细节
- **评分框**: 采用不对称圆角 (`2px 8px 2px 8px`)，精确还原设计稿中的“叶子”形状。
- **榜单徽章**: 优化为标准圆角矩形 (`border-radius: 4px`)，高度增加至 `16px`，提升精致感。
- **设施标签**: 优化 Padding (`0 4px`) 和高度 (`16px`)，增加呼吸感，避免文字拥挤。

## 2. Ant Design Mobile 重构说明 (Refactoring)
为了提升代码维护性并遵循项目技术栈，本组件已完成从原生 Taro 组件向 `antd-mobile` 组件库的全面迁移。

### 2.1 组件替换清单
| 原生 Taro 组件 | 替换为 antd-mobile 组件 | 说明 |
| :--- | :--- | :--- |
| `Image` | `antd-mobile/Image` | 启用 `lazy` 懒加载，`fit="cover"`，提升加载性能。 |
| `Text` (标题) | `antd-mobile/Ellipsis` | 实现标准的单行文本截断 (`rows={1}`)。 |
| `View` (标签) | `antd-mobile/Tag` | 使用 `fill="outline"` 并自定义样式以匹配设计稿。 |
| `View` (布局) | `antd-mobile/Space` | 用于行/列布局，简化 Flexbox 代码，确保间距统一。 |

### 2.2 样式适配策略
- **深度定制**: 通过 `HotelCard.less` 覆盖了 `antd-mobile` 组件的默认样式（如 `.adm-tag` 的背景色、`.adm-image` 的圆角），在享受组件库便利的同时，确保了像素级的视觉还原。
- **最小化原生组件**: 仅在无对应语义组件时保留 `View` 作为基础容器。

## 3. 数据分类标准 (Data Classification)

### 3.1 后端真实接口数据（动态可变）
本类数据直接来源于 `Hotel` 接口，随查询条件或筛选参数变化。

| 属性名 | 类型 | 用途说明 | 备注 |
| :--- | :--- | :--- | :--- |
| `name` | string | 酒店名称 | **已使用真实接口** |
| `rating` | number | 评分数值 | **已使用真实接口** |
| `reviewCount` | number | 点评总数 | **已使用真实接口** |
| `distance` | string | 距离文本 | **已使用真实接口** |
| `tags` | string[] | 设施标签列表 | **已使用真实接口** |
| `price` | number | 价格数值 | **已使用真实接口** |
| `totalPrice` | number | 总价数值 | **已使用真实接口** (前端计算) |
| `nights` | number | 入住晚数 | **已使用真实接口** (前端计算) |
| `image` | string | 图片URL | **已使用真实接口** |

### 3.2 待扩充数据 (Demo模式补充)
以下字段在接口暂未提供时，由 Demo 模式进行视觉补充：

| 属性名 | 类型 | 用途说明 | 备注 |
| :--- | :--- | :--- | :--- |
| `diamonds` | number | 钻石等级数量 | 待后端扩展 |
| `isGoldDiamond` | boolean | 是否显示金钻徽章 | 待后端扩展 |
| `ratingLabel` | string | 评分文本标签 (如"很好") | 待后端扩展 |
| `collectionCount` | string | 收藏总数 | 待后端扩展 |
| `landmark` | string | 附近地标描述 | 待后端扩展 |
| `serviceDesc` | string | 特色服务描述 | 待后端扩展 |
| `ranking` | string | 榜单排名文本 | 待后端扩展 |
| `diamondSymbol` | string | 钻石符号 (♦) | 前端常量 |
| `goldDiamondText` | string | 金钻徽章文本 | 前端常量 |
| `reviewSuffix` | string | "点评"后缀 | 前端常量 |
| `collectionSuffix` | string | "收藏"后缀 | 前端常量 |
| `distancePrefix` | string | "距您直线"前缀 | 前端常量 |
| `rankingIcon` | string | 榜单奖杯图标 | 前端常量 |
| `currencySymbol` | string | 货币符号 (¥) | 前端常量 |
| `priceSuffix` | string | "起"后缀 | 前端常量 |
| `totalPricePrefix` | string | "晚 总价 ¥"前缀 | 前端常量 |
| `separator` | string | 分隔符 ( · ) | 前端常量 |

## 4. 差异点与TODO (Gap Analysis)
### 4.1 差异点
- **营销信息**: 截图中的“热卖！低价房仅剩4间”目前完全是静态文本，后端无对应字段。
- **原价**: 截图中的划线原价（¥210）目前为静态值，后端仅返回最低价。

### 4.2 TODO清单
- [ ] **字段扩展**: 需要在后端/Store扩展上述 3.2 节中标注为“待扩充”的字段，以及营销信息和原价字段。
- [ ] **图标替换**: 将 CSS 模拟的图标替换为 UI 提供的 SVG 资源。

## 5. 推荐复用的全局样式变量 (Recommended Global Variables)
以下变量建议在经过团队确认后，提取至全局样式文件，以提升项目整体视觉一致性。

### 5.1 颜色系统
| 变量名 | 值 | 推荐指数 | 用途 |
| :--- | :--- | :--- | :--- |
| `@primary-blue` | `#0086F6` | ⭐⭐⭐ | 品牌主色 (评分框/价格) |
| `@primary-gold` | `#FFB400` | ⭐⭐⭐ | 品牌辅色 (钻石) |
| `@muted-gold` | `#E0C08A` | ⭐⭐ | 装饰色 (徽章背景 - 金钻) |
| `@ranking-bg` | `#FEEEE3` | ⭐⭐ | 榜单背景色 |
| `@marketing-red` | `#FF4D4F` | ⭐⭐⭐ | 营销警示色 |
| `@promo-orange` | `#FF6600` | ⭐⭐ | 促销专用色 |
| `@text-primary` | `#333333` | ⭐⭐⭐ | 一级标题/正文 |
| `@text-secondary` | `#666666` | ⭐⭐⭐ | 次级信息 |
| `@text-tertiary` | `#999999` | ⭐⭐ | 辅助信息 (弱化) |

### 5.2 布局与形状
| 变量名 | 值 | 推荐指数 | 用途 |
| :--- | :--- | :--- | :--- |
| `@radius-sm` | `2px` | ⭐⭐ | 微圆角 (标签/徽章) |
| `@radius-md` | `4px` | ⭐⭐⭐ | 标准容器圆角 |
| `@radius-lg` | `6px` | ⭐⭐ | 图片圆角 |
| `@radius-xl` | `8px` | ⭐⭐⭐ | 卡片圆角 |
| `@font-size-xs` | `9px` | ⭐ | 超小号字 (标签) |
| `@font-size-sm` | `10px` | ⭐⭐ | 小号字 (辅助说明) |
| `@font-size-base` | `11px` | ⭐⭐⭐ | 列表页正文基准字号 |
