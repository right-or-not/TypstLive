// static/js/TOOLBOX_DATA.js

export const TOOLBOX_DATA = [
    {
        category: "Letters",
        groups: [
            {
                id: "greek_lower",
                name: "Greek (Lower)",
                icon: "α", 
                path: "/static/images/icons/greek.png",
                items: [
                    { path: "/static/images/icons/alpha.png", display: "α", code: "alpha" }, 
                    { display: "β", code: "beta" }
                ]
            },
            {
                id: "greek_upper",
                name: "Greek (Upper)",
                icon: "Δ", 
                items: [
                    { display: "Δ", code: "Delta" }, 
                    { display: "Γ", code: "Gamma" }
                ]
            }
        ]
    },

    {
        category: "Mathematics",
        groups: [
            {
                id: "basic_ops",
                name: "Basic Ops",
                icon: "+", 
                items: [
                    { display: "+", code: "plus" }, 
                    { display: "-", code: "minus" }
                ]
            },
            {
                id: "relations",
                name: "Relations",
                icon: "=", 
                items: [
                    { display: "=", code: "eq" }, 
                    { display: "≠", code: "eq.not" }
                ]
            }
        ]
    }
    // ... 更多大组
];