# TOOLBOX_DATA.py

# =============================================================================
# 1. Categories (大类定义)
# =============================================================================
category = [
    "Letters",
    "Mathematics",
    "Functions",
]

# =============================================================================
# 2. Groups (小组定义 - 包含左侧导航栏图标的 Typst 代码)
# =============================================================================
groups = {
    # -------------------------------------------------------------------------
    # Category: Letters
    # -------------------------------------------------------------------------
    "Letters": {
        "Common": {
            "id": "Common",
            "name": "Common",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$partial$], text(fill: rgb(35, 157, 173))[$infinity$],
                  text(fill: rgb(35, 157, 173))[$planck$], text(fill: black)[$nabla$]
                )
            """
        },
        "Greek": {
            "id": "Greek",
            "name": "Greek",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$alpha$], text(fill: rgb(35, 157, 173))[$beta$],
                  text(fill: rgb(35, 157, 173))[$gamma$], text(fill: black)[$delta$]
                )
            """
        },
        "GREEK": {
            "id": "GREEK",
            "name": "GREEK",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$Gamma$], text(fill: rgb(35, 157, 173))[$Delta$],
                  text(fill: rgb(35, 157, 173))[$Lambda$], text(fill: black)[$Theta$]
                )
            """
        },
        "Varient": {
            "id": "Varient",
            "name": "Varient",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$phi$], text(fill: rgb(35, 157, 173))[$phi.alt$],
                  text(fill: rgb(35, 157, 173))[$epsilon$], text(fill: black)[$epsilon.alt$]
                )
            """
        },
        "Hebrew": {
            "id": "Hebrew",
            "name": "Hebrew",
            "icon_code": "$aleph$"
        },
        "Fonts": {
            "id": "Fonts",
            "name": "Fonts",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$bb(R)$], text(fill: rgb(35, 157, 173))[$cal(L)$],
                  text(fill: rgb(35, 157, 173))[$frak(G)$], text(fill: black)[$scr(H)$]
                )
            """
        },
    },

    # -------------------------------------------------------------------------
    # Category: Mathematics
    # -------------------------------------------------------------------------
    "Mathematics": {
        "Operations": {
            "id": "Operations",
            "name": "Operations",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$times$], text(fill: rgb(35, 157, 173))[$ast.o$],
                  text(fill: rgb(35, 157, 173))[$plus.minus$], text(fill: black)[$div$]
                )
            """
        },
        "Relations": {
            "id": "Relations",
            "name": "Relations",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$!=$], text(fill: rgb(35, 157, 173))[$<=$],
                  text(fill: rgb(35, 157, 173))[$approx$], text(fill: black)[$equiv$]
                )
            """
        },
        "Logic": {
            "id": "Logic",
            "name": "Logic",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$forall$], text(fill: rgb(35, 157, 173))[$exists$],
                  text(fill: rgb(35, 157, 173))[$not$], text(fill: black)[$and$]
                )
            """
        },
        "Sets": {
            "id": "Sets",
            "name": "Sets",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$in$], text(fill: rgb(35, 157, 173))[$subset$],
                  text(fill: rgb(35, 157, 173))[$union$], text(fill: black)[$sect$]
                )
            """
        },
        "Calculus": {
            "id": "Calculus",
            "name": "Calculus",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$sum$], text(fill: rgb(35, 157, 173))[$integral$],
                  text(fill: rgb(35, 157, 173))[$product$], text(fill: black)[$diff$]
                )
            """
        },
        "Arrows": {
            "id": "Arrows",
            "name": "Arrows",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$->$], text(fill: rgb(35, 157, 173))[$=>$],
                  text(fill: rgb(35, 157, 173))[$<->$], text(fill: black)[$|->$]
                )
            """
        },
        "Geometry": {
            "id": "Geometry",
            "name": "Geometry",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$angle$], text(fill: rgb(35, 157, 173))[$perp$],
                  text(fill: rgb(35, 157, 173))[$triangle$], text(fill: black)[$degree$]
                )
            """
        },
        "Symbols": {
            "id": "Symbols",
            "name": "Symbols",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$dots$], text(fill: rgb(35, 157, 173))[$prime$],
                  text(fill: rgb(35, 157, 173))[$star$], text(fill: black)[$dagger$]
                )
            """
        },
    },

    # -------------------------------------------------------------------------
    # Category: Functions
    # -------------------------------------------------------------------------
    "Functions": {
        "Constructs": {
            "id": "Constructs",
            "name": "Constructs",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$x/y$], text(fill: rgb(35, 157, 173))[$sqrt(x)$],
                  text(fill: rgb(35, 157, 173))[$mat(1,0;0,1)$], text(fill: black)[$binom(n,k)$]
                )
            """
        },
        "Accents": {
            "id": "Accents",
            "name": "Accents",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$hat(a)$], text(fill: rgb(35, 157, 173))[$vec(b)$],
                  text(fill: rgb(35, 157, 173))[$dot(x)$], text(fill: black)[$bar(z)$]
                )
            """
        },
        "Decorations": {
            "id": "Decorations",
            "name": "Decorations",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$overline(A)$], text(fill: rgb(35, 157, 173))[$cancel(x)$],
                  text(fill: rgb(35, 157, 173))[$underbrace(x)$], text(fill: black)[$norm(v)$]
                )
            """
        },
        "Limits": {
            "id": "Limits",
            "name": "Limits",
            "icon_code": """
                #grid(
                  columns: (auto, auto), 
                  gutter: 10pt, 
                  align: center + horizon,
                  text(fill: black)[$lim$], text(fill: rgb(35, 157, 173))[$max$],
                  text(fill: rgb(35, 157, 173))[$sup$], text(fill: black)[$ln$]
                )
            """
        },
    },
}


# =============================================================================
# 3. Items (具体工具项定义)
# =============================================================================
items = {
    # -------------------------------- Letters --------------------------------
    "Common": {
        "infinity": { "code": "infinity", "icon_code": "$infinity$" },
        "partial": { "code": "partial", "icon_code": "$partial$" },
        "nabla": { "code": "nabla", "icon_code": "$nabla$" },
        "planck": { "code": "planck", "icon_code": "$planck$" },
        "bar_h": { "code": "bar.h", "icon_code": "$bar.h$" },
        "im": { "code": "im", "icon_code": "$im$" },
        "refmark": { "code": "refmark", "icon_code": "$refmark$" },
        "aleph": { "code": "aleph", "icon_code": "$aleph$" },
    },
    "Greek": {
        "alpha": { "code": "alpha", "icon_code": "$alpha$" },
        "beta": { "code": "beta", "icon_code": "$beta$" },
        "gamma": { "code": "gamma", "icon_code": "$gamma$" },
        "delta": { "code": "delta", "icon_code": "$delta$" },
        "epsilon": { "code": "epsilon", "icon_code": "$epsilon$" },
        "zeta": { "code": "zeta", "icon_code": "$zeta$" },
        "eta": { "code": "eta", "icon_code": "$eta$" },
        "theta": { "code": "theta", "icon_code": "$theta$" },
        "iota": { "code": "iota", "icon_code": "$iota$" },
        "kappa": { "code": "kappa", "icon_code": "$kappa$" },
        "lambda": { "code": "lambda", "icon_code": "$lambda$" },
        "mu": { "code": "mu", "icon_code": "$mu$" },
        "nu": { "code": "nu", "icon_code": "$nu$" },
        "xi": { "code": "xi", "icon_code": "$xi$" },
        "omicron": { "code": "omicron", "icon_code": "$omicron$" },
        "pi": { "code": "pi", "icon_code": "$pi$" },
        "rho": { "code": "rho", "icon_code": "$rho$" },
        "sigma": { "code": "sigma", "icon_code": "$sigma$" },
        "tau": { "code": "tau", "icon_code": "$tau$" },
        "upsilon": { "code": "upsilon", "icon_code": "$upsilon$" },
        "phi": { "code": "phi", "icon_code": "$phi$" },
        "chi": { "code": "chi", "icon_code": "$chi$" },
        "psi": { "code": "psi", "icon_code": "$psi$" },
        "omega": { "code": "omega", "icon_code": "$omega$" },
    },
    "GREEK": {
        "Gamma": { "code": "Gamma", "icon_code": "$Gamma$" },
        "Delta": { "code": "Delta", "icon_code": "$Delta$" },
        "Theta": { "code": "Theta", "icon_code": "$Theta$" },
        "Lambda": { "code": "Lambda", "icon_code": "$Lambda$" },
        "Xi": { "code": "Xi", "icon_code": "$Xi$" },
        "Pi": { "code": "Pi", "icon_code": "$Pi$" },
        "Sigma": { "code": "Sigma", "icon_code": "$Sigma$" },
        "Upsilon": { "code": "Upsilon", "icon_code": "$Upsilon$" },
        "Phi": { "code": "Phi", "icon_code": "$Phi$" },
        "Psi": { "code": "Psi", "icon_code": "$Psi$" },
        "Omega": { "code": "Omega", "icon_code": "$Omega$" },
    },
    "Varient": {
        "epsilon_alt": { "code": "epsilon.alt", "icon_code": "$epsilon.alt$" },
        "epsilon_alt_rev": { "code": "epsilon.alt.rev", "icon_code": "$epsilon.alt.rev$" },
        "theta_alt": { "code": "theta.alt", "icon_code": "$theta.alt$" },
        "kappa_alt": { "code": "kappa.alt", "icon_code": "$kappa.alt$" },
        "pi_alt": { "code": "pi.alt", "icon_code": "$pi.alt$" },
        "rho_alt": { "code": "rho.alt", "icon_code": "$rho.alt$" },
        "sigma_alt": { "code": "sigma.alt", "icon_code": "$sigma.alt$" },
        "phi_alt": { "code": "phi.alt", "icon_code": "$phi.alt$" },
    },
    "Hebrew": {
        "aleph": { "code": "aleph", "icon_code": "$aleph$" },
        "beth": { "code": "beth", "icon_code": "$beth$" },
        "gimel": { "code": "gimel", "icon_code": "$gimel$" },
        "dalet": { "code": "dalet", "icon_code": "$dalet$" },
    },
    "Fonts": {
        "bb_fn": { "code": "bb()", "icon_code": "$bb(R)$", "move": 2 },
        "cal_fn": { "code": "cal()", "icon_code": "$cal(F)$", "move": 2 },
        "frak_fn": { "code": "frak()", "icon_code": "$frak(A)$", "move": 2 },
        "scr_fn": { "code": "scr()", "icon_code": "$scr(S)$", "move": 2 },
        "sans_fn": { "code": "sans()", "icon_code": "$sans(X)$", "move": 2 },
        "mono_fn": { "code": "mono()", "icon_code": "$mono(M)$", "move": 2 },
        "bold_fn": { "code": "bold()", "icon_code": "$bold(B)$", "move": 2 },
        "italic_fn": { "code": "italic()", "icon_code": "$italic(I)$", "move": 2 },
    },

    # ------------------------------ Mathematics ------------------------------
    "Operations": {
        "plus": { "code": "+", "icon_code": "$+$" },
        "minus": { "code": "-", "icon_code": "$-$" },
        "times": { "code": "times", "icon_code": "$times$" },
        "div": { "code": "div", "icon_code": "$div$" },
        "dot": { "code": "dot", "icon_code": "$dot$" },
        "circle": { "code": "circle", "icon_code": "$circle$" },
        "ast": { "code": "ast", "icon_code": "$ast$" },
        "ast_o": { "code": "ast.o", "icon_code": "$ast.o$" },
        "star": { "code": "star", "icon_code": "$star$" },
        "plus_minus": { "code": "plus.minus", "icon_code": "$plus.minus$" },
        "minus_plus": { "code": "minus.plus", "icon_code": "$minus.plus$" },
        "plus_circle": { "code": "plus.circle", "icon_code": "$plus.circle$" },
        "times_circle": { "code": "times.circle", "icon_code": "$times.circle$" },
    },
    "Relations": {
        "eq": { "code": "=", "icon_code": "$=$" },
        "neq": { "code": "!=", "icon_code": "$!=$" },
        "lt": { "code": "<", "icon_code": "$<$" },
        "gt": { "code": ">", "icon_code": "$>$" },
        "le": { "code": "<=", "icon_code": "$<=$" },
        "ge": { "code": ">=", "icon_code": "$>=$" },
        "approx": { "code": "approx", "icon_code": "$approx$" },
        "equiv": { "code": "equiv", "icon_code": "$equiv$" },
        "prop": { "code": "prop", "icon_code": "$prop$" },
        # "sim": { "code": "sim", "icon_code": "$sim$" },
        # "cong": { "code": "cong", "icon_code": "$cong$" },
        "def": { "code": ":=", "icon_code": "$:=$" },
        "prec": { "code": "prec", "icon_code": "$prec$" },
        "succ": { "code": "succ", "icon_code": "$succ$" },
    },
    "Logic": {
        "forall": { "code": "forall", "icon_code": "$forall$" },
        "exists": { "code": "exists", "icon_code": "$exists$" },
        "exists_not": { "code": "exists.not", "icon_code": "$exists.not$" },
        "not": { "code": "not", "icon_code": "$not$" },
        "and": { "code": "and", "icon_code": "$and$" },
        "or": { "code": "or", "icon_code": "$or$" },
        "xor": { "code": "xor", "icon_code": "$xor$" },
        "implies": { "code": "=>", "icon_code": "$=>$" },
        "iff": { "code": "<=>", "icon_code": "$<=>$" },
        "therefore": { "code": "therefore", "icon_code": "$therefore$" },
        "because": { "code": "because", "icon_code": "$because$" },
    },
    "Sets": {
        "in": { "code": "in", "icon_code": "$in$" },
        "in_not": { "code": "in.not", "icon_code": "$in.not$" },
        "subset": { "code": "subset", "icon_code": "$subset$" },
        "subseteq": { "code": "subset.eq", "icon_code": "$subset.eq$" },
        "union": { "code": "union", "icon_code": "$union$" },
        "inter": { "code": "inter", "icon_code": "$inter$" },
        "emptyset": { "code": "emptyset", "icon_code": "$emptyset$" },
        # "setminus": { "code": "setminus", "icon_code": "$setminus$" },
        "complement": { "code": "complement", "icon_code": "$complement$" },
        "NN": { "code": "bb(N)", "icon_code": "$bb(N)$" },
        "ZZ": { "code": "bb(Z)", "icon_code": "$bb(Z)$" },
        "QQ": { "code": "bb(Q)", "icon_code": "$bb(Q)$" },
        "RR": { "code": "bb(R)", "icon_code": "$bb(R)$" },
        "CC": { "code": "bb(C)", "icon_code": "$bb(C)$" },
    },
    "Calculus": {
        "sum": { "code": "sum", "icon_code": "$sum$" },
        "product": { "code": "product", "icon_code": "$product$" },
        "integral": { "code": "integral", "icon_code": "$integral$" },
        "integral_d": { "code": "integral.double", "icon_code": "$integral.double$" },
        "integral_c": { "code": "integral.cont", "icon_code": "$integral.cont$" },
        "partial": { "code": "partial", "icon_code": "$partial$" },
        "nabla": { "code": "nabla", "icon_code": "$nabla$" },
    },
    "Arrows": {
        "arrow_r": { "code": "->", "icon_code": "$->$" },
        "arrow_l": { "code": "<-", "icon_code": "$<-$" },
        "arrow_lr": { "code": "<->", "icon_code": "$<->$" },
        "arrow_R": { "code": "=>", "icon_code": "$=>$" },
        "arrow_L": { "code": "<=", "icon_code": "$<=$" },
        "arrow_LR": { "code": "<=>", "icon_code": "$<=>$" },
        "mapsto": { "code": "|->", "icon_code": "$|->$" },
        "squiggly": { "code": "~>", "icon_code": "$~>$" },
        "hook_r": { "code": "arrow.hook", "icon_code": "$arrow.hook$" },
        "long_r": { "code": "-->", "icon_code": "$-->$" },
    },
    "Geometry": {
        "angle": { "code": "angle", "icon_code": "$angle$" },
        "perp": { "code": "perp", "icon_code": "$perp$" },
        "parallel": { "code": "parallel", "icon_code": "$parallel$" },
        "triangle": { "code": "triangle", "icon_code": "$triangle$" },
        "square": { "code": "square", "icon_code": "$square$" },
        "circle": { "code": "circle", "icon_code": "$circle$" },
        "degree": { "code": "degree", "icon_code": "$degree$" },
    },
    "Symbols": {
        "dots_h": { "code": "dots.h", "icon_code": "$dots.h$" },
        "dots_v": { "code": "dots.v", "icon_code": "$dots.v$" },
        "dots_c": { "code": "dots.c", "icon_code": "$dots.c$" },
        "prime": { "code": "'", "icon_code": "$'$" },
        "caret": { "code": "caret", "icon_code": "$caret$" },
        "dagger": { "code": "dagger", "icon_code": "$dagger$" },
    },

    # ------------------------------- Functions -------------------------------
    "Constructs": {
        "frac": { "code": "()/()", "icon_code": "$ (x+y)/z $", "move": 5, "desc": "Fraction" },
        "binom": { "code": "binom()", "icon_code": "$ binom(n, k) $", "move": 2, "desc": "Binomial" },
        "sqrt": { "code": "sqrt()", "icon_code": "$ sqrt(x) $", "move": 2, "desc": "Square Root" },
        "root": { "code": "root(n, x)", "icon_code": "$ root(n, x) $", "move": 5, "desc": "Root" },
        "mat": { "code": "mat(,;,)", "icon_code": "$ mat(1,2;3,4) $", "move": 5, "desc": "Matrix" },
        "vec": { "code": "vec(,,)", "icon_code": "$ vec(x,y,z) $", "move": 4, "desc": "Vector" },
        "cases": { "code": "cases(,,)", "icon_code": "$ cases(x, \"if\" a) $", "move": 4, "desc": "Cases" },
        "lr_p": { "code": "lr()", "icon_code": "$ lr((x)) $", "move": 1, "desc": "Scale Parens" },
        "abs": { "code": "abs()", "icon_code": "$ abs(x) $", "move": 1, "desc": "Absolute" },
        "norm": { "code": "norm()", "icon_code": "$ norm(x) $", "move": 1, "desc": "Norm" },
        "floor": { "code": "floor()", "icon_code": "$ floor(x) $", "move": 1, "desc": "Floor" },
        "ceil": { "code": "ceil()", "icon_code": "$ ceil(x) $", "move": 1, "desc": "Ceiling" },
    },
    "Accents": {
        "hat": { "code": "hat()", "icon_code": "$hat(a)$", "move": 1 },
        "tilde": { "code": "tilde()", "icon_code": "$tilde(a)$", "move": 1 },
        "bar": { "code": "bar()", "icon_code": "$bar(a)$", "move": 1 },
        "dot": { "code": "dot()", "icon_code": "$dot(a)$", "move": 1 },
        "ddot": { "code": "dot.double()", "icon_code": "$dot.double(a)$", "move": 1 },
        "diaer": { "code": "diaer()", "icon_code": "$diaer(a)$", "move": 1 },
        "breve": { "code": "breve()", "icon_code": "$breve(a)$", "move": 1 },
        "circle": { "code": "circle()", "icon_code": "$circle(a)$", "move": 1 },
        "vec_acc": { "code": "arrow()", "icon_code": "$arrow(a)$", "move": 1 },
    },
    "Decorations": {
        "underline": { "code": "underline()", "icon_code": "$underline(x)$", "move": 1 },
        "overline": { "code": "overline()", "icon_code": "$overline(x)$", "move": 1 },
        "ubrace": { "code": "underbrace()", "icon_code": "$underbrace(x)$", "move": 1 },
        "obrace": { "code": "overbrace()", "icon_code": "$overbrace(x)$", "move": 1 },
        "cancel": { "code": "cancel()", "icon_code": "$cancel(x)$", "move": 1 },
    },
    "Limits": {
        "lim": { "code": "lim", "icon_code": "$lim$" },
        "max": { "code": "max", "icon_code": "$max$" },
        "min": { "code": "min", "icon_code": "$min$" },
        "sup": { "code": "sup", "icon_code": "$sup$" },
        "inf": { "code": "inf", "icon_code": "$inf$" },
        "log": { "code": "log", "icon_code": "$log$" },
        "ln": { "code": "ln", "icon_code": "$ln$" },
        "sin": { "code": "sin", "icon_code": "$sin$" },
        "cos": { "code": "cos", "icon_code": "$cos$" },
        "tan": { "code": "tan", "icon_code": "$tan$" },
    },
}