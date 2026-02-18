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

// ── 自動模式 AI（模擬式前瞻）──
// 每次選欄時，對 6 個欄位各模擬跑完剩餘整場遊戲，
// 選擇能消除最多 combo、留下最多空間的那一欄。

// 複製棋盤（輕量：只保留 word）
function cloneBoard(b) {
  return b.map((row) => row.map((cell) => (cell ? { word: cell.word } : null)));
}

// 某欄的落點 row（-1 = 滿）
function simLandRow(b, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r][col] === null) return r;
  }
  return -1;
}

// 重力沉降
function simGravity(b) {
  for (let col = 0; col < COLS; col++) {
    const stack = [];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (b[row][col]) stack.push(b[row][col]);
    }
    for (let row = ROWS - 1; row >= 0; row--) {
      b[row][col] = stack[ROWS - 1 - row] || null;
    }
  }
}

// 消除 + 重力（可連鎖），回傳本次新消除的 combo 數
function simClear(b, combos, cleared) {
  let total = 0;
  let again = true;
  while (again) {
    again = false;
    for (let row = 0; row < ROWS; row++) {
      for (let ci = 0; ci < combos.length; ci++) {
        if (cleared.has(ci)) continue;
        const combo = combos[ci];
        for (let sc = 0; sc <= COLS - combo.length; sc++) {
          let hit = true;
          for (let i = 0; i < combo.length; i++) {
            if (!b[row][sc + i] || b[row][sc + i].word !== combo[i]) {
              hit = false;
              break;
            }
          }
          if (hit) {
            for (let i = 0; i < combo.length; i++) b[row][sc + i] = null;
            cleared.add(ci);
            total++;
            again = true;
          }
        }
      }
    }
    if (again) simGravity(b);
  }
  return total;
}

// 貪心選欄（模擬內部用，簡化但精確）
function greedyCol(b, word, combos, cleared) {
  const lrs = [];
  for (let c = 0; c < COLS; c++) lrs.push(simLandRow(b, c));
  let best = -1, bestS = -Infinity;

  for (let col = 0; col < COLS; col++) {
    const lr = lrs[col];
    if (lr < 0) continue;
    let s = 0;

    // A. combo 匹配 + 對齊
    for (let ci = 0; ci < combos.length; ci++) {
      if (cleared.has(ci)) continue;
      const combo = combos[ci];
      for (let wi = 0; wi < combo.length; wi++) {
        if (combo[wi] !== word) continue;
        const sc = col - wi;
        if (sc < 0 || sc + combo.length > COLS) continue;
        let mc = 0,
          ok = true,
          ae = 0,
          te = 0;
        for (let i = 0; i < combo.length; i++) {
          const cc = sc + i;
          if (i === wi) {
            mc++;
            continue;
          }
          const cell = b[lr][cc];
          if (cell && cell.word === combo[i]) mc++;
          else if (cell !== null) {
            ok = false;
            break;
          } else {
            te++;
            if (lrs[cc] === lr) ae++;
          }
        }
        if (!ok) continue;
        const v =
          mc >= combo.length
            ? 2000
            : mc * 80 + ae * 40 + (te > 0 && ae === te ? 120 : 0);
        s = Math.max(s, v);
      }
    }

    // B. 阻擋懲罰
    for (let ci = 0; ci < combos.length; ci++) {
      if (cleared.has(ci)) continue;
      const combo = combos[ci];
      for (let sc = 0; sc <= COLS - combo.length; sc++) {
        if (col < sc || col >= sc + combo.length) continue;
        const wi = col - sc;
        if (combo[wi] === word) continue;
        let mc = 0,
          blk = false;
        for (let i = 0; i < combo.length; i++) {
          if (i === wi) continue;
          const cell = b[lr][sc + i];
          if (cell && cell.word === combo[i]) mc++;
          else if (cell !== null) {
            blk = true;
            break;
          }
        }
        if (!blk && mc > 0) s -= mc * 60;
      }
    }

    // C. 正確欄位小獎勵
    for (let ci = 0; ci < combos.length; ci++) {
      if (cleared.has(ci)) continue;
      const combo = combos[ci];
      for (let wi = 0; wi < combo.length; wi++) {
        if (combo[wi] === word) {
          const sc = col - wi;
          if (sc >= 0 && sc + combo.length <= COLS) s += 10;
        }
      }
    }

    s += lr * 2;
    if (s > bestS) {
      bestS = s;
      best = col;
    }
  }
  return best >= 0 ? best : Math.floor(COLS / 2);
}

// 模擬剩餘整場遊戲，回傳評估分
function simulateGame(startBoard, queue, startCleared, combos) {
  const b = cloneBoard(startBoard);
  const cleared = new Set(startCleared);

  for (const word of queue) {
    // 跳過已消除 combo 的字
    let needed = false;
    for (let ci = 0; ci < combos.length; ci++) {
      if (!cleared.has(ci) && combos[ci].includes(word)) {
        needed = true;
        break;
      }
    }
    if (!needed) continue;

    const col = greedyCol(b, word, combos, cleared);
    const lr = simLandRow(b, col);
    if (lr < 0) break; // 溢出 → 遊戲結束
    b[lr][col] = { word };
    simClear(b, combos, cleared);
  }

  // 評分：消除 combo 數（大權重）+ 剩餘空間
  let score = cleared.size * 10000;
  for (let c = 0; c < COLS; c++) {
    const lr = simLandRow(b, c);
    score += (lr >= 0 ? lr : -ROWS) * 5;
  }
  return score;
}

// 主決策：對每一欄模擬放下後跑完剩餘遊戲，選最佳結果
function findBestColumn() {
  if (!activeBlock) return Math.floor(COLS / 2);
  const word = activeBlock.word;
  const queue = [...wordQueue]; // 完整的未來發牌序列

  let bestCol = Math.floor(COLS / 2);
  let bestScore = -Infinity;

  for (let col = 0; col < COLS; col++) {
    const lr = simLandRow(board, col);
    if (lr < 0) continue;

    // 模擬：在此欄放下當前字 → 消除 → 跑完剩餘遊戲
    const sb = cloneBoard(board);
    sb[lr][col] = { word };
    const sc = new Set(clearedCombos);
    simClear(sb, comboList, sc);
    const score = simulateGame(sb, queue, sc, comboList);

    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }
  return bestCol;
}

function toggleAutoMode() {
  autoMode = !autoMode;
  autoBtn.textContent = autoMode ? "手動" : "自動";
  autoBtn.classList.toggle("active", autoMode);
  if (autoMode && activeBlock) {
    autoTargetCol = findBestColumn();
    autoLastMoveTime = 0;
  } else {
    autoTargetCol = -1;
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

  // 動畫播放中暫停掉落
  if (!animating) {
    if (!lastTick) lastTick = ts;
    if (ts - lastTick >= FALL_MS) {
      softDrop();
      lastTick = ts;
    }

    // 自動模式：AI 移動 + 落下
    if (autoMode && activeBlock) {
      if (autoTargetCol < 0) autoTargetCol = findBestColumn();
      if (ts - autoLastMoveTime >= AUTO_MOVE_MS) {
        if (activeBlock.col !== autoTargetCol) {
          moveHorizontal(activeBlock.col < autoTargetCol ? 1 : -1);
        } else {
          hardDrop();
          autoTargetCol = -1;
        }
        autoLastMoveTime = ts;
      }
    }
  } else {
    lastTick = ts; // 重置計時，避免動畫結束後瞬間掉一大段
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

