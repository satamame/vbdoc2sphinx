import * as vscode from 'vscode';
import * as xml2js from 'xml2js';

const indent = "   ";

interface ParseResult {
  isValid: boolean;
  docComment: string;
  functionDeclaration: string;
}

/**
 * 文字列をパースしてドキュメントコメントと関数宣言に分割する。
 * @param text - パースする文字列
 * @returns - パース結果
 */
function parseVBDocComment(text: string): ParseResult {
  const lines = text.split('\n');
  const commentLines: string[] = [];
  let functionDeclaration = '';
  let isValid = false;

  // ドキュメントコメントの解析
  for (const line of lines) {
      if (line.trim().startsWith("'''")) {
        commentLines.push(line.trim().substring(3).trim());
      } else {
          break;
      }
  }

  // ドキュメントコメントを1つの文字列に結合する (改行を保持する)。
  const docComment = commentLines.join('\n');

  // 関数宣言の解析
  if (commentLines.length > 0 && commentLines.length < lines.length) {
      for (let i = commentLines.length; i < lines.length; i++) {
          const line = lines[i].trim();
          functionDeclaration += line;
          if (!line.endsWith('_')) {
            break;
          }
          functionDeclaration = functionDeclaration.slice(0, -1); // '_' を削除する。
      }

      isValid = /^((Public|Private|Friend|Protected)\s+)?(Function|Sub)\s+\w+/
        .test(functionDeclaration);
  }

  return { isValid, docComment, functionDeclaration };
}

function getParamType(functionDeclaration: string, paramName: string): string | null {
  // 関数宣言から引数の型を抽出するロジックを実装
  // 例: "ByVal number As Integer" から "Integer" を抽出
  const match = functionDeclaration.match(new RegExp(`${paramName}\\s+As\\s+(\\w+)`));
  return match ? match[1] : null;
}

function getReturnType(functionDeclaration: string): string | null {
  // 関数宣言から戻り値の型を抽出するロジックを実装
  const match = functionDeclaration.match(/As\s+(\w+)\s*$/);
  return match ? match[1] : null;
}

/**
 * ドキュメントコメントを Sphinx の function ディレクティブに変換する。
 * @param docComment - ドキュメントコメント
 * @param functionDeclaration - 関数宣言
 * @returns - function ディレクティブ
 */
async function convertToSphinxDirective(
    docComment: string, functionDeclaration: string): Promise<string> {

  // ドキュメントコメントを XML としてパースする。
  const parser = new xml2js.Parser({ explicitCharkey: true });
  let xmlDoc;
  try {
    xmlDoc = await parser.parseStringPromise(`<root>${docComment}</root>`);
  } catch (error) {
    throw new Error('XML をパースできませんでした。\n' + error);
  }

  const docRoot = xmlDoc.root;
  let sphinxDirective = `.. function:: ${functionDeclaration.trim()}\n\n`;

  // <summary> の処理
  if (docRoot.summary) {
    const summaryLines = docRoot.summary[0]._.trim().split('\n');
    for (let i = 0; i < summaryLines.length; i++) {
        sphinxDirective += `${indent}${summaryLines[i].trim()}\n`;
    }
    sphinxDirective += '\n';
  }

  // <param>, <returns>, <exception> の処理
  const otherElements = [];
  if (docRoot.param) {
    docRoot.param.forEach((param: any) => {
      const paramName = param.$.name;
      const paramType = getParamType(functionDeclaration, paramName);
      otherElements.push(`:param ${paramName}: ${param._.trim()}`);
      if (paramType) {
        otherElements.push(`:type ${paramName}: ${paramType}`);
      }
    });
  }

  if (docRoot.returns) {
    const returnType = getReturnType(functionDeclaration);
    otherElements.push(`:returns: ${docRoot.returns[0]._.trim()}`);
    if (returnType) {
      otherElements.push(`:rtype: ${returnType}`);
    }
  }

  if (docRoot.exception) {
    docRoot.exception.forEach((exception: any) => {
      otherElements.push(`:raises ${exception.$.cref}: ${exception._.trim()}`);
    });
  }

  if (otherElements.length > 0) {
    sphinxDirective += `${indent}${otherElements.join(`\n${indent}`)}\n\n`;
  }

  // <remarks> の処理
  if (docRoot.remarks) {
    docRoot.remarks.forEach((remark: any) => {
      sphinxDirective += `${indent}${remark._.trim()}\n`;
    });
  }

  return sphinxDirective.trim() + '\n';
}

/**
 * ドキュメントコメントを MyST の function ディレクティブに変換する。
 * @param docComment - ドキュメントコメント
 * @param functionDeclaration - 関数宣言
 * @returns - function ディレクティブ
 */
async function convertToMystDirective(
    docComment: string, functionDeclaration: string): Promise<string> {

  // ドキュメントコメントを XML としてパースする。
  const parser = new xml2js.Parser({ explicitCharkey: true });
  let xmlDoc;
  try {
    xmlDoc = await parser.parseStringPromise(`<root>${docComment}</root>`);
  } catch (error) {
    throw new Error('XML をパースできませんでした。\n' + error);
  }

  const docRoot = xmlDoc.root;
  let mystDirective = `\`\`\`{function} ${functionDeclaration.trim()}\n\n`;

  // <summary> の処理
  if (docRoot.summary) {
    const summaryLines = docRoot.summary[0]._.trim().split('\n');
    for (let i = 0; i < summaryLines.length; i++) {
      mystDirective += `${summaryLines[i].trim()}`;
      if (i < summaryLines.length - 1) {
        mystDirective += '  ';
      }
      mystDirective += '\n';
    }
    mystDirective += '\n';
  }

  // <param>, <returns>, <exception> の処理
  const otherElements = [];
  if (docRoot.param) {
    docRoot.param.forEach((param: any) => {
      const paramName = param.$.name;
      const paramType = getParamType(functionDeclaration, paramName);
      otherElements.push(`:param ${paramName}: ${param._.trim()}`);
      if (paramType) {
        otherElements.push(`:type ${paramName}: ${paramType}`);
      }
    });
  }

  if (docRoot.returns) {
    const returnType = getReturnType(functionDeclaration);
    otherElements.push(`:returns: ${docRoot.returns[0]._.trim()}`);
    if (returnType) {
      otherElements.push(`:rtype: ${returnType}`);
    }
  }

  if (docRoot.exception) {
    docRoot.exception.forEach((exception: any) => {
      otherElements.push(`:raises ${exception.$.cref}: ${exception._.trim()}`);
    });
  }

  if (otherElements.length > 0) {
    mystDirective += `${otherElements.join(`\n`)}\n\n`;
  }

  // <remarks> の処理
  if (docRoot.remarks) {
    docRoot.remarks.forEach((remark: any) => {
      mystDirective += `${remark._.trim()}\n`;
    });
  }

  return mystDirective.trim() + '\n\`\`\`\n';
}

/**
 * pasteAsFunctionDirective コマンドの処理
 */
async function pasteAsFunctionDirective() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('アクティブなエディタが見つかりません。');
    return;
  }

  let clipboardText: string;
  try {
    clipboardText = await vscode.env.clipboard.readText();
  } catch (error) {
    vscode.window.showErrorMessage('クリップボードの内容を読み取れませんでした。');
    return;
  }

  // クリップボードの内容をパースしてドキュメントコメントと関数宣言に分割する。
  const parseResult = parseVBDocComment(clipboardText);

  if (!parseResult.isValid) {
    vscode.window.showWarningMessage(
      'クリップボードの内容にドキュメントコメントまたは関数宣言が含まれていません。');
    return;
  }

  // ドキュメントコメントを function ディレクティブに変換する。
  let functionDirective: string;
  const languageId = editor.document.languageId;
  try {
    if (languageId === 'restructuredtext') {
      functionDirective
        = await convertToSphinxDirective(parseResult.docComment, parseResult.functionDeclaration);
    } else if (languageId === 'markdown') {
      functionDirective
        = await convertToMystDirective(parseResult.docComment, parseResult.functionDeclaration);
    } else {
      throw new Error('このコマンドは reStructuredText または Markdown ファイルで有効です。');
    }
  } catch (error) {
    vscode.window.showWarningMessage((error as Error).message);
  }

  // function ディレクティブをエディタにペーストする。
  const selection = editor.selection;
  editor.edit(editBuilder => {
    editBuilder.replace(selection, functionDirective);
  });
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'vbdoc2sphinx.pasteAsFunctionDirective', pasteAsFunctionDirective);

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
