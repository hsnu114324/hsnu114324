/* ═══════════════════════════════════════════════════════
   shared.js — 共用常數與工具函數
   所有頁面（方塊 / 小說 / 設定）共用的程式碼
   ═══════════════════════════════════════════════════════ */

// ── localStorage 鍵值 ──

const STORAGE_KEY = "word_tetris_rows_v1";
const PICK_KEY = "word_tetris_pick_count_v1";
const DEBUG_KEY = "word_tetris_debug_v1";
const LENS_KEY = "word_tetris_allowed_lens_v1";
const AUTO_REMOVE_KEY = "word_tetris_auto_remove_v1";
const GROUPS_KEY = "word_tetris_active_groups_v1";
const GROUP_REMOVED_KEY = "word_tetris_group_removed_v1";
const GROUP_DATA_KEY = "word_tetris_group_data_v1";
const CUSTOM_ACTIVE_KEY = "word_tetris_custom_active_v1";
const CUSTOM_FULL_KEY = "word_tetris_custom_full_v1";
const SINGLE_WORD_MODE_KEY = "word_tetris_single_word_mode_v1";
const SPLIT_MODE_KEY = "word_tetris_split_mode_v1";
const WORD_LETTERS_KEY = "word_tetris_word_letters_v1";
const BATTLE_MODE_KEY = "word_tetris_battle_mode_v1";
const SENTENCE_MODE_KEY = "word_tetris_sentence_mode_v1";
const SENTENCE_DATA_KEY = "word_tetris_sentence_data_v1";
const SENTENCE_CATS_KEY = "word_tetris_sentence_cats_v1";
const STATS_KEY = "word_tetris_combo_stats_v1";
const GOOGLE_USER_KEY = "word_tetris_google_user_v1";

// ── 外部服務 ──

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCSMkz1NiiUjB-32e_L4i3VtQbtpzUFYWgOPX4qOwbtjGGrZ_V2qvMYutX0iP-_NWlBQ/exec";

// ── 共用全域變數 ──

let groupData = [];

// ── 觸控 / UI 工具 ──

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

// ── 模式讀取 ──

function isSingleWordMode() {
  return localStorage.getItem(SINGLE_WORD_MODE_KEY) === "1";
}

function isCustomActive() {
  return localStorage.getItem(CUSTOM_ACTIVE_KEY) === "1";
}

function loadSplitMode() {
  const v = localStorage.getItem(SPLIT_MODE_KEY);
  if (v === "random" || v === "mixed" || v === "letter") return v;
  return "syllable";
}

function isSentenceMode() {
  return localStorage.getItem(SENTENCE_MODE_KEY) === "1";
}

function loadSentenceRows() {
  try {
    const raw = localStorage.getItem(SENTENCE_DATA_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function isAutoRemoveMode() {
  return localStorage.getItem(AUTO_REMOVE_KEY) === "1";
}

// ── 德文音節拆分演算法（規則式，約 80~85 % 正確率） ──

const _GERMAN_ONSETS = new Set([
  "schr","schw","schl","schm","schn",
  "sch","pfl","pfr",
  "bl","br","ch","ck","cl","cr","dr","dw",
  "fl","fr","gl","gn","gr",
  "kl","kn","kr","kw",
  "pf","ph","pl","pr",
  "qu",
  "th","tr","ts","tw","wr","zw",
  "b","c","d","f","g","h","j","k","l","m","n",
  "p","q","r","s","t","v","w","x","z","ß",
]);

function _isVowel(ch) {
  return "aeiouyäöüAEIOUYÄÖÜ".includes(ch);
}

function germanSyllables(word) {
  if (!word || word.length <= 1) return [word];
  const nuclei = [];
  let i = 0;
  while (i < word.length) {
    if (_isVowel(word[i])) {
      let j = i + 1;
      while (j < word.length && _isVowel(word[j])) j++;
      nuclei.push({ start: i, end: j });
      i = j;
    } else { i++; }
  }
  if (nuclei.length <= 1) return [word];
  const breakPoints = [];
  for (let n = 0; n < nuclei.length - 1; n++) {
    const cStart = nuclei[n].end;
    const cEnd   = nuclei[n + 1].start;
    if (cStart >= cEnd) { breakPoints.push(cStart); continue; }
    const cluster = word.slice(cStart, cEnd).toLowerCase();
    if (cluster.length === 1) { breakPoints.push(cStart); continue; }
    let splitAt = cEnd - 1;
    for (let k = 0; k < cluster.length; k++) {
      if (_GERMAN_ONSETS.has(cluster.slice(k))) { splitAt = cStart + k; break; }
    }
    breakPoints.push(splitAt);
  }
  const syllables = [];
  let prev = 0;
  for (const bp of breakPoints) {
    if (bp > prev) syllables.push(word.slice(prev, bp));
    prev = bp;
  }
  if (prev < word.length) syllables.push(word.slice(prev));
  return syllables.filter(s => s.length > 0);
}

function _mergeSyllables(syllables, maxBlocks) {
  const result = [...syllables];
  while (result.length > maxBlocks && result.length >= 2) {
    const last = result.pop();
    result[result.length - 1] += last;
  }
  return result;
}

function splitGermanRandom(word, maxBlocks) {
  const chars = [...word];
  if (chars.length <= 1) return [word];
  if (chars.length <= maxBlocks) return chars;
  const possible = [];
  for (let i = 1; i < chars.length; i++) possible.push(i);
  for (let i = possible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possible[i], possible[j]] = [possible[j], possible[i]];
  }
  const splits = possible.slice(0, maxBlocks - 1).sort((a, b) => a - b);
  const blocks = [];
  let prev = 0;
  for (const s of splits) {
    blocks.push(chars.slice(prev, s).join(""));
    prev = s;
  }
  blocks.push(chars.slice(prev).join(""));
  return blocks;
}

function splitGermanLetters(germanStr, maxBlocks) {
  const chars = [...germanStr];
  const blocks = chars.map(ch => ch === " " ? "␣" : ch);
  if (blocks.length <= maxBlocks) return blocks;
  const result = blocks.slice(0, maxBlocks - 1);
  result.push(chars.slice(maxBlocks - 1).join(""));
  return result;
}

function splitGermanToBlocks(germanStr, maxBlocks = 4) {
  const mode = loadSplitMode();
  if (mode === "letter") {
    return splitGermanLetters(germanStr, maxBlocks);
  }
  let spaceParts = germanStr.split(/\s+/).filter(Boolean);
  if (spaceParts.length === 0) return [germanStr];
  if (spaceParts.length > maxBlocks) {
    const merged = spaceParts.slice(maxBlocks - 1).join(" ");
    spaceParts = [...spaceParts.slice(0, maxBlocks - 1), merged];
  }
  const prefix = spaceParts.slice(0, -1);
  const lastWord = spaceParts[spaceParts.length - 1];
  const availableForLast = maxBlocks - prefix.length;
  if (availableForLast <= 1 || lastWord.length <= 1) return [...prefix, lastWord];
  const useMode = (mode === "mixed") ? (Math.random() < 0.5 ? "syllable" : "random") : mode;
  let lastBlocks;
  if (useMode === "syllable") {
    lastBlocks = _mergeSyllables(germanSyllables(lastWord), availableForLast);
  } else {
    lastBlocks = splitGermanRandom(lastWord, availableForLast);
  }
  return [...prefix, ...lastBlocks];
}

// ── 資料載入 ──

function loadGroupData() {
  try {
    const raw = localStorage.getItem(GROUP_DATA_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

/** 載入啟用的群組索引（回傳 Array）。設定頁覆寫為回傳 Set 的版本。 */
function loadActiveGroups() {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(n => n >= 0 && n < groupData.length) : [];
  } catch { return []; }
}

function loadGroupRemoved() {
  try {
    const raw = localStorage.getItem(GROUP_REMOVED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? parsed : {};
  } catch { return {}; }
}

function saveGroupRemoved(removed) {
  localStorage.setItem(GROUP_REMOVED_KEY, JSON.stringify(removed));
}

function isValidRowString(row) {
  if (typeof row !== "string") return false;
  const parts = row.split(",").map(w => w.trim()).filter(Boolean);
  return parts.length >= 2 && parts.length <= 5;
}

function loadPickCount() {
  try {
    const val = parseInt(localStorage.getItem(PICK_KEY), 10);
    return isNaN(val) || val < 0 ? 0 : val;
  } catch { return 0; }
}

// ── 學習統計 ──

function loadComboStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (typeof parsed === "object" && parsed !== null) ? parsed : {};
  } catch { return {}; }
}

function saveComboStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

async function syncStatsToSheets() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("YOUR_")) return;
  let user = null;
  try {
    const raw = localStorage.getItem(GOOGLE_USER_KEY);
    if (raw) user = JSON.parse(raw);
  } catch { /* ignore */ }
  if (!user || !user.email) return;
  const stats = loadComboStats();
  if (Object.keys(stats).length === 0) return;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "sync",
        stats,
        userEmail: user.email,
        userName: user.name || user.email,
      }),
    });
  } catch (e) {
    console.warn("同步 Google Sheets 失敗:", e);
  }
}
