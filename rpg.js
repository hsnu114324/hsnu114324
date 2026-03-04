/* ═══════════════════════════════════════════════════════
   德文單字 RPG (Word RPG) v2.0
   答對題目 → 解鎖仙劍奇俠傳操作數秒
   與俄羅斯方塊 / 貪食蛇共用 localStorage 學習統計
   ═══════════════════════════════════════════════════════ */

// ══════════════════════════════════════
//  共用常數
// ══════════════════════════════════════

const STORAGE_KEY       = "word_tetris_rows_v1";
const AUTO_REMOVE_KEY   = "word_tetris_auto_remove_v1";
const GROUPS_KEY        = "word_tetris_active_groups_v1";
const GROUP_REMOVED_KEY = "word_tetris_group_removed_v1";
const GROUP_DATA_KEY    = "word_tetris_group_data_v1";
const CUSTOM_ACTIVE_KEY = "word_tetris_custom_active_v1";
const SINGLE_WORD_MODE_KEY = "word_tetris_single_word_mode_v1";
const CUSTOM_FULL_KEY   = "word_tetris_custom_full_v1";
const STATS_KEY         = "word_tetris_combo_stats_v1";
const GOOGLE_USER_KEY   = "word_tetris_google_user_v1";
const PICK_KEY          = "word_tetris_pick_count_v1";
const APPS_SCRIPT_URL   = "https://script.google.com/macros/s/AKfycbyCSMkz1NiiUjB-32e_L4i3VtQbtpzUFYWgOPX4qOwbtjGGrZ_V2qvMYutX0iP-_NWlBQ/exec";

const DEFAULT_WORD_ROWS = ["蘋果,Apfel", "麵包,Brot", "水,Wasser", "牛奶,Milch", "書,Buch"];

// ══════════════════════════════════════
//  共用工具函數
// ══════════════════════════════════════

function tapBind(el, callback) {
  if (!el) return;
  let touched = false;
  el.addEventListener("touchstart", (e) => { e.preventDefault(); touched = true; callback(); }, { passive: false });
  el.addEventListener("click", () => { if (touched) { touched = false; return; } callback(); });
}

function preventZoom() {
  document.addEventListener("touchmove", (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });
}

function isSingleWordMode() { return localStorage.getItem(SINGLE_WORD_MODE_KEY) === "1"; }
function isCustomActive()   { return localStorage.getItem(CUSTOM_ACTIVE_KEY) === "1"; }
function loadPickCount() {
  try { const v = parseInt(localStorage.getItem(PICK_KEY), 10); return isNaN(v) || v < 0 ? 0 : v; } catch { return 0; }
}

// ── 單字載入 ──

let groupData = [];

function loadGroupData() {
  try { const r = localStorage.getItem(GROUP_DATA_KEY); if (!r) return []; const p = JSON.parse(r); return Array.isArray(p) ? p : []; } catch { return []; }
}
function loadActiveGroups() {
  try { const r = localStorage.getItem(GROUPS_KEY); if (!r) return []; const p = JSON.parse(r); return Array.isArray(p) ? p.filter(n => n >= 0 && n < groupData.length) : []; } catch { return []; }
}
function loadGroupRemoved() {
  try { const r = localStorage.getItem(GROUP_REMOVED_KEY); if (!r) return {}; const p = JSON.parse(r); return (p && typeof p === "object") ? p : {}; } catch { return {}; }
}
function isValidRowString(row) {
  if (typeof row !== "string") return false;
  const parts = row.split(",").map(w => w.trim()).filter(Boolean);
  return parts.length >= 2 && parts.length <= 5;
}

function loadWordRows() {
  const ag = loadActiveGroups();
  const ca = isCustomActive();
  const rows = [];
  if (ag.length > 0) {
    const removed = loadGroupRemoved();
    for (const gi of ag) {
      const removedSet = new Set((removed[gi] || []).map(s => s.split(",").map(p => p.trim().toLowerCase()).filter(Boolean).join(",")));
      for (const row of (groupData[gi] || [])) {
        const key = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
        if (!removedSet.has(key)) rows.push(row);
      }
    }
  }
  if (ca) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            if (!isValidRowString(r)) continue;
            rows.push(r);
          }
        }
      }
    } catch { /* ignore */ }
  }
  if (rows.length > 0) return rows;
  if (ag.length > 0) { const a = []; for (const gi of ag) a.push(...(groupData[gi] || [])); if (a.length > 0) return a; }
  return [...DEFAULT_WORD_ROWS];
}

// RPG 用的 combo：只取前兩欄（中文提示 + 德文單字）
function buildPairsForQuiz(rows) {
  const pairs = [];
  for (const row of rows) {
    const parts = row.split(",").map(w => w.trim()).filter(Boolean);
    if (parts.length >= 2) {
      pairs.push({ hint: parts[0], answer: parts[1], raw: row });
    }
  }
  return pairs;
}

// ── 學習統計 ──

function normalizeComboKey(combo) { return combo.map(w => w.trim().toLowerCase()).join(","); }

function loadComboStats() {
  try { const r = localStorage.getItem(STATS_KEY); if (!r) return {}; const p = JSON.parse(r); return (typeof p === "object" && p !== null) ? p : {}; } catch { return {}; }
}
function saveComboStats(stats) { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }

function trackComboAppear(combos) {
  const stats = loadComboStats();
  for (const combo of combos) {
    const key = normalizeComboKey(combo);
    const display = combo.join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display, lastSeen: "" };
    stats[key].appear++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
    stats[key].display = display;
  }
  saveComboStats(stats);
}

function trackComboCleared(combos) {
  const stats = loadComboStats();
  for (const combo of combos) {
    const key = normalizeComboKey(combo);
    const display = combo.join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display, lastSeen: "" };
    stats[key].cleared++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
  }
  saveComboStats(stats);
}

async function syncStatsToSheets() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("YOUR_")) return;
  let user = null;
  try { const r = localStorage.getItem(GOOGLE_USER_KEY); if (r) user = JSON.parse(r); } catch { /* */ }
  if (!user || !user.email) return;
  const stats = loadComboStats();
  if (Object.keys(stats).length === 0) return;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "sync", stats, userEmail: user.email, userName: user.name || user.email }),
    });
  } catch (e) { console.warn("同步 Google Sheets 失敗:", e); }
}

// ══════════════════════════════════════
//  遊戲控制常數
// ══════════════════════════════════════

const BASE_REWARD_SEC = 5;      // 答對獲得的操作秒數
const STREAK_BONUS    = 1;      // 連續答對每次多 1 秒
const MAX_REWARD_SEC  = 15;     // 最多可累積秒數

// ══════════════════════════════════════
//  遊戲狀態
// ══════════════════════════════════════

let allPairs = [];
let currentQuiz = null;
let quizLocked = false;
let correctCount = 0;
let wrongCount = 0;
let streak = 0;          // 連續答對數
let unlockTimer = null;  // 操作倒數計時器
let unlockRemaining = 0; // 剩餘秒數
let timerAnimFrame = null;
let unlockEndTime = 0;

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════

const quizWordEl    = document.getElementById("quizWord");
const quizPairEl    = document.getElementById("quizPair");
const quizFeedback  = document.getElementById("quizFeedback");
const quizStatsEl   = document.getElementById("quizStats");
const btnCorrect    = document.getElementById("btnCorrect");
const btnWrong      = document.getElementById("btnWrong");
const restartBtn    = document.getElementById("restartBtn");
const gameOverlay   = document.getElementById("gameOverlay");
const gameFrame     = document.getElementById("gameFrame");
const timerBar      = document.getElementById("timerBar");
const rewardSecEl   = document.getElementById("rewardSeconds");
const streakEl      = document.getElementById("streakEl");

// ══════════════════════════════════════
//  出題邏輯
// ══════════════════════════════════════

function nextQuiz() {
  if (allPairs.length < 2) {
    quizWordEl.textContent = "單字不足";
    quizPairEl.textContent = "請到設定頁面新增至少 2 組單字";
    return;
  }

  const idx = Math.floor(Math.random() * allPairs.length);
  const pair = allPairs[idx];
  const isCorrect = Math.random() < 0.5;

  let shownAnswer;
  if (isCorrect) {
    shownAnswer = pair.answer;
  } else {
    let wrongIdx;
    do { wrongIdx = Math.floor(Math.random() * allPairs.length); } while (wrongIdx === idx);
    shownAnswer = allPairs[wrongIdx].answer;
  }

  currentQuiz = {
    hint: pair.hint,
    correctAnswer: pair.answer,
    shown: shownAnswer,
    isCorrect,
    combo: [pair.hint, pair.answer],
  };

  trackComboAppear([currentQuiz.combo]);

  quizWordEl.textContent = pair.hint;
  quizPairEl.textContent = shownAnswer;
  quizFeedback.textContent = " ";
  quizFeedback.style.color = "";
  quizLocked = false;
}

function answerQuiz(userSaidCorrect) {
  if (!currentQuiz || quizLocked) return;
  quizLocked = true;

  const isRight = (userSaidCorrect === currentQuiz.isCorrect);

  if (isRight) {
    correctCount++;
    streak++;
    trackComboCleared([currentQuiz.combo]);

    const rewardSec = Math.min(MAX_REWARD_SEC, BASE_REWARD_SEC + (streak - 1) * STREAK_BONUS);
    quizFeedback.textContent = `✅ 答對！解鎖操作 ${rewardSec} 秒`;
    quizFeedback.style.color = "#5fd18d";

    unlockGame(rewardSec);
  } else {
    wrongCount++;
    streak = 0;
    const correctText = currentQuiz.isCorrect ? "✅ 對" : "❌ 錯";
    quizFeedback.textContent = `❌ 答錯！正解：${correctText}（${currentQuiz.hint} = ${currentQuiz.correctAnswer}）`;
    quizFeedback.style.color = "#ff5555";

    // 答錯 → 鎖住 + 出下一題
    lockGame();
    setTimeout(() => nextQuiz(), 1800);
  }

  updateUI();
}

// ══════════════════════════════════════
//  遊戲鎖定/解鎖
// ══════════════════════════════════════

function lockGame() {
  gameOverlay.classList.remove("unlocked");
  timerBar.style.width = "0%";
  if (unlockTimer) { clearTimeout(unlockTimer); unlockTimer = null; }
  if (timerAnimFrame) { cancelAnimationFrame(timerAnimFrame); timerAnimFrame = null; }
}

function unlockGame(seconds) {
  // 解鎖遮罩
  gameOverlay.classList.add("unlocked");

  // 讓 iframe 可以接收鍵盤
  try { gameFrame.focus(); } catch { /* */ }

  // 設定倒數
  unlockEndTime = Date.now() + seconds * 1000;
  if (unlockTimer) clearTimeout(unlockTimer);
  if (timerAnimFrame) cancelAnimationFrame(timerAnimFrame);

  // 倒數進度條動畫
  const totalMs = seconds * 1000;
  function updateBar() {
    const remaining = unlockEndTime - Date.now();
    if (remaining <= 0) {
      timerBar.style.width = "0%";
      return;
    }
    timerBar.style.width = (remaining / totalMs * 100) + "%";
    timerAnimFrame = requestAnimationFrame(updateBar);
  }
  updateBar();

  // 時間到 → 鎖住 + 出題
  unlockTimer = setTimeout(() => {
    lockGame();
    nextQuiz();
  }, seconds * 1000);
}

// ══════════════════════════════════════
//  UI 更新
// ══════════════════════════════════════

function updateUI() {
  quizStatsEl.textContent = `答對 ${correctCount} / 答錯 ${wrongCount}`;
  streakEl.textContent = streak;
  const rewardSec = Math.min(MAX_REWARD_SEC, BASE_REWARD_SEC + streak * STREAK_BONUS);
  rewardSecEl.textContent = rewardSec;
}

// ══════════════════════════════════════
//  初始化
// ══════════════════════════════════════

function restartGame() {
  syncStatsToSheets();

  groupData = loadGroupData();
  const wordRows = loadWordRows();
  allPairs = buildPairsForQuiz(wordRows);
  console.log("[RPG] loaded", allPairs.length, "pairs");

  correctCount = 0;
  wrongCount = 0;
  streak = 0;

  lockGame();
  updateUI();
  nextQuiz();

  // 重新載入仙劍
  gameFrame.src = gameFrame.src;
}

function init() {
  try {
    preventZoom();

    tapBind(btnCorrect, () => answerQuiz(true));
    tapBind(btnWrong, () => answerQuiz(false));
    tapBind(restartBtn, restartGame);

    // 點擊遮罩時提示
    gameOverlay.addEventListener("click", () => {
      quizFeedback.textContent = "🔒 請先回答上方題目！";
      quizFeedback.style.color = "#f7b955";
    });

    // 載入單字並開始
    groupData = loadGroupData();
    const wordRows = loadWordRows();
    allPairs = buildPairsForQuiz(wordRows);
    console.log("[RPG] loaded", allPairs.length, "pairs");

    updateUI();
    nextQuiz();

  } catch (err) {
    console.error("RPG init error:", err);
    quizWordEl.textContent = "❌ 初始化錯誤";
    quizPairEl.textContent = err.message;
  }
}

init();
