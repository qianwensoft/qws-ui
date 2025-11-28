# 测试配置文档

**更新日期**: 2025-11-28
**版本**: v2.0

---

## 📋 概述

QWS-UI 项目现在支持两种测试方式：
1. **单元测试** (Unit Tests) - 独立的组件测试，使用 `.test.tsx` 文件
2. **Storybook 测试** (Story Tests) - 基于 Storybook 的交互式测试

---

## 🏗️ 配置架构

### 配置文件

| 文件 | 用途 | 说明 |
|------|------|------|
| `vitest.config.ts` | 单元测试配置 | 运行 `src/**/*.test.tsx` 文件 |
| `vite.config.ts` | Storybook 测试配置 | 与 Storybook 集成，测试 stories |
| `.storybook/main.ts` | Storybook 配置 | 包含 `@storybook/addon-vitest` 插件 |
| `.storybook/vitest.setup.ts` | Storybook 测试设置 | Storybook 测试的初始化文件 |
| `src/test/setup.ts` | 单元测试设置 | 单元测试的初始化文件 |

### 测试框架

- **测试运行器**: Vitest 4.0.14
- **React 测试库**: @testing-library/react 16.3.0
- **用户交互**: @testing-library/user-event 14.6.1
- **DOM 断言**: @testing-library/jest-dom 6.9.1
- **测试环境**: jsdom 27.2.0
- **浏览器测试**: Playwright (用于 Storybook)

---

## 🧪 测试命令

### 单元测试命令

```bash
# 运行所有单元测试（默认）
npm test
# 或
npm run test

# 运行单元测试（单次运行）
npm run test:unit

# 运行单元测试（监听模式）
npm run test:unit:watch

# 运行测试并显示 UI
npm run test:ui

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### Storybook 测试命令

```bash
# 运行 Storybook 测试
npm run test:storybook
```

### 命令说明

| 命令 | 配置文件 | 运行内容 | 模式 |
|------|---------|---------|------|
| `npm test` | vitest.config.ts | 单元测试 | 监听 |
| `npm run test:unit` | vitest.config.ts | 单元测试 | 单次 |
| `npm run test:unit:watch` | vitest.config.ts | 单元测试 | 监听 |
| `npm run test:storybook` | vite.config.ts | Storybook 测试 | 单次 |
| `npm run test:ui` | vitest.config.ts | 单元测试 UI | 交互 |
| `npm run test:coverage` | vitest.config.ts | 单元测试 + 覆盖率 | 单次 |

---

## 📊 测试统计

### 当前测试覆盖

**单元测试文件**: 2 个
- `src/components/AdvancedTable.test.tsx` - 42 个测试
- `src/components/AdvancedForm.test.tsx` - 42 个测试

**总测试数**: 84 个测试

**测试分类**:
1. 基础渲染测试 (3 tests)
2. 编辑功能测试 (5 tests)
3. 粘贴功能测试 (3 tests)
4. 过滤功能测试 (4 tests)
5. 导出功能测试 (3 tests)
6. 列管理功能测试 (4 tests)
7. 分页功能测试 (3 tests)
8. 视觉效果测试 (2 tests)
9. 多选功能测试 (2 tests)
10. 数据变更回调测试 (2 tests)
11. 边界情况测试 (4 tests)

### 测试性能

- **平均运行时间**: ~2.5 秒
- **Transform 时间**: ~300ms
- **Setup 时间**: ~350ms
- **Import 时间**: ~750ms
- **Tests 时间**: ~2s
- **Environment 时间**: ~900ms

---

## ⚙️ 配置详解

### vitest.config.ts (单元测试)

```typescript
export default defineConfig({
  test: {
    name: 'unit',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['**/*.stories.tsx', 'node_modules/**', 'dist/**'],
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.stories.tsx',
        '**/*.test.tsx',
        '**/*.config.*',
        '**/dist/',
        '**/*.d.ts',
      ],
    },
  },
});
```

**关键配置**:
- `environment: 'jsdom'` - 模拟浏览器环境
- `globals: true` - 全局可用 describe, it, expect 等
- `setupFiles` - 测试前运行的设置文件

### vite.config.ts (Storybook 测试)

```typescript
export default defineConfig({
  test: {
    projects: [{
      name: 'storybook',
      plugins: [storybookTest({ configDir: '.storybook' })],
      test: {
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: 'chromium' }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});
```

**关键配置**:
- `storybookTest` 插件 - 集成 Storybook
- `browser.enabled` - 使用浏览器运行测试
- `playwright` - 浏览器提供者

### src/test/setup.ts

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

**作用**:
- 扩展 expect 方法，添加 DOM 断言
- 每个测试后自动清理

---

## 📝 编写测试用例

### 基础测试结构

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 用户交互测试

```tsx
import userEvent from '@testing-library/user-event';

it('should handle click', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### 异步测试

```tsx
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

---

## 🎯 覆盖率配置

### 生成覆盖率报告

```bash
npm run test:coverage
```

### 覆盖率报告

生成的报告包含:
- **Text 报告** - 终端输出
- **JSON 报告** - `coverage/coverage-final.json`
- **HTML 报告** - `coverage/index.html`

### 排除项

以下文件被排除在覆盖率统计之外:
- `node_modules/`
- `src/test/`
- `**/*.stories.tsx`
- `**/*.test.tsx`
- `**/*.config.*`
- `**/dist/`
- `**/*.d.ts`

---

## 🔍 调试测试

### 使用 UI 模式

```bash
npm run test:ui
```

打开浏览器界面，可以：
- 查看所有测试
- 单独运行测试
- 查看测试覆盖率
- 调试失败的测试

### 使用 VS Code

在 `.vscode/launch.json` 中添加配置:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```

### 查看详细输出

```bash
npm test -- --reporter=verbose
```

---

## 🚀 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 📚 相关文档

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Storybook Testing](https://storybook.js.org/docs/writing-tests)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

## ✅ 测试检查清单

**编写新功能时**:
- [ ] 为新组件添加单元测试
- [ ] 为新功能添加 Storybook 示例
- [ ] 确保测试覆盖率 > 80%
- [ ] 运行 `npm run test:unit` 确保所有测试通过
- [ ] 运行 `npm run test:coverage` 检查覆盖率

**提交前**:
- [ ] 所有测试通过
- [ ] 没有测试被跳过 (skip)
- [ ] 覆盖率没有下降
- [ ] 修复所有警告

---

## 🔄 最近更新

**2025-11-28**:
- ✅ 分离单元测试和 Storybook 测试配置
- ✅ 添加 `@storybook/addon-vitest` 插件
- ✅ 创建独立的 `vitest.config.ts`
- ✅ 更新 `package.json` 测试命令
- ✅ 还原原有的 84 个测试用例
- ✅ 所有测试通过

---

**配置维护**: Claude Code
**最后测试**: 2025-11-28 09:32
