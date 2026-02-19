const STORAGE_KEY = "word_tetris_rows_v1";
const PICK_KEY = "word_tetris_pick_count_v1";
const DEBUG_KEY = "word_tetris_debug_v1";
//const DEFAULT_WORD_ROWS = ["ice,cream", "1,2,3,4,5"];

const DEFAULT_WORD_ROWS = [
  "der -e,ice cream",
  "1,2,3,4,5",
  "6,7,8,9,10",
  "11,12,13,14,15",
  "16,17,18,19,20",
  "21,22,23,24,25",
  "我喜歡你,Ich,mag,dich,",
  "我愛你,Ich,liebe,dich,",
  "我好想你,Ich,vermisse,dich,",
  "我不喜歡這個,Ich,mag,das,nicht,",
  "我有一隻狗,Ich,habe,einen,Hund,",
  "我知道,Ich,weiß,",
  "我不知道,Ich,weiß,nicht,",
  "什麼時候,wann",
  "幾個,wie,viele?",
  "多少,wie,viel?",
  "這個多少錢？,Wie,viel,kostet,das?",
  "你有電話嗎？,Hast,du,ein,Telefon?",
  "洗手間在哪裡？,Wo,ist,das,WC?",
  "你叫什麼名字？,Wie,heißt,du?",
  "你愛我嗎？,Liebst,du,mich?",
  "你好嗎？,Wie,geht,es,dir?",
  "你還好嗎？,Geht,es,dir,gut?",
  "你能幫我嗎？,Können,Sie,mir,helfen?",
  "白銀比黃金便宜Silber,ist,billiger,als,Gold",
  "黃金比白銀貴Gold,ist,teurer,als,Silber",
  "我不懂,Das,verstehe,ich,nicht",
  "我要多一點,Ich,möchte,mehr",
  "我想喝一杯凍可樂Ich,möchte,ein,kaltes,Cola",
  "我需要這個,Ich,brauche,das",
  "我想去看電影Ich,möchte,ins,Kino,gehen",
  "我很期待見到你Ich_freu,mich,darauf,dich,zu_sehen",
  "我平時不吃魚Normal,esse,ich,keinen,Fisch",
  "你一定要來,Du,musst,unbedingt,kommen",
  "這個太貴了Das,ist,ganz,schön,teuer",
  "我遲到了ich_bin_ein,wenig,zu,spät,dran",
  "我叫大衛,Ich,heiße,David",
  "很高興認識你,freut,mich,dich,kennenzulernen",
  "我今年二十二歲_Ich,bin,22,Jahre,alt",
  "這是我的女朋友安娜Das_ist,meine,Freundin,Anna",
  "我們看電影吧Schauen_wir,uns,einen,Film,an",
  "我們回家吧,Gehen,wir,nach,Hause",

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
const pickCountInput = document.getElementById("pickCount");
const totalCountEl = document.getElementById("totalCount");
const debugToggle = document.getElementById("debugToggle");

let rows = loadRows();
let pickCount = loadPickCount();

function preventZoom() {
  document.addEventListener(
    "touchmove",
    (e) => { if (e.touches.length > 1) e.preventDefault(); },
    { passive: false },
  );
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });
}

// touchstart 直接觸發，不等 click 的 300ms
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
  el.addEventListener("click", () => {
    if (touched) { touched = false; return; }
    callback();
  });
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

function loadPickCount() {
  try {
    const val = parseInt(localStorage.getItem(PICK_KEY), 10);
    return isNaN(val) || val < 0 ? 0 : val;
  } catch {
    return 0;
  }
}

function updateTotalCount() {
  totalCountEl.textContent = String(rows.length);
  pickCountInput.max = rows.length;
  if (pickCount > rows.length) {
    pickCount = rows.length;
    pickCountInput.value = pickCount;
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
    tapBind(removeBtn, () => {
      rows.splice(index, 1);
      renderRows();
      setMessage("已移除一列，按「儲存」生效。");
    });

    item.appendChild(content);
    item.appendChild(removeBtn);
    rowListEl.appendChild(item);
  });

  updateTotalCount();
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
  // 讀取並驗證抽取組數
  pickCount = parseInt(pickCountInput.value, 10) || 0;
  if (pickCount < 0) pickCount = 0;
  if (pickCount > rows.length) pickCount = rows.length;
  pickCountInput.value = pickCount;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  localStorage.setItem(PICK_KEY, String(pickCount));
  localStorage.setItem(DEBUG_KEY, debugToggle.checked ? "1" : "0");

  const pickText = pickCount === 0
    ? "全部"
    : `隨機 ${pickCount}/${rows.length} 組`;
  setMessage(`已儲存（${pickText}），回遊戲頁重新開始即可套用。`, true);
}

function resetDefault() {
  rows = [...DEFAULT_WORD_ROWS];
  pickCount = 0;
  pickCountInput.value = 0;
  renderRows();
  updateTotalCount();
  setMessage("已還原預設，按「儲存」即可覆蓋。");
}

tapBind(addBtn, addRow);
tapBind(saveBtn, saveRows);
tapBind(resetBtn, resetDefault);
newRowInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addRow();
});

preventZoom();
pickCountInput.value = pickCount;
debugToggle.checked = localStorage.getItem(DEBUG_KEY) === "1";
renderRows();

