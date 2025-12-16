# Makefile 快速上手

## 🎯 立即可用的命令

### 1️⃣ 提交当前的更改

根据你的需求选择一种方式：

#### 选项 A: 快速提交（简单场景）
```bash
make commit-push MSG="feat: 优化过滤器交互体验"
```

#### 选项 B: 详细提交（推荐）
```bash
make commit MSG="feat: 优化过滤器交互体验并添加 Makefile

- 添加 Popover 组件用于过滤器弹窗
- 添加确认和取消按钮，延迟过滤执行
- 优化按钮样式，提升视觉一致性
- 修复弹窗背景颜色问题
- 添加 Makefile 标准化项目管理
- 添加完整的使用文档
"

# 然后推送
make push
```

#### 选项 C: 分步提交（最灵活）
```bash
# 1. 查看状态
make status

# 2. 查看具体变更
make diff

# 3. 提交
make commit MSG="feat: 优化过滤器交互体验并添加项目管理工具"

# 4. 推送
make push
```

### 2️⃣ 构建并更新 Registry

```bash
# 如果你修改了 AdvancedTable 等主要组件
make update-registry-commit MSG="优化 AdvancedTable 过滤器功能"
```

## 📚 常用命令速查

```bash
# 查看所有命令
make help

# 查看项目信息
make info

# 查看 Git 状态
make status

# 查看文件变更
make diff

# 列出所有 shadcn-ui 组件
make list-components

# 启动 Storybook
make storybook

# 清理缓存
make clean
```

## 🚀 日常工作流示例

### 场景 1: 修复一个 Bug

```bash
# 1. 修改代码...

# 2. 快速提交
make quick-fix MSG="修复过滤器弹窗背景颜色问题"
```

### 场景 2: 添加新功能

```bash
# 1. 需要添加 shadcn-ui 组件
make add-shadcn-commit COMPONENT=dialog

# 2. 开发功能...

# 3. 提交
make quick-feat MSG="添加表格行编辑功能"
```

### 场景 3: 更新组件到 Registry

```bash
# 1. 修改组件代码...

# 2. 自动构建 registry 并提交
make update-registry-commit MSG="更新 AdvancedTable 组件"
```

### 场景 4: 发布新版本

```bash
# 自动化发布流程（测试 + 构建 + 提交 + 推送）
make release
```

## ⚡ 最常用的 3 个命令

```bash
# 1. 快速修复并推送
make quick-fix MSG="修复 XXX 问题"

# 2. 快速添加功能并推送
make quick-feat MSG="添加 XXX 功能"

# 3. 查看帮助
make help
```

## 💡 提示

1. **使用 TAB 补全**: 输入 `make` 后按 TAB 键可以看到所有命令
2. **查看命令详情**: 打开 `Makefile` 文件查看每个命令的实现
3. **自定义命令**: 可以在 `Makefile` 中添加你自己的命令
4. **详细文档**: 查看 `MAKEFILE_USAGE.md` 了解所有功能

## 🎓 提交信息规范

遵循 Conventional Commits 规范：

- `feat:` - 新功能
- `fix:` - 修复问题
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具变动
- `build:` - 构建相关

## ❓ 需要帮助？

```bash
# 查看所有命令
make help

# 查看完整文档
cat MAKEFILE_USAGE.md

# 查看示例
bash examples/commit-example.sh
```
