# 📚 GitHub 上传完整指南

## 🎯 步骤概览

1. ✅ 初始化 Git 仓库
2. ✅ 添加所有文件
3. ✅ 创建初始提交
4. ✅ 在 GitHub 创建新仓库
5. ✅ 连接远程仓库
6. ✅ 推送到 GitHub

---

## 📝 详细步骤

### 步骤 1: 初始化 Git 仓库

在终端中执行：

```bash
cd /Users/simpleinfo/Documents/Project/Github/TarotVending-All/TarotVending
git init
```

这会创建一个新的 Git 仓库。

### 步骤 2: 检查要提交的文件

```bash
git status
```

您应该看到所有未跟踪的文件（红色）。

### 步骤 3: 添加所有文件到暂存区

```bash
git add .
```

这会添加所有文件（除了 `.gitignore` 中列出的文件）。

### 步骤 4: 创建初始提交

```bash
git commit -m "Initial commit: Tarot Vending Machine with Zeabur deployment setup"
```

### 步骤 5: 在 GitHub 创建新仓库

1. **打开浏览器，访问 GitHub**
   - 前往：https://github.com/new
   - 或点击右上角 ➕ → "New repository"

2. **填写仓库信息**
   - **Repository name**: `tarot-vending-machine`（或您喜欢的名字）
   - **Description**: `🔮 塔羅牌占卜販賣機 - 互動式塔羅牌占卜應用`
   - **Visibility**: 
     - ✅ Public（公开，推荐）
     - ⚪ Private（私有）
   - **⚠️ 重要：不要勾选以下选项**
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   
   （因为我们已经有了这些文件）

3. **点击 "Create repository"**

4. **复制仓库 URL**
   - 创建后会显示仓库页面
   - 复制 HTTPS URL，例如：
     ```
     https://github.com/YOUR_USERNAME/tarot-vending-machine.git
     ```

### 步骤 6: 连接远程仓库

将 `YOUR_USERNAME` 和 `tarot-vending-machine` 替换为您实际的值：

```bash
git remote add origin https://github.com/YOUR_USERNAME/tarot-vending-machine.git
```

### 步骤 7: 重命名主分支（如果需要）

```bash
git branch -M main
```

### 步骤 8: 推送到 GitHub

```bash
git push -u origin main
```

**如果这是第一次推送，GitHub 可能会要求您登录：**
- 输入您的 GitHub 用户名
- 输入您的 GitHub 密码（或 Personal Access Token）

### 步骤 9: 验证上传成功

1. 刷新 GitHub 仓库页面
2. 您应该能看到所有文件都已上传
3. 检查文件列表，确认包含：
   - ✅ `server.js`
   - ✅ `package.json`
   - ✅ `src/` 文件夹
   - ✅ `README.md`
   - ✅ `DEPLOYMENT.md`
   - ✅ 等等...

---

## 🔐 GitHub 认证说明

### 如果遇到认证问题

GitHub 不再支持密码认证，您需要：

**选项 A：使用 Personal Access Token（推荐）**

1. 前往：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - **Note**: `Tarot Vending Machine`
   - **Expiration**: 选择期限（或 No expiration）
   - **Scopes**: 勾选 `repo`（完整仓库权限）
4. 点击 "Generate token"
5. **复制 token**（只显示一次！）
6. 推送时，密码处输入这个 token

**选项 B：使用 SSH（更安全，推荐长期使用）**

1. 生成 SSH key：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. 添加 SSH key 到 GitHub：
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 前往：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

3. 使用 SSH URL：
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/tarot-vending-machine.git
   ```

---

## ✅ 完成检查清单

- [ ] Git 仓库已初始化
- [ ] 所有文件已添加到暂存区
- [ ] 已创建初始提交
- [ ] 已在 GitHub 创建新仓库
- [ ] 已连接远程仓库
- [ ] 已成功推送到 GitHub
- [ ] 在 GitHub 上能看到所有文件

---

## 🐛 常见问题

### 问题 1: "fatal: not a git repository"
**解决**：确保在正确的目录中，先执行 `git init`

### 问题 2: "remote origin already exists"
**解决**：
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/tarot-vending-machine.git
```

### 问题 3: "Authentication failed"
**解决**：使用 Personal Access Token 而不是密码

### 问题 4: "failed to push some refs"
**解决**：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 🎉 完成！

上传成功后，您就可以：
1. ✅ 在 GitHub 上查看代码
2. ✅ 继续开发并推送更新
3. ✅ 在 Zeabur 导入这个仓库进行部署

下一步：参考 `DEPLOYMENT.md` 进行 Zeabur 部署！

