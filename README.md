# mx-moni-dashboard

东方财富妙想模拟交易监控平台 — 前端 + 后端完整项目。

## 功能

- 账户总览（总资产、可用资金、持仓市值、累计盈亏）
- 持仓查询（成本价、现价、盈亏金额/率）
- 委托订单（进行中/历史，支持状态筛选）
- 自选股行情
- 多账户管理（加密存储 API Key）
- 自动轮询 + 窗口聚焦刷新

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Ant Design 6 |
| 后端 | Node.js + Fastify 5 + TypeScript |
| 数据库 | SQLite（WAL 模式） |
| 加密 | AES-256-GCM |

## 快速启动

### 1. 安装依赖

```bash
# 安装根目录 concurrently（用于并行启动）
npm install

# 安装前后端依赖
cd frontend && npm install
cd ../backend && npm install
```

### 2. 配置环境变量

```bash
cp backend/.env.example backend/.env
# 编辑 backend/.env，填入 ENCRYPTION_KEY（从东方财富获取）
```

### 3. 启动服务

```bash
# 方式一：一键启动（前后端同时运行）
./start.sh

# 方式二：分别启动
# 终端 1 - 后端
cd backend && npm run dev

# 终端 2 - 前端
cd frontend && npm run dev
```

启动后访问：**http://localhost:5173**

## 目录结构

```
.
├── frontend/            # 前端 React 应用
│   ├── src/
│   │   ├── components/  # UI 组件
│   │   ├── hooks/       # React hooks
│   │   ├── services/    # API 调用
│   │   ├── types/       # TypeScript 类型
│   │   └── utils/       # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── backend/             # 后端 Fastify 服务
│   ├── src/
│   │   ├── db/          # 数据库初始化
│   │   ├── lib/         # 加密工具
│   │   ├── routes/      # API 路由
│   │   └── services/    # 业务逻辑
│   ├── package.json
│   └── tsconfig.json
├── data/                # SQLite 数据库目录（运行时创建）
├── start.sh             # 一键启动脚本
└── package.json         # 根目录
```

## API 端口

| 服务 | 端口 | 说明 |
|---|---|---|
| 前端 (Vite) | 5173 | Web UI |
| 后端 (Fastify) | 3001 | REST API |

## 数据流向

```
浏览器 → Vite Proxy (/api) → Fastify (3001) → 东方财富 API
                                      ↓
                               SQLite (data/mx-moni.db)
```

## 环境变量

### backend/.env

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | 3001 | 后端服务端口 |
| `DATA_DIR` | `./data` | SQLite 数据库目录 |
| `ENCRYPTION_KEY` | 自动生成 | API Key 加密密钥 |

## 注意事项

- 买入/卖出数量必须为 100 的整数倍
- 交易时间：9:30-11:30，13:00-15:00
- 东方财富免费版 API 每日调用上限 50 次
