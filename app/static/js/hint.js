// static/js/hint.js

// 1. Define Keywords database
const TYPST_KEYWORDS = [
    // 基础关键字
    "let", "set", "show", "import", "include", "return", "if", "else", "for", "while", "break", "continue",
    "content", "context", "none", "auto",

    // 常用函数
    "heading", "strong", "emph", "link", "image", "rect", "block", "page", 
    "text", "par", "align", "grid", "stack", "columns", "colbreak",
    "list", "enum", "table", "figure", "bibliography", "cite", "footnote",
    "h", "v", "box", "rotate", "scale", "move",
    
    // 数学符号
    "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa",
    "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega",
    "sum", "prod", "int", "sqrt", "log", "ln", "lim", "sup", "inf", "max", "min",
    "sin", "cos", "tan", "cot", "csc", "sec", "arcsin", "arccos", "arctan",
    "vec", "mat", "cases", "binom", "frac", "abs", "norm"
];

/**
 * Register Typst code hint
 * [Important] inport after CodeMirror
 * [Export] setupTypstHint Module
 */
export function setupTypstHint() {
    // Check CodeMirror 
    if (typeof CodeMirror === 'undefined') {
        console.warn('CodeMirror not loaded, skipping hint registration.');
        return;
    }

    CodeMirror.registerHelper("hint", "typst", function(editor) {
        const cur = editor.getCursor();
        const token = editor.getTokenAt(cur);
        
        const start = token.start;
        const end = cur.ch;
        const currentWord = token.string.slice(0, end - start);
        
        let searchWord = currentWord;
        if (searchWord.startsWith("#")) {
            searchWord = searchWord.slice(1);
        }

        const list = TYPST_KEYWORDS.filter(function(item) {
            return item.toLowerCase().indexOf(searchWord.toLowerCase()) === 0;
        });

        return {
            list: list,
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
        };
    });
    
    console.log('[EditorHint] Typst hint helper registered.');
}