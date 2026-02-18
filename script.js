const COLS = 6;
const ROWS = 8;
const FALL_MS = 550;
const STORAGE_KEY = "word_tetris_rows_v1";

const DEFAULT_WORD_ROWS = [
  "1,2,3,4,5",
  "6,7,8,9,10",
];

const COLORS = [
  "#ff7a7a",
  "#ffbe5c",
  "#7ed957",
  "#45d0e6",
  "#7ea6ff",
  "#c58bff",
  "#ff89d5",
];

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const autoBtn = document.getElementById("autoBtn");
const debugBtn = document.getElementById("debugBtn");
const debugBoxEl = document.getElementById("debugBox");
const leftBtn = document.getElementById("leftBtn");
const downBtn = document.getElementById("downBtn");
const rightBtn = document.getElementById("rightBtn");

const PICK_KEY = "word_tetris_pick_count_v1";
const ALL_WORD_ROWS = loadWordRows();
const allComboList = buildComboList(ALL_WORD_ROWS);

let comboList = [];

let cellSize = 44;
let board = createEmptyBoard();
let activeBlock = null;
let score = 0;
let lastTick = 0;
let gameLoopId = null;
let running = true;
let animating = false;  // 消除動畫播放中
let particles = [];     // 爆散粒子
let clearedCombos = new Set(); // 已消除的 combo 索引
let wordQueue = [];     // 派發佇列：確保所有組合輪過一遍
let autoMode = false;       // 自動模式
let autoTargetCol = -1;     // AI 目標欄
let autoLastMoveTime = 0;   // 上次 AI 移動時間戳
const AUTO_MOVE_MS = 100;   // AI 每步間隔 ms
let autoPlan = [];           // 快取：整場最佳策略 [{word, col}, ...]
let autoPlanStep = 0;        // 目前執行到第幾步
let aiComputing = false;     // AI 正在計算中
let aiSearchGen = 0;         // 搜索世代（用於取消舊搜索）
let debugMode = false;

function preventZoom() {
  // 攔截雙指縮放（pinch zoom）
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // 攔截 Safari gesture 縮放
  document.addEventListener("gesturestart", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("gestureend", (e) => e.preventDefault(), {
    passive: false,
  });

  // 攔截 dblclick
  document.addEventListener("dblclick", (e) => e.preventDefault(), {
    passive: false,
  });
}

// 讓按鈕用 touchstart 直接反應，不等 click（避免 300ms 延遲和雙擊問題）
function tapBind(el, callback) {
  let touched = false;

  el.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      touched = true;
      callback();
    },
    { passive: false },
  );

  // 桌面版 fallback
  el.addEventListener("click", (e) => {
    if (touched) {
      touched = false;
      return; // 已由 touchstart 處理
    }
    callback();
  });
}

function buildComboList(rows) {
  return rows.map((row, index) => {
    const words = row
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);
    if (words.length < 2 || words.length > 5) {
      throw new Error(`第 ${index + 1} 組資料需要 2~5 個欄位`);
    }
    return words;
  });
}

function isValidRowString(row) {
  if (typeof row !== "string") return false;
  const parts = row
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
  return parts.length >= 2 && parts.length <= 5;
}

function loadWordRows() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_WORD_ROWS];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_WORD_ROWS];
    const validRows = parsed.filter(isValidRowString);
    if (!validRows.length) return [...DEFAULT_WORD_ROWS];
    return validRows;
  } catch (error) {
    return [...DEFAULT_WORD_ROWS];
  }
}

function loadPickCount() {
  try {
    const val = parseInt(localStorage.getItem(PICK_KEY), 10);
    return isNaN(val) || val < 0 ? 0 : val;
  } catch {
    return 0;
  }
}

// 從全部 combo 中隨機抽 n 組（0 = 全部）
function pickRandomCombos() {
  const n = loadPickCount();
  if (n <= 0 || n >= allComboList.length) {
    return [...allComboList];
  }
  // Fisher-Yates 取前 n 個
  const indices = Array.from({ length: allComboList.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, n).sort((a, b) => a - b).map((i) => allComboList[i]);
}

function setMessage(text, isOk = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("ok", isOk);
}

function setDebugText(text) {
  if (!debugBoxEl || !debugMode) return;
  debugBoxEl.textContent = text || "";
}

function toggleDebugMode() {
  debugMode = !debugMode;
  if (debugBtn) debugBtn.classList.toggle("active", debugMode);
  if (debugBoxEl) {
    debugBoxEl.classList.toggle("show", debugMode);
    if (!debugMode) debugBoxEl.textContent = "";
  }
}

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function nextWordColor(word) {
  let sum = 0;
  for (let i = 0; i < word.length; i += 1) {
    sum += word.charCodeAt(i);
  }
  return COLORS[sum % COLORS.length];
}

function resizeCanvas() {
  const maxWidth = Math.min(window.innerWidth - 24, 460);
  cellSize = Math.floor(maxWidth / COLS);
  canvas.width = cellSize * COLS;
  canvas.height = cellSize * ROWS;
  drawGrid();
}

// 建立一輪派發佇列：只包含尚未消除的 combo 的字，隨機打亂
function buildWordQueue() {
  const queue = [];
  for (let ci = 0; ci < comboList.length; ci++) {
    if (clearedCombos.has(ci)) continue; // 已消除的 combo 不再發牌
    for (const word of comboList[ci]) {
      queue.push(word);
    }
  }
  // Fisher-Yates 洗牌
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  return queue;
}

// 消除後清理佇列：移除只屬於已消除 combo 的字
function purgeWordQueue() {
  const activeWords = new Set();
  for (let ci = 0; ci < comboList.length; ci++) {
    if (clearedCombos.has(ci)) continue;
    for (const w of comboList[ci]) activeWords.add(w);
  }
  wordQueue = wordQueue.filter((w) => activeWords.has(w));
}

function nextWord() {
  if (!wordQueue.length) {
    wordQueue = buildWordQueue();
  }
  if (!wordQueue.length) {
    // 所有 combo 都已消除，不應再發牌（安全防護）
    return comboList[0]?.[0] || "?";
  }
  return wordQueue.shift();
}

// ── 自動模式 AI v5：全模擬版型枚舉 ──
// 枚舉所有 combo 起始欄組合，對每種版型完整模擬遊戲
// 版型數超過上限時改為隨機取樣

// ── 字詞索引 ──
let _wToI = null;
let _iToW = null;
let _cIdx = null;

function buildWordIndex() {
  _wToI = new Map();
  _iToW = [""];
  for (const combo of comboList)
    for (const w of combo)
      if (!_wToI.has(w)) { _wToI.set(w, _iToW.length); _iToW.push(w); }
  _cIdx = comboList.map(c => Uint8Array.from(c.map(w => _wToI.get(w))));
}

function boardToFlat(b) {
  const f = new Uint8Array(ROWS * COLS);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = b[r][c];
      if (cell !== null) {
        const w = typeof cell === "string" ? cell : cell.word;
        f[r * COLS + c] = _wToI.get(w) || 0;
      }
    }
  return f;
}

function simGravity(f) {
  for (let col = 0; col < COLS; col++) {
    let wi = ROWS - 1;
    for (let row = ROWS - 1; row >= 0; row--) {
      const v = f[row * COLS + col];
      if (v !== 0) { f[wi * COLS + col] = v; wi--; }
    }
    for (; wi >= 0; wi--) f[wi * COLS + col] = 0;
  }
}

function simClear(f, combos, cleared) {
  let cl = cleared, again = true;
  while (again) {
    again = false;
    for (let row = 0; row < ROWS; row++) {
      const base = row * COLS;
      for (let ci = 0; ci < combos.length; ci++) {
        if (cl & (1 << ci)) continue;
        const combo = combos[ci], clen = combo.length;
        for (let sc = 0; sc <= COLS - clen; sc++) {
          let hit = true;
          for (let i = 0; i < clen; i++)
            if (f[base + sc + i] !== combo[i]) { hit = false; break; }
          if (hit) {
            for (let i = 0; i < clen; i++) f[base + sc + i] = 0;
            cl |= (1 << ci); again = true;
          }
        }
      }
    }
    if (again) simGravity(f);
  }
  return cl;
}

function popcount(n) {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
}

function clearAutoPlan() { autoPlan = []; autoPlanStep = 0; }

// 快速猜測：選最空的欄（O(ROWS×COLS)，<0.1ms）
function quickGuessCol() {
  let bestCol = Math.floor(COLS / 2), bestH = -1;
  for (let c = 0; c < COLS; c++) {
    let h = 0;
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c] === null) h++; else break;
    }
    if (h > bestH) { bestH = h; bestCol = c; }
  }
  return bestCol;
}

function findBestColumn() {
  if (!activeBlock) return Math.floor(COLS / 2);
  const word = activeBlock.word;

  // 快取命中 → O(1)
  if (autoPlan.length > 0 && autoPlanStep < autoPlan.length) {
    const planned = autoPlan[autoPlanStep];
    if (planned.word === word) {
      autoPlanStep++;
      return planned.col;
    }
    clearAutoPlan();
  }

  // 啟動背景搜索 + 立刻回傳初步猜測（不凍結）
  runAISearch(word);
  return quickGuessCol();
}

// ── 全模擬版型枚舉 ──
// 每個 combo 可從 0 ~ (COLS - comboLen) 開始
// 枚舉所有版型組合，對每種版型用佇列順序完整模擬遊戲（含落子、消除、重力）
// 版型數 ≤ 上限時完整枚舉，否則隨機取樣
async function runAISearch(word) {
  const myGen = ++aiSearchGen;
  aiComputing = true;
  buildWordIndex();

  const fullSeq = [word, ...wordQueue];
  const seqIdx = Uint8Array.from(fullSeq.map(w => _wToI.get(w) || 0));
  const totalSteps = fullSeq.length;
  const numCombos = comboList.length;
  const TC = ROWS * COLS;

  setMessage(`🤖 版型模擬中...`, true);
  await new Promise(r => setTimeout(r, 0));
  if (myGen !== aiSearchGen) return;

  let initCl = 0;
  for (const ci of clearedCombos) initCl |= (1 << ci);
  const f0 = boardToFlat(board);
  let bestCl = popcount(initCl), bestSp = -1, bestPath = [];
  let planInstalled = false;

  function flatToDebugText(flat) {
    const rows = [];
    for (let r = 0; r < ROWS; r++) {
      const cols = [];
      for (let c = 0; c < COLS; c++) {
        const v = flat[r * COLS + c];
        cols.push(v === 0 ? "." : String(v));
      }
      rows.push(cols.join(" "));
    }
    return rows.join("\n");
  }

  // ── 活躍 combo 及每個字的歸屬 ──
  const activeCI = [];
  for (let ci = 0; ci < numCombos; ci++) if (!(initCl & (1 << ci))) activeCI.push(ci);
  const N = activeCI.length;

  const wordToCi = new Int8Array(_iToW.length).fill(-1);
  const wordToPos = new Int8Array(_iToW.length).fill(-1);
  for (const ci of activeCI) {
    const combo = _cIdx[ci];
    for (let p = 0; p < combo.length; p++) {
      if (wordToCi[combo[p]] === -1) {
        wordToCi[combo[p]] = ci;
        wordToPos[combo[p]] = p;
      }
    }
  }

  // ── 計算版型總數 ──
  const choices = new Uint8Array(N);
  let totalLayouts = 1;
  let overflow = false;
  for (let i = 0; i < N; i++) {
    const clen = _cIdx[activeCI[i]].length;
    choices[i] = Math.max(1, COLS - clen + 1);
    totalLayouts *= choices[i];
    if (totalLayouts > 200000) { overflow = true; break; }
  }

  const MAX_LAYOUTS = 200000;
  const enumerate = !overflow && totalLayouts <= MAX_LAYOUTS;
  const layoutCount = enumerate ? totalLayouts : MAX_LAYOUTS;

  setMessage(`🤖 模擬 ${layoutCount} 版型（${totalSteps} 步）...`, true);
  await new Promise(r => setTimeout(r, 0));
  if (myGen !== aiSearchGen) return;

  let lastDebugSample = "";

  // ── 模擬單一版型 ──
  function simulateLayout(cs) {
    // 衝突檢測：同一字在不同 combo 被指定到不同欄
    const wCol = new Int8Array(_iToW.length).fill(-1);
    for (const ci of activeCI) {
      const combo = _cIdx[ci];
      for (let p = 0; p < combo.length; p++) {
        const w = combo[p], c = cs[ci] + p;
        if (wCol[w] !== -1 && wCol[w] !== c) return false;
        wCol[w] = c;
      }
    }

    const sf = f0.slice();
    let cl = initCl;
    const path = [];

    for (let s = 0; s < totalSteps; s++) {
      const wIdx = seqIdx[s];
      const ci = wordToCi[wIdx];
      let col;

      if (ci >= 0 && !(cl & (1 << ci))) {
        col = cs[ci] + wordToPos[wIdx];
      } else {
        // 已消除或無所屬 → 找最空欄
        let mh = -1; col = 0;
        for (let c = 0; c < COLS; c++) {
          let h = 0;
          for (let r = 0; r < ROWS; r++) {
            if (sf[r * COLS + c] === 0) h++; else break;
          }
          if (h > mh) { mh = h; col = c; }
        }
      }

      let lr = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (sf[r * COLS + col] === 0) { lr = r; break; }
      }
      if (lr < 0) return false; // 溢出

      sf[lr * COLS + col] = wIdx;
      path.push({ word: fullSeq[s], col });

      const beforeCl = cl;
      const beforeBoard = debugMode ? sf.slice() : null;
      cl = simClear(sf, _cIdx, cl);

      if (debugMode && beforeBoard && cl !== beforeCl) {
        const delta = popcount(cl) - popcount(beforeCl);
        lastDebugSample =
          `消除樣本 (+${delta} 組)\n` +
          `落子: ${_iToW[wIdx]} -> col ${col}\n` +
          `消前:\n${flatToDebugText(beforeBoard)}\n` +
          `消後:\n${flatToDebugText(sf)}`;
      }
    }

    const cleared = popcount(cl);
    let space = 0;
    for (let c = 0; c < COLS; c++) {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (sf[r * COLS + c] === 0) { space += r + 1; break; }
      }
    }

    if (cleared > bestCl || (cleared === bestCl && space > bestSp)) {
      bestCl = cleared; bestSp = space; bestPath = path;
      if (autoMode && path.length > 0 && autoPlanStep <= 1) autoTargetCol = path[0].col;
      if (debugMode) {
        const firstMove = path[0] ? `${path[0].word}@col${path[0].col}` : "-";
        setDebugText(
          `最佳更新: ${cleared}/${numCombos} 組\n` +
          `首步: ${firstMove}\n` +
          `${lastDebugSample ? `${lastDebugSample}\n` : ""}` +
          `盤面:\n${flatToDebugText(sf)}`,
        );
      }
      return cleared === numCombos; // true = 全消，可提前停止
    }
    return false;
  }

  // ── 主迴圈：枚舉或取樣版型 ──
  const cs = new Uint8Array(numCombos);
  let perfect = false;

  for (let li = 0; li < layoutCount; li++) {
    if (myGen !== aiSearchGen) return;

    if (enumerate) {
      // 完整枚舉：將 li 解碼為各 combo 的起始欄
      let rem = li;
      for (let i = 0; i < N; i++) {
        cs[activeCI[i]] = rem % choices[i];
        rem = (rem / choices[i]) | 0;
      }
    } else {
      // 隨機取樣
      for (let i = 0; i < N; i++) {
        cs[activeCI[i]] = Math.floor(Math.random() * choices[i]);
      }
    }

    if (simulateLayout(cs)) { perfect = true; break; }

    // 定期讓出 UI
    if (li % 3000 === 2999) {
      setMessage(`🤖 模擬中 ${li + 1}/${layoutCount}（最佳 ${bestCl}/${numCombos}）`, true);
      await new Promise(r => setTimeout(r, 0));
      if (myGen !== aiSearchGen) return;
    }
  }

  if (myGen !== aiSearchGen) return;

  // ── 安裝最佳計畫 ──
  if (bestPath.length > 0) {
    autoPlan = bestPath;
    if (!planInstalled) autoPlanStep = 1;
    if (autoPlanStep <= 1 && bestPath.length > 0) autoTargetCol = bestPath[0].col;
  }
  if (autoTargetCol < 0) autoTargetCol = Math.floor(COLS / 2);

  const method = enumerate ? `完整枚舉 ${totalLayouts}` : `隨機取樣 ${MAX_LAYOUTS}`;
  const result = perfect ? "全消 ✓" : `${bestCl}/${numCombos} 組`;
  setMessage(`🤖 完成！${method} 版型 → ${result}`, true);
  aiComputing = false;
}

function toggleAutoMode() {
  autoMode = !autoMode;
  autoBtn.textContent = autoMode ? "手動" : "自動";
  autoBtn.classList.toggle("active", autoMode);
  if (autoMode && activeBlock) {
    aiSearchGen++;
    aiComputing = false;
    clearAutoPlan();
    autoTargetCol = findBestColumn();
    autoLastMoveTime = 0;
  } else {
    aiSearchGen++;
    autoTargetCol = -1;
    aiComputing = false;
    clearAutoPlan();
  }
}

function spawnBlock() {
  const word = nextWord();
  activeBlock = {
    row: 0,
    col: Math.floor(COLS / 2),
    word,
    color: nextWordColor(word),
  };

  if (board[0][activeBlock.col] !== null) {
    running = false;
    setMessage("遊戲結束：方塊堆到最上方", false);
    return;
  }

  if (autoMode) {
    autoTargetCol = findBestColumn();
  }
}

function canMoveTo(row, col) {
  if (!activeBlock) return false;
  if (col < 0 || col >= COLS || row >= ROWS) return false;
  return board[row][col] === null;
}

function moveHorizontal(dir) {
  if (!running || !activeBlock || animating) return;
  const nextCol = activeBlock.col + dir;
  if (canMoveTo(activeBlock.row, nextCol)) {
    activeBlock.col = nextCol;
    drawGrid();
  }
}

function hardDrop() {
  if (!running || !activeBlock || animating) return;
  while (canMoveTo(activeBlock.row + 1, activeBlock.col)) {
    activeBlock.row += 1;
  }
  placeActiveBlock();
}

function softDrop() {
  if (!running || !activeBlock || animating) return;
  const nextRow = activeBlock.row + 1;
  if (canMoveTo(nextRow, activeBlock.col)) {
    activeBlock.row = nextRow;
  } else {
    placeActiveBlock();
  }
}

function settleBoardGravity() {
  for (let col = 0; col < COLS; col += 1) {
    const stack = [];
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (board[row][col]) stack.push(board[row][col]);
    }
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      board[row][col] = stack[ROWS - 1 - row] || null;
    }
  }
}

function findMatchedGroups() {
  const groups = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (!board[row][col]) continue;
      for (let ci = 0; ci < comboList.length; ci++) {
        const combo = comboList[ci];
        if (col + combo.length > COLS) continue;
        let hit = true;
        for (let i = 0; i < combo.length; i += 1) {
          if (!board[row][col + i] || board[row][col + i].word !== combo[i]) {
            hit = false;
            break;
          }
        }
        if (hit) {
          const cells = combo.map((_, i) => ({ row, col: col + i }));
          groups.push({ cells, comboIndex: ci });
        }
      }
    }
  }
  return groups;
}

// ── 消除特效相關 ──

function spawnParticles(row, col, color) {
  const cx = col * cellSize + cellSize / 2;
  const cy = row * cellSize + cellSize / 2;
  const count = 8;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = 1.5 + Math.random() * 2.5;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 3 + Math.random() * 3,
      color,
      life: 1.0, // 1.0 → 0
    });
  }
}

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08; // 微重力
    p.life -= 0.03;
    p.r *= 0.97;
  }
  particles = particles.filter((p) => p.life > 0 && p.r > 0.3);
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// 閃爍 + 縮小動畫（Promise，播完才繼續）
function playClearAnimation(markedPositions) {
  return new Promise((resolve) => {
    const duration = 420; // ms
    const start = performance.now();

    // 記錄每格的顏色以便畫粒子
    const cellInfos = markedPositions.map(({ row, col }) => ({
      row,
      col,
      color: board[row][col]?.color || "#fff",
    }));

    // 產生粒子
    cellInfos.forEach(({ row, col, color }) => spawnParticles(row, col, color));

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1); // 0→1

      drawGrid();

      // 在被消除的格子上疊加特效
      for (const { row, col, color } of cellInfos) {
        const x = col * cellSize;
        const y = row * cellSize;
        const shrink = t * (cellSize / 2);

        // 白色閃爍（前半段亮，後半段淡出）
        const flash = t < 0.5 ? 0.7 : 0.7 * (1 - (t - 0.5) * 2);
        ctx.fillStyle = `rgba(255,255,255,${flash})`;
        ctx.fillRect(
          x + 1.5 + shrink,
          y + 1.5 + shrink,
          cellSize - 3 - shrink * 2,
          cellSize - 3 - shrink * 2,
        );
      }

      // 粒子已由 drawGrid() 內更新/繪製，不需要重複呼叫

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(tick);
  });
}

function updateProgress() {
  progressEl.textContent = `${clearedCombos.size}/${comboList.length}`;
}

async function clearMatches() {
  let totalCleared = 0;

  while (true) {
    const groups = findMatchedGroups();
    if (!groups.length) break;

    const marked = new Set();
    groups.forEach(({ cells, comboIndex }) => {
      clearedCombos.add(comboIndex);
      cells.forEach(({ row, col }) => marked.add(`${row}-${col}`));
    });

    const positions = [...marked].map((key) => {
      const [row, col] = key.split("-").map(Number);
      return { row, col };
    });

    // 播放消除動畫
    animating = true;
    await playClearAnimation(positions);
    animating = false;

    // 動畫結束後才真正清除
    positions.forEach(({ row, col }) => {
      board[row][col] = null;
    });

    totalCleared += positions.length;
    settleBoardGravity();
    updateProgress();
  }

  if (totalCleared > 0) {
    score += totalCleared;
    scoreEl.textContent = String(score);

    // 清理佇列：已消除 combo 的字不再出現
    purgeWordQueue();

    // 檢查是否破關
    if (clearedCombos.size >= comboList.length) {
      running = false;
      setMessage("🎉 恭喜破關！所有組合都已消除！", true);
      playClearAllAnimation();
      return;
    }

    setMessage(`消除 ${totalCleared} 格（${clearedCombos.size}/${comboList.length}）`, true);
  }
}

// 破關慶祝動畫：全畫面放煙火粒子
function playClearAllAnimation() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height * 0.6;
      for (let j = 0; j < 20; j++) {
        const angle = (Math.PI * 2 * j) / 20 + Math.random() * 0.3;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 3 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 1.0,
        });
      }
    }, i * 200);
  }
  // 讓粒子持續渲染一段時間
  let frames = 0;
  function celebrateTick() {
    drawGrid();
    frames++;
    if (frames < 120 || particles.length > 0) {
      requestAnimationFrame(celebrateTick);
    }
  }
  requestAnimationFrame(celebrateTick);
}

async function placeActiveBlock() {
  if (!activeBlock) return;
  const { row, col, word, color } = activeBlock;
  board[row][col] = { word, color };

  // ── 計畫過時檢測 ──
  // 若方塊落在非目標欄位，快取計畫失效（盤面已偏離假設）
  if (autoMode && autoPlan.length > 0 && autoTargetCol >= 0 && col !== autoTargetCol) {
    clearAutoPlan();
    aiSearchGen++;    // 取消正在進行的搜索
    aiComputing = false;
  }

  activeBlock = null;
  await clearMatches();
  if (running) spawnBlock();
}

// 將文字拆成多行，只依空白換行，不拆字
function wrapText(text, maxWidth, fontSize) {
  ctx.font = `bold ${fontSize}px sans-serif`;

  // 一行塞得下就不拆
  if (ctx.measureText(text).width <= maxWidth) return [text];

  // 沒有空白 → 不換行，靠縮小字體處理
  const spaceWords = text.split(/\s+/);
  if (spaceWords.length <= 1) return [text];

  // 依空白切行
  const lines = [];
  let current = "";
  for (const w of spaceWords) {
    const test = current ? current + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCell(row, col, cellData) {
  const x = col * cellSize;
  const y = row * cellSize;
  ctx.fillStyle = cellData.color;
  ctx.fillRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);

  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = cellSize - 6;
  let fontSize = Math.max(10, Math.floor(cellSize * 0.28));
  const lines = wrapText(cellData.word, maxWidth, fontSize);

  // 如果拆行後單行仍太長，縮小字體
  ctx.font = `bold ${fontSize}px sans-serif`;
  while (
    lines.some((line) => ctx.measureText(line).width > maxWidth) &&
    fontSize > 6
  ) {
    fontSize -= 1;
    ctx.font = `bold ${fontSize}px sans-serif`;
  }

  const lineHeight = fontSize + 2;
  const totalHeight = lines.length * lineHeight;
  const startY = y + cellSize / 2 - totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, x + cellSize / 2, startY + i * lineHeight);
  });
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      if (board[row][col]) drawCell(row, col, board[row][col]);
    }
  }
  if (activeBlock) drawCell(activeBlock.row, activeBlock.col, activeBlock);

  // 持續畫殘留粒子
  if (particles.length) {
    updateParticles();
    drawParticles();
  }
}

function gameLoop(ts) {
  if (!running) {
    drawGrid();
    return;
  }

  // 動畫播放中 → 暫停掉落（AI 計算中不再凍結）
  if (animating) {
    lastTick = ts;
  } else {
    if (!lastTick) lastTick = ts;
    if (ts - lastTick >= FALL_MS) {
      softDrop();
      lastTick = ts;
    }

    // 自動模式：一邊計算一邊移動
    if (autoMode && activeBlock) {
      if (autoTargetCol < 0) autoTargetCol = findBestColumn();
      if (autoTargetCol >= 0 && ts - autoLastMoveTime >= AUTO_MOVE_MS) {
        if (activeBlock.col !== autoTargetCol) {
          // 向目標欄移動（計算中也能移動）
          moveHorizontal(activeBlock.col < autoTargetCol ? 1 : -1);
        } else if (!aiComputing) {
          // 已到目標欄且 AI 計算完成 → 落下
          hardDrop();
          autoTargetCol = -1;
        }
        // 若到目標欄但 AI 仍在計算 → 等待（方塊自然掉落）
        autoLastMoveTime = ts;
      }
    }
  }

  drawGrid();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function restartGame() {
  // 每次重新開始都重新抽取
  comboList = pickRandomCombos();

  board = createEmptyBoard();
  activeBlock = null;
  score = 0;
  lastTick = 0;
  running = true;
  clearedCombos = new Set();
  particles = [];
  wordQueue = [];
  autoTargetCol = -1;
  autoLastMoveTime = 0;
  aiSearchGen++;            // 取消舊搜索
  aiComputing = false;
  clearAutoPlan();
  if (debugMode) setDebugText("");
  scoreEl.textContent = "0";
  updateProgress();

  const pickN = loadPickCount();
  const pickInfo = (pickN > 0 && pickN < allComboList.length)
    ? `（已抽 ${comboList.length}/${allComboList.length} 組）`
    : "";
  setMessage(`遊戲開始${pickInfo}，左/右移動，下鍵直接落地`, true);

  spawnBlock();
  cancelAnimationFrame(gameLoopId);
  gameLoopId = requestAnimationFrame(gameLoop);
}

function bindControls() {
  tapBind(leftBtn, () => { if (!autoMode) moveHorizontal(-1); });
  tapBind(rightBtn, () => { if (!autoMode) moveHorizontal(1); });
  tapBind(downBtn, () => { if (!autoMode) hardDrop(); });
  tapBind(restartBtn, restartGame);

  window.addEventListener("keydown", (event) => {
    if (autoMode) return;
    if (event.key === "ArrowLeft") moveHorizontal(-1);
    if (event.key === "ArrowRight") moveHorizontal(1);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      hardDrop();
    }
  });
}

function init() {
  preventZoom();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  bindControls();
  restartGame();
}

init();

