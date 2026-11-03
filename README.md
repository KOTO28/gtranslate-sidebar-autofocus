# Google Translate Sidebar Autofocus

日本語 | [English](README_en.md)

> [!WARNING]
> このリポジトリのコードはすべてバイブコーディングで生成されたものです。
> 人間による十分なレビューやテストは行われていないため、利用には注意してください。
<!--  -->
> [!WARNING]
> このREADMEのこれ以降の内容は、AIが生成した文章を一部人間が校正したものです。誤りや不自然な表現が含まれる可能性があります。

Floorp / Firefox のサイドバー（Webパネル）に登録した Google翻訳 を開いたとき、クリックなしですぐに文字入力できるようにするスクリプトです。
パネルを開くと、原文の入力欄にフォーカスが入り、中身が全選択された状態になります。そのまま貼り付けや入力をすれば、前の文章が置き換わります。

## なぜ必要か

通常、サイドバーのアイコンをクリックしても、キーボードのフォーカスはアイコン（ブラウザ本体のUI）に残ったままになります。そのため、パネル内を一度クリックしないと文字を入力できません。
ページ内で動く userscript だけでは、ブラウザ本体が持っているフォーカスを奪えません。そこで、次の2つを組み合わせています。

| 部品          | 動く場所             | 役割                                                                         |
| ------------- | -------------------- | ---------------------------------------------------------------------------- |
| `autoconfig/` | ブラウザ本体（特権） | Google翻訳のパネルが表示された瞬間に、そのパネルへキーボードフォーカスを移す |
| `userscript/` | Google翻訳のページ内 | フォーカスが来たら原文の入力欄を選択し、全選択する                           |

### 動作の流れ

1. アイコンをクリック
2. パネルが表示される（フォーカスはまだアイコン）
3. autoconfig: 表示を検知してパネルの `<browser>` に focus()
4. ページ側で focus イベント発生
5. userscript: textarea を focus して全選択
6. すぐに入力できる

userscript単体でも、通常のタブでGoogle翻訳を使う場合は、タブやウィンドウに戻ったときに入力欄を全選択します。

## 動作確認環境

- Windows
- Floorp（Webパネル）
- Violentmonkey

Firefox 本体のサイドバーでも同じ仕組みで動く想定ですが、未確認です。

## 導入方法

### 1. userscript を入れる

1. 任意のユーザースクリプトマネージャーをブラウザにインストールします。
2. `userscript/gtranslate-sidebar-autofocus.user.js` を開き、Rawを表示するとインストール画面が出ます。ファイルの中身を新規スクリプトに貼り付けても構いません。

### 2. autoconfig を入れる

#### インストールフォルダを確認する

ブラウザで `about:support` を開き、「アプリケーションバイナリ」欄を確認します。そこに表示された実行ファイル（`floorp.exe` / `firefox.exe` など）があるフォルダが、インストールフォルダです。

| ブラウザ | インストールフォルダの例           |
| -------- | ---------------------------------- |
| Floorp   | `C:\Program Files\Ablaze Floorp`   |
| Firefox  | `C:\Program Files\Mozilla Firefox` |

#### ファイルをコピーする

> [!IMPORTANT]
> インストールフォルダにファイルをコピーする際は、管理者権限が必要です。

1. インストールフォルダに `autoconfig/gtranslate-sidebar-autofocus.cfg` をコピーします。
2. インストールフォルダの `defaults/pref/` に、 `autoconfig/defaults/pref/gtranslate-sidebar-autofocus-prefs.js` をコピーします。 `defaults/pref` フォルダがない場合は作成してください。

#### 再起動する

ブラウザを完全に終了してから、起動し直してください。

### 3. 動作確認

1. `Ctrl+Shift+J` でブラウザーコンソールを開きます。
2. `[gtranslate-sidebar-autofocus] loaded` と表示されていれば、autoconfig は読み込まれています。
3. Google翻訳のパネルを開くと `[gtranslate-sidebar-autofocus] focused https://translate.google...` と表示され、そのまま文字を入力できます。

## 注意事項

### 他の AutoConfig と併用する場合

AutoConfig で読み込めるファイルは、**ブラウザ全体で1つだけ**です（`general.config.filename` は1つしか指定できません）。

すでに [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) などの userChrome.js ローダーや、企業のポリシー用 AutoConfig を使っている場合、このリポジトリの prefs ファイルを入れると**どちらか一方しか動きません**。この場合は、次のどちらかで対応してください。

- `gtranslate-sidebar-autofocus.cfg` の2行目以降を、既存の AutoConfig ファイルの末尾に追記する（prefs ファイルは入れない。既存の設定で `general.config.sandbox_enabled` が `false` になっている必要があります）
- userChrome.js ローダーのスクリプトとして読み込む（`.uc.js` などローダーの形式に合わせる）

### 改行コードは LF

AutoConfig のファイルは、Windows でも改行コードが **LF** である必要があります。このリポジトリは `.gitattributes` で LF に固定しています。エディタで編集する場合も、CRLF で保存しないように注意してください。

### セキュリティについて

`general.config.sandbox_enabled = false` を設定すると、`.cfg` ファイルは**ブラウザと同じ特権**で実行されます。インストールフォルダに置くファイルの中身は、必ず自分で確認してください。また、インストールフォルダへの書き込み権限が自分（管理者）以外にない状態を保ってください。

### ブラウザ更新で動かなくなる可能性

ブラウザ内部の API は予告なく変わることがあります。動かなくなった場合は、ブラウザーコンソール（`Ctrl+Shift+J`）のエラーを確認してください。

## アンインストール

インストールフォルダから次の2ファイルを削除し、ブラウザを再起動します。

- `gtranslate-sidebar-autofocus.cfg`
- `defaults/pref/gtranslate-sidebar-autofocus-prefs.js`

userscript は、ユーザースクリプトマネージャーの管理画面から削除してください。
