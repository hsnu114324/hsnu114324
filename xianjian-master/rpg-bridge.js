/* ═══════════════════════════════════════
   RPG Bridge — 接收 parent postMessage，
   轉為 keydown 事件給仙劍使用
   ═══════════════════════════════════════ */
window.addEventListener("message", function (ev) {
  // 只接受 rpg-key 類型
  if (!ev.data || ev.data.type !== "rpg-key") return;
  var keyCode = ev.data.keyCode;
  if (!keyCode) return;

  var event = document.createEvent("Events");
  event.initEvent("keydown", true, true);
  event.keyCode = keyCode;
  event.which = keyCode;
  document.dispatchEvent(event);
});

