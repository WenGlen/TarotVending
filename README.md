# 🔮 Tarot Vending Machine

一個互動式的塔羅牌占卜應用，使用 Vue 3 + Vite 構建，並整合 Google Gemini API 提供 AI 占卜解讀。

## ✨ 功能特色

- 🎴 互動式塔羅牌選擇體驗
- 🎨 多種主題和牌組選擇
- 🤖 AI 驅動的占卜解讀（使用 Google Gemini API）
- 📱 響應式設計，適配各種設備
- 🎭 精美的動畫和過場效果

## 🚀 快速開始

### 本地開發

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   創建 `.env` 文件：
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **啟動開發服務器**
   ```bash
   # 終端 1: 啟動後端
   npm run dev:server
   
   # 終端 2: 啟動前端
   npm run dev
   ```

4. **訪問應用**
   - 前端：http://localhost:5173
   - 後端 API：http://localhost:3000/api/health

### 部署到 Zeabur

詳細的部署指南請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📦 專案結構

```
src/
├── api/              # API 客戶端
├── components/       # Vue 組件
├── views/           # 頁面視圖
├── stores/          # Pinia 狀態管理
├── layouts/         # 布局組件
└── data/            # 靜態數據（塔羅牌、主題等）
```

## 🛠️ 技術棧

- **前端**: Vue 3 + Vite
- **狀態管理**: Pinia
- **後端**: Express.js
- **AI API**: Google Gemini API

## 📄 授權

MIT License

