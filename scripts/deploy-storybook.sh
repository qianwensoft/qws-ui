#!/bin/bash

###############################################################################
# Storybook Gitee Pages 部署脚本
# 用途：构建 Storybook 并部署到 Gitee Pages
###############################################################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
DEPLOY_BRANCH="storybook-pages"
BUILD_DIR="storybook-static"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Storybook Gitee Pages 部署${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "部署分支: ${GREEN}$DEPLOY_BRANCH${NC}"
echo -e "构建目录: ${GREEN}$BUILD_DIR${NC}"
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

# 2. 构建 Storybook
echo -e "${BLUE}[2/7]${NC} 构建 Storybook..."
npm run build-storybook
echo -e "${GREEN}✓ Storybook 构建完成${NC}"

# 3. 检查构建目录
if [ ! -d "$BUILD_DIR" ]; then
  echo -e "${RED}错误: 找不到构建目录 $BUILD_DIR${NC}"
  exit 1
fi

# 4. 创建临时目录并复制文件
echo -e "${BLUE}[3/7]${NC} 准备部署文件..."
TEMP_DIR=$(mktemp -d)
echo -e "临时目录: $TEMP_DIR"

cp -r $BUILD_DIR/* "$TEMP_DIR/"

# 创建 .nojekyll 文件（避免 GitHub/Gitee Pages 忽略下划线开头的文件）
touch "$TEMP_DIR/.nojekyll"

# 创建 README
cat > "$TEMP_DIR/README.md" << 'EOF'
# QWS-UI Storybook

这是 QWS-UI 组件库的在线文档和演示站点。

## 访问地址

https://qianwensoft.gitee.io/qws-ui

## 包含组件

- **Advanced Table** - 功能丰富的表格组件
- **Print Designer** - 可视化打印模板设计器
- **Advanced Form** - 高级表单组件

## 源码仓库

https://gitee.com/qianwensoft/qws-ui
EOF

echo -e "${GREEN}✓ 文件准备完成${NC}"

# 5. 保存当前分支
echo -e "${BLUE}[4/7]${NC} 保存当前工作状态..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "当前分支: $CURRENT_BRANCH"

# 6. 切换到部署分支
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

# 7. 复制构建文件并提交
echo -e "${BLUE}[6/7]${NC} 更新部署文件..."
# 清空当前目录（保留 .git）
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# 复制新文件
cp -r "$TEMP_DIR/"* "$TEMP_DIR/".nojekyll .

# 创建 .gitignore
cat > .gitignore << EOF
# Storybook 构建产物目录
.DS_Store
EOF

# 提交更改
git add -A
if git diff --staged --quiet; then
  echo -e "${YELLOW}没有文件变更，跳过提交${NC}"
else
  COMMIT_MSG="deploy: 更新 Storybook $(date '+%Y-%m-%d %H:%M:%S')"
  git commit -m "$COMMIT_MSG"
  echo -e "${GREEN}✓ 提交完成${NC}"
fi

# 8. 推送到远程
echo -e "${BLUE}[7/7]${NC} 推送到 Gitee..."
read -p "是否推送到远程仓库? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
  echo -e "${YELLOW}跳过推送${NC}"
else
  git push -u origin $DEPLOY_BRANCH
  echo -e "${GREEN}✓ 推送完成${NC}"
fi

# 9. 清理并返回原分支
echo -e "${BLUE}清理环境...${NC}"
git checkout $CURRENT_BRANCH
rm -rf "$TEMP_DIR"

# 完成
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Storybook 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "下一步操作："
echo -e "1. 访问 Gitee 仓库的 ${BLUE}服务 → Gitee Pages${NC}"
echo -e "2. 选择分支 ${BLUE}$DEPLOY_BRANCH${NC}"
echo -e "3. 选择目录 ${BLUE}根目录${NC}"
echo -e "4. 点击 ${BLUE}启动/更新${NC}"
echo ""
echo -e "预计访问地址: ${GREEN}https://qianwensoft.gitee.io/qws-ui${NC}"
echo ""
