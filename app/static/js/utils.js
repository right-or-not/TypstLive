// static/js/utils.js

import { CodeMirrorAPI } from './code-mirror.js';
import { TOOLBOX_DATA } from './TOOLBOX_DATA_SOURCE.js';



/**
 * Show Flash Message
 * @param {string} message - Flash Content
 * @param {string} category - 'success', 'danger', 'info'
 */
export const showFlash = (message, category = 'info') => {
    const container = document.getElementById('flash-message');
    if (!container) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${category}`;
    alertDiv.textContent = message;

    container.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.5s forwards';
        alertDiv.addEventListener('animationend', () => {
            alertDiv.remove();
        });
    }, 3000);
};


/**
 * =================================================================
 * 1. Environment Controller
 * Manages environment switching (Passage/Inline/Interline), 
 * content storage, and placeholder updates.
 * =================================================================
 */
export const EnvironmentController = {
    storage: {
        'passage': '',
        'inline-formula': '',
        'interline-formula': ''
    },
    current: 'interline-formula',
    
    // DOM Elements
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
        this.updateUI(this.current);
        
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

        // Update PreviewArea Property
        if (this.elements.preview) {
            this.elements.preview.setAttribute('data-environment', env);
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
const ITEMS_PER_ROW = 3;
export const ToolboxController = {
    elements: {},
    activeGroupId: null,
    isInitialized: false,

    init() {
        this.elements = {
            wrapper: document.getElementById('main-wrapper'),
            closeBtn: document.getElementById('toolbox-close-btn'),
            openBtn: document.getElementById('toolbox-open-btn'),
            content: document.querySelector('.toolbox-content')
        };

        if (this.elements.closeBtn)
            this.elements.closeBtn.addEventListener('click', () => this.close());
        if (this.elements.openBtn) 
            this.elements.openBtn.addEventListener('click', () => this.open());
    },

    /**
     * Render Icon Content
     */
    renderIconContent(path, text, cssClass) {
        const fallbackIcon = `
            <svg class="${cssClass}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        `;

        if (path && path.trim() != '') {
            return `<img src="${path}" class="${cssClass}" alt="${text || 'icon'}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                    <span style="display:none; font-size: 1.2em;">${text || fallbackIcon}</span>`;
        }

        if (text && text.trim() != '') {
            return text;
        }

        return fallbackIcon;
    },

    /**
     * Render Group
     */
    renderGroups() {
        if (!this.elements.content) return;

        // Clear div
        this.elements.content.innerHTML = '';

        // Create Group button
        TOOLBOX_DATA.forEach((categoryData) => {
            // Render Category Title div
            const title = document.createElement('div');
            title.className = "toolbox-category-title";
            title.textContent = categoryData.category;
            this.elements.content.appendChild(title);

            // Create Group Grid div
            const grid = document.createElement('div');
            grid.className = 'toolbox-grid';
            this.elements.content.appendChild(grid);

            categoryData.groups.forEach((group, index) => {
                const groupBtn = document.createElement('div');
                groupBtn.className = 'toolbox-group-item';
                groupBtn.dataset.id = group.id;
                groupBtn.dataset.index = index;

                const iconHtml = this.renderIconContent(group.path, group.icon, 'toolbox-icon-img');

                groupBtn.innerHTML = `
                    <div class="toolbox-group-icon">${iconHtml}</div>
                    <div class="toolbox-group-name">${group.name}</div>
                `;

                // add Click Listener
                groupBtn.addEventListener('click', (e) => {
                    // taggle this Group
                    this.toggleGroup(group, index, grid);
                })

                grid.appendChild(groupBtn);
            })
        })
    },

    /**
     * Toggle Group
     */
    toggleGroup(group, index, gridContainer) {
        // active Group: close this detail panel
        if (this.activeGroupId === group.id) {
            this.closeDetailPanel();
            return;
        }

        // close old detail panel
        this.closeDetailPanel();

        // activate new detail panel
        const newActiveBtn = gridContainer.children[index];
        newActiveBtn.classList.add('active');
        this.activeGroupId = group.id;

        // insert detail panel
        const rowNumber = Math.floor(index / ITEMS_PER_ROW);
        const lastIndexInRow = Math.min(
            (rowNumber + 1) * ITEMS_PER_ROW - 1,
            gridContainer.children.length - 1
        );  // insert location
        const referenceNode = gridContainer.children[lastIndexInRow];
        // new panel
        const panel = this.createDetailPanel(group.items);
        // insert new panel
        if (referenceNode.nextSibling) gridContainer.insertBefore(panel, referenceNode.nextSibling);
        else gridContainer.appendChild(panel);
    },

    /**
     * Close Detail Panel
     */
    closeDetailPanel() {
        // Remove DOM
        const existingPanel = document.querySelector('.toolbox-detail-panel');
        if (existingPanel) existingPanel.remove();

        // Remove activate style
        const activeBtns = document.querySelectorAll('.toolbox-group-item.active');
        activeBtns.forEach(btn => btn.classList.remove('active'));

        // reset activeGroupId
        this.activeGroupId = null;
    },


    /**
     * Create Detail Panel
     */
    createDetailPanel(items) {
        const panel = document.createElement('div');
        panel.className = 'toolbox-detail-panel';

        // search longest items.code
        let maxCodeLength = 0;
        items.forEach(item => {
            if (item.code && item.code.length > maxCodeLength)
                maxCodeLength = item.code.length;
        });

        // select style according to maxCodeLength
        if (maxCodeLength <= 4) 
            panel.classList.add('panel-cols-six');
        else if (maxCodeLength <= 8)
            panel.classList.add('panel-cols-four');
        else if (maxCodeLength <= 24)
            panel.classList.add('panel-cols-three');
        else
            panel.classList.add('panel-cols-two');

        items.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'toolbox-tool-btn';
            btn.title = item.desc || item.code;
            const displayHtml = this.renderIconContent(item.path, item.display, 'toolbox-icon-img');
            btn.innerHTML = `
                <div class="tool-display">${displayHtml}</div>
                <div class="tool-code">${item.code}</div>
            `;

            // add Click Listener
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (CodeMirrorAPI && typeof CodeMirrorAPI.insertText === 'function') {
                    const codeToInsert = item.code + " ";
                    const moveOffset = item.move || 0;
                    CodeMirrorAPI.insertText(codeToInsert, moveOffset);
                } else {
                    console.error("CodeMirrorAPI.insertText is not available")
                }
                
            })

            panel.appendChild(btn);
        });

        return panel;
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
        if (!this.isInitialized) {
            console.log("[Toolbox] Lazy loading content...");
            this.renderGroups();
            this.isInitialized = true;
        }
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
export const ActionController = {
    init() {
        const transformBtn = document.getElementById('transform-btn');
        const likeBtn = document.getElementById('like-btn');
        const clearBtn = document.getElementById('clear-btn');
        const copyBtn = document.getElementById('copy-btn');

        // Transform Button Login
        if (transformBtn) {
            transformBtn.setAttribute('title', 'Copy LaTeX Code');
            transformBtn.addEventListener('click', () => {
                // TODO
                showFlash("LaTeX transform feature is under development!", "info");
            })
        }

        // Like Button Logic
        if (likeBtn) {
            likeBtn.setAttribute('title', 'Save to favorites (Ctrl+L)');
            likeBtn.addEventListener('click', async function() {
                const code = CodeMirrorAPI.getValue();
                const env = EnvironmentController.current;
                this.style.transform = 'scale(1.2)';
                setTimeout(() => { this.style.transform = ''; }, 200);
                try {
                    const response = await fetch('/api/like', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            code: code,
                            env: env
                        })
                    });
                    const data = await response.json();
                    showFlash(data.message, data.category);
                } catch (error) {
                    console.log("Error: ", error);
                    showFlash("Network Error: Cannot Connect to Server!", "danger");
                }
            });
        }

        // Clear Button Logic
        if (clearBtn) {
            clearBtn.setAttribute('title', 'Clear editor (Ctrl+K)');
            clearBtn.addEventListener('click', () => this.handleClear());
        }

        // Copy Button Logic
        if (copyBtn) {
            copyBtn.setAttribute('title', 'Copy Typst Code (Ctrl+C)');
            copyBtn.addEventListener('click', () => {
                const code = CodeMirrorAPI.getValue();

                // blank
                if (!code) {
                    showFlash("Nothing to Copy!", "danger");
                    return;
                }

                // Use Clipboard API
                navigator.clipboard.writeText(code).then(() => {
                    showFlash("Code Copied to Clipboard!", "success");
                    
                    // shock
                    // copyBtn.style.transform = 'scale(1.1)';
                    // setTimeout(() => { copyBtn.style.transform = ''; }, 200);
                    
                    // Show Copy Successfully
                    const originalTitle = copyBtn.getAttribute('title');
                    copyBtn.setAttribute('title', 'Copied!');
                    setTimeout(() => copyBtn.setAttribute('title', originalTitle), 1500);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    showFlash("Failed to Copy Code! Please Try Again!", "danger");
                });
            })
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
            showFlash("Editor cleared!", "success");
        }
    }
};

/**
 * =================================================================
 * 4. UI Controller
 * Handles Tooltips, ResizeObservers, etc.
 * =================================================================
 */
export const UIController = {
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