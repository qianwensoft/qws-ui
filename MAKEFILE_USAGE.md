# Makefile 使用指南

QWS-UI 项目标准化管理脚本

## 快速开始

```bash
# 查看所有可用命令
make help

# 或直接运行
make
```

## 📦 开发环境

### 安装依赖
```bash
make install
```

### 启动开发服务器
```bash
make dev
```

### 启动 Storybook
```bash
make storybook
```

### 清理缓存
```bash
make clean
```

## 🎨 shadcn-ui 组件管理

### 添加新组件
```bash
# 添加单个组件
make add-component COMPONENT=button

# 添加组件并自动提交
make add-shadcn-commit COMPONENT=popover
```

### 更新现有组件
```bash
# 覆盖更新组件
make update-component COMPONENT=button
```

### 查看已安装组件
```bash
make list-components
```

## 📚 Registry 管理

### 构建组件 registry
```bash
make registry
```

### 重新构建 registry
```bash
make registry-rebuild
```

## 📝 Git 提交管理

### 提交格式规范

遵循 Conventional Commits 规范：

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具变动
- `build:` 构建相关

### 基础提交

```bash
# 查看状态
make status

# 查看变更
make diff

# 提交更改
make commit MSG="feat: 添加过滤器确认按钮"

# 推送到远程
make push

# 提交并推送（一步完成）
make commit-push MSG="fix: 修复过滤器背景颜色问题"
```

### 快捷提交命令

```bash
# 快速修复
make quick-fix MSG="修复表格过滤器问题"
# 等同于: make commit-push MSG="fix: 修复表格过滤器问题"

# 快速添加功能
make quick-feat MSG="添加过滤器确认按钮"
# 等同于: make commit-push MSG="feat: 添加过滤器确认按钮"
```

## 🔄 完整工作流

### 场景 1: 更新组件后提交到 registry

```bash
# 1. 修改组件代码（手动）
# 2. 运行工作流
make update-registry-commit MSG="更新 AdvancedTable 过滤器功能"

# 这会自动:
# - 构建 registry
# - 显示变更
# - 提交更改（提交信息: "build: 更新 AdvancedTable 过滤器功能"）
```

### 场景 2: 添加 shadcn-ui 组件

```bash
# 一步完成：添加组件 + 提交
make add-shadcn-commit COMPONENT=popover

# 这会自动:
# - 添加 popover 组件
# - 显示变更
# - 提交更改（提交信息: "feat: 添加 popover 组件"）
```

### 场景 3: 修复 bug 的完整流程

```bash
# 1. 修改代码（手动）

# 2. 快速提交并推送
make quick-fix MSG="修复过滤器弹窗背景颜色"

# 或使用完整命令
make commit-push MSG="fix: 修复过滤器弹窗背景颜色"
```

### 场景 4: 添加新功能的完整流程

```bash
# 1. 需要新的 shadcn-ui 组件
make add-shadcn-commit COMPONENT=dialog

# 2. 开发功能（手动）

# 3. 测试
make test

# 4. 构建 registry（如果修改了主要组件）
make registry

# 5. 提交
make commit MSG="feat: 添加表格行编辑功能"

# 6. 推送
make push
```

## 🚀 发布管理

### 版本升级

```bash
# 补丁版本 (1.0.0 -> 1.0.1) - 修复 bug
make bump-patch

# 次版本 (1.0.0 -> 1.1.0) - 新功能
make bump-minor

# 主版本 (1.0.0 -> 2.0.0) - 破坏性变更
make bump-major
```

### 完整发布流程

```bash
# 自动化发布（包含测试、构建、registry、提交、推送）
make release

# 这会自动:
# 1. 运行测试
# 2. 构建生产版本
# 3. 构建 registry
# 4. 显示变更
# 5. 等待确认
# 6. 提交更改
# 7. 推送到远程
```

## 🛠️ 实用工具

### 代码检查与格式化
```bash
# 检查代码质量
make check

# 格式化代码
make format
```

### 项目信息
```bash
# 显示项目信息和 Git 状态
make info
```

### 依赖更新
```bash
# 检查并更新依赖
make deps-update
```

## 💡 常见使用场景

### 每日开发流程

```bash
# 1. 启动开发环境
make storybook

# 2. 开发功能...

# 3. 提交工作
make quick-feat MSG="添加 XX 功能"

# 或更详细的提交
make commit MSG="feat: 添加过滤器确认功能

- 添加确认和取消按钮
- 延迟过滤执行
- 优化按钮样式
"

make push
```

### 更新 shadcn-ui 组件

```bash
# 添加新组件
make add-shadcn-commit COMPONENT=alert

# 更新现有组件（覆盖）
make update-component COMPONENT=button
make commit MSG="chore: 更新 button 组件"
```

### 清理和重建

```bash
# 清理所有缓存
make clean

# 重新安装
make install

# 重新构建 registry
make registry-rebuild
```

## 🎯 最佳实践

### 1. 提交信息规范

✅ **好的提交信息:**
```bash
make commit MSG="feat: 添加过滤器确认按钮功能"
make commit MSG="fix: 修复表格过滤器背景颜色问题"
make commit MSG="docs: 更新 README 使用说明"
```

❌ **不好的提交信息:**
```bash
make commit MSG="更新"
make commit MSG="修复 bug"
make commit MSG="完成"
```

### 2. 工作流建议

1. **小步提交**: 每完成一个小功能就提交
2. **先测试后提交**: 确保代码可以运行
3. **更新 registry**: 修改主要组件后记得构建 registry
4. **使用快捷命令**: 对于简单修改使用 `quick-fix` 和 `quick-feat`

### 3. 发布前检查清单

```bash
# 1. 运行测试
make test

# 2. 检查代码质量
make check

# 3. 构建生产版本
make build

# 4. 构建 registry
make registry

# 5. 查看变更
make status
make diff

# 6. 执行发布
make release
```

## 📋 命令速查表

| 命令 | 说明 |
|------|------|
| `make help` | 显示所有可用命令 |
| `make dev` | 启动开发服务器 |
| `make storybook` | 启动 Storybook |
| `make add-component COMPONENT=xxx` | 添加 shadcn-ui 组件 |
| `make registry` | 构建组件 registry |
| `make commit MSG="xxx"` | 提交更改 |
| `make push` | 推送到远程 |
| `make commit-push MSG="xxx"` | 提交并推送 |
| `make quick-fix MSG="xxx"` | 快速修复并推送 |
| `make quick-feat MSG="xxx"` | 快速添加功能并推送 |
| `make release` | 发布新版本 |
| `make clean` | 清理缓存 |

## ❓ 常见问题

### Q: 如何查看某个命令具体做了什么？
A: 打开 `Makefile` 查看命令定义，或使用 `-n` 参数预览：
```bash
make -n commit MSG="test"
```

### Q: 提交时自动添加的信息是什么？
A: 每次提交会自动添加：
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Q: 如何修改上一次提交？
A: Makefile 不支持 `--amend`，需要手动操作：
```bash
git commit --amend
```

### Q: 如何取消已暂存的文件？
A: 使用 git 命令：
```bash
git reset HEAD <file>
```

## 📝 自定义扩展

可以在 Makefile 中添加自己的命令，例如：

```makefile
##@ 自定义命令

my-workflow: ## 我的自定义工作流
	@echo "执行自定义操作..."
	# 添加你的命令
```

## 🔗 相关资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GNU Make 文档](https://www.gnu.org/software/make/manual/)
- [shadcn/ui 文档](https://ui.shadcn.com/)
