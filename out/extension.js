"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const minimatch_1 = __importDefault(require("minimatch"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('excludeMocksGoToImplementation', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const position = editor.selection.active;
        const uri = editor.document.uri;
        // Fetch original implementations
        const locations = await vscode.commands.executeCommand('vscode.executeImplementationProvider', uri, position);
        if (!locations || locations.length === 0) {
            vscode.window.showInformationMessage('No implementations found.');
            return;
        }
        // Load user configuration
        const config = vscode.workspace.getConfiguration('excludeMockFiles');
        const patterns = config.get('patterns', [
            "**/*_mock.go",
            "**/mock/**/*.go",
            "**/mocks/**/*.go",
            "**/mock_*.go"
        ]);
        // Normalize and filter out mock files and the current cursor location
        const filtered = locations.filter(location => {
            const normalizedPath = location.uri.fsPath.replace(/\\/g, '/');
            if (patterns.some(pattern => (0, minimatch_1.default)(normalizedPath, pattern)))
                return false;
            if (location.uri.toString() === uri.toString() && location.range.contains(position))
                return false;
            return true;
        });
        if (filtered.length === 0) {
            vscode.window.showInformationMessage('No non-mock implementations found.');
            return;
        }
        if (filtered.length === 1) {
            await vscode.window.showTextDocument(filtered[0].uri, {
                selection: filtered[0].range
            });
        }
        else {
            const quickPickItems = filtered.map(loc => ({
                label: vscode.workspace.asRelativePath(loc.uri),
                description: '',
                location: loc
            }));
            const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
                placeHolder: 'Select an implementation to navigate to'
            });
            if (selectedItem) {
                await vscode.window.showTextDocument(selectedItem.location.uri, {
                    selection: selectedItem.location.range
                });
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map