# Google Translate Sidebar Autofocus

[日本語](README.md) | English

> [!WARNING]
> All code in this repository was generated through vibe coding.
> It has not been thoroughly reviewed or tested by a human, so use it with caution.
<!--  -->
> [!WARNING]
> This README is an AI-generated translation of the Japanese README, which itself was written by AI and partially proofread by a human. It may contain errors or unnatural phrasing.

A script that lets you start typing immediately, without clicking, when you open Google Translate registered in the Floorp / Firefox sidebar (web panel).

When you open the panel, the source text box gets focus and its contents are fully selected. Just paste or type, and the previous text is replaced.

## Why is this needed?

Normally, when you click a sidebar icon, keyboard focus stays on the icon (part of the browser UI). Because of this, you have to click inside the panel once before you can type.

A userscript running inside the page cannot take focus away from the browser UI. This project therefore combines two parts:

| Part          | Runs in                       | Role                                                                          |
| ------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| `autoconfig/` | Browser UI (privileged)       | Moves keyboard focus to the Google Translate panel the moment it is shown    |
| `userscript/` | Inside the Google Translate page | When focus arrives, focuses the source text box and selects all its text  |

### How it works

1. Click the icon
2. The panel is shown (focus is still on the icon)
3. autoconfig: detects that the panel is shown and calls `focus()` on the panel's `<browser>`
4. A focus event fires in the page
5. userscript: focuses the textarea and selects all text
6. You can type right away

The userscript also works on its own: when you use Google Translate in a regular tab, it selects all text in the source box whenever you return to the tab or window.

## Tested environment

- Windows
- Floorp (web panel)
- Violentmonkey

It is expected to work the same way with the built-in Firefox sidebar, but this has not been tested.

## Installation

### 1. Install the userscript

1. Install any userscript manager in your browser.
2. Open `userscript/gtranslate-sidebar-autofocus.user.js` and view it as Raw; the install screen will appear. You can also paste the file's contents into a new script.

### 2. Install the autoconfig files

#### Find the installation folder

Open `about:support` in your browser and check the "Application Binary" field. The folder containing the executable shown there (`floorp.exe`, `firefox.exe`, etc.) is the installation folder.

| Browser | Example installation folder        |
| ------- | ---------------------------------- |
| Floorp  | `C:\Program Files\Ablaze Floorp`   |
| Firefox | `C:\Program Files\Mozilla Firefox` |

#### Copy the files

> [!IMPORTANT]
> Administrator privileges are required to copy files into the installation folder.

1. Copy `autoconfig/gtranslate-sidebar-autofocus.cfg` into the installation folder.
2. Copy `autoconfig/defaults/pref/gtranslate-sidebar-autofocus-prefs.js` into `defaults/pref/` in the installation folder. If the `defaults/pref` folder does not exist, create it.

#### Restart

Quit the browser completely, then start it again.

### 3. Verify

1. Open the Browser Console with `Ctrl+Shift+J`.
2. If `[gtranslate-sidebar-autofocus] loaded` is shown, the autoconfig has been loaded.
3. When you open the Google Translate panel, `[gtranslate-sidebar-autofocus] focused https://translate.google...` is shown and you can start typing right away.

## Notes

### Using with another AutoConfig

AutoConfig can load **only one file for the entire browser** (`general.config.filename` accepts only one file).

If you already use a userChrome.js loader such as [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig), or an AutoConfig for enterprise policies, adding this repository's prefs file means **only one of them will work**. In that case, do one of the following:

- Append the second and subsequent lines of `gtranslate-sidebar-autofocus.cfg` to the end of your existing AutoConfig file (do not add the prefs file; your existing setup must have `general.config.sandbox_enabled` set to `false`)
- Load it as a script for your userChrome.js loader (rename it to match the loader's format, such as `.uc.js`)

### Line endings must be LF

AutoConfig files must use **LF** line endings, even on Windows. This repository enforces LF via `.gitattributes`. If you edit the files, make sure not to save them with CRLF.

### Security

Setting `general.config.sandbox_enabled = false` makes the `.cfg` file run with **the same privileges as the browser itself**. Always review the contents of any file you place in the installation folder. Also make sure that no one other than you (an administrator) has write access to the installation folder.

### May break after browser updates

Browser internal APIs can change without notice. If it stops working, check the Browser Console (`Ctrl+Shift+J`) for errors.

## Uninstallation

Delete the following two files from the installation folder, then restart the browser.

- `gtranslate-sidebar-autofocus.cfg`
- `defaults/pref/gtranslate-sidebar-autofocus-prefs.js`

Remove the userscript from your userscript manager's dashboard.
