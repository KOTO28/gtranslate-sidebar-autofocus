// ==UserScript==
// @name         Google Translate Sidebar Autofocus
// @namespace    https://github.com/KOTO28/gtranslate-sidebar-autofocus
// @version      1.2.0
// @description  Focus and select all text in the Google Translate source box when the page is shown or focused.
// @description:ja Google翻訳を開いた/表示した/フォーカスが戻ったときに、原文テキストボックスにフォーカスして全選択します。
// @match        https://translate.google.com/*
// @match        https://translate.google.co.jp/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  "use strict";

  const getSourceBox = () =>
    document.querySelector("textarea[aria-label]") ||
    document.querySelector("textarea");

  const selectAll = () => {
    const box = getSourceBox();
    if (!box) return false;
    // ページ自体へのフォーカス要求（環境によっては無視される）
    try {
      window.focus();
    } catch (_) {}
    box.focus({ preventScroll: true });
    box.select();
    return true;
  };

  // サイドバーを開いた直後はフォーカスが確定しないことがあるため、数回試行する
  const trySelect = () => {
    [0, 50, 150, 300, 600].forEach((ms) => setTimeout(selectAll, ms));
  };

  // 初回読み込み時: 入力欄が描画されるまで待ってから実行
  const waitForBox = () => {
    if (getSourceBox()) return trySelect();
    const obs = new MutationObserver(() => {
      if (getSourceBox()) {
        obs.disconnect();
        trySelect();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForBox);
  } else {
    waitForBox();
  }

  // サイドバーを開き直したとき / タブ切り替えで戻ったとき
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") trySelect();
  });

  // ウィンドウやサイドバーにフォーカスが入ったとき
  window.addEventListener("focus", () => setTimeout(selectAll, 50));
})();
