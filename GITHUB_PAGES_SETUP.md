# GitHub Pages 快速部署指南

## 🎯 启用 GitHub Pages

### 方法1：网页操作（推荐）

1. **访问仓库设置**
   ```
   https://github.com/spinozao/hotspot-mailer/settings/pages
   ```

2. **配置 Source**
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/(root)` 
   
3. **保存**
   - 点击 Save
   - 等待1-2分钟部署

4. **访问**
   ```
   https://spinozao.github.io/hotspot-mailer/public/
   ```
   
   注意：需要加 `/public/` 后缀！

---

### 方法2：创建 gh-pages 分支（更专业）

```bash
cd C:\Users\Administrator\.gemini\antigravity\scratch\hotspot-mailer

# 创建 gh-pages 分支，只包含 public 文件夹
git checkout --orphan gh-pages
git rm -rf .
git read-tree --prefix=/ -u main:public
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 回到 main 分支
git checkout main
```

然后在 Settings → Pages 选择 `gh-pages` 分支。

---

## ⚠️ 当前问题

404 错误是因为 GitHub Pages 还没启用或配置错误。

### 快速解决：

**现在访问本地版本**（已经可用）：
```
http://localhost:8080/index.html
```

**稍后配置 GitHub Pages**：
1. 进入 Settings → Pages
2. 选择 main 分支，/ (root) 文件夹
3. 访问时加上 `/public/` 路径

---

## 💡 推荐方案

**立即使用本地版本**：
- ✅ 无需等待
- ✅ 完全可用
- ✅ 速度最快

访问：http://localhost:8080/index.html
