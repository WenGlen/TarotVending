# 🔧 GitHub Pages 白屏问题修复

## 🔴 问题原因

GitHub Pages 显示全白的原因是：**资源路径错误**

### 问题分析

1. **GitHub Pages URL 格式**
   - 如果仓库名是 `TarotVending`
   - URL 会是：`https://username.github.io/TarotVending/`
   - 注意：URL 末尾有 `/TarotVending/` 子路径

2. **构建后的资源路径**
   - `dist/index.html` 中的资源路径是：`/assets/index-xxx.js`
   - 这是**绝对路径**，会指向：`https://username.github.io/assets/...`
   - ❌ **错误！** 应该是：`https://username.github.io/TarotVending/assets/...`

3. **结果**
   - 浏览器找不到 JS/CSS 文件
   - 页面无法加载 → 显示全白

## ✅ 解决方案

### 方案 1：为 GitHub Pages 设置 base path（临时预览用）

如果您想在 GitHub Pages 上预览前端效果：

1. **修改 `vite.config.js`**，添加 base path：

```javascript
export default defineConfig({
  base: '/TarotVending/',  // 改为您的仓库名
  // ... 其他配置
})
```

2. **重新构建**：
```bash
npm run build
```

3. **提交并推送**：
```bash
git add .
git commit -m "Fix GitHub Pages base path"
git push
```

4. **在 GitHub 设置 GitHub Pages**：
   - 前往仓库 Settings → Pages
   - Source: 选择 `main` 分支
   - Folder: 选择 `/ (root)` 或 `/dist`
   - 保存

### 方案 2：使用相对路径（推荐用于 GitHub Pages）

修改 `vite.config.js`：

```javascript
export default defineConfig({
  base: './',  // 使用相对路径
  // ... 其他配置
})
```

这样资源路径会是 `./assets/...`，可以在任何路径下工作。

### 方案 3：使用 Zeabur（推荐，生产环境）

**Zeabur 不需要 base path**，因为：
- Zeabur 部署在根路径（`https://your-app.zeabur.app/`）
- 不需要子路径
- 当前配置已经正确

## 🎯 推荐做法

### 对于 GitHub Pages（仅预览）

如果您想先在 GitHub Pages 上看看前端效果：

1. **临时修改 `vite.config.js`**：
```javascript
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',  // 默认相对路径
  // ... 其他配置
})
```

2. **构建**：
```bash
npm run build
```

3. **部署到 GitHub Pages**

### 对于 Zeabur（生产环境）

**不需要修改任何配置！** 当前配置已经正确：
- `base: '/'` 或 `base: './'` 都可以
- Zeabur 会正确处理

## 📝 当前状态

我已经更新了 `vite.config.js`，添加了：
```javascript
base: process.env.VITE_BASE_PATH || '/',
```

这样：
- ✅ **Zeabur 部署**：不需要设置环境变量，使用 `/`（根路径）
- ✅ **GitHub Pages**：可以设置 `VITE_BASE_PATH='./'` 使用相对路径

## 🚀 下一步

1. **如果想在 GitHub Pages 预览**：
   - 修改 `vite.config.js` 的 `base` 为 `'./'`
   - 重新构建并推送

2. **如果要正式部署**：
   - 使用 Zeabur（推荐）
   - 当前配置已经正确，不需要修改

## 💡 总结

- ✅ **问题**：GitHub Pages 子路径导致资源路径错误
- ✅ **解决**：设置正确的 base path 或使用相对路径
- ✅ **推荐**：使用 Zeabur 部署，不需要处理路径问题

