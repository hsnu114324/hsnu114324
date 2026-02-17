const STORAGE_KEY = "word_tetris_rows_v1";
const DEFAULT_WORD_ROWS = ["ice,cream", "1,2,3,4,5"];

const rowListEl = document.getElementById("rowList");
const messageEl = document.getElementById("message");
const newRowInput = document.getElementById("newRowInput");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

let rows = loadRows();

function preventDoubleTapZoom() {
  let lastTouchEnd = 0;

  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 320) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false },
  );

  document.addEventListener(
    "dblclick",
    (event) => {
      event.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener(
    "gesturestart",
    (event) => {
      event.preventDefault();
    },
    { passive: false },
  );
}

function isValidRowString(row) {
  if (typeof row !== "string") return false;
  const words = row
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return words.length >= 2 && words.length <= 5;
}

function normalizeRowString(row) {
  return row
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(",");
}

function loadRows() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_WORD_ROWS];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_WORD_ROWS];
    const validRows = parsed
      .map((row) => normalizeRowString(String(row)))
      .filter(isValidRowString);
    return validRows.length ? validRows : [...DEFAULT_WORD_ROWS];
  } catch (error) {
    return [...DEFAULT_WORD_ROWS];
  }
}

function setMessage(text, ok = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("ok", ok);
}

function renderRows() {
  rowListEl.innerHTML = "";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "row-item";
    empty.innerHTML = "<span>目前沒有資料列，請先新增至少 1 列</span>";
    rowListEl.appendChild(empty);
    return;
  }

  rows.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "row-item";

    const content = document.createElement("code");
    content.textContent = row;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "移除";
    removeBtn.className = "danger";
    removeBtn.addEventListener("click", () => {
      rows.splice(index, 1);
      renderRows();
      setMessage("已移除一列，按「儲存」生效。");
    });

    item.appendChild(content);
    item.appendChild(removeBtn);
    rowListEl.appendChild(item);
  });
}

function addRow() {
  const input = newRowInput.value.trim();
  if (!input) {
    setMessage("請先輸入資料列。");
    return;
  }

  const normalized = normalizeRowString(input);
  if (!isValidRowString(normalized)) {
    setMessage("格式錯誤：每列需要 2~5 欄，使用逗號分隔。");
    return;
  }

  rows.push(normalized);
  newRowInput.value = "";
  renderRows();
  setMessage("已新增一列，按「儲存」生效。", true);
}

function saveRows() {
  if (!rows.length) {
    setMessage("至少要保留 1 列才能儲存。");
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  setMessage("已儲存，回遊戲頁重新開始即可套用。", true);
}

function resetDefault() {
  rows = [...DEFAULT_WORD_ROWS];
  renderRows();
  setMessage("已還原預設，按「儲存」即可覆蓋。");
}

addBtn.addEventListener("click", addRow);
saveBtn.addEventListener("click", saveRows);
resetBtn.addEventListener("click", resetDefault);
newRowInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addRow();
});

preventDoubleTapZoom();
renderRows();

