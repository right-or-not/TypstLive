// app/static/js/TYPST_KEYWORDS.js

export const TOOLBOX_DATA = [
    {
        // 小写希腊字母
        id: "greek_lower",
        name: "Greek",
        icon: "αβγπ", // 也可以是 SVG 代码或图片 URL
        items: [
            { display: "α", code: "alpha", desc: "alpha" },
            { display: "β", code: "beta", desc: "beta" },
            { display: "γ", code: "gamma", desc: "gamma" },
            { display: "π", code: "pi", desc: "pi" },
            { display: "φ", code: "phi", desc: "phi" },
            { display: "ω", code: "omega", desc: "omega" },
        ]
    },

    {
        id: "arrows",
        name: "Arrows",
        icon: "→",
        items: [
            { display: "→", code: "arrow.r", desc: "Right Arrow" },
            { display: "←", code: "arrow.l", desc: "Left Arrow" },
            { display: "↔", code: "arrow.l.r", desc: "Left-Right Arrow" },
            { display: "⇒", code: "arrow.r.double", desc: "Implies" },
            { display: "⇔", code: "arrow.l.r.double", desc: "Equivalent" },
            { display: "↦", code: "arrow.r.bar", desc: "Maps to" }
        ]
    },
    
    {
        id: "math_func",
        name: "Functions",
        icon: "ƒ", 
        items: [
            { display: "frac", code: "frac()", move: 2, desc: "Fraction" },
            { display: "√", code: "sqrt()", move: 2, desc: "Square Root" },
            { display: "txt", code: "text()", move: 2, desc: "Text Mode" },
            { display: "\"\"", code: "\"\"", move: 2, desc: "Quote" }
        ]
    },

    {
        id: "math",
        name: "Math",
        icon: "∑", 
        items: [
            { display: "+", code: "plus", desc: "Plus" }, 
            { display: "∑", code: "sum", desc: "Sum" },
            { display: "sub", code: "_", desc: "Subscript" }, 
            { display: "sup", code: "^", desc: "Superscript" }
        ]
    }
];