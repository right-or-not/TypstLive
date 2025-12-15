// static/js/editor-hint.js

const TYPST_KEYWORDS = [
    // ------------------------------------------
    // 1. 基础关键字 (Basic Keywords)
    // ------------------------------------------
    "let", "set", "show", "import", "include", "return", 
    "if", "else", "for", "while", "break", "continue",
    "in", "not", "and", "or", 
    "content", "context", "none", "auto", "arguments",

    // ------------------------------------------
    // 2. 常用函数 (Common Functions)
    // ------------------------------------------
    "heading", "strong", "emph", "link", "image", "rect", "block", "page", 
    "text", "par", "align", "grid", "stack", "columns", "colbreak",
    "list", "enum", "table", "figure", "bibliography", "cite", "footnote",
    "h", "v", "box", "rotate", "scale", "move", "place", 
    "counter", "state", "query", "measure", "locate", "style", "layout",
    "numbering", "panic", "assert", "type", "repr", "str", "int", "float", "bool",
    "rgb", "cmyk", "luma", "color", "gradient", "pattern",
    "datetime", "duration", 

    // ------------------------------------------
    // 3. 数学函数 (Math Functions)
    // ------------------------------------------
    "sum", "prod", "int", "sqrt", "root", "log", "ln", "lim", 
    "sup", "inf", "max", "min", "floor", "ceil", "round", "abs", "norm",
    "sin", "cos", "tan", "cot", "csc", "sec", 
    "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh",
    "vec", "mat", "cases", "binom", "frac", "cancel",
    "op", "limits", "display", "inline", "script", "sscript",
    "upright", "italic", "bold", "serif", "sans", "mono", "cal", "frak", "bb",

    // ------------------------------------------
    // 4. 希腊字母 (Greek Letters)
    // ------------------------------------------
    "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", 
    "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", 
    "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega",
    // 变体 (Variants)
    "varepsilon", "vartheta", "varkappa", "varpi", "varrho", "varsigma", "varphi",

    // ------------------------------------------
    // 5. 通用符号 (General Symbols - Documentation)
    // ------------------------------------------
    
    // 箭头 (Arrows)
    "arrow", "arrows", "arrow.l", "arrow.r", "arrow.t", "arrow.b",
    "larr", "rarr", "tarr", "barr", "larrow", "rarrow",
    "leftrightarrow", "iff", "implies", "impliedby",
    "mapsto", "hook", "harpoon", "curve", "squiggly",
    
    // 关系与运算 (Relations & Operators)
    "plus", "minus", "times", "div", "dot", "cdot", "ast", "star",
    "eq", "neq", "approx", "sim", "simeq", "cong", "equiv",
    "lt", "gt", "leq", "geq", "ll", "gg", 
    "prec", "succ", "preceq", "succeq", 
    "subset", "supset", "subseteq", "supseteq", "in", "ni", "owns",
    "parallel", "perp", "prop", "propto", 
    "compose", "otimes", "oplus", "odot", "wedge", "vee", 
    "union", "sect", "cup", "cap", "setminus", 
    
    // 逻辑与集合 (Logic & Sets)
    "forall", "exists", "nexists", "empty", "emptyset", 
    "top", "bot", "neg", "angle", "measuredangle", "sphericalangle",
    "nabla", "partial", "infinity", "oo", "aleph", "beth", "gimel",
    "prime", "degree",
    
    // 标点与界定符 (Punctuation & Delimiters)
    "dots", "cdots", "ldots", "ddots", "vdots", 
    "colon", "comma", "semi", "bang", "quest",
    "bar", "vert", "parallel", "brace", "bracket", "paren",
    "langle", "rangle", "lceil", "rceil", "lfloor", "rfloor",
    
    // 其他常用符号 (Misc)
    "bullet", "circle", "square", "triangle", "diamond", "lozenge",
    "checkmark", "cross", "ballot", 
    "copyright", "registered", "trademark", "section", "paragraph", 
    "dagger", "ddager", "hash", "percent", "amp", "at", "backslash",
    "dollar", "euro", "pound", "yen", "won", "rupee"
];

/**
 * Register Typst Code Hint
 * after import CodeMirror
 */
export function setupTypstHint() {
    // 确保 CodeMirror 已加载
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
        // 如果当前是 # 号或者以 # 开头，去掉 # 再匹配
        if (searchWord.startsWith("#")) {
            searchWord = searchWord.slice(1);
        }

        // 1. 过滤
        let list = TYPST_KEYWORDS.filter(function(item) {
            // 前缀匹配 (Case Insensitive)
            return item.toLowerCase().indexOf(searchWord.toLowerCase()) === 0;
        });

        // 2. 排序优化：完全匹配 > 长度短 > 字母顺序
        list.sort((a, b) => {
            // a. 如果完全匹配 searchWord，排在最前
            const aIsExact = a.toLowerCase() === searchWord.toLowerCase();
            const bIsExact = b.toLowerCase() === searchWord.toLowerCase();
            if (aIsExact && !bIsExact) return -1;
            if (!aIsExact && bIsExact) return 1;

            // b. 长度越短越靠前 (如 in 排在 include 前)
            if (a.length !== b.length) {
                return a.length - b.length;
            }

            // c. 字母顺序
            return a.localeCompare(b);
        });

        return {
            list: list,
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
        };
    });
    
    console.log('[EditorHint] Typst hint helper registered (Module Mode).');
}