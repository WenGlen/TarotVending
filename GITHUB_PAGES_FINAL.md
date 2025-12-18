# 🚀 GitHub Pages 部署最终指南

## ✅ 使用 GitHub Actions（推荐）

我已经创建了 GitHub Actions 工作流，它会自动：
- 构建项目
- 部署 `dist` 目录
- **不需要手动选择文件夹**

### 步骤 1：提交并推送代码

```bash
cd /Users/simpleinfo/Documents/Project/Github/TarotVending-All/TarotVending
git add .
git commit -m "Add GitHub Actions workflow for Pages"
git push
```

### 步骤 2：在 GitHub 启用 GitHub Actions

1. **前往设置页面**：
   ```
   https://github.com/WenGlen/TarotVending/settings/pages
   ```

2. **选择 Source**：
   - 找到 "Source" 下拉菜单
   - **选择 `GitHub Actions`**（不是 `Deploy from a branch`）
   - 如果没有看到这个选项，先推送代码，然后刷新页面

3. **保存**

### 步骤 3：等待部署

1. **查看 Actions**：
   ```
   https://github.com/WenGlen/TarotVending/actions
   ```

2. **等待工作流完成**（通常 1-2 分钟）

3. **访问网站**：
   ```
   https://wenglen.github.io/TarotVending/
   ```

---

## 🔄 替代方案：使用 `/docs` 目录

如果您想使用手动部署（不推荐，需要手动更新）：

### 步骤 1：创建部署脚本

创建一个脚本将 `dist` 内容复制到 `docs`：

```bash
# 在 package.json 中添加脚本
"scripts": {
  "build:pages": "npm run build && cp -r dist/* docs/"
}
```

### 步骤 2：创建 docs 目录并复制文件

```bash
mkdir -p docs
npm run build
cp -r dist/* docs/
```

### 步骤 3：提交 docs 目录

```bash
git add docs/
git commit -m "Add docs directory for GitHub Pages"
git push
```

### 步骤 4：在 GitHub 设置

1. 前往：https://github.com/WenGlen/TarotVending/settings/pages
2. Source: `Deploy from a branch`
3. Branch: `main`
4. Folder: `/docs`
5. 保存

**缺点**：每次更新都需要手动复制文件并提交。

---

## 🎯 推荐：使用 GitHub Actions

**优点**：
- ✅ 自动构建和部署
- ✅ 不需要提交 `dist` 或 `docs` 目录
- ✅ 每次推送代码自动更新
- ✅ 更专业的工作流

**步骤**：
1. 提交代码（包含 `.github/workflows/deploy-pages.yml`）
2. 在 GitHub Pages 设置中选择 `GitHub Actions`
3. 完成！

---

## 📝 当前文件状态

✅ 已创建：
- `.github/workflows/deploy-pages.yml` - GitHub Actions 工作流
- `vite.config.js` - 已配置相对路径
- `index.html` - 已修复 favicon 路径

✅ 已准备好部署！

