import path from 'node:path';
import * as vscode from 'vscode';
import { parseEnvLines, getMissingEnvEntries } from './utils/env';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('smartEnvPaste.pasteMissingKeys', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const config = vscode.workspace.getConfiguration('smartEnvPaste');
    const filePattern = config.get<string>('filePattern') || '^\\.env(\\.\\w+)?$';

    const fileName = path.basename(editor.document.fileName);
    const regex = new RegExp(filePattern);

    if (!regex.test(fileName)) {
      vscode.window.showWarningMessage(`The current file does not match the configured pattern: ${filePattern}`);
      return;
    }

    const clipboard = await vscode.env.clipboard.readText();
    const clipboardVars = parseEnvLines(clipboard);
    const fileVars = parseEnvLines(editor.document.getText());

    const missing = getMissingEnvEntries(fileVars, clipboardVars);

    if (missing.length === 0) {
      vscode.window.showInformationMessage('All keys already exist.');
      return;
    }

    const insertText = '\n# New keys added\n' + missing.map(([k, v]) => `${k}=${v}`).join('\n');

    editor.edit(editBuilder => {
      const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
      editBuilder.insert(lastLine.range.end, insertText);
    });

    vscode.window.showInformationMessage(`${missing.length} key(s) added to ${fileName}`);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
