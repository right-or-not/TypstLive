// app/static/js/TYPST_KEYWORDS.js

export const TYPST_KEYWORDS = [
    // ==========================================
    // 1. 基础语法与关键字 (Syntax & Keywords)
    // ==========================================
    "let", "set", "show", "import", "include", "return", 
    "if", "else", "for", "while", "break", "continue",
    "in", "not", "and", "or", "as",
    "content", "context", "none", "auto", "arguments", "array", "dict",

    // ==========================================
    // 2. 常用函数 (Common Functions)
    // ==========================================
    "heading", "strong", "emph", "link", "image", "rect", "block", "page", 
    "text", "par", "align", "grid", "stack", "columns", "colbreak",
    "list", "enum", "table", "figure", "bibliography", "cite", "footnote",
    "h", "v", "box", "rotate", "scale", "move", "place", "hide",
    "counter", "state", "query", "measure", "locate", "style", "layout",
    "numbering", "panic", "assert", "type", "repr", "str", "int", "float", "bool",
    "rgb", "cmyk", "luma", "color", "gradient", "pattern",
    "datetime", "duration", "calc", "palette",

    // ==========================================
    // 3. 数学函数与修饰 (Math Functions)
    // ==========================================
    "math", "sum", "prod", "int", "sqrt", "root", "log", "ln", "lim", 
    "sup", "inf", "max", "min", "floor", "ceil", "round", "abs", "norm",
    "sin", "cos", "tan", "cot", "csc", "sec", 
    "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh",
    "vec", "mat", "cases", "binom", "frac", "cancel",
    "op", "limits", "display", "inline", "script", "sscript",
    "upright", "italic", "bold", "serif", "sans", "mono", "cal", "frak", "bb",
    "lr", "attach", "t", "b", // t=top, b=bottom

    // ==========================================
    // 4. 希腊字母及其变体 (Greek Letters & Variants)
    // ==========================================
    "alpha", "beta", "beta.alt", "gamma", "delta", "epsilon", "epsilon.alt",
    "zeta", "eta", "theta", "theta.alt", "iota", "kappa", "kappa.alt",
    "lambda", "mu", "nu", "xi", "omicron", "pi", "pi.alt", 
    "rho", "rho.alt", "sigma", "sigma.alt", "tau", "upsilon", 
    "phi", "phi.alt", "chi", "psi", "omega",
    // 常用的大写希腊字母 (Typst 中通常首字母大写，但作为 keyword 我们也放进去)
    "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta",
    "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi",
    "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega",

    // ==========================================
    // 5. 综合符号库 (General Symbols)
    // ==========================================
    
    // --- 箭头 (Arrows) & 变体 ---
    "arrow", "arrow.l", "arrow.r", "arrow.t", "arrow.b",
    "arrow.l.r", "arrow.u.d", "arrow.long", "arrow.r.long", "arrow.l.long",
    "arrow.double", "arrow.r.double", "arrow.l.double", "arrow.l.r.double",
    "arrow.triple", "arrow.r.triple", "arrow.l.triple",
    "arrow.hook", "arrow.r.hook", "arrow.l.hook",
    "arrow.squiggly", "arrow.r.squiggly", "arrow.l.squiggly",
    "arrow.loop", "arrow.r.loop", "arrow.l.loop",
    "arrow.curve", "arrow.ccw", "arrow.cw",
    "arrow.zigzag",
    "larr", "rarr", "tarr", "barr", // 简写
    "larrow", "rarrow",
    "leftrightarrow", "iff", "implies", "impliedby",
    "mapsto", "harpoon", "harpoon.rt", "harpoon.rb", "harpoon.lt", "harpoon.lb",

    // --- 运算符号 (Operators) ---
    "plus", "plus.circle", "plus.square",
    "minus", "minus.circle", "minus.square", "minus.dot",
    "times", "times.circle", "times.square", "times.dot",
    "div", "div.circle", "div.sq",
    "dot", "dot.circle", "dot.square", "cdot",
    "ast", "ast.circle", "ast.square", "star", "convolve",
    "circle.stroked", "circle.filled",
    
    // --- 关系符号 (Relations) ---
    "eq", "eq.not", "neq", "eq.triple", "eq.quad", "eq.circle",
    "approx", "approx.not", "approx.eq", 
    "sim", "sim.not", "sim.eq", "simeq",
    "cong", "cong.not", "equiv", "equiv.not",
    "lt", "lt.eq", "leq", "lt.circle", "lt.curly",
    "gt", "gt.eq", "geq", "gt.circle", "gt.curly",
    "ll", "gg", "lll", "ggg",
    "prec", "prec.eq", "preceq", "prec.sim",
    "succ", "succ.eq", "succeq", "succ.sim",
    "subset", "subset.eq", "subseteq", "subset.neq", "subsetneq",
    "supset", "supset.eq", "supseteq", "supset.neq", "supsetneq",
    "in", "in.not", "notin", "ni", "owns",
    "parallel", "nparallel", "perp",
    "prop", "propto", 
    
    // --- 集合与逻辑 (Sets & Logic) ---
    "forall", "exists", "nexists", 
    "empty", "emptyset", "nothing", "void",
    "union", "union.sq", "sect", "sect.sq",
    "cup", "cap", "setminus", 
    "compose", "caret",
    "top", "bot", "tack", "tack.r", "tack.l",
    "vdash", "dashv", "models",
    "and", "or", "xor", "not", "neg",
    "angle", "angle.arc", "angle.spherical", "measuredangle",
    
    // --- 杂项符号 (Misc) ---
    "nabla", "diff", "partial", 
    "infinity", "inf", "oo", 
    "aleph", "beth", "gimel",
    "prime", "prime.double", "prime.triple",
    "degree", 
    "dots", "dots.h", "dots.v", "dots.c", "dots.down", "dots.up",
    "cdots", "ldots", "ddots", "vdots",
    "colon", "colon.eq", "coloneq", "eq.colon", "eqcolon",
    "comma", "semi", "bang", "quest",
    
    // --- 界定符 (Delimiters) ---
    "bar", "bar.v", "bar.double", "vert",
    "brace", "brace.l", "brace.r",
    "bracket", "bracket.l", "bracket.r",
    "paren", "paren.l", "paren.r",
    "floor", "floor.l", "floor.r", "lfloor", "rfloor",
    "ceil", "ceil.l", "ceil.r", "lceil", "rceil",
    "angle.l", "angle.r", "langle", "rangle",
    
    // --- 图形 (Shapes) ---
    "bullet", "circle", "circle.filled", "circle.stroked",
    "square", "square.filled", "square.stroked",
    "triangle", "triangle.filled", "triangle.stroked", "triangle.l", "triangle.r", "triangle.t", "triangle.b",
    "diamond", "diamond.filled", "diamond.stroked",
    "lozenge", "lozenge.filled", "lozenge.stroked",
    "rect",
    
    // --- 货币与标记 (Currency & Marks) ---
    "copyright", "registered", "trademark", 
    "section", "paragraph", "dagger", "dagger.double", 
    "hash", "percent", "amp", "at", "backslash",
    "dollar", "euro", "pound", "yen", "won", "rupee", 
    "checkmark", "cross", "ballot"
];