(function () {
  "use strict";

  /*
   * 中央メイン共通スクロール処理
   *
   * 対象：
   * ロゴ
   * メインコンテンツ
   * フッター
   *
   * 上記を含めたページ全体の高さを
   * index.html に通知する。
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
   * ページ全体の高さを取得
   */
  function getPageHeight() {

    const body = document.body;
    const html = document.documentElement;

    return Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      body ? body.clientHeight : 0,
      html ? html.scrollHeight : 0,
      html ? html.offsetHeight : 0,
      html ? html.clientHeight : 0
    );
  }


  /*
   * index.html にページの高さを通知
   */
  function sendPageHeight() {

    const height = getPageHeight();

    window.parent.postMessage({
      type: "mainPageHeight",
      height: height
    }, "*");
  }


  /*
   * index.htmlからスクロール位置を受け取る
   */
  window.addEventListener("message", function (event) {

    if (event.data?.type !== "mainScroll") {
      return;
    }

    const scrollTop = Number(event.data.scrollTop);

    if (!Number.isFinite(scrollTop)) {
      return;
    }

    window.scrollTo({
      top: scrollTop,
      left: 0,
      behavior: "auto"
    });

  });


  /*
   * ページ読み込み直後
   */
  window.addEventListener("load", function () {

    sendPageHeight();

    setTimeout(sendPageHeight, 100);
    setTimeout(sendPageHeight, 300);
    setTimeout(sendPageHeight, 500);
    setTimeout(sendPageHeight, 1000);

  });


  /*
   * 画面サイズ変更
   */
  window.addEventListener("resize", function () {

    sendPageHeight();

  });


  /*
   * ページ内容の高さが変化した場合
   *
   * 動的に追加されるコンテンツや
   * フォント読み込みなどにも対応する。
   */
  if (window.ResizeObserver) {

    const observer = new ResizeObserver(function () {

      sendPageHeight();

    });

    observer.observe(document.documentElement);

    if (document.body) {
      observer.observe(document.body);
    }

  }

})();
