# 🔧 Zeabur 部署问题排查

## 🔴 问题：405 错误和 API 无法访问

### 已修复的问题

1. ✅ **路由顺序问题**
   - 已确保 API 路由在静态文件服务之前
   - `/api/health` 和 `/api/gemini-chat` 现在应该可以正常工作

2. ✅ **删除了 zeabur.json**
   - Zeabur 会自动检测 Node.js 应用
   - 不需要手动配置路由

### 检查清单

在 Zeabur 控制台中检查：

1. **环境变量**
   - ✅ `GEMINI_API_KEY` - 已设置
   - ✅ `NODE_ENV` - 设置为 `production`
   - ✅ `PORT` - Zeabur 会自动设置，不需要手动配置

2. **构建配置**
   - ✅ Build Command: `npm run build`
   - ✅ Start Command: `npm start`
   - ✅ Output Directory: `dist`（可选，Zeabur 会自动检测）

3. **部署日志**
   - 检查 Zeabur 部署日志，确认：
     - ✅ 构建成功
     - ✅ 服务器启动成功
     - ✅ 没有错误信息

### 测试步骤

1. **测试健康检查端点**：
   ```
   https://tarotvending.zeabur.app/api/health
   ```
   应该返回：`{"status":"ok","timestamp":"..."}`

2. **测试前端页面**：
   ```
   https://tarotvending.zeabur.app/
   ```
   应该显示前端页面

3. **测试 API 调用**：
   - 在前端页面执行占卜操作
   - 检查浏览器控制台是否有错误
   - 检查 Network 标签中的 API 请求

### 如果还有问题

1. **检查 Zeabur 日志**：
   - 前往 Zeabur 控制台
   - 查看服务日志
   - 确认服务器是否正常启动

2. **重新部署**：
   - 在 Zeabur 控制台点击 "Redeploy"
   - 等待部署完成

3. **检查端口**：
   - Zeabur 会自动设置 `PORT` 环境变量
   - `server.js` 使用 `process.env.PORT || 3000`
   - 这应该是正确的

4. **清除浏览器缓存**：
   - 强制刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）
   - 或使用无痕模式访问

### 常见问题

**Q: 为什么 `/api/health` 显示空白？**
A: 可能是路由顺序问题，已修复。如果还有问题，检查 Zeabur 日志。

**Q: 为什么 `/api/gemini-chat` 返回 405？**
A: 405 表示方法不允许。已确保路由顺序正确，POST 请求应该可以正常工作。

**Q: 需要等待多久才能看到更改？**
A: Zeabur 通常需要 1-3 分钟来重新部署。检查部署状态。

