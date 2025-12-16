.PHONY: help install dev build test storybook clean
.PHONY: registry add-component update-component
.PHONY: commit push release
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[1;34m
GREEN := \033[1;32m
YELLOW := \033[1;33m
RED := \033[1;31m
NC := \033[0m # No Color

##@ 开发环境

help: ## 显示帮助信息
	@echo "$(BLUE)QWS-UI 项目管理脚本$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "使用方法:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

install: ## 安装项目依赖
	@echo "$(BLUE)正在安装依赖...$(NC)"
	npm install
	@echo "$(GREEN)✓ 依赖安装完成$(NC)"

clean: ## 清理构建缓存
	@echo "$(YELLOW)正在清理缓存...$(NC)"
	rm -rf node_modules/.cache node_modules/.vite dist storybook-static
	@echo "$(GREEN)✓ 缓存清理完成$(NC)"

dev: ## 启动开发服务器
	@echo "$(BLUE)启动开发服务器...$(NC)"
	npm run dev

build: ## 构建生产版本
	@echo "$(BLUE)构建生产版本...$(NC)"
	npm run build
	@echo "$(GREEN)✓ 构建完成$(NC)"

test: ## 运行测试
	@echo "$(BLUE)运行测试...$(NC)"
	npm test

storybook: ## 启动 Storybook
	@echo "$(BLUE)启动 Storybook...$(NC)"
	npm run storybook

##@ shadcn-ui 组件管理

add-component: ## 添加 shadcn-ui 组件 (用法: make add-component COMPONENT=button)
	@if [ -z "$(COMPONENT)" ]; then \
		echo "$(RED)错误: 请指定组件名称$(NC)"; \
		echo "用法: make add-component COMPONENT=button"; \
		exit 1; \
	fi
	@echo "$(BLUE)添加组件: $(COMPONENT)$(NC)"
	npx shadcn@latest add $(COMPONENT)
	@echo "$(GREEN)✓ 组件添加完成$(NC)"

update-component: ## 更新 shadcn-ui 组件 (用法: make update-component COMPONENT=button)
	@if [ -z "$(COMPONENT)" ]; then \
		echo "$(RED)错误: 请指定组件名称$(NC)"; \
		echo "用法: make update-component COMPONENT=button"; \
		exit 1; \
	fi
	@echo "$(BLUE)更新组件: $(COMPONENT)$(NC)"
	npx shadcn@latest add $(COMPONENT) --overwrite
	@echo "$(GREEN)✓ 组件更新完成$(NC)"

list-components: ## 列出项目中的 shadcn-ui 组件
	@echo "$(BLUE)shadcn-ui 组件列表:$(NC)"
	@ls -1 src/components/ui/*.tsx 2>/dev/null | sed 's/.*\///' | sed 's/\.tsx//' || echo "无组件"

##@ Registry 管理

registry: ## 构建组件 registry
	@echo "$(BLUE)构建组件 registry...$(NC)"
	npm run build:registry
	@echo "$(GREEN)✓ Registry 构建完成$(NC)"

registry-clean: ## 清理 registry 构建产物
	@echo "$(YELLOW)清理 registry...$(NC)"
	rm -rf public/r registry/default
	@echo "$(GREEN)✓ Registry 清理完成$(NC)"

registry-rebuild: registry-clean registry ## 重新构建 registry

##@ Git 提交管理

status: ## 显示 git 状态
	@git status

diff: ## 显示文件变更
	@git diff

commit: ## 提交更改 (用法: make commit MSG="feat: 添加新功能")
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)错误: 请提供提交信息$(NC)"; \
		echo "用法: make commit MSG=\"feat: 添加新功能\""; \
		echo ""; \
		echo "$(YELLOW)提交格式规范:$(NC)"; \
		echo "  feat: 新功能"; \
		echo "  fix: 修复问题"; \
		echo "  docs: 文档更新"; \
		echo "  style: 代码格式调整"; \
		echo "  refactor: 代码重构"; \
		echo "  test: 测试相关"; \
		echo "  chore: 构建/工具变动"; \
		exit 1; \
	fi
	@echo "$(BLUE)提交更改...$(NC)"
	@git add .
	@git status
	@echo ""
	@echo "$(YELLOW)确认提交信息: $(MSG)$(NC)"
	@read -p "继续提交? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@git commit -m "$(MSG)" -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" -m "Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
	@echo "$(GREEN)✓ 提交完成$(NC)"

push: ## 推送到远程仓库
	@echo "$(BLUE)推送到远程仓库...$(NC)"
	@git push
	@echo "$(GREEN)✓ 推送完成$(NC)"

commit-push: commit push ## 提交并推送 (用法: make commit-push MSG="feat: 添加新功能")

##@ 组件更新工作流

update-registry-commit: ## 更新组件并提交到 registry (用法: make update-registry-commit MSG="更新 AdvancedTable")
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)错误: 请提供更新说明$(NC)"; \
		echo "用法: make update-registry-commit MSG=\"更新 AdvancedTable 组件\""; \
		exit 1; \
	fi
	@echo "$(BLUE)=== 组件更新工作流 ===$(NC)"
	@echo ""
	@echo "$(YELLOW)1. 构建 registry...$(NC)"
	@$(MAKE) registry
	@echo ""
	@echo "$(YELLOW)2. 查看变更...$(NC)"
	@git status
	@echo ""
	@echo "$(YELLOW)3. 提交更改...$(NC)"
	@$(MAKE) commit MSG="build: $(MSG)"
	@echo ""
	@echo "$(GREEN)✓ 组件更新工作流完成$(NC)"

add-shadcn-commit: ## 添加 shadcn-ui 组件并提交 (用法: make add-shadcn-commit COMPONENT=button)
	@if [ -z "$(COMPONENT)" ]; then \
		echo "$(RED)错误: 请指定组件名称$(NC)"; \
		echo "用法: make add-shadcn-commit COMPONENT=button"; \
		exit 1; \
	fi
	@echo "$(BLUE)=== 添加 shadcn-ui 组件工作流 ===$(NC)"
	@echo ""
	@echo "$(YELLOW)1. 添加组件: $(COMPONENT)$(NC)"
	@$(MAKE) add-component COMPONENT=$(COMPONENT)
	@echo ""
	@echo "$(YELLOW)2. 查看变更...$(NC)"
	@git status
	@echo ""
	@echo "$(YELLOW)3. 提交更改...$(NC)"
	@$(MAKE) commit MSG="feat: 添加 $(COMPONENT) 组件"
	@echo ""
	@echo "$(GREEN)✓ 组件添加工作流完成$(NC)"

##@ 发布管理

bump-patch: ## 升级补丁版本 (1.0.0 -> 1.0.1)
	@echo "$(BLUE)升级补丁版本...$(NC)"
	npm version patch
	@echo "$(GREEN)✓ 版本升级完成$(NC)"

bump-minor: ## 升级次版本 (1.0.0 -> 1.1.0)
	@echo "$(BLUE)升级次版本...$(NC)"
	npm version minor
	@echo "$(GREEN)✓ 版本升级完成$(NC)"

bump-major: ## 升级主版本 (1.0.0 -> 2.0.0)
	@echo "$(BLUE)升级主版本...$(NC)"
	npm version major
	@echo "$(GREEN)✓ 版本升级完成$(NC)"

release: ## 发布新版本 (构建 + registry + 提交 + 推送)
	@echo "$(BLUE)=== 发布新版本 ===$(NC)"
	@echo ""
	@echo "$(YELLOW)1. 运行测试...$(NC)"
	@npm test || (echo "$(RED)✗ 测试失败，终止发布$(NC)" && exit 1)
	@echo ""
	@echo "$(YELLOW)2. 构建生产版本...$(NC)"
	@$(MAKE) build
	@echo ""
	@echo "$(YELLOW)3. 构建 registry...$(NC)"
	@$(MAKE) registry
	@echo ""
	@echo "$(YELLOW)4. 查看变更...$(NC)"
	@git status
	@echo ""
	@read -p "确认发布? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo ""
	@echo "$(YELLOW)5. 提交更改...$(NC)"
	@$(MAKE) commit MSG="chore: 发布新版本"
	@echo ""
	@echo "$(YELLOW)6. 推送到远程...$(NC)"
	@$(MAKE) push
	@echo ""
	@echo "$(GREEN)✓ 发布完成$(NC)"

##@ 快捷命令

quick-fix: ## 快速修复并提交 (用法: make quick-fix MSG="修复表格过滤器问题")
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)错误: 请提供修复说明$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) commit-push MSG="fix: $(MSG)"

quick-feat: ## 快速添加功能并提交 (用法: make quick-feat MSG="添加过滤器确认按钮")
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)错误: 请提供功能说明$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) commit-push MSG="feat: $(MSG)"

##@ 实用工具

check: ## 检查代码质量
	@echo "$(BLUE)检查代码质量...$(NC)"
	@npm run lint 2>/dev/null || echo "$(YELLOW)提示: 未配置 lint$(NC)"

format: ## 格式化代码
	@echo "$(BLUE)格式化代码...$(NC)"
	@npm run format 2>/dev/null || echo "$(YELLOW)提示: 未配置 format$(NC)"

info: ## 显示项目信息
	@echo "$(BLUE)=== 项目信息 ===$(NC)"
	@echo "名称: $$(cat package.json | grep '"name"' | head -1 | sed 's/.*: "\(.*\)".*/\1/')"
	@echo "版本: $$(cat package.json | grep '"version"' | head -1 | sed 's/.*: "\(.*\)".*/\1/')"
	@echo "Node: $$(node --version)"
	@echo "npm: $$(npm --version)"
	@echo ""
	@echo "$(BLUE)Git 状态:$(NC)"
	@git branch --show-current
	@git log -1 --oneline

deps-update: ## 更新依赖包
	@echo "$(BLUE)检查依赖更新...$(NC)"
	npm outdated
	@echo ""
	@read -p "是否更新所有依赖? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 0
	npm update
	@echo "$(GREEN)✓ 依赖更新完成$(NC)"
