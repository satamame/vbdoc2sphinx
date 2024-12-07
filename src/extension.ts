import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vbdoc2sphinx" is now active!');

  const disposable = vscode.commands.registerCommand(
    'vbdoc2sphinx.pasteAsFunctionDirective', () => {

      // アクティブなテキストエディタを取得
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      // 選択範囲を取得
      const selection = editor.selection;
      const textToInsert = 'your_text_here'; // 挿入したい文字列

      editor.edit(editBuilder => {
          if (!selection.isEmpty) {
              // 選択範囲がある場合、その範囲を置き換える
              editBuilder.replace(selection, textToInsert);
          } else {
              // 選択範囲がない場合、カーソル位置に挿入する
              editBuilder.insert(selection.active, textToInsert);
          }
      });

      vscode.window.showInformationMessage(
        'Paste as Function Directive command executed!');
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
