const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated AI responses
const simulatedResponses = [
  "你好！我是基于DeepSeek-Chat模型的AI助手。有什么可以帮您的吗？",
  "这是一个模拟响应，实际应用中需要接入真实的DeepSeek API。",
  "我可以帮助您解答问题、提供建议或进行对话。",
  "要使用真实AI模型，请配置您的API密钥。",
  "这是一个基础的聊天机器人演示，展示了前后端交互。"
];

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  const { message, useRealAPI = false } = req.body;

  console.log(`Received message: ${message}`);

  if (useRealAPI) {
    try {
      // Call real DeepSeek API
      const apiKey = 'sk-4f630136425d49dc9c532071895e92f3';
      const apiUrl = 'https://api.deepseek.com/anthropic/v1/messages';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: message }],
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      res.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        model: "deepseek-chat"
      });
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      res.status(500).json({
        response: `调用DeepSeek API时出错: ${error.message}`,
        timestamp: new Date().toISOString(),
        model: "deepseek-chat",
        error: true
      });
    }
  } else {
    // Simulate AI thinking delay
    const thinkingTime = Math.random() * 1000 + 500;

    setTimeout(() => {
      const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      res.json({
        response: randomResponse,
        timestamp: new Date().toISOString(),
        model: "deepseek-chat (模拟模式)"
      });
    }, thinkingTime);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Chatbot服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`AI聊天机器人服务器运行在 http://localhost:${PORT}`);
  console.log(`前端界面: http://localhost:${PORT}`);
  console.log(`API健康检查: http://localhost:${PORT}/api/health`);
  console.log('按 Ctrl+C 停止服务器');
});