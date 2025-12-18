# 🚀 快速開始指南

## 📍 當前配置狀態

✅ **後端已部署到 Zeabur**：`https://tarotvending-backend.zeabur.app`  
✅ **前端環境變數已配置**：
- 開發環境：使用 Vite proxy（`.env.local`）
- 生產環境：使用 Zeabur 後端（`.env.production`）

## 🏃 本地開發

### 1. 啟動後端（可選）

如果您想在本地測試後端：

```bash
cd ../TarotVending-backend
npm install
npm start
```

後端會在 `http://localhost:3000` 運行

### 2. 啟動前端

```bash
cd TarotVending
npm install  # 如果還沒安裝依賴
npm run dev
```

前端會在 `http://localhost:5173` 運行

### 3. 測試

- 打開瀏覽器訪問：http://localhost:5173
- 前端會自動通過 Vite proxy 連接到本地後端（如果運行中）
- 或者直接使用 Zeabur 後端（如果本地後端未運行）

## 📦 構建生產版本

```bash
npm run build
```

構建時會自動使用 `.env.production` 中的 Zeabur 後端 URL。

構建後的文件在 `dist/` 目錄中，可以部署到：
- GitHub Pages
- 其他靜態網站託管服務

## 🔧 環境變數說明

### `.env.local`（開發環境）
- **不會被提交到 Git**
- 預設：不設定 `VITE_API_URL`，使用 Vite proxy
- 如需直接連接後端，可取消註釋並設定 `VITE_API_URL=http://localhost:3000`

### `.env.production`（生產環境）
- **會被提交到 Git**
- 已設定：`VITE_API_URL=https://tarotvending-backend.zeabur.app`
- 用於生產構建時自動連接 Zeabur 後端

## 📝 注意事項

1. **開發環境**：建議使用 Vite proxy（預設配置），避免 CORS 問題
2. **生產環境**：構建時會自動使用 Zeabur 後端 URL
3. **後端 URL 變更**：如果 Zeabur 後端 URL 改變，請更新 `.env.production` 文件

