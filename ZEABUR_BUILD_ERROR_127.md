# 🔧 Zeabur 构建错误 127 完整解决方案

## 🔴 错误：`exit code: 127`

这个错误表示命令找不到。可能的原因：

1. **Node.js 版本不匹配**
2. **npm 没有正确安装**
3. **构建命令配置错误**

## ✅ 已完成的修复

1. ✅ 创建了 `.nvmrc` 文件（Node.js 20）
2. ✅ 更新了 `package.json` 的 `engines` 字段
3. ✅ 创建了 `zeabur.yaml` 配置文件

## 🔍 在 Zeabur 控制台检查

### 步骤 1：检查项目设置

1. **登录 Zeabur**
   - 前往：https://zeabur.com
   - 进入您的项目

2. **检查 Build Settings**
   - 找到 "Build Settings" 或 "Settings"
   - 确认以下设置：

   **Build Command**：
   ```
   npm install && npm run build
   ```
   或
   ```
   npm ci && npm run build
   ```

   **Start Command**：
   ```
   npm start
   ```

   **Output Directory**：
   ```
   dist
   ```

### 步骤 2：检查 Node.js 版本

1. **在 Zeabur 项目设置中**
2. **找到 "Environment" 或 "Build Environment"**
3. **确认 Node.js 版本是 20.x**
   - 如果没有，手动设置为 `20`
   - 或者确保 `.nvmrc` 文件被正确读取

### 步骤 3：手动指定构建命令

如果自动检测失败，在 Zeabur 控制台手动设置：

**Build Command**：
```bash
npm install && npm run build
```

**Start Command**：
```bash
npm start
```

## 🐛 如果还是失败

### 方法 1：检查构建日志

1. 在 Zeabur 控制台查看完整的构建日志
2. 查找具体的错误信息
3. 确认：
   - Node.js 版本是否正确
   - npm 是否安装成功
   - 依赖是否安装成功

### 方法 2：简化构建命令

尝试使用最简单的构建命令：

**Build Command**：
```bash
npm run build
```

（假设 Zeabur 会自动运行 `npm install`）

### 方法 3：检查 package.json

确认 `package.json` 中的脚本正确：

```json
{
  "scripts": {
    "build": "vite build",
    "start": "node server.js"
  }
}
```

### 方法 4：使用 Dockerfile（最后手段）

如果 Zeabur 配置还是有问题，可以创建 `Dockerfile`：

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 📝 当前配置总结

### 文件配置

1. **`.nvmrc`**：`20`
2. **`package.json`**：
   ```json
   "engines": {
     "node": ">=20.19.0",
     "npm": ">=10.0.0"
   }
   ```
3. **`zeabur.yaml`**：
   ```yaml
   build:
     command: npm install && npm run build
     outputDirectory: dist
   ```

### Zeabur 设置检查清单

- [ ] Node.js 版本设置为 20
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Output Directory: `dist`
- [ ] 环境变量已设置：
  - [ ] `GEMINI_API_KEY`
  - [ ] `NODE_ENV=production`

## 🚀 下一步

1. **在 Zeabur 控制台检查设置**
2. **手动设置 Build Command**（如果自动检测失败）
3. **重新部署**
4. **查看构建日志**，确认问题

## 💡 建议

如果问题持续，可以：
1. 联系 Zeabur 支持
2. 查看 Zeabur 官方文档
3. 尝试使用 Dockerfile 部署

