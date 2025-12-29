# 🚀 Cloudflare 部署快速指南

## ✅ GitHub 推送成功！

仓库地址：https://github.com/spinozao/hotspot-mailer

---

## 📦 第1步：部署前端到 Cloudflare Pages

### 访问 Cloudflare Dashboard
https://dash.cloudflare.com/

### 创建 Pages 项目

1. **登录后，点击左侧 "Workers & Pages"**

2. **点击 "Create application"**

3. **选择 "Pages" 标签**

4. **点击 "Connect to Git"**

5. **连接 GitHub**
   - 如果第一次使用，需要授权 Cloudflare 访问 GitHub
   - 选择 "spinozao/hotspot-mailer" 仓库

6. **配置构建设置**
   ```
   Project name: hotspot-mailer
   Production branch: main
   Build command: (留空)
   Build output directory: public
   ```

7. **点击 "Save and Deploy"**

8. **等待部署（约1-2分钟）**
   - 部署完成后会显示 URL
   - 例如：`https://hotspot-mailer.pages.dev`

---

## 📧 第2步：部署 Worker（邮件API）

### 安装 Wrangler（如果还没安装）

打开命令行：

```bash
npm install -g wrangler
```

### 登录 Wrangler

```bash
wrangler login
```

这会打开浏览器让您授权。

### 部署 Worker

```bash
cd C:\Users\Administrator\.gemini\antigravity\scratch\hotspot-mailer
wrangler deploy
```

**重要**：记下 Worker 的 URL，例如：
```
https://hotspot-mailer-api.spinozao.workers.dev
```

---

## 🔧 第3步：连接前端和后端

### 方法1：在前端代码中配置 Worker URL

编辑 `public/app.js`，添加（在文件开头）：

```javascript
// API 配置
const WORKER_API = 'https://hotspot-mailer-api.spinozao.workers.dev';
```

然后在测试邮件函数中调用：

```javascript
async function sendTestEmailViaWorker() {
    const response = await fetch(`${WORKER_API}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            recipients: getRecipients(),
            subject: '🔥 HotSpot Mailer 测试邮件',
            html: '<h1>测试成功！</h1>'
        })
    });
    
    const result = await response.json();
    return result;
}
```

### 方法2：使用 Pages Functions（推荐）

在 `public/functions/api/` 目录下创建函数，自动部署。

---

## 🧪 第4步：测试

1. **访问您的网站**
   ```
   https://hotspot-mailer.pages.dev
   ```

2. **填写表单**
   - 收件邮箱：`mroma@qq.com`
   - 选择新闻源
   - 填写其他配置

3. **点击"测试发送"**
   - 应该收到测试邮件

---

## 🎯 成功标志

✅ 前端网站可以访问
✅ Worker API 已部署
✅ 可以发送测试邮件到 mroma@qq.com

---

## 📞 需要帮助？

遇到问题？运行：

```bash
wrangler --version
wrangler whoami
```

查看部署日志：

```bash
wrangler pages deployment list
wrangler tail
```

---

## 🎉 恭喜！

您的 HotSpot Mailer 已经部署成功！

- **前端**: https://hotspot-mailer.pages.dev
- **Worker**: https://hotspot-mailer-api.spinozao.workers.dev
- **完全免费**: Cloudflare + MailChannels = $0/月
