// Advanced Syntax Highlighting for Typst using CodeMirror

document.addEventListener('DOMContentLoaded', function() {
    // Check if CodeMirror is available
    if (typeof CodeMirror === 'undefined') {
        console.log('CodeMirror not loaded - using plain textarea');
        return;
    }
    
    const textarea = document.getElementById('typst-code');
    if (!textarea) return;
    
    // Define Typst syntax highlighting mode
    CodeMirror.defineMode("typst", function() {
        return {
            token: function(stream, state) {
                // Math mode ($...$)
                if (stream.match(/\$[^\$]*\$/)) {
                    return "string math";
                }
                
                // Comments
                if (stream.match(/\/\/.*/)) {
                    return "comment";
                }
                
                // Block comments
                if (stream.match(/\/\*/)) {
                    state.inComment = true;
                    return "comment";
                }
                if (state.inComment) {
                    if (stream.match(/\*\//)) {
                        state.inComment = false;
                        return "comment";
                    }
                    stream.next();
                    return "comment";
                }
                
                // Functions and commands
                if (stream.match(/\\[a-zA-Z]+/)) {
                    return "keyword";
                }
                
                // Typst functions (#...)
                if (stream.match(/#[a-zA-Z_][a-zA-Z0-9_]*/)) {
                    return "builtin";
                }
                
                // Numbers
                if (stream.match(/\b\d+(\.\d+)?(em|pt|mm|cm|in)?\b/)) {
                    return "number";
                }
                
                // Operators in math
                if (stream.match(/[\+\-\*\/\=\<\>\^\_]/)) {
                    return "operator";
                }
                
                // Brackets
                if (stream.match(/[\(\)\[\]\{\}]/)) {
                    return "bracket";
                }
                
                stream.next();
                return null;
            },
            startState: function() {
                return { inComment: false };
            }
        };
    });
    
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(textarea, {
        mode: "typst",
        lineNumbers: true,
        lineWrapping: true,
        theme: "default",
        tabSize: 2,
        indentUnit: 2,
        indentWithTabs: false,
        electricChars: true,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
            "Ctrl-Enter": function(cm) {
                // Trigger compile
                const event = new CustomEvent('manualCompile');
                document.dispatchEvent(event);
            },
            "Cmd-Enter": function(cm) {
                // Trigger compile for Mac
                const event = new CustomEvent('manualCompile');
                document.dispatchEvent(event);
            }
        }
    });
    
    // Apply custom styling to CodeMirror
    editor.setSize(null, "100%");
    
    // Sync CodeMirror content back to textarea
    editor.on('change', function(cm) {
        textarea.value = cm.getValue();
        // Trigger input event for other listeners
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    });
    
    // Store editor instance globally for access from other scripts
    window.typstEditor = editor;
    
    // Update CodeMirror styling
    const cmWrapper = editor.getWrapperElement();
    cmWrapper.style.height = '100%';
    cmWrapper.style.border = '1px solid #d0d7de';
    cmWrapper.style.borderRadius = '6px';
    cmWrapper.style.fontSize = '14px';
    cmWrapper.style.fontFamily = "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace";
    
    // Focus on editor
    editor.focus();
});

// Helper function to get editor content (works with or without CodeMirror)
function getEditorContent() {
    if (window.typstEditor) {
        return window.typstEditor.getValue();
    }
    const textarea = document.getElementById('typst-code');
    return textarea ? textarea.value : '';
}

// Helper function to set editor content (works with or without CodeMirror)
function setEditorContent(content) {
    if (window.typstEditor) {
        window.typstEditor.setValue(content);
    } else {
        const textarea = document.getElementById('typst-code');
        if (textarea) {
            textarea.value = content;
        }
    }
}