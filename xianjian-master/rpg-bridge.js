/* ═══════════════════════════════════════
   RPG Bridge — 兩個功能：
   1. 接收 parent postMessage → 轉為 keydown 事件
   2. 強制 canvas zoom = 1（讓 parent 統一做縮放）
   ═══════════════════════════════════════ */

// ── 1. 強制 zoom: 1 ──
(function () {
  var s = document.createElement("style");
  s.textContent = "canvas { zoom: 1 !important; }";
  document.head.appendChild(s);
})();

// ── 2. postMessage → keydown ──
window.addEventListener("message", function (ev) {
  if (!ev.data || ev.data.type !== "rpg-key") return;
  var keyCode = ev.data.keyCode;
  if (!keyCode) return;

  var event = document.createEvent("Events");
  event.initEvent("keydown", true, true);
  event.keyCode = keyCode;
  event.which = keyCode;
  document.dispatchEvent(event);
});
