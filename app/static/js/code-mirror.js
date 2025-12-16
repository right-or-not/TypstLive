// static/js/syntax-highlight.js
// Syntax Highlighting for Typst using CodeMirror

// Import Hint Module
import { setupTypstHint } from "./hint.js";

// Private Variable
let editorInstance = null;
let rawTextarea = null;
let _forceMathMode = false;


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

    // Setup Hint Logic
    setupTypstHint();

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
            "Cmd-Enter": () => dispatchCustomEvent('manualCompile'),
            "Ctrl-Space": "autocomplete"
        },
        hintOptions: {
            completeSingle: false,
            alignWithWord: true
        }
    });

    // Style and Sync
    editorInstance.setSize(null, "100%");

    // Input Listener for Auto-Hint
    editorInstance.on("inputRead", function(cm, change) {
        if (change.origin !== "+input") return;
        if (/^[a-zA-Z#]/.test(change.text[0])) {
            setTimeout(() => {
                if (!cm.state.completionActive) { 
                    cm.showHint({completeSingle: false});
                }
            }, 100);
        }
    });
    
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
        const keywords = /^(?:let|set|show|import|include|return|if|else|for|while|break|continue)\b/;
        const builtins = /^(?:heading|strong|emph|link|image|rect|block|page|text|par|align|grid|stack)\b/;
        const mathBuiltins = /^(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|sum|prod|int|sqrt|log|ln|lim|sup|inf|max|min|sin|cos|tan|cot|csc|sec|arcsin|arccos|arctan)\b/;

        return {
            startState: function() {
                return {
                    inComment: false,
                    inMath: _forceMathMode,
                    inString: false
                };
            },
            token: function(stream, state) {
                // 1. 处理块级注释 (优先级最高)
                if (state.inComment) {
                    if (stream.match(/\*\//)) { state.inComment = false; return "comment"; }
                    stream.next(); return "comment";
                }
                if (stream.match(/\/\*/)) { state.inComment = true; return "comment"; }

                // 2. 处理行内注释 (//)
                // 注意：在 URL 或字符串中不应该触发，这里做简单处理
                if (stream.match(/\/\/.*/)) return "comment";

                // 3. 处理字符串 (允许在数学模式中出现字符串)
                if (state.inString) {
                    if (stream.match('"')) { state.inString = false; return "string"; }
                    if (stream.match('\\"')) { return "string"; } // 转义引号
                    stream.next(); return "string";
                }
                if (stream.match('"')) { state.inString = true; return "string"; }

                // 4. --- 数学模式处理逻辑 ---
                if (state.inMath) {
                    // $: Out of MathType
                    if (stream.match('$')) {
                        state.inMath = false;
                        return "math-delimiter";
                    }

                    // #
                    if (stream.match(/#[a-zA-Z_][a-zA-Z0-9_]*/)) return "builtin";
                    // Math Operation (+, -, =, =>, ->, <, >, etc.)
                    if (stream.match(/^(?:=>|->|<-|!=|<=|>=|<<|>>|\.\.\.|\+|-|\*|\/|=|<|>|!|&|\||\^|~|_)/)) return "math-operator";
                    // Function or Character
                    if (stream.match(mathBuiltins)) return "math-builtin";
                    // Number
                    if (stream.match(/\b\d+(\.\d+)?\b/)) return "number";
                    // Normal variable
                    if (stream.match(/^[a-zA-Z][a-zA-Z0-9_]*/)) return "math-variable";
                    // ()
                    if (stream.match(/[\(\)\[\]\{\}]/)) return "bracket";

                    // Other Character
                    stream.next();
                    return null;
                }

                // 5. --- 普通文本模式处理逻辑 ---
                // $: Enter MathType
                if (stream.match('$')) {
                    state.inMath = true;
                    return "math-delimiter";
                }

                // Typst Tag with #
                if (stream.match(/^#[a-zA-Z_][a-zA-Z0-9_]*/)) return "builtin";
                // Typst Tag without #
                if (stream.match(keywords)) return "keyword";
                // \
                if (stream.match(/\\[^ \t\n]/)) return "keyword";
                // Number
                if (stream.match(/\b\d+(\.\d+)?(em|pt|mm|cm|in|fr|%)?\b/)) return "number";
                // Operator
                if (stream.match(/[\*\=\_\-\+\/<>!]/)) return "operator";
                // ()
                if (stream.match(/[\(\)\[\]\{\}]/)) return "bracket";

                stream.next();
                return null;
            }
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

/**
 * Force into MathType
 * @param {boolean} isMath 
 */
function setMathMode(isMath) {
    _forceMathMode = isMath;

    if (editorInstance) {
        editorInstance.setOption("mode", "typst");
    }
}

/**
 * Insert text at current cursor position
 * @param {string} text - The code to insert
 * @param {number} moveCursor - How many characters to move the Cursor BACK after insertion (default 0)
 */
function insertText(text, moveCursor = 0) {
    if (!editorInstance) return;
    const doc  = editorInstance.getDoc();
    const cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
    const endPosition = {
        line: cursor.line,
        ch: cursor.ch + text.length
    };
    const finalPosition = {
        line: endPosition.line,
        ch: endPosition.ch - moveCursor
    };
    doc.setCursor(finalPosition);
    editorInstance.focus();
}


// Export CodeMirrorAPI
export const CodeMirrorAPI = {
    init,
    getValue,
    setValue,
    focus: () => editorInstance?.focus(),
    onChange,
    isReady,
    setMathMode,
    insertText
};