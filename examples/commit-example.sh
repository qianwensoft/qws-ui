#!/bin/bash

# 提交当前更改的示例脚本

echo "========================================"
echo "   QWS-UI 提交更改示例"
echo "========================================"
echo ""

echo "📋 当前更改:"
echo "1. 添加 Popover 组件 (shadcn-ui)"
echo "2. 优化过滤器功能:"
echo "   - 使用 Popover 组件替代自定义弹窗"
echo "   - 添加确认/取消按钮"
echo "   - 延迟过滤执行"
echo "   - 优化按钮样式"
echo "3. 添加 Makefile 和使用文档"
echo ""

echo "🔍 使用 Makefile 的提交方式:"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "方式 1: 快速提交 (推荐用于简单更新)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "make quick-feat MSG=\"优化过滤器交互体验\""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "方式 2: 详细提交 (推荐用于复杂更新)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
make commit MSG="feat: 优化过滤器交互体验并添加 Makefile

- 添加 Popover 组件用于过滤器弹窗
- 添加确认和取消按钮，延迟过滤执行
- 优化按钮样式，提升视觉一致性
- 添加 Makefile 标准化项目管理
- 添加 Makefile 使用文档
"
EOF
echo ""
echo "make push"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "方式 3: 一步完成 (提交 + 推送)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "make commit-push MSG=\"feat: 优化过滤器交互体验并添加项目管理工具\""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 其他常用场景"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "# 查看状态"
echo "make status"
echo ""
echo "# 查看具体变更"
echo "make diff"
echo ""
echo "# 只添加特定文件"
echo "git add src/components/AdvancedTable.tsx"
echo "make commit MSG=\"fix: 修复过滤器弹窗关闭问题\""
echo ""
echo "# 构建 registry 并提交"
echo "make update-registry-commit MSG=\"更新 AdvancedTable 组件\""
echo ""

echo "========================================"
echo "   更多命令请查看: make help"
echo "   详细文档请查看: MAKEFILE_USAGE.md"
echo "========================================"
