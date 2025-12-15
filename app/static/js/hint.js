// static/js/editor-hint.js
// To Complete Autocomplete Function

// Import TYPST_KEYWORDS
import { TYPST_KEYWORDS } from "./TypstKeywords.js";

/**
 * Register Typst Code Hint
 * after import CodeMirror
 */
export function setupTypstHint() {
    // Check CodeMirror 
    if (typeof CodeMirror === 'undefined') {
        console.warn('CodeMirror not loaded, skipping hint registration.');
        return;
    }

    CodeMirror.registerHelper("hint", "typst", function(editor) {
        const cur = editor.getCursor();
        // const token = editor.getTokenAt(cur);
        const line = editor.getLine(cur.line);
        const lineUpToCursor = line.slice(0, cur.ch);
        const wordMatch = lineUpToCursor.match(/[#a-zA-Z0-9_.]+$/);

        if (!wordMatch) return null;

        const currentWord = wordMatch[0];
        const start = cur.ch - currentWord.length;
        const end = cur.ch;
        // const start = token.start;
        // const end = cur.ch;
        // const currentWord = token.string.slice(0, end - start);
        
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