# 🔐 Zeabur 环境变量设置指南

## 📋 需要在 Zeabur 设置的环境变量

### 必需的环境变量

1. **`GEMINI_API_KEY`** ✅（必需）
   - 值：您的 Gemini API Key
   - 用途：用于调用 Google Gemini API

2. **`NODE_ENV`** ⚠️（推荐）
   - 值：`production`
   - 用途：告诉 Node.js 这是生产环境

## 🚀 在 Zeabur 中设置环境变量

### 步骤 1：登录 Zeabur

1. 前往：https://zeabur.com
2. 登录您的账号

### 步骤 2：进入项目设置

1. 找到您的项目：`tarotvending`（或您的项目名称）
2. 点击项目进入详情页
3. 点击左侧菜单的 **"Environment Variables"**（环境变量）

### 步骤 3：添加环境变量

#### 添加 `GEMINI_API_KEY`

1. 点击 **"Add Variable"** 或 **"添加变量"**
2. **Key（键）**：输入 `GEMINI_API_KEY`
3. **Value（值）**：输入您的 Gemini API Key
   - 可以从这里获取：https://makersuite.google.com/app/apikey
4. 点击 **"Save"** 或 **"保存"**

#### 添加 `NODE_ENV`

1. 再次点击 **"Add Variable"**
2. **Key（键）**：输入 `NODE_ENV`
3. **Value（值）**：输入 `production`
4. 点击 **"Save"** 或 **"保存"**

### 步骤 4：重新部署

设置环境变量后，Zeabur 通常会自动重新部署。如果没有：

1. 点击项目页面顶部的 **"Redeploy"**（重新部署）
2. 等待部署完成（通常 1-3 分钟）

## 📸 界面说明

Zeabur 的环境变量界面通常如下：

```
Environment Variables
┌─────────────────────────────────────┐
│ Key              │ Value            │
├─────────────────────────────────────┤
│ GEMINI_API_KEY   │ your_api_key...  │
│ NODE_ENV         │ production       │
└─────────────────────────────────────┘

[+ Add Variable]
```

## ✅ 验证设置

### 方法 1：检查 Zeabur 日志

1. 在 Zeabur 项目页面，点击 **"Logs"**（日志）
2. 查看服务器启动日志
3. 应该看到：
   ```
   伺服器運行在 http://localhost:XXXX
   Gemini API Key 已設定
   ```

### 方法 2：测试 API

访问：https://tarotvending.zeabur.app/api/health

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

## ⚠️ 重要提示

1. **不要提交 API Key 到 Git**
   - ✅ 只在 Zeabur 环境变量中设置
   - ❌ 不要写在代码中
   - ❌ 不要提交到 GitHub

2. **环境变量名称区分大小写**
   - ✅ `GEMINI_API_KEY`（正确）
   - ❌ `gemini_api_key`（错误）

3. **修改环境变量后需要重新部署**
   - Zeabur 通常会自动重新部署
   - 如果没有，手动点击 "Redeploy"

## 🐛 如果设置后还是有问题

1. **检查环境变量是否正确**
   - 确认键名拼写正确
   - 确认值没有多余的空格

2. **查看 Zeabur 日志**
   - 检查是否有错误信息
   - 确认服务器是否正常启动

3. **重新部署**
   - 点击 "Redeploy"
   - 等待部署完成

4. **清除浏览器缓存**
   - 强制刷新页面（Ctrl+Shift+R）

## 📝 环境变量列表总结

| 变量名 | 值 | 必需 | 说明 |
|--------|-----|------|------|
| `GEMINI_API_KEY` | 您的 API Key | ✅ 是 | Gemini API 密钥 |
| `NODE_ENV` | `production` | ⚠️ 推荐 | 生产环境标识 |

---

**注意**：`NODE_ENV=production` 不是绝对必需的，但推荐设置，因为：
- 启用生产环境优化
- 确保静态文件服务正常工作
- 更好的错误处理

