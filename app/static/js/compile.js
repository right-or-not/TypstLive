// Socket.IO Connection
let socket = null;
let compileTimeout = null;
const COMPILE_DELAY = 300;

// page elements
const typstCodeTextarea = document.getElementById('typst-code');
const previewArea = document.getElementById('preview-area');
const errorArea = document.getElementById('error-area');
const clearBtn = document.getElementById('clear-btn');

/**
 * init Socket.IO connection
 */
function initSocket() {
    // connect Socket.IO server
    socket = io({
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });
    
    // connect success
    socket.on('connect', function() {
        console.log('Socket.IO connection built');
        errorArea.textContent = '';
    });
    
    // receive Server comfirm info
    socket.on('connected', function(data) {
        console.log('Server Info: ', data.message);
    });
    
    // receive Compile result
    socket.on('compile_result', function(result) {
        if (result.success) {
            // show SVG
            previewArea.innerHTML = result.svg;
            errorArea.textContent = '';
        } else {
            // show ERROR info
            previewArea.innerHTML = '<p style="color: #666;">编译失败</p>';
            errorArea.textContent = result.error;
        }
    });
    
    // connect error
    socket.on('connect_error', function(error) {
        console.error('Socket.IO connect error: ', error);
        errorArea.textContent = 'Socket 连接错误';
    });
    
    // disconnect
    socket.on('disconnect', function(reason) {
        console.log('Socket.IO disconnect: ', reason);
        if (reason === 'io server disconnect') {
            // server disconnect => client should try connect
            socket.connect();
        }
        errorArea.textContent = 'Socket link disconnect, Reconnecting...';
    });
    
    // reconnect success
    socket.on('reconnect', function(attemptNumber) {
        console.log('Socket.IO reconnect successfully, try times: ', attemptNumber);
        errorArea.textContent = '';
        // compile current code
        if (typstCodeTextarea.value.trim()) {
            compileCode();
        }
    });
    
    // reconnect failed
    socket.on('reconnect_failed', function() {
        console.error('Socket.IO reconnect failed.');
        errorArea.textContent = 'Socket reconnect failed, Please Refresh Page!';
    });
}

/**
 * send compile request
 */
function compileCode() {
    const code = typstCodeTextarea.value.trim();
    
    if (!code) {
        previewArea.innerHTML = '<p style="color: #666;">请输入 Typst 代码</p>';
        errorArea.textContent = '';
        return;
    }
    
    if (socket && socket.connected) {
        // send compile request to Server
        socket.emit('compile', { code: code });
    } else {
        errorArea.textContent = 'Socket unconnected, Please Refresh Page!';
    }
}

/**
 * debounce function
 */
function debouncedCompile() {
    // clear Timer
    if (compileTimeout) {
        clearTimeout(compileTimeout);
    }
    
    // set new Timer
    compileTimeout = setTimeout(compileCode, COMPILE_DELAY);
}

/**
 * Clear Editor
 */
function clearEditor() {
    typstCodeTextarea.value = '';
    previewArea.innerHTML = '<p style="color: #666;">Output will be Shown Here!</p>';
    errorArea.textContent = '';
}

// Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // init Socket.IO
    initSocket();
    
    // debounce
    typstCodeTextarea.addEventListener('input', debouncedCompile);
    
    // clear Button
    clearBtn.addEventListener('click', clearEditor);
    
    // compile default Typst code
    setTimeout(function() {
        if (typstCodeTextarea.value.trim() && socket && socket.connected) {
            compileCode();
        }
    }, 500);
});

// before page unload: Disconnect Socket
window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.disconnect();
    }
});