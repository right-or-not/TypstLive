// static/js/editor.js

import { CodeMirrorAPI } from './syntax-highlight.js';

/**
 * =================================================================
 * 1. Environment Controller
 * Manages environment switching (Passage/Inline/Interline), 
 * content storage, and placeholder updates.
 * =================================================================
 */
const EnvironmentController = {
    storage: {
        'passage': '',
        'inline-formula': '',
        'interline-formula': ''
    },
    current: 'inline-formula',
    
    // DOM Elements (Lazy loaded in init)
    elements: {},

    init() {
        // Cache DOM elements
        this.elements = {
            textarea: document.getElementById('typst-code'),
            preview: document.getElementById('preview-area'),
            error: document.getElementById('error-area'),
            buttons: {
                passage: document.getElementById('passage-btn'),
                inline: document.getElementById('inline-formula-btn'),
                interline: document.getElementById('interline-formula-btn')
            }
        };

        // Bind Events
        if (this.elements.buttons.passage) 
            this.elements.buttons.passage.addEventListener('click', () => this.switch('passage'));
        if (this.elements.buttons.inline) 
            this.elements.buttons.inline.addEventListener('click', () => this.switch('inline-formula'));
        if (this.elements.buttons.interline) 
            this.elements.buttons.interline.addEventListener('click', () => this.switch('interline-formula'));

        // Setup Realtime Storage Listener
        CodeMirrorAPI.onChange((newValue) => {
            this.storage[this.current] = newValue;
        });

        // Initial State Setup
        if (this.elements.buttons.inline) {
            this.elements.buttons.inline.classList.add('active');
        }
        
        // Restore content if exists
        if (this.storage[this.current]) {
            CodeMirrorAPI.setValue(this.storage[this.current]);
        }
        
        // Set Initial Math Mode
        this.updateMathMode();
    },

    switch(newEnv) {
        // 1. Save old content
        const currentContent = CodeMirrorAPI.getValue();
        this.storage[this.current] = currentContent;
        console.log(`[Env] Saved content for ${this.current}`);

        // 2. Switch Context
        const oldEnv = this.current;
        this.current = newEnv;

        // 3. Update Math Mode Configuration
        this.updateMathMode();

        // 4. Update UI (Buttons & Placeholders)
        this.updateUI(newEnv);

        // 5. Load new content
        const contentToLoad = this.storage[newEnv] || '';
        CodeMirrorAPI.setValue(contentToLoad);
        CodeMirrorAPI.focus();

        // 6. Reset Preview
        this.resetPreview();

        console.log(`[Env] Switched from ${oldEnv} to ${this.current}`);
    },

    updateMathMode() {
        const isMathMode = (this.current === 'inline-formula' || this.current === 'interline-formula');
        CodeMirrorAPI.setMathMode(isMathMode);
    },

    updateUI(env) {
        // Update Buttons
        document.querySelectorAll('.environment-select button').forEach(btn => btn.classList.remove('active'));
        
        // Map env string to button element key
        const keyMap = {
            'passage': 'passage',
            'inline-formula': 'inline',
            'interline-formula': 'interline'
        };
        const activeBtn = this.elements.buttons[keyMap[env]];
        if (activeBtn) activeBtn.classList.add('active');

        // Update Placeholder
        if (this.elements.textarea) {
            const placeholders = {
                'passage': 'Input Typst passage code Here',
                'inline-formula': 'Input Typst inline formula Here',
                'interline-formula': 'Input Typst display formula Here'
            };
            this.elements.textarea.placeholder = placeholders[env] || '';
        }
    },

    resetPreview() {
        if (this.elements.preview) this.elements.preview.innerHTML = '<p style="color: #666;">Output will be Shown Here!</p>';
        if (this.elements.error) this.elements.error.textContent = '';
    },

    clearCurrent() {
        CodeMirrorAPI.setValue('');
        CodeMirrorAPI.focus();
        this.storage[this.current] = '';
        this.resetPreview();
    }
};

/**
 * =================================================================
 * 2. Toolbox Controller
 * Handles the sidebar opening, closing, and animation logic.
 * =================================================================
 */
const ToolboxController = {
    elements: {},

    init() {
        this.elements = {
            wrapper: document.getElementById('main-wrapper'),
            closeBtn: document.getElementById('toolbox-close-btn'),
            openBtn: document.getElementById('toolbox-open-btn')
        };

        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.close());
        }
        if (this.elements.openBtn) {
            this.elements.openBtn.addEventListener('click', () => this.open());
        }

        // Initialize default state (Closed as per your previous code)
        this.close(); 
    },

    close() {
        this.elements.wrapper.classList.add('toolbox-closed');
        
        // Delay showing the open button
        setTimeout(() => {
            this.elements.openBtn.style.display = 'flex';
        }, 300);

        // Force resize update for CodeMirror
        this.triggerResize();
    },

    open() {
        this.elements.openBtn.style.display = 'none';
        this.elements.wrapper.classList.remove('toolbox-closed');
        this.triggerResize();
    },

    triggerResize() {
        setTimeout(() => {
            // Trigger a window resize event to force CodeMirror/Flexbox recalculations if needed
            window.dispatchEvent(new Event('resize'));
        }, 400);
    }
};

/**
 * =================================================================
 * 3. Action Controller
 * Handles specific buttons (Like, Clear) and global shortcuts.
 * =================================================================
 */
const ActionController = {
    init() {
        const likeBtn = document.getElementById('like-btn');
        const clearBtn = document.getElementById('clear-btn');

        // Like Button Logic
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                console.log('Like button clicked');
                this.style.transform = 'scale(1.2)';
                setTimeout(() => { this.style.transform = ''; }, 200);
            });
            likeBtn.setAttribute('title', 'Save to favorites (Ctrl+L)');
        }

        // Clear Button Logic
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClear());
            clearBtn.setAttribute('title', 'Clear editor (Ctrl+K)');
        }

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.handleClear();
            }
        });
    },

    handleClear() {
        if (confirm('Clear Current Environment Content?')) {
            EnvironmentController.clearCurrent();
        }
    }
};

/**
 * =================================================================
 * 4. UI Controller
 * Handles Tooltips, ResizeObservers, etc.
 * =================================================================
 */
const UIController = {
    init() {
        this.initTooltips();
        this.initResizeObserver();
    },

    initTooltips() {
        // Set titles for environment buttons
        const tooltips = {
            'passage-btn': 'Passage mode',
            'inline-formula-btn': 'Inline formula mode',
            'interline-formula-btn': 'Display formula mode'
        };
        
        for (const [id, text] of Object.entries(tooltips)) {
            const el = document.getElementById(id);
            if (el) el.setAttribute('title', text);
        }
    },

    initResizeObserver() {
        const previewArea = document.getElementById('preview-area');
        if (previewArea) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const content = entry.target;
                    // Logic for scroll handling if needed
                }
            });
            resizeObserver.observe(previewArea);
        }
    }
};


/**
 * =================================================================
 * MAIN ENTRY POINT
 * =================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Editor] Initializing...');

    // 1. Initialize CodeMirror Core
    CodeMirrorAPI.init('typst-code');

    // 2. Initialize Controllers
    EnvironmentController.init();
    ToolboxController.init();
    ActionController.init();
    UIController.init();
    
    console.log('[Editor] Initialization Complete.');
});


// --- Public API Export ---
// Useful for other modules to access editor state
export const EditorAPI = {
    getCurrentEnvironment: () => EnvironmentController.current,
    getCurrentCode: () => CodeMirrorAPI.getValue()
};

window.EditorAPI = EditorAPI;