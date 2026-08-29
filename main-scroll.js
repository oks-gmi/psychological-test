(function () {
  "use strict";

  /*
   * 中央ページ側のスクロールバーを非表示
   */

  const style = document.createElement("style");

  style.textContent = `
    html,
    body {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  `;

  document.head.appendChild(style);


  /*
   * 実際にスクロールできる最大量を取得
   *
   * scrollHeight
   * ＝ ページ全体の高さ
   *
   * clientHeight
   * ＝ 現在表示されている高さ
   *
   * その差が実際の最大スクロール量になる。
   */

  function getMaxScroll() {

    const html = document.documentElement;
    const body = document.body;

    const scrollHeight = Math.max(
      html ? html.scrollHeight : 0,
      body ? body.scrollHeight : 0
    );

    const clientHeight = Math.max(
      html ? html.clientHeight : 0,
      body ? body.clientHeight : 0
    );

    return Math.max(
      0,
      scrollHeight - clientHeight
    );
  }


  /*
   * index.htmlへ
   * 実際の最大スクロール量を通知
   */

  function sendScrollInfo() {

    const maxScroll = getMaxScroll();

    window.parent.postMessage({
      type: "mainScrollInfo",
      maxScroll: maxScroll
    }, "*");

  }


  /*
   * index.htmlから
   * スクロール位置を受け取る
   */

  window.addEventListener("message", function (event) {

    if (event.data?.type !== "mainScroll") {
      return;
    }

    const scrollTop = Number(event.data.scrollTop);

    if (!Number.isFinite(scrollTop)) {
      return;
    }

    const maxScroll = getMaxScroll();

    const safeScrollTop = Math.min(
      Math.max(0, scrollTop),
      maxScroll
    );

    window.scrollTo({
      top: safeScrollTop,
      left: 0,
      behavior: "auto"
    });

  });


  /*
   * ページ読み込み時
   */

  window.addEventListener("load", function () {

    sendScrollInfo();

    setTimeout(sendScrollInfo, 100);
    setTimeout(sendScrollInfo, 300);
    setTimeout(sendScrollInfo, 500);
    setTimeout(sendScrollInfo, 1000);

  });


  /*
   * 画面サイズ変更時
   */

  window.addEventListener("resize", function () {

    sendScrollInfo();

  });


  /*
   * ページの高さが変化した場合
   */

  if (window.ResizeObserver) {

    const observer = new ResizeObserver(function () {

      sendScrollInfo();

    });

    observer.observe(document.documentElement);

    if (document.body) {
      observer.observe(document.body);
    }

  }

})();
