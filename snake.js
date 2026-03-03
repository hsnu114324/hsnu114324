/* ═══════════════════════════════════════════════════════
   德文貪食蛇 (Word Snake) v2.0
   與俄羅斯方塊共用 localStorage 學習統計
   v2: 難度遞進 / 干擾方塊 / 粒子特效 / 暫停 / 震動 / 手勢
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
//  共用工具函數（複製自 script.js）
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
  try {
    const pc = loadPickCount();
    if (pc > 0) localStorage.setItem(PICK_KEY, String(Math.max(0, pc - 1)));
  } catch { /* */ }
}

// ══════════════════════════════════════
//  貪食蛇遊戲常數
// ══════════════════════════════════════

const S_COLS = 10;
const S_ROWS = 14;
const BASE_TICK_MS = 200;  // 初始速度
const MIN_TICK_MS  = 80;   // 最快速度
const SPEED_STEP   = 8;    // 每完成一組減少的 ms

const DIR_UP = 0, DIR_RIGHT = 1, DIR_DOWN = 2, DIR_LEFT = 3;
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

// ══════════════════════════════════════
//  遊戲狀態
// ══════════════════════════════════════

let snake = [];
let dir = DIR_UP;
let nextDir = DIR_UP;
let foodBlocks = [];     // 正確食物 [{row, col, text, order, eaten}]
let decoyBlocks = [];    // 干擾方塊 [{row, col, text}]
let nextFoodIdx = 0;
let currentCombo = null;
let comboQueue = [];
let allCombosForDecoy = []; // 所有 combo，用來生成干擾文字
let totalCombos = 0;
let totalCleared = 0;
let score = 0;
let running = false;
let gameOver = false;
let paused = false;
let tickTimer = null;
let currentTickMs = BASE_TICK_MS;
let debugMode = false;

// 粒子系統
let particles = [];
let animFrameId = null;

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════

const canvas     = document.getElementById("board");
const ctx        = canvas.getContext("2d");
const scoreEl    = document.getElementById("score");
const progressEl = document.getElementById("progress");
const messageEl  = document.getElementById("message");
const speedInfoEl = document.getElementById("speedInfo");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn   = document.getElementById("pauseBtn");

// ══════════════════════════════════════
//  Canvas & 渲染
// ══════════════════════════════════════

let cellW = 30, cellH = 30;

function resizeCanvas() {
  const wrap = canvas.parentElement;
  const w = wrap.clientWidth;
  cellW = Math.floor(w / S_COLS);
  cellH = cellW;
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

  // 干擾方塊（先畫，在食物下層）
  for (const d of decoyBlocks) {
    const x = d.col * cellW, y = d.row * cellH;
    const pad = 2;
    // 較暗的紅紫色背景
    ctx.fillStyle = "#3a2030";
    ctx.fillRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2);
    // 虛線邊框
    ctx.strokeStyle = "#6a3050";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(x + pad, y + pad, cellW - pad * 2, cellH - pad * 2);
    ctx.setLineDash([]);
    // 文字
    ctx.fillStyle = "#885070";
    const fontSize = Math.max(11, Math.floor(cellW * 0.36));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(d.text, x + cellW / 2, y + cellH / 2 + 1);
  }

  // 正確食物方塊
  for (let i = 0; i < foodBlocks.length; i++) {
    const f = foodBlocks[i];
    if (f.eaten) continue;
    const x = f.col * cellW, y = f.row * cellH;
    const isNext = (i === nextFoodIdx);
    const pad = 2;

    // 圓角矩形背景
    const rx = x + pad, ry = y + pad, rw = cellW - pad * 2, rh = cellH - pad * 2;
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + rw - radius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctx.lineTo(rx + rw, ry + rh - radius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctx.lineTo(rx + radius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.fillStyle = isNext ? "#ff9800" : "#2a3a5a";
    ctx.fill();

    // 高亮邊框（下一個要吃的）
    if (isNext) {
      ctx.strokeStyle = "#ffcc02";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // 脈動光暈
      const pulse = 0.4 + 0.3 * Math.sin(Date.now() / 200);
      ctx.shadowColor = `rgba(255, 200, 0, ${pulse})`;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 順序小數字
    ctx.fillStyle = isNext ? "#000" : "#667";
    ctx.font = `bold ${Math.max(10, Math.floor(cellW * 0.26))}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`${i + 1}`, x + pad + 3, y + pad + 2);

    // 方塊文字
    ctx.fillStyle = isNext ? "#000" : "#ccd";
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

    const ratio = 1 - i / Math.max(snake.length, 1);
    const g = Math.floor(100 + 155 * ratio);
    ctx.fillStyle = isHead ? "#5fd18d" : `rgb(50, ${g}, 80)`;

    // 圓角蛇身
    const rx = x + pad, ry = y + pad, rw = cellW - pad * 2, rh = cellH - pad * 2;
    const radius = isHead ? 6 : 4;
    ctx.beginPath();
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + rw - radius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctx.lineTo(rx + rw, ry + rh - radius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctx.lineTo(rx + radius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.fill();

    // 蛇頭眼睛
    if (isHead) {
      ctx.fillStyle = "#fff";
      const cx = x + cellW / 2, cy = y + cellH / 2;
      const off = cellW * 0.2;
      const eyeR = Math.max(3, cellW * 0.1);
      const pupilR = Math.max(1.5, cellW * 0.05);

      let ex1, ey1, ex2, ey2;
      if (dir === DIR_UP)    { ex1 = cx - off; ey1 = cy - off * 0.3; ex2 = cx + off; ey2 = cy - off * 0.3; }
      else if (dir === DIR_DOWN)  { ex1 = cx - off; ey1 = cy + off * 0.3; ex2 = cx + off; ey2 = cy + off * 0.3; }
      else if (dir === DIR_LEFT)  { ex1 = cx - off * 0.3; ey1 = cy - off; ex2 = cx - off * 0.3; ey2 = cy + off; }
      else                        { ex1 = cx + off * 0.3; ey1 = cy - off; ex2 = cx + off * 0.3; ey2 = cy + off; }

      // 白眼
      ctx.beginPath(); ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2); ctx.fill();
      // 黑瞳
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.arc(ex1, ey1, pupilR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex2, ey2, pupilR, 0, Math.PI * 2); ctx.fill();
    }
  }

  // 粒子
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 遊戲結束遮罩
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
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

  // 暫停遮罩
  if (paused && !gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ffcc02";
    ctx.font = `bold ${Math.floor(W * 0.09)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⏸ 暫停中", W / 2, H / 2);
    ctx.fillStyle = "#aaa";
    ctx.font = `${Math.floor(W * 0.04)}px sans-serif`;
    ctx.fillText("點「暫停」或按空白鍵繼續", W / 2, H / 2 + 35);
  }
}

// ══════════════════════════════════════
//  粒子特效
// ══════════════════════════════════════

function spawnParticles(cx, cy, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.8;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      color,
      size: 2 + Math.random() * 4,
    });
  }
  if (!animFrameId) animFrameId = requestAnimationFrame(animLoop);
}

function animLoop() {
  // 更新粒子
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08; // 重力
    p.life -= 0.03;
  }
  particles = particles.filter(p => p.life > 0);

  draw();

  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(animLoop);
  } else {
    animFrameId = null;
  }
}

// ══════════════════════════════════════
//  震動回饋
// ══════════════════════════════════════

function vibrateShort() {
  try { if (navigator.vibrate) navigator.vibrate(30); } catch { /* */ }
}
function vibrateLong() {
  try { if (navigator.vibrate) navigator.vibrate([100, 50, 100]); } catch { /* */ }
}
function vibrateError() {
  try { if (navigator.vibrate) navigator.vibrate([200, 80, 200]); } catch { /* */ }
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

function updateSpeedInfo() {
  const level = Math.floor((BASE_TICK_MS - currentTickMs) / SPEED_STEP);
  speedInfoEl.textContent = `速度 Lv.${level}（${currentTickMs}ms）`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 計算當前應有的干擾方塊數量
function getDecoyCount() {
  // 每完成 2 組多 1 個干擾，最多 5 個
  return Math.min(5, Math.floor(totalCleared / 2));
}

// 生成干擾方塊用的隨機文字
function generateDecoyTexts(count) {
  const texts = [];
  // 從其他 combo 收集所有非提示的方塊文字
  const pool = [];
  for (const combo of allCombosForDecoy) {
    if (combo === currentCombo) continue;
    for (let i = 1; i < combo.length; i++) {
      pool.push(combo[i]);
    }
  }
  // 如果 pool 不足，用隨機字母補充
  const fallbackLetters = "abcdefghijklmnopqrstuvwxyzäöü".split("");
  while (pool.length < count) {
    pool.push(fallbackLetters[Math.floor(Math.random() * fallbackLetters.length)]);
  }
  shuffle(pool);
  // 去掉與當前 combo 重複的文字（避免混淆）
  const currentTexts = new Set(currentCombo ? currentCombo.slice(1).map(t => t.toLowerCase()) : []);
  const filtered = pool.filter(t => !currentTexts.has(t.toLowerCase()));
  for (let i = 0; i < count && i < filtered.length; i++) {
    texts.push(filtered[i]);
  }
  return texts;
}

function startNewCombo() {
  if (comboQueue.length === 0) {
    running = false;
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    syncStatsToSheets();
    setMessage(`🎉 全部完成！${totalCleared} 組全部拼對！分數 ${score}`, true);
    vibrateShort();
    gameOver = true;
    draw();
    return;
  }

  currentCombo = comboQueue.shift();
  const hint = currentCombo[0];
  const blocks = currentCombo.slice(1);

  trackComboAppear([currentCombo]);

  // 建立可用格子
  foodBlocks = [];
  decoyBlocks = [];
  nextFoodIdx = 0;

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

  if (available.length < blocks.length + getDecoyCount()) {
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

  let posIdx = 0;

  // 放置正確食物
  for (let i = 0; i < blocks.length && posIdx < available.length; i++) {
    foodBlocks.push({
      row: available[posIdx].row,
      col: available[posIdx].col,
      text: blocks[i],
      order: i,
      eaten: false,
    });
    posIdx++;
  }

  // 放置干擾方塊
  const decoyCount = getDecoyCount();
  const decoyTexts = generateDecoyTexts(decoyCount);
  for (let i = 0; i < decoyTexts.length && posIdx < available.length; i++) {
    decoyBlocks.push({
      row: available[posIdx].row,
      col: available[posIdx].col,
      text: decoyTexts[i],
    });
    posIdx++;
  }

  const hintText = debugMode ? currentCombo.join(" ") : hint;
  const decoyInfo = decoyCount > 0 ? `（⚠ ${decoyCount} 個干擾）` : "";
  setMessage(`🐍 提示：${hintText}${decoyInfo}（${totalCleared + 1}/${totalCombos}）`, true);
  draw();
}

function endGame(reason) {
  running = false;
  gameOver = true;
  paused = false;
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  syncStatsToSheets();
  vibrateError();
  setMessage(`💀 ${reason}　分數 ${score}，完成 ${totalCleared}/${totalCombos} 組`, false);
  updatePauseBtn();
  draw();
}

function updateSpeed() {
  currentTickMs = Math.max(MIN_TICK_MS, BASE_TICK_MS - totalCleared * SPEED_STEP);
  // 重設 timer 以新速度
  if (tickTimer) clearInterval(tickTimer);
  if (running && !paused) {
    tickTimer = setInterval(tick, currentTickMs);
  }
  updateSpeedInfo();
}

function tick() {
  if (!running || gameOver || paused) return;

  dir = nextDir;

  const head = snake[0];
  const nr = head.row + DY[dir];
  const nc = head.col + DX[dir];

  // 撞牆
  if (nr < 0 || nr >= S_ROWS || nc < 0 || nc >= S_COLS) {
    endGame("撞牆了！"); return;
  }

  // 撞自己（排除尾巴，因為尾巴即將移走，除非吃到食物）
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake[i].row === nr && snake[i].col === nc) {
      endGame("撞到自己了！"); return;
    }
  }

  // 檢查是否碰到干擾方塊
  for (const d of decoyBlocks) {
    if (d.row === nr && d.col === nc) {
      // 吃到干擾方塊
      spawnParticles(nc * cellW + cellW / 2, nr * cellH + cellH / 2, "#ff3355", 12);
      endGame(`吃到干擾方塊「${d.text}」！應按順序吃「${foodBlocks[nextFoodIdx]?.text || "?"}」`);
      return;
    }
  }

  // 檢查是否碰到正確食物
  let ateCorrect = false;
  for (let i = 0; i < foodBlocks.length; i++) {
    const f = foodBlocks[i];
    if (f.eaten) continue;
    if (f.row === nr && f.col === nc) {
      if (i === nextFoodIdx) {
        ateCorrect = true;
        f.eaten = true;
        score += 10;
        scoreEl.textContent = score;
        nextFoodIdx++;
        vibrateShort();

        // 粒子特效
        spawnParticles(nc * cellW + cellW / 2, nr * cellH + cellH / 2, "#ffcc02", 10);

        // 整組完成？
        if (nextFoodIdx >= foodBlocks.length) {
          trackComboCleared([currentCombo]);
          totalCleared++;
          updateProgress();
          autoRemoveCombo(currentCombo);

          // 完成獎勵分（速度越快獎勵越多）
          const speedBonus = Math.floor((BASE_TICK_MS - currentTickMs) / SPEED_STEP) * 5;
          score += 20 + speedBonus;
          scoreEl.textContent = score;

          // 大型粒子慶祝
          for (let k = 0; k < 3; k++) {
            const rx = Math.random() * canvas.width;
            const ry = Math.random() * canvas.height * 0.7;
            spawnParticles(rx, ry, ["#ff9800", "#5fd18d", "#7ea6ff", "#ff89d5"][k % 4], 8);
          }
          vibrateLong();

          snake.unshift({ row: nr, col: nc });

          // 更新速度
          updateSpeed();

          startNewCombo();
          return;
        }

        // 更新提示
        const nextText = foodBlocks[nextFoodIdx].text;
        const hintBase = debugMode ? currentCombo.join(" ") : currentCombo[0];
        setMessage(`🐍 提示：${hintBase}　▶ 下一個：${nextText}`, true);
      } else {
        spawnParticles(nc * cellW + cellW / 2, nr * cellH + cellH / 2, "#ff3355", 12);
        endGame(`順序錯誤！應先吃「${foodBlocks[nextFoodIdx].text}」`);
        return;
      }
    }
  }

  // 移動蛇
  snake.unshift({ row: nr, col: nc });
  if (!ateCorrect) {
    snake.pop();
  }

  draw();
}

// ══════════════════════════════════════
//  暫停
// ══════════════════════════════════════

function updatePauseBtn() {
  if (pauseBtn) {
    pauseBtn.textContent = paused ? "▶ 繼續" : "⏸ 暫停";
  }
}

function togglePause() {
  if (gameOver || !running) return;
  paused = !paused;
  updatePauseBtn();
  if (paused) {
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  } else {
    tickTimer = setInterval(tick, currentTickMs);
  }
  draw();
}

// ══════════════════════════════════════
//  手勢控制（滑動）
// ══════════════════════════════════════

let touchStartX = 0, touchStartY = 0;
const SWIPE_THRESHOLD = 30;

function setupSwipe() {
  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener("touchend", (e) => {
    if (e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      // 輕觸 = 暫停/繼續
      togglePause();
      return;
    }

    // 判斷滑動方向
    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平滑動
      if (dx < 0) turnLeft();
      else turnRight();
    } else {
      // 垂直滑動：上滑 = 跳過（不動），下滑 = 左轉（替代操作）
      // 這裡統一轉成左/右
      if (dy < 0) {
        // 上滑 = 不動作（保留）
      } else {
        // 下滑 = 左轉
        turnLeft();
      }
    }
  }, { passive: true });
}

// ══════════════════════════════════════
//  控制 & 初始化
// ══════════════════════════════════════

function turnLeft()  {
  if (paused || gameOver) return;
  nextDir = (dir + 3) % 4;
}
function turnRight() {
  if (paused || gameOver) return;
  nextDir = (dir + 1) % 4;
}

function restartGame() {
  syncStatsToSheets();

  debugMode = localStorage.getItem("word_tetris_debug_v1") === "1";

  groupData = loadGroupData();
  const wordRows = loadWordRows();
  const allCombos = buildComboList(wordRows);

  let pool = [...allCombos];
  shuffle(pool);
  const pickCount = loadPickCount();
  if (pickCount > 0 && pickCount < pool.length) {
    pool = pool.slice(0, pickCount);
  }

  allCombosForDecoy = [...allCombos]; // 保留完整列表供干擾方塊使用
  comboQueue = pool;
  totalCombos = pool.length;
  totalCleared = 0;
  score = 0;
  gameOver = false;
  running = true;
  paused = false;
  particles = [];
  if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

  currentTickMs = BASE_TICK_MS;
  scoreEl.textContent = "0";
  updatePauseBtn();

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
  decoyBlocks = [];
  nextFoodIdx = 0;
  currentCombo = null;

  updateProgress();
  updateSpeedInfo();
  startNewCombo();

  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(tick, currentTickMs);
}

function init() {
  preventZoom();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  tapBind(restartBtn, restartGame);
  tapBind(pauseBtn, togglePause);

  setupSwipe();

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); turnLeft(); }
    if (e.key === "ArrowRight") { e.preventDefault(); turnRight(); }
    if (e.key === " ") { e.preventDefault(); togglePause(); }
  });

  restartGame();
}

init();
