# 🔧 GitHub Pages 部署完整指南

## 🔴 当前问题

错误信息显示：
1. `GET https://wenglen.github.io/src/main.js` - GitHub Pages 在使用根目录的开发版本
2. `GET https://wenglen.github.io/TarotVending/dist/TarotVending-favicon.png` - favicon 路径错误

**原因**：GitHub Pages 配置为使用根目录，而不是 `/dist` 目录。

## ✅ 解决方案

### 方案 1：使用 GitHub Actions 自动部署（推荐）

我已经创建了 `.github/workflows/deploy-pages.yml`，这会：
- ✅ 自动构建项目
- ✅ 自动部署 `dist` 目录到 GitHub Pages
- ✅ 每次推送代码时自动更新

**步骤**：

1. **提交并推送工作流文件**：
```bash
git add .github/workflows/deploy-pages.yml
git add vite.config.js index.html
git commit -m "Add GitHub Pages deployment workflow"
git push
```

2. **在 GitHub 启用 Pages**：
   - 前往：https://github.com/WenGlen/TarotVending/settings/pages
   - **Source**: 选择 `GitHub Actions`（不是 `Deploy from a branch`）
   - 保存

3. **等待部署完成**：
   - 前往：https://github.com/WenGlen/TarotVending/actions
   - 查看工作流运行状态
   - 完成后访问：https://wenglen.github.io/TarotVending/

### 方案 2：手动配置（简单但需要手动更新）

1. **在 GitHub 设置 Pages**：
   - 前往：https://github.com/WenGlen/TarotVending/settings/pages
   - **Source**: 选择 `Deploy from a branch`
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/dist`
   - 保存

2. **确保 dist 目录已提交**：
```bash
# 临时移除 dist 从 .gitignore（仅用于 GitHub Pages）
# 或者创建一个单独的 gh-pages 分支
```

**注意**：方案 2 需要将 `dist` 目录提交到 Git，这通常不推荐。

## 🎯 推荐：使用 GitHub Actions

**优点**：
- ✅ 不需要提交 `dist` 目录
- ✅ 自动构建和部署
- ✅ 每次推送代码自动更新
- ✅ 更专业的工作流

## 📝 当前状态

我已经：
1. ✅ 创建了 GitHub Actions 工作流文件
2. ✅ 修复了 `vite.config.js`（使用相对路径）
3. ✅ 修复了 `index.html`（favicon 路径）

## 🚀 下一步

1. **提交更改**：
```bash
git add .
git commit -m "Fix GitHub Pages deployment"
git push
```

2. **在 GitHub 启用 Pages**：
   - Settings → Pages
   - Source: `GitHub Actions`
   - 保存

3. **等待部署完成**（通常 1-2 分钟）

4. **访问网站**：
   ```
   https://wenglen.github.io/TarotVending/
   ```

## ⚠️ 重要提醒

- **前端页面**：应该可以正常显示
- **API 功能**：不会工作（GitHub Pages 没有后端）
- **正式部署**：请使用 Zeabur（API 才能正常工作）

## 🐛 如果还有问题

1. **检查 GitHub Actions**：
   - 前往：https://github.com/WenGlen/TarotVending/actions
   - 查看是否有错误

2. **检查浏览器控制台**：
   - 打开开发者工具（F12）
   - 查看 Console 和 Network 标签

3. **清除浏览器缓存**：
   - Ctrl+Shift+R（Windows/Linux）
   - Cmd+Shift+R（Mac）

