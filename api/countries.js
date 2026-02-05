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

    // 提取所有不重复的国家代码
    const countries = [...new Set(proxies.proxy_list.map(proxy => proxy.country))].sort();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: countries.length,
        countries: countries
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
