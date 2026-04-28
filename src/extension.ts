import * as vscode from 'vscode';
import minimatch from 'minimatch';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('excludeMocksGoToImplementation', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const position = editor.selection.active;
        const uri = editor.document.uri;

        // Fetch original implementations
        const locations = await vscode.commands.executeCommand<vscode.Location[]>(
            'vscode.executeImplementationProvider',
            uri,
            position
        );

        if (!locations || locations.length === 0) {
            vscode.window.showInformationMessage('No implementations found.');
            return;
        }

        // Load user configuration
        const config = vscode.workspace.getConfiguration('excludeMockFiles');
        const patterns: string[] = config.get('patterns', [
            "**/*_mock.go",
            "**/mock/**/*.go",
            "**/mocks/**/*.go",
            "**/mock_*.go"
        ]);

        // Normalize and filter out mock files and the current cursor location
        const filtered = locations.filter(location => {
            const normalizedPath = location.uri.fsPath.replace(/\\/g, '/');
            if (patterns.some(pattern => minimatch(normalizedPath, pattern))) return false;
            if (location.uri.toString() === uri.toString() && location.range.contains(position)) return false;
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
        } else {
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

export function deactivate() {}