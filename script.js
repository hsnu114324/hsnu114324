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

// ── 兩階段搜索：Phase 1 啟發式 + Phase 2 全 DFS ──
// Phase 1: 分析前 7 個字，找出最多字的 combo 優先放底部，其餘 garbage
// Phase 2: 剩餘字用全搜索（DFS + 上界剪枝 + combo 合法欄優先）
async function runAISearch(word) {
  const myGen = ++aiSearchGen;
  aiComputing = true;
  buildWordIndex();
  const t0 = performance.now();

  const fullSeq = [word, ...wordQueue];
  const seqIdx = Uint8Array.from(fullSeq.map(w => _wToI.get(w) || 0));
  const totalSteps = fullSeq.length;
  const numCombos = comboList.length;
  const TC = ROWS * COLS;

  setMessage(`🤖 分析中...`, true);
  await new Promise(r => setTimeout(r, 0));
  if (myGen !== aiSearchGen) return;

  let initCl = 0;
  for (const ci of clearedCombos) initCl |= (1 << ci);
  const f0 = boardToFlat(board);
  let bestCl = popcount(initCl), bestSp = -1, bestPath = [];
  let ops = 0;
  let lastDebugSample = "";
  let planInstalled = false;

  function flatToDebugText(flat) {
    const lines = [];
    for (let r = 0; r < ROWS; r++) {
      const cs = [];
      for (let c = 0; c < COLS; c++) {
        const v = flat[r * COLS + c];
        cs.push(v === 0 ? "." : (_iToW[v] || String(v)));
      }
      lines.push(cs.join(" "));
    }
    return lines.join("\n");
  }

  // ── 活躍 combo 與字映射 ──
  const activeCI = [];
  for (let ci = 0; ci < numCombos; ci++) if (!(initCl & (1 << ci))) activeCI.push(ci);

  if (activeCI.length === 0) {
    aiComputing = false;
    setMessage(`🤖 所有組合已消除！`, true);
    return;
  }

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

  // ── Phase 1: 分析前 7 個字 ──
  const P1 = Math.min(7, totalSteps);
  const comboFreq = new Uint8Array(numCombos);
  for (let s = 0; s < P1; s++) {
    const ci = wordToCi[seqIdx[s]];
    if (ci >= 0) comboFreq[ci]++;
  }

  // 優先 combo = 前 7 中出現最多的
  let priCI = -1, priMax = 0;
  for (const ci of activeCI) {
    if (comboFreq[ci] > priMax) { priMax = comboFreq[ci]; priCI = ci; }
  }

  // 優先 combo 起始欄：從 col 0 開始（放左邊）
  const priStarts = [];
  if (priCI >= 0) {
    priStarts.push(0); // combo 放最左邊
  } else {
    priStarts.push(-1);
  }

  // 更新最佳結果
  function tryUpdate(finalBoard, clMask, path) {
    const cleared = popcount(clMask);
    let space = 0;
    for (let c = 0; c < COLS; c++)
      for (let r = ROWS - 1; r >= 0; r--)
        if (finalBoard[r * COLS + c] === 0) { space += r + 1; break; }
    if (cleared > bestCl || (cleared === bestCl && space > bestSp)) {
      bestCl = cleared; bestSp = space; bestPath = path;
      autoPlan = path;
      if (!planInstalled) { autoPlanStep = 1; planInstalled = true; }
      if (autoPlanStep <= 1 && path.length > 0) autoTargetCol = path[0].col;
      if (debugMode) {
        const fm = path[0] ? `${path[0].word}@c${path[0].col}` : "-";
        const p1Info = path.slice(0, P1).map((m, i) => `${i + 1}.${m.word}→c${m.col}`).join(" ");
        setDebugText(
          `最佳: ${cleared}/${numCombos}\n首步: ${fm}\n` +
          `Phase1(前${P1}步): ${p1Info}\n` +
          `${lastDebugSample ? lastDebugSample + "\n" : ""}` +
          `盤面:\n${flatToDebugText(finalBoard)}`
        );
      }
      return cleared === numCombos;
    }
    return false;
  }

  setMessage(`🤖 優先組合 #${priCI >= 0 ? priCI + 1 : "無"}（${priStarts.length} 起始欄）`, true);
  await new Promise(r => setTimeout(r, 0));
  if (myGen !== aiSearchGen) return;

  // ── 嘗試每個優先起始欄 ──
  for (const psc of priStarts) {
    if (myGen !== aiSearchGen) return;

    // Phase 1: 啟發式模擬前 P1 步
    const sf = f0.slice();
    let cl = initCl;
    const p1Path = [];
    let p1Ok = true;

    for (let s = 0; s < P1; s++) {
      const wIdx = seqIdx[s];
      const ci = wordToCi[wIdx];
      const pos = wordToPos[wIdx];
      let col;

      if (ci === priCI && psc >= 0 && !(cl & (1 << priCI))) {
        col = psc + pos; // 優先 combo → 指定位置
      } else {
        // Garbage → 最空的右側欄（從右往左掃，同高取最右）
        let mh = -1; col = COLS - 1;
        for (let c = COLS - 1; c >= 0; c--) {
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
      if (lr < 0) { p1Ok = false; break; }

      sf[lr * COLS + col] = wIdx;
      const bCl = cl;
      const bB = debugMode ? sf.slice() : null;
      cl = simClear(sf, _cIdx, cl);
      if (debugMode && bB && cl !== bCl) {
        lastDebugSample =
          `消除 (+${popcount(cl) - popcount(bCl)} 組)\n` +
          `落: ${_iToW[wIdx]} → col ${col}\n` +
          `消前:\n${flatToDebugText(bB)}\n消後:\n${flatToDebugText(sf)}`;
      }
      p1Path.push({ word: fullSeq[s], col });
    }

    if (!p1Ok) continue;

    // Phase 1 涵蓋全部步驟
    if (P1 >= totalSteps) {
      if (tryUpdate(sf, cl, [...p1Path])) break;
      continue;
    }

    // ── Phase 2: 全狀態空間模擬 ──
    // BFS：每步展開所有可達狀態，去重後保留唯一狀態
    const p2Start = P1;
    const p2Len = totalSteps - p2Start;
    const MAX_STATES = 500000;

    // Path linked list：{ word, col, prev }
    function pathToArray(tail) {
      const arr = [];
      let n = tail;
      while (n) { arr.push({ word: n.word, col: n.col }); n = n.prev; }
      arr.reverse();
      return arr;
    }

    function stateKey(b, clMask) {
      let k = "";
      for (let i = 0; i < TC; i++) k += String.fromCharCode(b[i]);
      k += String.fromCharCode(clMask & 0xffff, (clMask >> 16) & 0xffff);
      return k;
    }

    // 初始 frontier
    let frontier = new Map();
    const initP1Tail = p1Path.reduce(
      (prev, m) => ({ word: m.word, col: m.col, prev }), null
    );
    frontier.set(stateKey(sf, cl), {
      board: sf.slice(), cl, firstCol: -1, pathTail: initP1Tail
    });

    let perfect = false;

    for (let d = 0; d < p2Len && !perfect; d++) {
      if (myGen !== aiSearchGen) return;

      const wIdx = seqIdx[p2Start + d];
      const wordStr = fullSeq[p2Start + d];
      const nextFrontier = new Map();

      // 剪枝：屬於優先 combo 且尚未消除 → 只嘗試指定欄
      const wCi = wordToCi[wIdx];
      const wPos = wordToPos[wIdx];
      const determined = (wCi === priCI && psc >= 0 && wPos >= 0);

      for (const [, state] of frontier) {
        // 如果該 combo 已在此狀態中被消除，就不再限制
        const useDetermined = determined && !(state.cl & (1 << priCI));
        const colStart = useDetermined ? (psc + wPos) : 0;
        const colEnd = useDetermined ? (psc + wPos + 1) : COLS;

        for (let col = colStart; col < colEnd; col++) {
          // 找落點
          let lr = -1;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (state.board[r * COLS + col] === 0) { lr = r; break; }
          }
          if (lr < 0) continue;

          const nb = state.board.slice();
          nb[lr * COLS + col] = wIdx;

          const bCl = state.cl;
          const bB = debugMode ? nb.slice() : null;
          const nCl = simClear(nb, _cIdx, bCl);
          ops++;

          if (debugMode && bB && nCl !== bCl) {
            lastDebugSample =
              `消除 (+${popcount(nCl) - popcount(bCl)} 組)\n` +
              `落: ${_iToW[wIdx]} → col ${col}\n` +
              `消前:\n${flatToDebugText(bB)}\n消後:\n${flatToDebugText(nb)}`;
          }

          const key = stateKey(nb, nCl);
          const fc = state.firstCol >= 0 ? state.firstCol : col;
          const newTail = { word: wordStr, col, prev: state.pathTail };

          if (!nextFrontier.has(key)) {
            nextFrontier.set(key, { board: nb, cl: nCl, firstCol: fc, pathTail: newTail });
          }

          // 全消 → 立刻停止
          if (popcount(nCl) === numCombos) {
            const fullPath = pathToArray(newTail);
            if (tryUpdate(nb, nCl, fullPath)) { perfect = true; }
            break;
          }
        }
        if (perfect) break;
      }
      if (perfect) break;

      frontier = nextFrontier;

      // 每步結束後，找出當前 frontier 中最佳狀態並嘗試更新
      let stepBestCl = -1, stepBestSp = -1, stepBestState = null;
      for (const [, state] of frontier) {
        const cleared = popcount(state.cl);
        let space = 0;
        for (let c = 0; c < COLS; c++)
          for (let r = ROWS - 1; r >= 0; r--)
            if (state.board[r * COLS + c] === 0) { space += r + 1; break; }
        if (cleared > stepBestCl || (cleared === stepBestCl && space > stepBestSp)) {
          stepBestCl = cleared; stepBestSp = space; stepBestState = state;
        }
      }
      // 最後一步或中間有更好解 → 更新
      if (stepBestState && (d === p2Len - 1 || stepBestCl > bestCl)) {
        const fullPath = pathToArray(stepBestState.pathTail);
        tryUpdate(stepBestState.board, stepBestState.cl, fullPath);
      }

      // 安全上限：狀態過多時保留最佳的
      if (frontier.size > MAX_STATES) {
        const arr = [...frontier.entries()];
        arr.sort((a, b) => {
          const clA = popcount(a[1].cl), clB = popcount(b[1].cl);
          if (clA !== clB) return clB - clA;
          let spA = 0, spB = 0;
          for (let c = 0; c < COLS; c++) {
            for (let r = ROWS - 1; r >= 0; r--)
              if (a[1].board[r * COLS + c] === 0) { spA += r + 1; break; }
            for (let r = ROWS - 1; r >= 0; r--)
              if (b[1].board[r * COLS + c] === 0) { spB += r + 1; break; }
          }
          return spB - spA;
        });
        frontier = new Map(arr.slice(0, MAX_STATES));
      }

      // 定期讓出 UI
      setMessage(`🤖 全狀態 步${d + 1}/${p2Len}（${frontier.size} 狀態，最佳 ${bestCl}/${numCombos}）`, true);
      await new Promise(r => setTimeout(r, 0));
      if (myGen !== aiSearchGen) return;
    }

    if (bestCl === numCombos) break;
  }

  if (myGen !== aiSearchGen) return;

  // ── 安裝最佳方案 ──
  if (bestPath.length > 0 && !planInstalled) {
    autoPlan = bestPath;
    autoPlanStep = 1;
    if (bestPath.length > 0) autoTargetCol = bestPath[0].col;
  }
  if (autoTargetCol < 0) autoTargetCol = Math.floor(COLS / 2);

  const elapsed = (performance.now() - t0).toFixed(1);
  setMessage(`🤖 完成！${bestCl}/${numCombos} 組（${ops} 節點，${elapsed} ms）`, true);
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

