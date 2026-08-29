window.addEventListener("wheel", event => {

  if (window.innerWidth <= 900) {
    return;
  }

  const menuColumn = document.getElementById("menu-column");

  if (!menuColumn) {
    return;
  }

  const menuRect = menuColumn.getBoundingClientRect();

  const mouseOnMenu =
    event.clientX >= menuRect.left &&
    event.clientX <= menuRect.right &&
    event.clientY >= menuRect.top &&
    event.clientY <= menuRect.bottom;

  // 左メニュー上では何もしない
  if (mouseOnMenu) {
    return;
  }

  // 左メニュー以外は中央メインをスクロール
  const mainFrame = document.getElementById("main-frame");

  if (!mainFrame || !mainFrame.contentWindow) {
    return;
  }

  mainFrame.contentWindow.postMessage({
    type: "mainWheel",
    deltaY: event.deltaY
  }, "*");

  event.preventDefault();

}, {
  passive: false
});
