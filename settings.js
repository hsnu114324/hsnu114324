const STORAGE_KEY = "word_tetris_rows_v1";
//const DEFAULT_WORD_ROWS = ["ice,cream", "1,2,3,4,5"];

const DEFAULT_WORD_ROWS = [
  "der -e,ice cream",
  "1,2,3,4,5",
//  "-,所有格 第一格(Nominativ),所有格 第二格(Genitiv),所有格 第三格(Dativ),所有格 第四格(Akkusativ)",
//  "der ich,mein ,meines,meinem,meinen",
//  "der du,dein ,deines,deinem,deinen",
//  "der er,sein ,seines,seinem,seinen",
//  "der sie,ihr ,ihres,ihrem,ihren",
//  "der es,sein ,seines,seinem,seinen",
//  "der wir,unser ,unseres,unserem,unseren",
//  "der ihr,euer ,eures,eurem,euren",
//  "der sie,ihr ,ihres,ihrem,ihren",
//  "der Sie,ihr ,ihres,ihrem,ihren",
//  "das ich,mein ,meines,meinem,mein",
//  "das du,dein ,deines,deinem,dein",
//  "das er,sein ,seines,seinem,sein",
//  "das sie,ihr ,ihres,ihrem,ihr",
//  "das es,sein ,seines,seinem,sein",
//  "das wir,unser ,unseres,unserem,unser",
//  "das ihr,euer ,eures,eurem,euer",
//  "das sie,ihr ,ihres,ihrem,ihr",
//  "das Sie,ihr ,ihres,ihrem,ihr",
//  "die ich,meine,meiner,meiner,meine",
//  "die du,deine ,deiner,deiner,deine",
//  "die er,seine ,seiner,seiner,seine",
//  "die sie,ihre ,ihrer,ihrer,ihre",
//  "die es,seine ,seiner,seiner,seine",
//  "die wir,unsere ,unserer,unserer,unsere",
//  "die ihr,eure ,eurer,eurer,eure",
//  "die sie,ihre ,ihrer,ihrer,ihre",
//  "die Sie,ihre ,ihrer,ihrer,ihre",
//  "pl. ich,meine ,meiner,meinen,meine",
//  "pl. du,deine ,deiner,deinen,deine",
//  "pl. er,seine ,seiner,seinen,seine",
//  "pl. sie,ihre ,ihrer,ihren,ihre",
//  "pl. es,seine ,seiner,seinen,seine",
//  "pl. wir,unsere ,unserer,unseren,unsere",
//  "pl. ihr,eure ,eurer,euren,eure",
//  "pl. sie,ihre ,ihrer,ihren,ihre",
//  "pl. Sie,ihre ,ihrer,ihren,ihre",
//  "-,第一格(Nominativ),第二格(Genitiv),第三格(Dativ),第四格(Akkusativ)",
//  "陽性 der,der Mann,des,dem Mann,den Mann",
//  "陽性 ein,ein Mann,eines ,einem Mann,einen Mann",
//  "陽性 kein,kein Mann,keines,keinem Mann,keinen Mann",
//  "陽性 welcher,welcher,-,welchem,welchen",
//  "陽性 dieser,dieser,dieses,diesem,diesen",
//  "中性 das,das Kind,des,dem Kind,das Kind",
//  "中性 ein,ein Kind,eines,einem Kind,ein Kind",
//  "中性 kein,kein Kind,keines,keinem Kind,kein Kind",
//  "中性 welches,welches,-,welchem,welches",
//  "中性 dieses,dieses,dieses,diesem,dieses",
//  "陰性 die,die Frau,der,der Frau,die Frau",
//  "陰性 eine ,eine Frau,einer,einer Frau,eine Frau",
//  "陰性 keine,keine Frau,keiner,keiner Frau,keine Frau",
//  "陰性 welche,welche,-,welcher,welche",
//  "陰性 diese,diese,dieser,dieser,diese",
//  "複數 die,die Leute,der,den Leuten,die Leute",
//  "複數 -, - Leute,-, - Leuten, - Leute",
//  "複數 keine,keine Leute,keiner,keinen Leuten,keine Leute",
//  "複數 welche,welche,-,welchen,welche",
//  "複數 diese,diese,dieser,diesen,diese",
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

