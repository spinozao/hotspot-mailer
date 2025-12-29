/**
 * Cloudflare Worker - Email API Handler
 * 使用 MailChannels 免费发送邮件
 */

export default {
    async fetch(request, env) {
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        // Route: POST /api/send-email
        if (url.pathname === '/api/send-email' && request.method === 'POST') {
            return await handleSendEmail(request, corsHeaders);
        }

        // Route: GET /api/hotspots
        if (url.pathname === '/api/hotspots' && request.method === 'GET') {
            return await handleGetHotspots(request, corsHeaders);
        }

        return new Response('Not Found', { status: 404 });
    }
};

/**
 * 发送邮件
 */
async function handleSendEmail(request, corsHeaders) {
    try {
        const body = await request.json();
        const { recipients, subject, html, from } = body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return jsonResponse({ error: '缺少收件人' }, 400, corsHeaders);
        }

        // 使用 MailChannels 发送邮件
        const send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: recipients.map(email => ({
                    to: [{ email }],
                })),
                from: {
                    email: from || 'noreply@hotspot-mailer.pages.dev',
                    name: 'HotSpot Mailer',
                },
                subject: subject || '🔥 今日热点资讯推送',
                content: [
                    {
                        type: 'text/html',
                        value: html || '<p>HotSpot Mailer 测试邮件</p>',
                    },
                ],
            }),
        });

        const response = await fetch(send_request);

        if (response.ok) {
            return jsonResponse(
                {
                    success: true,
                    message: `邮件已发送到 ${recipients.length} 个收件人`,
                    recipients,
                },
                200,
                corsHeaders
            );
        } else {
            const error = await response.text();
            return jsonResponse(
                { error: '邮件发送失败', details: error },
                500,
                corsHeaders
            );
        }
    } catch (error) {
        return jsonResponse(
            { error: '服务器错误', message: error.message },
            500,
            corsHeaders
        );
    }
}

/**
 * 获取热点资讯（模拟数据）
 */
async function handleGetHotspots(request, corsHeaders) {
    const url = new URL(request.url);
    const sources = url.searchParams.get('sources')?.split(',') || [];
    const domain = url.searchParams.get('domain') || '科技';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // 模拟热点数据
    const mockHotspots = [
        {
            id: 1,
            title: 'AI技术突破：ChatGPT-5 即将发布',
            summary: 'OpenAI 宣布下一代语言模型 ChatGPT-5 将在近期发布，性能提升显著...',
            source: 'techcrunch',
            category: '科技',
            url: 'https://example.com/news/1',
            publishedAt: new Date().toISOString(),
        },
        {
            id: 2,
            title: '全球股市创新高，科技股领涨',
            summary: '受经济数据好转影响，全球主要股指纷纷创下年度新高...',
            source: 'reuters',
            category: '财经',
            url: 'https://example.com/news/2',
            publishedAt: new Date().toISOString(),
        },
        {
            id: 3,
            title: '抖音发布2024年度热门视频榜单',
            summary: '短视频平台抖音公布了年度最受欢迎的内容创作者和视频...',
            source: 'douyin',
            category: '娱乐',
            url: 'https://example.com/news/3',
            publishedAt: new Date().toISOString(),
        },
        {
            id: 4,
            title: 'GitHub Copilot 新功能发布',
            summary: 'GitHub 宣布 Copilot 新增多项功能，支持更多编程语言...',
            source: 'github',
            category: '科技',
            url: 'https://example.com/news/4',
            publishedAt: new Date().toISOString(),
        },
        {
            id: 5,
            title: '小红书成为年轻人首选种草平台',
            summary: '最新数据显示，小红书月活用户突破3亿，成为最受欢迎的生活方式平台...',
            source: 'xiaohongshu',
            category: '社交',
            url: 'https://example.com/news/5',
            publishedAt: new Date().toISOString(),
        },
    ];

    // 简单过滤
    let filtered = mockHotspots;
    if (sources.length > 0) {
        filtered = filtered.filter(item => sources.includes(item.source));
    }

    return jsonResponse(
        {
            success: true,
            data: filtered.slice(0, limit),
            total: filtered.length,
        },
        200,
        corsHeaders
    );
}

/**
 * JSON 响应辅助函数
 */
function jsonResponse(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
}
