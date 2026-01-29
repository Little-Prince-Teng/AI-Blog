# AI-Blog

一个现代化的多语言博客系统，集成了AI助手功能，使用Next.js 15、React 19和TypeScript构建。

## 技术栈

### 核心框架

- **Next.js 15.1.6** - React全栈框架，支持App Router
- **React 19.0.0** - 最新版本的React框架
- **TypeScript 5.7.2** - 类型安全的JavaScript超集

### 样式与UI

- **Tailwind CSS 3.4.17** - 实用优先的CSS框架
- **next-themes 0.4.4** - 主题切换支持（亮色/暗色模式）
- **framer-motion 11.15.0** - 流畅的动画效果
- **lucide-react 0.468.0** - 精美的图标库
- **@radix-ui/react-slot 1.1.1** - 无障碍的UI组件基座

### 内容管理

- **@mdx-js/loader 3.1.1** - MDX加载器
- **@mdx-js/react 3.1.1** - MDX React组件
- **@next/mdx 16.1.4** - Next.js MDX集成
- **remark-gfm 4.0.1** - GitHub Flavored Markdown支持
- **rehype-highlight 7.0.2** - 代码语法高亮
- **rehype-slug 6.0.0** - 自动生成标题锚点
- **highlight.js 11.11.1** - 代码高亮引擎

### 国际化

- **next-intl 3.25.0** - Next.js国际化解决方案

### 工具库

- **clsx 2.1.1** - 条件类名工具
- **tailwind-merge 2.6.0** - Tailwind类名合并工具
- **class-variance-authority 0.7.1** - 类名变体管理

### 开发工具

- **ESLint 9.17.0** - 代码质量检查
- **eslint-config-next 15.1.6** - Next.js ESLint配置
- **PostCSS 8.4.49** - CSS后处理器
- **Autoprefixer 10.4.23** - CSS自动前缀

## 功能特性

### 1. 多语言支持

- 支持中文和英文两种语言
- 自动语言检测和切换
- 完整的国际化路由管理
- 语言切换器组件

### 2. AI聊天助手

- 集成GLM-4-flash模型（智谱AI）
- 支持OpenAI GPT-3.5-turbo作为备选
- 实时对话交互
- 15秒超时保护
- 多语言系统提示词
- 请求性能监控和日志记录

### 3. 文章管理系统

- 基于MDX的文章格式
- 支持文章元数据：
  - 标题
  - 描述
  - 日期
  - 标签
  - 分类
  - 阅读时间
- 自动按日期排序
- 文章列表和详情页

### 4. 搜索功能

- 实时文章搜索
- 支持搜索标题、描述和标签
- 搜索历史记录（本地存储）
- 搜索建议展示
- API路由支持

### 5. 主题切换

- 亮色/暗色主题
- 系统主题自动检测
- 平滑的主题切换动画
- 持久化主题偏好

### 6. 代码高亮

- 自动语法高亮
- 支持多种编程语言
- 优化的代码块样式
- 行号和复制功能

### 7. 响应式设计

- 移动端适配
- 平板和桌面端优化
- 移动端菜单组件
- 流畅的页面过渡动画

### 8. SEO优化

- 自动生成sitemap.xml
- robots.txt配置
- 语义化HTML结构
- 元数据管理

### 9. 用户体验

- 页面加载骨架屏
- 滚动显示动画
- 平滑的页面过渡
- 加载状态指示器

## 项目结构

```项目结构

AI-Blog/
├── app/                      # Next.js App Router
│   ├── [locale]/            # 国际化路由
│   │   ├── about/           # 关于页面
│   │   ├── blog/            # 博客相关页面
│   │   │   ├── [slug]/      # 文章详情页
│   │   │   └── page.tsx     # 博客列表页
│   │   ├── search/          # 搜索页面
│   │   ├── layout.tsx       # 布局组件
│   │   └── page.tsx         # 首页
│   ├── api/                 # API路由
│   │   ├── chat/            # AI聊天API
│   │   └── search/          # 搜索API
│   ├── globals.css          # 全局样式
│   ├── robots.ts            # robots.txt
│   └── sitemap.ts           # sitemap.xml
├── components/              # React组件
│   ├── AIChat.tsx          # AI聊天组件
│   ├── ArticleCard.tsx     # 文章卡片
│   ├── Footer.tsx          # 页脚
│   ├── Header.tsx          # 头部导航
│   ├── LanguageSwitcher.tsx # 语言切换器
│   ├── MDXContent.tsx      # MDX内容
│   ├── MDXRenderer.tsx     # MDX渲染器
│   ├── MobileMenu.tsx      # 移动端菜单
│   ├── PageTransition.tsx  # 页面过渡
│   ├── ScrollReveal.tsx    # 滚动显示动画
│   ├── SearchBar.tsx       # 搜索栏
│   ├── Skeleton.tsx        # 骨架屏
│   ├── ThemeProvider.tsx   # 主题提供者
│   └── ThemeToggle.tsx     # 主题切换
├── content/                # 内容文件
│   └── articles/          # 文章内容
│       ├── en-US/         # 英文文章
│       └── zh/            # 中文文章
├── i18n/                   # 国际化配置
├── lib/                    # 工具函数
│   ├── articles.ts        # 文章相关函数
│   ├── i18n.ts            # 国际化工具
│   ├── mdx-loader.ts      # MDX加载器
│   └── utils.ts           # 通用工具
├── messages/               # 翻译文件
│   ├── en-US.json         # 英文翻译
│   └── zh.json            # 中文翻译
├── middleware.ts           # Next.js中间件
├── next.config.ts          # Next.js配置
├── tailwind.config.ts      # Tailwind配置
└── tsconfig.json          # TypeScript配置
```

## 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# AI配置（二选一或都配置）
GLM_API_KEY=your_glm_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 部署

本项目支持两种部署方式：

### Vercel 部署（推荐）

**Vercel 是 Next.js 的官方部署平台，提供完整的 SSR、API 路由和图片优化支持。**

#### 快速部署

1. 访问 [vercel.com](https://vercel.com) 并使用 GitHub 账户登录
2. 点击 **"Add New..."** → **"Project"**
3. 导入你的 `AI-Blog` 仓库
4. 配置环境变量：
   - `GLM_API_KEY` - 智谱AI API密钥（可选）
   - `OPENAI_API_KEY` - OpenAI API密钥（可选）
5. 点击 **"Deploy"** 等待部署完成

#### 详细文档

查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 获取完整的部署指南，包括：

- 环境变量配置
- 自定义域名设置
- 预览部署
- 监控和日志
- 故障排除

#### Vercel 优势

- ✅ 完整的 Next.js 功能支持（SSR、API 路由、图片优化）
- ✅ 全球 CDN 分发
- ✅ 自动 HTTPS
- ✅ 自动预览部署
- ✅ 实时日志和监控
- ✅ 免费额度充足

### GitHub Pages 部署

**GitHub Pages 部署为静态站点，部分功能受限。**

#### 注意事项

使用 GitHub Pages 部署时，以下功能将不可用：

- ❌ AI 聊天功能（API 路由）
- ❌ 搜索 API（API 路由）
- ❌ 服务端渲染（SSR）
- ❌ 图片优化

#### 快速部署

1. 修改 `next.config.ts` 添加静态导出配置
2. 推送代码到 GitHub
3. 配置 GitHub Pages 使用 GitHub Actions
4. 等待自动部署完成

#### 详细文档

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的 GitHub Pages 部署指南。

### 部署方式对比

| 特性 | Vercel | GitHub Pages |
| ------ | -------- | ------------- |
| SSR 支持 | ✅ | ❌ |
| API 路由 | ✅ | ❌ |
| 图片优化 | ✅ | ❌ |
| 预览部署 | ✅ | ❌ |
| 免费 | ✅ | ✅ |
| 部署速度 | 快 | 中等 |

**推荐使用 Vercel 部署以获得完整功能！**

## 添加文章

1. 在 `content/articles/` 目录下创建对应语言的文件夹（`zh` 或 `en-US`）
2. 创建 `.mdx` 文件，文件名将作为文章的slug
3. 在文件顶部添加frontmatter：

```yaml
---
title: "文章标题"
description: "文章描述"
date: "2024-01-01"
category: "分类"
tags: ["标签1", "标签2"]
readingTime: 5
---
```

1. 在frontmatter下方编写MDX内容

## 国际化i18n

### 添加新语言

1. 在 `lib/i18n.ts` 中添加新的语言代码
2. 在 `messages/` 目录下创建对应的翻译文件
3. 在 `content/articles/` 中创建对应语言的文章文件夹
4. 更新 `middleware.ts` 中的语言配置

### 翻译文件

翻译文件位于 `messages/` 目录，包含以下键：

- `common` - 通用文本
- `nav` - 导航菜单
- `home` - 首页内容
- `blog` - 博客相关
- `search` - 搜索相关
- `theme` - 主题相关

## API接口

### AI聊天接口

**POST** `/api/chat`

请求体：

```json
{
  "message": "用户消息",
  "locale": "zh"
}
```

响应：

```json
{
  "reply": "AI回复"
}
```

### 搜索接口

**GET** `/api/search?q=查询词&locale=zh`

响应：

```json
{
  "articles": [...]
}
```

## 性能优化

- Next.js 15的App Router提供优化的页面加载
- MDX按需加载
- 图片优化（使用Next.js Image组件）
- 代码分割和懒加载
- CSS优化（Tailwind CSS的purge功能）

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request！
