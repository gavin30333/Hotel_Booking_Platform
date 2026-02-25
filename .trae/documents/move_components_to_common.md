# 组件迁移计划：移动小型组件至 common 目录

## 目标
将最近重构产生的位于 `src/components/` 根目录下的所有小型组件迁移至 `src/components/common/` 目录下，以优化项目结构。

## 待移动组件列表
以下组件将从 `src/components/` 移动到 `src/components/common/`：
1.  `TabBar`
2.  `SearchButton`
3.  `FormFields`
4.  `GuestSelectionPopup`
5.  `ChildAgeSelectionPopup`
6.  `HomestayGuestSelectionPopup`
7.  `PriceStarSelectionPopup`

## 执行步骤

### 1. 移动文件夹
-   将上述 7 个组件文件夹移动到 `src/components/common/` 目录下。

### 2. 更新导入路径
-   **QueryCard (`src/components/QueryCard/index.tsx`)**:
    -   更新 `TabBar`, `FormFields`, `SearchButton` 的引用路径，指向 `../common/TabBar`, `../common/FormFields`, `../common/SearchButton`。
-   **GuestField (`src/components/FieldRenderers/GuestField/index.tsx`)**:
    -   更新 `GuestSelectionPopup`, `HomestayGuestSelectionPopup`, `PriceStarSelectionPopup` 的引用路径，指向 `../../common/...`。
-   **FormFields (`src/components/common/FormFields/index.tsx`)**:
    -   检查并更新对 `FieldRenderers` 的引用（如果是相对路径可能需要调整，如果是绝对路径 `@/components/FieldRenderers` 则无需修改，但根据之前的情况，可能是相对引用）。
-   **GuestSelectionPopup (`src/components/common/GuestSelectionPopup/index.tsx`)**:
    -   更新对 `ChildAgeSelectionPopup` 的引用（如果在同一级 common 下，相对路径可能不变，需确认）。
-   **全局导出 (`src/components/index.ts`)**:
    -   如果有导出这些组件，需要更新路径。

### 3. 更新 Less 引用
-   检查移动后的组件 Less 文件中是否引用了全局变量（如 `variables.less`），如果有相对路径引用，需要调整层级（增加一层 `../`）。

### 4. 更新文档
-   **QueryCard README (`src/components/QueryCard/README.md`)**:
    -   更新组件路径描述，说明这些子组件现在位于 `common` 目录下。
-   **FieldRenderers README (`src/components/FieldRenderers/README.md`)**:
    -   更新组件路径描述。

## 验证
-   运行静态检查，确保所有 import 路径正确。
-   确保项目构建无误。
