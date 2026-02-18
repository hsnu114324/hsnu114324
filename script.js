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
let nextWordQueue = []; // 下一輪派發佇列（預先建立，讓 AI 可以看到）
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

// 消除後清理佇列：移除只屬於已消除 combo 的字（兩個佇列都清理）
function purgeWordQueue() {
  const activeWords = new Set();
  for (let ci = 0; ci < comboList.length; ci++) {
    if (clearedCombos.has(ci)) continue;
    for (const w of comboList[ci]) activeWords.add(w);
  }
  wordQueue = wordQueue.filter((w) => activeWords.has(w));
  nextWordQueue = nextWordQueue.filter((w) => activeWords.has(w));
}

function ensureQueues() {
  // 確保 wordQueue 和 nextWordQueue 都有內容
  if (!wordQueue.length) {
    if (nextWordQueue.length) {
      // 把下一輪升級為當前
      wordQueue = nextWordQueue;
    } else {
      wordQueue = buildWordQueue();
    }
    // 預建下一輪
    nextWordQueue = buildWordQueue();
  }
  if (!nextWordQueue.length) {
    nextWordQueue = buildWordQueue();
  }
}

function nextWord() {
  ensureQueues();
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

  // 確保下一輪佇列已建立，讓 AI 可以看到兩輪
  ensureQueues();
  const fullSeq = [word, ...wordQueue, ...nextWordQueue];
  const seqIdx = Uint8Array.from(fullSeq.map(w => _wToI.get(w) || 0));
  const totalSteps = fullSeq.length;
  const numCombos = comboList.length;
  const TC = ROWS * COLS;

  // 計算狀態訊息：統一只顯示「步數 + 記憶體」
  function calcMemStr(states) {
    const bytes = states * (TC * 3 + 300);
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + "MB";
    return (bytes / 1024).toFixed(0) + "KB";
  }
  setMessage(`🤖 BFS 0/${totalSteps} | 記憶體 ${calcMemStr(1)}`, true);
  await new Promise(r => setTimeout(r, 0));
  if (myGen !== aiSearchGen) return;

  let initCl = 0;
  for (const ci of clearedCombos) initCl |= (1 << ci);
  const f0 = boardToFlat(board);
  let bestCl = popcount(initCl), bestSp = -1, bestPath = [];
  let ops = 0;
  let lastDebugSample = "";
  let planInstalled = false;

  // ── 偵錯：步驟追蹤 ──
  const debugSteps = []; // [{step, word, inSize, outSize, dedup, pruned, cleared, fixed, mem, event}]

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

  function buildDebugDiagram(currentStep, bestBoard) {
    if (!debugMode) return;
    const lines = [];
    lines.push("═══ BFS 搜索狀態 ═══");

    // combo 固定資訊
    const fixedInfoArr = [];
    try {
      if (fixedSet && fixedSet.size > 0) {
        for (const ci of fixedSet) {
          const name = _cIdx[ci].map(w => _iToW[w]).join(",");
          fixedInfoArr.push(`#${ci + 1}(${name})`);
        }
      }
    } catch (e) { /* fixedSet 尚未定義 */ }
    if (fixedInfoArr.length) lines.push("固定: " + fixedInfoArr.join(" "));
    else if (priCI >= 0) {
      const name = _cIdx[priCI].map(w => _iToW[w]).join(",");
      lines.push("優先: #" + (priCI + 1) + "(" + name + ") → col 0~" + (comboMaxEnd - 1));
    }

    // 找出 bar chart 的最大值（用於縮放）
    let maxSize = 1;
    for (const s of debugSteps) if (s.outSize > maxSize) maxSize = s.outSize;
    const barMax = 20; // bar 最大字元寬度

    // 表頭
    lines.push("步  字       分支圖                  入→出    事件");
    lines.push("─".repeat(60));

    for (const s of debugSteps) {
      const barLen = Math.max(1, Math.round(s.outSize / maxSize * barMax));
      const bar = "█".repeat(barLen) + "░".repeat(barMax - barLen);
      const wordStr = (s.word || "?").padEnd(8).slice(0, 8);
      const sizeStr = `${s.inSize}→${s.outSize}`.padEnd(10);

      let event = "";
      if (s.event) event = s.event;
      else {
        const parts = [];
        if (s.dedup > 0) parts.push(`去重${s.dedup}`);
        if (s.pruned > 0) parts.push(`✂${s.pruned}`);
        if (event === "" && parts.length) event = parts.join(" ");
      }

      const stepStr = String(s.step).padStart(2);
      lines.push(`${stepStr}  ${wordStr} [${bar}] ${sizeStr} ${event}`);
    }

    lines.push("─".repeat(60));
    // 固定狀態
    let fixSummary = "";
    try {
      if (fixedSet && fixedSet.size > 0) {
        fixSummary = `  固定: ${fixedSet.size}/${activeCI.length}組`;
      }
    } catch (e) {}
    lines.push(`最佳: ${bestCl}/${numCombos}${fixSummary}  峰值: ${peakStates}態 ${estimateMemoryStr(peakStates)}`);

    // 最佳盤面
    if (bestBoard) {
      lines.push("\n最佳盤面:");
      lines.push(flatToDebugText(bestBoard));
    }

    // 最新消除樣本
    if (lastDebugSample) {
      lines.push("\n" + lastDebugSample);
    }

    setDebugText(lines.join("\n"));
  }

  // ── 活躍 combo 與字映射 ──
  const activeCI = [];
  for (let ci = 0; ci < numCombos; ci++) if (!(initCl & (1 << ci))) activeCI.push(ci);

  if (activeCI.length === 0) {
    aiComputing = false;
    setMessage(`🤖 BFS 0/0 | 記憶體 ${calcMemStr(1)}`, true);
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

  // ── Phase 1: 掃描 Q 前 7 個字，找出最有可能的 combo ──
  const P1 = Math.min(7, totalSteps);
  const comboFreq = new Uint8Array(numCombos);
  for (let s = 0; s < P1; s++) {
    const ci = wordToCi[seqIdx[s]];
    if (ci >= 0) comboFreq[ci]++;
  }
  // 優先 combo = 前 7 中出現最多字的那組
  let priCI = -1, priMax = 0;
  for (const ci of activeCI) {
    if (comboFreq[ci] > priMax) { priMax = comboFreq[ci]; priCI = ci; }
  }

  // 只有優先 combo 的字有固定欄位，其他 combo 字當 garbage
  const wordFixedCol = new Int8Array(_iToW.length).fill(-1);
  let comboMaxEnd = 0; // 優先 combo 佔用的最右欄 +1
  if (priCI >= 0) {
    const combo = _cIdx[priCI];
    comboMaxEnd = combo.length;
    for (let p = 0; p < combo.length; p++) {
      wordFixedCol[combo[p]] = p; // col 0 + position
    }
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
        // tryUpdate 不直接 setDebugText，交給 buildDebugDiagram 統一顯示
        buildDebugDiagram(0, finalBoard);
      }
      return cleared === numCombos;
    }
    return false;
  }

  const priName = priCI >= 0 ? _cIdx[priCI].map(w => _iToW[w]).join(",") : "無";
  setMessage(`🤖 BFS 0/${totalSteps} | 記憶體 ${calcMemStr(1)}`, true);
  if (debugMode) setDebugText(`優先: ${priName}（佔 col 0~${comboMaxEnd - 1}），其餘 combo 為 garbage`);
  await new Promise(r => setTimeout(r, 0));
  if (myGen !== aiSearchGen) return;

  // Phase 1: 啟發式模擬前 P1 步
  const sf = f0.slice();
  let cl = initCl;
  const p1Path = [];
  let p1Ok = true;

  for (let s = 0; s < P1; s++) {
    const wIdx = seqIdx[s];
    const ci = wordToCi[wIdx];
    const fc = wordFixedCol[wIdx];
    let col;

    if (fc >= 0 && ci >= 0 && !(cl & (1 << ci))) {
      col = fc; // combo 字 → 固定欄位
    } else {
      // Garbage → 避開優先 combo 佔用的欄位，從右往左找最空
      let mh = -1; col = COLS - 1;
      for (let c = COLS - 1; c >= 0; c--) {
        // 優先 combo 尚未消除時，跳過它佔用的欄 (col 0 ~ comboMaxEnd-1)
        if (priCI >= 0 && !(cl & (1 << priCI)) && c < comboMaxEnd) continue;
        let h = 0;
        for (let r = 0; r < ROWS; r++) {
          if (sf[r * COLS + c] === 0) h++; else break;
        }
        if (h > mh) { mh = h; col = c; }
      }
      // fallback：所有非 combo 欄都滿了
      if (mh < 0) {
        for (let c = COLS - 1; c >= 0; c--) {
          let h = 0;
          for (let r = 0; r < ROWS; r++) {
            if (sf[r * COLS + c] === 0) h++; else break;
          }
          if (h > mh) { mh = h; col = c; }
        }
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
    const newCleared = popcount(cl) - popcount(bCl);
    if (debugMode && bB && cl !== bCl) {
      lastDebugSample =
        `消除 (+${newCleared} 組)\n` +
        `落: ${_iToW[wIdx]} → col ${col}\n` +
        `消前:\n${flatToDebugText(bB)}\n消後:\n${flatToDebugText(sf)}`;
    }
    // Phase 1 偵錯步驟
    if (debugMode) {
      const isCombo = fc >= 0 && ci >= 0;
      let ev = isCombo ? `c${col}(combo)` : `c${col}(垃圾)`;
      if (newCleared > 0) ev += ` ★消除+${newCleared}`;
      debugSteps.push({
        step: s + 1, word: _iToW[wIdx], inSize: 1, outSize: 1,
        dedup: 0, pruned: 0, cleared: popcount(cl), fixed: 0,
        mem: "P1", event: ev
      });
    }
    p1Path.push({ word: fullSeq[s], col });
    setMessage(`🤖 BFS ${s + 1}/${totalSteps} | 記憶體 ${calcMemStr(1)}`, true);
  }

  // Phase 1 結束 → 先用 Phase 1 的結果更新（確保偵錯能顯示）
  if (p1Ok) tryUpdate(sf, cl, [...p1Path]);

  // 記憶體估算（每個狀態 ≈ board + key string + Map entry + linked list）
  let peakStates = 1;
  function estimateMemoryStr(size) {
    const bytes = size * (TC * 3 + 300);
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'MB';
    return (bytes / 1024).toFixed(0) + 'KB';
  }

  if (p1Ok && P1 < totalSteps && bestCl < numCombos) {
    // 偵錯：顯示 Phase 1 完成狀態
    if (debugMode) {
      buildDebugDiagram(0, sf);
    }

    // ── Phase 2: 漸進剪枝 BFS ──
    // 每次消除一組 combo 後，掃描剩餘 Q 找下一個最多字的 combo 並固定欄位
    const p2Start = P1;
    const p2Len = totalSteps - p2Start;
    const MAX_STATES = 500000;

    // 動態固定欄位表（隨 combo 消除逐步擴展）
    const dynFixed = wordFixedCol.slice();
    const fixedSet = new Set(); // 已固定的 combo index
    if (priCI >= 0) fixedSet.add(priCI);
    let prevBestCleared = popcount(cl); // 追蹤已消除數，用於檢測新消除
    // 追蹤所有已固定 combo 佔用的最右欄 +1（garbage 要避開 0 ~ fixedMaxEnd-1）
    let fixedMaxEnd = comboMaxEnd;

    // 掃描剩餘 Q，找下一個最多字的未固定 combo 並固定；回傳新固定的 combo index（-1=無）
    function fixNextCombo(fromStep) {
      const freq = new Uint8Array(numCombos);
      for (let s = fromStep; s < totalSteps; s++) {
        const ci2 = wordToCi[seqIdx[s]];
        if (ci2 >= 0 && !fixedSet.has(ci2)) freq[ci2]++;
      }
      let nextCI = -1, nextMax = 0;
      for (const ci2 of activeCI) {
        if (!fixedSet.has(ci2) && freq[ci2] > nextMax) {
          nextMax = freq[ci2]; nextCI = ci2;
        }
      }
      if (nextCI >= 0) {
        fixedSet.add(nextCI);
        const combo = _cIdx[nextCI];
        for (let p = 0; p < combo.length; p++) {
          if (dynFixed[combo[p]] === -1) dynFixed[combo[p]] = p;
        }
        // 更新佔用欄位範圍
        if (combo.length > fixedMaxEnd) fixedMaxEnd = combo.length;
        if (debugMode) {
          const name = combo.map(w => _iToW[w]).join(",");
          setDebugText(
            `新剪枝: combo #${nextCI + 1}（${name}）固定 col 0~${combo.length - 1}\n` +
            `已固定 ${fixedSet.size}/${activeCI.length} 組，combo 佔用 col 0~${fixedMaxEnd - 1}`
          );
        }
      }
      return nextCI;
    }

    // ── 主動清理 frontier：移除落後或被堵死的狀態 ──
    function pruneFrontier() {
      const keysToRemove = [];
      for (const [key, state] of frontier) {
        const sc = popcount(state.cl);
        // 1) 落後超過 1 個 combo → 淘汰（不可能追上最佳）
        if (sc < prevBestCleared - 1) { keysToRemove.push(key); continue; }
        // 2) 檢查已固定 combo 的欄位是否被堵死
        let blocked = false;
        for (const ci of fixedSet) {
          if (state.cl & (1 << ci)) continue; // 此 combo 已消除，不用檢查
          const combo = _cIdx[ci];
          for (let p = 0; p < combo.length; p++) {
            let hasSpace = false;
            for (let r = 0; r < ROWS; r++) {
              if (state.board[r * COLS + p] === 0) { hasSpace = true; break; }
            }
            if (!hasSpace) { blocked = true; break; }
          }
          if (blocked) break;
        }
        if (blocked) keysToRemove.push(key);
      }
      for (const key of keysToRemove) frontier.delete(key);
      return keysToRemove.length;
    }

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
    peakStates = 1;
    let frontier = new Map();
    const initP1Tail = p1Path.reduce(
      (prev, m) => ({ word: m.word, col: m.col, prev }), null
    );
    frontier.set(stateKey(sf, cl), {
      board: sf.slice(), cl, firstCol: -1, pathTail: initP1Tail
    });

    let perfect = false;

    const YIELD_INTERVAL = 5000; // 每處理 N 個狀態讓出一次（更新 UI）

    for (let d = 0; d < p2Len && !perfect; d++) {
      if (myGen !== aiSearchGen) return;

      const wIdx = seqIdx[p2Start + d];
      const wordStr = fullSeq[p2Start + d];
      const nextFrontier = new Map();

      // 剪枝：已固定 combo 的字 → 只嘗試固定欄；其他字全搜索
      const wCi = wordToCi[wIdx];
      const fc2 = dynFixed[wIdx]; // >=0: 固定欄, -1: 未固定

      let statesDone = 0; // 本步已處理的狀態數
      const totalInFrontier = frontier.size;

      for (const [, state] of frontier) {
        // combo 字且 combo 尚未消除 → 只嘗試固定欄
        const useDetermined = fc2 >= 0 && wCi >= 0 && !(state.cl & (1 << wCi));

        for (let col = useDetermined ? fc2 : 0; col < (useDetermined ? fc2 + 1 : COLS); col++) {
          // 非固定字（garbage）→ 避開已固定 combo 佔用的欄位，除非所有 combo 欄的 combo 都已消除
          if (!useDetermined && col < fixedMaxEnd) {
            // 檢查此欄是否仍被活躍 combo 佔用
            let colNeeded = false;
            for (const ci of fixedSet) {
              if (!(state.cl & (1 << ci)) && col < _cIdx[ci].length) { colNeeded = true; break; }
            }
            if (colNeeded) continue; // 跳過 combo 佔用的欄位
          }
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
          const fCol = state.firstCol >= 0 ? state.firstCol : col;
          const newTail = { word: wordStr, col, prev: state.pathTail };

          if (!nextFrontier.has(key)) {
            nextFrontier.set(key, { board: nb, cl: nCl, firstCol: fCol, pathTail: newTail });
          }

          if (popcount(nCl) === numCombos) {
            const fullPath = pathToArray(newTail);
            if (tryUpdate(nb, nCl, fullPath)) { perfect = true; }
            break;
          }
        }
        if (perfect) break;

        // 每處理 YIELD_INTERVAL 個狀態，讓出控制權並更新 UI
        statesDone++;
        if (statesDone % YIELD_INTERVAL === 0) {
          const pct = Math.round(statesDone / totalInFrontier * 100);
          const mem = estimateMemoryStr(nextFrontier.size);
          setMessage(`🤖 BFS ${P1 + d + 1}/${totalSteps} ${pct}% | 記憶體 ${mem}`, true);
          await new Promise(r => setTimeout(r, 0));
          if (myGen !== aiSearchGen) return;
        }
      }
      if (perfect) break;

      // 計算去重數：嘗試的組合數 vs 實際保留的狀態數
      const rawBranches = totalInFrontier * (fc2 >= 0 ? 1 : COLS);
      const dedupCount = rawBranches - nextFrontier.size;

      frontier = nextFrontier;
      peakStates = Math.max(peakStates, frontier.size);

      // 找出 frontier 中最佳狀態
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

      if (stepBestState) {
        const fullPath = pathToArray(stepBestState.pathTail);
        tryUpdate(stepBestState.board, stepBestState.cl, fullPath);
      }

      // ── 漸進剪枝：如果最佳狀態消除了新的 combo → 固定下一組 + 主動清理 frontier ──
      let stepPruned = 0;
      let stepEvent = "";
      if (stepBestCl > prevBestCleared) {
        const clDelta = stepBestCl - prevBestCleared;
        prevBestCleared = stepBestCl;
        const newCI = fixNextCombo(p2Start + d + 1);
        // 主動清理：移除落後 / 被堵死的狀態，縮小記憶體
        stepPruned = pruneFrontier();
        peakStates = Math.max(peakStates, frontier.size);
        stepEvent = `★消除+${clDelta}`;
        if (newCI >= 0) {
          const cname = _cIdx[newCI].map(w => _iToW[w]).join(",");
          stepEvent += ` 固定#${newCI + 1}`;
        }
        if (stepPruned > 0) stepEvent += ` ✂${stepPruned}`;
      }

      // 安全上限
      let capPruned = 0;
      if (frontier.size > MAX_STATES) {
        const beforeCap = frontier.size;
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
        capPruned = beforeCap - frontier.size;
        stepEvent += (stepEvent ? " " : "") + `⚠截${capPruned}`;
      }

      // 偵錯：紀錄步驟
      if (debugMode) {
        const isCombo = fc2 >= 0;
        debugSteps.push({
          step: P1 + d + 1, word: _iToW[wIdx],
          inSize: totalInFrontier, outSize: frontier.size,
          dedup: Math.max(0, dedupCount), pruned: stepPruned + capPruned,
          cleared: stepBestCl, fixed: fixedSet.size,
          mem: estimateMemoryStr(frontier.size),
          event: stepEvent || (isCombo ? "combo" : "")
        });
        buildDebugDiagram(d + 1, stepBestState ? stepBestState.board : null);
      }

      const mem = estimateMemoryStr(frontier.size);
      setMessage(`🤖 BFS ${P1 + d + 1}/${totalSteps} | 記憶體 ${mem}`, true);
      await new Promise(r => setTimeout(r, 0));
      if (myGen !== aiSearchGen) return;
    }

  } // end Phase 2

  if (myGen !== aiSearchGen) return;

  // ── 安裝最佳方案 ──
  if (bestPath.length > 0 && !planInstalled) {
    autoPlan = bestPath;
    autoPlanStep = 1;
    if (bestPath.length > 0) autoTargetCol = bestPath[0].col;
  }
  if (autoTargetCol < 0) autoTargetCol = Math.floor(COLS / 2);

  const elapsed = (performance.now() - t0).toFixed(1);
  const peakMem = estimateMemoryStr(peakStates);
  setMessage(`🤖 BFS ${totalSteps}/${totalSteps} | 記憶體 ${peakMem}`, true);
  if (debugMode) {
    buildDebugDiagram(0, bestPath.length > 0 ? null : null);
    // 在圖表末尾追加完成資訊
    const cur = debugBoxEl.textContent || "";
    setDebugText(cur + `\n\n✅ 計算完成: ${ops}節點, ${elapsed}ms, 峰值${peakStates}態`);
  }
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
  nextWordQueue = [];
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

