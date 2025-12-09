// Editor functionality for TypstLive

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const typstCodeTextarea = document.getElementById('typst-code');
    const previewArea = document.getElementById('preview-area');
    const errorArea = document.getElementById('error-area');
    
    // Environment buttons
    const passageBtn = document.getElementById('passage-btn');
    const inlineFormulaBtn = document.getElementById('inline-formula-btn');
    const interlineFormulaBtn = document.getElementById('interline-formula-btn');
    
    // Action buttons
    const likeBtn = document.getElementById('like-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Current environment state
    let currentEnvironment = 'inline-formula';
    
    // Initialize: Set default active environment
    if (inlineFormulaBtn) {
        inlineFormulaBtn.classList.add('active');
    }
    
    // Environment selection handlers
    function setEnvironment(env, button) {
        currentEnvironment = env;
        
        // Remove active class from all buttons
        document.querySelectorAll('.environment-select button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        if (button) {
            button.classList.add('active');
        }
        
        // Update textarea placeholder based on environment
        switch(env) {
            case 'passage':
                typstCodeTextarea.placeholder = 'Input Typst passage code...';
                break;
            case 'inline-formula':
                typstCodeTextarea.placeholder = 'Input Typst inline formula, like: $x^2 + y^2 = z^2$';
                break;
            case 'interline-formula':
                typstCodeTextarea.placeholder = 'Input Typst display formula, like: $ sum_(k=1)^n k $';
                break;
        }
    }
    
    // Add event listeners for environment buttons
    if (passageBtn) {
        passageBtn.addEventListener('click', function() {
            setEnvironment('passage', this);
        });
    }
    
    if (inlineFormulaBtn) {
        inlineFormulaBtn.addEventListener('click', function() {
            setEnvironment('inline-formula', this);
        });
    }
    
    if (interlineFormulaBtn) {
        interlineFormulaBtn.addEventListener('click', function() {
            setEnvironment('interline-formula', this);
        });
    }
    
    // Like button handler
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            // TODO: Implement like functionality
            // This could save the current code to favorites
            console.log('Like button clicked');
            
            // Visual feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // You can add your like logic here
            // For example: save to localStorage or send to server
        });
    }
    
    // Clear button handler
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear all content?')) {
                typstCodeTextarea.value = '';
                previewArea.innerHTML = '<p style="color: #666;">公式预览将显示在这里...</p>';
                errorArea.textContent = '';
                typstCodeTextarea.focus();
            }
        });
    }
    
    // Add keyboard shortcut support
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to compile
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            // Trigger compile event (if you have compile.js)
            const event = new CustomEvent('manualCompile');
            document.dispatchEvent(event);
        }
        
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            clearBtn.click();
        }
    });
    
    // Basic syntax highlighting for Typst (simple version)
    // This is a basic implementation - for full highlighting, consider using CodeMirror or Monaco
    function addBasicHighlighting() {
        // This is placeholder - actual syntax highlighting would require
        // a more sophisticated approach using CodeMirror or Monaco Editor
        
        // For now, we rely on the monospace font and good contrast
        typstCodeTextarea.addEventListener('input', function() {
            // You could add character counting, line numbers, etc here
        });
    }
    
    addBasicHighlighting();
    
    // Auto-resize preview area when content loads
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            // Handle preview content size changes
            const content = entry.target;
            if (content.scrollWidth > content.clientWidth) {
                // Content is wider than container - scrollbar will appear
                console.log('Horizontal scroll enabled');
            }
        }
    });
    
    if (previewArea) {
        resizeObserver.observe(previewArea);
    }
    
    // Add tooltip functionality for buttons
    function addTooltips() {
        likeBtn.setAttribute('title', 'Save to favorites (Ctrl+L)');
        clearBtn.setAttribute('title', 'Clear editor (Ctrl+K)');
        passageBtn.setAttribute('title', 'Passage mode');
        inlineFormulaBtn.setAttribute('title', 'Inline formula mode');
        interlineFormulaBtn.setAttribute('title', 'Display formula mode');
    }
    
    addTooltips();
});

// Export environment state for use by compile.js
function getCurrentEnvironment() {
    const activeBtn = document.querySelector('.environment-select button.active');
    if (activeBtn) {
        if (activeBtn.id === 'passage-btn') return 'passage';
        if (activeBtn.id === 'inline-formula-btn') return 'inline-formula';
        if (activeBtn.id === 'interline-formula-btn') return 'interline-formula';
    }
    return 'inline-formula'; // default
}