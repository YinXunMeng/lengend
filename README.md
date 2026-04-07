# AI聊天机器人 - DeepSeek-Chat

一个基于Node.js的AI聊天机器人演示，包含完整的前后端代码。

## 功能特性

- 🎨 现代化聊天界面，支持深色/浅色主题
- 🤖 模拟AI响应和真实API模式切换
- ⚡ 实时消息交互，打字效果指示器
- 💾 本地存储聊天记录
- 📱 响应式设计，支持移动设备
- 🔧 健康检查接口和状态监控

## 项目结构

```
chatbot/
├── package.json          # 项目依赖配置
├── server.js            # 后端服务器
├── README.md            # 项目说明
└── public/              # 前端静态文件
    ├── index.html       # 主页面
    ├── style.css        # 样式文件
    └── script.js        # 前端逻辑
```

## 快速开始

### 1. 安装依赖

```bash
cd /c/code/chatbot
npm install
```

### 2. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:3000

## API接口

### 聊天接口
- `POST /api/chat`
- 请求体：
  ```json
  {
    "message": "用户消息",
    "useRealAPI": false
  }
  ```
- 响应：
  ```json
  {
    "response": "AI回复",
    "timestamp": "2026-04-07T12:00:00.000Z",
    "model": "deepseek-chat (模拟模式)"
  }
  ```

### 健康检查
- `GET /api/health`
- 响应：
  ```json
  {
    "status": "ok",
    "message": "AI Chatbot服务器运行正常",
    "timestamp": "2026-04-07T12:00:00.000Z"
  }
  ```

## 配置说明

### 模拟模式
默认使用模拟AI响应，无需任何API密钥即可运行。

### 真实API模式
要使用真实的DeepSeek API：

1. 在`server.js`中取消注释真实的API调用代码
2. 添加你的DeepSeek API密钥
3. 在前端切换"真实API模式"开关

### 环境变量
可以配置以下环境变量：

```bash
PORT=3000                 # 服务器端口
NODE_ENV=production       # 运行环境
```

## 开发说明

### 添加新功能
1. 修改`server.js`添加新的API端点
2. 更新前端`script.js`处理新的交互
3. 在`style.css`中添加相应的样式

### 部署到生产环境
1. 设置`NODE_ENV=production`
2. 使用PM2或类似工具进程管理
3. 配置反向代理（如Nginx）

## 技术栈

- **后端**: Node.js, Express.js
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: Flexbox, CSS Grid, 动画效果
- **工具**: Font Awesome图标, Google字体

## 故障排除

### 常见问题

1. **端口被占用**
   ```
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   解决方案：修改`server.js`中的端口号或关闭占用端口的进程

2. **依赖安装失败**
   ```
   npm ERR! code EACCES
   ```
   解决方案：使用`sudo`或修复npm权限

3. **前端无法连接后端**
   解决方案：检查浏览器控制台错误，确保服务器正在运行

### 调试模式
启动时添加调试日志：
```bash
DEBUG=* npm start
```

## 许可证

MIT License - 详见项目文件

## 贡献

欢迎提交Issue和Pull Request！

---

**提示**: 这是一个演示项目，实际生产使用需要接入真实的AI API并考虑安全性、性能等因素。