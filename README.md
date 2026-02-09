# 酒店预订平台 (Hotel Booking Platform)

> 📘 **详细文档**: [项目说明文档](.trae/documents/project_overview.md)

这是一个基于 Taro + React 的酒店预订平台搜索组件实现。项目旨在提供灵活、可配置的跨端搜索体验，支持国内、国际、民宿和钟点房等多种业务场景。

## 🛠 技术栈

- **框架**: [Taro](https://taro-docs.jd.com/) (React) - 支持多端开发
- **语言**: TypeScript
- **样式**: Less
- **UI 组件库**: [Ant Design Mobile](https://mobile.ant.design/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)

## ✨ 核心功能

### 1. 多场景搜索 (QueryCard)
支持通过 Tab 切换不同的业务场景，每种场景拥有独立的配置和状态：
- **国内酒店**: 标准的日期、城市、人数搜索。
- **海外酒店**: 支持国家/城市选择。
- **民宿**: 定制的客源选择逻辑。
- **钟点房**: 简化的时间选择（无过夜）。

### 2. 高度定制的字段组件 (FieldRenderers)
针对不同业务需求实现了定制化的表单组件：
- **GuestField (客人在住)**: 复杂的客源选择器，支持：
  - 成人/儿童人数及房间数联动。
  - 儿童年龄选择 (ChildAgeSelectionPopup)。
  - 价格范围与星级筛选 (PriceStarSelectionPopup)。
- **DateField (日期选择)**: 入住/离店日期及晚数计算。
- **LocationField (位置选择)**: 目的地/城市选择。
- **TagField (标签选择)**: 快捷搜索标签。

### 3. 配置化驱动
通过 `SCENE_CONFIGS` (`src/constants/QueryConfig.ts`) 统一管理各场景的表单字段、提示文案和保障标签，易于扩展和维护。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动项目

项目支持编译到多个平台，常用的启动命令如下：

**H5 预览:**
```bash
npm run dev:h5
```

**微信小程序预览:**
```bash
npm run dev:weapp
```

更多命令请查看 `package.json` 中的 `scripts` 字段。

## 📂 项目结构

```
src/
├── components/
│   ├── FieldRenderers/  # 具体的表单字段组件 (Guest, Date, Location 等)
│   ├── QueryCard/       # 搜索卡片主容器
│   └── ...
├── constants/
│   └── QueryConfig.ts   # 场景配置文件
├── hooks/
│   └── useQueryForm.ts  # 表单逻辑封装 Hook
├── pages/               # 页面文件
├── store/
│   └── useQueryStore.ts # Zustand 状态管理
├── types/               # TypeScript 类型定义
└── app.tsx              # 入口文件
```

## 🧩 架构设计

### 状态管理 (Zustand)
项目采用 **场景隔离** 的状态管理策略。`useQueryStore` 中维护了一个 `scenes` 字典，不同 Tab (场景) 的数据互不干扰。当用户切换 Tab 时，之前的输入状态会被完整保留。

### 组件分层
- **QueryCard**: 作为“智能容器”，负责连接 Store 和渲染布局。
- **FieldRenderers**: 作为“受控组件”，只通过 props 接收数据和更新回调，不持有内部状态，保证了数据流的清晰。

## 📄 许可证

Private
