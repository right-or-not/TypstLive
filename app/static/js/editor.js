// static/js/editor.js
// Editor functionality for TypstLive

// Import CodeMirror API
import { CodeMirrorAPI } from './syntax-highlight.js';

// Environment storage
const environmentStorage = {
    'passage': '',
    'inline-formula': '',
    'interline-formula': ''
};

let currentEnvironment = 'inline-formula';

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Initialize CodeMirror ---
    // This replaces the old auto-init in syntax-highlight.js
    CodeMirrorAPI.init('typst-code');

    // Get DOM elements
    const typstCodeTextarea = document.getElementById('typst-code'); // Still needed for placeholder manipulation
    const previewArea = document.getElementById('preview-area');
    const errorArea = document.getElementById('error-area');
    
    // Buttons
    const passageBtn = document.getElementById('passage-btn');
    const inlineFormulaBtn = document.getElementById('inline-formula-btn');
    const interlineFormulaBtn = document.getElementById('interline-formula-btn');
    const likeBtn = document.getElementById('like-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Initialize: Set default active environment
    if (inlineFormulaBtn) {
        inlineFormulaBtn.classList.add('active');
    }

    // --- Realtime Storage ---
    // Replaces: window.typstEditor.on('change', ...)
    CodeMirrorAPI.onChange((newValue) => {
        environmentStorage[currentEnvironment] = newValue;
    });

    
    // Environment selection logic
    function setEnvironment(env, button) {
        // 1. Save content of OLD environment
        // Replaces: window.typstEditor.getValue()
        const currentContent = CodeMirrorAPI.getValue();
        environmentStorage[currentEnvironment] = currentContent;
        
        console.log(`[setEnvironment] Save content for ${currentEnvironment}`);

        // 2. Switch Context
        const oldEnvironment = currentEnvironment;
        currentEnvironment = env;

        // set Math Environment
        const isMathMode = (env === 'inline-formula' || env === 'interline-formula');
        CodeMirrorAPI.setMathMode(isMathMode);
        
        // Update UI buttons
        document.querySelectorAll('.environment-select button').forEach(btn => btn.classList.remove('active'));
        if (button) button.classList.add('active');

        // 3. Load content of NEW environment
        const newContent = environmentStorage[env] || '';
        CodeMirrorAPI.setValue(newContent);
        CodeMirrorAPI.focus();

        console.log(`[setEnvironment] Switched from ${oldEnvironment} to ${currentEnvironment}`);
        
        // Update placeholders (Direct DOM manipulation is fine for attributes)
        if (typstCodeTextarea) {
            switch(env) {
                case 'passage':
                    typstCodeTextarea.placeholder = 'Input Typst passage code Here';
                    break;
                case 'inline-formula':
                    typstCodeTextarea.placeholder = 'Input Typst inline formula Here';
                    break;
                case 'interline-formula':
                    typstCodeTextarea.placeholder = 'Input Typst display formula Here';
                    break;
            }
        }

        // Clear preview
        if (previewArea) previewArea.innerHTML = '<p style="color: #666;">Output will be Shown Here!</p>';
        if (errorArea) errorArea.textContent = '';
    }
    
    // Event Listeners for Environment Buttons
    if (passageBtn) passageBtn.addEventListener('click', function() { setEnvironment('passage', this); });
    if (inlineFormulaBtn) inlineFormulaBtn.addEventListener('click', function() { setEnvironment('inline-formula', this); });
    if (interlineFormulaBtn) interlineFormulaBtn.addEventListener('click', function() { setEnvironment('interline-formula', this); });
    
    // Like button
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            console.log('Like button clicked');
            this.style.transform = 'scale(1.2)';
            setTimeout(() => { this.style.transform = ''; }, 200);
        });
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear Current Environment Content?')) {
                // Replaces: window.typstEditor.setValue('')
                CodeMirrorAPI.setValue('');
                CodeMirrorAPI.focus();
                
                environmentStorage[currentEnvironment] = '';
                if (previewArea) previewArea.innerHTML = '<p style="color: #666;">Output will be Shown Here!</p>';
                if (errorArea) errorArea.textContent = '';
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter is handled inside syntax-highlight.js extraKeys, 
        // but we keep this for global capture if focus is outside editor
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            // Check if focus is NOT in editor to avoid double firing
            // (Optional logic, usually CustomEvent is robust enough)
        }
        
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            clearBtn.click();
        }
    });

    // Initial Load Logic: Restore content if exists (e.g. page refresh)
    if (environmentStorage[currentEnvironment]) {
        CodeMirrorAPI.setValue(environmentStorage[currentEnvironment]);
    }

    if (currentEnvironment === 'inline-formula' || currentEnvironment === 'interline-formula') {
        CodeMirrorAPI.setMathMode(true);
    }
    
    // Add Tooltips
    likeBtn.setAttribute('title', 'Save to favorites (Ctrl+L)');
    clearBtn.setAttribute('title', 'Clear editor (Ctrl+K)');
    passageBtn.setAttribute('title', 'Passage mode');
    inlineFormulaBtn.setAttribute('title', 'Inline formula mode');
    interlineFormulaBtn.setAttribute('title', 'Display formula mode');

    // Auto-resize preview area
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const content = entry.target;
            if (content.scrollWidth > content.clientWidth) {
                // Handle overflow if needed
            }
        }
    });
    if (previewArea) resizeObserver.observe(previewArea);
});

// --- Public API Export (Optional) --- //

/** 
 * Get current environment
 */
function getCurrentEnvironment() {
    return currentEnvironment;
}

/**
 * Get current code
 */
function getCurrentCode() {
    return CodeMirrorAPI.getValue();
}


// Export EditorAPI
export const EditorAPI = {
    getCurrentEnvironment,
    getCurrentCode
};

// Export to windows
window.EditorAPI = EditorAPI;