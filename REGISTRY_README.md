# QWS-UI 组件注册表

这是 QWS-UI 组件库的 shadcn 注册表，包含以下高质量企业级组件：

## 可用组件

### Advanced Table
功能丰富的表格组件，支持：
- Excel 风格的单元格编辑
- 拖拽列排序
- 12 种过滤操作符
- Excel 数据粘贴
- 导出到 Excel
- 多单元格选择

### Print Designer
基于 fabric.js 的可视化打印模板设计器，支持：
- 文本、图片、条形码、二维码
- 数据绑定语法 `{{fieldName}}`
- 多种纸张尺寸（A4、A5、B5 等）
- 表格和循环数据
- 标尺和辅助线

### Advanced Form
基于 TanStack Form 的高级表单组件。

## 安装使用

### 方式一：直接安装组件

```bash
npx shadcn@latest add https://yourname.gitee.io/qws-ui/r/advanced-table
npx shadcn@latest add https://yourname.gitee.io/qws-ui/r/print-designer
npx shadcn@latest add https://yourname.gitee.io/qws-ui/r/advanced-form
```

### 方式二：配置注册表

在项目的 `components.json` 中添加：

```json
{
  "registries": {
    "qws-ui": "https://yourname.gitee.io/qws-ui/r"
  }
}
```

然后安装：

```bash
npx shadcn@latest add @qws-ui/advanced-table
```

## 依赖要求

安装前请确保已安装以下基础组件：

```bash
# Advanced Table 依赖
npx shadcn@latest add button input select dialog dropdown-menu

# Print Designer 依赖
npx shadcn@latest add button input select card
```

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui
- @tanstack/react-table
- fabric.js

## 文档

- [完整文档](https://github.com/yourusername/qws-ui)
- [部署指南](https://github.com/yourusername/qws-ui/blob/main/DEPLOY.md)
- [Storybook](https://yourname.github.io/qws-ui-storybook)

## License

MIT
