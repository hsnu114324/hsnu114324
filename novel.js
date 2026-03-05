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
  document.addEventListener("touchmove", (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });
}

function isSingleWordMode() { return localStorage.getItem(SINGLE_WORD_MODE_KEY) === "1"; }
function isCustomActive()   { return localStorage.getItem(CUSTOM_ACTIVE_KEY) === "1"; }

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

function loadWordRows() {
  const ag = loadActiveGroups();
  const ca = isCustomActive();
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
          for (const r of parsed) { if (isValidRowString(r)) rows.push(r); }
        }
      }
    } catch { /* ignore */ }
  }
  if (rows.length > 0) return rows;
  if (ag.length > 0) { const a = []; for (const gi of ag) a.push(...(groupData[gi] || [])); if (a.length > 0) return a; }
  return [...DEFAULT_WORD_ROWS];
}

function buildPairsForQuiz(rows) {
  const pairs = [];
  for (const row of rows) {
    const parts = row.split(",").map(w => w.trim()).filter(Boolean);
    if (parts.length >= 2) {
      // 第 1 格 = 中文提示，第 2 格之後全部合併為德文答案
      const hint = parts[0];
      const answer = parts.slice(1).join(" ");
      pairs.push({ hint, answer, raw: row });
    }
  }
  return pairs;
}

// ── 學習統計 ──

function normalizeComboKey(combo) { return combo.map(w => w.trim().toLowerCase()).join(","); }
function loadComboStats() {
  try { const r = localStorage.getItem(STATS_KEY); if (!r) return {}; const p = JSON.parse(r); return (typeof p === "object" && p !== null) ? p : {}; } catch { return {}; }
}
function saveComboStats(stats) { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }

function trackComboAppear(combos) {
  const stats = loadComboStats();
  for (const combo of combos) {
    const key = normalizeComboKey(combo);
    const display = combo.join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display, lastSeen: "" };
    stats[key].appear++;
    stats[key].lastSeen = new Date().toISOString().slice(0, 10);
    stats[key].display = display;
  }
  saveComboStats(stats);
}
function trackComboCleared(combos) {
  const stats = loadComboStats();
  for (const combo of combos) {
    const key = normalizeComboKey(combo);
    const display = combo.join(",");
    if (!stats[key]) stats[key] = { appear: 0, cleared: 0, display, lastSeen: "" };
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

// 配對遊戲狀態
let roundSlots = [];       // [{hint, answer, raw, matched}]
let roundCards = [];        // [{text, pairIdx, el}]  pairIdx: 在 roundSlots 中的 index，-1 為干擾
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

const matchSlotsEl   = document.getElementById("matchSlots");
const matchCardsEl   = document.getElementById("matchCards");
const matchFeedback  = document.getElementById("matchFeedback");
const matchStatsEl   = document.getElementById("matchStats");
const restartBtn     = document.getElementById("restartBtn");
const autoPlayBtn    = document.getElementById("autoPlayBtn");
const correctEl      = document.getElementById("correctEl");
const streakEl       = document.getElementById("streakEl");

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
//  配對遊戲邏輯
// ══════════════════════════════════════

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateRound() {
  if (allPairs.length < 2) {
    matchSlotsEl.innerHTML = '<div style="color:#f7b955;padding:12px;">⚠ 單字不足，請到設定頁新增至少 2 組</div>';
    matchCardsEl.innerHTML = "";
    return;
  }


  // 從所有配對中抽取 N 個不重複的
  const n = Math.min(SLOTS_PER_ROUND, allPairs.length);
  const shuffled = shuffle([...allPairs]);
  const chosen = shuffled.slice(0, n);

  // 建立卡槽
  roundSlots = chosen.map(p => ({
    hint: p.hint,
    answer: p.answer,
    raw: p.raw,
    matched: false,
  }));

  // 統計：這些 combo 出現了
  trackComboAppear(chosen.map(p => [p.hint, p.answer]));

  // 建立答案卡片：正確的 + 干擾的
  const cards = chosen.map((p, i) => ({ text: p.answer, pairIdx: i }));

  // 加入干擾卡（從未被選中的配對中隨機取，且不與正確答案重複）
  const correctAnswerSet = new Set(chosen.map(p => p.answer.trim().toLowerCase()));
  const remaining = shuffled.slice(n).filter(p => !correctAnswerSet.has(p.answer.trim().toLowerCase()));
  const distractorCount = Math.min(DISTRACTORS, remaining.length);
  for (let i = 0; i < distractorCount; i++) {
    cards.push({ text: remaining[i].answer, pairIdx: -1 });
  }

  roundCards = shuffle(cards);
  selectedCardEl = null;
  roundLocked = false;

  renderRound();
}

function renderRound() {
  // 渲染卡槽
  matchSlotsEl.innerHTML = "";
  roundSlots.forEach((slot, idx) => {
    const el = document.createElement("div");
    el.className = "match-slot";
    el.dataset.idx = idx;
    const hintDiv = document.createElement("div");
    hintDiv.className = "slot-hint";
    hintDiv.textContent = slot.hint;
    const ansDiv = document.createElement("div");
    ansDiv.className = "slot-answer";
    ansDiv.id = "slotAnswer" + idx;
    ansDiv.textContent = "?";
    el.appendChild(hintDiv);
    el.appendChild(ansDiv);
    el.addEventListener("click", () => onSlotClick(idx));
    matchSlotsEl.appendChild(el);
  });

  // 渲染答案卡片
  matchCardsEl.innerHTML = "";
  roundCards.forEach((card, idx) => {
    const el = document.createElement("div");
    el.className = "match-card";
    el.textContent = card.text;
    el.dataset.idx = idx;
    el.addEventListener("click", () => onCardClick(idx, el));
    el.addEventListener("touchstart", (e) => onCardTouchStart(idx, el, e), { passive: true });
    card.el = el;
    matchCardsEl.appendChild(el);
  });

  // 全域觸控事件（拖曳 move / end）
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

  const touch = e.touches[0];
  // 記錄起始位置，用來判斷是點擊還是拖曳
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

  // 只要手指按住卡片就阻止頁面捲動
  e.preventDefault();

  const touch = e.touches[0];
  const dx = touch.clientX - dragState.startX;
  const dy = touch.clientY - dragState.startY;

  // 距離超過 8px 才開始拖曳（避免誤觸）
  if (!dragState.dragging && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    dragState.dragging = true;
    dragState.cardEl.classList.add("dragging");

    // 建立幽靈卡片
    const ghost = document.createElement("div");
    ghost.className = "match-ghost";
    ghost.textContent = dragState.cardEl.textContent;
    document.body.appendChild(ghost);
    dragState.ghostEl = ghost;

    // 高亮所有未配對的卡槽
    matchSlotsEl.querySelectorAll(".match-slot").forEach(s => {
      const idx = parseInt(s.dataset.idx);
      s.classList.toggle("highlight", !roundSlots[idx].matched);
    });
  }

  if (dragState.dragging && dragState.ghostEl) {
    dragState.ghostEl.style.left = touch.clientX + "px";
    dragState.ghostEl.style.top = touch.clientY + "px";

    // 偵測手指下方的卡槽
    const slotEls = matchSlotsEl.querySelectorAll(".match-slot");
    slotEls.forEach(s => {
      const rect = s.getBoundingClientRect();
      const over = touch.clientX >= rect.left && touch.clientX <= rect.right &&
                   touch.clientY >= rect.top && touch.clientY <= rect.bottom;
      const idx = parseInt(s.dataset.idx);
      s.classList.toggle("drop-target", over && !roundSlots[idx].matched);
    });
  }
}

function onCardTouchEnd(e) {
  if (!dragState) return;

  const wasDragging = dragState.dragging;
  const cardIdx = dragState.cardIdx;
  const cardEl = dragState.cardEl;

  // 清除幽靈 & 視覺狀態
  if (dragState.ghostEl) {
    dragState.ghostEl.remove();
  }
  cardEl.classList.remove("dragging");
  matchSlotsEl.querySelectorAll(".match-slot").forEach(s => {
    s.classList.remove("highlight");
    s.classList.remove("drop-target");
  });

  if (wasDragging) {
    // 拖曳結束 → 偵測放置的卡槽
    const touch = e.changedTouches[0];
    const slotEls = matchSlotsEl.querySelectorAll(".match-slot");
    let targetSlotIdx = -1;

    slotEls.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        targetSlotIdx = parseInt(s.dataset.idx);
      }
    });

    if (targetSlotIdx >= 0 && !roundSlots[targetSlotIdx].matched) {
      // 模擬選中卡片 → 放到卡槽
      selectedCardEl = cardEl;
      onSlotClick(targetSlotIdx);
    }
  }
  // 如果不是拖曳（只是點擊），交給 click 事件處理

  dragState = null;
}

function onCardClick(cardIdx, cardEl) {
  if (roundLocked || playerDead) return;

  // 如果已配對，忽略
  if (cardEl.classList.contains("matched")) return;

  // 如果已選中同一張，取消選取
  if (selectedCardEl === cardEl) {
    cardEl.classList.remove("selected");
    selectedCardEl = null;
    // 取消卡槽高亮
    matchSlotsEl.querySelectorAll(".match-slot").forEach(s => s.classList.remove("highlight"));
    return;
  }

  // 選中新卡片
  if (selectedCardEl) selectedCardEl.classList.remove("selected");
  cardEl.classList.add("selected");
  selectedCardEl = cardEl;

  // 高亮所有未配對的卡槽
  matchSlotsEl.querySelectorAll(".match-slot").forEach(s => {
    const idx = parseInt(s.dataset.idx);
    s.classList.toggle("highlight", !roundSlots[idx].matched);
  });
}

function onSlotClick(slotIdx) {
  if (roundLocked || playerDead) return;
  if (!selectedCardEl) return;
  if (roundSlots[slotIdx].matched) return;

  const cardIdx = parseInt(selectedCardEl.dataset.idx);
  const card = roundCards[cardIdx];
  const slot = roundSlots[slotIdx];

  // 取消所有高亮
  matchSlotsEl.querySelectorAll(".match-slot").forEach(s => s.classList.remove("highlight"));

  if (card.pairIdx === slotIdx) {
    // ✅ 配對正確！
    handleCorrectMatch(slotIdx, cardIdx);
  } else {
    // ❌ 配對錯誤
    handleWrongMatch(slotIdx, cardIdx);
  }
}

function handleCorrectMatch(slotIdx, cardIdx) {
  roundLocked = true;
  const slot = roundSlots[slotIdx];
  const card = roundCards[cardIdx];
  const cardEl = card.el;
  const slotEl = matchSlotsEl.children[slotIdx];

  // 標記已配對
  slot.matched = true;
  cardEl.classList.remove("selected");
  cardEl.classList.add("matched");
  slotEl.classList.add("correct");
  selectedCardEl = null;

  // 顯示答案
  const answerEl = document.getElementById("slotAnswer" + slotIdx);
  answerEl.textContent = card.text;
  answerEl.classList.add("filled");

  // 統計
  correctCount++;
  streak++;
  trackComboCleared([[slot.hint, slot.answer]]);
  autoRemoveRow(slot.raw);

  // ATB 填充
  playerAtb = Math.min(100, playerAtb + PLAYER_ATB_PER_MATCH);
  updateBattleUI();

  matchFeedback.textContent = `✅ ${slot.hint} = ${slot.answer}  ATB+${PLAYER_ATB_PER_MATCH}%`;
  matchFeedback.style.color = "#5fd18d";

  // 玩家 ATB 滿 → 攻擊
  if (playerAtb >= 100) {
    setTimeout(() => playerAttack(), 200);
  }

  updateUI();
  saveBattleState();

  // 檢查是否全部配對完成
  setTimeout(() => {
    roundLocked = false;
    checkRoundComplete();
  }, 300);
}

function handleWrongMatch(slotIdx, cardIdx) {
  roundLocked = true;
  const card = roundCards[cardIdx];
  const cardEl = card.el;
  const slotEl = matchSlotsEl.children[slotIdx];

  // 錯誤動畫
  cardEl.classList.remove("selected");
  cardEl.classList.add("wrong-flash");
  slotEl.classList.add("wrong-flash");
  selectedCardEl = null;

  // 統計
  wrongCount++;
  streak = 0;

  // 敵人 ATB 加速
  enemyAtb = Math.min(100, enemyAtb + ENEMY_ATB_BOOST_ON_WRONG);
  updateBattleUI();

  matchFeedback.textContent = `❌ 配對錯誤！ 敵人 ATB +${ENEMY_ATB_BOOST_ON_WRONG}%`;
  matchFeedback.style.color = "#ff5555";

  battleLog(`⚡ 配對錯誤！${enemyName} ATB +${ENEMY_ATB_BOOST_ON_WRONG}%`, "#c77dff");

  updateUI();

  setTimeout(() => {
    cardEl.classList.remove("wrong-flash");
    slotEl.classList.remove("wrong-flash");
    roundLocked = false;
    if (autoPlayEnabled) scheduleAutoMatch();
  }, 450);
}

function checkRoundComplete() {
  const allMatched = roundSlots.every(s => s.matched);
  if (!allMatched) {
    if (autoPlayEnabled) scheduleAutoMatch();
    return;
  }

  // 全部配對完成！
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
  // 找到第一個未配對的卡槽
  const unmatchedSlotIdx = roundSlots.findIndex(s => !s.matched);
  if (unmatchedSlotIdx === -1) return;

  // 找到對應的正確卡片
  const correctCardIdx = roundCards.findIndex(c => c.pairIdx === unmatchedSlotIdx && !c.el.classList.contains("matched"));
  if (correctCardIdx === -1) return;

  const cardEl = roundCards[correctCardIdx].el;

  // 模擬選取卡片
  if (selectedCardEl) selectedCardEl.classList.remove("selected");
  cardEl.classList.add("selected");
  selectedCardEl = cardEl;

  // 延遲後模擬點擊卡槽
  setTimeout(() => {
    if (!autoPlayEnabled || playerDead) return;
    onSlotClick(unmatchedSlotIdx);
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

  groupData = loadGroupData();
  const wordRows = loadWordRows();
  allPairs = buildPairsForQuiz(wordRows);

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

    groupData = loadGroupData();
    const wordRows = loadWordRows();
    allPairs = buildPairsForQuiz(wordRows);
    console.log("[Novel] loaded", allPairs.length, "pairs");

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

    generateRound();
    startAtbTimer();

  } catch (err) {
    console.error("Novel init error:", err);
    matchSlotsEl.innerHTML = '<div style="color:#ff5555;padding:12px;">❌ 初始化錯誤: ' + err.message + '</div>';
  }
}

init();
