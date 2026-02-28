# 酒店预订平台 (Hotel Booking Platform)

一个基于 **Taro 4** 和 **React 18** 构建的现代化跨端酒店预订应用，配备强大的 **Node.js** 后端。本项目模拟了真实的旅行应用体验（灵感来自携程/Trip.com），具备全面的搜索、预订和用户管理功能。

## 🌟 核心功能

- **多维度搜索**：
  - 支持按城市（国内/海外）、日期范围、住客人数和房间偏好筛选酒店。
  - 智能搜索历史记录和热门目的地推荐。
- **高性能列表**：
  - 采用 **虚拟列表 (Virtual List)** 技术，流畅渲染海量数据。
  - 高级筛选功能（价格、星级、设施）。
- **交互式地图**：
  - 集成 **高德地图 (AMap)**，可查看酒店位置及周边兴趣点。
- **流畅的预订流程**：
  - 详细的酒店信息展示、房型选择及订单处理。
  - 实时订单状态追踪。
- **用户系统**：
  - 安全的身份验证（登录/注册）。
  - 收藏夹和历史订单管理。
- **全栈架构**：
  - **前端**：Taro 跨端框架（支持 H5、微信小程序）。
  - **后端**：基于 Express 和 MongoDB 的 RESTful API。

## 🛠 技术栈

### 前端
- **框架**：[Taro v4](https://docs.taro.zone/) (跨端开发)
- **库**：[React 18](https://react.dev/)
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **状态管理**：[Zustand](https://github.com/pmndrs/zustand)
- **UI 组件**：[Ant Design Mobile](https://mobile.ant.design/)
- **样式**：Less + CSS Modules
- **路由**：Taro Router

### 后端
- **运行时**：[Node.js](https://nodejs.org/)
- **框架**：[Express](https://expressjs.com/)
- **数据库**：[MongoDB](https://www.mongodb.com/) 配合 [Mongoose](https://mongoosejs.com/)
- **鉴权**：JWT (JSON Web Tokens)

### 工具链
- **构建工具**：Vite
- **代码规范**：ESLint, Prettier
- **Git 钩子**：Husky, Commitlint
- **测试**：Playwright

## 🚀 快速开始

请按照以下步骤在本地搭建项目。

### 前置条件
- **Node.js**：v18.0.0 或更高版本
- **MongoDB**：确保本地实例运行在 `27017` 端口（或配置你的连接 URI）。

### 安装

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd hotel-booking-platform
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

### 后端设置

1. **启动 MongoDB**
   确保你的 MongoDB 服务正在运行。默认情况下，应用连接到 `mongodb://localhost:27017/hotel_management`。

2. **填充数据库**
   使用初始酒店数据填充数据库。
   ```bash
   npm run seed
   ```

3. **启动 API 服务器**
   ```bash
   npm run server:dev
   ```
   服务器将在 `http://localhost:3000` 启动（具体端口请查看控制台输出）。

### 前端设置

打开一个新的终端窗口来运行前端客户端。

**H5 (Web) 端：**
```bash
npm run dev:h5
```
访问应用地址：`http://localhost:10086` (默认 Taro 端口)。

**微信小程序端：**
```bash
npm run dev:weapp
```
打开微信开发者工具并导入 `dist/weapp` 目录。

## 📂 项目结构

```
├── config/              # 构建配置
├── scripts/             # 实用脚本 (如数据填充)
├── src/
│   ├── api/             # 后端应用 (Express)
│   │   ├── config/      # 数据库和应用配置
│   │   ├── controllers/ # 请求处理器
│   │   ├── models/      # Mongoose 模型
│   │   ├── routes/      # API 路由接口
│   │   └── app.ts       # 服务器入口点
│   ├── components/      # 可复用 React 组件
│   │   ├── common/      # 通用 UI 组件
│   │   └── ...          # 业务组件
│   ├── pages/           # 应用页面 (首页, 列表, 详情等)
│   ├── store/           # Zustand 状态存储
│   ├── utils/           # 辅助函数
│   └── app.tsx          # App 入口点
├── .env                 # 环境变量
├── package.json         # 依赖和脚本
└── README.md            # 项目文档
```

## 📜 脚本说明

| 脚本 | 描述 |
|---|---|
| `npm run server:dev` | 以监听模式启动后端服务器 |
| `npm run seed` | 使用模拟酒店数据填充数据库 |
| `npm run dev:h5` | 在开发模式下运行 H5 前端 |
| `npm run dev:weapp` | 在开发模式下运行微信小程序 |
| `npm run build:h5` | 构建 H5 前端生产版本 |
| `npm run lint` | 运行 ESLint 检查代码质量问题 |

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：
1. Fork 本仓库。
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 开启 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证。
