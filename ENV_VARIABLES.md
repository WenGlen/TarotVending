# 🔐 环境变量说明

## 📌 重要区别：VITE_ 前缀

### `VITE_` 前缀的作用

`VITE_` 前缀是 **Vite 特有的**，用于：
- ✅ **前端代码**（浏览器中运行的代码）
- ✅ 在构建时注入到前端代码中
- ✅ 可以通过 `import.meta.env.VITE_XXX` 访问

### 后端环境变量（不需要 VITE_）

后端代码（Node.js/Express）使用：
- ✅ `process.env.XXX`（不需要前缀）
- ✅ 直接读取系统环境变量
- ✅ 不会暴露到前端代码中

## 🎯 当前项目的环境变量配置

### ✅ 正确的配置（当前）

**在 Zeabur 环境变量中设置：**
```
GEMINI_API_KEY=你的_Gemini_API_Key
NODE_ENV=production
```

**为什么不需要 VITE_？**

1. **API key 只在后端使用**
   - `server.js` 使用：`process.env.GEMINI_API_KEY`
   - 这是后端代码，不需要 `VITE_` 前缀

2. **前端不再需要 API key**
   - `src/api/gemini.js` 直接调用后端 API
   - 前端代码中不包含 API key
   - 更安全！

### ❌ 如果使用 VITE_GEMINI_API_KEY

如果您设置 `VITE_GEMINI_API_KEY`：
- ❌ 后端代码无法读取（`process.env.VITE_GEMINI_API_KEY` 在后端是 `undefined`）
- ❌ 即使能读取，也不应该在前端暴露 API key
- ❌ 违反安全最佳实践

## 📊 对比表

| 环境变量 | 使用位置 | 是否需要 VITE_ | 说明 |
|---------|---------|---------------|------|
| `GEMINI_API_KEY` | 后端 (`server.js`) | ❌ 不需要 | 后端使用，安全 |
| `VITE_GEMINI_API_KEY` | 前端 (`src/`) | ✅ 需要 | **当前项目不使用** |
| `NODE_ENV` | 后端 (`server.js`) | ❌ 不需要 | Node.js 标准变量 |
| `PORT` | 后端 (`server.js`) | ❌ 不需要 | Zeabur 自动设置 |

## 🔍 代码验证

### 后端代码 (`server.js`)
```javascript
// ✅ 正确：直接读取环境变量
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ❌ 错误：后端无法读取 VITE_ 前缀的变量
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY; // undefined
```

### 前端代码 (`src/api/gemini.js`)
```javascript
// ✅ 当前方案：不读取 API key，直接调用后端
const GEMINI_ENDPOINT = '/api/gemini-chat';
// 不需要环境变量！

// ❌ 如果直接在前端使用 API key（不安全）
// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

## ✅ Zeabur 环境变量设置

在 Zeabur 中，设置：

```
变量名: GEMINI_API_KEY
值: 你的_Gemini_API_Key

变量名: NODE_ENV
值: production
```

**不需要设置 `VITE_GEMINI_API_KEY`！**

## 🎯 总结

- ✅ **后端环境变量**：`GEMINI_API_KEY`（不需要 VITE_）
- ✅ **前端代码**：不读取 API key，直接调用后端 API
- ✅ **更安全**：API key 永远不会暴露到浏览器中

当前的配置是正确的！👍

