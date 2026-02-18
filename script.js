const COLS = 6;
const ROWS = 8;
const FALL_MS = 550;
const STORAGE_KEY = "word_tetris_rows_v1";

/*
const DEFAULT_WORD_ROWS = [
  "der -e,ice cream",
  "1,2,3,4,5",
];
*/

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
const leftBtn = document.getElementById("leftBtn");
const downBtn = document.getElementById("downBtn");
const rightBtn = document.getElementById("rightBtn");

const PICK_KEY = "word_tetris_pick_count_v1";
const ALL_WORD_ROWS = loadWordRows();
const allComboList = buildComboList(ALL_WORD_ROWS);

let comboList = [];
let wordPool = [];

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

// ── 自動模式 AI（完全最優解 — DFS + 固定雜湊表，極省記憶體）──
// BFS 需同時保存所有狀態 + 鏈結串列 → 記憶體大
// DFS 只保留當前路徑（~15 層）+ 固定大小雜湊表去重 → 記憶體極小
// 用 generator 實現 DFS 暫停/恢復，每 N 步 yield 更新進度

// ── 字詞索引表 ──
let _wToI = null;
let _iToW = null;
let _cIdx = null;

function buildWordIndex() {
  _wToI = new Map();
  _iToW = [""];
  for (const combo of comboList) {
    for (const w of combo) {
      if (!_wToI.has(w)) { _wToI.set(w, _iToW.length); _iToW.push(w); }
    }
  }
  _cIdx = comboList.map((combo) => Uint8Array.from(combo.map((w) => _wToI.get(w))));
}

// 真實 2D 棋盤 → Uint8Array
function boardToFlat(b) {
  const f = new Uint8Array(ROWS * COLS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = b[r][c];
      if (cell !== null) {
        const w = typeof cell === "string" ? cell : cell.word;
        f[r * COLS + c] = _wToI.get(w) || 0;
      }
    }
  }
  return f;
}

function simLandRow(f, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (f[r * COLS + col] === 0) return r;
  }
  return -1;
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
  let cl = cleared;
  let again = true;
  while (again) {
    again = false;
    for (let row = 0; row < ROWS; row++) {
      const base = row * COLS;
      for (let ci = 0; ci < combos.length; ci++) {
        if (cl & (1 << ci)) continue;
        const combo = combos[ci];
        const clen = combo.length;
        for (let sc = 0; sc <= COLS - clen; sc++) {
          let hit = true;
          for (let i = 0; i < clen; i++) {
            if (f[base + sc + i] !== combo[i]) { hit = false; break; }
          }
          if (hit) {
            for (let i = 0; i < clen; i++) f[base + sc + i] = 0;
            cl |= (1 << ci);
            again = true;
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

// ── 固定大小雜湊表（Uint32Array，零 GC 壓力）──
const HTABLE_BITS = 14;                   // 16384 slots
const HTABLE_SIZE = 1 << HTABLE_BITS;
const HTABLE_MASK = HTABLE_SIZE - 1;
let _htable = null;                        // Uint32Array(HTABLE_SIZE)

function stateHash(f, cl, step) {
  let h = 0x811c9dc5;
  h = Math.imul(h ^ (step * 397), 0x01000193);
  for (let i = 0; i < f.length; i++) {
    h = Math.imul(h ^ f[i], 0x01000193);
  }
  h = Math.imul(h ^ cl, 0x01000193);
  return (h >>> 0) || 1; // 避免 0（空標記）
}

function hashMarkIfNew(hash) {
  let idx = hash & HTABLE_MASK;
  for (let i = 0; i < 32; i++) {
    if (_htable[idx] === 0) { _htable[idx] = hash; return true; }
    if (_htable[idx] === hash) return false;
    idx = (idx + 1) & HTABLE_MASK;
  }
  return true; // 探測鏈太長，視為新狀態
}

// 清除快取計畫
function clearAutoPlan() {
  autoPlan = [];
  autoPlanStep = 0;
}

// 同步入口
function findBestColumn() {
  if (!activeBlock) return Math.floor(COLS / 2);
  const word = activeBlock.word;

  if (autoPlan.length > 0 && autoPlanStep < autoPlan.length) {
    const planned = autoPlan[autoPlanStep];
    if (planned.word === word) {
      autoPlanStep++;
      return planned.col;
    }
    clearAutoPlan();
  }

  runAISearch(word);
  return -1;
}

// ── DFS generator：暫停/恢復式深度搜索 ──
function* dfsGen(f, cl, step, seqIdx, fullSeq, pathBuf, result) {
  result.ops++;
  if (result.ops % 300 === 0) yield; // 每 300 步交還控制權

  // 雜湊去重
  if (!hashMarkIfNew(stateHash(f, cl, step))) return;

  // 終點：評估
  if (step >= seqIdx.length) {
    const cleared = popcount(cl);
    let space = 0;
    for (let c = 0; c < COLS; c++) {
      const lr = simLandRow(f, c);
      space += lr >= 0 ? lr + 1 : 0;
    }
    if (cleared > result.bestCleared ||
       (cleared === result.bestCleared && space > result.bestSpace)) {
      result.bestCleared = cleared;
      result.bestSpace = space;
      result.bestPath = [...pathBuf];
    }
    return;
  }

  const wIdx = seqIdx[step];

  // 檢查是否需要
  let needed = false;
  for (let ci = 0; ci < _cIdx.length; ci++) {
    if (!(cl & (1 << ci)) && _cIdx[ci].includes(wIdx)) {
      needed = true;
      break;
    }
  }

  if (!needed) {
    yield* dfsGen(f, cl, step + 1, seqIdx, fullSeq, pathBuf, result);
    return;
  }

  const wStr = fullSeq[step];
  for (let col = 0; col < COLS; col++) {
    if (!autoMode) return; // 使用者取消
    const lr = simLandRow(f, col);
    if (lr < 0) continue;

    const nf = f.slice();
    nf[lr * COLS + col] = wIdx;
    const nc = simClear(nf, _cIdx, cl);

    pathBuf.push({ word: wStr, col });
    yield* dfsGen(nf, nc, step + 1, seqIdx, fullSeq, pathBuf, result);
    pathBuf.pop();
  }
}

// 非同步搜索入口
async function runAISearch(word) {
  aiComputing = true;
  buildWordIndex();

  const fullSeq = [word];
  for (const w of wordQueue) {
    let active = false;
    for (let ci = 0; ci < comboList.length; ci++) {
      if (!clearedCombos.has(ci) && comboList[ci].includes(w)) {
        active = true;
        break;
      }
    }
    if (active) fullSeq.push(w);
  }
  const seqIdx = fullSeq.map((w) => _wToI.get(w) || 0);

  setMessage(`🤖 搜索中...`, true);
  await new Promise((r) => requestAnimationFrame(r));

  let initCl = 0;
  for (const ci of clearedCombos) initCl |= (1 << ci);
  const f0 = boardToFlat(board);

  // 初始化固定雜湊表（64 KB）
  _htable = new Uint32Array(HTABLE_SIZE);

  const result = { ops: 0, bestCleared: -1, bestSpace: -1, bestPath: null };
  const pathBuf = [];
  const gen = dfsGen(f0, initCl, 0, seqIdx, fullSeq, pathBuf, result);

  // 驅動 generator，每次 yield 更新進度
  while (true) {
    const { done } = gen.next();
    if (done) break;
    setMessage(
      `🤖 搜索中 ${result.ops} 步（最佳 ${Math.max(0, result.bestCleared)}/${comboList.length}）`,
      true
    );
    await new Promise((r) => requestAnimationFrame(r));
    if (!autoMode) break;
  }

  _htable = null; // 釋放雜湊表

  if (result.bestPath && result.bestPath.length > 0) {
    autoPlan = result.bestPath;
    autoPlanStep = 1;
    autoTargetCol = autoPlan[0].col;
  }
  if (autoTargetCol < 0) autoTargetCol = Math.floor(COLS / 2);

  setMessage(
    `🤖 完成！最優 ${Math.max(0, result.bestCleared)}/${comboList.length} 組（${result.ops} 步）`,
    true
  );
  aiComputing = false;
}

function toggleAutoMode() {
  autoMode = !autoMode;
  autoBtn.textContent = autoMode ? "手動" : "自動";
  autoBtn.classList.toggle("active", autoMode);
  if (autoMode && activeBlock) {
    clearAutoPlan();
    autoTargetCol = findBestColumn(); // 快取命中→同步；否則啟動非同步搜索
    autoLastMoveTime = 0;
  } else {
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

      // 更新並畫粒子
      updateParticles();
      drawParticles();

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
  const cols = COLS;
  const rows = ROWS;
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

  // AI 計算中或動畫播放中 → 暫停掉落
  if (aiComputing || animating) {
    lastTick = ts; // 重置計時，避免恢復後瞬間掉一大段
  } else {
    if (!lastTick) lastTick = ts;
    if (ts - lastTick >= FALL_MS) {
      softDrop();
      lastTick = ts;
    }

    // 自動模式：AI 移動 + 落下
    if (autoMode && activeBlock) {
      if (autoTargetCol < 0) autoTargetCol = findBestColumn();
      if (autoTargetCol >= 0 && ts - autoLastMoveTime >= AUTO_MOVE_MS) {
        if (activeBlock.col !== autoTargetCol) {
          moveHorizontal(activeBlock.col < autoTargetCol ? 1 : -1);
        } else {
          hardDrop();
          autoTargetCol = -1;
        }
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
  wordPool = [...new Set(comboList.flat())];

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
  aiComputing = false;
  clearAutoPlan();
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

