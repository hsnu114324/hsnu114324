/* ═══════════════════════════════════════════════════════
   德文單字 RPG (Word RPG) v1.0
   答對題目才能操作角色移動，收集寶物過關
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
const SPLIT_MODE_KEY    = "word_tetris_split_mode_v1";
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
function isAutoRemoveMode() { return localStorage.getItem(AUTO_REMOVE_KEY) === "1"; }
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

// ══════════════════════════════════════
//  RPG 地圖常數
// ══════════════════════════════════════

const MAP_W = 10;
const MAP_H = 10;
const TILE_EMPTY = 0;
const TILE_WALL  = 1;
const TILE_GEM   = 2;
const TILE_EXIT  = 3;

const DIR_UP = 0, DIR_RIGHT = 1, DIR_DOWN = 2, DIR_LEFT = 3;
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

// ══════════════════════════════════════
//  遊戲狀態
// ══════════════════════════════════════

let map = [];            // 2D array [row][col]
let playerRow = 1, playerCol = 1;
let pendingDir = DIR_RIGHT;  // 預備方向
let allPairs = [];       // 所有配對
let gemPairs = [];       // 寶物綁定的配對（用於 trackComboCleared）
let gemCount = 0, gemCollected = 0;
let score = 0;
let level = 1;
let steps = 0;
let correctCount = 0, wrongCount = 0;
let canMove = false;     // 答對後才為 true
let currentQuiz = null;  // { hint, shown, isCorrect, combo }
let quizLocked = false;  // 防止連續按

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════

const canvas       = document.getElementById("mapCanvas");
const ctx          = canvas.getContext("2d");
const quizWordEl   = document.getElementById("quizWord");
const quizPairEl   = document.getElementById("quizPair");
const quizFeedback = document.getElementById("quizFeedback");
const quizStatsEl  = document.getElementById("quizStats");
const scoreEl      = document.getElementById("scoreEl");
const gemEl        = document.getElementById("gemEl");
const gemTotalEl   = document.getElementById("gemTotal");
const levelEl      = document.getElementById("levelEl");
const btnCorrect   = document.getElementById("btnCorrect");
const btnWrong     = document.getElementById("btnWrong");
const restartBtn   = document.getElementById("restartBtn");

const dirBtns = {
  [DIR_UP]:    document.getElementById("dirUp"),
  [DIR_LEFT]:  document.getElementById("dirLeft"),
  [DIR_RIGHT]: document.getElementById("dirRight"),
  [DIR_DOWN]:  document.getElementById("dirDown"),
};

// ══════════════════════════════════════
//  Canvas 渲染
// ══════════════════════════════════════

let cellSize = 36;

function resizeCanvas() {
  const wrap = canvas.parentElement;
  const w = wrap.clientWidth - 4; // border
  cellSize = Math.floor(w / MAP_W);
  canvas.width  = cellSize * MAP_W;
  canvas.height = cellSize * MAP_H;
  drawMap();
}

function drawMap() {
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;

  // 背景
  ctx.fillStyle = "#1a1f3d";
  ctx.fillRect(0, 0, W, H);

  // 格線
  ctx.strokeStyle = "#252a4d";
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= MAP_W; c++) { ctx.beginPath(); ctx.moveTo(c * cellSize, 0); ctx.lineTo(c * cellSize, H); ctx.stroke(); }
  for (let r = 0; r <= MAP_H; r++) { ctx.beginPath(); ctx.moveTo(0, r * cellSize); ctx.lineTo(W, r * cellSize); ctx.stroke(); }

  // 地形
  for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
      const x = c * cellSize, y = r * cellSize;
      const tile = map[r][c];

      if (tile === TILE_WALL) {
        ctx.fillStyle = "#3a4a2a";
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        // 樹
        ctx.fillStyle = "#5a8a3a";
        ctx.font = `${Math.floor(cellSize * 0.6)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🌲", x + cellSize / 2, y + cellSize / 2);
      }

      if (tile === TILE_GEM) {
        // 寶物光暈
        const pulse = 0.3 + 0.2 * Math.sin(Date.now() / 400 + c * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${pulse})`;
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        ctx.font = `${Math.floor(cellSize * 0.55)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💎", x + cellSize / 2, y + cellSize / 2);
      }

      if (tile === TILE_EXIT) {
        ctx.fillStyle = "#4a3a1a";
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        ctx.font = `${Math.floor(cellSize * 0.55)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🚪", x + cellSize / 2, y + cellSize / 2);
      }
    }
  }

  // 角色
  const px = playerCol * cellSize, py = playerRow * cellSize;
  // 腳底陰影
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(px + cellSize / 2, py + cellSize * 0.85, cellSize * 0.3, cellSize * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  // 角色 emoji
  ctx.font = `${Math.floor(cellSize * 0.65)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🧙", px + cellSize / 2, py + cellSize / 2);

  // 方向箭頭指示（在角色旁邊小小的）
  const arrowMap = ["⬆", "➡", "⬇", "⬅"];
  ctx.fillStyle = "#ffcc02";
  ctx.font = `${Math.floor(cellSize * 0.3)}px sans-serif`;
  const arrowX = px + cellSize / 2 + DX[pendingDir] * cellSize * 0.4;
  const arrowY = py + cellSize / 2 + DY[pendingDir] * cellSize * 0.4;
  ctx.fillText(arrowMap[pendingDir], arrowX, arrowY);
}

// ══════════════════════════════════════
//  地圖生成
// ══════════════════════════════════════

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMap() {
  // 全空
  map = [];
  for (let r = 0; r < MAP_H; r++) {
    map.push(new Array(MAP_W).fill(TILE_EMPTY));
  }

  // 邊框是牆
  for (let r = 0; r < MAP_H; r++) {
    map[r][0] = TILE_WALL;
    map[r][MAP_W - 1] = TILE_WALL;
  }
  for (let c = 0; c < MAP_W; c++) {
    map[0][c] = TILE_WALL;
    map[MAP_H - 1][c] = TILE_WALL;
  }

  // 內部隨機放障礙物（約 12%）
  const inner = [];
  for (let r = 1; r < MAP_H - 1; r++) {
    for (let c = 1; c < MAP_W - 1; c++) {
      if (r === 1 && c === 1) continue; // 起點保留
      inner.push({ r, c });
    }
  }
  shuffle(inner);

  const wallCount = Math.floor(inner.length * 0.12) + level; // 隨關卡增加
  for (let i = 0; i < Math.min(wallCount, inner.length - 10); i++) {
    map[inner[i].r][inner[i].c] = TILE_WALL;
  }

  // 放寶物（3~5 個）
  const gemTarget = Math.min(3 + level, 8);
  const emptyCells = [];
  for (let r = 1; r < MAP_H - 1; r++) {
    for (let c = 1; c < MAP_W - 1; c++) {
      if (map[r][c] === TILE_EMPTY && !(r === 1 && c === 1)) {
        emptyCells.push({ r, c });
      }
    }
  }
  shuffle(emptyCells);

  gemCount = Math.min(gemTarget, emptyCells.length - 1); // 保留一格給出口
  gemPairs = [];
  for (let i = 0; i < gemCount; i++) {
    map[emptyCells[i].r][emptyCells[i].c] = TILE_GEM;
    // 綁定一個配對給這個寶物
    if (allPairs.length > 0) {
      gemPairs.push(allPairs[i % allPairs.length]);
    }
  }

  // 放出口（在剩餘空格中離起點最遠的）
  let maxDist = 0, exitCell = emptyCells[gemCount] || { r: MAP_H - 2, c: MAP_W - 2 };
  for (let i = gemCount; i < emptyCells.length; i++) {
    const d = Math.abs(emptyCells[i].r - 1) + Math.abs(emptyCells[i].c - 1);
    if (d > maxDist) { maxDist = d; exitCell = emptyCells[i]; }
  }
  map[exitCell.r][exitCell.c] = TILE_EXIT;

  // 確認從起點到出口有路徑（簡單 BFS 檢查）
  if (!hasPath(1, 1, exitCell.r, exitCell.c)) {
    // 重新生成
    generateMap();
  }
}

function hasPath(sr, sc, er, ec) {
  const visited = new Set();
  const queue = [[sr, sc]];
  visited.add(`${sr},${sc}`);
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (r === er && c === ec) return true;
    for (let d = 0; d < 4; d++) {
      const nr = r + DY[d], nc = c + DX[d];
      if (nr < 0 || nr >= MAP_H || nc < 0 || nc >= MAP_W) continue;
      if (visited.has(`${nr},${nc}`)) continue;
      if (map[nr][nc] === TILE_WALL) continue;
      visited.add(`${nr},${nc}`);
      queue.push([nr, nc]);
    }
  }
  return false;
}

// ══════════════════════════════════════
//  出題邏輯
// ══════════════════════════════════════

function nextQuiz() {
  if (allPairs.length < 2) {
    quizWordEl.textContent = "單字不足";
    quizPairEl.textContent = "請到設定頁面新增單字";
    return;
  }

  const idx = Math.floor(Math.random() * allPairs.length);
  const pair = allPairs[idx];
  const isCorrect = Math.random() < 0.5;

  let shownAnswer;
  if (isCorrect) {
    shownAnswer = pair.answer;
  } else {
    // 從其他配對中隨機選一個不同的答案
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

  // 記錄 appear
  trackComboAppear([currentQuiz.combo]);

  quizWordEl.textContent = pair.hint;
  quizPairEl.textContent = shownAnswer;
  quizFeedback.textContent = " ";
  quizFeedback.style.color = "";
  canMove = false;
  quizLocked = false;
}

function answerQuiz(userSaidCorrect) {
  if (!currentQuiz || quizLocked) return;
  quizLocked = true;

  const isRight = (userSaidCorrect === currentQuiz.isCorrect);

  if (isRight) {
    correctCount++;
    score += 10;
    canMove = true;
    quizFeedback.textContent = "✅ 答對！請移動角色";
    quizFeedback.style.color = "#5fd18d";

    // 如果答對且配對正確，算 cleared
    if (currentQuiz.isCorrect) {
      trackComboCleared([currentQuiz.combo]);
    }
  } else {
    wrongCount++;
    score = Math.max(0, score - 5);
    canMove = false;
    const correctText = currentQuiz.isCorrect ? "✅ 對" : "❌ 錯";
    quizFeedback.textContent = `❌ 答錯！正解：${correctText}（${currentQuiz.hint} = ${currentQuiz.correctAnswer}）`;
    quizFeedback.style.color = "#ff5555";

    // 答錯後自動出下一題
    setTimeout(() => {
      nextQuiz();
    }, 1500);
  }

  updateUI();
}

// ══════════════════════════════════════
//  角色移動
// ══════════════════════════════════════

function setDirection(d) {
  pendingDir = d;
  updateDirBtns();
  drawMap();

  // 如果已答對，立即移動
  if (canMove) {
    movePlayer();
  }
}

function movePlayer() {
  if (!canMove) return;
  canMove = false;

  const nr = playerRow + DY[pendingDir];
  const nc = playerCol + DX[pendingDir];
  steps++;

  // 撞牆
  if (nr < 0 || nr >= MAP_H || nc < 0 || nc >= MAP_W || map[nr][nc] === TILE_WALL) {
    quizFeedback.textContent = "🧱 撞牆了！方向不對";
    quizFeedback.style.color = "#f7b955";
    setTimeout(() => nextQuiz(), 800);
    updateUI();
    return;
  }

  // 移動
  playerRow = nr;
  playerCol = nc;

  // 檢查踩到什麼
  const tile = map[nr][nc];

  if (tile === TILE_GEM) {
    map[nr][nc] = TILE_EMPTY;
    gemCollected++;
    score += 50;

    // 對應的 combo cleared
    if (gemPairs.length > 0) {
      const gemCombo = gemPairs[gemCollected - 1];
      if (gemCombo) {
        trackComboCleared([[gemCombo.hint, gemCombo.answer]]);
      }
    }

    quizFeedback.textContent = `💎 收集寶物！（${gemCollected}/${gemCount}）+50 分`;
    quizFeedback.style.color = "#7ea6ff";
  }

  if (tile === TILE_EXIT) {
    // 過關！
    score += 100;
    level++;
    quizFeedback.textContent = `🚪 過關！進入第 ${level} 關 +100 分`;
    quizFeedback.style.color = "#5fd18d";
    syncStatsToSheets();

    setTimeout(() => {
      startLevel();
    }, 1200);
    updateUI();
    drawMap();
    return;
  }

  updateUI();
  drawMap();

  // 出下一題
  setTimeout(() => nextQuiz(), 400);
}

// ══════════════════════════════════════
//  UI 更新
// ══════════════════════════════════════

function updateUI() {
  scoreEl.textContent = score;
  gemEl.textContent = gemCollected;
  gemTotalEl.textContent = gemCount;
  levelEl.textContent = level;
  quizStatsEl.textContent = `答對 ${correctCount} / 答錯 ${wrongCount} ｜ 步數 ${steps}`;
}

function updateDirBtns() {
  for (const d in dirBtns) {
    if (dirBtns[d]) {
      dirBtns[d].classList.toggle("active-dir", parseInt(d) === pendingDir);
    }
  }
}

// ══════════════════════════════════════
//  遊戲初始化
// ══════════════════════════════════════

function startLevel() {
  playerRow = 1;
  playerCol = 1;
  gemCollected = 0;
  generateMap();
  updateUI();
  updateDirBtns();
  drawMap();
  nextQuiz();
}

function restartGame() {
  syncStatsToSheets();

  groupData = loadGroupData();
  const wordRows = loadWordRows();
  allPairs = buildPairsForQuiz(wordRows);
  console.log("[RPG] loaded", allPairs.length, "pairs");

  score = 0;
  level = 1;
  steps = 0;
  correctCount = 0;
  wrongCount = 0;
  pendingDir = DIR_RIGHT;

  startLevel();
}

function init() {
  try {
    preventZoom();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 出題按鈕
    tapBind(btnCorrect, () => answerQuiz(true));
    tapBind(btnWrong, () => answerQuiz(false));
    tapBind(restartBtn, restartGame);

    // 方向按鈕
    tapBind(dirBtns[DIR_UP],    () => setDirection(DIR_UP));
    tapBind(dirBtns[DIR_LEFT],  () => setDirection(DIR_LEFT));
    tapBind(dirBtns[DIR_RIGHT], () => setDirection(DIR_RIGHT));
    tapBind(dirBtns[DIR_DOWN],  () => setDirection(DIR_DOWN));

    // 鍵盤
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp")    { e.preventDefault(); setDirection(DIR_UP); }
      if (e.key === "ArrowDown")  { e.preventDefault(); setDirection(DIR_DOWN); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); setDirection(DIR_LEFT); }
      if (e.key === "ArrowRight") { e.preventDefault(); setDirection(DIR_RIGHT); }
    });

    // 地圖寶物閃爍動畫
    setInterval(() => {
      if (gemCollected < gemCount) drawMap();
    }, 300);

    restartGame();
  } catch (err) {
    console.error("RPG init error:", err);
    quizWordEl.textContent = "❌ 初始化錯誤";
    quizPairEl.textContent = err.message;
  }
}

init();

