# UTF-8 编码修复指南

## 🐛 问题

HTML文件中的中文显示为乱码，这是Windows文件编码问题。

## ✅ 解决方案

### 方案1：使用VS Code（推荐）

1. **打开文件**
   ```
   C:\Users\Administrator\.gemini\antigravity\scratch\hotspot-mailer\public\index.html
   ```

2. **查看右下角编码**
   - 如果显示 "GBK" 或其他非UTF-8编码，点击它

3. **重新打开为UTF-8**
   - 点击"通过编码重新打开" → 选择 "UTF-8"

4. **保存为UTF-8 BOM**
   - 再次点击编码
   - 选择"通过编码保存" → "UTF-8 with BOM"

5. **重复以下文件**:
   - `public/index.html`
   - `public/admin.html`  
   - `public/login.html`

### 方案2：使用Notepad++

1. 打开文件
2. 菜单：编码 → 转为UTF-8-BOM编码
3. 保存

### 方案3：让我重新生成

如果手动修复太麻烦，回复"重新生成"，我会创建全新的HTML文件。

## 🧪 测试

修复后刷新浏览器：http://localhost:8080/index.html

中文应该正常显示。
