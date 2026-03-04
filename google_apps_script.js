/**
 * =======================================================
 *  Word Tetris — 學習統計同步 Google Apps Script
 * =======================================================
 *
 *  ▸ 部署步驟：
 *    1. 開一個新的 Google Sheets 試算表
 *    2. 點選上方「擴充功能 → Apps Script」
 *    3. 把這個檔案的 **全部內容** 貼進 Apps Script 編輯器
 *       （取代原本的 function myFunction(){} ）
 *    4. 點選上方「部署 → 新增部署」
 *       - 類型選「網頁應用程式」
 *       - 執行身分：我自己
 *       - 誰可存取：「所有人」（不需要登入）
 *    5. 按「部署」，複製產生的網址
 *    6. 回到 settings.js，把網址貼到 APPS_SCRIPT_URL 常數
 *
 *  ▸ 前端需搭配 Google 登入（GIS），登入後會一併送出 userEmail
 *
 *  ▸ 試算表格式（會自動建立）：
 *    | user_email | user_name | combo_key | display | appear | cleared | fail_rate | last_seen | last_synced |
 *
 *  ▸ API：
 *    POST  { action:"sync", stats:{...}, userEmail, userName }  → 寫入/更新統計
 *    GET   ?action=stats&email=xxx                              → 讀取該使用者所有統計
 *    GET   ?action=failed50&email=xxx                           → 讀取失敗率 > 50% 的組合
 *
 *  ▸ 注意：每次修改此 Script 後，需要「新增部署」或
 *    「管理部署 → 鉛筆圖示 → 版本選新版 → 部署」才會生效
 * =======================================================
 */

// ═══════════════════════════════════════════
//  POST：寫入 / 更新統計
// ═══════════════════════════════════════════

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === "sync" && body.stats) {
      var userEmail = body.userEmail || "anonymous";
      var userName = body.userName || "";
      return syncStats(body.stats, userEmail, userName);
    }
    return jsonResponse({ ok: false, error: "unknown action" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function syncStats(stats, userEmail, userName) {
  var sheet = getOrCreateStatsSheet();

  // 讀取現有資料，建立 (user_email + combo_key) → row 對應
  var data = sheet.getDataRange().getValues();
  var keyToRow = {};
  for (var i = 1; i < data.length; i++) {
    var compositeKey = data[i][0] + "||" + data[i][2];
    keyToRow[compositeKey] = i + 1;
  }

  var now = new Date().toISOString();
  var keys = Object.keys(stats);
  var newRows = [];

  for (var k = 0; k < keys.length; k++) {
    var comboKey = keys[k];
    var s = stats[comboKey];
    var appear = s.appear || 0;
    var cleared = s.cleared || 0;
    var failRate =
      appear > 0
        ? (((appear - cleared) / appear) * 100).toFixed(1) + "%"
        : "0%";
    var display = s.display || comboKey;
    var lastSeen = s.lastSeen || "";
    var origRow = s.origRow || ""; // 單字模式：原始 2 欄格式
    var compositeKey = userEmail + "||" + comboKey;

    if (keyToRow[compositeKey]) {
      var rowNum = keyToRow[compositeKey];
      sheet.getRange(rowNum, 2).setValue(userName);
      sheet.getRange(rowNum, 4).setValue(display);
      sheet.getRange(rowNum, 5).setValue(appear);
      sheet.getRange(rowNum, 6).setValue(cleared);
      sheet.getRange(rowNum, 7).setValue(failRate);
      sheet.getRange(rowNum, 8).setValue(lastSeen);
      sheet.getRange(rowNum, 9).setValue(now);
      if (origRow) sheet.getRange(rowNum, 10).setValue(origRow);
    } else {
      newRows.push([
        userEmail, userName, comboKey, display,
        appear, cleared, failRate, lastSeen, now, origRow,
      ]);
    }
  }

  if (newRows.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, newRows.length, 10).setValues(newRows);
  }

  if (sheet.getLastRow() > 1) {
    sheet
      .getRange(2, 1, sheet.getLastRow() - 1, 10)
      .sort([
        { column: 1, ascending: true },
        { column: 7, ascending: false },
      ]);
  }

  return jsonResponse({
    ok: true,
    user: userEmail,
    updated: keys.length - newRows.length,
    inserted: newRows.length,
    total: keys.length,
  });
}

// ═══════════════════════════════════════════
//  GET：讀取統計
// ═══════════════════════════════════════════

function doGet(e) {
  try {
    var action = (e.parameter && e.parameter.action) || "";
    var email = (e.parameter && e.parameter.email) || "";
    var callback = (e.parameter && e.parameter.callback) || "";

    var result;
    if (action === "stats") {
      result = getStatsForUserObj(email);
    } else if (action === "failed50") {
      result = getFailedForUserObj(email, 50);
    } else if (action === "ping") {
      // 簡單的健康檢查端點
      result = { ok: true, message: "pong", timestamp: new Date().toISOString() };
    } else {
      result = { ok: false, error: "unknown action. use ?action=stats&email=xxx or ?action=failed50&email=xxx or ?action=ping" };
    }

    // JSONP 支援：如果有 callback 參數，用 callback(json) 包裝
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + JSON.stringify(result) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonResponse(result);
  } catch (err) {
    var errResult = { ok: false, error: err.message, stack: err.stack };
    var cb = (e.parameter && e.parameter.callback) || "";
    if (cb) {
      return ContentService.createTextOutput(cb + "(" + JSON.stringify(errResult) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonResponse(errResult);
  }
}

/** 回傳該使用者的所有統計資料（物件） */
function getStatsForUserObj(email) {
  var sheet = getOrCreateStatsSheet();
  var data = sheet.getDataRange().getValues();
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (email && row[0] !== email) continue;
    var appear = parseInt(row[4], 10) || 0;
    var cleared = parseInt(row[5], 10) || 0;
    var failRate = appear > 0 ? ((appear - cleared) / appear) : 0;
    results.push({
      comboKey: row[2],
      display: row[3],
      appear: appear,
      cleared: cleared,
      failRate: Math.round(failRate * 1000) / 1000,
      lastSeen: row[7] ? row[7].toString() : "",
    });
  }

  results.sort(function (a, b) {
    if (b.failRate !== a.failRate) return b.failRate - a.failRate;
    return b.appear - a.appear;
  });

  return { ok: true, email: email, count: results.length, stats: results };
}

/** 回傳失敗率超過指定門檻的組合（物件） */
function getFailedForUserObj(email, thresholdPct) {
  var sheet = getOrCreateStatsSheet();
  var data = sheet.getDataRange().getValues();
  var results = [];
  var threshold = thresholdPct / 100;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (email && row[0] !== email) continue;
    var appear = parseInt(row[4], 10) || 0;
    var cleared = parseInt(row[5], 10) || 0;
    if (appear === 0) continue;
    var failRate = (appear - cleared) / appear;
    if (failRate > threshold) {
      var entry = {
        comboKey: row[2],
        display: row[3],
        appear: appear,
        cleared: cleared,
        failRate: Math.round(failRate * 1000) / 1000,
      };
      // 第 10 欄 (index 9) 存放原始 row 格式（單字模式用）
      if (row[9]) entry.origRow = row[9];
      results.push(entry);
    }
  }

  results.sort(function (a, b) {
    if (b.failRate !== a.failRate) return b.failRate - a.failRate;
    return b.appear - a.appear;
  });

  return { ok: true, email: email, threshold: thresholdPct + "%", count: results.length, words: results };
}

// 向下相容：保留原本函式（直接回傳 ContentService response）
function getStatsForUser(email) { return jsonResponse(getStatsForUserObj(email)); }
function getFailedForUser(email, pct) { return jsonResponse(getFailedForUserObj(email, pct)); }

// ═══════════════════════════════════════════
//  工具函式
// ═══════════════════════════════════════════

function getOrCreateStatsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Stats");
  if (!sheet) {
    sheet = ss.insertSheet("Stats");
    sheet.appendRow([
      "user_email", "user_name", "combo_key", "display",
      "appear", "cleared", "fail_rate", "last_seen", "last_synced", "orig_row",
    ]);
    var headerRange = sheet.getRange(1, 1, 1, 10);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("white");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 120);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 300);
    sheet.setColumnWidth(5, 80);
    sheet.setColumnWidth(6, 80);
    sheet.setColumnWidth(7, 100);
    sheet.setColumnWidth(8, 120);
    sheet.setColumnWidth(9, 160);
    sheet.setColumnWidth(10, 200);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════
//  測試用
// ═══════════════════════════════════════════

function testSync() {
  var testStats = {
    "wie,geht,es,dir?": {
      appear: 10, cleared: 3,
      display: "你好嗎？,Wie,geht,es,dir?",
      lastSeen: "2026-02-22",
    },
    "ich,vermisse,dich": {
      appear: 5, cleared: 5,
      display: "我好想你,Ich,vermisse,dich",
      lastSeen: "2026-02-22",
    },
    "ich,mag,das,nicht": {
      appear: 8, cleared: 2,
      display: "我不喜歡這個,Ich,mag,das,nicht",
      lastSeen: "2026-02-22",
    },
  };
  syncStats(testStats, "test@gmail.com", "Test User");
  Logger.log("測試完成，請查看 Stats 工作表");
}

function testGetStats() {
  var result = getStatsForUser("test@gmail.com");
  Logger.log(result.getContent());
}

function testGetFailed() {
  var result = getFailedForUser("test@gmail.com", 50);
  Logger.log(result.getContent());
}
