// Socket.IO 连接
let socket = null;
let compileTimeout = null;
const COMPILE_DELAY = 300; // 300ms 防抖延迟

// 页面元素
const typstCodeTextarea = document.getElementById('typst-code');
const previewArea = document.getElementById('preview-area');
const errorArea = document.getElementById('error-area');
const compileBtn = document.getElementById('compile-btn');
const clearBtn = document.getElementById('clear-btn');

/**
 * 初始化 Socket.IO 连接
 */
function initSocket() {
    // 连接到 Socket.IO 服务器
    socket = io({
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });
    
    // 连接成功
    socket.on('connect', function() {
        console.log('Socket.IO 连接已建立');
        errorArea.textContent = '';
    });
    
    // 接收服务器确认消息
    socket.on('connected', function(data) {
        console.log('服务器消息:', data.message);
    });
    
    // 接收编译结果
    socket.on('compile_result', function(result) {
        if (result.success) {
            // 显示 SVG 预览
            previewArea.innerHTML = result.svg;
            errorArea.textContent = '';
        } else {
            // 显示错误信息
            previewArea.innerHTML = '<p style="color: #666;">编译失败</p>';
            errorArea.textContent = result.error;
        }
    });
    
    // 连接错误
    socket.on('connect_error', function(error) {
        console.error('Socket.IO 连接错误:', error);
        errorArea.textContent = 'Socket 连接错误';
    });
    
    // 断开连接
    socket.on('disconnect', function(reason) {
        console.log('Socket.IO 连接已断开:', reason);
        if (reason === 'io server disconnect') {
            // 服务器主动断开，需要手动重连
            socket.connect();
        }
        errorArea.textContent = 'Socket 连接已断开，正在重连...';
    });
    
    // 重连成功
    socket.on('reconnect', function(attemptNumber) {
        console.log('Socket.IO 重连成功，尝试次数:', attemptNumber);
        errorArea.textContent = '';
        // 重连后重新编译当前代码
        if (typstCodeTextarea.value.trim()) {
            compileCode();
        }
    });
    
    // 重连失败
    socket.on('reconnect_failed', function() {
        console.error('Socket.IO 重连失败');
        errorArea.textContent = 'Socket 重连失败，请刷新页面';
    });
}

/**
 * 发送编译请求
 */
function compileCode() {
    const code = typstCodeTextarea.value.trim();
    
    if (!code) {
        previewArea.innerHTML = '<p style="color: #666;">请输入 Typst 代码</p>';
        errorArea.textContent = '';
        return;
    }
    
    if (socket && socket.connected) {
        // 发送编译请求到服务器
        socket.emit('compile', { code: code });
    } else {
        errorArea.textContent = 'Socket 未连接，请刷新页面';
    }
}

/**
 * 防抖编译函数
 */
function debouncedCompile() {
    // 清除之前的定时器
    if (compileTimeout) {
        clearTimeout(compileTimeout);
    }
    
    // 设置新的定时器
    compileTimeout = setTimeout(compileCode, COMPILE_DELAY);
}

/**
 * 清空编辑器
 */
function clearEditor() {
    typstCodeTextarea.value = '';
    previewArea.innerHTML = '<p style="color: #666;">公式预览将显示在这里...</p>';
    errorArea.textContent = '';
}

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Socket.IO
    initSocket();
    
    // 输入时自动编译（防抖）
    typstCodeTextarea.addEventListener('input', debouncedCompile);
    
    // 手动编译按钮
    compileBtn.addEventListener('click', compileCode);
    
    // 清空按钮
    clearBtn.addEventListener('click', clearEditor);
    
    // 页面加载时编译默认代码
    setTimeout(function() {
        if (typstCodeTextarea.value.trim() && socket && socket.connected) {
            compileCode();
        }
    }, 500); // 等待 Socket 连接建立
});

// 页面卸载时断开 Socket
window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.disconnect();
    }
});