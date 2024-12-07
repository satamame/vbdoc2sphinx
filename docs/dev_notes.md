# 開発メモ

## プロジェクトの作成

参考: [はじめての VS Code 拡張機能開発](https://zenn.dev/hiro256ex/articles/20230625_getstartedvscodeextension)

1. `npx yo code`
1. Extenxion type: New Extension (TypeScript)
1. Extension name: VB Doc to Sphinx
1. Extension identifier: vbdoc2sphinx
1. Extention description: Paste VB Doc comment as Sphinx function directive.
1. Initialize git repository: Yes
1. Bundler to use: esbuild
1. Package manager to use: yarn

## 推奨拡張機能のインストール

- ESLint
- Extension Test Runner
- esbuild Problem Matchers

## package.json

- `activationEvents` に `onLanguage:markdown` を追加して、Markdown ファイルが開かれている時に拡張機能が有効になるようにした。
- `activationEvents` に `onLanguage:restructuredtext` を追加して、reStructuredText ファイルが開かれている時に拡張機能が有効になるようにした。
- `contributes.commands` に `pasteAsFunctionDirective` を追加した。

## extension.ts

- `registerCommand()` で `vbdoc2sphinx.pasteAsFunctionDirective` を登録するようにした。
