# 🚀 前端設置指南

## 📋 環境變數配置

### 開發環境

已自動創建 `.env.local` 文件（不會被提交到 Git）：
```
VITE_API_URL=http://localhost:3000
```

此配置會自動使用本地後端服務器（http://localhost:3000）

### 生產環境

已自動創建 `.env.production` 文件（會被提交到 Git）：
```
VITE_API_URL=https://tarotvending-backend.zeabur.app
```

此配置會在構建生產版本時自動使用 Zeabur 後端服務器。

**注意**：如果您的 Zeabur 後端 URL 不同，請更新 `.env.production` 文件。

## 🔧 本地開發

1. **確保後端服務器運行**
   ```bash
   cd ../TarotVending-backend
   npm install
   npm start
   ```

2. **啟動前端開發服務器**
   ```bash
   npm install
   npm run dev
   ```

3. **訪問應用**
   - http://localhost:5173

## 📦 構建

```bash
npm run build
```

構建後的文件在 `dist/` 目錄中。

## 🔗 後端 API

後端代碼位於 `../TarotVending-backend/`

後端提供以下 API 端點：
- `GET /api/health` - 健康檢查
- `POST /api/gemini-chat` - Gemini API 代理

