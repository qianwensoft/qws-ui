#!/bin/bash

###############################################################################
# Gitee Pages 自动部署脚本
# 用途：构建组件注册表并部署到 Gitee Pages
###############################################################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 加载配置文件
CONFIG_FILE="registry.config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}错误: 找不到配置文件 $CONFIG_FILE${NC}"
  echo -e "${YELLOW}请先创建配置文件，参考 registry.config.example.json${NC}"
  exit 1
fi

# 读取配置（需要 jq 工具）
if ! command -v jq &> /dev/null; then
  echo -e "${YELLOW}警告: 未安装 jq，使用默认配置${NC}"
  DEPLOY_BRANCH="gitee-pages"
  BASE_URL=""
else
  DEPLOY_BRANCH=$(jq -r '.deployBranch // "gitee-pages"' $CONFIG_FILE)
  BASE_URL=$(jq -r '.baseUrl // ""' $CONFIG_FILE)
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Gitee Pages 部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "部署分支: ${GREEN}$DEPLOY_BRANCH${NC}"
echo -e "Base URL: ${GREEN}${BASE_URL:-未设置}${NC}"
echo ""

# 1. 检查工作区是否干净
echo -e "${BLUE}[1/7]${NC} 检查工作区状态..."
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}警告: 工作区有未提交的改动${NC}"
  read -p "是否继续部署? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}部署已取消${NC}"
    exit 1
  fi
fi

# 2. 构建注册表文件
echo -e "${BLUE}[2/7]${NC} 构建组件注册表..."
if [ -n "$BASE_URL" ]; then
  export REGISTRY_BASE_URL="$BASE_URL"
fi
npm run build:registry
echo -e "${GREEN}✓ 注册表构建完成${NC}"

# 3. 创建临时目录
echo -e "${BLUE}[3/7]${NC} 准备部署文件..."
TEMP_DIR=$(mktemp -d)
echo -e "临时目录: $TEMP_DIR"

# 复制注册表文件到临时目录
mkdir -p "$TEMP_DIR/r"
cp -r public/r/* "$TEMP_DIR/r/"
cp -r registry "$TEMP_DIR/"

# 复制 README（如果存在）
if [ -f "REGISTRY_README.md" ]; then
  cp REGISTRY_README.md "$TEMP_DIR/README.md"
fi

echo -e "${GREEN}✓ 文件准备完成${NC}"

# 4. 保存当前分支
echo -e "${BLUE}[4/7]${NC} 保存当前工作状态..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "当前分支: $CURRENT_BRANCH"

# 5. 切换到部署分支
echo -e "${BLUE}[5/7]${NC} 切换到部署分支 $DEPLOY_BRANCH..."
if git show-ref --verify --quiet refs/heads/$DEPLOY_BRANCH; then
  # 分支已存在
  git checkout $DEPLOY_BRANCH
  git pull origin $DEPLOY_BRANCH || echo -e "${YELLOW}注意: 无法从远程拉取，可能是新分支${NC}"
else
  # 创建新的孤立分支
  echo -e "${YELLOW}分支不存在，创建新的孤立分支${NC}"
  git checkout --orphan $DEPLOY_BRANCH
  git rm -rf . || true
fi

# 6. 复制构建文件并提交
echo -e "${BLUE}[6/7]${NC} 更新部署文件..."
# 清空当前目录（保留 .git）
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# 复制新文件
cp -r "$TEMP_DIR/"* .

# 创建 .gitignore
cat > .gitignore << EOF
# 仅保留构建产物
node_modules/
.DS_Store
EOF

# 提交更改
git add -A
if git diff --staged --quiet; then
  echo -e "${YELLOW}没有文件变更，跳过提交${NC}"
else
  COMMIT_MSG="deploy: 更新组件注册表 $(date '+%Y-%m-%d %H:%M:%S')"
  git commit -m "$COMMIT_MSG"
  echo -e "${GREEN}✓ 提交完成${NC}"
fi

# 7. 推送到远程
echo -e "${BLUE}[7/7]${NC} 推送到 Gitee..."
read -p "是否推送到远程仓库? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
  echo -e "${YELLOW}跳过推送${NC}"
else
  git push -u origin $DEPLOY_BRANCH
  echo -e "${GREEN}✓ 推送完成${NC}"
fi

# 8. 清理并返回原分支
echo -e "${BLUE}清理环境...${NC}"
git checkout $CURRENT_BRANCH
rm -rf "$TEMP_DIR"

# 完成
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "下一步操作："
echo -e "1. 访问 Gitee 仓库的 ${BLUE}服务 → Gitee Pages${NC}"
echo -e "2. 选择分支 ${BLUE}$DEPLOY_BRANCH${NC}"
echo -e "3. 点击 ${BLUE}启动/更新${NC}"
echo ""
if [ -n "$BASE_URL" ]; then
  echo -e "注册表地址: ${GREEN}${BASE_URL}/r${NC}"
  echo -e "安装命令: ${BLUE}npx shadcn@latest add ${BASE_URL}/r/advanced-table${NC}"
fi
echo ""
