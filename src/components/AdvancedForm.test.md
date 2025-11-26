# AdvancedForm 测试文档

## 测试概览

本文档描述了 AdvancedForm 组件的测试用例和覆盖范围。

## 测试覆盖功能点

### ✅ 1. 基础渲染（5 个测试）
- [x] 正确渲染表单结构
- [x] 渲染所有字段类型（text、email、password、number、textarea、select、checkbox、radio）
- [x] 显示必填标记（*）
- [x] 显示占位符文本
- [x] 显示帮助文本

### ✅ 2. 表单布局（3 个测试）
- [x] 垂直布局（vertical）
- [x] 水平布局（horizontal）
- [x] 行内布局（inline）

### ✅ 3. 表单值输入（6 个测试）
- [x] 文本输入（text）
- [x] 数字输入（number）
- [x] 文本域输入（textarea）
- [x] 选择框（select）
- [x] 复选框（checkbox）
- [x] 单选按钮（radio）

### ✅ 4. 表单验证（4 个测试）
- [x] 显示验证错误
- [x] 验证邮箱格式
- [x] 验证最小长度
- [x] 组合多个验证器

### ✅ 5. 表单提交（4 个测试）
- [x] 提交时调用 onSubmit 回调
- [x] 提交时显示加载状态
- [x] 处理提交错误
- [x] 提交成功后重置表单（如果配置）

### ✅ 6. 初始值（1 个测试）
- [x] 使用初始值填充表单

### ✅ 7. 禁用状态（2 个测试）
- [x] 禁用整个表单
- [x] 禁用单个字段

### ✅ 8. 取消按钮（3 个测试）
- [x] 显示取消按钮
- [x] 隐藏取消按钮
- [x] 点击取消按钮调用回调

### ✅ 9. 自定义文本（2 个测试）
- [x] 自定义提交按钮文本
- [x] 自定义取消按钮文本

### ✅ 10. 边界情况（2 个测试）
- [x] 处理空字段数组
- [x] 处理没有选项的选择框

### ✅ 11. 验证器工具（10 个测试）
- [x] validators.required - 必填验证
- [x] validators.email - 邮箱格式验证
- [x] validators.phone - 手机号验证
- [x] validators.url - URL 验证
- [x] validators.minLength - 最小长度验证
- [x] validators.maxLength - 最大长度验证
- [x] validators.min - 最小值验证
- [x] validators.max - 最大值验证
- [x] validators.pattern - 正则匹配验证
- [x] validators.compose - 组合验证器

## 测试统计

- **总测试数**: 42 个
- **测试通过率**: 100% ✅
- **代码覆盖率**: 94.94% (语句)
- **分支覆盖率**: 93.93%
- **函数覆盖率**: 94.59%
- **行覆盖率**: 96.59%

## 覆盖率详情

```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|----------
AdvancedForm.tsx   |   94.94 |    93.93 |   94.59 |   96.59
```

**未覆盖代码行**: 225, 252-255 （边界情况和错误处理）

## 运行测试

### 运行 AdvancedForm 测试

```bash
yarn test src/components/AdvancedForm.test.tsx
```

### 查看测试覆盖率

```bash
yarn test:coverage src/components/AdvancedForm.test.tsx
```

### 监听模式

```bash
yarn test src/components/AdvancedForm.test.tsx --watch
```

## 测试技术栈

- **测试框架**: Vitest
- **测试库**: @testing-library/react
- **用户交互**: @testing-library/user-event
- **DOM 断言**: @testing-library/jest-dom
- **测试环境**: jsdom

## 测试特点

### 1. 高覆盖率
- 94.94% 的代码覆盖率
- 覆盖所有主要功能路径
- 包含边界情况测试

### 2. 全面的字段类型测试
测试了所有 8 种字段类型：
- text, email, password, tel, url, date
- number
- textarea
- select
- checkbox
- radio

### 3. 完整的验证器测试
测试了所有 10 个内置验证器：
- required, email, phone, url
- minLength, maxLength
- min, max
- pattern
- compose

### 4. 用户交互测试
- 使用 @testing-library/user-event 模拟真实用户操作
- 测试键盘导航（Tab）
- 测试鼠标点击
- 测试表单提交流程

## 测试最佳实践

### 1. 使用语义化查询

```tsx
// ✅ 好的做法
screen.getByLabelText('姓名');
screen.getByRole('textbox', { name: /姓名/ });

// ❌ 避免
screen.getByTestId('name-input');
```

### 2. 测试用户行为

```tsx
// ✅ 好的做法：模拟用户操作
await user.type(input, '张三');
await user.click(submitButton);

// ❌ 避免：直接设置状态
component.setState({ value: '张三' });
```

### 3. 异步验证

```tsx
// ✅ 好的做法
await waitFor(() => {
  expect(screen.getByText('错误信息')).toBeInTheDocument();
});
```

## 未来测试计划

### 待添加的测试
- [ ] 表单级别的验证（跨字段验证）
- [ ] 文件上传字段测试
- [ ] 自定义字段渲染器测试
- [ ] 表单重置功能的详细测试
- [ ] 表单脏状态（dirty state）测试
- [ ] 键盘导航的完整测试
- [ ] 无障碍性（A11y）测试

### 集成测试
- [ ] 与 AdvancedTable 的集成测试
- [ ] 表单嵌套测试
- [ ] 多步骤表单测试

### 性能测试
- [ ] 大型表单（100+ 字段）的性能
- [ ] 频繁验证时的性能
- [ ] 内存泄漏检测

## 示例用例

### 测试自定义验证器

```tsx
it('应该支持自定义验证器', async () => {
  const customValidator = (value: string) => {
    return value.includes('admin') ? '用户名不能包含 admin' : undefined;
  };

  const fields: FieldConfig<TestForm>[] = [
    {
      name: 'username',
      label: '用户名',
      type: 'text',
      validate: customValidator,
    },
  ];

  render(<AdvancedForm fields={fields} onSubmit={vi.fn()} />);

  const input = screen.getByLabelText('用户名');
  await user.type(input, 'admin123');

  await waitFor(() => {
    expect(screen.getByText('用户名不能包含 admin')).toBeInTheDocument();
  });
});
```

### 测试表单提交流程

```tsx
it('应该完整测试表单提交流程', async () => {
  const handleSubmit = vi.fn().mockResolvedValue({ success: true });

  render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

  // 填写表单
  await user.type(screen.getByLabelText('姓名'), '张三');
  await user.type(screen.getByLabelText('邮箱'), 'test@example.com');

  // 提交表单
  await user.click(screen.getByText('提交'));

  // 验证
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '张三',
        email: 'test@example.com',
      })
    );
  });
});
```

## 常见问题

### Q: 为什么某些测试使用 getByRole 而不是 getByLabelText？

A: 当 label 包含特殊字符（如必填标记 *）时，使用 getByRole 更可靠。

### Q: 如何测试异步验证？

A: 使用 waitFor 等待异步操作完成：

```tsx
await waitFor(() => {
  expect(screen.getByText('错误信息')).toBeInTheDocument();
});
```

### Q: 如何测试表单重置？

A: 设置 resetOnSubmit={true}，提交后检查字段值是否被清空。

## 贡献指南

### 添加新测试
1. 在 `AdvancedForm.test.tsx` 中添加测试用例
2. 使用描述性的测试名称
3. 遵循 AAA 模式（Arrange, Act, Assert）
4. 保持测试独立且可重复

### 测试命名规范
```tsx
describe('功能模块名称', () => {
  it('应该 [期望的行为]', () => {
    // 测试代码
  });
});
```

## 相关资源

- [TanStack Form 文档](https://tanstack.com/form/latest)
- [Vitest 文档](https://vitest.dev/)
- [React Testing Library 文档](https://testing-library.com/react)
- [表单验证最佳实践](https://ux.stackexchange.com/questions/76746/best-practice-for-inline-form-validation)

