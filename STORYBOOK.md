# Storybook 在线文档部署指南

本指南介绍如何将 Storybook 部署到 Gitee Pages，实现组件文档的在线预览。

## 📖 在线访问

**Storybook 文档地址**: https://qianwensoft.gitee.io/qws-ui

在这里您可以：
- 📱 查看所有组件的交互式演示
- 🎨 实时调整组件属性和样式
- 📝 查看完整的组件文档和使用示例
- ♿ 检查组件的可访问性(A11y)

## 🚀 部署流程

### 方式一：一键自动部署（推荐）

```bash
npm run deploy:storybook
```

脚本会自动完成：
1. ✅ 构建 Storybook 静态文件
2. ✅ 创建/切换到 `storybook-pages` 分支
3. ✅ 复制构建文件到分支
4. ✅ 提交并推送到 Gitee
5. ✅ 返回原分支

### 方式二：手动部署

#### 1. 构建 Storybook

```bash
npm run build-storybook
```

这会在 `storybook-static` 目录生成静态文件。

#### 2. 部署到 Git 分支

```bash
# 创建或切换到部署分支
git checkout storybook-pages
# 或创建新分支: git checkout --orphan storybook-pages

# 清空当前目录（保留 .git）
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# 复制 Storybook 构建文件
cp -r storybook-static/* .

# 创建 .nojekyll 文件
touch .nojekyll

# 提交更改
git add -A
git commit -m "deploy: 更新 Storybook"

# 推送到远程
git push -u origin storybook-pages

# 返回主分支
git checkout main
```

### 3. 启用 Gitee Pages

1. 访问 Gitee 仓库：https://gitee.com/qianwensoft/qws-ui
2. 进入 **服务** → **Gitee Pages**
3. 配置如下：
   - 部署分支：`storybook-pages`
   - 部署目录：根目录 `/`
4. 点击 **启动** 或 **更新**

等待几分钟后，Storybook 将在 https://qianwensoft.gitee.io/qws-ui 可访问。

## 📋 可用命令

```bash
# 本地开发模式（端口 6006）
npm run storybook

# 构建静态文件
npm run build-storybook

# 部署到 Gitee Pages
npm run deploy:storybook

# 本地预览构建后的文件
npx serve storybook-static
```

## 🛠️ 配置说明

### Storybook 配置文件

- **`.storybook/main.ts`** - 主配置文件
- **`.storybook/preview.ts`** - 预览配置
- **`.storybook/vitest.setup.ts`** - 测试配置

### 故事文件位置

所有故事文件位于 `src/stories/` 目录：
- `AdvancedTable.stories.tsx`
- `PrintDesigner.stories.tsx`
- `AdvancedForm.stories.tsx`

### 部署分支结构

```
storybook-pages
├── .nojekyll           # 避免 Gitee Pages 忽略特殊文件
├── README.md           # 分支说明
├── index.html          # 入口文件
├── iframe.html         # 组件预览框架
├── assets/             # 静态资源
├── sb-addons/          # Storybook 插件
└── ...                 # 其他构建文件
```

## 🎨 Storybook 功能

### 已启用的插件

- **@storybook/addon-docs** - 自动生成文档
- **@storybook/addon-a11y** - 可访问性检查
- **@chromatic-com/storybook** - 视觉测试
- **@storybook/addon-vitest** - Vitest 集成

### 组件演示

每个组件都包含多个故事（Stories），展示不同的使用场景：

#### Advanced Table
- 基础表格
- 可编辑表格
- 带过滤器
- 带分页
- Excel 导出
- 拖拽排序列

#### Print Designer
- 基本设计器
- 发货单模板
- 带数据绑定
- 自定义纸张

#### Advanced Form
- 基础表单
- 带验证
- 动态字段

## 🔄 更新流程

当您修改了组件或故事文件后：

```bash
# 1. 重新部署 Storybook
npm run deploy:storybook

# 2. 在 Gitee Pages 设置中点击"更新"按钮
```

或者设置 Git Hooks 自动部署：

```bash
# .git/hooks/pre-push
#!/bin/bash
echo "自动部署 Storybook..."
npm run deploy:storybook
```

## 🌐 自定义域名（可选）

如果您有自定义域名，可以在 Gitee Pages 设置中配置：

1. 进入 Gitee Pages 设置
2. 添加自定义域名（如 `docs.yourdomain.com`）
3. 配置 DNS CNAME 记录指向 `qianwensoft.gitee.io`
4. 等待 DNS 生效

## 🐛 常见问题

### Q1: Storybook 样式丢失

**原因：** Tailwind CSS 配置问题

**解决：** 检查 `.storybook/preview.ts` 是否正确导入了样式文件：
```ts
import '../src/index.css';
```

### Q2: 组件无法交互

**原因：** JavaScript 文件加载失败

**解决：** 确保创建了 `.nojekyll` 文件，避免 Gitee Pages 忽略下划线开头的文件。

### Q3: 部署后显示 404

**原因：** Gitee Pages 未正确配置或未启动

**解决：**
1. 检查 Gitee Pages 是否已启动
2. 确认分支和目录配置正确
3. 等待几分钟让 Gitee Pages 更新

### Q4: 构建文件过大

**原因：** 某些组件依赖较大（如 fabric.js）

**解决：** 考虑使用代码分割：
```ts
// .storybook/main.ts
viteFinal: (config) => ({
  ...config,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'fabric': ['fabric'],
          'exceljs': ['exceljs']
        }
      }
    }
  }
})
```

## 📚 相关链接

- **在线文档**: https://qianwensoft.gitee.io/qws-ui
- **源码仓库**: https://gitee.com/qianwensoft/qws-ui
- **Storybook 官方文档**: https://storybook.js.org/
- **Gitee Pages 文档**: https://gitee.com/help/articles/4136

## 🤝 贡献

如果您想改进 Storybook 配置或添加新的故事：

1. Fork 本仓库
2. 创建您的功能分支
3. 修改 `.storybook/` 或 `src/stories/`
4. 提交 Pull Request

## 📄 许可证

MIT License
