// static/js/editor.js

import { CodeMirrorAPI } from './code-mirror.js';
import {
    EnvironmentController, 
    ToolboxController, 
    ActionController, 
    UIController
} from './utils.js';


/**
 * =================================================================
 * MAIN ENTRY POINT
 * =================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Editor] Initializing...');

    // 1. Initialize CodeMirror Core
    CodeMirrorAPI.init('typst-code');

    // 2. Initialize Controllers
    EnvironmentController.init();
    ToolboxController.init();
    ActionController.init();
    UIController.init();
    
    console.log('[Editor] Initialization Complete.');
});


// --- Public API Export ---
// Useful for other modules to access editor state
export const EditorAPI = {
    getCurrentEnvironment: () => EnvironmentController.current,
    getCurrentCode: () => CodeMirrorAPI.getValue()
};