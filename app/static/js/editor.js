// Editor functionality for TypstLive

// Environment storage
const environmentStorage = {
    'passage': '',
    'inline-formula': '',
    'interline-formula': ''
};

let currentEnvironment = 'inline-formula';

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
    
    // Initialize: Set default active environment
    if (inlineFormulaBtn) {
        inlineFormulaBtn.classList.add('active');
    }
    
    // Environment selection handlers
    function setEnvironment(env, button) {
        // Store content of current environment
        if (currentEnvironment && typstCodeTextarea) {
            const currentContent = window.typstEditor ? window.typstEditor.getValue() : typstCodeTextarea.value;
            environmentStorage[currentEnvironment] = currentContent;
            console.log(`[setEnvironment] Save the content in ${currentEnvironment}`)
            console.log('environmentStorage: ', environmentStorage);
        }

        // change to new environment
        let oldEnvironment = currentEnvironment;
        currentEnvironment = env;
        
        // Remove active class from all buttons
        document.querySelectorAll('.environment-select button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        if (button) {
            button.classList.add('active');
        }

        // add the content of new environment
        const newContent = environmentStorage[env] || '';
        if (window.typstEditor) {
            window.typstEditor.setValue(newContent);
        }
        if (typstCodeTextarea) {
            typstCodeTextarea.value = newContent;
        }
        console.log(`[setEnvironment] Add the content in Environment ${currentEnvironment}`)
        
        // Update textarea placeholder based on environment
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

        // clear the preview area
        if (previewArea) {
            previewArea.innerHTML = '<p style="color: #666;">Output will be Shown Here!</p>'
        }
        if (errorArea) {
            errorArea.textContent = '';
        }

        console.log(`[setEnvironment] Environment change from ${oldEnvironment} to ${currentEnvironment}`)
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
            if (confirm('Clear Current Environment Content?')) {
                if (window.typstEditor) {
                    window.typstEditor.setValue(''),
                    window.typstEditor.focus();
                } 
                if (typstCodeTextarea) {
                    typstCodeTextarea.value = '';
                    typstCodeTextarea.focus();
                }
                environmentStorage[currentEnvironment] = '';
                previewArea.innerHTML = '<p style="color: #666;">Output will be Shown Here!</p>';
                errorArea.textContent = '';
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

    // store the input realtime
    if (window.typstEditor) {
        window.typstEditor.on('change', function(cm) {
            environmentStorage[currentEnvironment] = cm.getValue();
        });
    }
    if (typstCodeTextarea) {
        typstCodeTextarea.addEventListener('input', function() {
            environmentStorage[currentEnvironment] = this.value;
        });
    }

    // search the content of current environment
    if (environmentStorage[currentEnvironment]) {
        if (window.typstEditor) {
            window.typstEditor.setValue(environmentStorage[currentEnvironment]);
        } 
        if (typstCodeTextarea) {
            typstCodeTextarea.value = environmentStorage[currentEnvironment];
        }
    }
    
    /** 
     * Basic syntax highlighting for Typst
     * Now replaced by syntax-highlight.js & syntax-highlight.css
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
    */
    
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

/** 
 * get current environment state
 * @returns {string} 'passage', 'inline-formula', 'interline-formula'
*/
function getCurrentEnvironment() {
    const activeBtn = document.querySelector('.environment-select button.active');
    if (activeBtn) {
        if (activeBtn.id === 'passage-btn') return 'passage';
        if (activeBtn.id === 'inline-formula-btn') return 'inline-formula';
        if (activeBtn.id === 'interline-formula-btn') return 'interline-formula';
    }
    return 'inline-formula'; // default
}

/**
 * get current code content
 * @returns {string} code in current environment
 */
function getCurrentCode() {
    const typstCodeTextarea = document.getElementById('typst-code');
    return typstCodeTextarea ? typstCodeTextarea.value : '';
}


// Export Editor API
window.EditorAPI = {
    getCurrentEnvironment: getCurrentEnvironment,
    getCurrentCode: getCurrentCode
};
