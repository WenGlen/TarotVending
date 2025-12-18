# 🚀 前端設置指南

## 📋 環境變數配置

### 開發環境

創建 `.env` 文件：
```
VITE_API_URL=http://localhost:3000
```

### 生產環境

在構建時設定環境變數：
```bash
VITE_API_URL=https://your-backend-server.com npm run build
```

或在部署平台設定環境變數 `VITE_API_URL`

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

