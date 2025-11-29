# 组件注册表部署指南

本指南介绍如何将 QWS-UI 组件注册表部署到 Gitee，使其他项目可以通过 shadcn CLI 安装您的组件。

## 分支策略

项目使用以下分支进行管理和部署：

| 分支 | 用途 | 内容 |
|------|------|------|
| **main** | 主开发分支 | 完整源代码、配置、文档 |
| **prd** | 生产发布分支 | 仅包含组件注册表文件（registry/ 和 r/） |
| **storybook-pages** | 文档分支 | Storybook 静态站点 |

**部署方式**：
- 组件注册表使用 **Git Raw URL** 方式：`https://gitee.com/qianwensoft/qws-ui/raw/prd/r`
- Storybook 使用 **Gitee Pages** 方式：`https://qianwensoft.gitee.io/qws-ui`

## 目录

- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [部署流程](#部署流程)
- [使用组件](#使用组件)
- [高级配置](#高级配置)
- [常见问题](#常见问题)

## 快速开始

### 1. 配置注册表信息

编辑 `registry.config.json` 文件，更新以下字段：

```json
{
  "registryName": "qws-ui",
  "homepage": "https://gitee.com/qianwensoft/qws-ui",
  "baseUrl": "https://gitee.com/qianwensoft/qws-ui/raw/prd",
  "deployBranch": "prd",
  "deployMethod": "git-raw"
}
```

**字段说明：**
- `registryName`: 注册表名称，建议与项目名称一致
- `homepage`: 项目主页地址（Gitee 仓库地址）
- `baseUrl`: Gitee Raw 文件访问地址（指向 prd 分支）
- `deployBranch`: 部署使用的分支名称（prd 分支）
- `deployMethod`: 部署方式（`git-raw` 使用 Git Raw URL）

### 2. 一键部署

```bash
npm run deploy
```

部署脚本会自动完成以下操作：
1. ✓ 构建组件注册表文件
2. ✓ 创建/切换到部署分支
3. ✓ 复制构建文件
4. ✓ 提交更改
5. ✓ 推送到 Gitee

### 3. 验证部署

部署完成后，验证组件注册表是否可访问：

1. **访问注册表索引**：
   ```
   https://gitee.com/qianwensoft/qws-ui/raw/prd/r/index.json
   ```

2. **访问组件 JSON**：
   ```
   https://gitee.com/qianwensoft/qws-ui/raw/prd/r/advanced-table.json
   ```

如果能正常访问并看到 JSON 数据，说明部署成功！

## 配置说明

### registry.config.json

这是主要的配置文件，包含所有部署相关的设置。

**完整配置示例：**

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "description": "QWS-UI 组件注册表配置文件",
  "registryName": "qws-ui",
  "homepage": "https://gitee.com/qianwensoft/qws-ui",
  "baseUrl": "https://gitee.com/qianwensoft/qws-ui/raw/prd",
  "deployBranch": "prd",
  "deployMethod": "git-raw"
}
```

### 环境变量（可选）

您也可以通过环境变量覆盖配置文件中的设置：

```bash
# 设置 Base URL
export REGISTRY_BASE_URL="https://gitee.com/qianwensoft/qws-ui/raw/prd"

# 设置主页地址
export REGISTRY_HOMEPAGE="https://gitee.com/qianwensoft/qws-ui"

# 设置注册表名称
export REGISTRY_NAME="qws-ui"

# 构建注册表
npm run build:registry
```

环境变量的优先级高于配置文件。

## 部署流程

### 方式一：使用自动化脚本（推荐）

```bash
# 完整部署流程
npm run deploy

# 或者显式调用 Gitee 部署
npm run deploy:gitee
```

部署脚本会：
- 检查工作区状态
- 自动构建注册表
- 创建/更新部署分支
- 提交并推送更改

### 方式二：手动部署

如果需要更精细的控制，可以手动执行各个步骤：

```bash
# 1. 构建注册表文件
npm run build:registry

# 2. 切换到部署分支
git checkout gitee-pages  # 如果分支不存在，使用: git checkout --orphan gitee-pages

# 3. 复制构建文件
cp -r public/r/* .
cp -r registry .

# 4. 提交更改
git add -A
git commit -m "deploy: 更新组件注册表"

# 5. 推送到远程
git push -u origin gitee-pages

# 6. 返回主分支
git checkout main
```

### 方式三：使用 GitHub Actions / Gitee Actions

如果您的仓库支持 CI/CD，可以配置自动部署工作流。

**示例 GitHub Actions 配置** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy Registry

on:
  push:
    branches: [main]
    paths:
      - 'src/components/**'
      - 'registry/**'
      - 'scripts/build-registry.mjs'
      - 'registry.config.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build registry
        run: npm run build:registry
        env:
          REGISTRY_BASE_URL: https://yourname.gitee.io/qws-ui

      - name: Deploy to Gitee Pages
        run: npm run deploy
        env:
          GIT_USER: ${{ github.actor }}
          GIT_PASS: ${{ secrets.GITEE_TOKEN }}
```

## 使用组件

部署完成后，其他项目可以通过 shadcn CLI 安装您的组件。

### 初始化项目并配置注册表

```bash
# 方式 1: 在初始化时指定注册表
npx shadcn@latest init -u https://yourname.gitee.io/qws-ui/r

# 方式 2: 先初始化，再安装组件
npx shadcn@latest init
```

### 安装组件

```bash
# 安装 Advanced Table 组件
npx shadcn@latest add https://yourname.gitee.io/qws-ui/r/advanced-table

# 安装 Print Designer 组件
npx shadcn@latest add https://yourname.gitee.io/qws-ui/r/print-designer

# 安装 Advanced Form 组件
npx shadcn@latest add https://yourname.gitee.io/qws-ui/r/advanced-form
```

### 注意事项

1. **依赖的基础组件**：QWS-UI 组件依赖一些 shadcn/ui 基础组件，需要先安装：

```bash
# 安装 Advanced Table 所需的基础组件
npx shadcn@latest add button input select dialog dropdown-menu

# 安装 Print Designer 所需的基础组件
npx shadcn@latest add button input select card
```

2. **NPM 依赖**：组件还需要一些 NPM 包，shadcn CLI 会自动安装这些依赖。

## 高级配置

### 自定义域名

如果您有自定义域名，可以配置 Gitee Pages 使用自定义域名：

1. 在 Gitee Pages 设置中添加自定义域名
2. 更新 `registry.config.json` 中的 `baseUrl`：

```json
{
  "baseUrl": "https://ui.yourdomain.com"
}
```

3. 重新部署注册表

### 使用其他平台

虽然本指南主要介绍 Gitee Pages，但您也可以部署到其他平台：

**GitHub Pages:**
```json
{
  "baseUrl": "https://yourname.github.io/qws-ui",
  "deployBranch": "gh-pages"
}
```

**Vercel/Netlify:**
- 这些平台会自动部署，只需配置 `baseUrl` 即可
- 可以将 `public/r` 和 `registry` 目录设置为发布目录

**对象存储 + CDN:**
```json
{
  "baseUrl": "https://cdn.yourdomain.com/qws-ui"
}
```

### 版本管理

建议为每个版本创建一个标签，便于用户安装特定版本的组件：

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 部署特定版本
git checkout v1.0.0
npm run deploy
```

## 常见问题

### Q1: 部署后访问 404

**原因：** Gitee Pages 尚未启用或路径配置错误

**解决方案：**
1. 检查 Gitee Pages 是否已启动
2. 确认部署分支和目录设置正确
3. 等待几分钟让 Gitee Pages 更新

### Q2: 组件安装失败

**原因：** 文件路径不正确或 CORS 问题

**解决方案：**
1. 检查 `baseUrl` 配置是否正确
2. 验证 `https://yourname.gitee.io/qws-ui/r/index.json` 是否可访问
3. 检查浏览器控制台的网络请求

### Q3: 样式文件丢失

**原因：** CSS 文件未正确复制或路径不对

**解决方案：**
1. 确认 `registry/default/` 目录包含所有组件文件
2. 检查 `build-registry.mjs` 中的文件复制逻辑
3. 手动验证部署分支中的文件完整性

### Q4: 如何更新已部署的组件

**解决方案：**
1. 修改组件源码
2. 运行 `npm run deploy`
3. 在 Gitee Pages 设置中点击 **更新**

### Q5: 部署脚本需要 jq 工具吗？

**答：** 不是必需的。如果没有安装 `jq`，脚本会使用默认配置。

**安装 jq（可选）：**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

### Q6: 如何回滚到之前的版本

```bash
# 查看部署历史
git checkout gitee-pages
git log --oneline

# 回滚到特定提交
git reset --hard <commit-hash>
git push -f origin gitee-pages

# 返回主分支
git checkout main
```

## 支持

如果您遇到问题或有建议，请：
1. 查看 [Issues](https://github.com/yourusername/qws-ui/issues)
2. 提交新的 Issue
3. 参考 [shadcn/ui 文档](https://ui.shadcn.com/)

## 相关链接

- [Gitee Pages 文档](https://gitee.com/help/articles/4136)
- [shadcn/ui 官方文档](https://ui.shadcn.com/)
- [shadcn CLI 使用指南](https://ui.shadcn.com/docs/cli)
- [QWS-UI 组件文档](./CLAUDE.md)
