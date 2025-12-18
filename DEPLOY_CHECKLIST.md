# 🚀 部署檢查清單

在部署前，請確認以下項目：

## ✅ 本地準備

- [ ] 已安裝所有依賴：`npm install`
- [ ] 本地測試通過：`npm run dev` 和 `npm run dev:server` 都能正常運行
- [ ] 已測試 API 功能正常

## ✅ GitHub 準備

- [ ] 已初始化 Git：`git init`（如果還沒有）
- [ ] 已添加所有文件：`git add .`
- [ ] 已提交更改：`git commit -m "準備部署"`
- [ ] 已在 GitHub 創建新倉庫
- [ ] 已連接遠程倉庫：`git remote add origin <your-repo-url>`
- [ ] 已推送到 GitHub：`git push -u origin main`

## ✅ Zeabur 配置

- [ ] 已登入 Zeabur（使用 GitHub 帳號）
- [ ] 已從 GitHub 導入專案
- [ ] 已確認構建命令：`npm run build`
- [ ] 已確認啟動命令：`npm start`
- [ ] 已確認輸出目錄：`dist`

## ✅ 環境變數設定

在 Zeabur 環境變數中設定：

- [ ] `GEMINI_API_KEY` = 你的 Gemini API Key
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`（可選，Zeabur 會自動分配）

## ✅ 部署後檢查

- [ ] 部署狀態顯示成功（綠色）
- [ ] 訪問 `/api/health` 返回 `{"status":"ok"}`
- [ ] 前端頁面可以正常載入
- [ ] 塔羅牌功能可以正常使用
- [ ] API 請求成功（檢查瀏覽器控制台）

## 🔍 如果遇到問題

1. **檢查 Zeabur 部署日誌**
   - 查看是否有構建錯誤
   - 確認環境變數是否正確設定

2. **檢查 API 端點**
   - 訪問 `https://your-project.zeabur.app/api/health`
   - 應該返回健康狀態

3. **檢查瀏覽器控制台**
   - 打開開發者工具（F12）
   - 查看 Network 標籤中的 API 請求
   - 確認沒有 CORS 或 404 錯誤

4. **確認 Gemini API Key**
   - 確認 API Key 有效
   - 確認 API Key 有足夠的配額

## 📞 需要幫助？

如果遇到問題，請檢查：
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 詳細部署指南
- Zeabur 官方文檔：https://zeabur.com/docs
- Gemini API 文檔：https://ai.google.dev/docs

