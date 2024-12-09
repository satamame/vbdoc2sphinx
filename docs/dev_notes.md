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

## パッケージのインストール

```
> yarn add xml2js
```

## VSCode 拡張機能のインストール

- ESLint
- Extension Test Runner
- esbuild Problem Matchers

## package.json

- `activationEvents` に `onLanguage:markdown` を追加して、Markdown ファイルが開かれている時に拡張機能が有効になるようにした。
- `activationEvents` に `onLanguage:restructuredtext` を追加して、reStructuredText ファイルが開かれている時に拡張機能が有効になるようにした。
- `contributes.commands` に `pasteAsFunctionDirective` を追加した。

## extension.ts

- `registerCommand()` で `vbdoc2sphinx.pasteAsFunctionDirective` を登録するようにした。

## .vsix ファイルの作成

package.json で `version` を更新して、

```
vsce package
```

# 仕様

## Function ディレクティブの生成

Function ディレクティブを生成するのに、`functionDeclaration` と、`docComment` (xml) の以下の要素を使う。

- \<summary>
- \<remarks>
- \<param>
- \<returns>
- \<exception>

以下のように変換する。

```restructuredtext
.. function:: [functionDeclaration]

   [<summary> の内容]

   [<summary> <remarks> 以外の要素の内容]
   (要素の数だけ繰り返す)

   [<remarks> の内容]
   (要素の数だけ繰り返す)
```

### 各要素の変換

1. \<summary> \<remarks> 要素は、要素のテキスト部分をそのまま使う。
1. \<summary> \<remarks> 以外の要素は、以下のように変換する。
    - \<param>
        ```
        :param [要素の name 属性の値]: [要素のテキスト部分]
        :type [要素の name 属性の値]: [関数宣言から取得した、その引数の型] (この行はオプショナル)
        ```
    - \<returns>
        ```
        :returns: [要素のテキスト部分]
        :rtype: [関数宣言から取得した、返り値の型] (この行はオプショナル)
        ```
    - \<exception>
        ```
        :raises [要素の cref 属性の値]: [要素のテキスト部分]
        ```
