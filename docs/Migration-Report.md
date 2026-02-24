# 用户页面迁移报告

## 概述
本文档详细记录了将用户相关页面从 `src/pages/user/` 迁移至根目录 `src/pages/` 的过程。

## 1. 路由映射表

下表展示了迁移后页面的新路由路径。

| 页面名称 | 旧路由路径 | 新路由路径 | 文件路径 |
| :--- | :--- | :--- | :--- |
| **搜索页** | `pages/user/search/index` | `pages/search/index` | `src/pages/search/index.tsx` |
| **列表页** | `pages/user/list/index` | `pages/list/index` | `src/pages/list/index.tsx` |
| **地图页** | `pages/user/map/index` | `pages/map/index` | `src/pages/map/index.tsx` |

**注意**：
- `pages/user/` 目录已被移除。
- `src/app.config.ts` 已更新以反映这些新路径。
- `config/index.ts`（H5 自定义路由）已更新，将新文件路径映射到现有的外部 URL（例如 `/search`、`/list`、`/map`）。

## 2. `src/pages/` 中的重要页面文件

以下是现位于 `src/pages/` 的关键页面文件列表：

### 已迁移页面
- **`src/pages/search/index.tsx`**：酒店搜索入口页面。
- **`src/pages/list/index.tsx`**：带有筛选功能的酒店列表页面。
- **`src/pages/map/index.tsx`**：地图选择页面。

### 现有页面
- **`src/pages/detail/index.tsx`**：酒店详情页面。
- **`src/pages/booking/index.tsx`**：预订确认页面。
- **`src/pages/login/index.tsx`**：用户登录页面。
- **`src/pages/index/index.tsx`**：（未配置）索引页面文件，目前不在 `app.config.ts` 中。

## 3. 配置变更

### `src/app.config.ts`
更新了 `pages` 数组以包含新路径：
```typescript
pages: [
  'pages/search/index',
  'pages/list/index',
  'pages/detail/index',
  'pages/booking/index',
  'pages/login/index',
  'pages/map/index',
],
```

### `config/index.ts`
更新了 H5 模式下的 `customRoutes`：
```typescript
customRoutes: {
  '/pages/search/index': '/search',
  '/pages/list/index': '/list',
  '/pages/detail/index': '/detail',
  '/pages/detail/index': '/hotel',
  '/pages/map/index': '/map',
},
```

## 4. 代码调整

- **导入**：所有引用 `src/pages/user/*` 的导入均已更新为新路径。
- **导航**：所有使用 `pages/user/*` 字符串的 `Taro.navigateTo` 调用均已更新。
- **相对导入**：迁移文件内部的导入（例如在 `src/pages/map/index.tsx` 中）已调整为指向正确的相对位置（例如 `../../../` -> `../../`）。
