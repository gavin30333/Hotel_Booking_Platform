# 迁移 ImageCarousel 组件计划

本计划旨在根据 `Frontend-Coding-Standards.md` 规范，将 `src/pages/detail/components/ImageCarousel` 迁移至全局通用组件目录，并剥离业务特定的 Tabs 逻辑。

## 1. 目标与规范依据

*   **目标**: 将 `ImageCarousel` 改造为通用组件。
*   **目标路径**: `src/components/common/display/ImageCarousel/`
*   **规范检查**:
    *   **目录结构**: `src/components/common/display/ImageCarousel/` (符合 common 目录分类)。
    *   **入口文件**: `index.tsx` (符合强制命名)。
    *   **样式文件**: `ImageCarousel.less` (符合 `[ComponentName].less` 命名)。
    *   **导入规则**: 使用 `@/` 别名。

## 2. 迁移步骤

### 2.1 创建通用组件
在 `src/components/common/display/ImageCarousel/` 目录下创建以下文件：
1.  **`index.tsx`**:
    *   从原组件提取 `Swiper` 相关逻辑。
    *   移除 `.carousel-tabs` 相关代码。
    *   接收 `images` (string[]) 和 `onImageClick` ((index: number) => void) 作为 Props。
    *   处理空图片情况（使用 `DEFAULT_HOTEL_IMAGE`）。
2.  **`ImageCarousel.less`**:
    *   从原样式文件提取 `.image-carousel` 和 `.swiper` 相关样式。
    *   移除 `.carousel-tabs` 相关样式。

### 2.2 重构酒店详情页 (`src/pages/detail/index.tsx`)
1.  **引入新组件**:
    *   修改引用路径：`import ImageCarousel from '@/components/common/display/ImageCarousel'`。
2.  **还原 Tabs 功能**:
    *   在 `HotelDetailPage` 组件中，`ImageCarousel` 下方添加原有的 Tabs JSX 代码（`.carousel-tabs` 部分）。
    *   **样式迁移**: 将原 `.carousel-tabs` 的样式迁移至 `src/pages/detail/DetailPage.less` 中，确保视觉效果不变。

### 2.3 清理旧代码
1.  删除 `src/pages/detail/components/ImageCarousel/` 目录及其内容。

## 3. 验证计划
1.  检查 TypeScript 编译是否通过。
2.  检查详情页轮播图是否正常显示。
3.  检查详情页 Tabs 是否正常显示且样式正确。
4.  确认目录结构符合规范。
