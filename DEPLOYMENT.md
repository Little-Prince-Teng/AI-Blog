# GitHub Pages 部署指南

## 部署方案概述

本项目使用 GitHub Actions 自动部署到 GitHub Pages。由于 Next.js 是服务端渲染应用，我们需要将其配置为静态导出。

## 前置条件

1. GitHub 仓库已创建
2. 仓库名称为 `AI-Blog`（如果使用其他名称，需要修改配置）
3. 代码已推送到 GitHub

## 部署步骤

### 1. 修改 Next.js 配置

更新 `next.config.ts` 文件，添加静态导出配置：

```typescript
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  output: 'export',              // 启用静态导出
  images: {
    unoptimized: true,           // 禁用图片优化（静态导出需要）
  },
  basePath: process.env.NODE_ENV === 'production' ? '/AI-Blog' : '',  // 设置基础路径
  assetPrefix: process.env.NODE_ENV === 'production' ? '/AI-Blog' : '', // 设置资源前缀
};
```

**重要说明**：
- `/AI-Blog` 是你的仓库名称，如果仓库名不同，请相应修改
- `basePath` 和 `assetPrefix` 确保静态资源路径正确

### 2. 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. 配置 GitHub Pages 设置

#### 方法一：通过 GitHub 网页界面配置

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Build and deployment** 部分：
   - **Source**: 选择 **GitHub Actions**
   - 保存设置

#### 方法二：自动配置（推荐）

推送代码后，GitHub Actions 会自动配置 Pages 设置。

### 4. 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "feat: 添加 GitHub Pages 部署配置"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/AI-Blog.git

# 推送到 main 分支
git push -u origin main
```

### 5. 查看部署状态

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看工作流运行状态
4. 部署成功后，会显示绿色的勾号

### 6. 访问你的网站

部署成功后，你的网站将可以通过以下地址访问：

```
https://你的用户名.github.io/AI-Blog/
```

例如，如果你的用户名是 `johndoe`，则访问地址为：

```
https://johndoe.github.io/AI-Blog/
```

## 注意事项

### 1. 仓库名称

如果仓库名不是 `AI-Blog`，需要修改以下配置：

**next.config.ts**:
```typescript
basePath: process.env.NODE_ENV === 'production' ? '/你的仓库名' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/你的仓库名' : '',
```

### 2. 静态导出限制

由于使用静态导出，以下功能将不可用：
- ❌ API 路由（`/api/*`）
- ❌ 服务端渲染（SSR）
- ❌ 图片优化（`next/image`）
- ❌ 中间件（`middleware.ts`）

**解决方案**：
- AI 聊天功能需要改为客户端直接调用 API
- 搜索功能需要改为前端搜索
- 图片使用 HTML `<img>` 标签或第三方服务

### 3. 环境变量

如果需要在生产环境使用环境变量，需要在 GitHub 仓库中配置：

1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加你的环境变量（如 `GLM_API_KEY`）

### 4. 自定义域名（可选）

如果需要使用自定义域名：

1. 在仓库 **Settings** → **Pages** 中添加自定义域名
2. 配置 DNS 记录
3. 在项目根目录创建 `CNAME` 文件，内容为你的域名

### 5. 更新部署

每次推送到 `main` 分支时，GitHub Actions 会自动触发部署流程。

## 本地测试静态导出

在部署前，可以本地测试静态导出：

```bash
# 构建静态导出
npm run build

# 启动静态服务器
npx serve@latest out
```

访问 `http://localhost:3000` 查看效果。

## 故障排除

### 问题 1：部署失败

**解决方案**：
- 检查 Actions 日志查看具体错误
- 确保所有依赖都已正确安装
- 检查构建命令是否成功

### 问题 2：页面空白或样式错误

**解决方案**：
- 检查 `basePath` 和 `assetPrefix` 配置
- 确保静态资源路径正确
- 查看浏览器控制台错误信息

### 问题 3：路由 404

**解决方案**：
- 确认 `output: 'export'` 配置正确
- 检查路由是否使用动态参数
- 静态导出不支持动态路由，需要预生成所有页面

## 替代方案：Vercel 部署（推荐）

如果需要完整的 Next.js 功能（SSR、API 路由等），建议使用 Vercel 部署：

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. Vercel 会自动配置和部署
4. 获得免费的 HTTPS 域名

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和功能支持。

## 总结

GitHub Pages 部署方案：
- ✅ 免费
- ✅ 简单易用
- ✅ 自动部署
- ❌ 功能受限（静态导出）

Vercel 部署方案：
- ✅ 免费
- ✅ 完整功能
- ✅ 最佳性能
- ✅ 自动部署
- ✅ 预览环境

根据你的需求选择合适的部署方案！
