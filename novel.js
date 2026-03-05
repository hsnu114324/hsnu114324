/* ═══════════════════════════════════════════════════════
   德文單字小說 ＋ ATB 戰鬥系統 (Word Novel + Battle)
   答對題目 → 填充行動條 + 揭露小說
   與俄羅斯方塊共用 localStorage 學習統計
   ═══════════════════════════════════════════════════════ */

// ══════════════════════════════════════
//  小說文本
// ══════════════════════════════════════

const NOVEL_TEXT = `第1章 這破宗門，誰愛呆誰呆
天衍宗，問劍峰上。

秦蓁滿身是血倒在自己的洞府之外，卻無一人關心，宗門所有人都只是惡狠狠地瞪著她，好似恨不得生飲其血、生啖其肉。

「你為什麼不去死！？」

「你居然敢重傷小師妹！」

「別忘了，你那條命，是小師妹剖了自己的金丹才救下來的，現在也該還給小師妹了。」

秦蓁不明白為什麼事情會變成現在這樣。

明明她昏迷前還是天衍宗人人敬仰的大師姐，可是自從那次魔族來犯，她燃燒丹元死守宗門重傷醒來后，一切都變了。

她多了一個不認識的小師妹，據說是師尊從魔族手裡救回來的，剛救回來時奄奄一息。

師尊用盡天材地寶才養好了她的身體，也助她結了金丹，但小師妹的那顆金丹卻被師尊換給了她，因為只有這樣才能救回她一命。

人人都說，小師妹為了救她如何如何，因此十分憐惜小師妹。

可是從沒有一個人問過她：「你要不要別人的金丹？」

她只是一覺醒來，就被千夫所指，怪她忘恩負義，可她直到剛剛才知道自己體內的金丹是別人的，多麼可笑！

她醒來后，從未與小師妹爭鋒，只閉關修鍊。

可誰想小師妹強闖她修鍊的洞府，被洞府內陣法所傷。

可沒人相信溫柔貼心的小師妹會做出這種事，所有人只覺得是她見不得小師妹好，才將人重傷至此。

她的師尊清和劍尊聞訊趕來，問也不問，一道劍雨便將她籠罩其中，不過片刻，千萬道劍氣便割開了她的血肉，將她重傷在地。

「不僅不知恩圖報，還傷害同門，秦蓁，你太讓本尊失望了。」

「是小師妹擅闖弟子洞府，被禁制所傷……」

「還敢狡辯！」

「師尊，就當是弟子擅闖師姐洞府吧，別因為弟子傷了你們這麼多年的師徒之情，師姐還傷著呢。」

這時，伏在清和劍尊身前的小師妹蘇蕊忽然柔聲求情道。

「小師妹，現在重傷的可是你，你幹嘛還要幫這個惡毒的女人說話？」

「小師妹你就是太善良了，可惜有些人就是不知道感恩。」

同門也都對著秦蓁指指點點，完全忘記了眼前這個人曾在危難之際，以一人之軀阻擋了魔族的千軍萬馬，護得他們周全。

而蘇蕊聞言更是在眾人看不見的角度，對著秦蓁輕蔑一笑。

秦蓁哪裡還看不出來，她是故意的。

「噌。」就在這時，秦蓁的本命劍驀地出鞘。

「秦蓁，你要做什麼？」清和劍尊以為秦蓁想要反抗，想也沒想，揮袖將人扇了出去。

秦蓁的後背撞到一邊的石壁，驀地嘔出一口鮮血，可即使如此，她也沒有鬆開手中長劍的意思，只是高高揚起手中的長劍，驀地向自己的腹部捅去。

「！！！」

秦蓁一寸一寸地將自己腹部剖開，猩紅的鮮血不斷地滴落著，不過片刻，便在她身前匯聚成了一片血泊。

蒼白的面上沒有一絲血色，因為劇痛，額頭上滲出了不少的汗，將她的頭髮打濕黏成了幾縷，她的身影微微顫抖著，好似下一秒就會因為劇痛昏死過去，。

但她卻挺直了自己的脊樑，將那顆被她靈力蘊養出瑩潤光澤的金丹取了出來。

狼狽。

十足的狼狽。

可是秦蓁那挺直的脊樑，卻是讓所有人忽視了她的狼狽，有的只是一種無法言說的驚恐和震撼。

剛剛還喧鬧不已的眾人，在這個瞬間忽然安靜了下來，安靜到幾乎所有人都能聽清秦蓁因為疼痛而劇烈喘息的聲音。

「小師妹。」

蘇蕊顯然也沒有想到事情會發生到這一步，整個人直接呆住了，只能愣愣地望向秦蓁。

「你的金丹還你。」秦蓁將金丹遞過，那隻原本素白的手上，此時沾滿了她的鮮血。

蘇蕊見狀，下意識地打了個寒顫，完全不敢去接那金丹。

她被清和劍尊取丹時，用的是最溫和的辦法，完全感覺不到一絲痛苦，而且因為她生於魔淵，那金丹在她體內不斷吸取她的靈力，只會讓她時時性命垂危，所以，被取走金丹對她反而是好事。

現在接回這金丹，無異於讓她去送死。

「我……」蘇蕊張了張嘴想要說些什麼，卻不知道說什麼是好。

秦蓁卻不管她的想法，只是將那枚染血的金丹放到了她手裡：「還你，我們兩清了。」

清和劍尊望著自己狼狽不堪、渾身是血的大弟子，第一次產生了一種失控感。

他沒想逼迫她至此，他只是希望她聽話一些，不要總是針對蘇蕊，畢竟蘇蕊那般可憐。

「你好好養傷……」

清和劍尊的話還沒有說完，秦蓁卻是忽然跪下，對著他深深一拜：「弟子秦蓁多謝師尊多年教導之恩，現在弟子金丹已失，恐無法再繼續修鍊，還請師尊……舍了弟子吧，放弟子出宗。」

「出……宗？」

「是，弟子既然不能在守宗時坦坦蕩蕩地死去，至少以後想要清清白白地活著。」

清和劍尊看著眼前的秦蓁，彷彿透過她看到了很多年前那個小小的、伏在自己面前的女孩，那時秦蓁拜入宗門的時候，眼裡全是對著他的崇拜和欣喜。

可現在的她，望向他時冷漠又失望。

清和劍尊神情一時間有些恍惚。

可就在這時，蘇蕊忽然怯怯地拉了拉他一片衣角，不解地問道：「我們只是想要救大師姐，我們做錯了嗎，師尊？」

是啊。

他們做這麼多還不是為了救她！秦蓁不領情就算了，現在居然還要叛出師門，該失望的分明是他才對！

想到這裡，清和劍尊的語氣瞬間冷淡了許多：「你可想好了，一旦踏出宗門，以後你是死是活都與我天衍宗無關。」

「是，想好了。」

「哼，冥頑不靈。」清和劍尊怒斥一聲，一甩衣袖便帶著蘇蕊離開了。

秦蓁認真地磕完了拜別的頭，便起身往總門外走去。

猩紅的鮮血不斷從她身上滴落，染紅了下山的路。

洞府外那麼多人，卻沒一人再敢上去攔她，即使現在秦蓁失去金丹，修為全無。

「嗤——」

可就在秦蓁踏出天衍宗山門時，一把長劍豁然貫穿了她的胸口。

秦蓁反手攻去，卻因為靈力全失，只能抓下眼前黑衣人的面具，而那張面具下赫然是一張熟悉的臉。

屬於她未婚夫、也是他大師兄明哲的臉。

「為什麼？」

「怪只怪你不該招惹小師妹，還有……」

明哲手中的長劍猛地一轉，竟是將秦蓁體內的一根瑩白的骨頭剃了出來。

「誰讓天生劍骨長在了你身上。」

秦蓁眼前驟然一黑，意識消散前的最後一秒，她猛地拔下頭上銀簪狠狠刺入了明哲左眼。

「啊！」

秦蓁感覺自己的靈魂似乎被拉扯著，在生死的邊緣，秦蓁忽然想起許多事，比如——她是穿越來的，還穿成了萬人迷女主文里的一個炮灰。

這個萬人迷女主角不是別人，正是她的小師妹蘇蕊，而她的師尊、未婚夫都是女主的舔狗之一。

她的一生，不過是別人的墊腳石。

憑什麼？

她不甘心！

……

「秦蓁，秦蓁，醒醒！」

秦蓁感覺到一陣劇烈搖晃，她驀地睜開了眼睛。

「你在發什麼呆啊？該你去測靈根了。」

「測靈根？」

秦蓁還有些恍惚，她下意識地摸了摸自己的心口，卻並沒有摸到什麼傷口，身上也沒有什麼血跡。

她這是做了個噩夢？

「對啊，你不是來拜天衍宗的嗎？輪到你測靈根了，快去吧。」

天衍宗……

天衍宗！

秦蓁的恍惚的神情瞬間變得極為嚴肅，她想起這是哪一天了。

這一天，在問仙台上舉行了十年一次的仙門大選，所有大小宗門都在這裡招選弟子，而她也是這一天拜入了天衍宗。

她這是重生了？

「秦蓁，你怎麼又走神？」

秦蓁還未反應過來，和她一起來的女孩子便拉著她的手，將她的手按在了測試靈根的玉牌之上。

「雙靈根？」天衍宗長老正要將秦蓁收入門內，下一秒卻眉頭一皺，「怎麼是水火雙靈根？」

秦蓁此時也回過了神來。

等等，她不是天靈根嗎？`;

const NOVEL_SAVE_KEY = "word_novel_progress_v1";
const BATTLE_SAVE_KEY = "word_novel_battle_v1";
const CHARS_PER_ANSWER = 5;
const MAX_VISIBLE_LINES = 50;

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
    if (parts.length >= 2) pairs.push({ hint: parts[0], answer: parts[1], raw: row });
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

// ══════════════════════════════════════
//  ATB 戰鬥系統 — 敵人資料
// ══════════════════════════════════════

const ENEMY_WAVES = [
  { name: "👹 魔族士兵",    emoji: "👹", baseHp: 40,  atk: [6, 10],  atbSpeed: 2.5  },
  { name: "🐺 妖狼",       emoji: "🐺", baseHp: 55,  atk: [8, 13],  atbSpeed: 3.0  },
  { name: "👿 魔族精英",    emoji: "👿", baseHp: 70,  atk: [10, 16], atbSpeed: 3.5  },
  { name: "🗡️ 魔族刺客",   emoji: "🗡️", baseHp: 60,  atk: [14, 20], atbSpeed: 4.5  },
  { name: "🛡️ 魔族隊長",   emoji: "🛡️", baseHp: 90,  atk: [10, 18], atbSpeed: 3.0  },
  { name: "🔥 炎魔",       emoji: "🔥", baseHp: 100, atk: [12, 20], atbSpeed: 3.5  },
  { name: "❄️ 冰魄將軍",   emoji: "❄️", baseHp: 120, atk: [14, 22], atbSpeed: 4.0  },
  { name: "💀 亡骨魔將",    emoji: "💀", baseHp: 140, atk: [16, 25], atbSpeed: 4.5  },
  { name: "🐉 妖龍",       emoji: "🐉", baseHp: 180, atk: [18, 28], atbSpeed: 5.0  },
  { name: "😈 魔族大君",    emoji: "😈", baseHp: 220, atk: [20, 32], atbSpeed: 5.5  },
];

const PLAYER_BASE_HP = 100;
const PLAYER_ATK = [15, 25];           // 玩家每次攻擊傷害範圍
const PLAYER_ATB_PER_CORRECT = 50;     // 答對一題 ATB +50%
const ENEMY_ATB_BOOST_ON_WRONG = 25;   // 答錯時敵人 ATB +25%
const BONUS_CHARS_ON_KILL = 5;         // 擊殺敵人額外揭露字數
const ATB_TICK_MS = 100;               // ATB tick 間隔 (ms)

// ══════════════════════════════════════
//  遊戲狀態
// ══════════════════════════════════════

let allPairs = [];
let currentQuiz = null;
let quizLocked = false;
let correctCount = 0;
let wrongCount = 0;
let streak = 0;
let novelPos = 0;
let displayedBlocks = [];

// ATB 戰鬥狀態
let playerHp = PLAYER_BASE_HP;
let playerMaxHp = PLAYER_BASE_HP;
let playerAtb = 0;           // 0 ~ 100
let enemyHp = 0;
let enemyMaxHp = 0;
let enemyAtb = 0;            // 0 ~ 100
let enemyAtbSpeed = 0;       // %/秒
let enemyAtk = [0, 0];
let enemyName = "";
let wave = 1;
let killCount = 0;
let battlePaused = false;     // 暫停 ATB（例如攻擊動畫中）
let atbTimer = null;
let playerDead = false;
let reviveTimer = null;

// 自動遊玩
let autoPlayEnabled = false;
let autoAnswerTimer = null;

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════

const quizWordEl        = document.getElementById("quizWord");
const quizPairEl        = document.getElementById("quizPair");
const quizFeedback      = document.getElementById("quizFeedback");
const quizStatsEl       = document.getElementById("quizStats");
const btnCorrect        = document.getElementById("btnCorrect");
const btnWrong          = document.getElementById("btnWrong");
const restartBtn        = document.getElementById("restartBtn");
const autoPlayBtn       = document.getElementById("autoPlayBtn");
const novelScroll       = document.getElementById("novelScroll");
const novelProgressText = document.getElementById("novelProgressText");
const novelProgressFill = document.getElementById("novelProgressFill");
const correctEl         = document.getElementById("correctEl");
const streakEl          = document.getElementById("streakEl");

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
//  ATB 戰鬥邏輯
// ══════════════════════════════════════

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function getEnemyTemplate(w) {
  const idx = Math.min(w - 1, ENEMY_WAVES.length - 1);
  const tmpl = ENEMY_WAVES[idx];
  // 超過模板上限後，HP 與 ATK 持續成長
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

/** 玩家攻擊敵人 */
function playerAttack() {
  if (playerDead) return;
  battlePaused = true;

  const dmg = randInt(PLAYER_ATK[0], PLAYER_ATK[1]);
  // 連擊加成：每 3 連答多 20% 傷害
  const bonus = Math.floor(streak / 3) * 0.2;
  const finalDmg = Math.round(dmg * (1 + bonus));

  enemyHp = Math.max(0, enemyHp - finalDmg);
  playerAtb = 0;

  // 視覺
  floatDmg(enemySide, `-${finalDmg}`, "enemy-hit");
  enemySide.classList.add("shake");
  setTimeout(() => enemySide.classList.remove("shake"), 350);

  const bonusText = bonus > 0 ? ` (${streak}連擊 +${Math.round(bonus*100)}%)` : "";
  battleLog(`⚔️ 勇者攻擊 → ${enemyName} 受到 ${finalDmg} 傷害${bonusText}`, "#5fd18d");

  updateBattleUI();

  if (enemyHp <= 0) {
    onEnemyDefeated();
  } else {
    setTimeout(() => { battlePaused = false; }, 300);
  }
}

/** 敵人攻擊玩家 */
function enemyAttack() {
  if (playerDead) return;
  battlePaused = true;

  const dmg = randInt(enemyAtk[0], enemyAtk[1]);
  playerHp = Math.max(0, playerHp - dmg);
  enemyAtb = 0;

  // 視覺
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

/** 敵人被擊敗 */
function onEnemyDefeated() {
  killCount++;
  wave++;

  enemySide.classList.add("ko-flash");
  setTimeout(() => enemySide.classList.remove("ko-flash"), 700);

  battleLog(`🏆 ${enemyName} 被擊敗！ 額外獲得 ${BONUS_CHARS_ON_KILL} 字！`, "#ffcc02");

  // 額外揭露小說字數作為獎勵
  revealChars(BONUS_CHARS_ON_KILL);

  // 玩家回復少量 HP
  const healAmt = Math.min(15 + wave * 2, playerMaxHp - playerHp);
  if (healAmt > 0) {
    playerHp = Math.min(playerMaxHp, playerHp + healAmt);
    const playerSideEl = battleArea.querySelector(".player-side");
    floatDmg(playerSideEl, `+${healAmt}`, "heal");
    battleLog(`💚 回復 ${healAmt} HP`, "#5bc0de");
  }

  updateBattleUI();
  saveBattleState();

  // 短暫延遲後生成下一波敵人
  setTimeout(() => {
    spawnEnemy();
    battlePaused = false;
  }, 1000);
}

/** 玩家被擊敗 */
function onPlayerDefeated() {
  playerDead = true;
  battlePaused = true;
  quizLocked = true;
  stopAutoAnswer();

  const playerSideEl = battleArea.querySelector(".player-side");
  playerSideEl.classList.add("ko-flash");

  battleLog("💀 勇者倒下了！3 秒後復活……", "#ff6b6b");

  // 3 秒後復活
  reviveTimer = setTimeout(() => {
    playerHp = Math.round(playerMaxHp * 0.5);
    playerDead = false;
    battlePaused = false;
    quizLocked = false;
    playerSideEl.classList.remove("ko-flash");

    // 敵人 ATB 歸零（給玩家喘息空間）
    enemyAtb = 0;

    const playerSideEl2 = battleArea.querySelector(".player-side");
    floatDmg(playerSideEl2, "復活！", "heal");
    battleLog("✨ 勇者復活了！（HP 50%）", "#5bc0de");
    updateBattleUI();

    if (autoPlayEnabled) scheduleAutoAnswer();
    if (!currentQuiz) nextQuiz();
  }, 3000);
}

/** ATB 主 tick：每 100ms 呼叫一次 */
function atbTick() {
  if (battlePaused || playerDead) return;

  // 敵人 ATB 自動填充
  const increment = enemyAtbSpeed * (ATB_TICK_MS / 1000);
  enemyAtb = Math.min(100, enemyAtb + increment);

  // 更新 ATB 條視覺
  enemyAtbFill.style.width = enemyAtb.toFixed(1) + "%";
  playerAtbFill.style.width = playerAtb.toFixed(1) + "%";

  // 敵人 ATB 滿 → 攻擊
  if (enemyAtb >= 100) {
    enemyAttack();
  }

  // 玩家 ATB 滿 → 自動攻擊
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
  // Player HP
  const pHpPct = Math.max(0, (playerHp / playerMaxHp) * 100);
  playerHpFill.style.width = pHpPct.toFixed(1) + "%";
  playerHpText.textContent = `${playerHp}/${playerMaxHp}`;
  // HP 條變色
  if (pHpPct > 50) playerHpFill.style.background = "linear-gradient(90deg, #2a7a4a, #5fd18d)";
  else if (pHpPct > 25) playerHpFill.style.background = "linear-gradient(90deg, #8a7a2a, #f7b955)";
  else playerHpFill.style.background = "linear-gradient(90deg, #8a2a2a, #ff6b6b)";

  // Enemy HP
  const eHpPct = Math.max(0, (enemyHp / enemyMaxHp) * 100);
  enemyHpFill.style.width = eHpPct.toFixed(1) + "%";
  enemyHpText.textContent = `${enemyHp}/${enemyMaxHp}`;

  // ATB
  playerAtbFill.style.width = playerAtb.toFixed(1) + "%";
  enemyAtbFill.style.width = enemyAtb.toFixed(1) + "%";

  // ATB 滿時加上 pulse
  playerAtbFill.classList.toggle("full", playerAtb >= 100);
  enemyAtbFill.classList.toggle("full", enemyAtb >= 100);

  // Wave info
  waveNumEl.textContent = wave;
  killCountEl.textContent = killCount;
}

function battleLog(msg, color) {
  battleLogEl.textContent = msg;
  battleLogEl.style.color = color || "#aab";
}

/** 飄字傷害效果 */
function floatDmg(parentEl, text, cssClass) {
  const el = document.createElement("div");
  el.className = "dmg-float " + (cssClass || "");
  el.textContent = text;
  // 隨機水平偏移
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
//  小說顯示邏輯
// ══════════════════════════════════════

function takeVisibleChars(startPos, n) {
  let collected = "";
  let pos = startPos;
  while (collected.length < n && pos < NOVEL_TEXT.length) {
    const ch = NOVEL_TEXT[pos];
    pos++;
    if (ch === "\n") continue;
    collected += ch;
  }
  return { text: collected, newPos: pos };
}

function revealChars(n) {
  if (novelPos >= NOVEL_TEXT.length) return;

  const result = takeVisibleChars(novelPos, n);
  if (result.text.length === 0) return;
  novelPos = result.newPos;

  localStorage.setItem(NOVEL_SAVE_KEY, String(novelPos));

  const blockEl = appendBlock(result.text, true);

  setTimeout(() => { if (blockEl) blockEl.classList.remove("new"); }, 1000);

  requestAnimationFrame(() => {
    blockEl.scrollIntoView({ block: "end", behavior: "smooth" });
  });

  updateProgress();
}

function appendBlock(text, isNew) {
  const el = document.createElement("span");
  el.className = isNew ? "novel-chunk new" : "novel-chunk";
  el.textContent = text;
  novelScroll.appendChild(el);
  displayedBlocks.push(el);

  while (displayedBlocks.length > MAX_VISIBLE_LINES) {
    const oldest = displayedBlocks.shift();
    oldest.classList.add("fading");
    setTimeout(() => oldest.remove(), 400);
  }
  return el;
}

function updateProgress() {
  const pct = Math.min(100, (novelPos / NOVEL_TEXT.length * 100)).toFixed(1);
  novelProgressText.textContent = `進度 ${pct}%（${novelPos} / ${NOVEL_TEXT.length}）`;
  novelProgressFill.style.width = pct + "%";
}

function restoreNovel() {
  novelScroll.innerHTML = "";
  displayedBlocks = [];

  const saved = parseInt(localStorage.getItem(NOVEL_SAVE_KEY), 10);
  const targetPos = (!isNaN(saved) && saved > 0) ? Math.min(saved, NOVEL_TEXT.length) : 0;

  if (targetPos === 0) {
    novelPos = 0;
    updateProgress();
    return;
  }

  let pos = 0;
  const blocks = [];
  while (pos < targetPos) {
    const result = takeVisibleChars(pos, CHARS_PER_ANSWER);
    if (result.text.length === 0) break;
    blocks.push(result.text);
    pos = result.newPos;
  }

  const startIdx = Math.max(0, blocks.length - MAX_VISIBLE_LINES);
  for (let i = startIdx; i < blocks.length; i++) {
    appendBlock(blocks[i], false);
  }

  novelPos = targetPos;
  updateProgress();

  requestAnimationFrame(() => {
    novelScroll.scrollTop = novelScroll.scrollHeight;
  });
}

// ══════════════════════════════════════
//  出題邏輯（整合 ATB）
// ══════════════════════════════════════

function nextQuiz() {
  if (allPairs.length < 2) {
    quizWordEl.textContent = "⚠ 單字不足（" + allPairs.length + " 組）";
    quizPairEl.textContent = "請到設定頁面新增至少 2 組單字";
    quizFeedback.textContent = "需要 ≥ 2 組單字才能出題";
    quizFeedback.style.color = "#f7b955";
    return;
  }

  if (novelPos >= NOVEL_TEXT.length) {
    quizWordEl.textContent = "🎉 恭喜！";
    quizPairEl.textContent = "小說已全部揭曉！";
    quizFeedback.textContent = "第1章完結";
    quizFeedback.style.color = "#ffcc02";
    quizLocked = true;
    stopAutoAnswer();
    stopAtbTimer();
    battleLog("🏁 小說讀完了！戰鬥結束！", "#ffcc02");
    return;
  }

  const idx = Math.floor(Math.random() * allPairs.length);
  const pair = allPairs[idx];
  const isCorrect = Math.random() < 0.5;

  let shownAnswer;
  if (isCorrect) {
    shownAnswer = pair.answer;
  } else {
    let wrongIdx;
    do { wrongIdx = Math.floor(Math.random() * allPairs.length); } while (wrongIdx === idx);
    shownAnswer = allPairs[wrongIdx].answer;
  }

  currentQuiz = {
    hint: pair.hint,
    correctAnswer: pair.answer,
    shown: shownAnswer,
    isCorrect,
    combo: [pair.hint, pair.answer],
  };

  trackComboAppear([currentQuiz.combo]);

  quizWordEl.textContent = pair.hint;
  quizPairEl.textContent = shownAnswer;
  quizFeedback.textContent = " ";
  quizFeedback.style.color = "";
  quizLocked = false;

  if (autoPlayEnabled) scheduleAutoAnswer();
}

function answerQuiz(userSaidCorrect) {
  if (!currentQuiz || quizLocked || playerDead) return;
  quizLocked = true;

  const isRight = (userSaidCorrect === currentQuiz.isCorrect);

  if (isRight) {
    correctCount++;
    streak++;
    trackComboCleared([currentQuiz.combo]);

    // ATB 填充
    playerAtb = Math.min(100, playerAtb + PLAYER_ATB_PER_CORRECT);
    updateBattleUI();

    quizFeedback.textContent = `✅ 答對！+5字 ATB+${PLAYER_ATB_PER_CORRECT}%`;
    quizFeedback.style.color = "#5fd18d";

    // 揭露小說
    revealChars(CHARS_PER_ANSWER);

    // 玩家 ATB 滿 → 立即攻擊
    if (playerAtb >= 100) {
      setTimeout(() => playerAttack(), 200);
    }

    setTimeout(() => nextQuiz(), 600);
  } else {
    wrongCount++;
    streak = 0;

    // 答錯 → 敵人 ATB 加速
    enemyAtb = Math.min(100, enemyAtb + ENEMY_ATB_BOOST_ON_WRONG);
    updateBattleUI();

    const correctText = currentQuiz.isCorrect ? "✅ 對" : "❌ 錯";
    quizFeedback.textContent = `❌ 答錯！正解：${correctText}（${currentQuiz.hint} = ${currentQuiz.correctAnswer}）`;
    quizFeedback.style.color = "#ff5555";

    battleLog(`⚡ 答錯！${enemyName} ATB +${ENEMY_ATB_BOOST_ON_WRONG}%`, "#c77dff");

    setTimeout(() => nextQuiz(), 1800);
  }

  updateUI();
  saveBattleState();
}

// ══════════════════════════════════════
//  自動遊玩
// ══════════════════════════════════════

function toggleAutoPlay() {
  autoPlayEnabled = !autoPlayEnabled;
  autoPlayBtn.textContent = autoPlayEnabled ? "🤖 自動 ON" : "🤖 自動";
  autoPlayBtn.style.background = autoPlayEnabled ? "#2a7a4a" : "#1a1f3d";
  autoPlayBtn.style.color = autoPlayEnabled ? "#fff" : "#ccd";

  if (autoPlayEnabled && !quizLocked && currentQuiz) {
    scheduleAutoAnswer();
  } else {
    stopAutoAnswer();
  }
}

function scheduleAutoAnswer() {
  stopAutoAnswer();
  if (!autoPlayEnabled || !currentQuiz || playerDead) return;
  const delay = 600 + Math.random() * 500;
  autoAnswerTimer = setTimeout(() => {
    if (!autoPlayEnabled || !currentQuiz || quizLocked || playerDead) return;
    answerQuiz(currentQuiz.isCorrect);
  }, delay);
}

function stopAutoAnswer() {
  if (autoAnswerTimer) { clearTimeout(autoAnswerTimer); autoAnswerTimer = null; }
}

// ══════════════════════════════════════
//  UI 更新
// ══════════════════════════════════════

function updateUI() {
  quizStatsEl.textContent = `答對 ${correctCount} / 答錯 ${wrongCount}`;
  correctEl.textContent = correctCount;
  streakEl.textContent = streak;
}

// ══════════════════════════════════════
//  初始化 & 重啟
// ══════════════════════════════════════

function restartGame() {
  syncStatsToSheets();
  stopAutoAnswer();
  stopAtbTimer();
  if (reviveTimer) { clearTimeout(reviveTimer); reviveTimer = null; }

  groupData = loadGroupData();
  const wordRows = loadWordRows();
  allPairs = buildPairsForQuiz(wordRows);

  correctCount = 0;
  wrongCount = 0;
  streak = 0;

  // 重設戰鬥
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

  startAtbTimer();
  nextQuiz();
}

function init() {
  try {
    preventZoom();

    btnCorrect.addEventListener("click", () => answerQuiz(true));
    btnWrong.addEventListener("click", () => answerQuiz(false));
    restartBtn.addEventListener("click", restartGame);
    autoPlayBtn.addEventListener("click", toggleAutoPlay);

    groupData = loadGroupData();
    const wordRows = loadWordRows();
    allPairs = buildPairsForQuiz(wordRows);
    console.log("[Novel] loaded", allPairs.length, "pairs");

    // 還原小說進度
    restoreNovel();

    // 還原戰鬥狀態
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
    startAtbTimer();
    nextQuiz();

  } catch (err) {
    console.error("Novel init error:", err);
    if (quizWordEl) quizWordEl.textContent = "❌ 初始化錯誤";
    if (quizPairEl) quizPairEl.textContent = err.message;
  }
}

init();
