# 博客文章和杂想&笔记不显示问题修复

## 问题分析

在 Vercel 部署后，博客文章和杂想&笔记都没有显示。经过分析，发现了以下问题：

1. **`.vercelignore` 文件配置问题**：文件中包含 `*.md` 规则，可能排除了所有 `.md` 和 `.mdx` 文件
2. **正则表达式问题**：`lib/articles.ts` 和 `lib/notes.ts` 中的正则表达式只匹配 Unix 换行符（`\n`），不匹配 Windows 换行符（`\r\n`）

## 修复方案

### 1. 修改 `.vercelignore` 文件

**文件路径**：`d:\LuTeng\AI-Blog\.vercelignore`

**修改内容**：
- 移除了 `*.md` 规则
- 明确列出需要忽略的文档文件

**修改前**：
```
# 文档
README.md
DEPLOYMENT.md
*.md

# 其他
.vercel
```

**修改后**：
```
# 文档
README.md
DEPLOYMENT.md
VERCEL_DEPLOYMENT.md

# 其他
.vercel
```

### 2. 修复 `lib/articles.ts` 中的正则表达式

**文件路径**：`d:\LuTeng\AI-Blog\lib\articles.ts`

**修改内容**：
- 将正则表达式从 `/^---\n([\s\S]*?)\n---/` 改为 `/^---\r?\n([\s\S]*?)\r?\n---/`
- 这样可以同时支持 Windows（`\r\n`）和 Unix（`\n`）换行符

**修改位置**：
- 第 27 行：`getArticles` 函数中的 frontmatter 匹配
- 第 76 行：`getArticle` 函数中的 frontmatter 匹配

### 3. 修复 `lib/notes.ts` 中的正则表达式

**文件路径**：`d:\LuTeng\AI-Blog\lib\notes.ts`

**修改内容**：
- 将正则表达式从 `/^---\n([\s\S]*?)\n---/` 改为 `/^---\r?\n([\s\S]*?)\r?\n---/`
- 同时修复了 `getNoteContent` 函数中的正则表达式

**修改位置**：
- 第 29 行：`getNotes` 函数中的 frontmatter 匹配
- 第 80 行：`getNote` 函数中的 frontmatter 匹配
- 第 126 行：`getNoteContent` 函数中的 frontmatter 移除

### 4. 创建测试 API

**文件路径**：`d:\LuTeng\AI-Blog\app\api\test-articles\route.ts`

**目的**：用于测试文章是否正确加载

## 验证步骤

1. 本地测试：运行 `npm run dev`，访问 `/blog` 和 `/notes` 页面，确认文章和笔记正常显示
2. 部署到 Vercel：提交代码后，等待 Vercel 部署完成
3. 在线测试：访问部署后的网站，确认文章和笔记正常显示

## 技术说明

### 正则表达式问题

原正则表达式 `/^---\n([\s\S]*?)\n---/` 只匹配 Unix 风格的换行符（`\n`），在 Windows 系统上创建的文件使用的是 `\r\n` 换行符，导致正则匹配失败。

修复后的正则表达式 `/^---\r?\n([\s\S]*?)\r?\n---/` 使用 `\r?\n` 来匹配可选的回车符，可以同时支持两种换行符格式。

### Vercel 部署注意事项

Vercel 是一个无服务器平台，不支持文件系统写入操作。因此，创建笔记的 API 接口会返回 500 错误。这个问题需要使用数据库（如 Vercel Postgres、PlanetScale 等）来替代文件系统存储。

## 后续建议

1. **数据库集成**：建议使用 Vercel Postgres 或其他数据库服务来存储笔记数据
2. **环境变量配置**：在 Vercel 项目设置中添加必要的环境变量
3. **错误处理**：改进 API 错误处理，提供更友好的错误信息
4. **测试覆盖**：添加单元测试和集成测试，确保代码质量
