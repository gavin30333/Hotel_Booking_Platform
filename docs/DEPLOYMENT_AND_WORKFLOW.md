# 部署与工作流指南 (Deployment & Workflow Guide)

本文档旨在帮助团队成员（特别是新手）理解本项目的 Vercel 部署配置、开发与生产环境的区别，以及如何在生产环境中安全地修复 Bug。

## 1. 项目部署分析 (Project Deployment Analysis)

本项目使用 **Vercel** 进行自动化部署。Vercel 是一个现代化的前端云平台，能够自动识别代码变更并进行构建和发布。

### 1.1 Vercel 配置文件 (`vercel.json`)

项目根目录下的 `vercel.json` 文件是 Vercel 的核心配置，告诉 Vercel 如何处理我们的项目。

```json
{
  "buildCommand": "npm run build:h5",
  "outputDirectory": "dist/h5",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.ts"
    }
  ],
  "functions": {
    "api/index.ts": {
      "includeFiles": "src/**/*",
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, must-revalidate" }
      ]
    }
  ]
}
```

*   **`buildCommand`**: 告诉 Vercel 运行 `npm run build:h5` 来构建项目。这个命令会将 Taro 代码编译成可以在浏览器运行的 H5 代码。
*   **`outputDirectory`**: 告诉 Vercel 构建完成后，静态文件（HTML, CSS, JS）在哪里。Taro 默认输出到 `dist/h5`。
*   **`rewrites`**: 这是一个非常重要的配置！它将所有以 `/api/` 开头的请求转发到 `api/index.ts` 文件。这让我们可以在同一个域名下同时运行前端页面和后端 API。
*   **`functions`**: 配置后端 API 函数的运行环境，例如内存限制 (1024MB) 和最大执行时间 (10秒)。
*   **`headers`**: 设置 HTTP 响应头，这里配置了 API 不缓存，确保用户总是获取最新数据。

### 1.2 构建脚本 (`package.json`)

在 `package.json` 中，你可以看到我们定义的脚本：

*   `dev:h5`: **开发环境**使用。启动本地开发服务器，支持热更新（修改代码后浏览器自动刷新）。
*   `build:h5`: **生产环境**使用。对代码进行压缩、优化，生成用于部署的静态文件。

---

## 2. 开发环境 vs 生产环境 (Development vs. Production)

理解这两个环境的区别对于避免线上事故至关重要。

| 特性 | 开发环境 (Development) | 生产环境 (Production) |
| :--- | :--- | :--- |
| **启动命令** | `npm run dev:h5` | `npm run build:h5` (构建) |
| **运行方式** | 本地服务器 (Localhost) | Vercel 云端服务器 |
| **代码状态** | 未压缩，包含调试信息，SourceMap | 压缩混淆，去除注释，体积最小化 |
| **环境变量** | 读取本地 `.env` 文件 | 读取 Vercel 控制台配置的环境变量 |
| **数据源** | 通常连接本地数据库或测试数据库 | 连接生产环境数据库 |
| **性能** | 较慢（为了调试方便） | 极快（经过优化） |

### 2.1 环境变量管理

*   **本地开发**: 我们在项目根目录下创建一个 `.env` 文件（**注意：不要提交到 Git！**），在里面配置敏感信息，例如：
    ```bash
    # .env 文件
    AMAP_API_KEY=你的高德地图Key
    MONGODB_URI=mongodb://localhost:27017/hotel_management
    ```
*   **线上生产**: 在 Vercel 的项目设置页面 (Settings -> Environment Variables) 中配置这些变量。Vercel 会在构建和运行时自动注入这些变量。

---

## 3. 生产环境 Bug 修复流程 (Hotfix Workflow)

当线上环境（Production）出现 Bug 时，我们需要紧急修复。**切记：不要直接在 `main` 分支上修改代码！** 请遵循以下标准流程：

### 第一步：复现问题 (Reproduce)
1.  尝试在本地开发环境 (`npm run dev:h5`) 复现该 Bug。
2.  确认是代码逻辑问题，还是环境配置（如数据库连接、API Key）问题。

### 第二步：创建修复分支 (Create Branch)
从 `main` 分支（或你当前的生产分支）切出一个新的分支，通常命名为 `hotfix/xxx`。

```bash
git checkout main
git pull origin main  # 确保本地 main 是最新的
git checkout -b hotfix/fix-login-error
```

### 第三步：修复并验证 (Fix & Verify)
1.  修改代码修复 Bug。
2.  在本地运行测试，确保修复有效且没有引入新问题。

### 第四步：提交并推送 (Commit & Push)

```bash
git add .
git commit -m "fix: 修复登录失败的问题"
git push origin hotfix/fix-login-error
```

### 第五步：创建 Pull Request (PR)
1.  在 GitHub/GitLab 上创建一个 Pull Request (PR)，将 `hotfix/fix-login-error` 合并回 `main`。
2.  **Code Review**: 让团队其他成员审查你的代码。这是防止二次事故的关键！

### 第六步：自动部署 (Auto Deploy)
1.  当 PR 被合并到 `main` 分支后，Vercel 会自动检测到变动，并触发新的构建和部署。
2.  你可以在 Vercel 控制台查看部署进度。

### 第七步：线上验证 (Verify in Prod)
部署完成后，访问线上地址，验证 Bug 是否已彻底解决。

---

## 4. 给新手的建议 (Tips for Beginners)

1.  **多看日志**: Vercel 控制台有详细的 Build Logs (构建日志) 和 Runtime Logs (运行日志)。报错时先看日志，通常能找到线索。
2.  **保持本地与线上环境一致**: 尽量确保本地 Node.js 版本与 Vercel 设置的版本一致。
3.  **不要害怕提问**: 如果遇到不确定的配置，先问团队里的前辈，不要随意修改生产环境配置。
