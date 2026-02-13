# 项目说明文档

## 1. 项目简介

本项目是一个酒店预订平台的搜索组件前端实现，旨在提供灵活、可配置的搜索体验。项目支持多种搜索场景（国内、国际、民宿、钟点房），并针对每种场景定制了不同的表单字段和交互逻辑。

## 2. 已完成任务

### 核心功能

- **多场景搜索卡片 (QueryCard)**: 实现了核心搜索交互界面，支持通过 Tab 切换不同的业务场景（国内、海外、民宿、钟点房）。
- **配置化驱动**: 通过 `SCENE_CONFIGS` 常量配置，实现了不同场景下表单字段、特殊展示（如提示信息、保障标签）的动态渲染。

### 字段组件 (FieldRenderers)

实现了高度定制化的表单字段组件：

- **日期选择 (DateField)**: 处理入住日期、离店日期及入住晚数的选择与展示。
- **位置选择 (LocationField)**: 处理城市/目的地的展示与选择交互。
- **客人在住 (GuestField)**: 业务逻辑最复杂的组件，集成了以下功能：
  - **多维度选择**: 支持房间数、成人/儿童人数选择。
  - **儿童年龄**: 针对儿童入住，支持具体的年龄选择（`ChildAgeSelectionPopup`）。
  - **价格星级**: 集成了价格范围和酒店星级的筛选（`PriceStarSelectionPopup`）。
  - **民宿特有逻辑**: 针对民宿场景，调整了文案和交互逻辑（`HomestayGuestSelectionPopup`）。
- **标签选择 (TagField)**: 支持快捷搜索标签的展示和选中状态管理。

## 3. 组件架构

主要组件位于 `src/components` 目录下，采用分层结构：

- **QueryCard (`src/components/QueryCard`)**:
  - **顶层容器**: 负责整体布局、Tab 栏渲染以及底部的搜索按钮。
  - **逻辑协调**: 使用 `useQueryForm` Hook 获取当前状态和更新方法。
  - **动态渲染**: 根据当前激活的 `activeTab`，从配置中读取字段列表，并通过 `FormFields` 组件动态渲染对应的 FieldRenderer。

- **FieldRenderers (`src/components/FieldRenderers`)**:
  - 包含具体的业务字段组件（`GuestField`, `DateField` 等）。
  - **受控组件设计**: 每个组件接收 `value` (来自 Store) 和 `onUpdate` 回调，遵循单向数据流原则。
  - **复杂交互封装**: `GuestField` 内部通过组合多个 Popup 子组件（如 `GuestSelectionPopup`）来处理复杂的弹窗交互，保持主组件代码清晰。

## 4. 状态管理逻辑

项目使用 `zustand` 进行全局状态管理，核心逻辑位于 `src/store/useQueryStore.ts`，并通过 `src/hooks/useQueryForm.ts` 进行封装。

### 4.1 Store 设计 (`useQueryStore`)

Store 采用了 **场景隔离** 的策略：

- **`activeScene`**: 记录当前用户所在的 Tab（如 `DOMESTIC`）。
- **`scenes`**: 一个字典对象，键为 `TabType`，值为该场景下的 `SearchParams`。
  - **数据独立**: 国内、国际、民宿等场景的搜索条件（如目的地、日期）互不干扰。
  - **状态保持**: 当用户在不同 Tab 间切换时，之前输入的条件会被保留在 Store 中，切回时自动恢复。

### 4.2 Hook 封装 (`useQueryForm`)

为了简化组件调用，封装了自定义 Hook：

- **功能**: 连接组件与 Zustand Store。
- **API**:
  - `formData`: 自动选择当前 `activeScene` 对应的数据返回给组件。
  - `updateField(key, value)`: 自动更新当前 `activeScene` 下的指定字段。
  - `handleTabChange(tab)`: 切换场景。

### 4.3 数据流向

1. **交互**: 用户在 `GuestField` 中修改了人数。
2. **Action**: 组件调用 `updateField('guests', newValue)`。
3. **Store 更新**: `useQueryStore` 接收更新，定位到 `scenes[activeScene].guests` 并更新数据。
4. **重渲染**: 订阅了 Store 的 `QueryCard` 组件感知到 `formData` 变化，将新数据传递给子组件更新 UI。
