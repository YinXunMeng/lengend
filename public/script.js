// DOM元素
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const apiToggle = document.getElementById('apiToggle');
const clearButton = document.getElementById('clearButton');
const toggleTheme = document.getElementById('toggleTheme');
const statusIndicator = document.getElementById('statusIndicator');
const serverUrlElement = document.getElementById('serverUrl');

// 配置
const API_URL = '/api/chat';
let isRealAPI = false;
let messageHistory = [];

// 初始化
function init() {
    // 设置服务器URL显示
    serverUrlElement.textContent = window.location.origin;

    // 加载主题
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // 加载历史消息
    loadMessageHistory();

    // 事件监听器
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', handleKeyDown);
    apiToggle.addEventListener('change', handleApiToggle);
    clearButton.addEventListener('click', clearChat);
    toggleTheme.addEventListener('click', toggleThemeMode);

    // 自动调整输入框高度
    messageInput.addEventListener('input', autoResizeTextarea);

    // 检查服务器状态
    checkServerStatus();

    console.log('AI聊天机器人前端初始化完成');
}

// 发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // 添加用户消息到界面
    addMessageToUI(message, 'user');

    // 保存到历史记录
    messageHistory.push({ role: 'user', content: message, timestamp: new Date() });

    // 清空输入框
    messageInput.value = '';
    autoResizeTextarea();

    // 禁用输入和发送按钮
    messageInput.disabled = true;
    sendButton.disabled = true;

    // 显示AI正在输入指示器
    const typingIndicator = showTypingIndicator();

    try {
        // 准备请求数据
        const requestData = {
            message: message,
            useRealAPI: isRealAPI
        };

        // 发送请求到后端
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 移除打字指示器
        removeTypingIndicator(typingIndicator);

        // 添加AI响应到界面
        addMessageToUI(data.response, 'ai', data.model, data.timestamp);

        // 保存到历史记录
        messageHistory.push({
            role: 'ai',
            content: data.response,
            model: data.model,
            timestamp: data.timestamp
        });

        // 保存历史记录到本地存储
        saveMessageHistory();

    } catch (error) {
        console.error('发送消息时出错:', error);

        // 移除打字指示器
        removeTypingIndicator(typingIndicator);

        // 显示错误消息
        addMessageToUI(
            `抱歉，处理您的消息时出现了错误: ${error.message}`,
            'ai',
            '错误',
            new Date().toISOString()
        );
    } finally {
        // 重新启用输入和发送按钮
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// 添加消息到UI
function addMessageToUI(message, sender, model = 'deepseek-chat', timestamp = null) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;

    const time = timestamp ? new Date(timestamp) : new Date();
    const timeString = formatTime(time);

    messageElement.innerHTML = `
        <div class="avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="content">
            <div class="text">${escapeHtml(message)}</div>
            <div class="meta">
                <span class="time">${timeString}</span>
                <span class="model">${model}</span>
            </div>
        </div>
    `;

    chatMessages.appendChild(messageElement);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 显示打字指示器
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'message ai-message typing-indicator';
    typingElement.id = 'typing-indicator';

    typingElement.innerHTML = `
        <div class="avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="content">
            <div class="text">
                AI正在思考...
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return typingElement;
}

// 移除打字指示器
function removeTypingIndicator(typingElement) {
    if (typingElement && typingElement.parentNode) {
        typingElement.parentNode.removeChild(typingElement);
    }
}

// 处理API切换
function handleApiToggle() {
    isRealAPI = apiToggle.checked;

    const label = document.querySelector('.control-label');
    label.textContent = isRealAPI ? '真实API模式' : '模拟模式';

    // 显示通知
    showNotification(
        isRealAPI
            ? '已切换到真实API模式（需要配置API密钥）'
            : '已切换到模拟模式',
        'info'
    );

    console.log(`API模式切换为: ${isRealAPI ? '真实API' : '模拟'}`);
}

// 清除聊天
function clearChat() {
    if (chatMessages.children.length <= 1) return; // 保留第一条欢迎消息

    if (confirm('确定要清除所有聊天记录吗？')) {
        // 保留第一条AI欢迎消息
        const welcomeMessage = chatMessages.children[0];
        chatMessages.innerHTML = '';
        chatMessages.appendChild(welcomeMessage);

        // 清空历史记录
        messageHistory = [];
        localStorage.removeItem('chatbot-message-history');

        showNotification('聊天记录已清除', 'success');
    }
}

// 切换主题
function toggleThemeMode() {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('chatbot-theme', isDark ? 'dark' : 'light');

    showNotification(`已切换到${isDark ? '深色' : '浅色'}主题`, 'info');
}

// 检查服务器状态
async function checkServerStatus() {
    try {
        const response = await fetch('/api/health');
        if (response.ok) {
            updateStatusIndicator(true);
        } else {
            updateStatusIndicator(false);
        }
    } catch (error) {
        console.error('服务器状态检查失败:', error);
        updateStatusIndicator(false);
    }
}

// 更新状态指示器
function updateStatusIndicator(isConnected) {
    const icon = statusIndicator.querySelector('i');
    const text = statusIndicator.querySelector('span:not(.fa-circle)') || statusIndicator;

    if (isConnected) {
        icon.style.color = '#4ade80';
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 已连接';
    } else {
        icon.style.color = '#ef4444';
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 连接失败';
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 处理键盘快捷键
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }

    // Ctrl+/ 显示帮助
    if (event.key === '/' && event.ctrlKey) {
        event.preventDefault();
        showNotification('快捷键: Enter发送, Shift+Enter换行, Ctrl+/显示帮助', 'info');
    }
}

// 自动调整文本域高度
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

// 格式化时间
function formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小时前`;

    // 超过24小时显示具体日期
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 保存消息历史
function saveMessageHistory() {
    try {
        // 只保存最近50条消息
        const recentHistory = messageHistory.slice(-50);
        localStorage.setItem('chatbot-message-history', JSON.stringify(recentHistory));
    } catch (error) {
        console.error('保存消息历史失败:', error);
    }
}

// 加载消息历史
function loadMessageHistory() {
    try {
        const saved = localStorage.getItem('chatbot-message-history');
        if (saved) {
            messageHistory = JSON.parse(saved);

            // 不清除现有UI中的欢迎消息，只添加历史记录
            // 注意：这里简化处理，实际应用中可能需要更复杂的逻辑
        }
    } catch (error) {
        console.error('加载消息历史失败:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);