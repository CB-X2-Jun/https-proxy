const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // 设置CORS头
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    // 处理OPTIONS请求（CORS预检）
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // 只允许GET请求
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // 读取代理列表
    const proxyListPath = path.join(__dirname, '..', 'pxy.json');
    const proxyData = fs.readFileSync(proxyListPath, 'utf8');
    const proxies = JSON.parse(proxyData);

    // 获取查询参数
    const { country, limit, random } = event.queryStringParameters || {};

    let filteredProxies = proxies.proxy_list;

    // 按国家过滤
    if (country) {
      filteredProxies = filteredProxies.filter(proxy => 
        proxy.country.toLowerCase() === country.toLowerCase()
      );
    }

    // 随机排序
    if (random === 'true') {
      filteredProxies = filteredProxies.sort(() => Math.random() - 0.5);
    }

    // 限制数量
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredProxies = filteredProxies.slice(0, limitNum);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: filteredProxies.length,
        proxies: filteredProxies
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: 'Internal server error' 
      })
    };
  }
};
