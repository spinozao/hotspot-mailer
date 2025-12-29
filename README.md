# ⚡ HotSpot Mailer

**智能热点资讯自动推送系统** - 365天全年无休

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://pages.cloudflare.com/)
[![MailChannels](https://img.shields.io/badge/Email-MailChannels-blue)](https://www.mailchannels.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ 特性

- 🌍 **17+ 国际新闻源**：CNN, BBC, NHK, Yahoo, Reuters, Google News等
- 🇨🇳 **中文资讯平台**：百度、知乎、微博热搜
- 📱 **社交媒体**：抖音、小红书、快手、TikTok
- 🔧 **自定义源**：添加任意RSS/API源
- 👥 **多收件人**：支持同时发送给多个邮箱
- ⏰ **定时推送**：自定义发送时间
- 📧 **免费邮件**：使用MailChannels免费发送
- 🎨 **世界级UI**：现代化暗色主题，毛玻璃效果
- 🔐 **管理后台**：密码保护的配置管理

## 🚀 在线演示

访问：[https://hotspot-mailer.pages.dev](https://your-deployment-url.pages.dev)

## 📦 技术栈

- **前端**：Vanilla JavaScript, HTML5, CSS3
- **部署**：Cloudflare Pages
- **后端**：Cloudflare Workers  
- **邮件**：MailChannels API
- **图标**：Lucide Icons
- **字体**：Google Fonts (Inter, Orbitron)

## 🛠️ 本地开发

### 1. 克隆项目
```bash
git clone https://github.com/你的用户名/hotspot-mailer.git
cd hotspot-mailer
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动本地服务器
```bash
cd public
python -m http.server 8080
```

访问：http://localhost:8080

### 4. 配置 Wrangler
```bash
npm install -g wrangler
wrangler login
```

## 📤 部署到 Cloudflare

### 方法 1：通过 GitHub（推荐）

1. 推送到 GitHub
   ```bash
   git push origin main
   ```

2. 在 Cloudflare Dashboard 连接 GitHub 仓库

3. 配置构建设置：
   - Build output directory: `public`
   - 其他保持默认

### 方法 2：使用 Wrangler CLI

```bash
# 部署前端
wrangler pages deploy public --project-name=hotspot-mailer

# 部署 Worker (邮件 API)
wrangler deploy
```

详细步骤见：[部署指南](cloudflare-deployment-guide.md)

## 🎯 使用方法

1. **访问主页**
   - 选择感兴趣的新闻源
   - 填写收件邮箱
   - 配置SMTP设置（如果使用自己的邮箱）

2. **设置定时**
   - 添加发送时间
   - 设置运行天数

3. **保存配置**
   - 点击"保存并启动"
   - 系统自动开始定时推送

4. **管理后台**
   - 访问 `/login.html`
   - 默认账号：`admin` / `admin123`
   - 查看发送记录和系统状态

## 📧 MailChannels 配置

完全免费，无需注册！通过 Cloudflare Workers 直接调用：

```javascript
// 在 worker.js 中已配置
const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
  method: 'POST',
  body: JSON.stringify({ ... })
});
```

## 🔒 安全

- 密码哈希存储（建议在生产环境使用）
- 会话管理（24小时过期）
- CORS 配置
- Rate Limiting（建议添加）

## 📊 目录结构

```
hotspot-mailer/
├── public/              # 前端静态文件
│   ├── index.html       # 主配置页面
│   ├── login.html       # 登录页面
│   ├── admin.html       # 管理后台
│   ├── style.css        # 主样式
│   ├── login.css        # 登录样式
│   ├── admin.css        # 后台样式
│   ├── app.js           # 主逻辑
│   ├── login.js         # 登录逻辑
│   └── admin.js         # 后台逻辑
├── worker.js            # Cloudflare Worker (API)
├── wrangler.toml        # Wrangler 配置
├── test-email.js        # 本地邮件测试脚本
└── package.json         # 项目配置
```

## 💰 费用

**完全免费！** 使用 Cloudflare 免费套餐：
- Pages：无限流量
- Workers：10万次请求/天
- MailChannels：通过 Workers 免费

## 📝 许可

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

遇到问题？查看：
- [部署指南](cloudflare-deployment-guide.md)
- [测试指南](TESTING_GUIDE.md)
- [Cloudflare 文档](https://developers.cloudflare.com/)

---

**Made with ❤️ for the community**
