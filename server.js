// server.js - 后端 API 服务
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 中间件
// CORS 配置：允許所有來源（包括 GitHub Pages）
// 必須在所有路由之前設置
app.use((req, res, next) => {
  // 設置 CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // 處理 OPTIONS 預檢請求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// 使用 cors 包作為備用
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// ===== API 路由（必须在静态文件服务之前）=====
// 健康檢查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OPTIONS 預檢請求處理（明確處理所有 API 路由的 OPTIONS）
app.options('/api/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Gemini API 代理端点
app.post('/api/gemini-chat', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'Gemini API Key 未設定，請在 Zeabur 環境變數中設定 GEMINI_API_KEY' 
    });
  }

  try {
    const { contents, systemInstruction, generationConfig } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction,
          generationConfig: generationConfig || {
            response_mime_type: 'application/json'
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Gemini API 錯誤:', error);
    res.status(500).json({ 
      error: '伺服器錯誤', 
      message: error.message 
    });
  }
});

// ===== 靜態文件服務（在 API 路由之後）=====
if (process.env.NODE_ENV === 'production') {
  // 提供靜態文件
  app.use(express.static(join(__dirname, 'dist')));
  
  // 所有非 API 路由都返回 index.html（用於 Vue Router）
  app.get('*', (req, res) => {
    // 確保不會攔截 API 路由（雖然理論上不會發生，因為 API 路由在前面）
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
  console.log(`Gemini API Key 已${GEMINI_API_KEY ? '設定' : '未設定'}`);
});

