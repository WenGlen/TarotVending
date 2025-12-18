# 🔮 Tarot Vending Machine

一個互動式的塔羅牌占卜應用，使用 Vue 3 + Vite 構建。

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

2. **設定 API 端點**
   創建 `.env` 文件：
   ```
   VITE_API_URL=http://localhost:3000
   ```
   
   或者使用後端服務器的 URL（如果後端已部署）

3. **啟動開發服務器**
   ```bash
   npm run dev
   ```

4. **訪問應用**
   - 前端：http://localhost:5173
   - 確保後端 API 服務器正在運行（參考 `../TarotVending-backend/README.md`）

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
- **後端**: 請參考 `../TarotVending-backend/`

## ⚙️ 環境變數

- `VITE_API_URL` - 後端 API 服務器 URL（必需）
  - 開發環境：`http://localhost:3000`
  - 生產環境：您的後端服務器 URL

## 📄 授權

MIT License

