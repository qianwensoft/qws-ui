# QWS-UI 组件发布指南

## 📦 shadcn-ui 风格发布

本项目采用 shadcn-ui 的组件注册表方式发布，允许用户通过 CLI 一键安装组件。

---

## 🚀 发布流程

### 1. 构建组件注册表

每次更新组件后，运行以下命令生成注册表文件：

```bash
npm run build:registry
```

这个命令会：
- ✅ 复制 `src/components` 中的组件到 `registry/default/`
- ✅ 生成 `public/r/*.json` 注册表文件
- ✅ 更新 `registry/registry.json` 主配置

### 2. 提交代码

```bash
# 添加所有更改
git add .

# 提交（包含行级编辑控制功能）
git commit -m "feat: 添加 AdvancedTable 行级编辑控制功能

- 支持通过数据行属性控制编辑权限
- 支持通过回调函数动态判断编辑权限
- 添加只读行视觉反馈样式
- 粘贴功能自动跳过不可编辑行
- 新增 3 个 Storybook 示例
- 优化筛选按钮颜色交互
"
```

### 3. 推送到发布分支

根据配置文件 `registry.config.json`，组件从 `prd` 分支发布：

```bash
# 切换到 prd 分支
git checkout prd

# 合并 main 分支的更改
git merge main

# 推送到远程
git push origin prd

# 切回 main 分支
git checkout main
```

### 4. 验证发布

访问以下 URL 确认文件已正确发布：

- **注册表索引：** https://gitee.com/qianwensoft/qws-ui/raw/prd/r/index.json
- **AdvancedTable 配置：** https://gitee.com/qianwensoft/qws-ui/raw/prd/r/advanced-table.json
- **组件源码：** https://gitee.com/qianwensoft/qws-ui/raw/prd/registry/default/advanced-table/advanced-table.tsx

---

## 💻 使用指南

### 安装组件

用户可以通过 shadcn CLI 安装组件：

#### 方式 1：安装单个组件

```bash
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/prd/r/advanced-table
```

#### 方式 2：配置注册表后安装

在项目的 `components.json` 中添加注册表：

```json
{
  "registries": {
    "qws-ui": "https://gitee.com/qianwensoft/qws-ui/raw/prd/r"
  }
}
```

然后使用简短命令安装：

```bash
npx shadcn@latest add qws-ui/advanced-table
```

### 安装其他组件

```bash
# PrintDesigner
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/prd/r/print-designer

# AdvancedForm
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/prd/r/advanced-form
```

---

## 📋 可用组件

| 组件 | 描述 | 主要依赖 |
|------|------|---------|
| **advanced-table** | 功能丰富的表格组件，支持 Excel 式编辑、过滤、导出 | @tanstack/react-table, @dnd-kit, exceljs |
| **print-designer** | 基于 fabric.js 的可视化打印模板设计器 | fabric, advanced-table |
| **advanced-form** | 基于 TanStack Form 的高级表单组件 | @tanstack/react-form |

---

## 🔧 配置文件

### registry.config.json

```json
{
  "registryName": "qws-ui",
  "homepage": "https://gitee.com/qianwensoft/qws-ui",
  "baseUrl": "https://gitee.com/qianwensoft/qws-ui/raw/prd",
  "deployBranch": "prd",
  "deployMethod": "git-raw"
}
```

### 配置说明

- `registryName`: 注册表名称
- `homepage`: 项目主页
- `baseUrl`: 组件文件的基础 URL（指向 prd 分支的 raw 文件）
- `deployBranch`: 部署分支
- `deployMethod`: 部署方式（git-raw）

---

## 🆕 最新功能（v1.1.0）

### AdvancedTable 行级编辑控制

支持灵活的行级编辑权限控制：

#### 1. 使用数据行属性

```typescript
const data = [
  { id: 1, name: 'Alice', _editable: true },   // 可编辑
  { id: 2, name: 'Bob', _editable: false },    // 不可编辑
];

<AdvancedTable
  data={data}
  columns={columns}
  rowEditableKey="_editable"
/>
```

#### 2. 使用回调函数

```typescript
<AdvancedTable
  data={data}
  columns={columns}
  isRowEditable={(row, rowIndex) => {
    // 自定义逻辑
    if (row.status === '离职') return false;
    if (rowIndex < 3) return false;
    return true;
  }}
/>
```

#### 3. 混合使用（优先级：数据属性 > 回调 > 列级别 > 全局）

```typescript
<AdvancedTable
  data={data}
  columns={columns}
  rowEditableKey="_editable"
  isRowEditable={(row) => row.status === 'active'}
/>
```

**视觉效果：**
- 只读行自动显示灰色背景
- 鼠标指针变为 `not-allowed`
- 粘贴数据时自动跳过不可编辑行

---

## 🧪 测试方式

### 本地测试

1. **启动 Storybook：**
   ```bash
   npm run storybook
   ```
   访问 http://localhost:6006/

2. **查看示例：**
   - Components → AdvancedTable → Row Level Edit Control
   - Components → AdvancedTable → Row Level Edit Control With Callback
   - Components → AdvancedTable → Row Level Edit Control Mixed

### 在其他项目中测试

1. 创建测试项目：
   ```bash
   npx create-next-app@latest test-qws-ui
   cd test-qws-ui
   ```

2. 初始化 shadcn：
   ```bash
   npx shadcn@latest init
   ```

3. 安装 QWS-UI 组件：
   ```bash
   npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/prd/r/advanced-table
   ```

4. 使用组件：
   ```tsx
   import { AdvancedTable } from '@/components/advanced-table';

   // ... 使用组件
   ```

---

## 📝 版本管理

### 发布新版本

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md` 记录变更
3. 运行 `npm run build:registry`
4. 提交并推送到 `prd` 分支
5. 创建 Git Tag：
   ```bash
   git tag -a v1.1.0 -m "Release v1.1.0: 添加行级编辑控制"
   git push origin v1.1.0
   ```

---

## 🐛 故障排查

### 组件安装失败

**问题：** shadcn CLI 无法下载组件

**解决方案：**
1. 检查网络连接到 Gitee
2. 验证 URL 是否可访问
3. 确认 `prd` 分支已推送最新代码

### 依赖冲突

**问题：** 安装后出现依赖版本冲突

**解决方案：**
1. 检查项目的 React 版本（需要 React 18+）
2. 确保已安装 shadcn/ui 基础组件
3. 查看 `public/r/*.json` 中的依赖版本要求

---

## 📚 相关链接

- **项目主页：** https://gitee.com/qianwensoft/qws-ui
- **注册表：** https://gitee.com/qianwensoft/qws-ui/raw/prd/r
- **Storybook（在线）：** _待部署_
- **文档：** 查看项目 README.md 和 CLAUDE.md

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

---

**更新时间：** 2025-12-11
**当前版本：** v1.1.0
**维护者：** qianwensoft
