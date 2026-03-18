/* ═══════════════════════════════════════════════════════
   德文單字配對遊戲 ＋ ATB 戰鬥
   配對成功 → 填充行動條
   與俄羅斯方塊共用 localStorage 學習統計
   ═══════════════════════════════════════════════════════ */

const BATTLE_SAVE_KEY = "word_novel_battle_v1";
const SLOTS_PER_ROUND = 3;    // 每回合卡槽數
const DISTRACTORS = 2;         // 干擾卡數量

// ══════════════════════════════════════
//  共用常數（與其他遊戲共用）
// ══════════════════════════════════════

const STORAGE_KEY       = "word_tetris_rows_v1";
const AUTO_REMOVE_KEY   = "word_tetris_auto_remove_v1";
const GROUPS_KEY        = "word_tetris_active_groups_v1";
const GROUP_REMOVED_KEY = "word_tetris_group_removed_v1";
const GROUP_DATA_KEY    = "word_tetris_group_data_v1";
const CUSTOM_ACTIVE_KEY = "word_tetris_custom_active_v1";
const SINGLE_WORD_MODE_KEY = "word_tetris_single_word_mode_v1";
const SPLIT_MODE_KEY    = "word_tetris_split_mode_v1";
const CUSTOM_FULL_KEY   = "word_tetris_custom_full_v1";
const STATS_KEY         = "word_tetris_combo_stats_v1";
const GOOGLE_USER_KEY   = "word_tetris_google_user_v1";
const PICK_KEY          = "word_tetris_pick_count_v1";
const APPS_SCRIPT_URL   = "https://script.google.com/macros/s/AKfycbyCSMkz1NiiUjB-32e_L4i3VtQbtpzUFYWgOPX4qOwbtjGGrZ_V2qvMYutX0iP-_NWlBQ/exec";
const DEFAULT_WORD_ROWS = ["蘋果,Apfel", "麵包,Brot", "水,Wasser", "牛奶,Milch", "書,Buch"];

// ══════════════════════════════════════
//  共用工具函數
// ══════════════════════════════════════

function preventZoom() {
  const novelPage = document.querySelector('.novel-page');

  // 攔截所有 touchmove：
  //  - 若在 .novel-page 內部且容器有可捲動內容 → 放行（CSS overscroll-behavior:contain 負責防止外溢）
  //  - 其餘（多指、空白區、不可捲動時）一律阻止 → 頁面完全不會移動
  document.addEventListener("touchmove", (e) => {
    // 多指一律阻止（防縮放、防雙指滾動）
    if (e.touches.length > 1) { e.preventDefault(); return; }

    // 單指：若觸控在 .novel-page 內且該容器可捲動 → 允許
    if (novelPage && novelPage.contains(e.target) && novelPage.scrollHeight > novelPage.clientHeight) {
      return; // 放行，讓 .novel-page 的 overflow-y:auto 運作
    }

    // 其餘情況一律阻止（防止頁面被拖動）
    e.preventDefault();
  }, { passive: false });

  // 攔截 Safari gesture 縮放
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });
}

function isSingleWordMode() { return localStorage.getItem(SINGLE_WORD_MODE_KEY) === "1"; }
function isCustomActive()   { return localStorage.getItem(CUSTOM_ACTIVE_KEY) === "1"; }
function loadSplitMode() {
  const v = localStorage.getItem(SPLIT_MODE_KEY);
  if (v === "random" || v === "mixed") return v;
  return "syllable";
}

// ── 德文音節拆分（與方塊遊戲 script.js 相同的演算法） ──

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
  let prev2 = 0;
  for (const s of splits) {
    blocks.push(chars.slice(prev2, s).join(""));
    prev2 = s;
  }
  blocks.push(chars.slice(prev2).join(""));
  return blocks;
}

function splitGermanToBlocks(germanStr, maxBlocks = 4) {
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
  const mode = loadSplitMode();
  const useMode = (mode === "mixed") ? (Math.random() < 0.5 ? "syllable" : "random") : mode;
  let lastBlocks;
  if (useMode === "syllable") {
    lastBlocks = _mergeSyllables(germanSyllables(lastWord), availableForLast);
  } else {
    lastBlocks = splitGermanRandom(lastWord, availableForLast);
  }
  return [...prefix, ...lastBlocks];
}

let groupData = [];

function loadGroupData() {
  try { const r = localStorage.getItem(GROUP_DATA_KEY); if (!r) return []; const p = JSON.parse(r); return Array.isArray(p) ? p : []; } catch { return []; }
}
function loadActiveGroups() {
  try { const r = localStorage.getItem(GROUPS_KEY); if (!r) return []; const p = JSON.parse(r); return Array.isArray(p) ? p.filter(n => n >= 0 && n < groupData.length) : []; } catch { return []; }
}
function loadGroupRemoved() {
  try { const r = localStorage.getItem(GROUP_REMOVED_KEY); if (!r) return {}; const p = JSON.parse(r); return (p && typeof p === "object") ? p : {}; } catch { return {}; }
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

function loadWordRows() {
  const ag = loadActiveGroups();
  const ca = isCustomActive();
  const swMode = isSingleWordMode();
  const rows = [];
  if (ag.length > 0) {
    const removed = loadGroupRemoved();
    for (const gi of ag) {
      const removedSet = new Set((removed[gi] || []).map(s => s.split(",").map(p => p.trim().toLowerCase()).filter(Boolean).join(",")));
      for (const row of (groupData[gi] || [])) {
        const key = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
        if (!removedSet.has(key)) rows.push(row);
      }
    }
  }
  if (ca) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            if (!isValidRowString(r)) continue;
            // 單字模式：只載入 2 欄項目（中文提示 + 德文單字）
            if (swMode) {
              const parts = r.split(",").map(s => s.trim()).filter(Boolean);
              if (parts.length !== 2) continue;
            }
            rows.push(r);
          }
        }
      }
    } catch { /* ignore */ }
  }
  if (rows.length > 0) return rows;
  if (ag.length > 0) { const a = []; for (const gi of ag) a.push(...(groupData[gi] || [])); if (a.length > 0) return a; }
  return [...DEFAULT_WORD_ROWS];
}

function buildPairsForQuiz(rows) {
  const swMode = isSingleWordMode();
  const pairs = [];
  for (const row of rows) {
    const parts = row.split(",").map(w => w.trim()).filter(Boolean);
    if (parts.length < 2) continue;

    const hint = parts[0];

    // 單字模式 + 2 欄：德文拆字（與方塊遊戲 buildComboList 相同邏輯）
    if (swMode && parts.length === 2) {
      const germanBlocks = splitGermanToBlocks(parts[1], 4);
      if (germanBlocks.length >= 1) {
        // raw 保持原始未拆字的格式（_origRow 等效），確保統計 key 一致
        pairs.push({ hint, blocks: germanBlocks, raw: row });
        continue;
      }
    }

    // 一般模式或多欄：直接使用 CSV 欄位
    const blocks = parts.slice(1);
    pairs.push({ hint, blocks, raw: row });
  }
  return pairs;
}

// ── 學習統計 ──

function loadComboStats() {
  try { const r = localStorage.getItem(STATS_KEY); if (!r) return {}; const p = JSON.parse(r); return (typeof p === "object" && p !== null) ? p : {}; } catch { return {}; }
}
function saveComboStats(stats) { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }

/** 記錄 combo 出現（使用原始 raw 字串計算 key，與方塊遊戲一致） */
function trackComboAppearByRaw(rawStrings) {
  const stats = loadComboStats();
  for (const raw of rawStrings) {
    const key = raw.split(",").map(w => w.trim().toLowerCase()).filter(Boolean).join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display: raw, lastSeen: "" };
    stats[key].appear++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
    stats[key].display = raw;
  }
  saveComboStats(stats);
}

/** 記錄 combo 被成功消除 */
function trackComboClearedByRaw(rawStrings) {
  const stats = loadComboStats();
  for (const raw of rawStrings) {
    const key = raw.split(",").map(w => w.trim().toLowerCase()).filter(Boolean).join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display: raw, lastSeen: "" };
    stats[key].cleared++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
  }
  saveComboStats(stats);
}

async function syncStatsToSheets() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("YOUR_")) return;
  let user = null;
  try { const r = localStorage.getItem(GOOGLE_USER_KEY); if (r) user = JSON.parse(r); } catch { /* */ }
  if (!user || !user.email) return;
  const stats = loadComboStats();
  if (Object.keys(stats).length === 0) return;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "sync", stats, userEmail: user.email, userName: user.name || user.email }),
    });
  } catch (e) { console.warn("同步 Google Sheets 失敗:", e); }
}

// ── 自動移除 ──

function isAutoRemoveMode() { return localStorage.getItem(AUTO_REMOVE_KEY) === "1"; }

function autoRemoveRow(raw) {
  if (!isAutoRemoveMode()) return;
  if (!raw) return;

  const keyToRemove = raw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
  let totalRemoved = 0;

  const filterRows = (arr) => arr.filter(row => {
    const key = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
    return key !== keyToRemove;
  });

  const ag = loadActiveGroups();
  if (ag.length > 0) {
    try {
      const removed = loadGroupRemoved();
      let groupRemoved = 0;
      for (const gi of ag) {
        if (!removed[gi]) removed[gi] = [];
        const existingSet = new Set(
          removed[gi].map(s => s.split(",").map(p => p.trim().toLowerCase()).filter(Boolean).join(","))
        );
        for (const row of (groupData[gi] || [])) {
          const key = row.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
          if (key === keyToRemove && !existingSet.has(key)) {
            removed[gi].push(row);
            groupRemoved++;
          }
        }
      }
      if (groupRemoved > 0) {
        localStorage.setItem(GROUP_REMOVED_KEY, JSON.stringify(removed));
        totalRemoved += groupRemoved;
      }
    } catch (e) { /* ignore */ }
  }

  if (isCustomActive()) {
    try {
      const raw2 = localStorage.getItem(STORAGE_KEY);
      if (raw2) {
        let storedRows = JSON.parse(raw2);
        if (Array.isArray(storedRows)) {
          const before = storedRows.length;
          storedRows = filterRows(storedRows);
          if (storedRows.length < before) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storedRows));
            totalRemoved += (before - storedRows.length);
          }
        }
      }
    } catch (e) { /* ignore */ }
    try {
      const rawFull = localStorage.getItem(CUSTOM_FULL_KEY);
      if (rawFull) {
        let fullRows = JSON.parse(rawFull);
        if (Array.isArray(fullRows)) {
          fullRows = filterRows(fullRows);
          localStorage.setItem(CUSTOM_FULL_KEY, JSON.stringify(fullRows));
        }
      }
    } catch (e) { /* ignore */ }
  }

  if (totalRemoved > 0) {
    try {
      const currentPick = parseInt(localStorage.getItem(PICK_KEY), 10);
      if (!isNaN(currentPick) && currentPick > 0) {
        localStorage.setItem(PICK_KEY, String(Math.max(0, currentPick - totalRemoved)));
      }
    } catch (e) { /* ignore */ }
  }

  if (totalRemoved > 0) {
    allPairs = allPairs.filter(p => {
      const key = p.raw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
      return key !== keyToRemove;
    });
    console.log("[Novel] 自動移除:", raw, "→ 剩餘", allPairs.length, "組");
  }
}

// ══════════════════════════════════════
//  ATB 戰鬥系統 — 敵人資料
// ══════════════════════════════════════

const ENEMY_WAVES = [
  { name: "👹 魔族士兵",    baseHp: 40,  atk: [6, 10],  atbSpeed: 2.5  },
  { name: "🐺 妖狼",       baseHp: 55,  atk: [8, 13],  atbSpeed: 3.0  },
  { name: "👿 魔族精英",    baseHp: 70,  atk: [10, 16], atbSpeed: 3.5  },
  { name: "🗡️ 魔族刺客",   baseHp: 60,  atk: [14, 20], atbSpeed: 4.5  },
  { name: "🛡️ 魔族隊長",   baseHp: 90,  atk: [10, 18], atbSpeed: 3.0  },
  { name: "🔥 炎魔",       baseHp: 100, atk: [12, 20], atbSpeed: 3.5  },
  { name: "❄️ 冰魄將軍",   baseHp: 120, atk: [14, 22], atbSpeed: 4.0  },
  { name: "💀 亡骨魔將",    baseHp: 140, atk: [16, 25], atbSpeed: 4.5  },
  { name: "🐉 妖龍",       baseHp: 180, atk: [18, 28], atbSpeed: 5.0  },
  { name: "😈 魔族大君",    baseHp: 220, atk: [20, 32], atbSpeed: 5.5  },
];

const PLAYER_BASE_HP = 100;
const PLAYER_ATK = [15, 25];
const PLAYER_ATB_PER_MATCH = 34;       // 每次配對 ATB +34% (3 次配對 = 102%)
const ENEMY_ATB_BOOST_ON_WRONG = 15;   // 配對錯誤時敵人 ATB +15%
const ATB_TICK_MS = 100;

// ══════════════════════════════════════
//  遊戲狀態
// ══════════════════════════════════════

let allPairs = [];
let correctCount = 0;
let wrongCount = 0;
let streak = 0;

// 發牌Q（與方塊遊戲對齊的 combo 佇列系統）
let comboQueue = [];      // 本局所有要配對的 pair（已 shuffle）
let queueIdx = 0;         // 目前發到第幾組
let totalCombos = 0;      // 本局總組數
let clearedCombos = 0;    // 本局已消除組數

// 配對遊戲狀態
let roundCombos = [];      // [{hint, blocks, raw, prefilled, matched[]}]
let roundCards = [];        // [{text, comboIdx, blockIdx, el}]  comboIdx=-1 為干擾
let selectedCardEl = null;  // 目前選中的卡片 DOM
let roundLocked = false;    // 動畫中鎖定

// ATB 戰鬥狀態
let playerHp = PLAYER_BASE_HP;
let playerMaxHp = PLAYER_BASE_HP;
let playerAtb = 0;
let enemyHp = 0;
let enemyMaxHp = 0;
let enemyAtb = 0;
let enemyAtbSpeed = 0;
let enemyAtk = [0, 0];
let enemyName = "";
let wave = 1;
let killCount = 0;
let battlePaused = false;
let atbTimer = null;
let playerDead = false;
let reviveTimer = null;

// 自動遊玩
let autoPlayEnabled = false;
let autoMatchTimer = null;

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════

const matchSlotsEl     = document.getElementById("matchSlots");
const matchCardsEl     = document.getElementById("matchCards");
const matchFeedback    = document.getElementById("matchFeedback");
const matchStatsEl     = document.getElementById("matchStats");
const restartBtn       = document.getElementById("restartBtn");
const autoPlayBtn      = document.getElementById("autoPlayBtn");
const correctEl        = document.getElementById("correctEl");
const streakEl         = document.getElementById("streakEl");
const queueProgressEl  = document.getElementById("queueProgress");

// ATB DOM
const battleArea     = document.getElementById("battleArea");
const playerHpFill   = document.getElementById("playerHpFill");
const playerHpText   = document.getElementById("playerHpText");
const playerAtbFill  = document.getElementById("playerAtbFill");
const enemyHpFill    = document.getElementById("enemyHpFill");
const enemyHpText    = document.getElementById("enemyHpText");
const enemyAtbFill   = document.getElementById("enemyAtbFill");
const enemyNameEl    = document.getElementById("enemyName");
const enemySide      = document.getElementById("enemySide");
const waveNumEl      = document.getElementById("waveNum");
const killCountEl    = document.getElementById("killCount");
const battleLogEl    = document.getElementById("battleLog");

// ══════════════════════════════════════
//  發牌Q 佇列系統
// ══════════════════════════════════════

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 初始化發牌Q：載入 → 隨機抽取 → shuffle → 建立佇列
 * 與方塊遊戲的 initComboPool() 對齊
 */
function initComboQueue() {
  groupData = loadGroupData();
  const wordRows = loadWordRows();
  allPairs = buildPairsForQuiz(wordRows);

  // 套用「每局隨機抽取數」
  let pool = [...allPairs];
  const pickCount = loadPickCount();
  if (pickCount > 0 && pickCount < pool.length) {
    shuffle(pool);
    pool = pool.slice(0, pickCount);
  }

  // 打亂佇列順序
  shuffle(pool);

  comboQueue = pool;
  queueIdx = 0;
  totalCombos = pool.length;
  clearedCombos = 0;

  console.log(`[Match] 發牌Q 初始化: ${totalCombos} 組 (allPairs=${allPairs.length}, pick=${pickCount || '全部'})`);
}

/** 更新發牌Q 進度 UI */
function updateQueueUI() {
  if (!queueProgressEl) return;
  const dealt = Math.min(queueIdx, totalCombos);
  const remaining = totalCombos - dealt + (roundCombos.filter(c => !c.matched.every(Boolean)).length);
  const pct = totalCombos > 0 ? ((clearedCombos / totalCombos) * 100).toFixed(0) : 0;
  queueProgressEl.innerHTML =
    `發牌Q：已發 <b>${dealt}</b>/<b>${totalCombos}</b> 組 ｜ ` +
    `已配對 <b>${clearedCombos}</b> ｜ 進度 <b>${pct}%</b>` +
    `<div class="queue-bar"><div class="queue-bar-fill" style="width:${pct}%"></div></div>`;
}

/** 全部配對完成 */
function onQueueComplete() {
  syncStatsToSheets();
  stopAtbTimer();
  matchSlotsEl.innerHTML = '<div style="color:#5fd18d;padding:16px;font-size:1.1rem;">🎉 本局全部完成！</div>';
  matchCardsEl.innerHTML = "";
  matchFeedback.textContent = `完成 ${clearedCombos}/${totalCombos} 組配對 — 按「重新開始」再來一局`;
  matchFeedback.style.color = "#ffcc02";
  updateQueueUI();
  stopAutoMatch();
}

// ══════════════════════════════════════
//  配對遊戲邏輯
// ══════════════════════════════════════

function generateRound() {
  // 佇列用完 → 完成
  const remaining = comboQueue.length - queueIdx;
  if (remaining <= 0) {
    onQueueComplete();
    return;
  }

  if (allPairs.length < 2) {
    matchSlotsEl.innerHTML = '<div style="color:#f7b955;padding:12px;">⚠ 單字不足，請到設定頁新增至少 2 組</div>';
    matchCardsEl.innerHTML = "";
    return;
  }

  // 從佇列取下一批（最多 SLOTS_PER_ROUND 組）
  const n = Math.min(SLOTS_PER_ROUND, remaining);
  const chosen = comboQueue.slice(queueIdx, queueIdx + n);
  queueIdx += n;

  // 延遲記錄 appear
  trackComboAppearByRaw(chosen.map(p => p.raw));

  // 建立 combo 資料：hint 也做成小卡槽，每個 combo 隨機預填一格作為提示
  roundCombos = chosen.map(p => {
    // 把中文提示也合併進 blocks（第 0 格 = 中文，後面 = 德文）
    const allBlocks = [p.hint, ...p.blocks];
    // 隨機選一格預填
    const prefilled = Math.floor(Math.random() * allBlocks.length);
    const matched = new Array(allBlocks.length).fill(false);
    matched[prefilled] = true;
    return { blocks: allBlocks, raw: p.raw, prefilled, matched };
  });

  // 建立答案卡片：每個非預填 block 一張小卡
  const cards = [];
  roundCombos.forEach((combo, comboIdx) => {
    combo.blocks.forEach((block, blockIdx) => {
      if (blockIdx === combo.prefilled) return;
      cards.push({ text: block, comboIdx, blockIdx });
    });
  });

  // 干擾卡：從 allPairs 全池中挑選不與任何卡槽文字重複的 block
  // 收集所有卡槽的文字（包含預填格），用於排除
  const allSlotTexts = new Set();
  roundCombos.forEach(combo => {
    combo.blocks.forEach(b => allSlotTexts.add(b.trim().toLowerCase()));
  });
  const distractorBlocks = [];
  for (const p of allPairs) {
    // hint 也可能是干擾源
    const candidates = [p.hint, ...p.blocks];
    for (const b of candidates) {
      if (!allSlotTexts.has(b.trim().toLowerCase())) {
        distractorBlocks.push(b);
        allSlotTexts.add(b.trim().toLowerCase()); // 避免重複干擾卡
      }
    }
  }
  shuffle(distractorBlocks);
  const distractorCount = Math.min(DISTRACTORS, distractorBlocks.length);
  for (let i = 0; i < distractorCount; i++) {
    cards.push({ text: distractorBlocks[i], comboIdx: -1, blockIdx: -1 });
  }

  roundCards = shuffle(cards);
  selectedCardEl = null;
  roundLocked = false;

  updateQueueUI();
  renderRound();
}

function renderRound() {
  // ── 渲染卡槽：每個 combo 一個群組，所有 block（含中文）都是獨立小卡槽 ──
  matchSlotsEl.innerHTML = "";
  roundCombos.forEach((combo, ci) => {
    const group = document.createElement("div");
    group.className = "combo-group";

    // 所有 block 小卡槽列（第 0 格 = 中文，其餘 = 德文）
    const row = document.createElement("div");
    row.className = "block-slot-row";
    combo.blocks.forEach((block, bi) => {
      const cell = document.createElement("div");
      cell.className = "block-slot";
      cell.dataset.comboIdx = ci;
      cell.dataset.blockIdx = bi;
      if (bi === combo.prefilled) {
        cell.textContent = block;
        cell.classList.add("prefilled");
      } else {
        cell.textContent = "?";
      }
      cell.addEventListener("click", () => onSlotClick(ci, bi));
      row.appendChild(cell);
    });
    group.appendChild(row);
    matchSlotsEl.appendChild(group);
  });

  // ── 渲染答案卡片 ──
  matchCardsEl.innerHTML = "";
  roundCards.forEach((card, idx) => {
    const el = document.createElement("div");
    el.className = "match-card";
    el.textContent = card.text;
    el.dataset.idx = idx;
    el.addEventListener("click", () => onCardClick(idx, el));
    el.addEventListener("touchstart", (e) => onCardTouchStart(idx, el, e), { passive: false });
    card.el = el;
    matchCardsEl.appendChild(el);
  });

  // 全域觸控事件
  document.removeEventListener("touchmove", onCardTouchMove);
  document.removeEventListener("touchend", onCardTouchEnd);
  document.addEventListener("touchmove", onCardTouchMove, { passive: false });
  document.addEventListener("touchend", onCardTouchEnd, { passive: true });

  matchFeedback.textContent = " ";
  matchFeedback.style.color = "";
}

// ── 觸控拖曳 ──

let dragState = null; // { cardIdx, cardEl, ghostEl }

function onCardTouchStart(cardIdx, cardEl, e) {
  if (roundLocked || playerDead) return;
  if (cardEl.classList.contains("matched")) return;

  e.preventDefault(); // 立即阻止瀏覽器捲動，避免拖曳卡牌時畫面跟著移動

  const touch = e.touches[0];
  dragState = {
    cardIdx,
    cardEl,
    ghostEl: null,
    startX: touch.clientX,
    startY: touch.clientY,
    dragging: false,
  };
}

function onCardTouchMove(e) {
  if (!dragState) return;
  e.preventDefault();

  const touch = e.touches[0];
  const dx = touch.clientX - dragState.startX;
  const dy = touch.clientY - dragState.startY;

  if (!dragState.dragging && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    dragState.dragging = true;
    dragState.cardEl.classList.add("dragging");

    const ghost = document.createElement("div");
    ghost.className = "match-ghost";
    ghost.textContent = dragState.cardEl.textContent;
    document.body.appendChild(ghost);
    dragState.ghostEl = ghost;

    // 高亮所有未填的小卡槽
    matchSlotsEl.querySelectorAll(".block-slot:not(.prefilled):not(.filled)").forEach(s => {
      s.classList.add("highlight");
    });
  }

  if (dragState.dragging && dragState.ghostEl) {
    dragState.ghostEl.style.left = touch.clientX + "px";
    dragState.ghostEl.style.top = touch.clientY + "px";

    // 偵測手指下方的小卡槽
    matchSlotsEl.querySelectorAll(".block-slot").forEach(s => {
      const rect = s.getBoundingClientRect();
      const over = touch.clientX >= rect.left && touch.clientX <= rect.right &&
                   touch.clientY >= rect.top && touch.clientY <= rect.bottom;
      s.classList.toggle("drop-target",
        over && !s.classList.contains("prefilled") && !s.classList.contains("filled"));
    });
  }
}

function onCardTouchEnd(e) {
  if (!dragState) return;

  const wasDragging = dragState.dragging;
  const cardIdx = dragState.cardIdx;
  const cardEl = dragState.cardEl;

  if (dragState.ghostEl) dragState.ghostEl.remove();
  cardEl.classList.remove("dragging");
  matchSlotsEl.querySelectorAll(".block-slot").forEach(s => {
    s.classList.remove("highlight");
    s.classList.remove("drop-target");
  });

  if (wasDragging) {
    const touch = e.changedTouches[0];
    let targetCell = null;
    matchSlotsEl.querySelectorAll(".block-slot").forEach(s => {
      const rect = s.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        if (!s.classList.contains("prefilled") && !s.classList.contains("filled")) {
          targetCell = s;
        }
      }
    });

    if (targetCell) {
      const ci = parseInt(targetCell.dataset.comboIdx);
      const bi = parseInt(targetCell.dataset.blockIdx);
      selectedCardEl = cardEl;
      onSlotClick(ci, bi);
    }
  }

  dragState = null;
}

function onCardClick(cardIdx, cardEl) {
  if (roundLocked || playerDead) return;
  if (cardEl.classList.contains("matched")) return;

  // 取消選取
  if (selectedCardEl === cardEl) {
    cardEl.classList.remove("selected");
    selectedCardEl = null;
    matchSlotsEl.querySelectorAll(".block-slot").forEach(s => s.classList.remove("highlight"));
    return;
  }

  if (selectedCardEl) selectedCardEl.classList.remove("selected");
  cardEl.classList.add("selected");
  selectedCardEl = cardEl;

  // 高亮所有未填的小卡槽
  matchSlotsEl.querySelectorAll(".block-slot:not(.prefilled):not(.filled)").forEach(s => {
    s.classList.add("highlight");
  });
}

function onSlotClick(comboIdx, blockIdx) {
  if (roundLocked || playerDead) return;
  if (!selectedCardEl) return;

  const combo = roundCombos[comboIdx];
  if (!combo || combo.matched[blockIdx]) return; // 已配對或預填

  const cardIdx = parseInt(selectedCardEl.dataset.idx);
  const card = roundCards[cardIdx];

  // 取消所有高亮
  matchSlotsEl.querySelectorAll(".block-slot").forEach(s => s.classList.remove("highlight"));

  // ── 以「文字內容」比對：相同文字可互換 ──
  const expected = combo.blocks[blockIdx].trim().toLowerCase();
  const actual = card.text.trim().toLowerCase();

  if (actual === expected) {
    handleCorrectMatch(comboIdx, blockIdx, cardIdx);
  } else {
    handleWrongMatch(comboIdx, blockIdx, cardIdx);
  }
}

function handleCorrectMatch(comboIdx, blockIdx, cardIdx) {
  roundLocked = true;
  const combo = roundCombos[comboIdx];
  const card = roundCards[cardIdx];
  const cardEl = card.el;

  // 標記卡片已配對
  cardEl.classList.remove("selected");
  cardEl.classList.add("matched");
  selectedCardEl = null;

  // 標記此 block 已配對
  combo.matched[blockIdx] = true;

  // 更新小卡槽 DOM
  const cell = matchSlotsEl.querySelector(
    `.block-slot[data-combo-idx="${comboIdx}"][data-block-idx="${blockIdx}"]`
  );
  if (cell) {
    cell.textContent = card.text;
    cell.classList.add("filled");
  }

  // 統計
  correctCount++;
  streak++;

  // ATB 按比例填充
  const totalToMatch = combo.blocks.length - (combo.prefilled >= 0 ? 1 : 0);
  const atbGain = Math.round(PLAYER_ATB_PER_MATCH / Math.max(1, totalToMatch));
  playerAtb = Math.min(100, playerAtb + atbGain);
  updateBattleUI();

  // 檢查此 combo 是否全部 block 都已配對
  const comboComplete = combo.matched.every(Boolean);
  if (comboComplete) {
    // ✅ 整組 combo 完成
    const groupEl = matchSlotsEl.querySelectorAll(".combo-group")[comboIdx];
    if (groupEl) groupEl.classList.add("correct");
    clearedCombos++;
    trackComboClearedByRaw([combo.raw]);
    autoRemoveRow(combo.raw);
    matchFeedback.textContent = `✅ ${combo.blocks.join(" ")}  完成！`;
  } else {
    const done = combo.matched.filter(Boolean).length;
    matchFeedback.textContent = `✅ ${card.text}（${done}/${combo.blocks.length}）`;
  }
  matchFeedback.style.color = "#5fd18d";

  if (playerAtb >= 100) {
    setTimeout(() => playerAttack(), 200);
  }

  updateUI();
  updateQueueUI();
  saveBattleState();

  setTimeout(() => {
    roundLocked = false;
    checkRoundComplete();
  }, 300);
}

function handleWrongMatch(comboIdx, blockIdx, cardIdx) {
  roundLocked = true;
  const card = roundCards[cardIdx];
  const cardEl = card.el;

  // 錯誤動畫 — 卡片 + 被點擊的小卡槽
  cardEl.classList.remove("selected");
  cardEl.classList.add("wrong-flash");
  const cell = matchSlotsEl.querySelector(
    `.block-slot[data-combo-idx="${comboIdx}"][data-block-idx="${blockIdx}"]`
  );
  if (cell) cell.classList.add("wrong-flash");
  selectedCardEl = null;

  wrongCount++;
  streak = 0;

  enemyAtb = Math.min(100, enemyAtb + ENEMY_ATB_BOOST_ON_WRONG);
  updateBattleUI();

  matchFeedback.textContent = `❌ 配對錯誤！ 敵人 ATB +${ENEMY_ATB_BOOST_ON_WRONG}%`;
  matchFeedback.style.color = "#ff5555";

  battleLog(`⚡ 配對錯誤！${enemyName} ATB +${ENEMY_ATB_BOOST_ON_WRONG}%`, "#c77dff");

  updateUI();

  setTimeout(() => {
    cardEl.classList.remove("wrong-flash");
    if (cell) cell.classList.remove("wrong-flash");
    roundLocked = false;
    if (autoPlayEnabled) scheduleAutoMatch();
  }, 450);
}

function checkRoundComplete() {
  const allMatched = roundCombos.every(c => c.matched.every(Boolean));
  if (!allMatched) {
    if (autoPlayEnabled) scheduleAutoMatch();
    return;
  }

  matchFeedback.textContent = "🎉 全部配對成功！下一回合...";
  matchFeedback.style.color = "#ffcc02";

  setTimeout(() => {
    generateRound();
    if (autoPlayEnabled) scheduleAutoMatch();
  }, 800);
}

// ══════════════════════════════════════
//  ATB 戰鬥邏輯
// ══════════════════════════════════════

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function getEnemyTemplate(w) {
  const idx = Math.min(w - 1, ENEMY_WAVES.length - 1);
  const tmpl = ENEMY_WAVES[idx];
  const overflow = Math.max(0, w - ENEMY_WAVES.length);
  return {
    name: tmpl.name,
    hp: tmpl.baseHp + overflow * 30,
    atk: [tmpl.atk[0] + overflow * 3, tmpl.atk[1] + overflow * 5],
    atbSpeed: tmpl.atbSpeed + overflow * 0.3,
  };
}

function spawnEnemy() {
  const tmpl = getEnemyTemplate(wave);
  enemyName = tmpl.name;
  enemyMaxHp = tmpl.hp;
  enemyHp = tmpl.hp;
  enemyAtk = tmpl.atk;
  enemyAtbSpeed = tmpl.atbSpeed;
  enemyAtb = 0;
  battlePaused = false;

  enemyNameEl.textContent = enemyName;
  updateBattleUI();
  battleLog(`${enemyName} 出現了！`, "#ff8844");
}

function playerAttack() {
  if (playerDead) return;
  battlePaused = true;

  const dmg = randInt(PLAYER_ATK[0], PLAYER_ATK[1]);
  const bonus = Math.floor(streak / 3) * 0.2;
  const finalDmg = Math.round(dmg * (1 + bonus));

  enemyHp = Math.max(0, enemyHp - finalDmg);
  playerAtb = 0;

  floatDmg(enemySide, `-${finalDmg}`, "enemy-hit");
  enemySide.classList.add("shake");
  setTimeout(() => enemySide.classList.remove("shake"), 350);

  const bonusText = bonus > 0 ? ` (${streak}連擊 +${Math.round(bonus * 100)}%)` : "";
  battleLog(`⚔️ 勇者攻擊 → ${enemyName} 受到 ${finalDmg} 傷害${bonusText}`, "#5fd18d");

  updateBattleUI();

  if (enemyHp <= 0) {
    onEnemyDefeated();
  } else {
    setTimeout(() => { battlePaused = false; }, 300);
  }
}

function enemyAttack() {
  if (playerDead) return;
  battlePaused = true;

  const dmg = randInt(enemyAtk[0], enemyAtk[1]);
  playerHp = Math.max(0, playerHp - dmg);
  enemyAtb = 0;

  const playerSideEl = battleArea.querySelector(".player-side");
  floatDmg(playerSideEl, `-${dmg}`, "player-hit");
  playerSideEl.classList.add("shake");
  setTimeout(() => playerSideEl.classList.remove("shake"), 350);

  battleLog(`💥 ${enemyName} 攻擊 → 勇者 受到 ${dmg} 傷害`, "#ff6b6b");

  updateBattleUI();

  if (playerHp <= 0) {
    onPlayerDefeated();
  } else {
    setTimeout(() => { battlePaused = false; }, 300);
  }
}

function onEnemyDefeated() {
  killCount++;
  wave++;

  enemySide.classList.add("ko-flash");
  setTimeout(() => enemySide.classList.remove("ko-flash"), 700);

  battleLog(`🏆 ${enemyName} 被擊敗！`, "#ffcc02");

  const healAmt = Math.min(15 + wave * 2, playerMaxHp - playerHp);
  if (healAmt > 0) {
    playerHp = Math.min(playerMaxHp, playerHp + healAmt);
    const playerSideEl = battleArea.querySelector(".player-side");
    floatDmg(playerSideEl, `+${healAmt}`, "heal");
    battleLog(`💚 回復 ${healAmt} HP`, "#5bc0de");
  }

  updateBattleUI();
  saveBattleState();

  setTimeout(() => {
    spawnEnemy();
    battlePaused = false;
  }, 1000);
}

function onPlayerDefeated() {
  playerDead = true;
  battlePaused = true;
  roundLocked = true;
  stopAutoMatch();

  const playerSideEl = battleArea.querySelector(".player-side");
  playerSideEl.classList.add("ko-flash");

  battleLog("💀 勇者倒下了！3 秒後復活……", "#ff6b6b");

  reviveTimer = setTimeout(() => {
    playerHp = Math.round(playerMaxHp * 0.5);
    playerDead = false;
    battlePaused = false;
    roundLocked = false;
    playerSideEl.classList.remove("ko-flash");

    enemyAtb = 0;

    floatDmg(playerSideEl, "復活！", "heal");
    battleLog("✨ 勇者復活了！（HP 50%）", "#5bc0de");
    updateBattleUI();

    if (autoPlayEnabled) scheduleAutoMatch();
  }, 3000);
}

function atbTick() {
  if (battlePaused || playerDead) return;

  const increment = enemyAtbSpeed * (ATB_TICK_MS / 1000);
  enemyAtb = Math.min(100, enemyAtb + increment);

  enemyAtbFill.style.width = enemyAtb.toFixed(1) + "%";
  playerAtbFill.style.width = playerAtb.toFixed(1) + "%";

  if (enemyAtb >= 100) {
    enemyAttack();
  }

  if (playerAtb >= 100 && !playerDead) {
    playerAttack();
  }
}

function startAtbTimer() {
  if (atbTimer) clearInterval(atbTimer);
  atbTimer = setInterval(atbTick, ATB_TICK_MS);
}
function stopAtbTimer() {
  if (atbTimer) { clearInterval(atbTimer); atbTimer = null; }
}

// ══════════════════════════════════════
//  戰鬥 UI 更新
// ══════════════════════════════════════

function updateBattleUI() {
  const pHpPct = Math.max(0, (playerHp / playerMaxHp) * 100);
  playerHpFill.style.width = pHpPct.toFixed(1) + "%";
  playerHpText.textContent = `${playerHp}/${playerMaxHp}`;
  if (pHpPct > 50) playerHpFill.style.background = "linear-gradient(90deg, #2a7a4a, #5fd18d)";
  else if (pHpPct > 25) playerHpFill.style.background = "linear-gradient(90deg, #8a7a2a, #f7b955)";
  else playerHpFill.style.background = "linear-gradient(90deg, #8a2a2a, #ff6b6b)";

  const eHpPct = Math.max(0, (enemyHp / enemyMaxHp) * 100);
  enemyHpFill.style.width = eHpPct.toFixed(1) + "%";
  enemyHpText.textContent = `${enemyHp}/${enemyMaxHp}`;

  playerAtbFill.style.width = playerAtb.toFixed(1) + "%";
  enemyAtbFill.style.width = enemyAtb.toFixed(1) + "%";

  playerAtbFill.classList.toggle("full", playerAtb >= 100);
  enemyAtbFill.classList.toggle("full", enemyAtb >= 100);

  waveNumEl.textContent = wave;
  killCountEl.textContent = killCount;
}

function battleLog(msg, color) {
  battleLogEl.textContent = msg;
  battleLogEl.style.color = color || "#aab";
}

function floatDmg(parentEl, text, cssClass) {
  const el = document.createElement("div");
  el.className = "dmg-float " + (cssClass || "");
  el.textContent = text;
  el.style.left = (20 + Math.random() * 60) + "%";
  el.style.top = "10px";
  parentEl.style.position = "relative";
  parentEl.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ══════════════════════════════════════
//  戰鬥狀態存讀
// ══════════════════════════════════════

function saveBattleState() {
  const state = { wave, killCount, playerHp, playerMaxHp };
  localStorage.setItem(BATTLE_SAVE_KEY, JSON.stringify(state));
}

function loadBattleState() {
  try {
    const raw = localStorage.getItem(BATTLE_SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

// ══════════════════════════════════════
//  自動遊玩（自動配對）
// ══════════════════════════════════════

function toggleAutoPlay() {
  autoPlayEnabled = !autoPlayEnabled;
  autoPlayBtn.textContent = autoPlayEnabled ? "🤖 自動 ON" : "🤖 自動";
  autoPlayBtn.style.background = autoPlayEnabled ? "#2a7a4a" : "#1a1f3d";
  autoPlayBtn.style.color = autoPlayEnabled ? "#fff" : "#ccd";

  if (autoPlayEnabled) {
    scheduleAutoMatch();
  } else {
    stopAutoMatch();
  }
}

function scheduleAutoMatch() {
  stopAutoMatch();
  if (!autoPlayEnabled || playerDead || roundLocked) return;
  const delay = 400 + Math.random() * 400;
  autoMatchTimer = setTimeout(() => {
    if (!autoPlayEnabled || playerDead || roundLocked) return;
    doAutoMatch();
  }, delay);
}

function stopAutoMatch() {
  if (autoMatchTimer) { clearTimeout(autoMatchTimer); autoMatchTimer = null; }
}

function doAutoMatch() {
  // 找到第一張尚未配對且不是干擾卡的卡片
  const correctCardIdx = roundCards.findIndex(c =>
    c.comboIdx >= 0 && !c.el.classList.contains("matched")
  );
  if (correctCardIdx === -1) return;

  const card = roundCards[correctCardIdx];
  const cardEl = card.el;
  const cardText = card.text.trim().toLowerCase();

  // 找到任一尚未填入且文字匹配的小卡槽
  let targetComboIdx = -1, targetBlockIdx = -1;
  for (let ci = 0; ci < roundCombos.length; ci++) {
    const combo = roundCombos[ci];
    for (let bi = 0; bi < combo.blocks.length; bi++) {
      if (!combo.matched[bi] && combo.blocks[bi].trim().toLowerCase() === cardText) {
        targetComboIdx = ci;
        targetBlockIdx = bi;
        break;
      }
    }
    if (targetComboIdx >= 0) break;
  }
  if (targetComboIdx < 0) return;

  // 模擬選取卡片
  if (selectedCardEl) selectedCardEl.classList.remove("selected");
  cardEl.classList.add("selected");
  selectedCardEl = cardEl;

  // 延遲後模擬點擊正確的小卡槽
  setTimeout(() => {
    if (!autoPlayEnabled || playerDead) return;
    onSlotClick(targetComboIdx, targetBlockIdx);
  }, 200 + Math.random() * 200);
}

// ══════════════════════════════════════
//  UI 更新
// ══════════════════════════════════════

function updateUI() {
  matchStatsEl.textContent = `配對 ${correctCount} / 錯誤 ${wrongCount}`;
  correctEl.textContent = correctCount;
  streakEl.textContent = streak;
}

// ══════════════════════════════════════
//  初始化 & 重啟
// ══════════════════════════════════════

function restartGame() {
  syncStatsToSheets();
  stopAutoMatch();
  stopAtbTimer();
  if (reviveTimer) { clearTimeout(reviveTimer); reviveTimer = null; }

  // 重新初始化發牌Q（載入最新單字庫 + 隨機抽取 + shuffle）
  initComboQueue();

  correctCount = 0;
  wrongCount = 0;
  streak = 0;

  playerHp = PLAYER_BASE_HP;
  playerMaxHp = PLAYER_BASE_HP;
  playerAtb = 0;
  playerDead = false;
  wave = 1;
  killCount = 0;
  battlePaused = false;

  spawnEnemy();
  updateBattleUI();
  updateUI();
  updateQueueUI();
  saveBattleState();

  generateRound();
  startAtbTimer();

  if (autoPlayEnabled) scheduleAutoMatch();
}

function init() {
  try {
    preventZoom();

    restartBtn.addEventListener("click", restartGame);
    autoPlayBtn.addEventListener("click", toggleAutoPlay);

    // 初始化發牌Q
    initComboQueue();

    const savedBattle = loadBattleState();
    if (savedBattle) {
      wave = savedBattle.wave || 1;
      killCount = savedBattle.killCount || 0;
      playerHp = savedBattle.playerHp || PLAYER_BASE_HP;
      playerMaxHp = savedBattle.playerMaxHp || PLAYER_BASE_HP;
    }
    playerAtb = 0;
    enemyAtb = 0;
    playerDead = false;
    battlePaused = false;

    spawnEnemy();
    updateBattleUI();
    updateUI();
    updateQueueUI();

    generateRound();
    startAtbTimer();

  } catch (err) {
    console.error("Novel init error:", err);
    matchSlotsEl.innerHTML = '<div style="color:#ff5555;padding:12px;">❌ 初始化錯誤: ' + err.message + '</div>';
  }
}

init();
