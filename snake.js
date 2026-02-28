/* ═══════════════════════════════════════════════════════
   德文貪食蛇 (Word Snake) v1.0
   與俄羅斯方塊共用 localStorage 學習統計
   ═══════════════════════════════════════════════════════ */

// ══════════════════════════════════════
//  共用常數（與 script.js / settings.js 相同）
// ══════════════════════════════════════

const STORAGE_KEY       = "word_tetris_rows_v1";
const AUTO_REMOVE_KEY   = "word_tetris_auto_remove_v1";
const GROUPS_KEY        = "word_tetris_active_groups_v1";
const GROUP_REMOVED_KEY = "word_tetris_group_removed_v1";
const GROUP_DATA_KEY    = "word_tetris_group_data_v1";
const CUSTOM_ACTIVE_KEY = "word_tetris_custom_active_v1";
const SINGLE_WORD_MODE_KEY = "word_tetris_single_word_mode_v1";
const SPLIT_MODE_KEY    = "word_tetris_split_mode_v1";
const CUSTOM_FULL_KEY   = "word_tetris_custom_full_v1";
const STATS_KEY         = "word_tetris_combo_stats_v1";
const GOOGLE_USER_KEY   = "word_tetris_google_user_v1";
const PICK_KEY          = "word_tetris_pick_count_v1";
const APPS_SCRIPT_URL   = "https://script.google.com/macros/s/AKfycbyCSMkz1NiiUjB-32e_L4i3VtQbtpzUFYWgOPX4qOwbtjGGrZ_V2qvMYutX0iP-_NWlBQ/exec";

const DEFAULT_WORD_ROWS = ["1,2,3,4,5", "6,7,8,9,10"];

// ══════════════════════════════════════
//  共用工具函數（複製自 script.js，未來可抽為 common.js）
// ══════════════════════════════════════

function tapBind(el, callback) {
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
function isAutoRemoveMode() { return localStorage.getItem(AUTO_REMOVE_KEY) === "1"; }

function loadSplitMode() {
  const v = localStorage.getItem(SPLIT_MODE_KEY);
  return (v === "random" || v === "mixed") ? v : "syllable";
}
function loadPickCount() {
  try { const v = parseInt(localStorage.getItem(PICK_KEY), 10); return isNaN(v) || v < 0 ? 0 : v; } catch { return 0; }
}

// ── 德文音節拆分 ──

const _GERMAN_ONSETS = new Set([
  "schr","schw","schl","schm","schn","sch","pfl","pfr",
  "bl","br","ch","ck","cl","cr","dr","dw","fl","fr","gl","gn","gr",
  "kl","kn","kr","kw","pf","ph","pl","pr","qu","th","tr","ts","tw","wr","zw",
  "b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z","ß",
]);

function _isVowel(ch) { return "aeiouyäöüAEIOUYÄÖÜ".includes(ch); }

function germanSyllables(word) {
  if (!word || word.length <= 1) return [word];
  const nuclei = [];
  let i = 0;
  while (i < word.length) {
    if (_isVowel(word[i])) {
      let j = i + 1;
      while (j < word.length && _isVowel(word[j])) j++;
      nuclei.push({ start: i, end: j });
      i = j;
    } else { i++; }
  }
  if (nuclei.length <= 1) return [word];
  const breakPoints = [];
  for (let n = 0; n < nuclei.length - 1; n++) {
    const cStart = nuclei[n].end, cEnd = nuclei[n + 1].start;
    if (cStart >= cEnd) { breakPoints.push(cStart); continue; }
    const cluster = word.slice(cStart, cEnd).toLowerCase();
    if (cluster.length === 1) { breakPoints.push(cStart); continue; }
    let splitAt = cEnd - 1;
    for (let k = 0; k < cluster.length; k++) {
      if (_GERMAN_ONSETS.has(cluster.slice(k))) { splitAt = cStart + k; break; }
    }
    breakPoints.push(splitAt);
  }
  const syllables = [];
  let prev = 0;
  for (const bp of breakPoints) { if (bp > prev) syllables.push(word.slice(prev, bp)); prev = bp; }
  if (prev < word.length) syllables.push(word.slice(prev));
  return syllables.filter(s => s.length > 0);
}

function _mergeSyllables(syllables, maxBlocks) {
  const r = [...syllables];
  while (r.length > maxBlocks && r.length >= 2) { const last = r.pop(); r[r.length - 1] += last; }
  return r;
}

function splitGermanRandom(word, maxBlocks) {
  const chars = [...word];
  if (chars.length <= 1) return [word];
  if (chars.length <= maxBlocks) return chars;
  const possible = [];
  for (let i = 1; i < chars.length; i++) possible.push(i);
  for (let i = possible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possible[i], possible[j]] = [possible[j], possible[i]];
  }
  const splits = possible.slice(0, maxBlocks - 1).sort((a, b) => a - b);
  const blocks = []; let prev = 0;
  for (const s of splits) { blocks.push(chars.slice(prev, s).join("")); prev = s; }
  blocks.push(chars.slice(prev).join(""));
  return blocks;
}

function splitGermanToBlocks(germanStr, maxBlocks = 4) {
  let spaceParts = germanStr.split(/\s+/).filter(Boolean);
  if (spaceParts.length === 0) return [germanStr];
  if (spaceParts.length > maxBlocks) {
    spaceParts = [...spaceParts.slice(0, maxBlocks - 1), spaceParts.slice(maxBlocks - 1).join(" ")];
  }
  const prefix = spaceParts.slice(0, -1);
  const lastWord = spaceParts[spaceParts.length - 1];
  const availableForLast = maxBlocks - prefix.length;
  if (availableForLast <= 1 || lastWord.length <= 1) return [...prefix, lastWord];
  const mode = loadSplitMode();
  const useMode = (mode === "mixed") ? (Math.random() < 0.5 ? "syllable" : "random") : mode;
  let lastBlocks;
  if (useMode === "syllable") {
    lastBlocks = _mergeSyllables(germanSyllables(lastWord), availableForLast);
  } else {
    lastBlocks = splitGermanRandom(lastWord, availableForLast);
  }
  return [...prefix, ...lastBlocks];
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
      for (const row of groupData[gi]) {
        const key = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
        if (!removedSet.has(key)) rows.push(row);
      }
    }
  }
  if (ca) {
    const swMode = isSingleWordMode();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            if (!isValidRowString(r)) continue;
            if (swMode) { const parts = r.split(",").map(s => s.trim()).filter(Boolean); if (parts.length !== 2) continue; }
            rows.push(r);
          }
        }
      }
    } catch { /* ignore */ }
  }
  if (rows.length > 0) return rows;
  if (ag.length > 0) { const a = []; for (const gi of ag) a.push(...groupData[gi]); if (a.length > 0) return a; }
  return [...DEFAULT_WORD_ROWS];
}

function buildComboList(rows) {
  const swMode = isSingleWordMode();
  return rows.map((row, index) => {
    const words = row.split(",").map(w => w.trim()).filter(Boolean);
    if (words.length < 2 || words.length > 5) return null;
    if (swMode && words.length === 2) {
      const hint = words[0];
      const germanBlocks = splitGermanToBlocks(words[1], 4);
      const expanded = [hint, ...germanBlocks];
      if (expanded.length >= 2 && expanded.length <= 5) { expanded._origRow = row; return expanded; }
    }
    return words;
  }).filter(Boolean);
}

// ── 學習統計（與俄羅斯方塊共用） ──

function normalizeComboKey(combo) { return combo.map(w => w.trim().toLowerCase()).join(","); }

function loadComboStats() {
  try { const r = localStorage.getItem(STATS_KEY); if (!r) return {}; const p = JSON.parse(r); return (typeof p === "object" && p !== null) ? p : {}; } catch { return {}; }
}
function saveComboStats(stats) { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }

function trackComboAppear(combos) {
  const stats = loadComboStats();
  for (const combo of combos) {
    const key = combo._origRow
      ? combo._origRow.split(",").map(w => w.trim().toLowerCase()).filter(Boolean).join(",")
      : normalizeComboKey(combo);
    const display = combo._origRow || combo.join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display, lastSeen: "" };
    stats[key].appear++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
    stats[key].display = display;
    if (combo._origRow) stats[key].origRow = combo._origRow;
  }
  saveComboStats(stats);
}

function trackComboCleared(combos) {
  const stats = loadComboStats();
  for (const combo of combos) {
    const key = combo._origRow
      ? combo._origRow.split(",").map(w => w.trim().toLowerCase()).filter(Boolean).join(",")
      : normalizeComboKey(combo);
    const display = combo._origRow || combo.join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display, lastSeen: "" };
    stats[key].cleared++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
    if (combo._origRow) stats[key].origRow = combo._origRow;
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

// ── 自動移除 ──

function autoRemoveCombo(combo) {
  if (!isAutoRemoveMode()) return;
  const keysToRemove = new Set();
  const comboKey = normalizeComboKey(combo);
  keysToRemove.add(comboKey);
  if (combo._origRow) {
    keysToRemove.add(combo._origRow.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(","));
  }

  // 群組移除
  try {
    const ag = loadActiveGroups();
    if (ag.length > 0) {
      const removed = loadGroupRemoved();
      for (const gi of ag) {
        for (const row of (groupData[gi] || [])) {
          const rk = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
          if (keysToRemove.has(rk)) {
            if (!removed[gi]) removed[gi] = [];
            if (!removed[gi].includes(row)) removed[gi].push(row);
          }
        }
      }
      localStorage.setItem(GROUP_REMOVED_KEY, JSON.stringify(removed));
    }
  } catch { /* */ }

  // 自訂移除
  if (isCustomActive()) {
    const filterRows = (arr) => arr.filter(row => {
      const k = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
      return !keysToRemove.has(k);
    });
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { let rows = JSON.parse(raw); if (Array.isArray(rows)) { const b = rows.length; rows = filterRows(rows); if (rows.length < b) localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } }
    } catch { /* */ }
    try {
      const raw = localStorage.getItem(CUSTOM_FULL_KEY);
      if (raw) { let rows = JSON.parse(raw); if (Array.isArray(rows)) { rows = filterRows(rows); localStorage.setItem(CUSTOM_FULL_KEY, JSON.stringify(rows)); } }
    } catch { /* */ }
  }

  // 遞減 pickCount
  try {
    const pc = loadPickCount();
    if (pc > 0) localStorage.setItem(PICK_KEY, String(Math.max(0, pc - 1)));
  } catch { /* */ }
}

// ══════════════════════════════════════
//  貪食蛇遊戲設定
// ══════════════════════════════════════

const S_COLS = 10;
const S_ROWS = 14;
const TICK_MS = 200;

// 方向常數
const DIR_UP = 0, DIR_RIGHT = 1, DIR_DOWN = 2, DIR_LEFT = 3;
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

const FOOD_COLORS = ["#ff7a7a", "#ffbe5c", "#7ed957", "#45d0e6", "#7ea6ff", "#c58bff", "#ff89d5"];

// ══════════════════════════════════════
//  遊戲狀態
// ══════════════════════════════════════

let snake = [];          // [{row, col}, ...] head is index 0
let dir = DIR_UP;
let nextDir = DIR_UP;
let foodBlocks = [];     // [{row, col, text, order}]
let nextFoodIdx = 0;
let currentCombo = null;
let comboQueue = [];
let totalCombos = 0;
let totalCleared = 0;
let score = 0;
let running = false;
let gameOver = false;
let tickTimer = null;
let debugMode = false;

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════

const canvas     = document.getElementById("board");
const ctx        = canvas.getContext("2d");
const scoreEl    = document.getElementById("score");
const progressEl = document.getElementById("progress");
const messageEl  = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const leftBtn    = document.getElementById("leftBtn");
const rightBtn   = document.getElementById("rightBtn");

// ══════════════════════════════════════
//  Canvas & 渲染
// ══════════════════════════════════════

let cellW = 30, cellH = 30;

function resizeCanvas() {
  const wrap = canvas.parentElement;
  const w = wrap.clientWidth;
  cellW = Math.floor(w / S_COLS);
  cellH = cellW; // 正方格
  canvas.width  = cellW * S_COLS;
  canvas.height = cellH * S_ROWS;
  draw();
}

function draw() {
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;

  // 背景
  ctx.fillStyle = "#0f1222";
  ctx.fillRect(0, 0, W, H);

  // 格線
  ctx.strokeStyle = "#1a1f3d";
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= S_COLS; c++) { ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, H); ctx.stroke(); }
  for (let r = 0; r <= S_ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(W, r * cellH); ctx.stroke(); }

  // 食物方塊
  for (let i = 0; i < foodBlocks.length; i++) {
    const f = foodBlocks[i];
    if (f.eaten) continue;
    const x = f.col * cellW, y = f.row * cellH;
    const isNext = (i === nextFoodIdx);
    const pad = 2;

    // 背景色
    ctx.fillStyle = isNext ? "#ff9800" : "#2a3a5a";
    ctx.fillRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2);

    // 高亮邊框
    if (isNext) {
      ctx.strokeStyle = "#ffcc02";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2);
    }

    // 順序小數字（左上角）
    ctx.fillStyle = isNext ? "#000" : "#667";
    ctx.font = `bold ${Math.max(10, Math.floor(cellW * 0.28))}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`${i + 1}`, x + pad + 3, y + pad + 2);

    // 方塊文字
    ctx.fillStyle = isNext ? "#000" : "#aab";
    const fontSize = Math.max(11, Math.floor(cellW * 0.38));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(f.text, x + cellW / 2, y + cellH / 2 + 2);
  }

  // 蛇身
  for (let i = snake.length - 1; i >= 0; i--) {
    const s = snake[i];
    const x = s.col * cellW, y = s.row * cellH;
    const isHead = (i === 0);
    const pad = isHead ? 1 : 3;

    // 漸變色：頭亮尾暗
    const ratio = 1 - i / Math.max(snake.length, 1);
    const g = Math.floor(100 + 155 * ratio);
    ctx.fillStyle = isHead ? "#5fd18d" : `rgb(50, ${g}, 80)`;
    ctx.fillRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2);

    // 蛇頭眼睛
    if (isHead) {
      ctx.fillStyle = "#000";
      const cx = x + cellW / 2, cy = y + cellH / 2;
      const off = cellW * 0.2;
      const eyeR = Math.max(2, cellW * 0.08);
      // 根據方向畫眼睛
      if (dir === DIR_UP || dir === DIR_DOWN) {
        ctx.beginPath(); ctx.arc(cx - off, cy, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + off, cy, eyeR, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(cx, cy - off, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy + off, eyeR, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // 遊戲結束遮罩
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ff5555";
    ctx.font = `bold ${Math.floor(W * 0.08)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.floor(W * 0.045)}px sans-serif`;
    ctx.fillText(`分數 ${score}　完成 ${totalCleared}/${totalCombos} 組`, W / 2, H / 2 + 20);
    ctx.fillText("按「重新開始」再來一局", W / 2, H / 2 + 50);
  }
}

// ══════════════════════════════════════
//  遊戲邏輯
// ══════════════════════════════════════

function setMessage(text, isOk = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("ok", isOk);
}

function updateProgress() {
  progressEl.textContent = `${totalCleared}/${totalCombos}`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startNewCombo() {
  if (comboQueue.length === 0) {
    // 全部完成！
    running = false;
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    syncStatsToSheets();
    setMessage(`🎉 全部完成！${totalCleared} 組全部拼對！分數 ${score}`, true);
    gameOver = true;
    draw();
    return;
  }

  currentCombo = comboQueue.shift();
  const hint = currentCombo[0];
  const blocks = currentCombo.slice(1);

  // 記錄 appear
  trackComboAppear([currentCombo]);

  // 放置食物方塊
  foodBlocks = [];
  nextFoodIdx = 0;

  // 建立可用格子（排除蛇身，且離蛇頭至少 3 格）
  const occupied = new Set(snake.map(s => `${s.row},${s.col}`));
  const head = snake[0];
  const available = [];
  for (let r = 0; r < S_ROWS; r++) {
    for (let c = 0; c < S_COLS; c++) {
      if (occupied.has(`${r},${c}`)) continue;
      const dist = Math.abs(r - head.row) + Math.abs(c - head.col);
      if (dist >= 3) available.push({ row: r, col: c });
    }
  }
  shuffle(available);

  // 若可用格不足，放寬距離限制
  if (available.length < blocks.length) {
    const allFree = [];
    for (let r = 0; r < S_ROWS; r++) {
      for (let c = 0; c < S_COLS; c++) {
        if (!occupied.has(`${r},${c}`)) allFree.push({ row: r, col: c });
      }
    }
    shuffle(allFree);
    available.length = 0;
    available.push(...allFree);
  }

  for (let i = 0; i < blocks.length && i < available.length; i++) {
    foodBlocks.push({
      row: available[i].row,
      col: available[i].col,
      text: blocks[i],
      order: i,
      eaten: false,
    });
  }

  // 顯示提示
  const hintText = debugMode ? currentCombo.join(" ") : hint;
  setMessage(`🐍 提示：${hintText}（${totalCleared + 1}/${totalCombos}）`, true);
  draw();
}

function endGame(reason) {
  running = false;
  gameOver = true;
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  syncStatsToSheets();
  setMessage(`💀 ${reason}　分數 ${score}，完成 ${totalCleared}/${totalCombos} 組`, false);
  draw();
}

function tick() {
  if (!running || gameOver) return;

  // 套用暫存方向
  dir = nextDir;

  // 計算新蛇頭
  const head = snake[0];
  const nr = head.row + DY[dir];
  const nc = head.col + DX[dir];

  // 撞牆
  if (nr < 0 || nr >= S_ROWS || nc < 0 || nc >= S_COLS) {
    endGame("撞牆了！"); return;
  }

  // 撞自己
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake[i].row === nr && snake[i].col === nc) {
      endGame("撞到自己了！"); return;
    }
  }

  // 檢查是否碰到食物
  let ateCorrect = false;
  for (let i = 0; i < foodBlocks.length; i++) {
    const f = foodBlocks[i];
    if (f.eaten) continue;
    if (f.row === nr && f.col === nc) {
      if (i === nextFoodIdx) {
        // 正確！
        ateCorrect = true;
        f.eaten = true;
        score += 10;
        scoreEl.textContent = score;
        nextFoodIdx++;

        // 檢查是否整組完成
        if (nextFoodIdx >= foodBlocks.length) {
          // combo 完成
          trackComboCleared([currentCombo]);
          totalCleared++;
          updateProgress();

          // 自動移除
          autoRemoveCombo(currentCombo);

          // 加入新蛇頭（成長）
          snake.unshift({ row: nr, col: nc });

          // 開始下一組
          startNewCombo();
          return;
        }

        // 更新提示：顯示下一個要吃的
        const nextText = foodBlocks[nextFoodIdx].text;
        const hintBase = debugMode ? currentCombo.join(" ") : currentCombo[0];
        setMessage(`🐍 提示：${hintBase}　▶ 下一個：${nextText}`, true);
      } else {
        // 吃錯了！
        endGame(`順序錯誤！應先吃「${foodBlocks[nextFoodIdx].text}」`);
        return;
      }
    }
  }

  // 移動蛇
  snake.unshift({ row: nr, col: nc });
  if (!ateCorrect) {
    snake.pop(); // 不成長
  }

  draw();
}

// ══════════════════════════════════════
//  控制 & 初始化
// ══════════════════════════════════════

function turnLeft()  { nextDir = (dir + 3) % 4; }
function turnRight() { nextDir = (dir + 1) % 4; }

function restartGame() {
  // 同步統計
  syncStatsToSheets();

  // 讀取偵錯模式
  debugMode = localStorage.getItem("word_tetris_debug_v1") === "1";

  // 載入單字
  groupData = loadGroupData();
  const wordRows = loadWordRows();
  const allCombos = buildComboList(wordRows);

  // 抽取
  let pool = [...allCombos];
  shuffle(pool);
  const pickCount = loadPickCount();
  if (pickCount > 0 && pickCount < pool.length) {
    pool = pool.slice(0, pickCount);
  }

  comboQueue = pool;
  totalCombos = pool.length;
  totalCleared = 0;
  score = 0;
  gameOver = false;
  running = true;

  scoreEl.textContent = "0";

  // 初始蛇：中央，長度 3，向上
  const startRow = Math.floor(S_ROWS / 2);
  const startCol = Math.floor(S_COLS / 2);
  snake = [
    { row: startRow,     col: startCol },
    { row: startRow + 1, col: startCol },
    { row: startRow + 2, col: startCol },
  ];
  dir = DIR_UP;
  nextDir = DIR_UP;

  foodBlocks = [];
  nextFoodIdx = 0;
  currentCombo = null;

  updateProgress();
  startNewCombo();

  // 啟動計時器
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(tick, TICK_MS);
}

function init() {
  preventZoom();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // 綁定控制
  tapBind(leftBtn, turnLeft);
  tapBind(rightBtn, turnRight);
  tapBind(restartBtn, restartGame);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); turnLeft(); }
    if (e.key === "ArrowRight") { e.preventDefault(); turnRight(); }
  });

  restartGame();
}

init();

