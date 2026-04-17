#!/bin/bash
# 妙想模拟交易监控 - 启动脚本

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend"

echo ">>> 妙想模拟交易监控启动中..."

# 检查 Node.js
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js 未安装"
  exit 1
fi

# 检查前端依赖
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo ">>> 首次运行，安装前端依赖..."
  cd "$FRONTEND_DIR" && npm install
fi

# 检查后端依赖
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo ">>> 首次运行，安装后端依赖..."
  cd "$BACKEND_DIR" && npm install
fi

# 检查 concurrently
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo ">>> 安装 concurrently..."
  cd "$SCRIPT_DIR" && npm install
fi

# 启动前后端
echo ">>> 启动后端 + 前端服务..."
cd "$SCRIPT_DIR" && npm run dev
