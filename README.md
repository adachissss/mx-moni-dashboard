# mx-moni-dashboard

东方财富妙想模拟交易监控平台 — 前端 + 后端完整项目。

## 克隆后快速使用

```bash
# 第1步：克隆代码
git clone https://github.com/adachissss/mx-moni-dashboard.git

# 第2步：进入项目目录
cd mx-moni-dashboard

# 第3步：安装后端依赖
cd backend
npm install
cd ..

# 第4步：安装前端依赖
cd frontend
npm install
cd ..

# 第5步：启动服务（Linux/macOS）
./start.sh

# Windows 用户用这个命令：
# start.bat
```

启动后打开浏览器访问：**http://localhost:5173**

## 功能

- 账户总览（总资产、可用资金、持仓市值、累计盈亏）
- 持仓查询（成本价、现价、盈亏金额/率）
- 委托订单（进行中/历史，支持状态筛选）
- 自选股行情
- 多账户管理（加密存储 API Key）
- 自动轮询 + 窗口聚焦刷新

### 功能详细说明

| 模块 | 说明 |
|---|---|
| **账户总览** | 显示总资产、可用资金、持仓市值、累计盈亏及盈亏率，基准100万模拟资金 |
| **当前持仓** | 展示持股数量、成本价、现价、盈亏金额/率，支持实时刷新 |
| **委托订单** | Tab 切换"进行中"与"历史委托"，显示买入/卖出方向、委托价格、数量、成交状态 |
| **自选股** | 展示自选股最新价、涨跌幅、涨跌额，支持分页 |
| **多账户管理** | 支持添加/删除多个东方财富 API Key，账户信息 AES-256-GCM 加密存储到 SQLite |
| **设置** | 可配置自动轮询间隔（10s-5min）、窗口聚焦刷新 |

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Ant Design 6 |
| 后端 | Node.js + Fastify 5 + TypeScript |
| 数据库 | SQLite（WAL 模式） |
| 加密 | AES-256-GCM |

## 安装 Node.js

本项目需要 Node.js ≥ 18.0.0，以下是各系统的安装方式。

### Windows

**方式一（推荐）：从官网下载安装包**

1. 访问 https://nodejs.org/
2. 下载 **LTS（长期支持版）** 安装包（.msi 文件）
3. 双击运行，一路下一步即可
4. 打开命令提示符（cmd）或 PowerShell 验证：
   ```
   node -v
   npm -v
   ```

**方式二：使用 Winget（Windows 10/11）**
```powershell
winget install OpenJS.NodeJS.LTS
```

**方式三：使用 Chocolatey**
```powershell
choco install nodejs-lts
```

---

### macOS

**方式一（推荐）：从官网下载安装包**

1. 访问 https://nodejs.org/
2. 下载 **LTS（长期支持版）** 安装包（.pkg 文件）
3. 双击运行，一路下一步即可

**方式二：使用 Homebrew**
```bash
brew install node@20
```

验证：
```bash
node -v
npm -v
```

---

### Linux（Ubuntu / Debian）

```bash
# 使用 NodeSource 仓库（推荐安装 LTS 版）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v
npm -v
```

**其他发行版：**
- **Fedora**：`sudo dnf install nodejs`
- **Arch**：`sudo pacman -S nodejs npm`
- ** Alpine**：`apk add nodejs npm`

---

### 懒人方式：使用 nvm（所有系统）

nvm 可以管理多个 Node.js 版本，随时切换，推荐高级用户使用。

**Linux / macOS：**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # 或 source ~/.zshrc
nvm install 20
nvm use 20
```

**Windows：使用 nvm-windows**
1. 下载 https://github.com/coreybutler/nvm-windows/releases （nvm-setup.exe）
2. 安装后打开命令行：
   ```
   nvm install lts
   nvm use lts
   ```

---

### 验证安装成功

```bash
node -v   # 应显示 v18.x.x 或 v20.x.x
npm -v    # 应显示 9.x.x 或更高
```

---

## 环境要求

- **Node.js** ≥ 18.0.0（建议使用 LTS 版本）
- **npm** ≥ 9.0.0
- **SQLite**（由 sql.js 提供，纯 JS/WASM 实现，跨平台兼容，无需编译）

检查版本：
```bash
node -v  # 应 ≥ 18.0.0
npm -v   # 应 ≥ 9.0.0
```

## 快速启动

### 第1步：安装后端依赖

```bash
cd backend
npm install
cd ..
```

### 第2步：安装前端依赖

```bash
cd frontend
npm install
cd ..
```

### 第3步：一键启动前后端

```bash
# 方式一：一条命令搞定（推荐）
npm run dev

# 方式二：Windows 用户也可以双击
start.bat

# 方式三：Linux/macOS 用户
./start.sh
```

> 启动后打开浏览器访问：**http://localhost:5173**

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
├── start.sh             # 一键启动脚本 (Linux/macOS)
├── start.bat            # 一键启动脚本 (Windows)
├── package.json         # 根目录（包含 concurrently，可一键启动）
└── README.md
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
