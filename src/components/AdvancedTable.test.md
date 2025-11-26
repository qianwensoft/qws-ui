# AdvancedTable 测试文档

## 测试概览

本文档描述了 AdvancedTable 组件的测试用例和覆盖范围。

## 测试覆盖功能点

### ✅ 1. 基础渲染（3 个测试）
- [x] 正确渲染表格结构（表头和数据）
- [x] 渲染正确的数据行数
- [x] 正确处理空数据情况

### ✅ 2. 编辑功能（5 个测试）
- [x] 单击模式：单击单元格进入编辑
- [x] 双击模式：双击单元格进入编辑
- [x] 正确保存编辑的数据并触发回调
- [x] 支持禁用特定列的编辑（`meta.editable = false`）
- [x] 按 Esc 键取消编辑

### ✅ 3. 粘贴功能（3 个测试）
- [x] 支持粘贴单个单元格数据
- [x] 支持粘贴多行多列数据（制表符和换行分隔）
- [x] 禁用粘贴时不响应粘贴事件

### ✅ 4. 过滤功能（4 个测试）
- [x] 显示过滤按钮
- [x] 点击过滤按钮显示过滤面板
- [x] 支持添加过滤条件
- [x] 禁用过滤时不显示过滤按钮

### ✅ 5. 导出功能（3 个测试）
- [x] 启用导出时显示导出按钮
- [x] 禁用导出时不显示导出按钮
- [x] 点击导出按钮显示导出菜单

### ✅ 6. 列管理功能（4 个测试）
- [x] 启用列排序时显示列设置按钮
- [x] 禁用列排序时不显示列设置按钮
- [x] 点击列设置按钮显示列设置弹窗
- [x] 启用列排序时显示拖拽手柄

### ✅ 7. 分页功能（3 个测试）
- [x] 启用分页时显示分页组件
- [x] 禁用分页时不显示分页组件
- [x] 正确调用分页回调（页码变化）

### ✅ 8. 视觉效果（2 个测试）
- [x] 启用斑马纹时添加相应的类
- [x] 支持自定义颜色

### ✅ 9. 多选功能（2 个测试）
- [x] 鼠标拖拽选中多个单元格
- [x] 选中的单元格有相应的样式类

### ✅ 10. 数据变更回调（2 个测试）
- [x] 编辑时提供正确的变更信息（类型、旧值、新值、列ID、行索引）
- [x] 粘贴时提供正确的变更信息

### ✅ 11. 边界情况（4 个测试）
- [x] 处理空数据数组
- [x] 处理空列定义数组
- [x] 处理非常长的文本
- [x] 处理特殊字符（XSS 防护）

## 测试统计

- **总测试数**: 35 个
- **测试分类**: 11 个功能模块
- **覆盖率目标**: > 80%

## 运行测试

### 运行所有测试
```bash
yarn test
# 或
npm test
```

### 运行测试并显示 UI
```bash
yarn test:ui
# 或
npm run test:ui
```

### 运行测试并生成覆盖率报告
```bash
yarn test:coverage
# 或
npm run test:coverage
```

### 运行单个测试文件
```bash
yarn test src/components/AdvancedTable.test.tsx
```

### 监听模式（开发时推荐）
```bash
yarn test --watch
```

## 测试技术栈

- **测试框架**: Vitest
- **测试库**: @testing-library/react
- **用户交互**: @testing-library/user-event
- **DOM 断言**: @testing-library/jest-dom
- **测试环境**: jsdom

## 测试最佳实践

### 1. 测试用户行为而非实现细节
```tsx
// ✅ 好的做法：测试用户看到和做到的事情
const nameCell = screen.getByText('张三');
await user.click(nameCell);

// ❌ 避免：测试内部状态或实现
expect(component.state.editing).toBe(true);
```

### 2. 使用语义化查询
```tsx
// ✅ 好的做法：使用可访问性查询
screen.getByRole('button', { name: '导出' });
screen.getByText('姓名');

// ❌ 避免：使用测试 ID（除非必要）
screen.getByTestId('export-button');
```

### 3. 异步操作使用 waitFor
```tsx
// ✅ 好的做法
await waitFor(() => {
  expect(handleDataChange).toHaveBeenCalled();
});

// ❌ 避免：使用固定延迟
await new Promise(resolve => setTimeout(resolve, 1000));
```

### 4. 清理副作用
```tsx
// 已在 setup.ts 中自动配置
afterEach(() => {
  cleanup();
});
```

## 未来测试计划

### 待添加的测试
- [ ] 键盘导航测试（Tab、Arrow keys）
- [ ] 无障碍性测试（ARIA 属性）
- [ ] 性能测试（大数据集渲染）
- [ ] 拖拽功能的集成测试
- [ ] Excel 导出的功能测试（需要 mock）
- [ ] 过滤条件的逻辑测试（各种操作符）
- [ ] 并发编辑的冲突处理

### 集成测试
- [ ] 与后端 API 的集成测试
- [ ] 完整用户流程测试（E2E）

### 性能测试
- [ ] 1000+ 行数据的渲染性能
- [ ] 频繁编辑时的性能
- [ ] 内存泄漏检测

## 贡献指南

### 添加新测试
1. 在 `AdvancedTable.test.tsx` 中添加测试用例
2. 使用描述性的测试名称
3. 遵循 AAA 模式（Arrange, Act, Assert）
4. 确保测试独立且可重复

### 测试命名规范
```tsx
describe('功能模块名称', () => {
  it('应该 [期望的行为]', () => {
    // 测试代码
  });
});
```

### 提交前检查
- [ ] 所有测试通过
- [ ] 覆盖率保持在目标以上
- [ ] 新功能有对应的测试
- [ ] 测试代码符合规范

## 问题排查

### 测试失败
1. 检查测试环境是否正确设置
2. 查看错误消息和堆栈跟踪
3. 使用 `--reporter=verbose` 获取详细信息

### 测试缓慢
1. 使用 `--maxWorkers=50%` 限制并发数
2. 检查是否有不必要的等待
3. 使用 mock 减少真实操作

### 间歇性失败
1. 检查是否有竞态条件
2. 增加 `waitFor` 的超时时间
3. 确保测试之间相互独立

## 相关资源

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library 文档](https://testing-library.com/react)
- [Testing Library 最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [无障碍性测试指南](https://www.w3.org/WAI/test-evaluate/)

