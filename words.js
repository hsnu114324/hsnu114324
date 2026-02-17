// ========================================
// 單字表 - 可自由編輯！
// 格式: { word: "中文", translation: "English" }
// 你可以加入自己的單字，或建立不同的分類
// ========================================

const WORD_SETS = {
  "基礎日常": [
    { word: "蘋果", translation: "Apple" },
    { word: "書本", translation: "Book" },
    { word: "貓咪", translation: "Cat" },
    { word: "狗狗", translation: "Dog" },
    { word: "魚", translation: "Fish" },
    { word: "水", translation: "Water" },
    { word: "火", translation: "Fire" },
    { word: "學校", translation: "School" },
    { word: "家", translation: "Home" },
    { word: "朋友", translation: "Friend" },
    { word: "太陽", translation: "Sun" },
    { word: "月亮", translation: "Moon" },
    { word: "星星", translation: "Star" },
    { word: "山", translation: "Mountain" },
    { word: "海", translation: "Sea" },
    { word: "花", translation: "Flower" },
    { word: "樹", translation: "Tree" },
    { word: "鳥", translation: "Bird" },
    { word: "車", translation: "Car" },
    { word: "門", translation: "Door" }
  ],
  "數字與時間": [
    { word: "一", translation: "One" },
    { word: "二", translation: "Two" },
    { word: "三", translation: "Three" },
    { word: "四", translation: "Four" },
    { word: "五", translation: "Five" },
    { word: "六", translation: "Six" },
    { word: "七", translation: "Seven" },
    { word: "八", translation: "Eight" },
    { word: "九", translation: "Nine" },
    { word: "十", translation: "Ten" },
    { word: "今天", translation: "Today" },
    { word: "明天", translation: "Tomorrow" },
    { word: "昨天", translation: "Yesterday" },
    { word: "早上", translation: "Morning" },
    { word: "下午", translation: "Afternoon" },
    { word: "晚上", translation: "Evening" }
  ],
  "食物飲料": [
    { word: "飯", translation: "Rice" },
    { word: "麵", translation: "Noodles" },
    { word: "湯", translation: "Soup" },
    { word: "茶", translation: "Tea" },
    { word: "咖啡", translation: "Coffee" },
    { word: "牛奶", translation: "Milk" },
    { word: "果汁", translation: "Juice" },
    { word: "肉", translation: "Meat" },
    { word: "蔬菜", translation: "Vegetable" },
    { word: "水果", translation: "Fruit" },
    { word: "麵包", translation: "Bread" },
    { word: "蛋", translation: "Egg" },
    { word: "糖", translation: "Sugar" },
    { word: "鹽", translation: "Salt" },
    { word: "餅乾", translation: "Cookie" }
  ],
  "顏色形容詞": [
    { word: "紅色", translation: "Red" },
    { word: "藍色", translation: "Blue" },
    { word: "綠色", translation: "Green" },
    { word: "黃色", translation: "Yellow" },
    { word: "白色", translation: "White" },
    { word: "黑色", translation: "Black" },
    { word: "大", translation: "Big" },
    { word: "小", translation: "Small" },
    { word: "快", translation: "Fast" },
    { word: "慢", translation: "Slow" },
    { word: "熱", translation: "Hot" },
    { word: "冷", translation: "Cold" },
    { word: "新", translation: "New" },
    { word: "舊", translation: "Old" },
    { word: "好", translation: "Good" },
    { word: "壞", translation: "Bad" }
  ]
};

// 預設使用的單字集
const DEFAULT_SET = "基礎日常";
