# 🔮 未来功能扩展指南

## 📋 您提到的功能需求

1. **会员系统**（登录/注册）
2. **储存占卜纪录**

## ✅ 好消息：您已经有后端了！

当前的 `server.js` 已经是一个后端服务器，只是功能很简单。**未来可以轻松扩展**，不需要重新架构！

## 🏗️ 当前架构分析

### 现在的架构
```
server.js (Express 服务器)
├── /api/gemini-chat     ← 现有的 API 端点
└── 静态文件服务          ← 提供前端页面
```

### 未来可以扩展为
```
server.js (Express 服务器)
├── /api/gemini-chat          ← 现有的 API
├── /api/auth/login           ← 新增：登录
├── /api/auth/register        ← 新增：注册
├── /api/auth/logout          ← 新增：登出
├── /api/records              ← 新增：获取占卜纪录
├── /api/records/:id          ← 新增：获取单条纪录
├── /api/records              ← 新增：保存占卜纪录
├── /api/records/:id          ← 新增：删除纪录
└── 静态文件服务
```

## 🎯 未来需要的组件

### 1. 数据库
**选项 A：Zeabur 内置数据库**
- Zeabur 提供 PostgreSQL/MySQL 数据库服务
- 可以直接在 Zeabur 项目中添加数据库
- 免费额度通常足够小型应用使用

**选项 B：外部数据库服务**
- MongoDB Atlas（免费层）
- Supabase（免费层，包含认证功能）
- Firebase（Google 提供，与 Gemini API 同一生态）

### 2. 用户认证
**选项 A：JWT (JSON Web Token)**
- 简单易实现
- 无状态，适合 API
- 可以自己实现

**选项 B：使用第三方服务**
- Supabase Auth（推荐，简单）
- Firebase Auth
- Auth0

### 3. 会话管理
- Express Session（如果使用传统 session）
- JWT（如果使用 token 认证）

## 📝 未来扩展示例

### 示例：添加数据库和用户系统

```javascript
// server.js (未来版本示例)

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg'; // PostgreSQL 客户端
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接（Zeabur 会自动提供连接字符串）
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 中间件：验证 JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未授权' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token 无效' });
    req.user = user;
    next();
  });
};

// 现有的 Gemini API 端点
app.post('/api/gemini-chat', async (req, res) => {
  // ... 现有代码
});

// 新增：用户注册
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hashedPassword]
  );
  
  const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
  res.json({ token, user: result.rows[0] });
});

// 新增：用户登录
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    return res.status(401).json({ error: '用户不存在' });
  }
  
  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) {
    return res.status(401).json({ error: '密码错误' });
  }
  
  const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: result.rows[0].id, email: result.rows[0].email } });
});

// 新增：保存占卜纪录
app.post('/api/records', authenticateToken, async (req, res) => {
  const { cards, theme, question, result } = req.body;
  const userId = req.user.userId;
  
  const result_db = await pool.query(
    'INSERT INTO records (user_id, cards, theme, question, result, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
    [userId, JSON.stringify(cards), theme, question, JSON.stringify(result)]
  );
  
  res.json(result_db.rows[0]);
});

// 新增：获取用户的占卜纪录
app.get('/api/records', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await pool.query(
    'SELECT * FROM records WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  res.json(result.rows);
});

// ... 其他端点
```

## 🎯 推荐的扩展路径

### 阶段 1：当前（已完成）
- ✅ 前端应用
- ✅ Gemini API 集成
- ✅ 基础后端服务器

### 阶段 2：添加数据库（未来）
- 在 Zeabur 添加数据库服务
- 创建用户表和纪录表
- 更新 `server.js` 添加数据库连接

### 阶段 3：添加认证（未来）
- 实现注册/登录 API
- 添加 JWT token 验证
- 前端添加登录页面

### 阶段 4：添加纪录功能（未来）
- 实现保存/读取占卜纪录 API
- 前端添加"我的纪录"页面
- 添加纪录管理功能

## 💡 使用 Supabase 的简化方案（推荐）

如果您想快速实现这些功能，可以考虑使用 **Supabase**：

### 优点
- ✅ 免费层足够使用
- ✅ 内置认证系统（无需自己实现）
- ✅ 内置数据库（PostgreSQL）
- ✅ 自动生成 REST API
- ✅ 实时数据同步
- ✅ 与 Zeabur 集成简单

### 架构
```
前端 (Vue)
  ↓
Zeabur (server.js)
  ├── /api/gemini-chat  ← 现有的 Gemini API
  └── Supabase Client   ← 用户认证和数据库
      ├── Auth (登录/注册)
      └── Database (占卜纪录)
```

## 📊 数据库表结构建议

### users 表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### records 表
```sql
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  cards JSONB NOT NULL,           -- 选中的牌
  theme VARCHAR(100),             -- 主题
  question TEXT,                  -- 问题
  result JSONB NOT NULL,          -- 占卜结果
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 总结

### ✅ 您不需要重新架构！

1. **当前 `server.js` 已经是后端**
   - 可以轻松扩展
   - 添加新 API 端点很简单
   - 不需要重新开始

2. **未来扩展步骤**
   - 添加数据库（Zeabur 或 Supabase）
   - 添加认证 API
   - 添加纪录 API
   - 前端添加相应页面

3. **推荐方案**
   - 继续使用 Express（当前方案）
   - 添加 Supabase 处理认证和数据库
   - 保持 `server.js` 处理 Gemini API

### 🚀 现在不需要改！

当前的架构已经为未来扩展做好了准备。当您需要添加这些功能时：
1. 添加数据库服务
2. 在 `server.js` 中添加新的 API 端点
3. 更新前端添加新功能

**不需要重新架构，只需要扩展！**

