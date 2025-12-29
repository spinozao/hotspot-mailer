/**
 * 邮件发送测试脚本
 * 用于测试邮件发送功能
 */

const nodemailer = require('nodemailer');

// 配置信息（请修改为您的真实信息）
const config = {
    // 收件人
    to: 'mroma@qq.com',

    // SMTP配置
    smtp: {
        host: 'smtp.qq.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: '您的QQ邮箱@qq.com',  // ⚠️ 请修改为您的真实QQ邮箱
            pass: '您的授权码'           // ⚠️ 请修改为您的真实授权码
        }
    }
};

async function sendTestEmail() {
    console.log('🚀 开始发送测试邮件...\n');

    try {
        // 创建邮件传输对象
        const transporter = nodemailer.createTransporter(config.smtp);

        console.log('📧 验证SMTP连接...');
        await transporter.verify();
        console.log('✅ SMTP服务器连接成功！\n');

        // 邮件内容
        const mailOptions = {
            from: `"HotSpot Mailer" <${config.smtp.auth.user}>`,
            to: config.to,
            subject: '🔥 HotSpot Mailer 测试邮件',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 40px 20px;
                            margin: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 32px;
                            font-weight: 700;
                        }
                        .content {
                            padding: 40px 30px;
                            color: #333;
                        }
                        .content h2 {
                            color: #667eea;
                            margin-top: 0;
                        }
                        .hotspot-item {
                            background: #f7f7f7;
                            border-left: 4px solid #667eea;
                            padding: 15px 20px;
                            margin: 15px 0;
                            border-radius: 8px;
                        }
                        .hotspot-item h3 {
                            margin: 0 0 10px 0;
                            color: #333;
                            font-size: 18px;
                        }
                        .hotspot-item p {
                            margin: 0;
                            color: #666;
                            line-height: 1.6;
                        }
                        .footer {
                            background: #f7f7f7;
                            padding: 20px 30px;
                            text-align: center;
                            color: #999;
                            font-size: 14px;
                        }
                        .badge {
                            display: inline-block;
                            background: #667eea;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-size: 12px;
                            margin-right: 8px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>⚡ HotSpot Mailer</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">智能热点 · 自动推送 · 365天全年无休</p>
                        </div>
                        
                        <div class="content">
                            <h2>🎉 测试邮件发送成功！</h2>
                            <p>恭喜！您的 HotSpot Mailer 邮件系统已经成功配置并可以正常发送邮件。</p>
                            
                            <h3 style="margin-top: 30px; color: #667eea;">📊 今日热点示例</h3>
                            
                            <div class="hotspot-item">
                                <h3>
                                    <span class="badge">科技</span>
                                    人工智能在2024年的重大突破
                                </h3>
                                <p>最新研究表明，AI技术在多个领域取得了显著进展，包括自然语言处理、计算机视觉和决策系统。专家预测这将对未来几年的技术发展产生深远影响...</p>
                            </div>
                            
                            <div class="hotspot-item">
                                <h3>
                                    <span class="badge">财经</span>
                                    全球股市创新高
                                </h3>
                                <p>受经济数据好转影响，全球主要股指纷纷创下年度新高。分析师认为，这反映了市场对经济复苏的信心...</p>
                            </div>
                            
                            <div class="hotspot-item">
                                <h3>
                                    <span class="badge">娱乐</span>
                                    年度最佳电影揭晓
                                </h3>
                                <p>备受瞩目的年度电影盛典圆满落幕，多部优秀作品获得表彰。观众们对今年的电影质量给予了高度评价...</p>
                            </div>
                            
                            <p style="margin-top: 30px; padding: 20px; background: #fff8e1; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <strong>💡 提示：</strong> 这是一封测试邮件。实际使用时，系统会根据您选择的新闻源和关注领域，自动推送最新、最热的资讯内容。
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p><strong>HotSpot Mailer</strong> - 让您永远不错过重要资讯</p>
                            <p style="margin: 5px 0 0 0;">发送时间: ${new Date().toLocaleString('zh-CN')}</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        console.log('📮 发送邮件到:', config.to);
        const info = await transporter.sendMail(mailOptions);

        console.log('\n✅ 邮件发送成功！');
        console.log('📬 Message ID:', info.messageId);
        console.log('\n🎉 请检查邮箱:', config.to);
        console.log('📧 如果在收件箱未找到，请检查垃圾邮件文件夹\n');

    } catch (error) {
        console.error('\n❌ 邮件发送失败：', error.message);
        console.error('\n💡 常见问题：');
        console.error('   1. 检查QQ邮箱授权码是否正确（不是登录密码）');
        console.error('   2. 确认已开启QQ邮箱的SMTP服务');
        console.error('   3. 检查网络连接是否正常');
        console.error('   4. 如果使用企业邮箱，请咨询管理员SMTP配置\n');
        process.exit(1);
    }
}

// 运行测试
console.log('='.repeat(60));
console.log('  HotSpot Mailer - 邮件发送测试');
console.log('='.repeat(60));
console.log();

if (config.smtp.auth.user === '您的QQ邮箱@qq.com' || config.smtp.auth.pass === '您的授权码') {
    console.error('❌ 错误：请先在脚本中配置您的QQ邮箱和授权码！\n');
    console.log('📝 修改步骤：');
    console.log('   1. 打开 test-email.js 文件');
    console.log('   2. 找到 config 对象');
    console.log('   3. 将 user 改为您的QQ邮箱');
    console.log('   4. 将 pass 改为您的授权码（从QQ邮箱获取）\n');
    process.exit(1);
}

sendTestEmail();
