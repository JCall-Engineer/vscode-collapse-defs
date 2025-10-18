const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('collapseDefs.foldAllFunctions', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		// Unfold everything first to start with a clean slate
		vscode.commands.executeCommand('editor.unfoldAll');

		const doc = editor.document;
		const langId = doc.languageId;

		const config = vscode.workspace.getConfiguration('collapseDefs');
		const userPatterns = config.get('foldPatterns') || {};

		const builtInPatterns = {
			python: /^\s*(async\s+)?def\s+\w+\s*\(.*\)\s*(\s*->\s*[^:]+)?:$/,
			javascript: /^\s*(async\s+)?function\s+\w+\s*\([^)]*\)\s*\{$|^.*(async\s+)?\([^)]*\)\s*=>\s*\{$/,
			typescript: /^\s*(export\s+)?(async\s+)?function\s+\w+\s*\([^)]*\)(\s*:\s*[^{]+)?\s*\{$|^.*(async\s+)?\([^)]*\)(\s*:\s*[^{]+)?\s*=>\s*\{$|^\s*(public|private|protected|static)?\s*(async\s+)?\w+\s*\([^)]*\)(\s*:\s*[^{]+)?\s*\{$/,
			java: /^\s*(public|private|protected)?\s+\w+\s+\w+\s*\(.*\)\s*\{/,
			csharp: /^\s*(public|private|protected)?\s+\w+\s+\w+\s*\(.*\)\s*\{/,
			c: /^\s*\w[\w\s\*]*\s+\w+\s*\([^)]*\)\s*\{/,

			// Yeah, it's ugly. But it folds everything that walks and talks like a C++ function. Do not gaze into its eyes for too long.
			cpp: /^(?!\s*(if|else|for|while|switch|do|try|catch|namespace|class|struct|union)\b)[\w:<>&\*,=\s]+\s+[\w:<>&\*,=\s]+\s*\(.*\)\s*(const)?\s*\{/
		};

		let pattern;

		const DEBUG = false; // Set to true if debugging regex matches
		const output = DEBUG ? vscode.window.createOutputChannel("Collapse To Defs") : null;
		if (DEBUG && output) output.clear();
		if (DEBUG && output) output.appendLine(`Language: ${langId}`);

		if (userPatterns[langId]) {
			try {
				pattern = new RegExp(userPatterns[langId]);
				if (DEBUG && output) output.appendLine(`Grabbing User Pattern`);
			} catch (e) {
				vscode.window.showErrorMessage(`Collapse Defs: Invalid user-defined regex for '${langId}': ${e.message}`);
				return;
			}
		} else if (builtInPatterns[langId]) {
			pattern = builtInPatterns[langId];
			if (DEBUG && output) output.appendLine(`Using default Pattern`);
		} else {
			vscode.window.showWarningMessage(`Collapse Defs: No fold pattern defined for language: ${langId}`);
			return;
		}

		if (DEBUG && output) output.appendLine(`Pattern: ${pattern}`);
		if (DEBUG && output) output.show();

		const blockOpeners = {
			python: ':',
			default: '{'
		};

		for (let i = doc.lineCount - 1; i >= 0; i--) {
			const blockChar = blockOpeners[langId] || blockOpeners.default;
			const line = doc.lineAt(i);

			if (pattern.test(line.text)) {
				if (DEBUG && output) output.appendLine(`Matched line ${i + 1}: ${line.text}`);
				if (line.text.trim().endsWith(blockChar) && i + 1 < doc.lineCount) {
					const nextLine = doc.lineAt(i + 1);
					if (nextLine.firstNonWhitespaceCharacterIndex > line.firstNonWhitespaceCharacterIndex) {
						// Likely a multi-line block
						editor.selection = new vscode.Selection(i, 0, i, 0);
						vscode.commands.executeCommand('editor.fold');
						if (DEBUG && output) output.appendLine(`[FOLDING] ${line.text}`);
					} else {
						if (DEBUG && output) output.appendLine(`[SKIPPED: one-liner] ${line.text}`);
					}
				} else {
					if (DEBUG && output) output.appendLine(`[IGNORED: no '${blockChar}}'] ${line.text}`);
				}
			}
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
