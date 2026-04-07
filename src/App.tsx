import { useState, useEffect } from 'react'
import { Theme } from './types'
import './styles/globals.css'
import './styles/theme.css'

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [useRealAPI, setUseRealAPI] = useState(false)
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  // 从 localStorage 加载主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatbot-theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.body.classList.toggle('dark-theme', savedTheme === 'dark')
    }
  }, [])

  // 保存主题到 localStorage 并更新 body 类
  useEffect(() => {
    localStorage.setItem('chatbot-theme', theme)
    document.body.classList.toggle('dark-theme', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <i className="fas fa-robot"></i>
          <h1>AI聊天机器人</h1>
        </div>
        <div className="model-info">
          <span className="model-tag">模型: DeepSeek-Chat</span>
          <span className="status-indicator">
            <i className="fas fa-circle"></i>
            {serverStatus === 'connected' ? '已连接' :
             serverStatus === 'disconnected' ? '连接失败' : '检查中...'}
          </span>
        </div>
      </header>

      <main className="chat-container">
        <div className="chat-messages" id="chatMessages">
          <div className="message ai-message">
            <div className="avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="content">
              <div className="text">
                你好！我是基于DeepSeek-Chat模型的AI助手。我可以回答你的问题、提供建议或进行对话。
              </div>
              <div className="meta">
                <span className="time">刚刚</span>
                <span className="model">deepseek-chat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              id="messageInput"
              placeholder="输入你的消息... (按Enter发送，Shift+Enter换行)"
              rows={1}
              autoFocus
            ></textarea>
            <button id="sendButton" className="send-btn">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <div className="controls">
            <div className="control-group">
              <label className="switch">
                <input
                  type="checkbox"
                  id="apiToggle"
                  checked={useRealAPI}
                  onChange={(e) => setUseRealAPI(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <span className="control-label">
                {useRealAPI ? '真实API模式' : '模拟模式'}
              </span>
            </div>
            <button id="clearButton" className="clear-btn">
              <i className="fas fa-trash"></i> 清除对话
            </button>
          </div>
          <div className="info-note">
            <i className="fas fa-info-circle"></i>
            <span>
              当前使用{useRealAPI ? '真实API' : '模拟'}响应。
              {useRealAPI ? '需要配置API密钥。' : '要使用真实DeepSeek API，请配置API密钥并切换开关。'}
            </span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>AI聊天机器人演示 &copy; 2026 | 后端运行于 <span id="serverUrl">{window.location.origin}</span></p>
        <p className="footer-links">
          <a href="/api/health" target="_blank" rel="noopener noreferrer">健康检查</a>
          <span className="separator">|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); toggleTheme(); }} id="toggleTheme">
            切换主题
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App