# Vercel 部署指南

## 为什么选择 Vercel？

Vercel 是 Next.js 的官方部署平台，提供以下优势：

### ✅ 完整功能支持
- ✅ **服务端渲染（SSR）** - 完整的 Next.js SSR 支持
- ✅ **API 路由** - 所有 API 功能正常工作
- ✅ **图片优化** - 自动优化图片性能
- ✅ **中间件** - 支持所有中间件功能
- ✅ **增量静态再生（ISR）** - 智能的静态页面更新
- ✅ **边缘函数** - 全球边缘计算

### ✅ 性能优化
- 全球 CDN 分发
- 自动 HTTPS
- 智能缓存策略
- 零配置部署

### ✅ 开发体验
- 自动预览部署
- Git 集成
- 实时日志
- 环境变量管理

### ✅ 免费额度
- 100GB 带宽/月
- 无限构建
- 无限部署
- 100GB-Hours 边缘计算

## 前置条件

1. GitHub 仓库已创建并包含项目代码
2. Vercel 账户（免费）
3. 项目已配置好依赖

## 部署步骤

### 方法一：通过 Vercel 网页界面部署（推荐）

#### 1. 注册/登录 Vercel

访问 [vercel.com](https://vercel.com) 并使用 GitHub 账户登录。

#### 2. 导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 在 **"Import Git Repository"** 部分找到你的 `AI-Blog` 仓库
3. 点击 **"Import"** 按钮

#### 3. 配置项目

Vercel 会自动检测 Next.js 项目，大部分配置会自动完成。检查以下配置：

**Project Settings**:
- **Framework Preset**: Next.js
- **Root Directory**: `./`（保持默认）
- **Build Command**: `npm run build`（自动检测）
- **Output Directory**: `.next`（自动检测）

**Environment Variables**:
点击 **"Environment Variables"** 添加以下变量：

```bash
# AI API 密钥（二选一或都配置）
GLM_API_KEY=your_glm_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# 网站配置（可选）
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**重要提示**：
- 点击 **"Add"** 添加每个环境变量
- 选择 **"Production"**、**"Preview"**、**"Development"** 环境勾选框
- API 密钥请妥善保管，不要泄露

#### 4. 部署项目

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（通常 1-3 分钟）
3. 部署成功后会看到绿色的勾号
4. 点击生成的 URL 访问你的网站

### 方法二：通过 Vercel CLI 部署

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

按照提示完成登录。

#### 3. 部署项目

```bash
# 在项目根目录执行
vercel
```

按照提示完成配置：
- 选择 **Link to existing project** 或 **Set up and deploy**
- 选择你的团队（个人账户）
- 确认项目设置

#### 4. 设置环境变量

```bash
# 添加环境变量
vercel env add GLM_API_KEY
vercel env add OPENAI_API_KEY
```

按照提示输入值，选择环境（Production/Preview/Development）。

#### 5. 部署到生产环境

```bash
vercel --prod
```

## 配置文件说明

### vercel.json

项目根目录的 `vercel.json` 文件包含 Vercel 特定配置：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "NEXT_PUBLIC_SITE_URL": {
      "description": "网站 URL",
      "value": "https://your-project.vercel.app"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

**配置说明**：
- `regions`: 部署区域（`hkg1` 为香港区域，适合中国用户）
- `headers`: 安全响应头
- `rewrites`: API 路由重写规则

### .vercelignore

`.vercelignore` 文件指定不需要上传到 Vercel 的文件和目录。

## 环境变量配置

### 在 Vercel 网页界面配置

1. 进入项目 **Settings** → **Environment Variables**
2. 点击 **"Add New"**
3. 输入变量名和值
4. 选择环境（Production/Preview/Development）
5. 点击 **"Save"**

### 必需的环境变量

```bash
# AI API 配置（至少配置一个）
GLM_API_KEY=your_glm_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 可选的环境变量

```bash
# 网站配置
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app

# Node.js 版本（如果需要）
NODE_VERSION=20
```

## 自定义域名配置

### 添加自定义域名

1. 进入项目 **Settings** → **Domains**
2. 输入你的域名（如 `blog.example.com`）
3. 点击 **"Add"**

### 配置 DNS

根据 Vercel 提供的说明配置 DNS 记录：

**方式一：CNAME 记录（推荐）**
```
类型: CNAME
名称: blog
值: cname.vercel-dns.com
```

**方式二：A 记录**
```
类型: A
名称: @
值: 76.76.21.21
```

### 启用 HTTPS

Vercel 会自动为自定义域名提供免费的 SSL 证书，无需额外配置。

## 预览部署

### 自动预览部署

每次推送代码到非 `main` 分支（如 `feature/xxx`）或创建 Pull Request 时，Vercel 会自动创建预览部署。

### 查看预览部署

1. 进入项目 **Deployments** 标签
2. 找到对应的预览部署
3. 点击 URL 查看预览版本

### 预览部署的优势

- 在合并代码前预览更改
- 每个分支都有独立的预览 URL
- 自动清理旧的预览部署
- 支持评论和反馈

## 监控和日志

### 查看部署日志

1. 进入项目 **Deployments** 标签
2. 点击具体的部署
3. 查看 **Build Logs** 和 **Function Logs**

### 实时日志

1. 进入项目 **Logs** 标签
2. 选择环境（Production/Preview）
3. 查看实时日志流

### 性能监控

1. 进入项目 **Analytics** 标签
2. 查看访问统计
3. 分析性能指标

## 更新部署

### 自动部署

每次推送到 `main` 分支时，Vercel 会自动触发部署。

### 手动部署

1. 进入项目 **Deployments** 标签
2. 点击 **"Redeploy"** 按钮
3. 选择要重新部署的提交

### 回滚部署

1. 进入项目 **Deployments** 标签
2. 找到要回滚的部署
3. 点击 **"..."** 菜单
4. 选择 **"Promote to Production"**

## 故障排除

### 问题 1：部署失败

**可能原因**：
- 依赖安装失败
- 构建错误
- 环境变量未配置

**解决方案**：
1. 查看 **Build Logs** 获取详细错误信息
2. 确保所有依赖都在 `package.json` 中
3. 检查环境变量是否正确配置
4. 本地运行 `npm run build` 测试

### 问题 2：API 路由 404

**可能原因**：
- API 路由文件路径错误
- 中间件配置问题

**解决方案**：
1. 检查 `app/api/` 目录结构
2. 确认 `vercel.json` 中的 `rewrites` 配置
3. 查看部署日志中的错误信息

### 问题 3：AI 聊天功能不工作

**可能原因**：
- API 密钥未配置
- API 密钥无效
- 请求超时

**解决方案**：
1. 检查环境变量是否正确配置
2. 验证 API 密钥是否有效
3. 查看 **Function Logs** 中的错误信息
4. 检查 API 配额是否用完

### 问题 4：图片加载失败

**可能原因**：
- 图片路径错误
- 图片优化配置问题

**解决方案**：
1. 检查图片路径是否正确
2. 确认使用 `next/image` 组件
3. 查看浏览器控制台错误信息

### 问题 5：部署速度慢

**可能原因**：
- 项目依赖过多
- 构建时间过长

**解决方案**：
1. 清理不必要的依赖
2. 使用 `npm ci` 替代 `npm install`
3. 启用 Vercel 缓存
4. 考虑使用增量构建

## 性能优化建议

### 1. 启用图片优化

Vercel 自动优化图片，确保使用 `next/image` 组件：

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

### 2. 配置缓存策略

在 `next.config.ts` 中配置缓存：

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
};
```

### 3. 使用 ISR

对于动态内容，使用增量静态再生：

```typescript
export const revalidate = 3600; // 1小时
```

### 4. 优化 API 响应

- 使用边缘函数减少延迟
- 启用响应压缩
- 实现请求缓存

## 成本和限制

### 免费计划

- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 100GB-Hours 边缘计算
- ✅ 自动 HTTPS
- ✅ 全球 CDN

### 付费计划

如需更多资源，可升级到 Pro 计划：
- 1TB 带宽/月
- 1000GB-Hours 边缘计算
- 优先支持
- 更多功能

## 最佳实践

### 1. 使用环境变量

```typescript
// 不要硬编码
const apiKey = process.env.GLM_API_KEY;
```

### 2. 错误处理

```typescript
try {
  const response = await fetch('/api/chat');
} catch (error) {
  console.error('API error:', error);
}
```

### 3. 监控和日志

- 定期查看部署日志
- 监控 API 响应时间
- 跟踪错误率

### 4. 安全性

- 不要在代码中暴露 API 密钥
- 使用 HTTPS
- 实现速率限制
- 验证用户输入

## 与 GitHub Pages 对比

| 特性 | Vercel | GitHub Pages |
|------|--------|-------------|
| SSR 支持 | ✅ | ❌ |
| API 路由 | ✅ | ❌ |
| 图片优化 | ✅ | ❌ |
| 中间件 | ✅ | ❌ |
| 预览部署 | ✅ | ❌ |
| 自定义域名 | ✅ | ✅ |
| 免费 | ✅ | ✅ |
| 部署速度 | 快 | 中等 |
| 配置复杂度 | 低 | 中等 |

## 总结

Vercel 是 Next.js 项目的最佳部署平台，提供：

- ✅ 完整的 Next.js 功能支持
- ✅ 优秀的性能和全球 CDN
- ✅ 简单的部署流程
- ✅ 自动预览部署
- ✅ 丰富的监控工具
- ✅ 免费额度充足

对于需要 AI 聊天、搜索 API 等功能的博客项目，Vercel 是理想的选择！

## 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [环境变量配置](https://vercel.com/docs/projects/environment-variables)
