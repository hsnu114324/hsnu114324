// ═══════════════════════════════════════════════════════════════
//  WORDTRIS — 單字資料設定檔
//  部署到 GitHub Pages 時只需編輯此檔案即可自訂所有內容
// ═══════════════════════════════════════════════════════════════

const WORD_CONFIG = {

  // ─────────────────────────────────────────────────────────────
  //  欄位定義 (fields)
  //  每個欄位 = 一種方塊的「面」
  //  消除規則：同一個單字的所有欄位方塊必須依序排成一行才能消除
  //
  //  欄位屬性:
  //    key   : 對應 words 陣列中的屬性名稱
  //    label : 顯示名稱（UI 標籤用）
  //    color : 霓虹主色 (hex)
  //    abbr  : 縮寫（方塊右上角標記）
  // ─────────────────────────────────────────────────────────────
  fields: [
    { key: "word",   label: "德文",   color: "#00f5ff", abbr: "DE" },
    { key: "zh",     label: "中文",   color: "#ff2d78", abbr: "中" },
    { key: "gender", label: "陰陽性", color: "#ffe600", abbr: "性" },
  ],

  // ─────────────────────────────────────────────────────────────
  //  單字集 (word_sets)
  //  每筆資料的 key 對應上方 fields 中的 key
  // ─────────────────────────────────────────────────────────────
  word_sets: {

    "德文名詞 — 基礎": [
      { word: "der Hund",   zh: "狗",   gender: "陽性 m" },
      { word: "die Katze",  zh: "貓",   gender: "陰性 f" },
      { word: "das Haus",   zh: "房子", gender: "中性 n" },
      { word: "der Mann",   zh: "男人", gender: "陽性 m" },
      { word: "die Frau",   zh: "女人", gender: "陰性 f" },
      { word: "das Kind",   zh: "孩子", gender: "中性 n" },
      { word: "der Tisch",  zh: "桌子", gender: "陽性 m" },
      { word: "die Tür",    zh: "門",   gender: "陰性 f" },
      { word: "das Buch",   zh: "書",   gender: "中性 n" },
      { word: "der Apfel",  zh: "蘋果", gender: "陽性 m" },
      { word: "die Schule", zh: "學校", gender: "陰性 f" },
      { word: "das Wasser", zh: "水",   gender: "中性 n" },
    ],

    "德文名詞 — 進階": [
      { word: "der Bahnhof",     zh: "火車站", gender: "陽性 m" },
      { word: "die Universität", zh: "大學",   gender: "陰性 f" },
      { word: "das Krankenhaus", zh: "醫院",   gender: "中性 n" },
      { word: "der Supermarkt",  zh: "超市",   gender: "陽性 m" },
      { word: "die Bibliothek",  zh: "圖書館", gender: "陰性 f" },
      { word: "das Restaurant",  zh: "餐廳",   gender: "中性 n" },
      { word: "der Flughafen",   zh: "機場",   gender: "陽性 m" },
      { word: "die Apotheke",    zh: "藥局",   gender: "陰性 f" },
      { word: "das Museum",      zh: "博物館", gender: "中性 n" },
    ],

    "德文動詞 — 常用": [
      { word: "gehen",    zh: "去、走", gender: "不規則" },
      { word: "kommen",   zh: "來",     gender: "不規則" },
      { word: "sehen",    zh: "看",     gender: "不規則" },
      { word: "essen",    zh: "吃",     gender: "不規則" },
      { word: "trinken",  zh: "喝",     gender: "規則" },
      { word: "schlafen", zh: "睡覺",   gender: "不規則" },
      { word: "lernen",   zh: "學習",   gender: "規則" },
      { word: "arbeiten", zh: "工作",   gender: "規則" },
    ],
  },

  default_set: "德文名詞 — 基礎",
};
