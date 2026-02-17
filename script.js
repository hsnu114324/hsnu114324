const COLS = 6;
const ROWS = 5;
const FALL_MS = 550;
const STORAGE_KEY = "word_tetris_rows_v1";

/*const DEFAULT_WORD_ROWS = [
  "der -e,ice cream",
  "1,2,3,4,5",
  "-,所有格 第一格(Nominativ),所有格 第二格(Genitiv),所有格 第三格(Dativ),所有格 第四格(Akkusativ)",
  "der ich,mein ,meines,meinem,meinen",
  "der du,dein ,deines,deinem,deinen",
  "der er,sein ,seines,seinem,seinen",
  "der sie,ihr ,ihres,ihrem,ihren",
  "der es,sein ,seines,seinem,seinen",
  "der wir,unser ,unseres,unserem,unseren",
  "der ihr,euer ,eures,eurem,euren",
  "der sie,ihr ,ihres,ihrem,ihren",
  "der Sie,ihr ,ihres,ihrem,ihren",
  "das ich,mein ,meines,meinem,mein",
  "das du,dein ,deines,deinem,dein",
  "das er,sein ,seines,seinem,sein",
  "das sie,ihr ,ihres,ihrem,ihr",
  "das es,sein ,seines,seinem,sein",
  "das wir,unser ,unseres,unserem,unser",
  "das ihr,euer ,eures,eurem,euer",
  "das sie,ihr ,ihres,ihrem,ihr",
  "das Sie,ihr ,ihres,ihrem,ihr",
  "die ich,meine,meiner,meiner,meine",
  "die du,deine ,deiner,deiner,deine",
  "die er,seine ,seiner,seiner,seine",
  "die sie,ihre ,ihrer,ihrer,ihre",
  "die es,seine ,seiner,seiner,seine",
  "die wir,unsere ,unserer,unserer,unsere",
  "die ihr,eure ,eurer,eurer,eure",
  "die sie,ihre ,ihrer,ihrer,ihre",
  "die Sie,ihre ,ihrer,ihrer,ihre",
  "pl. ich,meine ,meiner,meinen,meine",
  "pl. du,deine ,deiner,deinen,deine",
  "pl. er,seine ,seiner,seinen,seine",
  "pl. sie,ihre ,ihrer,ihren,ihre",
  "pl. es,seine ,seiner,seinen,seine",
  "pl. wir,unsere ,unserer,unseren,unsere",
  "pl. ihr,eure ,eurer,euren,eure",
  "pl. sie,ihre ,ihrer,ihren,ihre",
  "pl. Sie,ihre ,ihrer,ihren,ihre",
  "-,第一格(Nominativ),第二格(Genitiv),第三格(Dativ),第四格(Akkusativ)",
  "陽性 der,der Mann,des,dem Mann,den Mann",
  "陽性 ein,ein Mann,eines ,einem Mann,einen Mann",
  "陽性 kein,kein Mann,keines,keinem Mann,keinen Mann",
  "陽性 welcher,welcher,-,welchem,welchen",
  "陽性 dieser,dieser,dieses,diesem,diesen",
  "中性 das,das Kind,des,dem Kind,das Kind",
  "中性 ein,ein Kind,eines,einem Kind,ein Kind",
  "中性 kein,kein Kind,keines,keinem Kind,kein Kind",
  "中性 welches,welches,-,welchem,welches",
  "中性 dieses,dieses,dieses,diesem,dieses",
  "陰性 die,die Frau,der,der Frau,die Frau",
  "陰性 eine ,eine Frau,einer,einer Frau,eine Frau",
  "陰性 keine,keine Frau,keiner,keiner Frau,keine Frau",
  "陰性 welche,welche,-,welcher,welche",
  "陰性 diese,diese,dieser,dieser,diese",
  "複數 die,die Leute,der,den Leuten,die Leute",
  "複數 -, - Leute,-, - Leuten, - Leute",
  "複數 keine,keine Leute,keiner,keinen Leuten,keine Leute",
  "複數 welche,welche,-,welchen,welche",
  "複數 diese,diese,dieser,diesen,diese",
  "陽性 der,der -e,des -en -s,dem -en,den -en",
  "陽性 ein,ein -er,eines -en -s,einem -en,einen -en",
  "陽性 kein,kein -er,keines -en -s,keinem -en,keinen -en",
  "中性 das,das -e,des -en -s,dem -en,das -e",
  "中性 ein,ein -es,eines -en -s,einem -en,ein -es",
  "中性 kein,kein -es,keines -en -s,keinem -en,kein -es",
  "陰性 die,die -e,der -en,der -en,die -e",
  "陰性 eine ,eine -e,einer -en,einer -en,eine -e",
  "陰性 keine,keine -e,keiner -en,keiner -en,keine -e",
  "複數 die,die -en,der -en,den -en n,die -en",
  "複數 -,-e,-er,-en n,-e",
  "複數 keine,keine -en,keiner -en,keinen -en n,keine -en"

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
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const leftBtn = document.getElementById("leftBtn");
const downBtn = document.getElementById("downBtn");
const rightBtn = document.getElementById("rightBtn");

const WORD_ROWS = loadWordRows();
const comboList = buildComboList(WORD_ROWS);
const wordPool = [...new Set(comboList.flat())];

let cellSize = 44;
let board = createEmptyBoard();
let activeBlock = null;
let score = 0;
let lastTick = 0;
let gameLoopId = null;
let running = true;

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

function randomWord() {
  const idx = Math.floor(Math.random() * wordPool.length);
  return wordPool[idx];
}

function spawnBlock() {
  const word = randomWord();
  activeBlock = {
    row: 0,
    col: Math.floor(COLS / 2),
    word,
    color: nextWordColor(word),
  };

  if (board[0][activeBlock.col] !== null) {
    running = false;
    setMessage("遊戲結束：方塊堆到最上方", false);
  }
}

function canMoveTo(row, col) {
  if (!activeBlock) return false;
  if (col < 0 || col >= COLS || row >= ROWS) return false;
  return board[row][col] === null;
}

function moveHorizontal(dir) {
  if (!running || !activeBlock) return;
  const nextCol = activeBlock.col + dir;
  if (canMoveTo(activeBlock.row, nextCol)) {
    activeBlock.col = nextCol;
    drawGrid();
  }
}

function hardDrop() {
  if (!running || !activeBlock) return;
  while (canMoveTo(activeBlock.row + 1, activeBlock.col)) {
    activeBlock.row += 1;
  }
  placeActiveBlock();
}

function softDrop() {
  if (!running || !activeBlock) return;
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
      for (const combo of comboList) {
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
          groups.push(cells);
        }
      }
    }
  }
  return groups;
}

function clearMatches() {
  let totalCleared = 0;
  while (true) {
    const groups = findMatchedGroups();
    if (!groups.length) break;

    const marked = new Set();
    groups.forEach((cells) => {
      cells.forEach(({ row, col }) => marked.add(`${row}-${col}`));
    });

    marked.forEach((key) => {
      const [row, col] = key.split("-").map(Number);
      board[row][col] = null;
    });

    totalCleared += marked.size;
    settleBoardGravity();
  }

  if (totalCleared > 0) {
    score += totalCleared;
    scoreEl.textContent = String(score);
    setMessage(`消除 ${totalCleared} 格`, true);
  }
}

function placeActiveBlock() {
  if (!activeBlock) return;
  const { row, col, word, color } = activeBlock;
  board[row][col] = { word, color };
  activeBlock = null;
  clearMatches();
  if (running) spawnBlock();
}

function drawCell(row, col, cellData) {
  const x = col * cellSize;
  const y = row * cellSize;
  ctx.fillStyle = cellData.color;
  ctx.fillRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);

  ctx.fillStyle = "#111";
  ctx.font = `bold ${Math.max(10, Math.floor(cellSize * 0.2))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(cellData.word, x + cellSize / 2, y + cellSize / 2);
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
}

function gameLoop(ts) {
  if (!running) {
    drawGrid();
    return;
  }

  if (!lastTick) lastTick = ts;
  if (ts - lastTick >= FALL_MS) {
    softDrop();
    lastTick = ts;
  }

  drawGrid();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function restartGame() {
  board = createEmptyBoard();
  activeBlock = null;
  score = 0;
  lastTick = 0;
  running = true;
  scoreEl.textContent = "0";
  setMessage("遊戲開始，左/右移動，下鍵直接落地", true);
  spawnBlock();
  cancelAnimationFrame(gameLoopId);
  gameLoopId = requestAnimationFrame(gameLoop);
}

function bindControls() {
  tapBind(leftBtn, () => moveHorizontal(-1));
  tapBind(rightBtn, () => moveHorizontal(1));
  tapBind(downBtn, hardDrop);
  tapBind(restartBtn, restartGame);

  window.addEventListener("keydown", (event) => {
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

