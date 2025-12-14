// static/js/compile.js
import { CodeMirrorAPI } from './syntax-highlight.js';

// Configuration
const COMPILE_DELAY = 300; // Debounce delay in ms

// State
let socket = null;
let compileTimeout = null;

// DOM Elements
const previewArea = document.getElementById('preview-area');
const errorArea = document.getElementById('error-area');

/**
 * Initialize Socket.IO connection
 */
function initSocket() {
    // Check if io is loaded (from CDN)
    if (typeof window.io === 'undefined') {
        console.error('Socket.IO library not loaded!');
        if (errorArea) errorArea.textContent = 'Error: Socket.IO library missing.';
        return;
    }

    // connect Socket.IO server
    socket = window.io({
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });
    
    // --- Event Handlers ---

    // 1. Connect Success
    socket.on('connect', function() {
        console.log('[Socket.IO] Connected');
        if (errorArea) errorArea.textContent = '';
        // Try to compile immediately upon connection if there is code
        attemptCompile();
    });
    
    // 2. Server Confirmation
    socket.on('connected', function(data) {
        console.log('[Socket.IO] Server Message:', data.message);
    });
    
    // 3. Receive Compile Result
    socket.on('compile_result', function(result) {
        if (result.success) {
            // Update SVG Preview
            if (previewArea) previewArea.innerHTML = result.svg;
            if (errorArea) errorArea.textContent = '';
        } else {
            // Show Error
            // Only show "Compile Failed" if it's a real error, not just empty
            if (result.error && result.error !== 'Typst Code is Empty') {
                if (previewArea) previewArea.innerHTML = '<p style="color: #666; opacity: 0.7;">(Preview outdated)</p>';
                if (errorArea) errorArea.textContent = result.error;
            }
        }
    });
    
    // 4. Connect Error
    socket.on('connect_error', function(error) {
        console.error('[Socket.IO] Connect error:', error);
        if (errorArea) errorArea.textContent = 'Connection Error';
    });
    
    // 5. Disconnect
    socket.on('disconnect', function(reason) {
        console.log('[Socket.IO] Disconnected:', reason);
        if (reason === 'io server disconnect') {
            socket.connect();
        }
        if (errorArea) errorArea.textContent = 'Disconnected, Reconnecting...';
    });
    
    // 6. Reconnect Success
    socket.on('reconnect', function(attemptNumber) {
        console.log('[Socket.IO] Reconnected after', attemptNumber, 'attempts');
        if (errorArea) errorArea.textContent = '';
        attemptCompile();
    });
}

/**
 * Send compile request to server
 * Uses CodeMirrorAPI to get the source of truth
 */
function compileCode() {
    // 1. Get code from API (Source of Truth)
    const code = CodeMirrorAPI.getValue().trim();
    
    // 2. Handle empty code
    if (!code) {
        if (previewArea) previewArea.innerHTML = '<p style="color: #666;">Input Typst Code to Render</p>';
        if (errorArea) errorArea.textContent = '';
        return;
    }
    
    // 3. Emit if connected
    if (socket && socket.connected) {
        socket.emit('compile', { code: code });
    } else {
        // Silent fail or minimal UI update if just typing
        // errorArea.textContent = 'Socket unconnected...';
    }
}

/**
 * Debounce wrapper for compilation
 */
function debouncedCompile() {
    if (compileTimeout) {
        clearTimeout(compileTimeout);
    }
    compileTimeout = setTimeout(compileCode, COMPILE_DELAY);
}

/**
 * Helper to try compiling without arguments
 */
function attemptCompile() {
    compileCode();
}

// --- Initialization Logic ---

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Socket
    initSocket();
    
    // 2. Register Change Listener with CodeMirrorAPI
    // This replaces the old 'input' event listener on the textarea
    CodeMirrorAPI.onChange(() => {
        debouncedCompile();
    });

    // 3. Listen for Manual Compile (Ctrl+Enter)
    // Dispatched from syntax-highlight.js
    document.addEventListener('manualCompile', () => {
        console.log('[Compile] Manual trigger');
        if (compileTimeout) clearTimeout(compileTimeout); // Cancel pending debounce
        compileCode(); // Run immediately
    });

    // 4. Initial Compile Check (Wait slightly for CodeMirror to init)
    setTimeout(() => {
        if (CodeMirrorAPI.getValue().trim()) {
            attemptCompile();
        }
    }, 500);
});

// Cleanup
window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.disconnect();
    }
});