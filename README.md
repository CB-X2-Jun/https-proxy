# HTTPS Proxy API

一个简单易用的HTTPS代理服务器列表API，通过Netlify Functions提供RESTful API服务。

## 🚀 功能特性

- 🌍 全球代理服务器列表
- 🔄 自动更新代理列表
- 🎯 按国家筛选代理
- 🔢 随机获取代理
- 📊 获取可用国家列表
- ⚡ Netlify无服务器部署
- 🌐 CORS支持，可直接前端调用

## 📡 API端点

### 获取代理列表
```
GET /api/proxies
```

**查询参数：**
- `country` (可选): 按国家代码筛选，如 `?country=US`
- `limit` (可选): 限制返回数量，如 `?limit=10`
- `random` (可选): 随机排序，如 `?random=true`

**示例请求：**
```bash
# 获取所有代理
curl https://your-site.netlify.app/api/proxies

# 获取美国的前5个代理
curl https://your-site.netlify.app/api/proxies?country=US&limit=5

# 获取10个随机代理
curl https://your-site.netlify.app/api/proxies?limit=10&random=true
```

**响应格式：**
```json
{
  "success": true,
  "count": 42,
  "proxies": [
    {
      "host": "192.168.1.1:8080",
      "country": "US",
      "quality": 4
    }
  ]
}
```

### 获取国家列表
```
GET /api/countries
```

**示例请求：**
```bash
curl https://your-site.netlify.app/api/countries
```

**响应格式：**
```json
{
  "success": true,
  "count": 15,
  "countries": ["CN", "US", "SG", "RU", "DE"]
}
```

## 🛠️ 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动本地开发服务器：
```bash
npm run serve
```

3. 访问API：
- http://localhost:8888/api/proxies
- http://localhost:8888/api/countries

## 🚀 部署到Netlify

1. 将代码推送到GitHub仓库
2. 在Netlify中连接GitHub仓库
3. Netlify会自动检测`netlify.toml`配置并部署
4. 部署完成后即可使用API

## 📁 项目结构

```
https-proxy/
├── api/
│   ├── proxies.js      # 代理列表API
│   └── countries.js    # 国家列表API
├── pxy.json           # 代理数据文件
├── netlify.toml       # Netlify配置
├── package.json       # 项目配置
└── README.md          # 项目文档
```

## 🔄 自动更新

项目通过GitHub Actions每5分钟自动更新代理列表，确保代理的时效性。

## 📄 许可证

MIT License
