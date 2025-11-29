# Git 双平台配置指南

本文档说明如何配置项目同时推送到 Gitee 和 GitHub 双平台。

## 🌍 双平台仓库

- **Gitee**: https://gitee.com/qianwensoft/qws-ui
- **GitHub**: https://github.com/qianwensoft/qws-ui

## 📋 当前配置

项目已配置为自动推送到两个平台：

```bash
# 查看远程仓库配置
git remote -v
```

输出：
```
github  git@github.com:qianwensoft/qws-ui.git (fetch)
github  git@github.com:qianwensoft/qws-ui.git (push)
origin  git@gitee.com:qianwensoft/qws-ui.git (fetch)
origin  git@gitee.com:qianwensoft/qws-ui.git (push)
origin  git@github.com:qianwensoft/qws-ui.git (push)
```

**说明**：
- `origin` 的 fetch 指向 Gitee（主要源）
- `origin` 的 push 同时推送到 Gitee 和 GitHub
- `github` 单独配置，可单独推送到 GitHub

## 🔧 配置步骤

如果你需要在新环境中配置双平台推送，按以下步骤操作：

### 1. 克隆仓库

```bash
# 从 Gitee 克隆（国内速度快）
git clone git@gitee.com:qianwensoft/qws-ui.git

# 或从 GitHub 克隆
git clone git@github.com:qianwensoft/qws-ui.git
```

### 2. 添加 GitHub 远程仓库

```bash
# 添加 GitHub 作为独立 remote
git remote add github git@github.com:qianwensoft/qws-ui.git
```

### 3. 配置 origin 双推送

```bash
# 为 origin 添加 Gitee push URL
git remote set-url --add --push origin git@gitee.com:qianwensoft/qws-ui.git

# 为 origin 添加 GitHub push URL
git remote set-url --add --push origin git@github.com:qianwensoft/qws-ui.git
```

### 4. 验证配置

```bash
git remote -v
```

应该看到 origin 有两个 push URL。

## 🚀 使用方法

### 日常推送（双平台）

```bash
# 推送到 main 分支（同时推送到 Gitee 和 GitHub）
git push origin main

# 推送所有分支
git push origin --all

# 推送标签
git push origin --tags
```

### 单独推送到某个平台

```bash
# 只推送到 Gitee
git push git@gitee.com:qianwensoft/qws-ui.git main

# 只推送到 GitHub
git push github main
```

### 拉取更新

```bash
# 从 Gitee 拉取（默认）
git pull origin main

# 从 GitHub 拉取
git pull github main
```

## 📦 部署脚本支持

项目的部署脚本 `deploy-gitee.sh` 和 `deploy-storybook.sh` 会自动使用配置的远程仓库：

```bash
# 部署组件注册表（自动推送到双平台）
npm run deploy:registry

# 部署 Storybook（自动推送到双平台）
npm run deploy:storybook
```

## 🔐 SSH 密钥配置

确保你的 SSH 密钥已添加到两个平台：

### Gitee

1. 访问 https://gitee.com/profile/sshkeys
2. 添加 SSH 公钥

### GitHub

1. 访问 https://github.com/settings/keys
2. 添加 SSH 公钥

### 测试连接

```bash
# 测试 Gitee 连接
ssh -T git@gitee.com

# 测试 GitHub 连接
ssh -T git@github.com
```

## 🌿 分支管理

所有分支都会同步到两个平台：

| 分支 | 用途 | 同步 |
|------|------|------|
| main | 主开发分支 | ✅ 双平台 |
| prd | 生产发布分支 | ✅ 双平台 |
| storybook-pages | 文档分支 | ✅ 双平台 |

## 📝 常见问题

### Q1: 如何只推送到一个平台？

**A**: 使用特定的远程名称：

```bash
# 只推送到 GitHub
git push github main

# 只推送到 Gitee（使用完整 URL）
git push git@gitee.com:qianwensoft/qws-ui.git main
```

### Q2: 推送失败怎么办？

**A**: 检查以下几点：

1. **SSH 密钥**：确保密钥已添加到两个平台
2. **网络连接**：测试 `ssh -T git@gitee.com` 和 `ssh -T git@github.com`
3. **权限**：确保有仓库的写入权限
4. **分支保护**：检查是否有分支保护规则

### Q3: 如何移除某个平台？

**A**: 移除 push URL：

```bash
# 查看当前配置
git remote -v

# 移除 GitHub push URL
git remote set-url --delete --push origin git@github.com:qianwensoft/qws-ui.git

# 或完全删除 github remote
git remote remove github
```

### Q4: 如何重新配置？

**A**: 重置并重新配置：

```bash
# 移除所有 push URL
git remote set-url --delete --push origin git@gitee.com:qianwensoft/qws-ui.git
git remote set-url --delete --push origin git@github.com:qianwensoft/qws-ui.git

# 重新添加（按照上面的配置步骤）
git remote set-url --add --push origin git@gitee.com:qianwensoft/qws-ui.git
git remote set-url --add --push origin git@github.com:qianwensoft/qws-ui.git
```

## 🔄 同步策略

### 主仓库选择

- **Gitee** 作为主要开发仓库（国内访问快）
- **GitHub** 作为镜像仓库（国际用户访问）

### 自动同步

每次执行 `git push origin` 都会自动同步到两个平台，无需额外操作。

### 手动同步

如果某个平台落后，可以手动同步：

```bash
# 获取所有远程更新
git fetch --all

# 强制推送到某个平台
git push github main --force  # 谨慎使用 --force
```

## 📚 相关文档

- [DEPLOY.md](./DEPLOY.md) - 部署指南
- [README.md](./README.md) - 项目说明
- [CLAUDE.md](./CLAUDE.md) - 开发指南

## 🤝 贡献

如果你有其他平台的镜像需求（如 GitLab、Gitea 等），可以按照相同方式添加。
