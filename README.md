# Eyeye Blog

一个现代化的个人博客网站，集成了Dify智能体，提供流畅的用户交互体验。

## ✨ 特性

- 🎨 **现代化UI设计** - 使用Next.js 16 + React 19 + Tailwind CSS构建
- 🤖 **智能对话** - 集成Dify AI智能体，支持流式响应
- 🗄️ **动画效果** - 使用GSAP实现流畅的页面动画
- 📱 **响应式布局** - 完美适配移动端和桌面端
- 🎭 **组件库** - 基于Radix UI的高质量组件
- 💾 **数据库集成** - Neon PostgreSQL支持
- 🚀 **高性能** - 优化的构建和部署流程

## 🛠️ 技术栈

### 前端框架
- **Next.js** 16.0.10 - React框架
- **React** 19.2.0 - UI库
- **TypeScript** - 类型安全
- **Tailwind CSS** 4.1.9 - 样式框架

### UI组件
- **Radix UI** - 无障碍组件库
- **Framer Motion** - 动画库
- **GSAP** - 高性能动画库
- **Lucide React** - 图标库

### 后端服务
- **Next.js API Routes** - 服务端API
- **Neon Database** - PostgreSQL数据库
- **Dify AI** - 智能体集成

### 开发工具
- **ESLint** - 代码检查
- **PostCSS** - 样式处理
- **Turbopack** - 快速构建工具

## 📁 项目结构

```
eyeye_web2/
├── app/                      # Next.js App Router
│   ├── api/               # API路由
│   │   ├── chat/          # Dify智能体API
│   │   ├── health/         # 数据库健康检查
│   │   └── thinking/       # Thinking笔记API
│   ├── layout.tsx         # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css        # 全局样式
├── components/              # React组件
│   ├── ui/               # Radix UI组件
│   ├── hero-section.tsx   # 首屏区域
│   ├── work-section.tsx   # About Me + ASK ME
│   ├── signals-section.tsx # 项目展示
│   ├── thinking-section.tsx # Thinking笔记
│   └── contact-section.tsx # 联系方式
├── lib/                   # 工具函数
├── hooks/                  # React Hooks
├── public/                 # 静态资源
├── styles/                 # 样式文件
├── vercel.json            # Vercel配置
└── package.json            # 项目依赖
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装依赖
```bash
npm install
```

### 配置环境变量
创建 `.env.local` 文件：

```env
DATABASE_URL=postgresql://neondb_owner:npg_ixIe94mGLZcH@ep-blue-hall-amwnkovh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIFY_API_KEY=your-dify-api-key
DIFY_API_URL=https://api.dify.ai/v1/chat-messages
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看项目

## 🔧 环境变量配置

### 必需配置的环境变量

| 变量名 | 说明 | 示例值 |
|----------|------|----------|
| `DATABASE_URL` | Neon数据库连接字符串 | `postgresql://...` |
| `DIFY_API_KEY` | Dify API密钥 | `app-xxxxxxxxxxxx` |
| `DIFY_API_URL` | Dify API端点 | `https://api.dify.ai/v1/chat-messages` |

### Vercel部署配置

在Vercel项目设置中配置上述环境变量，**不要勾选"Secret"选项**，直接粘贴完整值。

## 📦 主要功能

### 1. 智能体对话 (ASK ME)
- 集成Dify AI智能体
- 支持流式响应，实时显示AI回复
- 对话上下文保持，支持多轮对话
- 优化的错误处理和重试机制
- 加载状态指示器

### 2. 个人展示 (About Me)
- 动态眼睛动画效果展示
- 个人信息展示
- 技能栈介绍
- 工作理念说明

### 3. 项目展示 (Project)
- 项目卡片展示
- 技术标签分类
- 悬停交互效果

### 4. 思考笔记 (Thinking)
- 笔记列表展示
- 分类筛选功能
- 响应式卡片布局
- 数据库CRUD操作

### 5. 联系方式 (Contact)
- 社交媒体链接
- 邮箱展示
- 表单验证

## 🎨 UI/UX特性

- **暗色模式** - 完整的暗色主题支持
- **流畅动画** - GSAP + ScrollTrigger实现页面动画
- **响应式设计** - 移动优先的布局策略
- **无障碍访问** - 遵循WCAG 2.1标准
- **性能优化** - 代码分割和懒加载
- **交互反馈** - 悬停状态和点击效果

## 🚀 部署

### Vercel部署（推荐）

1. **连接GitHub仓库**
   ```bash
   git remote add origin https://github.com/hu-qi-jia/eyeye_web2.git
   git push -u origin main
   ```

2. **导入到Vercel**
   - 访问 https://vercel.com/new
   - 导入GitHub仓库
   - 选择Next.js框架

3. **配置环境变量**
   - 在项目设置中添加环境变量
   - 参考[环境变量配置](#-环境变量配置)部分

4. **配置自定义域名**
   - 在Domains设置中添加域名
   - 配置DNS记录指向Vercel

### 自定义域名配置

假设你的域名是 `eyeye.fun`：

**DNS配置**：
```
类型：CNAME
主机记录：@
记录值：eyeye-web2.vercel.app
TTL：600
```

**访问地址**：
- 主域名：https://eyeye.fun
- API健康检查：https://eyeye.fun/api/health

## 📝 开发指南

### 添加新组件
```bash
# 创建新组件
npx shadcn-ui@latest add button

# 或手动创建
mkdir components/my-component
touch components/my-component.tsx
```

### 添加API路由
```bash
# 创建API路由
mkdir app/api/my-route
touch app/api/my-route/route.ts
```

### 样式开发
项目使用Tailwind CSS，支持：
- 工具类优先级
- 响应式设计
- 暗色模式变量

### 数据库操作
```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// 查询数据
const result = await sql`SELECT * FROM notes`

// 插入数据
await sql`INSERT INTO notes (title, content) VALUES (${title}, ${content})`
```

## 🧪 测试

### 运行测试
```bash
npm run lint
npm run build
```

### API测试
```bash
# 测试数据库连接
curl http://localhost:3000/api/health

# 测试Dify集成
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"你好"}'
```

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. **Fork项目**
   ```bash
   git clone https://github.com/hu-qi-jia/eyeye_web2.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```

4. **推送分支**
   ```bash
   git push origin feature/my-feature
   ```

5. **创建Pull Request**
   - 在GitHub上创建PR
   - 描述更改内容
   - 等待代码审查

## 📄 许可证

MIT License

## 👥 作者

Eyeye

## 🔗 相关链接

- [在线演示](https://eyeye.fun) - 项目网站
- [GitHub仓库](https://github.com/hu-qi-jia/eyeye_web2) - 源代码
- [Dify文档](https://docs.dify.ai) - Dify API文档
- [Next.js文档](https://nextjs.org/docs) - Next.js框架文档
- [Radix UI](https://ui.shadcn.com) - UI组件库

---

**注意**：请确保在部署前正确配置所有环境变量，特别是 `DATABASE_URL` 和 `DIFY_API_KEY`。
