// 直接内嵌代理数据，避免文件读取问题
const proxyData = {
  "proxy_list": [
    {"host": "115.114.77.133:9090", "country": "IN", "quality": 4},
    {"host": "41.223.119.156:3128", "country": "ZM", "quality": 4},
    {"host": "52.188.28.218:3128", "country": "US", "quality": 4},
    {"host": "128.199.120.45:9090", "country": "SG", "quality": 4},
    {"host": "120.92.212.16:7890", "country": "CN", "quality": 4},
    {"host": "211.230.49.122:3128", "country": "KR", "quality": 4},
    {"host": "200.174.198.32:8888", "country": "BR", "quality": 4},
    {"host": "39.185.41.193:5911", "country": "CN", "quality": 4},
    {"host": "150.107.140.238:3128", "country": "ID", "quality": 4},
    {"host": "38.183.183.114:999", "country": "PE", "quality": 4},
    {"host": "120.92.212.16:8890", "country": "CN", "quality": 4},
    {"host": "111.79.111.126:3128", "country": "CN", "quality": 4},
    {"host": "103.35.188.243:3128", "country": "US", "quality": 4},
    {"host": "46.161.6.165:8080", "country": "RU", "quality": 4},
    {"host": "186.65.104.52:2024", "country": "BR", "quality": 4}
  ]
};

export const handler = async (event: any, context: any) => {
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

    // 获取查询参数
    const { country, limit, random } = event.queryStringParameters || {};
    
    console.log('Query parameters:', { country, limit, random });

    let filteredProxies = proxyData.proxy_list;
    console.log('Total proxies before filtering:', filteredProxies.length);

    // 按国家过滤
    if (country) {
      filteredProxies = filteredProxies.filter((proxy: any) => 
        proxy.country.toLowerCase() === country.toLowerCase()
      );
      console.log('Proxies after country filter:', filteredProxies.length);
    }

    // 随机排序
    if (random === 'true') {
      filteredProxies = filteredProxies.sort(() => Math.random() - 0.5);
      console.log('Applied random sorting');
    }

    // 限制数量
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredProxies = filteredProxies.slice(0, limitNum);
        console.log('Proxies after limit filter:', filteredProxies.length);
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
