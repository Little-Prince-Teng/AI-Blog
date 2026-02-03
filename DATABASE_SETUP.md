# Vercel Postgres 数据库设置指南

## 概述

本项目使用 Vercel Postgres 存储笔记数据，提供完整的 CRUD 功能（创建、读取、更新、删除）。

## 快速开始

### 1. 创建 Vercel Postgres 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **Postgres**
6. 点击 **Create**

### 2. 获取数据库连接信息

创建数据库后，Vercel 会自动配置以下环境变量：

- `POSTGRES_URL` - 主连接字符串
- `POSTGRES_PRISMA_URL` - Prisma 连接字符串
- `POSTGRES_URL_NON_POOLING` - 无连接池的连接字符串
- `POSTGRES_USER` - 用户名
- `POSTGRES_HOST` - 主机地址
- `POSTGRES_PASSWORD` - 密码
- `POSTGRES_DATABASE` - 数据库名称

### 3. 初始化数据库表结构

部署后，访问以下 URL 初始化数据库：

```
POST /api/db-init
```

或者使用 curl：

```bash
curl -X POST https://your-domain.com/api/db-init
```

### 4. 验证数据库

访问以下 URL 检查数据库状态：

```
GET /api/db-init
```

## 数据库表结构

```sql
CREATE TABLE notes (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('thought', 'note')),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  date VARCHAR(50) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  mood VARCHAR(50),
  source VARCHAR(500),
  source_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(255) | 笔记唯一标识（时间戳） |
| type | VARCHAR(20) | 笔记类型：'thought' 或 'note' |
| title | VARCHAR(500) | 笔记标题 |
| content | TEXT | 笔记内容 |
| tags | TEXT[] | 标签数组 |
| date | VARCHAR(50) | 日期字符串 |
| locale | VARCHAR(10) | 语言代码：'zh' 或 'en-US' |
| mood | VARCHAR(50) | 心情（可选） |
| source | VARCHAR(500) | 来源（可选） |
| source_url | VARCHAR(500) | 来源链接（可选） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 索引

数据库会自动创建以下索引以提高查询性能：

- `idx_notes_locale` - 按 locale 索引
- `idx_notes_type` - 按 type 索引
- `idx_notes_date` - 按 date 降序索引
- `idx_notes_tags` - GIN 索引用于标签搜索

## API 使用示例

### 创建笔记

```bash
curl -X POST https://your-domain.com/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "thought",
    "title": "新的想法",
    "content": "这是一个测试笔记",
    "tags": ["测试", "想法"],
    "date": "2024-01-01",
    "locale": "zh",
    "mood": "🤔"
  }'
```

### 获取所有笔记

```bash
curl https://your-domain.com/api/notes?locale=zh
```

### 按类型筛选

```bash
curl https://your-domain.com/api/notes?locale=zh&type=thought
```

### 按标签筛选

```bash
curl https://your-domain.com/api/notes?locale=zh&tag=测试
```

### 搜索笔记

```bash
curl https://your-domain.com/api/notes?locale=zh&q=测试
```

### 获取单个笔记

```bash
curl https://your-domain.com/api/notes/1234567890?locale=zh
```

### 更新笔记

```bash
curl -X PUT https://your-domain.com/api/notes/1234567890?locale=zh \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的标题",
    "content": "更新后的内容"
  }'
```

### 删除笔记

```bash
curl -X DELETE https://your-domain.com/api/notes/1234567890?locale=zh
```

## 故障排除

### 连接失败

确保环境变量已正确配置：

```bash
# 本地开发
echo $POSTGRES_URL

# Vercel 部署
# 检查 Vercel Dashboard → Settings → Environment Variables
```

### 表不存在

运行数据库初始化 API：

```bash
curl -X POST https://your-domain.com/api/db-init
```

### 查询慢

检查索引是否已创建：

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'notes';
```

### 类型错误

如果遇到类型错误，确保：

1. `@vercel/postgres` 版本正确
2. TypeScript 配置正确
3. 数据库表结构与代码匹配

## 性能优化

### 连接池

Vercel Postgres 默认启用连接池，无需额外配置。

### 索引优化

- 使用 `locale` 索引加速语言筛选
- 使用 `type` 索引加速类型筛选
- 使用 `date` 索引加速排序
- 使用 GIN 索引加速标签搜索

### 查询优化

- 使用参数化查询防止 SQL 注入
- 避免全表扫描
- 使用 `EXPLAIN ANALYZE` 分析慢查询

## 备份

Vercel Postgres 自动备份：

- 每日自动备份
- 保留 7 天
- 可手动触发备份

### 手动备份

在 Vercel Dashboard 中：

1. 进入 Storage → Postgres
2. 点击你的数据库
3. 点击 **Backups**
4. 点击 **Create backup**

## 监控

在 Vercel Dashboard 中查看：

- 查询性能
- 连接数
- 存储使用量
- 错误日志

### 查询日志

```bash
# 查看 Vercel 部署日志
vercel logs --follow

# 查看数据库查询日志
# 在代码中添加 console.log
```

## 安全

### SQL 注入防护

所有查询都使用参数化查询，防止 SQL 注入：

```typescript
// ✅ 安全
await sql`SELECT * FROM notes WHERE id = ${id}`;

// ❌ 不安全
await sql`SELECT * FROM notes WHERE id = '${id}'`;
```

### 环境变量保护

- 不要在代码中硬编码数据库凭证
- 使用 Vercel 的环境变量功能
- 不要将 `.env.local` 提交到 Git

## 迁移现有数据

如果你之前使用文件系统存储笔记，可以迁移到数据库：

### 方案 1：手动迁移

1. 在数据库中创建笔记
2. 删除旧的 MDX 文件

### 方案 2：脚本迁移

创建迁移脚本读取 MDX 文件并插入到数据库。

## 成本

Vercel Postgres 免费额度：

- 存储：256 MB
- 计算时间：60 小时/月
- 行数：10,000 行

超出免费额度后：

- 存储：$0.15/GB/月
- 计算：$0.08/GB-小时
- 行数：$0.15/1000 行/月

## 支持

如有问题，请查看：

- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [项目 Issues](https://github.com/your-repo/issues)
