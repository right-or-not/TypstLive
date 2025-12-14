// static/js/syntax-highlight.js
// Advanced Syntax Highlighting for Typst using CodeMirror

// Private Variable
let editorInstance = null;
let rawTextarea = null;


/**
 * Initialize CodeMirror logic
 * @param {string} textareaId - The ID of the textarea to replace
 */
function init(textareaId) {
    rawTextarea = document.getElementById(textareaId);
    if (!rawTextarea) return;

    // Check if CodeMirror lib is loaded (Global object from CDN)
    if (typeof CodeMirror === 'undefined') {
        console.warn('CodeMirror library not loaded, falling back to plain textarea.');
        return;
    }

    // Define Typst Mode
    defineTypstMode();

    // Create Instance
    editorInstance = CodeMirror.fromTextArea(rawTextarea, {
        mode: "typst",
        lineNumbers: true,
        lineWrapping: true,
        theme: "default",
        tabSize: 2,
        indentUnit: 2,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
            "Ctrl-Enter": () => dispatchCustomEvent('manualCompile'),
            "Cmd-Enter": () => dispatchCustomEvent('manualCompile')
        }
    });

    // Style and Sync
    editorInstance.setSize(null, "100%");
    
    // Sync changes back to raw textarea for form compatibility
    editorInstance.on('change', (cm) => {
        rawTextarea.value = cm.getValue();
        // Dispatch input event for listeners on the original textarea
        rawTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    // Wrapper styling
    const wrapper = editorInstance.getWrapperElement();
    wrapper.style.height = '100%';
    wrapper.style.border = '1px solid #d0d7de';
    wrapper.style.borderRadius = '6px';
    wrapper.style.fontFamily = "'Monaco', 'Menlo', 'Consolas', monospace";

    console.log('[CodeMirrorAPI] Initialized successfully');
}

/**
 * Helper to dispatch events
 */
function dispatchCustomEvent(eventName) {
    document.dispatchEvent(new CustomEvent(eventName));
}

/**
 * Define the syntax highlighting rules
 */
function defineTypstMode() {
    CodeMirror.defineMode("typst", function() {
        return {
            token: function(stream, state) {
                // Math mode ($...$)
                if (stream.match(/\$[^\$]*\$/)) return "string math";
                // Comments
                if (stream.match(/\/\/.*/)) return "comment";
                // Block comments
                if (stream.match(/\/\*/)) { state.inComment = true; return "comment"; }
                if (state.inComment) {
                    if (stream.match(/\*\//)) { state.inComment = false; return "comment"; }
                    stream.next(); return "comment";
                }
                // Keywords/Functions
                if (stream.match(/\\[a-zA-Z]+/)) return "keyword";
                if (stream.match(/#[a-zA-Z_][a-zA-Z0-9_]*/)) return "builtin";
                // Numbers & Units
                if (stream.match(/\b\d+(\.\d+)?(em|pt|mm|cm|in)?\b/)) return "number";
                // Operators
                if (stream.match(/[\+\-\*\/\=\<\>\^\_]/)) return "operator";
                // Brackets
                if (stream.match(/[\(\)\[\]\{\}]/)) return "bracket";
                
                stream.next();
                return null;
            },
            startState: function() { return { inComment: false }; }
        };
    });
}

// --- Public API Implementation ---

function getValue() {
    if (editorInstance) return editorInstance.getValue();
    return rawTextarea ? rawTextarea.value : '';
}

function setValue(content) {
    if (editorInstance) {
        editorInstance.setValue(content || '');
        // When setting value programmatically, usually we want to clear history or just refresh
        editorInstance.refresh(); 
    } else if (rawTextarea) {
        rawTextarea.value = content || '';
    }
}

function focus() {
    if (editorInstance) {
        editorInstance.focus();
    } else if (rawTextarea) {
        rawTextarea.focus();
    }
}

/**
 * Register a change listener
 * @param {Function} callback - function(newValue)
 */
function onChange(callback) {
    if (editorInstance) {
        editorInstance.on('change', (cm) => {
            callback(cm.getValue());
        });
    } else if (rawTextarea) {
        rawTextarea.addEventListener('input', (e) => {
            callback(e.target.value);
        });
    }
}

function isReady() {
    return !!editorInstance;
}

// Export CodeMirrorAPI
export const CodeMirrorAPI = {
    init,
    getValue,
    setValue,
    focus,
    onChange,
    isReady
};