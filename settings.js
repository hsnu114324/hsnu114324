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
const SPLIT_MODE_KEY = "word_tetris_split_mode_v1"; // "syllable" | "random" | "mixed"

// 預設群組
const GROUP_WORDS1 = [

//  "我喜歡你,Ich,mag,dich",
//  "我愛你,Ich,liebe,dich",
  "我好想你,Ich,vermisse,dich",
  "我不喜歡這個,Ich,mag,das,nicht",
//  "我有一隻狗,Ich,habe,einen,Hund",
//  "我知道,Ich,weiß",
//  "我不知道,Ich,weiß,nicht",
//  "什麼時候,wann",
  "幾個,wie,viele?",
  "多少,wie,viel?",
  "這個多少錢？,Wie,viel,kostet,das?",
  "你有電話嗎？,Hast,du,ein,Telefon?",
  "洗手間在哪裡？,Wo,ist,das,WC?",
//  "你叫什麼名字？,Wie,heißt,du?",
  "你愛我嗎？,Liebst,du,mich?",
  "你好嗎？,Wie,geht,es,dir?",
  "你還好嗎？,Geht,es,dir,gut?",
  "你能幫我嗎？,Können,Sie,mir,helfen?",
//  "白銀比黃金便宜Silber,ist,billiger,als,Gold",
//  "黃金比白銀貴Gold,ist,teurer,als,Silber",
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
//  "我叫大衛,Ich,heiße,David",
  "很高興認識你,freut,mich,dich,kennenzulernen",
//  "我今年二十二歲_Ich,bin,22,Jahre,alt",
//  "這是我的女朋友安娜Das_ist,meine,Freundin,Anna",
  "我們看電影吧Schauen_wir,uns,einen,Film,an",
  "我們回家吧,Gehen,wir,nach,Hause",

  "干杯,Prost",
  "歡迎,Willkommen",
//  "不好意思,Entschuldigen,Sie",
//  "當然,natürlich",
  "我同意,Ich,stimme,zu",
  "放鬆,Entspann,dich",
  "沒關系,Macht,nichts",
  "我要這個,Ich,möchte,das",
  "跟我來,Komm,mit",
  "直走,Geh,geradeaus",
  "向左轉,Biege,links,ab",
  "向右轉,Biege,rechts,ab",
  "其實,eigentlich",
  "立即,sofort",
//  "經常,oft",
//  "總是,immer",
  "每個,jeder",
//  "嗨,Hallo",
//  "你好,Hallo",
//  "您好,Guten,Tag",
//  "拜拜,Tschüss",
//  "再見,Auf,Wiedersehen",
//  "待會兒見,Bis,später",
//  "請,bitte",
//  "謝謝,danke",
//  "對不起,Entschuldigung",
//  "不用謝,Kein,Problem",
  "不用擔心,Mach,dir,keine,Sorgen",
  "保重,Pass,auf",
//  "好的,ok",
//  "和,und",
//  "或者,oder",
//  "非常,sehr",
//  "全部,alle",
//  "沒有一個,keine",
//  "那個,das",
//  "這個,dieses",
//  "不,nicht",
//  "更,mehr",
  "最,höchst",
  "更少,weniger",
  "因為,weil",
//  "但是,aber",
//  "已經,schon",
//  "再次,wieder",
//  "真的,wirklich",
  "如果,wenn",
  "雖然,obwohl",
  "突然,plötzlich",
  "然后,dann",
//  "我,ich",
//  "你,du",
//  "他,er",
//  "她,sie",
//  "我們,wir",
  "你們,ihr",
//  "他們,sie",
//  "我的狗,mein,Hund",
//  "你的貓,deine,Katze",
//  "她的裙子,ihr,Kleid",
  "他的車,sein,Auto",
//  "我們的家,unser,Haus",
  "你們的隊,euer,Team",
  "他們的公司,ihr,Unternehmen",
  "每個人,jeder",
//  "一起,zusammen",
  "其他,sonstiges",


];

const GROUP_WORDS2 = [

  "離開,abfahren,fährt ab,fuhr ab,ist abgefahren",
  "飛離,abfliegen,fliegt ab,flog ab,ist abgeflogen",
  "交出,abgeben,gibt ab,gab ab,hat abgegeben",
  "鎖上/結束,abschließen,schließt ab,schloss ab,hat abgeschlossen",
  "提供,anbieten,bietet an,bot an,hat angeboten",
  "開始,anfangen,fängt an,fing an,hat angefangen",
  "到達,ankommen,kommt an,kam an,ist angekommen",
  "打電話,anrufen,ruft an,rief an,hat angerufen",
  "觀看,ansehen,sieht an,sah an,hat angesehen",
  "穿上,anziehen,zieht an,zog an,hat angezogen",
  "起床/起立,aufstehen,steht auf,stand auf,ist aufgestanden",
  "花費/發放,ausgeben,gibt aus,gab aus,hat ausgegeben",
  "外出,ausgehen,geht aus,ging aus,ist ausgegangen",
  "看起來,aussehen,sieht aus,sah aus,hat ausgesehen",
  "下車,aussteigen,steigt aus,stieg aus,ist ausgestiegen",
  "脫下,ausziehen,zieht aus,zog aus,ist/hat ausgezogen",
  "烤,backen,bäckt/backt,buk/backte,hat gebacken",
  "開始,beginnen,beginnt,begann,hat begonnen",
  "保留,behalten,behält,behielt,hat behalten",
  "得到,bekommen,bekommt,bekam,hat bekommen",
  "申請/應徵,bewerben,bewirbt,bewarb,hat beworben",
  "彎曲,biegen,biegt,bog,hat gebogen",
  "提供,bieten,bietet,bot,hat geboten",
  "請求,bitten,bittet,bat,hat gebeten",
  "停留,bleiben,bleibt,blieb,ist geblieben",
  "煎/烤,braten,brät,briet,hat gebraten",
  "打破,brechen,bricht,brach,ist gebrochen",
  "燃燒,brennen,brennt,brannte,hat gebrannt",
  "帶來,bringen,bringt,brachte,hat gebracht",
  "思考,denken,denkt,dachte,hat gedacht",
  "想到/落入,einfallen,fällt ein,fiel ein,ist eingefallen",
  "邀請,einladen,lädt ein,lud ein,hat eingeladen",
  "入睡,einschlafen,schläft ein,schlief ein,ist eingeschlafen",
  "上車,einsteigen,steigt ein,stieg ein,ist eingestiegen",
  "搬入,einziehen,zieht ein,zog ein,ist eingezogen",
  "推薦,empfehlen,empfiehlt,empfahl,hat empfohlen",
  "決定,entscheiden,entscheidet,entschied,hat entschieden",
  "吃,essen,isst,aß,hat gegessen",
  "開車/行駛,fahren,fährt,fuhr,ist gefahren",
  "落下,fallen,fällt,fiel,ist gefallen",
  "抓住,fangen,fängt,fing,hat gefangen",
  "看電視,fernsehen,sieht fern,sah fern,hat ferngesehen",
  "找到,finden,findet,fand,hat gefunden",
  "飛,fliegen,fliegt,flog,ist geflogen",
  "給,geben,gibt,gab,hat gegeben",
  "喜歡/合意,gefallen,gefällt,gefiel,hat gefallen",
  "走/去,gehen,geht,ging,ist gegangen",
  "發生,geschehen,geschieht,geschah,ist geschehen",
  "贏得,gewinnen,gewinnt,gewann,hat gewonnen",
  "擁有,haben,hat,hatte,hat gehabt",
  "握住/停,halten,hält,hielt,hat gehalten",
  "掛,hängen,hängt,hing,hat gehängt/gehangen",
  "叫做,heißen,heißt,hieß,hat geheißen",
  "幫助,helfen,hilft,half,hat geholfen",
  "認識,kennen,kennt,kannte,hat gekannt",
  "響/聽起來,klingen,klingt,klang,hat geklungen",
  "來,kommen,kommt,kam,ist gekommen",
  "裝載,laden,lädt,lud,hat geladen",
  "讓/允許,lassen,lässt,ließ,hat gelassen",
  "跑/走,laufen,läuft,lief,ist gelaufen",
  "感到抱歉,leidtun,tut leid,tat leid,hat leidgetan",
  "借出,leihen,leiht,lieh,hat geliehen",
  "讀,lesen,liest,las,hat gelesen",
  "躺,liegen,liegt,lag,hat gelegen",
  "出發,losfahren,fährt los,fuhr los,ist losgefahren",
  "帶來,mitbringen,bringt mit,brachte mit,hat mitgebracht",
  "一起來,mitkommen,kommt mit,kam mit,ist mitgekommen",
  "帶走,mitnehmen,nimmt mit,nahm mit,hat mitgenommen",
  "喜歡,mögen,mag,mochte,hat gemocht",
  "拿/取,nehmen,nimmt,nahm,hat genommen",
  "稱呼,nennen,nennt,nannte,hat genannt",
  "建議/猜,raten,rät,riet,hat geraten",
  "聞,riechen,riecht,roch,hat gerochen",
  "呼叫,rufen,ruft,rief,hat gerufen",
  "似乎/發光,scheinen,scheint,schien,hat geschienen",
  "睡覺,schlafen,schläft,schlief,hat geschlafen",
  "打/擊,schlagen,schlägt,schlug,hat geschlagen",
  "關閉,schließen,schließt,schloss,hat geschlossen",
  "切,schneiden,schneidet,schnitt,hat geschnitten",
  "寫,schreiben,schreibt,schrieb,hat geschrieben",
  "游泳,schwimmen,schwimmt,schwamm,ist geschwommen",
  "看,sehen,sieht,sah,hat gesehen",
  "是,sein,ist,war,ist gewesen",
  "唱,singen,singt,sang,hat gesungen",
  "下沉,sinken,sinkt,sank,ist gesunken",
  "坐,sitzen,sitzt,saß,hat/ist gesessen",
  "散步,spazieren gehen,geht spazieren,ging spazieren,ist spazieren gegangen",
  "說/講,sprechen,spricht,sprach,hat gesprochen",
  "跳,springen,springt,sprang,ist gesprungen",
  "舉行/發生,stattfinden,findet statt,fand statt,hat stattgefunden",
  "站,stehen,steht,stand,hat/ist gestanden",
  "偷,stehlen,stiehlt,stahl,hat gestohlen",
  "上升/攀登,steigen,steigt,stieg,ist gestiegen",
  "死亡,sterben,stirbt,starb,ist gestorben",
  "爭吵,streiten,streitet,stritt,hat gestritten",
  "參加,teilnehmen,nimmt teil,nahm teil,hat teilgenommen",
  "攜帶/穿戴,tragen,trägt,trug,hat getragen",
  "驅動,treiben,treibt,trieb,hat getrieben",
  "遇見,treffen,trifft,traf,hat getroffen",
  "踩/踏,treten,tritt,trat,hat getreten",
  "喝,trinken,trinkt,trank,hat getrunken",
  "做,tun,tut,tat,hat getan",
  "傳輸/轉播,übertragen,überträgt,übertrug,hat übertragen",
  "轉帳/匯款,überweisen,überweist,überwies,hat überwiesen",
  "轉車,umsteigen,steigt um,stieg um,ist umgestiegen",
  "搬家,umziehen,zieht um,zog um,hat/ist umgezogen",
  "聊天/娛樂,unterhalten,unterhält,unterhielt,hat unterhalten",
  "從事/進行,unternehmen,unternimmt,unternahm,hat unternommen",
  "簽署,unterschreiben,unterschreibt,unterschrieb,hat unterschrieben",
  "度過(時間),verbringen,verbringt,verbrachte,hat verbracht",
  "忘記,vergessen,vergisst,vergaß,hat vergessen",
  "比較,vergleichen,vergleicht,verglich,hat verglichen",
  "失去,verlieren,verliert,verlor,hat verloren",
  "推遲,verschieben,verschiebt,verschob,hat verschoben",
  "消失,verschwinden,verschwindet,verschwand,ist verschwunden",
  "承諾,versprechen,verspricht,versprach,hat versprochen",
  "理解,verstehen,versteht,verstand,hat verstanden",
  "建議/提議,vorschlagen,schlägt vor,schlug vor,hat vorgeschlagen",
  "介紹/想像,vorstellen,stellt vor,stellte vor,hat vorgestellt",
  "成長,wachsen,wächst,wuchs,ist gewachsen",
  "洗,waschen,wäscht,wusch,hat gewaschen",
  "走開,weggehen,geht weg,ging weg,ist weggegangen",
  "丟掉,wegwerfen,wirft weg,warf weg,hat weggeworfen",
  "疼痛,wehtun,tut weh,tat weh,hat wehgetan",
  "成為,werden,wird,wurde,ist geworden",
  "投擲,werfen,wirft,warf,hat geworfen",
  "知道,wissen,weiß,wusste,hat gewusst",
  "拉/搬,ziehen,zieht,zog,hat gezogen",
  "應付,zurechtkommen,kommt zurecht,kam zurecht,ist zurechtgekommen",
  "回來,zurückkommen,kommt zurück,kam zurück,ist zurückgekommen",


];

const GROUP_WORDS3 = [

//  "1-,所有格 第一格(Nominativ),所有格 第二格(Genitiv),所有格 第三格(Dativ),所有格 第四格(Akkusativ)",
  "der ich,mein ,meines,meinem,meinen",
  "der du,dein ,deines,deinem,deinen",
  "der er,sein ,seines,seinem,seinen",
  "der sie,ihr ,ihres,ihrem,ihren",
  "der es,sein ,seines,seinem,seinen",
  "der wir,unser ,unseres,unserem,unseren",
  "der ihr,euer ,eures,eurem,euren",
  "der sie,ihr ,ihres,ihrem,ihren",
  "der Sie,ihr ,ihres,ihrem,ihren",
  "das ich,mein ,meines,meinem,mein",
  "das du,dein ,deines,deinem,dein",
  "das er,sein ,seines,seinem,sein",
  "das sie,ihr ,ihres,ihrem,ihr",
  "das es,sein ,seines,seinem,sein",
  "das wir,unser ,unseres,unserem,unser",
  "das ihr,euer ,eures,eurem,euer",
  "das sie,ihr ,ihres,ihrem,ihr",
  "das Sie,ihr ,ihres,ihrem,ihr",
  "die ich,meine,meiner,meiner,meine",
  "die du,deine ,deiner,deiner,deine",
  "die er,seine ,seiner,seiner,seine",
  "die sie,ihre ,ihrer,ihrer,ihre",
  "die es,seine ,seiner,seiner,seine",
  "die wir,unsere ,unserer,unserer,unsere",
  "die ihr,eure ,eurer,eurer,eure",
  "die sie,ihre ,ihrer,ihrer,ihre",
  "die Sie,ihre ,ihrer,ihrer,ihre",
  "pl. ich,meine ,meiner,meinen,meine",
  "pl. du,deine ,deiner,deinen,deine",
  "pl. er,seine ,seiner,seinen,seine",
  "pl. sie,ihre ,ihrer,ihren,ihre",
  "pl. es,seine ,seiner,seinen,seine",
  "pl. wir,unsere ,unserer,unseren,unsere",
  "pl. ihr,eure ,eurer,euren,eure",
  "pl. sie,ihre ,ihrer,ihren,ihre",
  "pl. Sie,ihre ,ihrer,ihren,ihre",

];

const GROUP_WORDS4 = [

//  "2-,第一格(Nominativ),第二格(Genitiv),第三格(Dativ),第四格(Akkusativ)",
  "陽性 der,der Mann,des,dem Mann,den Mann",
  "陽性 ein,ein Mann,eines ,einem Mann,einen Mann",
  "陽性 kein,kein Mann,keines,keinem Mann,keinen Mann",
  "陽性 welcher,welcher,-,welchem,welchen",
  "陽性 dieser,dieser,dieses,diesem,diesen",
  "中性 das,das Kind,des,dem Kind,das Kind",
  "中性 ein,ein Kind,eines,einem Kind,ein Kind",
  "中性 kein,kein Kind,keines,keinem Kind,kein Kind",
  "中性 welches,welches,-,welchem,welches",
  "中性 dieses,dieses,dieses,diesem,dieses",
  "陰性 die,die Frau,der,der Frau,die Frau",
  "陰性 eine ,eine Frau,einer,einer Frau,eine Frau",
  "陰性 keine,keine Frau,keiner,keiner Frau,keine Frau",
  "陰性 welche,welche,-,welcher,welche",
  "陰性 diese,diese,dieser,dieser,diese",
  "複數 die,die Leute,der,den Leuten,die Leute",
  "複數 -, - Leute,-, - Leuten, - Leute",
  "複數 keine,keine Leute,keiner,keinen Leuten,keine Leute",
  "複數 welche,welche,-,welchen,welche",
  "複數 diese,diese,dieser,diesen,diese",

];

const GROUP_WORDS5 = [

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

const GROUP_ALL = [GROUP_WORDS1, GROUP_WORDS2, GROUP_WORDS3, GROUP_WORDS4, GROUP_WORDS5];
//const DEFAULT_WORD_ROWS = ["ice,cream", "1,2,3,4,5"];

const DEFAULT_WORD_ROWS = [
//  "1,2,3,4,5",
//  "6,7,8,9,10",
//  "11,12,13,14,15",
//  "16,17,18,19,20",
//  "21,22,23,24,25",

  "轉彎,   abbiegen",
  "垃圾,   abfall",
  "磨損,   abnutzen",
  "取消,   absagen",
  "拒絕,    abweisen",
  "那麼,   also",
  "提供,   anbieten",
  "開始,   anfangen",
  "碰：摸,   anfassen",
  "害怕 恐懼,   angst",
  "抵達,   ankommen",
  "登記註冊,   anmelden",
  "接受,   annehmen",
  "打開電器,   anschalten",
  "觀看觀賞,   ansehen",
  "答案 (n),   antwort",
  "回答 回信 (v),   antworten",
  "穿上,   anziehen",
  "藥局,   apotheke",
  "生氣,   ärgern",
  "種類,   art",
  "公演,    Aufführung",
  "停止,   aufhören",
  "周到的 認真的,   aufmerksam",
  "真心的,   aufrichtig",
  "文章,   aufsatz",
  "清醒 醒來,   aufwachen",
  "出口,   Ausgang",
  "出去玩,   ausgehen",
  "借,   ausleihen",
  "介意,   ausmachen",
  "藉口,   Ausrede",
  "休息,   ausruhen",
  "外表外貌,   Aussehen",
  "風景景色,   Aussicht",
  "發音,   aussprache",
  "挑選,   aussuchen",
  "交換替換,   austauschen",
  "背誦,   auswendig",
  "脫,   ausziehen",

  "浴室,   Badezimmer",
  "很快地,    bald",
  "肚子,   Bauch",
  "建造,   bauen",
  "樹,   Baum",
  "大杯,   Becher",
  "意味著,   bedeuten",
  "著急,   beeilen",
  "完成 結束,   beenden",
  "命令,   befehlen",
  "開始,   beginnen",
  "教,   beibringen",
  "兩者,   beide",  
  "例子,   Beispiel",
  "叮咬,   beißen",
  "受歡迎的,   beliebt",
  "通知單,   Benachrichtigung",
  "使用,   benutzen",
  "山坡,   Berghang",
  "登山,   bergsteigen",
  "職業,   Beruf",
  "有名的,   berühmt",
  "忙碌的,   beschäftigt",
  "特別的,   besondere",
  "最好的,   beste",
  "餐具,   Besteck",
  "點餐,   bestellen",
  "一定,   bestimmt",
  "拜訪(n),   besuch",
  "拜訪(v),   besuchen",
  "拜託,   bitten",
  "苦的,   bitter",
  "吹,   blasen",
  "葉子,   Blatt",
  "停留,   bleiben",
  "需要 花費,    brauchen",
  "寬的,   breit",
  "燃燒,   brennen",
  "橋,   Brücke",
  "字母,   Buchstabe",
  "拼字,    buchstabieren",
  "三明治,   Butterbrot",




  "錄音帶,   Cassette",   
  "個性,   Charakter",   
  "在,   da sein",   
  "那裡,   da",   
  "反對,   dagegen",   
  "從前,   damals",   
  "然後,   dann",   
  "所以 因此,   darum",   
  "日期,   Datum",   
  "對此,   dazu",   
  "故障的,   defekt",   
  "你的,   dein",   
  "明顯 清楚的,   deutlich",   
  "東西,   Ding",   
  "直接,   Direkt",   
  "討論,   Diskutieren",   
  "反正,   Doch",   
  "博士,    Doktor",   
  "大教堂,   Dom",   
  "鄉村,   Dorf",   
  "那裡,   Dort",   
  "風箏,   Drachen",   
  "外面,   draußen",   
  "三角形,   Dreieck",   
  "室內,   drinnen",   
  "愚蠢,   dumm",   
  "暗的,   dunkel",   
  "薄的,   dünn",   
  "通過,   durch",   
  "不及格,   durchfallen",   
  "可以 准許,   dürfen",   
  "口渴,   Durst",   
  "渴的,   durstig",   
  "淋浴,   duschen",

  "剛才,   eben",   
  "正直的,   ehrlich",   
  "用功的,   eifrig",   
  "稍微,   ein wenig",   
  "簡單的,   einfach",   
  "入口,   Eingang",   
  "一些,   einige",   
  "購物.,   einkaufen",   
  "邀請 招待,   Einladung",   
  "裝進 包,   einpacken",   
  "寂寞的,   einsam",   
  "洞察力,   Einsicht",   
  "到達,   eintreffen",   
  "門票,   eintrittskarte",   
  "意見 異議,   Einwand",   
  "唯一的,   einzig",   
  "鐵路,    Eisenbahn",   
  "精神,   Energie",   
  "沿著,   entlang",   
  "經驗,   Erfahrung",   
  "成功,   Erfolg",   
  "成功的,   erfolgreich",   
  "令人興奮的,   erfreulich",   
  "記得 提醒,   erinnern",   
  "感冒,   Erkältung",   
  "瞭解 認出,   erkennen",   
  "說明,   erklären",   
  "嚴肅的,    ernsthaft",   
  "出現,   erscheinen",   
  "疲倦的,   erschöpft",   
  "使驚訝,   erstaunen",   
  "忍受,   ertragen",   
  "大人,   Erwachsener",   
  "告訴,   erzählen",   

  "工廠,   Fabrik",   
  "學問,   Fachwissen",   
  "淡的,   fade",   
  "有能力的,    fähig",   
  "搭乘 騎 開車,   fahren",   
  "司機,   Fahrer",   
  "電梯,   Fahrstuhl",   
  "車費,   Fahrtkosten",   
  "車,   Fahrzeug",   
  "案件,   Fall",   
  "幾乎,   fast",   
  "懶惰的,   faul",   
  "二月,   Februar",   
  "不夠 乏,   fehlen",   
  "錯誤,   Fehler",   
  "宴會,   Feier",   
  "慶祝,   feiern",   
  "節日,    Feiertag",   
  "窗戶,   Fenster",   
  "假期,   Ferien",   
  "電視機,   Fernseher",   
  "準備好的,   fertig",   
  "節日,   Fest",   
  "抓住,   festhalten",   
  "確定,   festlegen",   
  "潮濕的,   feucht",   
  "火花 煙火,   Feuerwerk",   
  "魚,   Fisch",   
  "國旗,   Flagge",   
  "瓶子,   Flasche",   
  "努力的,   fleißig",   
  "蒼蠅,   Fliege",   
  "飛,   Fliegen",   
  "航空公司,   Fluggesellschaft",   
  "飛機場,   Flughafen",   
  "飛機,   Flugzeug",   
  "形狀,   Form",   
  "照相機,   Fotoapparat",   
  "法語,   französisch",   
  "陌生人,   Fremder",   
  "外國語,   Fremdsprache",   
  "高興,   Freuen",   
  "新鮮的,   frisch",   
  "愉快的,   froh",   
  "高興的,   fröhlich",   
  "春天,   Frühling",   
  "早餐,   Frühstück",   
  "狐狸,   Fuchs",   
  "感覺,   fühlen",   
  "恐怖,   fürchten",   
  "人行道,    Fußweg",   
  "飼料,   Futter",   
  "餵,   füttern",
  "叉子,   Gabel",   
  "窗簾,   Gardine",   
  "花園,   Garten",   
  "巷子,   Gasse",   
  "客人,   Gast",   
  "建築物,   Gebäude",   
  "出生,   geboren",   
  "說明書,   Gebrauchsanleitung",   
  "薪水,   Gehalt",   
  "秘密,   Geheimnis",   
  "屬於,   gehören",   
  "小氣的 吝嗇的,   geizig",   
  "機會,   gelegenheit",   
  "一起,   gemeinsam",   
  "蔬菜 野菜,   gemüse",   
  "舒服的,   gemütlich",   
  "仔細的,   genau",   
  "享受 喜歡,   genießen",   
  "正好,   gerade",   
  "聲音,   Geräusch",   
  "菜;食物,   Gericht",   
  "生意,   Geschäft",   
  "禮物,   Geschenk",   
  "故事,   Geschichte",   
  "味道,   Geschmack",   
  "臉,   Gesicht",   
  "昨天,   gestern",   
  "健康的,   gesund",   
  "飲料,   Getränk",   
  "贏 勝利,   gewinnen",   
  "杯,   Glas",   
  "相信 信仰,   glauben",   
  "相信,   gleich",   
  "快樂的,   glücklich",   
  "上帝,   Gott",   
  "烤肉,   grillen",   
  "尺寸,   Größe",   
  "綠色的,   grün",   
  "群,   Gruppe",   
  "方便的 便利的,   günstig",   
  "皮帶,   Gürtel",   
  "帥的 好看的,   gutaussehend",   
  "善良的,   gutmütig",   
  "高級中學,   Gymnasium",
  "頭髮,    Haare",   
  "一半,   Hälfte",   
  "你好,   hallo",   
  "項鍊,   Halskette",   
  "討厭,   hassen",   
  "醜的,    hässlich",   
  "首都,   Hauptstadt",   
  "傭人 下人,   Hausangestellter",   
  "家事,   Hausarbeit",   
  "家庭作業,   Hausaufgaben",   
  "管理員,   Hausmeister",   
  "拖鞋,   Hausschuh",   
  "皮膚,   Haut",   
  "故鄉,   Heimat",   
  "結婚,   heiraten",   
  "熱的,   heiß",   
  "晴朗的 開朗的,    heiter",   
  "明亮的,   hell",   

  "襯衫,   Hemd",   
  "發表 出版,   herausgeben",   

  "走出去,   herausgehen",   

  "秋天,   Herbst",   
  "下去,   heruntergehen",   
  "心,   Herz",   
  "親切的,   herzlich",   
  "有幫助的,   hilfreich",   
  "天空,   Himmel",   
  "向下看,   hinabsehen",   
  "進入,   hineingehen",   
  "在～後面,   hinter",   
  "高的,   hoch",   
  "大樓大廈,   Hochhaus",   
  "希望,   hoffen",   
  "褲子,   Hose",   
  "漂亮,   hübsch",   
  "阿,   huch",   
  "臀,   hüfte",   
  "狗,   Hund",   
  "百,    hundert",   
  "餓,   Hunger",

  "你們,   ihr",   
  "她的,    ihr",   
  "蟲,    Insekt",   
  "有趣的,    interessant",   
  "任何,    irgendein",   
  "某地,    irgendwo",   
  "季節,   Jahreszeit",   
  "每一個,    jede",   
  "但是,    jedoch",   
  "曾經,    jemals",   
  "某人,    jemand",   
  "那些,    jene",   
  "現在,    jetzt",   
  "打工,    jobben",   
  "年輕的,   jung",   
  "冷的,   Kalt",   
  "梳子,   Kamm",   
  "梳,   Kämmen",   
  "加拿大,   Kanada",   
  "馬鈴薯,   Kartoffel",   
  "乳酪 起司,   Käse",   
  "嚼,   Kauen",   
  "百貨公司,   Kaufhaus",   
  "口香糖,   Kaugummi",   
  "餅乾,   Keks",   
  "幼稚園,   Kindergarten",   
  "教會,   Kirche",   
  "班級,   Klasse",   
  "鼓掌 拍手,   Klatschen",   
  "鋼琴,   Klavier",   
  "貼 年,   Kleben",   
  "衣服 洋裝,   Kleider",   
  "衣著,   Kleidung",   
  "零錢,   Kleingeld",   
  "空調 冷氣機,   Klimaanlage",   
  "鈴,   Klingel",   
  "聽起來,   Klingen",   
  "聰明的,   Klug",   
  "膝蓋,   Knie",   
  "煮,   Kochen",   
  "複雜的,   Kompliziert",   
  "聯絡,    Kontakt",   
  "頭,   Kopf",   
  "枕頭,   Kopfkissen",   
  "頭痛,   Kopfschmerzen",   
  "影印,   Kopieren",   
  "籃子,   Korb",   
  "身體,   Körper",   
  "體重,   Körpergewicht",   
  "改正 修改,   Korrigieren",   
  "成本,   Kosten",   
  "花費,   Kosten",   
  "強壯的,   Kräftig",   
  "圓形,   Kreis",   
  "十字路口,   Kreuzung",   
  "趕上 得到,   Kriegen",   
  "廚房,   Küche",   
  "蛋糕,   Kuchen",   
  "涼的,   Kühl",   
  "電冰箱,   Kühlschrank",   
  "文化,   Kultur",   
  "關心,   Kümmern",   
  "美術 藝術,   Kunst",   
  "女藝術家,   Künstlerin",   
  "男藝術家,   Künstler",   
  "短的,   Kurz",
  "微笑,   Lächeln",   
  "笑,    lachen",   
  "商店,   Laden",   
  "電燈,   Lampe",   
  "國家,   Land",   
  "地圖,   Landkarte",   
  "長久的,   lang",   
  "長度,    Länge",   
  "慢的,    langsam",   
  "無聊的,   langweilig",   
  "麻煩的,    lästig",   
  "執行,    laufen",   
  "心情 情緒,   Laune",   
  "生活,    Leben",   
  "住 生活,    leben",   
  "好吃的,   lecker",   
  "放,   legen",   
  "老師,   lehrer",   
  "抱歉 遺憾,   leid tun",   
  "感到痛苦,    leiden",   
  "借給,   leihen",   
  "學習,    lernen",   
  "讀,    lesen",   
  "上一個,    letzte",   
  "人們,   Leute",   
  "燈光,    Licht",   
  "愛,   lieben",   
  "歌曲,    Lied",   
  "小卡車,   Lieferwagen",   
  "躺,    liegen",   
  "尺,    lineal",   
  "左邊,    links",   
  "單子 名單,   Liste",   
  "湯匙,   Löffel",   
  "解決,     lösen",   
  "獅子,    Löwe",   
  "空氣,    Luft",   
  "高級的 豪華的,    luxuriös",
  "製造,   machen",   
  "女孩子,   Mädchen",   
  "胃,   Magen",   
  "畫畫,    malen",   
  "畫家,    Maler",   
  "有時,   manchmal",   
  "男子 男人,   Mann",   
  "組；隊,   Mannschaft",   
  "名牌,   Marke",   
  "三月,   März",   
  "按摩,   massieren",   
  "資料,   Material",   
  "數學,   Mathematik",   
  "藥,   Medizin",   
  "看法 意見,    Meinung",   
  "奇怪的,   merkwürdig",   
  "方法,   Methode",   
  "牛奶,   Milch",   
  "百萬,   Million",   
  "分,   Minute",   
  "職員,   Mitarbeiter",   
  "帶來,    mitbringen",   
  "帶走,   mitnehmen",   
  "中午,   mittag",   
  "午睡,   mittagsschlaf",   
  "中間,   Mitte",   
  "中號的,   mittelgroß",   
  "半夜 午夜,   Mitternacht",   
  "星期三,   Mittwoch",   
  "家具,   Möbel",   
  "模特兒,   Model",   
  "樣品,   Modell",   
  "流行的,   modern",   
  "盡快,   möglichst",   
  "月亮,   Mond",   
  "星期一,   Montag",   
  "早晨,   Morgen",   
  "明天,   morgen",   
  "蚊子,   Mücke",   
  "嘴巴,   Mund",   
  "硬幣,   Münze",   
  "母親,   Mutter",
  "到,   nach",   
  "在～之後,    nachdem",   
  "考慮,    nachdenken",   
  "之後 晚一點,    nachher",   
  "下午,    Nachmittag",   
  "留言; 消息,   Nachricht",   
  "新聞,   Nachrichten",   
  "下一個,   nächste",   
  "明年,   nächstes Jahr",   
  "附近,   Nähe",   
  "靠近,   nahe",   
  "鼻子,   Nase",   
  "旁邊,   neben",   
  "拿,   nehmen",   
  "點頭,   nicken",   
  "可愛的,   niedlich",   
  "還,   noch",   
  "北,   Norden",   
  "普通的 一般的,   normal",   
  "通常,   normalerweise",   
  "筆記本,   Notizblock",   
  "十一月,   November",   
  "麵條,   Nudeln",   
  "現在,   Nun",   



  "是否,   ob",   
  "朝上,   oben",   
  "水果,   Obst",   
  "雖然,   obwohl",   
  "公用的,   öffentlich",   
  "正式的,   offiziell",   
  "開,   öffnen",   
  "常常,   oft",   
  "沒有,   ohne",   
  "十月,   Oktober",   
  "油,   Öl",   
  "奶奶,   Oma",   
  "叔叔,   Onkel",   
  "爺爺,   Opa",   
  "橘子,   Orange",   
  "地方,   Ort",   
  "東,   Osten",   
  "奧地利,   Österreich",   
  "爸爸,   Papa",   
  "紙,   Papier",   
  "天堂,   Paradies",   
  "公園,   Park",   
  "停車,   parken",   
  "停車場,   Parkplatz",   
  "合夥,   Partner",   
  "人物,   Person",   
  "胡椒粉,   Pfeffer",   
  "哨子,   Pfeife",   
  "馬,   Pferd",   
  "痘,   Pickel",   
  "計畫,   Plan",   
  "做計劃,   Planen",   
  "座位,   Platz",   
  "警察局,   Polizeirevier",   
  "錢包,   Portemonnaie",   
  "郵局,   Postamt",   
  "明信片,   Postkarte",   
  "價錢,   Preis",   
  "獎金,    Preis",   
  "品嚐,   probieren",   
  "教授,   Professor",   
  "測驗,   prüfen",   
  "布丁,   Pudding",   
  "毛衣,   Pullover",
  "正方形,   Quadrat",   
  "收音機,   Radio",   
  "猜測,   raten",   
  "抽菸,   rauchen",   
  "右邊,   rechts",   
  "談話,   reden",   
  "規則,   Regel",   
  "雨,   Regen",   
  "彩虹,   Regenbogen",   
  "下雨,   regnen",   
  "搓,   reiben",   
  "富有的,   reich",   
  "米飯,   Reis",   
  "旅行社,   Reisebüro",   
  "暈車,   Reisekrankheit",   
  "旅行,   reisen",   
  "護照,   Reisepass",   
  "撕,   reißen",   
  "修理,   reparieren",   
  "預約,   reservieren",   
  "餐廳,   Restaurant",   
  "救,   retten",   
  "對的,   richtig",   
  "方向,   Richtung",   
  "聞,   riechen",   
  "牛肉,    Rindfleisch",   
  "四周,   ringsum",   
  "裙子,   Rock",   
  "小說,   Roman",   
  "玫瑰花,   Rose",   
  "紅色的,   rot",   
  "背部,   Rücken",   
  "喊,   rufen",   
  "空閒的,   ruhig",
  "沙拉,   salat",   
  "鹽,    Salz",   
  "鹹的,   salzig",   
  "收集,   sammeln",   
  "歌手,   Sänger",   
  "句子,   Satz",   
  "乾淨的,   sauber",   
  "清掃,   saubermachen",   
  "綿羊,   Schaf",   
  "圍巾,   Schal",   
  "辣的,   scharf",   
  "演員,   schauspieler",   
  "寄,   schicken",   
  "推,   schieben",   
  "船,   schiff",   
  "責罵,   schimpfen",   
  "火腿,   Schinken",   
  "睡覺,   schlafen",   
  "臥室,   Schlafzimmer",   
  "蛇,   Schlange",   
  "壞的,   schlecht",   
  "關閉,   schließen",   
  "痛,   Schmerz",   
  "髒的,   schmutzig",   
  "剪 切,   schneiden",   
  "下雪,   schneien",   
  "快的 迅速的,   schnell",   
  "已經,   schon",   
  "美麗的,   schön",   
  "寫,   schreiben",   
  "書桌,   Schreibtisch",   
  "作家,   Schriftsteller",   
  "抽屜,   Schublade",   
  "害羞的,   schüchtern",   
  "鞋子,   Schuh",   
  "學校,   Schule",   
  "學生,   Schüler",   
  "肩膀,   Schulter",   
  "碗,   Schüssel",   
  "虛弱的 軟弱的,   schwach",   
  "黑色的,   schwarz",   
  "豬,   Schwein",   
  "豬肉,   Schweinefleisch",   
  "重的,   schwer",   
  "重點,   Schwerpunkt",   
  "姐妹,   schwester",   
  "困難的,   schwierig",   
  "游泳,   schwimmen",   
  "看,   sehen",   
  "很,   sehr",   
  "繩子,   Seil",   
  "電纜車,   Seilbahn",   
  "他的,   sein",   
  "是 存在,   sein",   
  "從 自從,   seit",   
  "自從,   seitdem",   
  "旁邊,   Seite",   
  "頁,   Seite",   
  "秒,   Sekunde",   
  "自己,   selber",   
  "學期,   Semester",   
  "電視節目,   Sendung",   
  "九月,   September",   
  "安全的,   sicher",   
  "他們,   sie",   
  "您,   Sie",   
  "唱歌,   singen",   
  "降低,   sinken",   
  "滑雪,   ski fahren",   
  "點心,   snack",   
  "沙發,   sofa",   
  "馬上,   sofort",   
  "兒子,   sohn",   
  "軍人,   Soldat",   
  "夏天,   Sommer",   
  "星期六,   Samstag",   
  "太陽,   Sonne",   
  "星期日,   sonntag",   
  "否則,   sonst",   
  "擔心,   Sorgen",   
  "以後,   später",   
  "散步,   spazieren",   
  "菜單,   Speisekarte",   
  "特別的,   speziell",   
  "鏡子,   Spiegel",   
  "遊戲,   Spiel",   
  "彈奏  玩,   spielen",   
  "選手,   Spieler",   
  "玩具,   Spielzeug",   
  "蜘蛛,   Spinne",   
  "運動,   Sport",   
  "操場,   Sportplatz",   
  "語言,   Sprache",   
  "說話,   sprechen",   
  "吐,   spucken",   
  "國家,   Staat",   
  "國立的,   staatlich",   
  "都市,   stadt",   
  "代替,   statt",   
  "牛排,   Steak",   
  "站起來,   stehen",   
  "位置,   Stelle",   
  "星星,   Stern",   
  "長筒 靴,   Stiefel",   
  "筆,   Stift",   
  "安靜,   still",   
  "聲音,   Stimme",   
  "額頭,   Stirn",   
  "驕傲的,   stolz",   
  "海灘,   Strand",   
  "街道,   Straße",   
  "鴕鳥,   Strauß",   
  "打架,   streiten",   
  "嚴格的,   streng",   
  "水果餡餅,   strudel",   
  "襪子,   Strumpf",   
  "塊 顆,   Stück",   
  "女大學生,   Studentin",   
  "椅子,   Stuhl",   
  "小時,   Stunde",   
  "尋找,   suchen",   
  "南,   Süden",   
  "南邊,   Süden",   
  "總額,   Summe",   
  "超級市場,   Supermarkt",   
  "湯,   Suppe",   
  "甜的,   süß",

  "黑板,   Tafel",   
  "天,   Tag",   
  "日記,   Tagebuch",   
  "每天的,   täglich",   
  "白天,   tagsüber",   
  "颱風,   Taifun",   
  "阿姨,   Tante",   
  "跳舞,   tanzen",   
  "袋子,   Tasche",   
  "杯子,   Tasse",   
  "計程車,   Taxi",   
  "部分,   Teil",   
  "分享,   teilen",   
  "參加,   teilnehmen",   
  "電話,   Telefon",   
  "打電話,   Telefonieren",   
  "網球,   Tennis",   
  "考試,   test",   
  "昂貴的,   teuer",   
  "動物,   Tier",   
  "老虎,   Tiger",   
  "桌子,   Tisch",   
  "桌球,   Tischtennis",   
  "女兒,   Tochter",   
  "廁所,   Toilette",   
  "番茄,   Tomate",   
  "門口,   Tor",   
  "鍛鍊,   Training",   
  "夢想,   Traum",   
  "作夢,   träumen",   
  "悲傷的,   traurig",   
  "會面,   treffen",   
  "面談,   Treffen",   
  "喝,   trinken",   
  "小費,   Trinkgeld",   
  "吸管,   Trinkhalm",   
  "乾的,   trocken",   
  "做,   tun",   
  "地下道,   Tunnel",   
  "門,   Tür",
  "地下鐵,   U-Bahn",   
  "練習,   üben",   
  "在～上面,   über",   
  "越過,   über",   
  "後天,   übermorgen",   
  "接受 承擔,   übernehmen",   
  "驚訝,   überrascht",   
  "克服,   überwinden",   
  "點,   Uhr",   
  "時鐘,   Uhr",   
  "抱 摟,   umarmen",   
  "試衣間,   Umkleide",   
  "換車 轉車,   umsteigen",   
  "搬家,   umziehen",   
  "和,   und",   
  "車禍,   Unfall",   
  "大約,   ungefähr",   
  "不快樂的,   unglücklich",   
  "失禮的,   unhöflich",   
  "制服,   Uniform",   
  "大學,   Universität",   
  "不可能的,   unmöglich",   
  "我們的,   unser",   
  "底下,   unten",   
  "下,   unter",   
  "在～下面,   unterhalb",   
  "手續,   Unterlagen",   
  "企業,   Unternehmen",   
  "教,   unterrichten",   
  "教室,   Unterrichtsraum",   
  "放學,   Unterrichtsschluß",   
  "簽名,   Unterschrift",   
  "不舒服的,   unwohl",
  "禁止,   verbieten",   
  "花時間,   verbringen",   
  "值得,   verdienen",   
  "愛慕,   verehren",   
  "忘記,   vergessen",   
  "賣,   verkaufen",   
  "銷售員,   Verkäufer",   
  "交通,   Verkehr",   
  "出版社,   Verlag",   
  "受傷,   verletzen",   
  "失去,   verlieren",   
  "想念,   vermissen",   
  "合理的,   vernünftig",   
  "包裝,   verpacken",   
  "錯過,   verpassen",   
  "不同的 不一樣的,   verschieden",   
  "肯定,   versichern",   
  "遲到,   verspäten",   
  "了解,   verstehen",   
  "嘗試,   versuchen",   
  "親戚,   verwandte",   
  "道歉,   Verzeihung",   
  "許多的,   viele",   
  "或許,   vielleicht",   
  "維他命,   Vitamin",   
  "鳥,   Vogel",   
  "單詞,   Vokabel",   
  "尤其,    vor allem",   
  "之前,   vor",   
  "條件,   Voraussetzung",   
  "經過 通過,   vorbei",   
  "前面的,   vordere",   
  "預先,   vorher",   
  "上午,   Vormittag",   
  "在前面,   vorne",   
  "小心的,   vorsichtig",   
  "介紹 想像,   vorstellen",
  "真的 確實的,   wahr",   
  "在～期間,   während",   
  "森林,   Wald",   
  "牆,   Wand",   
  "何時,   wann",   
  "溫暖的 暖和的,   warm",   
  "等,   warten",   
  "為什麼,    warum",   
  "什麼,   was",   
  "洗,   waschen",   
  "水,   wasser",   
  "離開,   weggehen",   
  "雌的,   weiblich",   
  "聖誕節,   Weihnachten",   
  "因為,   weil",   
  "哭,   weinen",   
  "葡萄,   Weintraube",   
  "睿智的,   weise",   
  "白色的,   weiß",   
  "遠的,   weit",   
  "哪個,   welche",   
  "海浪,   Welle",   
  "世界,   Welt",   
  "稍微,   wenig",   
  "誰,   wer",   
  "廣告,   Werbung",   
  "變得,   werden",   
  "丟,   werfen",   
  "作品,   Werk",   
  "價值,   Wert",   
  "誰的,   wessen",   
  "西部,   Westen",   
  "西邊,   westlich",   
  "天氣,   Wetter",   
  "比賽,   Wettkampf",   
  "像,   wie",   
  "再,   wieder",   
  "複習,   wiederholen",   
  "再見,   Wiedersehen",   
  "多少,   wie viel",   
  "幾個,   wie viele",   
  "野蠻的 瘋狂的,   wild",   
  "歡迎,   willkommen",   
  "風,   wind",   
  "冬天,   Winter",   
  "我們,   wir",   
  "真的,   wirklich",   
  "擦,   wischen",   
  "知道,   wissen",   
  "科學,   Wissenschaft",   
  "哪裏,   wo",   
  "星期,   Woche",   
  "週末,   Wochenende",   
  "宿舍,   wohnheim",   
  "公寓,   wohnung",   
  "客廳,   wohnzimmer",   
  "雲,   wolken",   
  "想要,   wollen",   
  "字,   wort",   
  "字典,   Wörterbuch",   
  "絕妙的,   wundervoll",   
  "願望,   wunsch",   
  "香腸,   wurst",
  "數字,   Zahl",   
  "牙齒,   Zahn",   
  "牙刷,   Zahnbürste",   
  "牙膏,   Zahnpasta",   
  "萬,   Zehntausend",   
  "時間,   Zeit",   
  "雜誌,   Zeitschrift",   
  "報紙,   Zeitung",   
  "拉,   ziehen",   
  "相當,   ziemlich",   
  "香菸,   Zigarette",   
  "房間,   Zimmer",   
  "利息,   Zinsen",   
  "檸檬,   Zitrone",   
  "太,   zu",   
  "糖,   Zucker",   
  "本來,   zuerst",   
  "火車,   Zug",   
  "家裏,   zu hause",   
  "打烊,   zumachen",   
  "舌頭,   zunge",   
  "回來,   zurückkommen",   
  "一起,   zusammen",   
  "倒塌,   zusammenbrechen",   
  "收看,   zuschauen",   
  "同意,   zustimmen",   
  "第二,   zweite",   
  "洋蔥,   zwiebel",   
  "在～之間,   zwischen",


  "鰻魚,   der Aal",   
  "取消,   abbrechen",   
  "遮瑕膏,   die Abdeckcreme",   
  "禮服,   das Abendkleid",   
  "晚場,   die Abendvorstellung",   
  "時刻表,   die Abfahrtszeitentafel",   
  "垃圾桶,   der Abfalleimer, die Mülltonne",   
  "出境大廳,   die Abflughalle",   
  "班機時刻表,   der Abflugplan",   
  "排水孔,   der Abfluss",   
  "高中畢業考,   das Abitur",   
  "過期,   ablaufen",   
  "越位,   das abseits",   
  "寄件人地址,   die Absenderadresse",   
  "畢業,   absolvieren",   
  "碗盤架,   das Abtropfgestell",   
  "雲霄飛車,   die Achterbahn",   
  "電源轉接頭,   der Adapter",   
  "老鷹,   der Adler",   
  "有氧運動,   das/die Aerobic",   
  "猴子,   der Affe",   
  "非洲,   Afrika",   
  "農學,   die Agrarwissenschaft",   
  "楓樹,   der Ahorn",   
  "糖漿,   der (Ahorn-)Sirup",   
  "合氣道,   das Aikido",   
  "手風琴,    das Akkordeon",   
  "活頁夾,   der Aktenordner",   
  "文件櫃,   der Aktenschrank",   
  "公事包,   die Aktentasche",   
  "推拿,   die Akupressur",   
  "針灸針,   die Akupunkturnadel",   
  "針灸,   die Akupunktur",   
  "有嚼勁,   al dente",   
  "警鈴,    der Alarm",   
  "海藻,   die Alge",   
  "酒,   der Alkohol",   
  "過敏,   allergisch sein",   
  "阿爾卑斯山,   Alpen",   
  "校友,   der Alumnus",   
  "螞蟻,   die Ameise",   
  "紅綠燈,   die Ampel",   
  "鯰魚,   der Amur-Wels",   
  "鳳梨,   die Ananas",   
  "煎,   anbraten",   
  "引號,   die Anführungszeichen",   
  "發球,   die Angabe",   
  "釣魚,   angeln",   
  "扣殺 殺球,   angreifen",   
  "攻擊線,   die Angriffslinie",   
  "入境大廳,   die Ankunftshalle",   
  "掛號處,   die Anmeldung",   
  "取消,   annullieren",   
  "更衣室,   die Anprobe",   
  "電話答錄機,   der Anrufbeantworter",   
  "開燈 燈火,   anschalten",   
  "看,   anschauen",   
  "收件人地址,   die Anschrift",   
  "開球,   der Anstoß",   
  "南極洲,   die Antarktis",   
  "人類學,   die Anthropologie",   
  "碘酒,   das Antiseptikum",   
  "男律師,   der Anwalt",   
  "女律師,   die Anwältin",   
  "點名,   die Anwesenheitskontrolle",   
  "報警,   Anzeige erstatten",   
  "計分版,   die Anzeigetafel",   
  "西裝 套裝,   der Anzug",   
  "蘋果,   der Apfel",   
  "蘋果蛋糕,   der Apfelkuchen",   
  "蘋果派,   der Apfelstrudel",   
  "蘋果酒,   der Apfelwein",   
  "藥局,   die Apotheke",   
  "杏桃,   die Aprikose",   
  "四月,   April",   
  "魚缸,   das Aquarium",   
  "上班,   arbeiten",   
  "女工人,    die Arbeiterin",   
  "男工人,   der Arbeiter",   
  "女失業者,   die Arbeitslose",   
  "男失業者,   der Arbeitslose",   
  "失業,   arbeitslos",   
  "打卡,   die Arbeitszeit erfassen",   
  "女建築師,   die Architektin",   
  "建築,   die architektur",   
  "男建築師,   der Architekt",   
  "考古學,   die Archäologie",   
  "手臂,   der Arm, die Arme",   
  "儀表板,   das Armaturenbrett",   
  "手錶,   die Armbanduhr",   
  "手鏈,   die Armkette",   
  "扶手,   die Armlehne",   
  "手鐲,   die Armreif",   
  "女芳療師,   die Aromatherapeutin",   
  "男芳療師,   die Aromatherapeut",   
  "助理,    die Arzthelfer",   
  "男醫師,   der Arzt",   
  "煙灰缸,   der Aschenbecher",   
  "亞洲,   Asien",   
  "女助理,   die Assistentin",   
  "男助理,   der Assistent",   
  "天文,   die Astronomie",   
  "女運動員,   die Athletin",   
  "男運動員,   der Athlet",   
  "大西洋,   der Atlantik",   
  "小老鼠,   das At-Zeichen",   
  "茄子,   die Aubergine",   
  "母綿羊,   die Aue",   
  "倒立,   auf dem kopf stehen",   
  "背,   auf dem Rücken tragen",   
  "逛夜市,   auf den Nachtmarkt gehen",   
  "候機室,   der Aufenthaltsraum",   
  "看表演,   die Aufführung anschauen",   
  "興奮的,   aufgeregt",   
  "標籤,   der Aufkleber",   
  "入學考試,   die Aufnahmeprüfung",   
  "論文,   der Aufsatz",   
  "發球區,   das Aufschlagfeld",   
  "發球,   der Aufschlag",   
  "起床,   aufstehen",   
  "解凍,   auftauen",   
  "電梯,   der Aufzug",   
  "眼睛,   das Auge",   
  "眼科醫生,   der Augenarzt",   
  "眉毛,   die Augenbraue",   
  "眉筆,   der Augenbrauenstift",   
  "眼霜,   die Augencreme",   
  "眼科,   die Augenheilkunde",   
  "黑眼圈,   die Augenringe",   
  "八月,   August",   
  "界外球,   der Ausball",   
  "教育,   die Ausbildung",   
  "出口,   der Ausgang",   
  "展示櫃,   die Auslage",   
  "省略號,   die Auslassungspunkte",   
  "借書處,   die Ausleihe",   
  "驚嘆號,   das Ausrufezeichen",   
  "滑倒,   ausrutschen",   
  "關燈 關火,   ausschalten",   
  "長相,   das Aussehen",   
  "課外活動,   die außerschulischen Aktivitäten",   
  "蠔,   die Auster",   
  "蠔油,   die Austernsoße",   
  "澳洲,   Australien",   
  "板凳球員,   der Auswechselspieler",   
  "車子,   das Auto",   
  "交流道,    das Autobahnkreuz",   
  "高速公路,   die Autobahn",   
  "車窗,   das Autofenster",   
  "車牌,   das Autokennzeichen",   
  "自動販賣機,   der Automat",   
  "賽車,   der Autorennsport",   
  "作者,    der Autor",   
  "碰碰車,   der Autoscooter",   
  "車門,    die Autotür",


  "學士,   der Bachelor",   
  "巴哈之家,   Bachhaus",   
  "烤,   backen",   
  "臉頰,   die Backe",   
  "烤箱,   der Backofen",   
  "烘焙食品,    die Backwaren",   
  "泳衣,   der Badeanzug",   
  "泳褲,   die Badehose",   
  "泳帽,   die Badekappe",   
  "浴袍,   der Bademantel",   
  "腳踏墊,   der Badeteppich",   
  "浴巾,   das Badetuch",   
  "浴缸,   die Badewanne",   
  "貝果,   der Bagel",    
  "車站,    der Bahnhof",   
  "月台,   der Bahnsteig",   
  "露台,   der Balkon",   
  "陽台,   der Balkon",   
  "接高球,   den Ball halten",   
  "界外球,   der Ball im Aus",   
  "胸部停球,   die Ballannahme mit der Brust",   
  "接球,   die Ballannahme",   
  "持球,   der Ballbesitz",   
  "芭雷舞鞋,   die Ballettschuhe",   
  "壞球,   der Ball",   
  "竹筍,   die Bambussprosse",   
  "竹子,   der Bambus",   
  "香蕉,   die Banane",   
  "曼谷,   Bangkok",   
  "自動提款機,   der Bankautomat",   
  "提款卡,   die Bankkarte",   
  "銀行,   die Bank",   
  "貝雷帽,   das Barett",   
  "現金,   das Bargeld",   
  "調酒師,   der Barkeeper",   
  "雙槓,   der Barren",   
  "鬍子,   der Bart",   
  "吧台,   die Bar",     
  "棒球場,   das Baseballfeld",   
  "手套,   der Baseballhandschuh",   
  "棒球衣,   der Baseball-Jersey",   
  "球棒,   der Baseballschläger",   
  "棒球,   der Baseball",   
  "籃球場,   das Basketballfeld",   
  "籃筐,   der Basketballkorb",   
  "籃球場,   der Basketballplatz",   
  "電池,   die Batterie",   
  "打擊手,   der Batter",   
  "腹肌,   die Bauchmuskeln",   
  "肚臍,   der Bauchnabel",   
  "肚子痛,   Bauchschmerzen haben",   
  "腹部,   der Bauch",   
  "鄉村麵包,   das Bauernbrot",   
  "鄉村香腸,   die Bauernwurst",   
  "樹,   der Baum",   
  "道路施工,   die Baustelle",   
  "木工,   das bauwesen",   
  "巴伐利亞車站,    Bayerischer Bahnhof",   
  "巴伐利亞洲,   Bayern",   
  "沙灘排球,   der Beachvolleyball",   
  "投影機,   der Beamer",   
  "女公務員,   die Beamtin",   
  "男公務員,   der Beamte",   
  "馬克杯,   der Becher",   
  "盆地,   das Becken",   
  "陰天,   bedeckt",   
  "副駕駛座,   der Beifahrersitz",   
  "升職,   befördert werden",   
  "米色,   beige",   
  "斧頭,   das Beil",   
  "腿,   das Bein",   
  "比利時,   Belgien",   
  "便當,   das Bento",   
  "爬山,   bergwandern",   
  "山,   der Berg",   
  "柏林,   Berlin",   
  "掃把,   der Besen",   
  "擔心的,   besorgt",   
  "及格,   bestehen",   
  "點菜,   bestellen",   
  "確認,   bestätigen",   
  "觀景台,   die Besucherterrasse",   
  "企業管理,   die Betriebswirtschaftslehre",   
  "床單,   der Bettbezug",   
  "被子,   die Bettdecke",   
  "被單,   das Bettlaken",   
  "床,   das Bett",   
  "胸罩,   der Büstenhalter (BH)",   
  "圖書管理員,   der Bibliothekar",   
  "借書證,   der Bibliotheksausweis",   
  "圖書館,   die Bibliothek",   
  "蜜蜂,   die Biene",   
  "啤酒火腿,   der Bierschinken",   
  "啤酒,   das Bier",   
  "比基尼,   der Bikini",   
  "畫冊,   der Bildband",   
  "相框,   der Bilderrahmen",   
  "女雕塑家,   die Bildhauerin",   
  "雕刻,   bildhauern",   
  "男雕塑家,   der Bildhauer",   
  "螢幕,   der Bildschirm",   
  "撞球桿,   der Billardstock",   
  "撞球,   das Billard",   
  "連字號,   der Bindestrich",   
  "繃帶,    die Binde",   
  "生物,   die Biologie",   
  "樺木,   die Birke",   
  "西洋梨,    die Birne",   
  "苦,   Bitter",   
  "燙,   blanchieren",   
  "葉,   das Blatt",   
  "藍色,   blau",   
  "漂白劑,   das Bleichmittel",   
  "鉛筆,   der Bleistift",     
  "削鉛筆機,   der Bleistiftspitzer",   
  "閃電,    der Blitz",   
  "攔網,   blocken",   
  "頭花,   die Blume im Haar",   
  "花菜,   der Blumenkohl",   
  "小碎花,   das Blumenmuster",   
  "花,   die Blume",   
  "藍光播放機,   der Blu-Ray-Player",   
  "女用襯衫,   die Bluse",   
  "量血壓,   den Blutdruck messen",   
  "血壓計,   das Blutdruckmessgerät",   
  "抽血,   die Blutentnahme",   
  "流血,   bluten",   
  "瘀血,   der Bluterguss",   
  "高血壓,   der Bluthochdruck",   
  "輸血,   die Bluttransfusion",   
  "登機區,   der Boardingbereich",   
  "小牛肉香腸,   die Bockwurst",   
  "地板,    der Boden",   
  "拖地,   den Boden wischen",   
  "地勤人員,   das Bodenpersonal",   
  "射箭,   das Bogenschießen",   
  "電鑽,   die Bohrmaschine",   
  "獎金,   der Bonus",   
  "登機證,    die Bordkarte",   
  "路緣石,    der Bordstein",   
  "滾球,   das/die Boule",   
  "水果調酒,   die Bowle",   
  "保齡球,   das Bowling",   
  "拳擊,   das Boxen",   
  "男內褲,   die Boxershorts",   
  "黑糖,   der Braunzucker",   
  "咖啡色,   braun",   
  "煞車,   die Bremse",   
  "玩桌上遊戲,   das Brettspiel spielen",   
  "信件,   der Brief",   
  "信箱,    der Briefkasten",   
  "郵票,   die Briefmarke",   
  "信封,    der Briefumschlag",   
  "眼鏡,    die Brille",   
  "花椰菜,   der Brokkoli",   
  "銅牌,    die Bronzemedaille",   
  "胸針,   die Brosche",   
  "哥哥,   der Bruder",   
  "噴水池,   der Brunnen",   
  "胸部,   die Brust",   
  "蛙式,   das Brustschwimmen",   
  "珍珠奶茶,   der Bubble Tea",   
  "書,   das Buch",   
  "封面,   der Buchdeckel",   
  "書店,   die Buchhandlung",   
  "書背,   der Buchrücken",   
  "書檔,   die Buchstütze",   
  "書名,   der Buchtitel",   
  "駝背,   bucklig",   
  "佈告欄,   das Bulletin",   
  "國道,   die Bundesstraße",   
  "高空彈跳,   das Bungee-Jumping",   
  "公車,   der Bus",   
  "灌木叢,   der Busch",   
  "公車站牌,   die Bushaltestelle",   
  "商務艙,   die Businessclass",   
  "奶油,   die Butter",   
  "奶油刀,   das Buttermesser",   
  "麵包店,   die Bäckerei",   
  "熊,   der Bär",   
  "借書,   Bücher ausleihen",   
  "續借,   Bücher verlängern",   
  "還書,   Bücher zurückgeben",   
  "書架,   das Bücherregal",   
  "書櫃,    das Bücherregal",   
  "自助餐,   das Büffet",   
  "燙衣板,   das Bügelbrett",   
  "熨斗,   das Bügeleisen",   
  "舞台,   die Bühne",   
  "人行道,   der Bürgersteig",   
  "校長室,   das Büro des schuldirektors",   
  "辦公大樓,   das Bürogebäude",   
  "迴紋針,   die Büroklammer",   
  "辦公室,   das Büro",   
  "平頭,   der Bürstenhaarschnitt",   
  "刷子,   die Bürste",
  "咖啡店,    das Cafe",   
  "露營,    campen",   
  "卡布奇諾,    der Cappuccino",   
  "大提琴,    das Cello",   
  "中鋒,    der Center",   
  "蘑菇,    der Champignon",   
  "啦啦隊,    die Cheerleader",   
  "化學,    die Chemie",   
  "化學療法,    die Chemotherapie",   
  "雞塊,    das Chicken-Nugget",   
  "辣椒醬,    die Chilisoße",   
  "大白菜,    der Chinakohl",   
  "饅頭,   die Chinesische Dampfnudel",   

  "屋頂,    das Dach",   
  "天窗,   das Dachfenster",   
  "閣樓,   das Dachgeschoss",   
  "頂樓,   die Dachterrasse",   
  "女裝部,   die Damenabteilung",   
  "蒸氣室,   das Dampfbad",   
  "腸,   der Darm",   
  "日期,   das Datum",   
  "拇指,   der Daumen",   
  "羽絨外套,   die Daunenjacke",   
  "服務台,   die DB Information",   
  "鍋蓋,    der Deckel",   
  "天花板,    die Decke",   
  "毯子,   die Decke",   
  "電擊器,   der Defibrillator",   
  "學院院長,   der Dekan",   
  "裝飾品,   die Dekoration",   
  "海豚,   der Delfin",   
  "熟食店,   das Delikatessengeschäft",   
  "蝶式,   das Delphinschwimmen",   
  "體香噴霧,   das Deodorant",   
  "設計,   das Design",   
  "消毒藥水,   das Desinfektionsmittel",   
  "桌上型電腦,   der Desktop",   
  "德國博物館,   Deutsches Museum",   
  "德國,   Deutschland",   
  "德語,   das Deutsch",   
  "十二月,   Dezember",   
  "胖,   dick",   
  "放學,   Die Schule ist aus.",   
  "小偷,   der Dieb",   
  "星期二,   Dienstag",   
  "出差,   die Dienstreise",   
  "聽寫,   das Diktat",   
  "港式點心,   das Dimsum",   
  "畢業證書,   das Diplom",   
  "星期四,   Donnerstag",   
  "雷,   der Donner",   
  "甜甜圈,   der Donut",   
  "雙打,   das Doppel",   
  "雙人床,   das Doppelbett",   
  "肉乾,   das Dörrfleisch",   
  "鱈魚,   der Dorsch",   
  "開罐器,   der Dosenöffner",   
  "龍舟,   das Drachenboot",   
  "端午節,   das Drachenbootfest",   
  "藥丸,   das Dragee",   
  "十字轉門,   das Drehkreuz",   
  "三角形,   das Dreieck",   
  "三角巾,   das Dreieckstuch",   
  "三級跳遠,   der Dreisprung",   
  "運球,    dribbeln",   
  "四樓,   das dritte Obergeschoss",   
  "生活用品,   die Drogeriewaren",   
  "雜貨店,    die Drogerie",   
  "自動鉛筆,   der Druckbleistift",   
  "印表機,    der Drucker",   
  "杜拜,   Dubai",   
  "風笛,   der Dudelsack",   
  "精油,    das Duftöl",   
  "深色,   dunkel",   
  "抽油煙機,    die Dunstabzugshaube",   
  "拉肚子,   Durchfall haben",   
  "不及格,   durchfallen",   
  "濾盆,   der Durchschlag",   
  "榴蓮,   die Durian-Frucht",   
  "渴,   Durst haben",   
  "浴帽,   die Duschhaube",   
  "蓮蓬頭,   der Duschkopf",   
  "浴簾,   der Duschvorhang",   
  "蒸,   dämpfen",   
  "丹麥,   Dänemark",   
  "沙丘,   die Düne",   
  "淡,   dünn",   
  "瘦,   dünn",   
  "旱災,   die Dürre",
  "貝斯,   der E-Bass",   
  "平原,   die Ebene",   
  "公豬,   der Eber",   
  "蜥蜴,   die Echse",   
  "角球,    die Ecke",   
  "方括號,   die eckigen Klammern",   
  "經濟艙,   die Economyclass",   
  "妻子,   die Ehefrau",   
  "橡樹,   die Eiche",   
  "松鼠,   das Eichhörnchen",   
  "打蛋,   Eier schlagen",   
  "蛋酒,    der Eierlikör",   
  "水桶,   der Eimer",   
  "單行道,   die Einbahnstraße",   
  "素色,   einfarbig",   
  "觸控筆,   der Eingabestift",   
  "入口,   der Eingang",   
  "逛街,   einkaufen gehen",   
  "購物籃,   der Einkaufskorb",   
  "購物袋,   die Einkaufstasche",   
  "購物推車,   der Einkaufswagen",   
  "存款,   die Einlage",   
  "醃,    einlegen",   
  "入境表格,   das Einreiseformular",   
  "單軌電車,   die Einschienenbahn",   
  "掛號信,   das Einschreiben",   
  "出入境,    ein-und ausreisen",   
  "包,   einwickeln",   
  "執鞭線球,   der Einwurf",   
  "單人床,   das Einzelbett",   
  "單程票,   der Einzelfahrschein",   
  "單點,   das Einzelgericht bestellen",   
  "單人房,   das Einzelzimmer",   
  "單打,   das Einzel",   
  "雪糕,    das Eis am Stiel",   
  "冰淇淋,   das Eis",   
  "北極熊,   der Eisbär",   
  "水煮豬腳,   das Eisbein",   
  "花式溜冰,   der Eiskunstlauf",   
  "冰桶,   der Eiskübel",   
  "凍雨,    der Eisregen",     
  "刨冰,   die Eisspeise",   
  "凍雨,    der Eisregen",   
  "競速滑冰,   der Eisschnelllauf",   
  "刨冰,   die Eisspeise",   
  "冰酒,   der Eiswein",   
  "製冰盒,   die Eiswürfelform",   
  "冰塊,   der Eiswürfel",   
  "冰,   das Eis",   
  "冰淇淋,   das Eis",   
  "蛋,   das Ei",   
  "噁心,   ekelhaft",   
  "大象,   der Elefant",   
  "女電工,   die Elektrikerin",   
  "男電工,    der Elektriker",   
  "電動刮鬍刀,   der elektrische Rasierer",   
  "電動牙刷,   die elektrische Zahnbürste",   
  "電器行,    das Elektrofachgeschäft",   
  "橢圓形,   die Ellipse",   
  "喜鵲,   die Elster",   
  "父母,   die Eltern",   
  "電子郵件,   das E-Mail",   
  "接待員,   die Empfangsdame",   
  "櫃檯,   der Empfang",   
  "收件人,    der Empfänger",   
  "機能性飲料,   der Energydrink",   
  "英國公園,   Englischer Garten",   
  "英語,   das Englisch",   
  "孫女,    die Enkelin",   
  "孫子,   der Enkel",   
  "鴨,   die Ente",   
  "鴨肉,   das Entenfleisch",   
  "解僱,   die Entlassung",   
  "牛肋排,   das Entrecote",   
  "請假,   eine Entschuldigung vorlegen",   
  "輕鬆的,   entspannt",   
  "發炎,   die Entzündung",   
  "嘔吐,   erbrechen",   
  "地震,   das Erdbeben",   
  "草莓,   die Erdbeere",   
  "地球,   die Erde",   
  "暖化,   die Erderwärmung",   
  "一樓,   das Erdgeschoss",   
  "地理,   die Erdkunde",   
  "花生油,    das Erdnussöl",   
  "清涼,   erfrischend",   
  "生病,   erkranken",   
  "感冒,   erkältet sein",   
  "感冒藥,   das Erkältungsmittel",   
  "驚訝的,    erstaunt",   
  "頭等艙,   die Erste Klasse",   
  "二樓,   das erste Obergeschoss",   
  "保健室,   der Erste-Hilfe-Raum",   
  "男成年人,    der Erwachsene",   
  "女成年人,   die Erwachsene",   
  "教育,   die Erziehungswissenschaft",   
  "好吃,   Es schmeckt gut / Köstlich",   
  "難吃,   Es schmeckt schlecht",   
  "母驢子,    die Eselin",   
  "公驢子,   der Esel",   
  "濃縮咖啡,   der Espresso",   
  "路邊攤,   der Essenstand",   
  "吃,   essen",   
  "醋,   der Essig",   
  "餐飲攤販,    der Essstand",   
  "筷子,   die Essstäbchen",   
  "貓頭鷹,   die Eule",   
  "歐洲,   Europa",   
  "快遞,   die Expresslieferung",   
  "快遞郵件,   die Expresssendung",   
  "極限運動,   der Extremsport",   
  "眼線筆,   der Eye-Liner",
  "蚵仔麵線,   Fadennudeln mit Austern",   
  "標線,   die Fahrbahnmarkierung",   
  "女司機,   die Fahrerin",   
  "駕駛座,    der Fahrersitz",   
  "男司機,   der Fahrer",   
  "自動售票機,   der Fahrkartenautomat",   
  "售票處,   der Fahrkartenschalter",   
  "腳踏車,   das Fahrrad",   
  "電動走道,   der Fahrsteig",   
  "倒勾球,   der Fallrückzieher",   
  "跳傘,   das Fallschirmspringen",   
  "皺紋,   die Falten",   
  "球迷,   der Fan",   
  "顏色,   die Farben",   
  "油漆,   die Farbe",   
  "調色盤,    die Farbpalette",   
  "油漆滾筒,   der Farbroller",   
  "蕨類,   der Farn",   
  "雉,   der Fasan",   
  "傳真機,   das Faxgerät",   
  "二月,   Februar",   
  "西洋劍,   das Fechten",   
  "羽毛球,   der Federball",   
  "掃地,   fegen",   
  "下班,   der Feierabend",   
  "假日,   die Feiertage",   
  "無花果,   die Feige",   
  "清香,   fein duftend",   
  "奶油生菜,   der Feldsalat",   
  "窗戶,   das Fenster",   
  "遮陽板,   die Fensterblende",   
  "百葉窗,   der Fensterladen",   
  "靠窗座位,   der Fensterplatz",   
  "遙控器,    die Fernbedienung",   
  "看電視,   fernsehen",   
  "電視,   der Fernseher",   
  "電視節目,   die Fernsehsendung",   
  "微波食品,   das Fertiggericht für die Mikrowelle",   
  "快速料理食品,   das Fertiggericht",   
  "慶典,   die Feste",   
  "硬碟,   die Festplatte",   
  "宴會廳,   der Festsaal",   
  "低脂牛奶,   die fettarme Milch",   
  "油膩,   fettig",   
  "面膜,   die Feuchtigkeitsmaske",   
  "濕紙巾,   das Feuchttuch",   
  "警鈴,   der Feueralarm",   
  "滅火器,   der Feuerlöscher",   
  "消防局,    die Feuerwache",   
  "消防車,   das Feuerwehrauto",   
  "雲梯,   die Feuerwehrleiter",   
  "消防員,   der Feuerwehrmann",   
  "水管,   der Feuerwehrschlauch",   
  "消防,   die Feuerwehr",   
  "鞭炮,   der Feuerwerkskörper",   
  "煙火,   das Feuerwerk",   
  "打火機,   das Feuerzeug",   
  "雲杉,   die Fichte",   
  "發燒,   Fieber haben",   
  "身材,   die Figur",   
  "里脊 菲力,   das Filet",   
  "電影海報,   das Filmplakat",   
  "彩色筆,    der Filzstift",   
  "指紋,   der Fingerabdruck",   
  "手指,   der Finger",   
  "公司,   die Firma",   
  "一壘手,   der First Baseman",   
  "頭等艙,   die First Class",   
  "魚,   der Fisch",   
  "魚丸湯,   die Fischbällchensuppe",   
  "男漁夫,   der Fischer",   
  "漁夫帽,   der Fischerhut",   
  "女漁夫,   die Fischerin",   
  "漁夫帽,   der Fischermütze",   
  "魚腥味,   der Fischgeruch",   
  "魚店,   das Fischgeschäft",   
  "魚丸,   das Fischklößchen",   
  "蒼鷺,   der Fischreiher",   
  "魚鱗,   die Fischschuppe",   
  "魚尾,   der Fischschwanz",   
  "魚露,   die Fischsoße",   
  "健身中心,   das Fitnesscenter",   
  "健身房,    das Fitness-Studio",   
  "健身,   die Fitness",   
  "峽灣,   der Fjord",   
  "開瓶器,   der Flaschenöffner",   
  "蝙蝠,   die Fledermaus",   
  "肉品,   das Fleisch",   
  "肉丸,   das Fleischbällchen",   
  "肉圓,   die Fleischklößchen im Teigmantel",   
  "牛排刀,   das Fleischmesser",   
  "飛魚,   der fliegende Fisch",   
  "蒼蠅,   die Fliege",   
  "領結,   die Fliege",   
  "機靈的,    flink",   
  "夾腳拖鞋,   die Flip-Flops",   
  "彈珠台,   der Flipper",   
  "蜜月,   die Flitterwochen",   
  "跳蚤,   der Floh",   
  "魚鰭,   die Flosse",   
  "笛子,   die Flöte",   
  "男空服員,   der Flugbegleiter",   
  "女空服員,   die Flugbegleiterin",   
  "機場巴士,   der Flughafen-Bus",   
  "航班資訊,   die Fluginformation",   
  "機長,   der Flugkapitän",   
  "飛機餐,   die Flugmahlzeit",   
  "班機編號,   die Flugnummer",   
  "機票,   das Flugticket",   
  "目的地,   das Flugziel",   
  "走廊,   der Flur",   
  "河流,   der Fluss",   
  "機翼,   der Flügel",   
  "鋼琴,   der Flügel",   
  "粉底液,   die flüssige Grundierung",   
  "液晶螢幕,   die Flüssigkristallanzeige",   
  "警笛,   das Folgetonhorn",   
  "美食街,   der Food-Court",   
  "鱒魚,   die Forelle",   
  "填資料,   ein Formular ausfüllen",   
  "形狀,   die Form",   
  "學者,   der Forscher",   
  "前鋒,   der Forward",   
  "攝影,    fotografieren",   
  "相片,   das Foto",   
  "影印機,   der Fotokopierer",   
  "犯規,   das Foul",   
  "問號,   das Fragezeichen",   
  "法蘭克福,   Frankfurt",   
  "法國,   Frankreich",   
  "法語,   das Französisch",   
  "婦產科醫生,   der Frauenarzt",   
  "婦產科,   die Frauenheilkunde und Geburtshilfe",   
  "女人,   die Frau",   
  "女自由業,   die Freiberuflerin",   
  "男自由業,   der Freiberufler",   
  "無障礙區,   die freie Zone",   
  "自由落體,   der Freifallturm",   
  "星期五,   Freitag",   
  "罰球線,   die Freiwurflinie",   
  "外語,   die Fremdsprache",   
  "外文書,    fremdsprachige Bücher",   
  "熱情的 友善的,   freundlich",   
  "幕地,   der Friedhof",   
  "保鮮盒,   die Frischhaltedose",   
  "保鮮膜,   die Frischhaltefoile",   
  "涼,   frisch",   
  "男髮型設計師,   der Friseur",   
  "女髮型設計師,    die Friseurin",   
  "美髮院,   der Friseursalon",   
  "炸,    frittieren",   
  "鹽酥雞,   das frittierte und gewürzte Hähnchen",   
  "開朗的  開心的,   fröhlich",   
  "高興的,   froh",   
  "青蛙,   der Frosch",   
  "果實,   die Frucht",   
  "果凍,   der/das Fruchtgelee",   
  "果汁,   der Fruchtsaft",   
  "春天,   der Frühling",    
  "蔥,   die Frühlingszwiebel",   
  "早餐房,   der Frühstücksraum",   
  "培根,   der Frühstücksspeck",   
  "狐狸,   der Fuchs",   
  "失物招領處,   das Fundbüro",   
  "腳,   der Fuß, die Füße",   
  "足浴,   das Fußbad",   
  "足球場,   das Fußballfeld",   
  "世界盃足球賽,   die Fußballweltmeisterschaft",   
  "腳凳,   die Fußbank",   
  "當心行人,   der Fußgänger",   
  "腳底按摩,   die Fußmassage",     
  "當心行人,   der Fußgänger",   
  "腳底按摩,   die Fußmassage",   
  "鞋墊,   die Fußmatte",   
  "渡輪,   die Fähre",   
  "吹風機,    der Föhn",   
  "鋼筆,   der Füllfederhalter",
  "叉子,   die Gabel",   
  "靠走道座位,    der Gangplatz",   
  "鵝,   die Gans",   
  "全身按摩,   die Ganzkörpermassage",   
  "車道,   die Garageneinfahrt",   
  "車庫,   die Garage",   
  "明蝦,   die Garnele",   
  "線,   das Garn",   
  "花園,   der Garten",   
  "瓦斯爐,   der Gasherd",   
  "油門,   das Gaspedal",   
  "客人,   der Gast",   
  "登機門,   das Gate",   
  "炒飯,   der gebratene Reis",   
  "炒麵,   die gebratenen Nudeln",   
  "炒米粉,   die gebratenen Reisnudeln",   
  "出生,   die Geburt",   
  "大樓,   das Gebäude",   
  "破折號,   der Gedankenstrich",   
  "險降坡,   das Gefälle",   
  "雙向道,   der Gegenverkehr",   
  "加薪,   die Gehaltserhöhung",   
  "薪水,   das Gehalt",   
  "密碼,   die Geheimnummer",   
  "走,    gehen",   
  "競走,   das Gehen",   
  "步行器,   das Gehgestell",   
  "腦,   das Gehirn",   
  "禿鷹,   der Geier",   
  "小提琴,   die Geige",   
  "鬼屋,   die Geisterbahn",   
  "被開除,   gekündigt bekommen",   
  "圍欄,   das Geländer",   
  "黃色,   gelb",   
  "黃燈,   die gelbe Ampel",   
  "黃牌,   die Gelbe Karte",   
  "提款,   Geld abheben",   
  "外幣兌換,   geld umtauschen",   
  "皮夾,   der Geldbeutel",   
  "紙鈔鈔票,   der Geldschein",   
  "運鈔車,   der Geldtransporter",   
  "外幣兌換處,   der Geldumtauschschalter",   
  "畫,   das Gemälde",   
  "蔬菜,   das Gemüse",   
  "蔬果店,   der Gemüse und Obstladen",   
  "地理,   die Geografie",   
  "行李,    das Gepäck",   
  "行李架,   die Gepäckablage",   
  "行李寄存處,   die Gepäckaufbewahrung",   
  "行李提領處,   die Gepäckausgabe",   
  "行李輸送帶,   das Gepäckfach",   
  "行李櫃,   das Gepäckfach",   
  "行李推車,   der Gepäckwagen",   
  "菜餚,   das Gericht",   
  "紅腫,   gerötet und geschwollen",   
  "禮物,   das Geschenk",   
  "歷史,   die Geschichte",   
  "洗碗,   das Geschirr spülen",   
  "碗櫃,   der Geschirrschrank",   
  "洗碗機,   der Geschirrspüler",   
  "烘碗機,   der Geschirrtrockner",   
  "味道,   der Geschmack",   
  "大括號,   die geschweiften Klammern",   
  "女商人,   die Geschäftsfrau",   
  "男商人,   der Geschäftsmann",   
  "社會學,   die Gesellschaftskunde",   
  "臉,   das Gesicht",   
  "做臉,   die Gesichtsbehandlung",   
  "面霜,   die Gesichtscreme",   
  "洗面乳,   die Gesichtsreinigungslotion",   
  "化妝水,   das Gesichtswasser",   
  "設計,    die Gestaltung",   
  "昨天,   gestern",   
  "除號,   geteilt durch",   
  "飲料,   das Getränk",   
  "豆乾,   der getrocknete Tofu",   
  "體重,   das Gewicht",   
  "舉重,   das Gewichtheben",   
  "酸黃瓜,   die Gewürzgurke",   
  "澆花,   gießen",   
  "琴酒,   der Gin",   
  "長頸鹿,   die Giraffe",   
  "吉他,   die Gitarre",   
  "玻璃杯,   das Glas",   
  "直髮,   glatte Haare",   
  "禿頭,   die Glatze",   
  "等號,   gleich",   
  "月台軌道,   das Gleis",   
  "冰川,   der Gletscher",   
  "地球儀,   der Globus",   
  "幸運草,    der Glücksklee",   
  "燈泡,   die Glühbirne",   
  "螢火蟲,   das Glühwürmchen",   
  "歌德之家,   Goethe-Haus",   
  "歌德故居,   Goethes Wohnhaus",   
  "卡丁車,   das Gokart",   
  "金色,   golden",   
  "金牌,   die Goldmedaille",   
  "海灣,   der Golf",   
  "螳螂,   die Gottesanbeterin",   
  "研究所,   die Graduate School",   
  "石榴,   der Granatapfel",   
  "葡萄柚,    die Grapefruit",   
  "魚骨,   die Gräte",   
  "灰色,   grau",   
  "握拍,   die Griffhaltung",   
  "鍋把,   der Griff",   
  "燒烤,   grillen",   
  "蟋蟀,   die Grille",   
  "烤雞,   das Grillhähnchen",   
  "祖母,   die Großmutter",   
  "祖父,   der Großvater",   
  "高,   groß",   
  "底線,   die Grundlinie",   
  "小學,   die Grundschule",   
  "小組會議,   die Gruppendiskussion",   
  "尺寸,   die Größen",   
  "大於號,   größer",   
  "綠色,   grün",   
  "綠燈,   die grüne Ampel",   
  "四季豆,   die grünen Bohnen",   
  "綠茶,   der Grüntee",   
  "後衛,   der Guard",   
  "芭樂,   die Guave",   
  "燉牛肉湯,   der Gulasch",   
  "黃瓜,   die Gurke",   
  "古箏,   die Guzheng",   
  "體操,   die Gymnastik",   
  "園藝,   gärtnern",   
  "皮帶,   der Gürtel",
  "髮帶,   das Haarband",   
  "頭髮,   die Haare",   
  "染頭髮,   Haare färben lassen",   
  "吹頭髮,   Haare föhnen lassen",   
  "剪頭髮,   Haare schneiden lassen",   
  "打層次,   Haare stufen",   
  "洗頭髮,   Haare waschen lassen",   
  "除毛,   die Haarentfernung",   
  "髮色,   die Haarfarbe",   
  "髮束,   der/das Haargummi",   
  "髮夾,   die Haarklammer",   
  "髮箍,   der Haarreif",   
  "髮蠟,   das Haarwachs",   
  "剁,   hacken",   
  "絞肉,   das Hackfleisch",   
  "冰雹,   der Hagel",   
  "公雞,   der Hahn",   
  "魚翅,   die Haifischflosse",   
  "鯊魚,   der Hai",   
  "掛鉤,   der Haken",   
  "前場,   das Halbfeld",   
  "半島,   die Halbinsel",   
  "室內游泳池,   das Hallenbad",   
  "脖子,   der Hals",   
  "項鍊,   die Halskette",   
  "耳鼻喉科,   Hals-Nasen-Ohrenheilkunde",   
  "喉嚨痛,   Halsschmerzen haben",   
  "停止線,   die Haltlinie",   
  "停車再開,   Halt-Vorfahrt gewähren",   
  "漢堡,   Hamburg",   
  "漢堡,   der Hamburger",   
  "哈密瓜,   die Hami-Melone",   
  "擲鏈球,   der Hammerwurf",   
  "榔頭,   der Hammer",   
  "手,   die Hand",   
  "手球,   der Handball",   
  "手煞車,   die Handbremse",   
  "護手霜,   die Handcreme",   
  "手掌,   die Handfläche",   
  "手腕,   das Handgelenk",   
  "手製酸奶起司,   der Handkäse mit Musik",   
  "手鏈,   die Handkette",   
  "手銬,   die Handschellen",   
  "手套,   der Handschuh",   
  "手球,   das Handspiel",   
  "倒立,   einen Handstand machen",   
  "女用皮包,   die Handtasche",   
  "毛巾,   das Handtuch",   
  "手機,   das Handy",   
  "手機吊飾,   der Handyanhänger",   
  "漢諾威,   Hannover",   
  "啞鈴,   die Hantel",   
  "豎琴,    die Harfe",   
  "硬地球場,   der Hartboden",   
  "兔子,   der Hase",   
  "大門,   der Haupteingang",   
  "主修,   das Hauptfach",   
  "主菜,   das Hauptgericht",   
  "主角,   die Hauptrolle",   
  "房子,   das Haus",   
  "作業,   die Hausaufgabe",   
  "家電用品,   die Haushaltswarenabteilung",   
  "室內拖鞋,   die Hausschuhe",   
  "疹子,   der Hautausschlag",   
  "水皰,   die Hautblase",   
  "膚色,   die Hautfarbe",   
  "釘書機,   das Heftgerät",   
  "藍莓,   die Heidelbeere",   
  "海德堡,   Heidelberg",   
  "比目魚,   der Heilbutt",   
  "結婚,   heiraten",   
  "熱,   heiß",   
  "溫泉,   die heiße Quelle",   
  "熱巧克力,   die heiße Schokolade",   
  "暖氣,   die Heizung",   
  "淺色,   hell",   
  "襯衫,   das Hemd",   
  "公馬,   der Hengst",   
  "母雞,   die Henne",   
  "秋天,   der Herbst",   
  "男裝部,   die Herrenabteilung",   
  "心臟病,   die Herz-Kreislauf-Erkrankung",   
  "誠懇的,   herzlich",   
  "黑森州,   Hessen",   
  "蝗蟲,   die Heuschrecke",   
  "今天,   heute",   
  "熱心的,   hilfsbereit",   
  "覆盆子,   die Himbeere",   
  "出門,   hinausgehen",   
  "障礙賽跑,   der Hindernislauf",   
  "後場,   das Hinterfeld",   
  "來回票,   die Hin-und-Rückfahrkarte",   
  "鍬形蟲,   der Hirschkäfer",   
  "母鹿,   die Hirschkuh",   
  "公鹿,   der Hirsch",   
  "安打,   der Hit",   
  "觸身球,   der Hit-by-Pitch",   
  "保久乳,   die H-Milch",   
  "耳鼻喉科醫生,   der HNO-Arzt",   
  "高氣壓,   das Hochdruckgebiet",   
  "高等學院,   die Hochschule",   
  "跳高,   der Hochsprung",   
  "洪水,   das Hochwasser",   
  "結婚典禮,   die Hochzeit",   
  "蹲,   hocken",   
  "凳子,   der Hocker",   
  "曲棍球,   das Hockey",   
  "蜂蜜,   der Honig",   
  "法國號,    das Horn",   
  "褲子,   die Hose",   
  "無線上網區,   der Hot Spot",   
  "熱狗,   der Hotdog",   
  "飯店,   das Hotel",   
  "客房,   das Hotelzimmer",   
  "集線器,   der Hub",   
  "直升機,   der Hubschrauber",   
  "雞,   das Huhn",   
  "螯蝦,   der Hummer",   
  "公狗,   der Hund",   
  "狗屋,   die Hundehütte",   
  "狗爬式,   das Hundepaddeln",   
  "蜈蚣,   der Hundertfüßer",   
  "餓,   Hunger haben",   
  "喇叭,   die Hupe",   
  "禁鳴喇叭,   das Hupverbot",   
  "颶風,    der Hurrikan",   
  "咳嗽,   husten",   
  "帽子,   der Hut",   
  "消防栓,   der Hydrant",   
  "大賣場,   der Hypermarkt",   
  "雞胸肉,   die Hähnchenbrust",   
  "雞肉,   das Hähnchenfleisch",   
  "雞翅,   der Hähnchenflügel",   
  "雞腿,   der Hähnchenschenkel",   
  "滑翔翼,   das Hängegleiten",   
  "玩滑翔翼,   den Hängegleiter fliegen",   
  "最高限速,   die Höchstgeschwindigkeit",   
  "助聽器,   das Hörgerät",   
  "丘陵,   der Hügel",   
  "母狗,   die Hündin",   
  "跨欄,   der Hürdenlauf",   
  "欄杆,   die Hürde",
  "上網,    im Internet surfen",   
  "盤腿,   im schneidersitz sitzen",   
  "炒,   im Wok braten",   
  "小吃店,   der Imbiss",   
  "點心吧,   die Imbissstube",   
  "切片,   in Scheiben schneiden",   
  "滷,   in Sojasoße kochen",   
  "印度洋,   der Indische Ozean",   
  "電磁爐,   der Induktionsherd",   
  "傳染病,   die Infektionskrankheit",   
  "內野,   das Infield",   
  "個人視聽娛樂系統,   das In-flight-Entertainment",   
  "資訊,   die Informatik",   
  "服務台,   die Information",   
  "打點滴,   eine Infusion geben",   
  "點滴,   die Infusion",   
  "男工程師,   der Ingenieur",   
  "女工程師,   die Ingenieurin",   
  "工程,   die Ingenieurswissenschaft",   
  "薑,   der Ingwer",   
  "直排輪,   das Inlineskating",   
  "內科,   die Innere Medizin",   
  "上床睡覺,    ins Bett gehen",   
  "看電影,    ins Kino gehen",   
  "昆蟲,   das Insekt",   
  "小島,   die Insel",   
  "群島,   die Inselgruppe",   
  "女水工,   die Installateurin",   
  "男水工,   der Installateur",   
  "即溶咖啡,   der Instantkaffee",   
  "系主任,   der Institutsleiter",   
  "加護病房,   die Intensivstation",   
  "網際網路,   das Internet",   
  "網頁,   die Internetseite",   
  "內科醫生,   der Internist",   
  "面試,   das Interview",   
  "絕緣膠帶,   das Isolierband",   
  "地峽,   der Isthmus",   
  "義大利,   Italien",   
  "義大利語,   das Italienisch",   
  "外套 夾克,   die Jacke ",   
  "打獵,   jagen ",   
  "季節,   die Jahreszeit ",   
  "雅加達,   Jakarta",   
  "干貝,   die Jakobsmuschel",   
  "一月,   Januar",   
  "枇杷,   die Japanische Mispel",   
  "日語,   das Japanisch",   
  "爵士餐廳,   die Jazz-Bar",   
  "牛仔褲,   die Jeanshose",   
  "接機,    jemanden abholen",   
  "送機,   jemanden zum Flughafen bringen",   
  "水上摩托車,   der Jetski",   
  "打工,    jobben",   
  "跳槽,   das Job-Hopping",   
  "慢跑,   das Jogging",   
  "優格,   der Joghurt",   
  "新聞學,   die Journalistik",   
  "女記者,   die Journalistin",   
  "男記者,   der Journalist",   
  "發癢,   jucken",   
  "柔道,   das Judo",   
  "青少年服飾部,   die Jugendabteilung",   
  "女青少年,   die Jugendliche",   
  "男青少年,    der Jugendliche",   
  "點唱機,   die Jukebox",   
  "七月,   Juli",   
  "男孩,   der Junge",   
  "年輕人,   der junge Mensch",   
  "六月,   Juni",   
  "木星,   der Jupiter",
  "電線,   das Kabel",   
  "機艙,   die Kabine",   
  "磁磚,   die Kachel",   
  "咖啡,   der Kaffee",   
  "咖啡豆,   die Kaffeebohne",   
  "咖啡壺,   die Kaffeekanne",   
  "咖啡機,   die Kaffeemaschine",   
  "磨豆機,    die Kaffeemühle",   
  "咖啡粉,   das Kaffeepulver",   
  "咖啡杯 複數,   die Kaffeetassen",   
  "咖啡杯 單數,    die Kaffeetasse",   
  "開羅,   Kairo",   
  "蟑螂,    der Kakerlak",   
  "柿子,   die Kaki",   
  "月曆,   der Kalender",   
  "寫書法,   Kalligrafie schreiben",   
  "冷,   Kalt",   
  "冷鋒,   die Kaltfront",   
  "山茶花,   die Kamelie",   
  "駱駝,   das Kamel",   
  "梳子,   der Kamm",   
  "扇貝,    die Kammuschel",   
  "武術,   der Kampfsport",   
  "金絲雀,   der Kanarienvogel",   
  "冰糖,   der Kandiszucker",   
  "棒球帽,   die Kappe",   
  "膠囊,   die Kapsel",   
  "帽Ｔ,   der Kapuzenpulli",     
  "空手道,   das Karate",   
  "蛀牙,   die Karies",   
  "方格紋,   das Karomuster",   
  "紅蘿菠,    die Karotte",   
  "鯉魚,    der Karpfen",   
  "打牌,   Karten spielen",   
  "卡片夾,    das Kartenetui",   
  "讀卡機,   der Kartenleser",   
  "售票機,   der Kartenverkauf",   
  "卡片,   die Karte",   
  "馬鈴薯球,   der Kartoffelkloß",   
  "馬鈴薯,   die Kartoffel",   
  "旋轉木馬,    das Karussell",   
  "收據,   der Kassenbon",   
  "收銀機,   die Kasse",   
  "結帳處,    die Kasse",   
  "女收銀員,   die Kassiererin",   
  "男收銀員,   der Kassierer",   
  "響板,   die Kastagnette",   
  "公貓,   der Kater",   
  "母貓,   die Katze",   
  "蝌蚪,   die Kaulquappe",   
  "魚子醬,   der Kaviar",   
  "串燒,   der Kebab",   
  "圓錐體,   der Kegel",   
  "畚箕,   die Kehrschaufel",   
  "芽,   der Keimling",   
  "杓子,   die Kelle, der Schöpflöffel",   
  "女服務生,   die Kellnerin",   
  "男服務生,   der Kellner",   
  "劍道,   das Kendo",   
  "燭台,   der Kerzenständer",   
  "蠟燭,   die Kerze",   
  "腿肉,    die Keule",   
  "電子琴,   das Keyboard",   
  "踢,   Kicken",   
  "魚鰓,    die Kieme",   
  "小孩,   das Kind",   
  "子女,   die Kinder",   
  "童裝部,   die Kinderabteilung",   
  "小兒科醫生,   der Kinderarzt",   
  "幼稚園,   der Kindergarten",   
  "小兒科,   die Kinderheilkunde",   
  "托兒所,   die Kinderkrippe",   
  "兒童節目,   die Kindersendung",   
  "下巴,   das Kinn",   
  "電影院,   das Kino",   
  "櫻花,   die Kirschblüte",   
  "櫻桃,   die Kirsche",   
  "櫻桃酒,   das Kirschwasser",   
  "枕頭,   das Kissen",   
  "枕頭套,   der Kissenbezug",   
  "奇異果,   die Kiwi",   
  "小括號,    die Klammern",   
  "折疊餐桌,   der Klapptisch",   
  "單簧管,   die Klarinette",   
  "學期測驗,   die Klassenarbeit",   
  "教室,   der Klassenraum",   
  "鋼琴,   das Klavier",   
  "封箱膠帶,   das Klebeband",   
  "膠帶,   das Klebeband",   
  "膠水,   der Klebstoff",   
  "酢漿草,   der Klee",   
  "洋裝,   das Kleid",   
  "衣架,   der Kleiderbügel",   
  "衣櫃,   der Kleiderschrank",   
  "衣帽架,   der Kleiderständer",   
  "小指,   der kleine Finger",   
  "小於號,   kleiner",   
  "剛學步的小孩,   das Kleinkind",   
  "矮,   klein",   
  "夾板,   das Klemmbrett",   
  "登山,   klettern",   
  "攀岩,   das Klettern",   
  "冷氣,   die Klimaanlage",   
  "揉麵團,   kneten",   
  "膝蓋,   das Knie",   
  "跪,   knien",   
  "蒜頭,   der Knoblauch",   
  "骨折,   der Knochenbruch",   
  "扣子 鈕扣,   der knopf",   
  "酥脆,   knusprig",   
  "無尾熊,   der Koalabär",   
  "廚師,   der Koch",   
  "做飯,   kochen",   
  "煮,   kochen",   
  "行李箱,   der Koffer",   
  "行李吊牌,   der Kofferanhänger",   
  "行李推車,   der Kofferkuli",   
  "後車箱,   der Kofferraum",   
  "行李搬運員,   der Kofferträger",   
  "高麗菜,   der Kohl",   
  "菜卷,   die Kohlroulade",   
  "椰子,   die Kokosnuss",   
  "蜂鳥,   der Kolibri",   
  "男同事,   der Kollege",   
  "女同事,   die Kollegin",   
  "彗星,   der Komet",   
  "喜劇演員,   der Komiker",   
  "逗號,   das Komma",   
  "男大學同學,   der Kommilitone",   
  "女大學同學,   die Kommilitonin",   
  "抽屜櫃,   die Kommode",   
  "傳播,   die Kommunikationswissenschaft",   
  "喜劇片,   die Komödie",   
  "煉乳,   die Kondensmilch",   
  "蛋糕店,   die Konditorei",   
  "禿鷹,   der Kondor",   
  "罐頭食品,   die Konserve",   
  "帳號,   das Konto",   
  "開戶,   ein Konto eröffnen",   
  "帳戶明細表,   die Kontoauszüge",   
  "戶名,   der Kontoinhaber",   
  "男查票員,   der Kontrolleur",   
  "女查票員,   die Kontrolleurin",   
  "音樂會,   das Konzert",   
  "音樂廳,   die Konzerthalle",   
  "頭,   der Kopf",   
  "頂球,   der Kopfball",   
  "帽類織品,   die Kopfbedeckung",   
  "耳機,   der Kopfhörer",   
  "萵苣,   der Kopfsalat",   
  "頭痛,   Kopfschmerzen haben",   
  "床頭櫃,   das Kopfteil",   
  "頭巾,   das Kopftuch",   
  "影印機,   die Kopiermaschine",   
  "影印室,   der Kopierraum",   
  "副機長,   der Kopilot",   
  "珊瑚礁,   die Korallenbank",   
  "珊瑚,   die Koralle",   
  "籃板,   das Korbbrett",   
  "螺旋開酒器,   der Korkenzieher",   
  "修正液,    der Korrekturstift",   
  "更正,   korrigieren",   
  "化妝品區,   die Kosmetikabteilung",   
  "抽取式衛生紙,   das Kosmetiktuch",   
  "領子,    der Kragen",   
  "章魚,   der Krake",   
  "鶴,   der Kranich",   
  "生病,   krank sein",   
  "病歷表,    die Krankenakte",   
  "推床,   das Krankenbett",   
  "出院,   die Krankenhausentlassung",   
  "醫院,   das Krankenhaus",   
  "擔架,   die Krankenliege",   
  "男護士,   der Krankenpfleger",   
  "女護士,   die Krankenschwester",   
  "救護車,   der Krankenwagen",   
  "病房,   das Krankenzimmer",   
  "起重機,   der Kranwagen",   
  "自由式,   das Kraulen",   
  "領帶夾,   das Krawattennadel",   
  "領帶,   die Krawatte",   
  "螃蟹,   der Krebs",   
  "癌症,   der Krebs",   
  "信用卡,   die Kreditkarte",   
  "粉筆,   die Kreide",   
  "圓形,   der Kreis",   
  "扇形,   der Kreissektor",   
  "圓環遵行方向,   der Kreisverkehr",   
  "郵輪,   das Kreuzfahrtschiff",   
  "十字路口,    die Kreuzung",   
  "板球,   das Kricket",   
  "爬,   kriechen",   
  "鱷魚,   das Krokodil",   
  "爽脆,   Kross",   
  "結實,   Kräftig",   
  "拐杖,   die Krücke / Gehhilfe",   
  "河豚,   der Kugelfisch",   
  "原子筆,   der Kugelschreiber",   
  "推鉛球,   das Kugelstoßen",   
  "母牛,   die Kuh",   
  "顧客,   der Kunde",   
  "會員卡,   die Kundenkarte",   
  "美術,    das Kunstmuseum",   
  "藝術,   die Kunst",   
  "選課,   Kurse wählen",   
  "剪短,   Kurz schneiden",   
  "短髮,   kurz Haare",   
  "短褲,   kurze Hose",   
  "近視,   die Kurzsichtigkeit",   
  "馬車,   die Kutsche",   
  "寒流,   der Kälteeinbruch",   
  "袋鼠,    das Känguru",   
  "乳酪,   der Käse",   
  "起司蛋糕,   der Käsekuchen",   
  "熬,    Köcheln",   
  "女廚師,    die Köchin",   
  "科隆,    Köln",   
  "科隆大教堂,   Kölner Dom",   
  "身體,   der Körper",   
  "身高限制,   die Körpergrößenbeschränkung",   
  "身高,   die Körpergröße",   
  "看病,    die Körperliche Untersuchung",   
  "身體乳液,   die Körperlotion, die Körpermilch",   
  "廚房,   die Küche",   
  "流理台,   die Küchenarbeitsplatte",   
  "甜點叉,    die Kuchengabel",   
  "隔熱手套,   der Küchenhandschuh",   
  "食物調理機,   die Küchenmaschine",   
  "廚房剪刀,   die Küchenschere",   
  "櫥櫃,   der Küchenschrank",   
  "冷淡的,   Kühl",   
  "冰敷,   eine Kühlkompresse anwenden",   
  "冰敷袋,   die Kühlkompresse",   
  "冰箱,   der Kühlschrank",   
  "辭職,   kündigen",   
  "女藝術家,   die Künstlerin",   
  "男藝術家,   der Künstler",   
  "人工呼吸,   die Künstliche Beatmung",   
  "南瓜,    der Kürbis",
  "笑,   lachen",   
  "鮭魚,   der Lachs",   
  "充電器,   das Ladegerät",   
  "招牌,   das Ladenschild",   
  "淡啤酒,   das Lager",   
  "羊肉,   das Lammfleisch",   
  "燈,   die Lampe",   
  "地峽,   die Landenge",   
  "省道,   die Landesstraße",   
  "地圖,   die Landkarte",   
  "降落,   die Landung",   
  "男農夫,   der Landwirt",   
  "女農夫,   die Landwirtin",   
  "長髮,   lange Haare",   
  "龍蝦,   die Languste",   
  "千層麵,   die Lasagne",   
  "卡車,   der Lastwagen",   
  "燈籠,   die Laterne",   
  "元宵節,   das Laternenfest",   
  "吊帶褲,    die Latzhose",   
  "青蔥,   der Lauch",   
  "跑道,   die Laufbahn",   
  "跑步機,   das Laufband",   
  "善變的,    launisch",   
  "廣播,   die Lautsprecheransage",   
  "喇叭,   der Lautsprecher",   
  "薰衣草,   der Lavendel",   
  "雪崩,   die Lawine",   
  "微笑,    lächeln",   
  "食品區,   die Lebensmittelabteilung",   
  "食物,   die Lebensmittel",   
  "夾子,   die Lebensmittel Zange",   
  "痣,   der Leberfleck",   
  "德式午餐肉,   der Leberkäse",   
  "肝腸,   die Leberwurst",   
  "肝,   die Leber",   
  "德國薑餅,   der Lebkuchen",   
  "皮鞋,   die Lederschuhe",   
  "皮件區,   die Lederwarenabteilung",   
  "左外野手,   der Left-Fielder",   
  "教科書,   das Lehrbuch",   
  "男老師,   der Lehrer",   
  "女老師,   die Lehrerin",   
  "清淡,    leicht",   
  "痛苦的,   leidend",   
  "帆布鞋,   die Leinenschuhe",   
  "投影布幕,   die Leinwand",   
  "萊比錫,   Leipzig",   
  "梯子,   die Leiter",   
  "牛腩,    die Lende",   
  "方向盤,   das Lenkrad",    
  "雲雀,   die Lerche",   
  "看書,   lesen",   
  "閱覽室,   der Lesesaal",   
  "書籤,    das Lesezeichen",   
  "日光燈管,   die Leuchtstoffröhre",   
  "紫羅蘭,   die Levkoje",   
  "百科全書,   das Lexikon",   
  "蜻蜓,   die Liebelle",   
  "開關,   der Lichtschalter",   
  "信號,   die Lichtzeichenanlage",   
  "眼影,   der Lidschatten",   
  "送貨員,   der Lieferant",   
  "水果酒,   der Likör",   
  "淡紫色,    lila",   
  "百合,   die Lilie",   
  "汽水,   die Limonade",   
  "尺,   das Lineal",   
  "語言學,   die Linguistik",   
  "路線圖,   der Liniennetzplan",   
  "路線圖,   der Linienplan",   
  "邊審,   der Linienrichter",   
  "扁豆湯,   der Linseneintopf",   
  "唇蜜,    das Lipgloss",   
  "護唇膏,    der Lippenpflegestift",   
  "口紅,   der Lippenstift",   
  "文學,   die Literaturwissenschaft",   
  "荔枝,    die Litschi",   
  "大廳,   die Lobby",   
  "打洞機,   der Locher",   
  "捲髮,   lockige Haare",   
  "倫敦,   London",   
  "龍眼,   Longan",   
  "乳液,    die Lotion",   
  "蓮藕,    die Lotoswurzel",   
  "絲瓜,    die Luffa",   
  "加濕機,    der Luftbefeuchter",   
  "除濕機,   der Luftentfeuchter",   
  "芳香劑,   der Lufterfrischer",   
  "航空信,    der Luftpostbrief",   
  "空運,   die Luftpost",   
  "空氣清淨機,   der Luftreiniger",   
  "空氣污染,   die Luftverschmutzung",   
  "肺,   die Lunge",   
  "有趣的,   lustig",   
  "盧森堡,   luxemburg",   
  "湯匙,   der Löffel",   
  "公獅子,   der Löwe",   
  "母獅子,   die Löwin",
  "雜誌,   das Magazin",   
  "腸胃藥,   das Magen-Darm-Mittel",   
  "胃,   der Magen",   
  "脫脂牛奶,   die Magermilch",   
  "磁鐵,   der Magnet",   
  "磁浮列車,   die Magnetschwebebahn",   
  "打麻將,   das Mah-Jongg spielen",   
  "磨,   mahlen",   
  "美茵河,   Main",   
  "玉米棒,   der Maiskolben",   
  "玉米粉,   die Maisstärke",   
  "五月,   Mai",   
  "卸妝液,   der Make-up-Entferner",   
  "女經紀人,   die Maklerin",   
  "男經紀人,    der Makler",   
  "畫畫,   malen",   
  "乘號,   mal",   
  "女經理,   die Managerin",   
  "男經理,   der Manager",   
  "橘子,   die Mandarine",   
  "芒果,   die Mango",   
  "美甲,   die Maniküre",   
  "男人,   der Mann",   
  "秀扣,   der Manschettenknopf",   
  "大衣,   der Mantel",   
  "馬拉松,   der Marathon",   
  "麥克筆,    der Marker",   
  "火星,   der Mars",   
  "警笛,   das Martinshorn",   
  "機械,   der Maschinenbau",   
  "皮尺,   das Maßband",   
  "量尺,   das Maßband",   
  "碩士,   der Master",   
  "數學,    die Mathematik",   
  "早場,   die Matinee",   
  "床墊,   die Matratze",   
  "圍牆,   die Mauer",   
  "老鼠,   die Maus",   
  "滑鼠墊,   die Mauspad",   
  "拿藥,   Medikamente abholen",   
  "服藥,   Medikamente einnehmen",   
  "外用藥,   die Medikamente zur äußeren Anwendung",   
  "口服藥,   die Medikamente zur Einnahme",   
  "打坐,    die Meditation",   
  "冥想,   die Meditation",   
  "醫學,   die Medizin",   
  "海洋,   das Meer",   
  "海峽,   die Meeresenge",   
  "海鮮,   die Meeresfrüchte",   
  "海龜,   die Meeresschildkröte",   
  "海螺,   die Meeresschnecke",   
  "擴充插座,   die Mehrfachsteckdose",   
  "人,   der Mensch",   
  "套餐,   das Menü",   
  "經絡,   der Meridian",   
  "水星,   der Merkur",   
  "菜刀,   das Messer",   
  "刀子,   das Messer",   
  "金屬探測器,   der Metalldetektor",   
  "麥克風,   das Mikrofon",   
  "微波爐,   der Mikrowellenofen",   
  "牛奶,   die Milch",   
  "拿鐵,   der Milchkaffee",   
  "乳牛,    die Milchkuh",   
  "乳製品,   das Milchprodukt",   
  "奶粉,   das Milchpulver",   
  "奶昔,   der Milchshake",   
  "銀河系,   die Milchstraße",   
  "奶茶,    der Milchtee",   
  "最低限速,   die Mindestgeschwindigkeit",   
  "礦泉水,   das Mineralwasser",   
  "減號,   minus",   
  "分,   die Minute",   
  "薄荷,   die Minze",   
  "拌,   mischen",   
  "有同理心的,   mitfühlend",   
  "午休,   die Mittagspause",   
  "中場,   das Mittelfeld",   
  "中指,   der Mittelfinger",   
  "跳跳圈,   der Mittelkreis",   
  "中線,    die Mittellinie",   
  "國中,    die Mittelschule",   
  "午夜場,   die Mitternachtsvorstellung",   
  "星期三,   Ｍittwoch",   
  "果汁機,   der Mixer",   
  "摩卡,    der Mokka",   
  "月,   der Monat",   
  "中秋節,   das Mondfest",   
  "農曆,   der Mondkalender",   
  "月球,    der Mond",   
  "星期一,   Montag",   
  "拖把,   der Mopp",   
  "明天,   morgen",   
  "瑪芬,   der Muffin",   
  "嘴巴,   der Mund",   
  "口感,   das Mundgefühl",   
  "口琴,   die Mundharmonika",   
  "口罩,   der Mundschutz",   
  "土撥鼠,   das Murmeltier",   
  "博物館,   das Museum",   
  "音樂劇,   das Musical",   
  "聽音樂,   Musik hören",   
  "男音樂家,   der Musiker",   
  "女音樂家,    die Musikerin",   
  "音樂,   die Musikwissenschaft",   
  "肌肉,   die Muskeln",   
  "圖案,   die Muster",   
  "媽媽,   die Mutter",   
  "母親節,   der Muttertag",   
  "女孩,   das Mädchen",   
  "三月,   März",   
  "公,   männlich",   
  "筆袋,   das Mäppchen",   
  "家具,    das Möbel",   
  "家具部,   die Möbelabteilung",   
  "家具店,   das Möbelhaus",   
  "紅蘿蔔,   die Möhre",   
  "海鷗,   die Möwe",   
  "蚊子,   die Mücke",   
  "倒垃圾,   Müll wegbringen",   
  "垃圾車,   der Müllwagen",   
  "慕尼黑,   München",   
  "口試,   die mündliche Prüfung",   
  "硬幣,   die Münze",   
  "毛線帽,   die Mütze",
  "回家,   nach Hause gehen",   
  "肚臍,   der Nabel",
  "鄰居,   der Nachbar",   
  "補習班,   die Nachhilfeschule",   
  "補考,   die Nachholprüfung",   
  "工具書,    das Nachschlagewerk",   
  "夜店,   der Nachtclub",   
  "蛾,   der Nachtfalter",   
  "甜點,   der Nachtisch",   
  "檯燈,   die Nachttischlampe",   
  "床頭几,   der Nachttisch",   
  "後頸,   der Nacken",   
  "針,   die Nadel",   
  "釘子,   der Nagel",   
  "指甲剪,   der Nagelknipser",   
  "去光水,   der Nagellackentferner",   
  "指甲油,   der Nagellack",   
  "健康食品,   das Nahrungsergänzungsmittel",   
  "菜名,   der Name des Gerichts",   
  "疤,   die Narbe",   
  "鼻子,   die Nase",   
  "流鼻涕,   die Nase läuft",   
  "流鼻血,   das Nasenbluten",   
  "水梨,   die Nashi-Birne",   
  "犀牛,   das Nashorn",   
  "國定假日,   der Nationalfeiertag",   
  "男科學家,   der Naturwissenschaftler",   
  "女科學家,   die Naturwissenschaftlerin",   
  "霧,   der Nebel",   
  "選修,   das Nebenfach",   
  "姪子 外甥,   der Neffe",   
  "康乃馨,   die Nelke",   
  "海王星,   der Neptun",   
  "觸網,   die Netzberührung",   
  "變壓器,   das Netzteil",   
  "網路卡,    die Netzwerkkarte",   
  "球網,   das Netz",   
  "新年,   das Neujahr",   
  "紐約,   New York",   
  "姪女,   die Nichte",   
  "低氣壓,   das Niederdruckgebiet",   
  "荷蘭,   die Niederlande",   
  "打噴嚏,   niesen",   
  "河馬,   das Nilpferd",   
  "禁區,   der No-Charge-Halbkreis",   
  "北美洲,   Nordamerika",   
  "急診室,   die Notaufnahme",   
  "緊急出口,   der Notausgang",   
  "學期成績單,   die Notenbekanntgabe",   
  "成績,   die Note",   
  "急診,   der Notfall",   
  "筆記本,   das Notizbuch",   
  "便條紙,   der Notizzettel",   
  "十一月,   November",   
  "乾麵,   das Nudelgericht",   
  "擀麵棍,   das Nudelholz",   
  "麵,   die Nudeln",   
  "湯麵,   die Nudelsuppe",   
  "號碼牌,    die Nummer",   
  "堅果焦糖角,   die Nussecke",   
  "縫,   nähen",   
  "縫紉機,   die Nähmaschine",
  "領班,   der Oberkellner",   
  "無軌電車,   der Oberleitungsbus",   
  "大腿,   der Oberschenkel",   
  "高中,    die Oberschule",   
  "雙簧管,   die Oboe",   
  "水果酒,   der Obstbrand",   
  "水果,   das Obst",   
  "公牛,   der Ochse",   
  "耳朵,   das Ohr",   
  "耳罩,   die Ohrenklappe",   
  "耳環,   der Ohrring",   
  "耳溫槍,   das Ohrthermometer",   
  "十月,   Oktober",   
  "橄欖油,   das Olivenöl",   
  "奧林匹克運動會,   die Olympischen Spiele",   
  "伯伯 叔叔,   der Onkel",   
  "烏龍茶,   der Oolong-Tee",   
  "手術室,   der Operationssaal",   
  "動手術,   operieren",   
  "接受手術,   operiert werden",   
  "歌劇院,   das Opernhaus",   
  "歌劇,   die Oper",   
  "柳橙,   die Orange",   
  "橘色,   orange",   
  "蘭花,   die Orchidee",   
  "文件夾,   der Ordner",   
  "泥鰍,   der Ostasiatische Schlammpeitzger",   
  "復活節,    Ostern",   
  "外野,   das Outfield",   
  "大洋洲,   das Ozeanien",
  "西班牙海鮮飯,   die Paella",   
  "行李員,   der Page",   
  "漆彈,   der Paintball",   
  "包裹,   das Paket",   
  "熊貓,   der Panda",   
  "奶酪,   die Pannacotta",   
  "拖鞋,   die Pantoffeln",   
  "鸚鵡,   der Papagei",   
  "木瓜,    die Papaya",   
  "紙,   das Papier",   
  "青椒,   der Paprika",   
  "遊行,   die Parade",   
  "平行四邊形,   das Parallelogramm",   
  "拖曳傘,   das Parasailing",   
  "香水,   das Parfum",   
  "巴黎,    Paris",   
  "公園,   der Park",   
  "停車位,    der Parkplatz",   
  "停車場,   der Parkplatz",   
  "傳球,   passen",   
  "百香果,   die Passionsfrucht",   
  "男病人,   der Patient",   
  "女病人,   die Patientin",   
  "涼亭,   der Pavillon",   
  "太平洋,   der Pazifik",   
  "身體去角質,   das Peeling",   
  "剝,   pellen",   
  "中年人,   Person mittleren Alters",   
  "身分證,    der Personalausweis",   
  "平底鍋,   die Pfanne",   
  "鍋鏟,   der Pfannenwender",   
  "煎餅,   der Pfannkuchen",   
  "孔雀,   der Pfau",   
  "胡椒,   der Pfeffer",   
  "哨子,    die Pfeife",   
  "馬,   das Pferd",   
  "馬尾,   der Pferdeschwanz",    
  "桃子,   der Pfirsich",   
  "貼布 OK蹦,   das Pflaster",   
  "梅花,   die Pflaumenblüte",   
  "保養品,    die Pflegeprodukte",   
  "潤髮乳,    die Pflegespülung",   
  "門房,   der Pförtner",   
  "哲學,   die Philosophie",   
  "物理,   die Physik",   
  "物理治療師,    der Physiotherapeut",   
  "物理療法,    die Physiotherapie",   
  "人體穿洞,   das Piercing",   
  "皮拉提斯,   das Pilates",   
  "男飛行員,   der Pilot",   
  "女飛行員,   die Pilotin",   
  "香菇,   der Pilz",   
  "企鵝,   der Pinguin",   
  "松樹,   die Pinie",   
  "佈告欄,   die Pinnwand",   
  "毛筆,   der Pinsel",   
  "油漆刷,    der Pinsel",   
  "鑷子,   die Pinzette",   
  "手槍,   die Pistole",   
  "披薩刀,    der Pizzaschneider",   
  "海報,   das Plakat",   
  "行星,   der Planet",   
  "塑膠袋,    die Plastiktüte",   
  "高原,   das Plateau",   
  "廣場,   der Platz",   
  "加號,   plus",   
  "冥王星,   der Pluto",   
  "講台,    das Podest",   
  "波蘭,   Polen",   
  "男政治家,   der Politiker",   
  "女政治家,   die Politikerin",   
  "政治學,   die Politikwissenschaft",   
  "政治學,   die Politologie",   
  "警察,    die Polizei",   
  "男警察,    der Polizist",   
  "女警察,   die Polizistin",   
  "馬球,    das Polo",   
  "衫,    das Ploshirt",   
  "多角形,   das Polygon",   
  "薯條,    die Pommes Frities",   
  "演唱會,   das Popkonzert",   
  "皮夾,   das Portemonnaie",   
  "門童,   der Portier",   
  "長號,   das Posaune",   
  "郵局,    die Post",   
  "郵務車,   das Postauto",   
  "郵差,   der Postbote",   
  "郵政信箱,   das Postfach",   
  "便利貼,   das Post-it",   
  "明信片,   die Postkarte",   
  "郵遞區號,   die Postleitzahl",   
  "郵戳,   der Poststempel",   
  "價格,   der Preis",   
  "包廂,    das private Esszimmer",   
  "私立學校,    die Privatschule",   
  "試用期,   die Probezeit",   
  "試吃品,   die Probe",   
  "男教授,   der Professor",   
  "女教授,    die Professorin",   
  "投影機,   der Projektor",   
  "中央處理器,    der Prozessor",   
  "考試,    die Prüfung",   
  "心理學,    die Psychologie",   
  "布丁,   der Pudding",   
  "粉餅,   die Puderdose",   
  "毛衣,   der Pullover",   
  "測心跳,   den Puls messen",   
  "把脈,   die Pulsdiagnose",   
  "高跟鞋,   die Pumps",   
  "圓點,   das Punktemuster",   
  "分,   der Punkt",   
  "句號,   der Punkt",   
  "布袋戲,   das Puppentheater",   
  "火雞肉,   das Putenfleisch",   
  "打掃,   putzen",   
  "包裹,   das Päckchen",   
  "準時,   pünktlich",   
  "蔬菜 泥,   das Püree",
  "氣功,   das Qigong",   
  "旗袍,   das Qipao",   
  "正方形,   das Quadrat",   
  "水母,   die Qualle",   
  "體溫計,   das Thermometer",   
  "長笛,   die Querflöte",   
  "烏鴉,   der Rabe",   
  "輪子,   das Rad",   
  "騎自行車,   das Radfahren",   
  "橡皮擦,   das Radiergummi",   
  "收音機,   das Radio",   
  "廣播,   das Radio",   
  "泛舟,   das Rafting",   
  "火箭,   die Rakete",   
  "油菜花,   der Raps",   
  "除草機,   der Rasenmäher",   
  "灑水器,   der Rasensprenger",   
  "草坪,   der Rasen",   
  "除毛刀,   der Rasierer",   
  "刨,   raspeln",   
  "沙鈴,   die Rassel",   
  "抽煙,   rauchen",   
  "太空船,   das Raumfahrzeug",   
  "落地窗,   das raumhohe Fenster",   
  "太空站,   die Raumstation",   
  "菱形,   die Raute",   
  "菱格紋,    das Rautenmuster",   
  "井號,   das Rautezeichen",   
  "義大利餃,   die Ravioli",   
  "帳單,   die Rechnung",   
  "長方形,   das Rechteck",   
  "法律,   die Rechtswissenschaft",   
  "單槓,   das Reck",   
  "資源回收桶,   der Recyclingbehälter",   
  "講桌,   das Rednerpult",   
  "口頭報告,   das Referat",   
  "足療,   die Reflexzonenmassage",   
  "置物架,   das Regal",   
  "雨,   der Regen",   
  "雨衣,   der Regenmantel",   
  "傘,   der Regenschirm",   
  "雨鞋,   die Regenschuhe",   
  "雨林,   der Regenwald",   
  "蚯蚓,   der Regenwurm",   
  "導演,   der Regisseur",   
  "雨天,   regnerisch",   
  "刨絲器,   die Reibe",   
  "霜,   der Reif",   
  "輪胎,    der Reifen",   
  "飯,   der Reis",   
  "遊覽車,    der Reisebus",   
  "旅遊團,   die Reisegruppe",   
  "男領隊,   der Reiseleiter",   
  "女領隊,    die Reisekeiterin",   
  "男遊客,   der Reisende",   
  "女遊客,    die Reisende",   
  "護照,   der Pass",   
  "旅行支票,   der Reisescheck",   
  "票務中心,   das Reisezentrum",   
  "電鍋,   der Reiskocher",   
  "米糕,   der Reiskuchen",   
  "米漿,   die Reismilch",   
  "米酒,   der Reiswein",   
  "騎馬,   das Reiten",   
  "拉鍊,   der Reißverschluss",   
  "圖釘,   die Reißzwecke",   
  "跑,   rennen",   
  "跑車,   der Rennwagen",   
  "爬蟲類,   das Reptil",   
  "訂位,   reservieren",   
  "餐廳,   das Restaurant",   
  "白蘿蔔,   der Rettich",   
  "救護車,   der Rettungswagen",   
  "救生衣,   die Rettungsweste",   
  "處方,   das Rezept",   
  "萊茵河,    Rhein",   
  "男法官,   der Richter",   
  "女法官,   die Richterin",   
  "摩天輪,    das Riesenrad",   
  "牛,    das Rind",   
  "牛腱,   die Rinderhesse",   
  "牛肉麵,   Rindfleisch Nudeln",   
  "牛肉,   das Rindfleisch",   
  "戒指,   der Ring",   
  "吊環,   die Ringe",   
  "摔角,    das Ringen",   
  "無名指,   der Ringfinger",   
  "套圈圈,   das Ringwerfen",   
  "肋排,    das Rippchen",   
  "燉飯,   das Risotto",   
  "裙子,   der Rock",   
  "滑行,   rollen",   
  "機車,   der Roller",   
  "輪椅,   der Rollstuhl",   
  "手扶梯,   die Rolltreppe",   
  "小說,   der Roman",   
  "羅馬,   Rom",   
  "沙士,   das Root Beer",   
  "粉紅色,   rosa",   
  "玫瑰,   die Rose",   
  "紅色,   rot ",   
  "紅燈,   die rote Ampel",   
  "紅牌,   die Rote Karte",   
  "藍鵲,   die Rotschnabelkitta",   
  "紅葡萄酒,   der Rotwein",   
  "腮紅,    das Rouge",   
  "腮紅刷,   der Rougepinsel",   
  "背包,   der Rucksack",   
  "划船,   rudern",   
  "划船,   das Rudern",   
  "蘭姆酒,    der Rum",   
  "機身,   der Rumpf",   
  "仰臥起坐,    das Rumpfheben",   
  "俄羅斯,   Russland",   
  "強盜,   der Räuber",   
  "燻,   räuchern",   
  "照X光,    röntgen",   
  "火烤,    rösten",   
  "背號,   die Rückennummer",   
  "仰式,   das Rückenschwimmen",   
  "還書處,   die Rückgabe",   
  "反拍,    die Rückhand",   
  "封底,   die Rückseite",   
  "後視鏡,    der Rückspiegel",   
  "飲料攪拌棒,   der Rührstab",
  "鋸子,   die Säge",   
  "鮮奶油,   die Sahne",   
  "義大利臘腸,   die Salami",   
  "沙拉,   der Salat",   
  "沙拉匙,   das Salatbesteck",   
  "沙拉碗,   die Salatschale",   
  "藥膏,   die Salbe",   
  "鹽,   das Salz",   
  "鹹,   salzig",   
  "鹽酥雞,   salziges Knusperhühnchen",   
  "鹽罐,   der Salztreuer",   
  "種子,   der Samen",   
  "星期六,   Samstag",   
  "涼鞋,   die Sandalen",   
  "沙洲,   die Sandbank",   
  "男歌手,   der Sänger",   
  "女歌手,   die Sängerin",   
  "棺材,   der Sarg",   
  "生魚片,   das Sashimi",   
  "人造衛星,   der Satellit",   
  "碟形天線,    die Satellitenschüssel",   
  "飽,   satt sein",   
  "土星,   der Saturn",   
  "句子／一套,   der Satz",   
  "母豬,   die Sau",   
  "酸,   sauer",   
  "氧氣面罩,    die Sauerstoffmaske",   
  "馬桶吸盤,   die Saugglocke",   
  "三溫暖,    die Sauna",   
  "酸雨,   der Saure Regen",   
  "掃描機,   der Scanner",   
  "下西洋棋,   Schach spielen",   
  "棋盤格,   das Schachbrettmuster",   
  "綿羊,   das Schaf",   
  "公綿羊,   der Schafbock",   
  "圍巾,   der Schal",   
  "窗口,   der Schalter",   
  "櫃檯人員,   das Schalterpersonal",   
  "排檔桿,   der Schaltknüppel",   
  "辣,   scharf",   
  "酸辣湯,   die Scharf-sauere Suppe",   
  "男演員,   der Schauspieler",   
  "女演員,   die Schauspielerin",   
  "支票,   der Scheck",   
  "雨刷,   der Scheibenwischer",   
  "車燈,   der Scheinwerfer",   
  "剪刀,   die Schere",   
  "主審,   der Schiedsrichter",   
  "裁判,   der Schiedsrichter",   
  "打靶場,   die Schießbude",   
  "射門,   schießen",   
  "射擊,   der Schießsport",   
  "海盜船,   die Schiffschaukel",   
  "龜,   die Schildkröte",   
  "火腿,   der Schinken",   
  "睡衣,   der Schlafanzug",   
  "睡覺,   schlafen",   
  "警棍,   der Schlagstock",   
  "土石流,   die Schlammlawine",   
  "蛇,   die Schlange",   
  "苗條,   schlank",   
  "水管,   der Schlauch",   
  "面紗,    der Schleier",   
  "關,   schließen",   
  "置物櫃,    das Schließfach",   
  "寄物櫃,    das Schließfach",   
  "滑冰,   der Schlittschuhlauf",   
  "溜冰,   das Schlittschuhlaufen",   
  "門鎖,   das schloss",   
  "鑰匙,   der schlüssel",   
  "鑰匙圈,   der Schlüsselring",   
  "止痛藥,   schmerzmittel",   
  "殺球,   der Schmetterball",   
  "蝴蝶,   der Schmetterling",   
  "殺球,   schmettern",   
  "燉,   schmoren",   
  "珠寶區,   die Schmuckabteilung",   
  "蝸牛,   die Schnecke",   
  "雪,   der Schnee",   
  "攪拌器,   der Schneebesen",   
  "雪鞋,   die Schneeschuhe",   
  "雪靴,   die Schneestiefel",   
  "暴風雪,   der Schneesturm",   
  "砧板,   das Schneidebrett",   
  "切,   schneiden",   
  "割傷,   die Schnittverletzung",   
  "浮潛,   das Schnorcheln",   
  "鞋帶,   der Schnürsenkel",   
  "巧克力麵包,    das Schokobrötchen",   
  "煙囪,   der Schornstein",   
  "左斜線,    der Schrägstrich",   
  "螺絲,   die Schraube",   
  "板手,   der Schraubenschlüssel",   
  "螺絲起子,   der Schraubenzieher",   
  "辦公桌,   der Schreibtisch",   
  "墊板,   die Schreibunterlage",   
  "男木匠,   der Schreiner",   
  "女木匠,   die Schreinerin",   
  "筆試,   die schriftliche Prüfung",     
  "拔罐,   das Schröpfen",   
  "抽屜,   die Schublade",   
  "害羞的,    schüchtern",   
  "鞋類區,   die Schuhabteilung",   
  "鞋子,   die Schuhe",   
  "鞋架,   das Schuhregal",   
  "鞋櫃,   der Schuhschrank",   
  "鞋底,   die Schuhsohle",   
  "開學,   der Schulanfang",   
  "校長,   der Schuldirektor",   
  "學校,   die Schule",   
  "退學,   die Schule abbrechen",   
  "轉學,   die Schule wechseln",   
  "學期,   das Schulhalbjahr",   
  "學年,   das Schuljahr",   
  "女同學,   die Schulkameradin",   
  "男同學,   der Schulkamerad",   
  "黑板,   die Schultafel",   
  "肩膀,   die Schulter",   
  "校門,   das Schultor",   
  "工程帽,   der Schutzhelm",   
  "姐夫 妹夫,   der Schwager",   
  "燕子,    die Schwalbe",   
  "板擦,   der Schwamm",   
  "海綿,   der Schwamm",   
  "天鵝,   der Schwan",   
  "孕婦,    die Schwangere",   
  "懷孕,   die Schwangerschaft",   
  "黑色,   schwarz",   
  "佈告欄,   das Schwarze Brett",   
  "紅茶,   der Schwarztee",   
  "黑森林,   Schwarzwald",   
  "黑森林蛋糕,   die Schwarzwälder Kirschtorte",   
  "瑞士,   die Schweiz",   
  "難消化,   schwer verdaulich",   
  "姐妹,   die Schwester",   
  "婆婆,   die Schwiegermutter",   
  "女婿,   der Schwiegersohn",   
  "媳婦,   die Schwiegertochter",   
  "公公,   der Schwiegervater",   
  "游泳池,   das Schwimmen",   
  "蛙鞋,   die Schwimmflossen",   
  "頭暈,   Schwindel haben",   
  "嫂嫂 弟媳,    die Schwägerin",   
  "削,    schälen",   
  "削皮刀,    das Schälmesser",   
  "美之泉,    Schöner Brunnen",   
  "圍裙,    die Schürze",   
  "碗,    die Schüssel",   
  "湖,    der See",   
  "海參,    die Seegurke",   
  "海膽,    der Seeigel",   
  "海牛,    die Seekuh",   
  "海獅,    der Seelöwe",   
  "鮑魚,    das Seeohr",   
  "海馬,    das Seepferdchen",   
  "海運,    die Seepost",   
  "海葵,    die Seerose",   
  "海蛇,    die Seeschlange",   
  "海星,    der Seestern",   
  "帆船,    das Segelboot",   
  "辛辣,    sehr scharf",   
  "測視力,    einen Sehtest machen",   
  "絲巾,    das Seidenhalstuch",   
  "蠶,    die Seidenraupe",   
  "白鷺鷥,    der Seidenreiher",   
  "香皂,    die Seife",   
  "纜車,    die Seilbahn",   
  "邊線,   die Seitenauslinie",   
  "邊線,    die Seitenlinie",   
  "側泳,    das Seitenschwimmen",   
  "鞍馬,    das Seitpferd",   
  "男秘書,    der Sekretär",   
  "女秘書,    die Sekretärin",   
  "香檳,    der sekt",   
  "香檳杯,    das Sektglas",   
  "秒,    die Sekunde",   
  "有自信的,    selbstbewusst",   
  "芹菜,    die Sellerie",   
  "學期,    das Semester",   
  "期末考,    die Semesterabschlussprüfung",   
  "分號,    das Semikolon",   
  "芥末醬,    der Senf",   
  "首爾,    Seoul",   
  "烏賊,    die Sepia",   
  "九月,    September",   
  "連續劇,    die Serie",   
  "精華液,    der Serum",   
  "服務費,    die Servicegebühr",   
  "含服務費,    Servicegebühr enthalten",   
  "上菜,    servieren",   
  "大淺盤,    der Servierteller",   
  "餐車,    der Servierwagen",   
  "紙巾,    die Serviette",   
  "餐巾紙,    die Serviette",   
  "餐巾環,    der Serviettenring",   
  "麻油,    das Sesamöl",   
  "調酒器,    der Shaker",   
  "洗髮精,    das Shampoo",   
  "上海,    Shanghai",   
  "逛街,    Shoppen gehen",   
  "游擊手,    der Shortstop",   
  "蝦,    der Shrimp",   
  "接駁車,    das Shuttle",   
  "掛號,    sich anmelden",   
  "排隊,    sich anstellen",   
  "穿,    sich anziehen",   
  "趴,    sich auf den Bauch legen",   
  "側躺,    sich auf die Seite legen",   
  "休息,    sich ausruhen",   
  "脫,    sich ausziehen",   
  "生氣,    sich ärgern",   
  "泡澡,    sich baden",   
  "申請,     sich bewerben",   
  "應徵,    sich bewerben",   
  "洗臉,    sich das Gesicht waschen",   
  "刷牙,    sich die Zähne putzen",   
  "洗澡,    sich duschen",   
  "燙頭髮,    sich eine Dauerwelle legen lassen",   
  "躺,    sich hinlegen",   
  "離婚,    sich scheiden",   
  "全身無力,    sich schwach fühlen",   
  "伸懶腰,    sich strecken",   
  "聊天,    sich unterhalten",   
  "量體重,    sich wiegen",   
  "安全帶,    der Sicherheitsgurt",   
  "別針,    die Sicherheitsnadel",   
  "銀牌,    die Silbermedaille",   
  "銀色,    silbern",   
  "新加坡,   Singapur",   
  "唱歌,    singen",   
  "坐,    sitzen",   
  "留級,   sitzen bleiben",   
  "坐墊,    das Sitzkissen",   
  "開會,    eine Sitzung haben",   
  "會議室,    das Sitzungszimmer",   
  "滑板運動,    das Skateboarding",   
  "高山滑雪,    der Ski alpin",   
  "滑雪,    das Skifahren",   
  "蠍子,    der Skorpion",   
  "冰沙,    der Smoothie",   
  "滑雪板,    das Snowboard",   
  "襪子,    die Socken",   
  "抱枕,    das Sofakissen",   
  "沙發,    das Sofa",   
  "霜淇淋,    das Softeis",   
  "兒子,    der Sohn",   
  "豆漿,    die Sojamilch",   
  "醬油,    die Sojasoße",   
  "豆芽菜,    die Sojaprossen",   
  "男軍人,    der Soldat",   
  "女軍人,    die Soldatin",   
  "夏天,    der Sommer",   
  "雀斑,     die Sommersprossen",   
  "太陽,    die Sonne",   
  "向日葵,    die Sonnenblume",   
  "太陽眼鏡,    die Sonnenbrille",   
  "防曬乳,    die Sonnenmilch",   
  "中暑,    der Sonnenstich",   
  "晴天,    der Sonnig",   
  "星期日,    Sonntag",   
  "雪泥,    das Sorbet",   
  "紀念品店,    der Souvenirladen",   
  "社會學,    die Soziologie",   
  "醬料盅,    die Soßenschüssel",   
  "飯杓,    der Spachtel",   
  "義大利麵,    die Spaghetti",   
  "西班牙語,    das Spanisch",   
  "鏟子,    der Spaten",   
  "麻雀,    der Spatz",   
  "水療,    das Spa",   
  "按摩池,     das Spa",   
  "啄木鳥,    der Specht",   
  "擲標槍,    der Speerwurf",   
  "記憶卡,    die Speicherkarte",   
  "記憶體,    der Speicher",   
  "菜單,    die Speisekarte",   
  "學校餐廳,    der Speisesaal",   
  "肉桂餅乾,    der Spekulatius",   
  "鏡子,    der Spiegel",   
  "局,    das Spiel",   
  "電視遊樂器,    die Spielekonsole",   
  "玩遊戲,    spielen",   
  "球員,    der Spieler",   
  "比賽區,    das Spielfeld",   
  "遊樂場,    der Spielplatz",   
  "紀錄,    der Spielstand",   
  "記分版,    die Spielstandsanzeige",   
  "玩具部,    die Spielwarenabteilung",   
  "玩具店,    das Spielwarengeschäft",   
  "玩具,     das Spielzeug",   
  "菠菜,    der Spinat",   
  "置物櫃,    der Spind",   
  "蜘蛛,    die Spinne",   
  "尖頭鞋,    die Spitzen Schuhe",   
  "體育館,    die Sporthalle",   
  "運動服,    die Sportkleidung",   
  "操場,    der Sportplatz",   
  "運動鞋,    die Sportschuhe",   
  "運動用品部,    die Sportwarenabteilung",   
  "體育,    die Sportwissenschaft",   
  "語言教室,    das Sprachlabor",   
  "語言學,    die Sprachwissenschaft",   
  "跳,    springen",   
  "跳繩,    das Springseil",   
  "短跑,    der Sprint",   
  "注射器,    die Spritze",   
  "打針,    eine Spritze bekommen",   
  "打針,    eine Spritze geben",   
  "氣泡水,    das Sprudelwasser",   
  "沙坑,    die Sprunggrube",   
  "跳馬,    das Sprungpferd",   
  "嘔吐袋,    der Spuckbeutel",   
  "水槽,    die Spüle",   
  "水箱,    der Spülkasten",   
  "洗碗精,    das Spülmittel",   
  "菜瓜布,    der Spülschwamm",   
  "壁球,    das Squash",   
  "長竿,    der Stab",   
  "撐竿跳,    der Stabhochsprung",   
  "古城牆,    Stadtmauer",   
  "城市,    die Stadt",   
  "接力賽,    der Staffellauf",   
  "接力棒,     der Staffelstab",   
  "平信,    der Standardbrief",   
  "濃,   stark",   
  "起飛,    der start",   
  "住院,    stationär aufnehmen",   
  "護理站,    die Stationstheke",   
  "統計,    die Statistik",   
  "雕像,    die Statue",   
  "吸地,    staubsauger",   
  "牛排,    das Steak",   
  "魟魚,    der Stechrochen",   
  "插座,    die Steckdose",   
  "插頭,    der Stecker",   
  "大頭針,    die stecknadel",   
  "站,    stehen",   
  "落地燈,   die stehlampe",   
  "險升坡,    die Steigung",   
  "山崩落石,     der Steinschlag",   
  "死亡,    sterben",   
  "音響,    Stereoanlage",   
  "星星,    der Stern",   
  "觀星,    die Stern-Beobachtung",   
  "星雲,   die Sternenwolke",   
  "楊桃,    die Sternfrucht",   
  "星圖,    die Sternkarte",   
  "天文台,    die Sternwarte",   
  "星座,   das Sternzeichen",   
  "聽診器,   das Stethoskop",   
  "靴子,   die Stiefel",   
  "繼母,   die Stiefmutter",   
  "繼子,   der Stiefsohn",   
  "繼女,   die Stieftochter",   
  "繼父,   der stiefvater",   
  "莖,   der stiel",   
  "筆筒,    der Stiftehalter",   
  "鉛筆盒,   das Stiftetui",   
  "臭,   stinkend",   
  "獎學金,   das Stipendium",   
  "額頭,   die Stirn",   
  "布,   der Stoff",   
  "披肩,    die Stola",   
  "保險桿,   die Stoßstange",   
  "海灘,   der Strand",   
  "街道,   die straße",   
  "馬路,   die straße",   
  "有軌電車,   die Straßenbahn",   
  "路燈,   die Straßenlaterne",   
  "鴕鳥,   der strauß",   
  "火柴,   die Streichhölzer",   
  "條紋,   das Streifenmuster",   
  "巡警,   die Streifen",   
  "吵架,    streiten",   
  "撤,   streuen",   
  "編織,   stricken",   
  "毛線帽,   die Strickmütze",   
  "毛線針,   die Stricknadel",   
  "針織衫,   der Strickpullover",   
  "好球,   der strike",   
  "三振,   der strike Out",   
  "打擊位置,   die Strike Zone",   
  "吸管,   der Strohhalm",   
  "草帽,   der strohhut",   
  "褲襪,   die strumpf",   
  "學年,   das Studienjahr",   
  "退學,   das Studium abbrechen",   
  "椅子,   der stuhl",   
  "小時,   die Stunde",   
  "功課表,   der Stundenplan",   
  "風災,   die Sturmkatastrophe",   
  "暴風雨,   der Sturm",   
  "跌倒,   stürzen , hanfallen",   
  "頑固的,    stur",   
  "母馬,   die Stute",   
  "高跟鞋,   die Stöckelschuhe",   
  "前鋒,   der Stürmer",   
  "檢索,   suchen",   
  "相撲,   das Sumo",   
  "沼澤,   der Sumpf",   
  "湯,   die Suppe",   
  "湯盤,   der Suppenteller",   
  "衝浪,   das Surfen",   
  "壽司,   das Sushi",   
  "水上芭蕾,   das Synchronschwimmen",   
  "電子琴,   der Synthesizer",   
  "南美洲,   Südamerika",   
  "地瓜蕃薯,   die Süßkartoffel",   
  "甜,   süß",
  "藥片,   die Tablette",   
  "餐盤,   das Tablett",   
  "餐刀,   das Tafelmesser",   
  "日,    der Tag",   
  "勞動節,    Tag der Arbeit",   
  "毯子,   die Tagesdecke",   
  "會議廳,   der Tagungsraum",   
  "颱風,   der Taifun",   
  "山谷,   das Tal",   
  "鈴鼓,   das Tamburin",   
  "油箱,   der Tank",   
  "加油站,   die Tankstelle",   
  "伯母 嬸嬸,   die Tante",   
  "跳舞,   tanzen",   
  "芋頭,   der Taro",   
  "口袋,   die Tasche",   
  "手電筒,   die Taschenlampe",   
  "計算機,   der Taschenrechner",   
  "紙巾 手帕,    das Taschentuch",   
  "鍵盤,   die Tastatur",   
  "按鍵,   die Tastatur",   
  "按鍵,   die Taste",   
  "刺青,   das Tattoo",   
  "鴿子,   die Taube",   
  "潛水,   das Tauchen",   
  "計程車,   das Taxi",   
  "男技工,   der Techniker",   
  "女技工,   die Technikerin",   
  "茶,   der Tee",   
  "茶包,   der Teebeutel",   
  "茶葉,   die Teeblätter",   
  "茶罐,    die Teedose",   
  "茶館,   das Teehaus",   
  "茶壺,   die Teekanne",   
  "茶壺,   der Teekessel",   
  "茶匙,    der Teelöffel",   
  "池塘,   der Teich",   
  "電話,   das Telefon",   
  "打電話,    telefonieren",   
  "望遠鏡,   das Teleskop",   
  "盤子,   der Teller",   
  "寺廟,   der Tempel",   
  "溫度,   die Temperatur",   
  "網球,   der Tennisball",   
  "網球衣,    die Tenniskleidung",   
  "網球場,   der Tennisplatz",   
  "球拍,   der Tennisschläger",   
  "網球鞋,   die Tennisschuhe",   
  "地毯,   der Teppich",   
  "航廈,    der Terminal",   
  "小考,   der Test",   
  "螢光筆,    der Textmarker",   
  "前場,    das T-Feld",   
  "劇場,   das Theater",   
  "舞台劇,   das Theaterstück",   
  "鮪魚,   der Thunfisch",   
  "平分,   der Tiebreak",   
  "地下停車場,    die Tiefgarage",   
  "冷凍食品,   die Tiefkühlkost",   
  "動物,   das Tier",   
  "母老虎,    die Tigerin",   
  "公老虎,    der Tiger",   
  "魷魚,   der Tintenfisch",     
  "桌子,   der Tisch",   
  "併桌,   Tisch zusammenstellen",   
  "桌巾,    die Tischdecke",   
  "桌上足球,    der Tischfußball",   
  "桌號,    die Tischnummer",   
  "餐墊,    das Tischset",   
  "桌球,   das Tischtennis",   
  "烤麵包機,   der Toaster",   
  "女兒,    die Tochter",   
  "豆花,   der Tofupudding",   
  "馬桶,    die Toilette",   
  "盥洗室,    die Toilette",   
  "馬桶刷,   die Toilettenbürste",   
  "衛生紙,    das Toilettenpapier",   
  "馬桶坐墊,   der Toilettensitz",   
  "東京,   Tokyo",   
  "番茄,   die Tomate",   
  "番茄醬,    das Ketchup",   
  "鍋子,    der Topf",   
  "隔熱墊,   der Topflappen",   
  "盆栽,   die Topfpflanze",   
  "球門,   das Tor",   
  "進球,   ein Tor schießen",   
  "龍捲風,    der Tornado",   
  "鮮奶油蛋糕,   die Torte",   
  "玉米餅,    die Tortilla",   
  "守門員,    der Torwart",    
  "戴,    tragen",      
  "悲劇片,    die Tragödie",   
  "教練,   der Trainer",   
  "蹦床,   das Trampolin",   
  "轉機,   der Transit",   
  "梯形,   das Trapez",   
  "葡萄,   die Traube",   
  "葬禮,   die Trauerfeier",   
  "難過的,   traurig",   
  "樓梯,    die Treppe",   
  "保險櫃,   der Tresorraum",   
  "保險箱,   der Tresor",   
  "三角鐵,   die Triangel",   
  "露天看台,   die Tribüne",   
  "喝,   trinken",   
  "小費,   das Trinkgeld",   
  "優酪乳,    der trinkjoghurt",   
  "鼓,   die Trommel",   
  "喇叭,   die Trompete",   
  "熱帶魚,   der Tropische Fisch",   
  "火雞,    der Truthahn",   
  "遲鈍,   träge",   
  "松露,   der / die Trüffel",   
  "捷克,    Tschechien",   
  "T恤,   das T-Shirt ",   
  "海嘯,   der Tsunami",   
  "低音大喇叭,   die Tuba",   
  "抹布,    das Tuch",   
  "鬱金香,    die Tulpe",   
  "隧道,   der Tunnel",   
  "塔台,   der Turm",   
  "體操,   das Turnen",   
  "冠軍賽,   das Turnier",   
  "男舞蹈家,    der Tänzer",   
  "女舞蹈家,   die Tänzerin",   
  "作弊,   der Täuschungsversuch",   
  "大門,   die Tür",   
  "艙門,   die Tür",   
  "門把,   der Türgriff",   
  "土耳其,    die Türkei",   
  "土耳其藍,   türkis",   
  "門鈴,   die Türklingel",   
  "打包袋,   die Tüte zum Einpacken",    





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
const autoRemoveToggle = document.getElementById("autoRemoveToggle");
const len2Toggle = document.getElementById("len2Toggle");
const len3Toggle = document.getElementById("len3Toggle");
const len4Toggle = document.getElementById("len4Toggle");
const len5Toggle = document.getElementById("len5Toggle");
const groupBtnBar = document.getElementById("groupBtnBar");
const groupBtns = groupBtnBar.querySelectorAll(".group-btn[data-group]");
const customSourceBtn = document.getElementById("customSourceBtn");
const customInputArea = document.getElementById("customInputArea");
const singleWordModeBtn = document.getElementById("singleWordModeBtn");
const lenSection = document.getElementById("lenSection");
const sourceSection = document.getElementById("sourceSection");
const singleWordModeHint = document.getElementById("singleWordModeHint");
const splitModeBar = document.getElementById("splitModeBar");
const splitModeBtns = splitModeBar ? splitModeBar.querySelectorAll(".split-mode-btn") : [];

// ── 資料 ──
let customRows = loadCustomRows();       // 自定義來源 (string[])
let customRowsFull = loadCustomRowsFull(); // 完整快照（持久化，toggle 關→開時從此還原，不受 save 影響）
let displayRows = [];                    // 顯示列表 [{text, source}, ...]
let pickCount = loadPickCount();
let activeGroups = loadActiveGroups();    // Set<number>
let customActive = loadCustomActive();   // boolean
let singleWordMode = loadSingleWordMode(); // boolean
let splitMode = loadSplitMode();         // "syllable" | "random" | "mixed"

// （單字模式關閉後保持 2格+自定義，不需要記憶先前設定）

// ── 工具 ──
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

// ── 載入 ──
function loadCustomRows() {
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

function loadAllowedLens() {
  try {
    const raw = localStorage.getItem(LENS_KEY);
    if (!raw) return [2, 3, 4, 5];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [2, 3, 4, 5];
  } catch { return [2, 3, 4, 5]; }
}

function loadActiveGroups() {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter(n => n >= 0 && n < GROUP_ALL.length));
    return new Set();
  } catch { return new Set(); }
}

function loadCustomActive() {
  return localStorage.getItem(CUSTOM_ACTIVE_KEY) === "1";
}

function loadSingleWordMode() {
  return localStorage.getItem(SINGLE_WORD_MODE_KEY) === "1";
}

function loadSplitMode() {
  const v = localStorage.getItem(SPLIT_MODE_KEY);
  if (v === "random" || v === "mixed") return v;
  return "syllable"; // 預設
}

/** 載入自定義 word 的完整快照（不受 save 截斷影響） */
function loadCustomRowsFull() {
  try {
    const raw = localStorage.getItem(CUSTOM_FULL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed
          .map(r => normalizeRowString(String(r)))
          .filter(isValidRowString);
        if (valid.length > 0) return valid;
      }
    }
  } catch (e) { /* ignore */ }
  // 若 CUSTOM_FULL_KEY 不存在，以 DEFAULT_WORD_ROWS 為完整來源
  return [...DEFAULT_WORD_ROWS];
}

/** 持久化完整快照到 localStorage */
function saveCustomRowsFull() {
  localStorage.setItem(CUSTOM_FULL_KEY, JSON.stringify(customRowsFull));
}

// ── 顯示列表管理 ──

/** 根據目前的 activeGroups + customActive 建立 displayRows */
function buildDisplayRows() {
  displayRows = [];

  // 單字模式：強制 2格 + 自定義，只載入 2 欄項目
  if (singleWordMode) {
    customActive = true;
    activeGroups = new Set();
    len2Toggle.checked = true;
    len3Toggle.checked = false;
    len4Toggle.checked = false;
    len5Toggle.checked = false;

    for (const w of customRowsFull) {
      const parts = w.split(",").map(s => s.trim()).filter(Boolean);
      if (parts.length !== 2) continue;
      displayRows.push({ text: w, source: "custom" });
    }
    return;
  }

  // ── 非單字模式的正常流程 ──
  // 讀取已移除的群組 word 記錄（含手動移除 + 自動移除）
  const removed = loadGroupRemoved();
  for (const gi of activeGroups) {
    const removedSet = new Set(
      (removed[gi] || []).map(s => s.split(",").map(p => p.trim().toLowerCase()).filter(Boolean).join(","))
    );
    for (const w of GROUP_ALL[gi]) {
      const norm = w.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
      if (!removedSet.has(norm)) {
        displayRows.push({ text: w, source: "group-" + gi });
      }
    }
  }
  if (customActive) {
    for (const w of customRows) {
      displayRows.push({ text: w, source: "custom" });
    }
  }
}

function loadGroupRemoved() {
  try {
    const raw = localStorage.getItem(GROUP_REMOVED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch { return {}; }
}

function sourceLabel(source) {
  if (source === "custom") return "[自定義]";
  const idx = parseInt(source.split("-")[1], 10);
  return "[群" + (idx + 1) + "]";
}

function updateTotalCount() {
  totalCountEl.textContent = String(displayRows.length);
  pickCountInput.max = displayRows.length;
  if (pickCount > displayRows.length) {
    pickCount = displayRows.length;
    pickCountInput.value = pickCount;
  }
}

function setMessage(text, ok = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("ok", ok);
}

const PAGE_SIZE = 50;
let renderedCount = 0;

function renderRows() {
  rowListEl.innerHTML = "";
  renderedCount = 0;

  if (!displayRows.length) {
    const empty = document.createElement("div");
    empty.className = "row-item";
    empty.innerHTML = "<span>請點選上方按鈕載入單字來源</span>";
    rowListEl.appendChild(empty);
    updateTotalCount();
    return;
  }

  renderMoreRows();
  updateTotalCount();
}

function renderMoreRows() {
  const end = Math.min(renderedCount + PAGE_SIZE, displayRows.length);

  const oldMore = rowListEl.querySelector(".load-more-btn");
  if (oldMore) oldMore.remove();

  const frag = document.createDocumentFragment();
  for (let i = renderedCount; i < end; i++) {
    const item = document.createElement("div");
    item.className = "row-item";
    item.dataset.idx = i;

    const label = document.createElement("span");
    label.className = "source-label";
    label.textContent = sourceLabel(displayRows[i].source);
    label.style.cssText = "color:#7ea6ff;font-size:12px;margin-right:6px;white-space:nowrap;";

    const content = document.createElement("code");
    content.textContent = displayRows[i].text;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "移除";
    removeBtn.className = "danger remove-row-btn";

    item.appendChild(label);
    item.appendChild(content);
    item.appendChild(removeBtn);
    frag.appendChild(item);
  }
  rowListEl.appendChild(frag);
  renderedCount = end;

  if (renderedCount < displayRows.length) {
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "load-more-btn";
    moreBtn.textContent = `載入更多（已顯示 ${renderedCount}/${displayRows.length}）`;
    moreBtn.style.cssText = "width:100%;padding:12px;margin-top:8px;font-size:15px;cursor:pointer;";
    tapBind(moreBtn, () => renderMoreRows());
    rowListEl.appendChild(moreBtn);
  }
}

// 事件委派：統一處理「移除」按鈕
function handleRemoveRow(e) {
  const btn = e.target.closest(".remove-row-btn");
  if (!btn) return;
  if (e.type === "touchstart") e.preventDefault();
  const item = btn.closest(".row-item");
  if (!item) return;
  const idx = parseInt(item.dataset.idx, 10);
  if (isNaN(idx) || idx < 0 || idx >= displayRows.length) return;
  displayRows.splice(idx, 1);
  renderRows();
  setMessage("已移除一列，按「儲存」生效。");
}
rowListEl.addEventListener("click", handleRemoveRow);
rowListEl.addEventListener("touchstart", handleRemoveRow, { passive: false });

// ── 切換來源 ──

function toggleGroup(idx) {
  const key = "group-" + idx;
  if (activeGroups.has(idx)) {
    // 關閉：從 displayRows 移除該群組的項目
    activeGroups.delete(idx);
    displayRows = displayRows.filter(r => r.source !== key);
  } else {
    // 開啟：載入該群組的所有原始 word（完整重載）
    activeGroups.add(idx);
    for (const w of GROUP_ALL[idx]) {
      displayRows.push({ text: w, source: key });
    }
  }
  updateSourceUI();
  renderRows();
}

/** 將 displayRows 中目前的 custom 項目同步回 customRowsFull / customRows，
 *  確保手動移除的項目不會在模式切換時「復活」。
 *  ⚠ 防護：如果 displayRows 中根本沒有 custom 來源（例如 customActive 為 false），
 *    則跳過同步，避免誤清空 customRowsFull。 */
function syncCustomFullFromDisplay() {
  // 防護：如果自定義未啟用且 displayRows 沒有 custom 項目，不做任何事
  const hasCustomInDisplay = displayRows.some(r => r.source === "custom");
  if (!hasCustomInDisplay && !customActive) return;

  const currentCustom = displayRows
    .filter(r => r.source === "custom")
    .map(r => r.text);
  // 只保留 customRowsFull 中仍在 displayRows 裡的項目（保持原本順序）
  const keepSet = new Set(currentCustom.map(
    w => w.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",")
  ));
  customRowsFull = customRowsFull.filter(w => {
    const norm = w.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
    return keepSet.has(norm);
  });
  customRows = [...customRowsFull];
  saveCustomRowsFull();
}

function toggleCustom() {
  if (customActive) {
    // 關閉前：同步手動移除到 customRowsFull
    syncCustomFullFromDisplay();
    customActive = false;
    // 若單字模式仍開啟，也一併關閉
    if (singleWordMode) singleWordMode = false;
    displayRows = displayRows.filter(r => r.source !== "custom");
  } else {
    // 開啟：從完整快照重載
    customActive = true;
    for (const w of customRowsFull) {
      displayRows.push({ text: w, source: "custom" });
    }
  }
  updateSourceUI();
  renderRows();
}

/** 單字模式：一鍵套用「自定義 + 只顯示2欄項目 + 德文拆字」 */
function toggleSingleWordMode() {
  // 切換前：先把手動移除同步回 customRowsFull
  syncCustomFullFromDisplay();

  singleWordMode = !singleWordMode;

  // 不管開啟或關閉，組合長度固定 2格、來源固定自定義
  len2Toggle.checked = true;
  len3Toggle.checked = false;
  len4Toggle.checked = false;
  len5Toggle.checked = false;
  activeGroups = new Set();
  customActive = true;

  // 重建 displayRows：從已同步的 customRowsFull 載入
  displayRows = [];
  for (const w of customRowsFull) {
    if (singleWordMode) {
      // 單字模式：只保留 2 欄項目（中文提示 + 德文單字）
      const parts = w.split(",").map(s => s.trim()).filter(Boolean);
      if (parts.length !== 2) continue;
    }
    displayRows.push({ text: w, source: "custom" });
  }

  updateSourceUI();
  renderRows();
  if (singleWordMode) {
    const count = displayRows.filter(r => r.source === "custom").length;
    setMessage(`✅ 單字模式已開啟：找到 ${count} 組「中文＋德文單字」，德文將自動拆成字母方塊。按「儲存」生效。`, true);
  } else {
    const count = displayRows.length;
    setMessage(`🔤 單字模式已關閉，保留自定義（${count} 組）+ 2格設定。`, true);
  }
}

function updateSourceUI() {
  // 群組按鈕發光狀態
  groupBtns.forEach(btn => {
    const gi = parseInt(btn.dataset.group, 10);
    btn.classList.toggle("active", activeGroups.has(gi));
  });
  // 自定義按鈕發光狀態
  customSourceBtn.classList.toggle("active", customActive);

  // ── 單字模式按鈕外觀 ──
  if (singleWordMode) {
    singleWordModeBtn.style.background = "#ff9800";
    singleWordModeBtn.style.color = "#000";
    singleWordModeBtn.style.borderColor = "#e6a800";
    singleWordModeBtn.style.boxShadow = "0 0 12px 3px rgba(255,152,0,0.55), inset 0 0 6px rgba(255,152,0,0.15)";
    singleWordModeBtn.textContent = "🔤 單字模式 ON";
  } else {
    singleWordModeBtn.style.background = "#2a2a2a";
    singleWordModeBtn.style.color = "#ccc";
    singleWordModeBtn.style.borderColor = "#666";
    singleWordModeBtn.style.boxShadow = "none";
    singleWordModeBtn.textContent = "🔤 單字模式";
  }
  // 提示文字
  if (singleWordModeHint) singleWordModeHint.style.display = singleWordMode ? "" : "none";

  // ── 單字模式 → 反灰「允許的組合長度」和「單字來源」 ──
  if (lenSection) {
    lenSection.style.opacity = singleWordMode ? "0.35" : "";
    lenSection.style.pointerEvents = singleWordMode ? "none" : "";
  }
  if (sourceSection) {
    sourceSection.style.opacity = singleWordMode ? "0.35" : "";
    sourceSection.style.pointerEvents = singleWordMode ? "none" : "";
  }

  // ── 拆分模式按鈕 ──
  if (splitModeBar) {
    if (singleWordMode) {
      splitModeBar.style.opacity = "";
      splitModeBar.style.pointerEvents = "";
    } else {
      splitModeBar.style.opacity = "0.35";
      splitModeBar.style.pointerEvents = "none";
    }
    splitModeBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.split === splitMode);
    });
  }

  // 自定義輸入區域顯示/隱藏（自定義 或 單字模式 開啟時都顯示）
  customInputArea.style.display = (customActive || singleWordMode) ? "" : "none";
}

// ── 新增自定義 word ──
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
  customRows.push(normalized);
  customRowsFull.push(normalized);  // 同步到完整快照
  saveCustomRowsFull();             // 持久化完整快照
  if (customActive) {
    displayRows.push({ text: normalized, source: "custom" });
  }
  newRowInput.value = "";
  renderRows();
  setMessage("已新增一列，按「儲存」生效。", true);
}

// ── 儲存 ──
function saveRows() {
  // 單字模式：強制自定義啟用，跳過來源/長度檢查
  if (singleWordMode) {
    customActive = true;
  }

  // 至少要有一個來源啟用
  if (!singleWordMode && activeGroups.size === 0 && !customActive) {
    setMessage("請至少啟用一個單字來源。");
    return;
  }
  // 如果有啟用但列表為空
  if (displayRows.length === 0) {
    setMessage("單字列表不能為空，請新增至少 1 列。");
    return;
  }

  // 讀取並驗證抽取組數
  pickCount = parseInt(pickCountInput.value, 10) || 0;
  if (pickCount < 0) pickCount = 0;
  if (pickCount > displayRows.length) pickCount = displayRows.length;
  pickCountInput.value = pickCount;

  // 收集允許的組合長度（單字模式下長度由拆字決定，這裡仍然儲存以便切回時使用）
  const allowedLens = [];
  if (len2Toggle.checked) allowedLens.push(2);
  if (len3Toggle.checked) allowedLens.push(3);
  if (len4Toggle.checked) allowedLens.push(4);
  if (len5Toggle.checked) allowedLens.push(5);
  if (!singleWordMode && allowedLens.length === 0) {
    setMessage("至少要勾選一種組合長度。");
    return;
  }
  // 單字模式下若沒勾選任何長度，預設全勾
  if (allowedLens.length === 0) {
    allowedLens.push(2, 3, 4, 5);
  }

  // 從 displayRows 提取目前的自定義 word（可能已被移除部分）
  if (customActive) {
    if (singleWordMode) {
      // 單字模式下 displayRows 只有 2 欄項目，不能覆蓋完整列表
      // 保留 customRowsFull 作為完整資料，customRows 同步
      customRows = [...customRowsFull];
    } else {
      customRows = displayRows.filter(r => r.source === "custom").map(r => r.text);
    }
  }

  // 計算使用者在設定頁手動移除的群組 word，寫入 GROUP_REMOVED_KEY
  const manualRemoved = {};
  for (const gi of activeGroups) {
    const key = "group-" + gi;
    // displayRows 中屬於該群組的 word（正規化後）
    const currentSet = new Set(
      displayRows
        .filter(r => r.source === key)
        .map(r => r.text.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(","))
    );
    // 原始群組中有，但 displayRows 中沒有的 → 被手動移除
    const removedWords = GROUP_ALL[gi].filter(w => {
      const norm = w.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
      return !currentSet.has(norm);
    });
    if (removedWords.length > 0) {
      manualRemoved[gi] = removedWords;
    }
  }

  // 儲存
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRows));
  localStorage.setItem(PICK_KEY, String(pickCount));
  localStorage.setItem(DEBUG_KEY, debugToggle.checked ? "1" : "0");
  localStorage.setItem(LENS_KEY, JSON.stringify(allowedLens));
  localStorage.setItem(AUTO_REMOVE_KEY, autoRemoveToggle.checked ? "1" : "0");
  localStorage.setItem(GROUPS_KEY, JSON.stringify([...activeGroups]));
  localStorage.setItem(CUSTOM_ACTIVE_KEY, customActive ? "1" : "0");
  localStorage.setItem(SINGLE_WORD_MODE_KEY, singleWordMode ? "1" : "0");
  localStorage.setItem(SPLIT_MODE_KEY, splitMode);
  localStorage.setItem(GROUP_DATA_KEY, JSON.stringify(GROUP_ALL));
  // 若有手動移除的群組 word，儲存到 GROUP_REMOVED_KEY；否則清除
  if (Object.keys(manualRemoved).length > 0) {
    localStorage.setItem(GROUP_REMOVED_KEY, JSON.stringify(manualRemoved));
  } else {
    localStorage.removeItem(GROUP_REMOVED_KEY);
  }

  // 提示訊息
  const parts = [];
  if (activeGroups.size > 0) {
    const names = [...activeGroups].sort().map(i => `群組${i + 1}`).join("＋");
    const totalWords = displayRows.filter(r => r.source.startsWith("group-")).length;
    parts.push(`${names}（${totalWords} 組）`);
  }
  if (customActive) {
    const customCount = displayRows.filter(r => r.source === "custom").length;
    if (singleWordMode) {
      const splitLabel = splitMode === "syllable" ? "音節拆分" :
                         splitMode === "random" ? "隨機拆分" : "混合拆分";
      parts.push(`單字模式（${customCount} 組，${splitLabel}）`);
    } else {
      parts.push(`自定義（${customCount} 組）`);
    }
  }
  const modeText = parts.join("＋");
  const lenText = allowedLens.length === 4
    ? "全部長度"
    : allowedLens.map(n => n + "格").join("、");
  setMessage(`已儲存（${modeText}，${lenText}），回遊戲頁重新開始即可套用。`, true);
}

// ── 還原預設 ──
function resetDefault() {
  // 1) 重置所有記憶體狀態
  customRows = [...DEFAULT_WORD_ROWS];
  customRowsFull = [...DEFAULT_WORD_ROWS];
  activeGroups = new Set();
  customActive = false;
  singleWordMode = false;
  splitMode = "syllable";
  pickCount = 0;
  pickCountInput.value = 0;
  autoRemoveToggle.checked = false;
  len2Toggle.checked = true;
  len3Toggle.checked = true;
  len4Toggle.checked = true;
  len5Toggle.checked = true;

  // 2) 清除「立即載入」暫存
  if (typeof _loadedFailedWords !== "undefined") _loadedFailedWords = [];
  if (failedWordsArea) failedWordsArea.style.display = "none";

  // 3) 重建顯示列表 & 更新 UI
  buildDisplayRows();
  updateSourceUI();
  renderRows();

  // 4) 直接寫入 localStorage（等同自動儲存，不需再按「儲存」）
  saveCustomRowsFull();                                         // 完整快照
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRows));
  localStorage.setItem(PICK_KEY, String(0));
  localStorage.setItem(DEBUG_KEY, debugToggle.checked ? "1" : "0");
  localStorage.setItem(LENS_KEY, JSON.stringify([2, 3, 4, 5]));
  localStorage.setItem(AUTO_REMOVE_KEY, "0");
  localStorage.setItem(GROUPS_KEY, JSON.stringify([]));
  localStorage.setItem(CUSTOM_ACTIVE_KEY, "0");
  localStorage.setItem(SINGLE_WORD_MODE_KEY, "0");
  localStorage.setItem(SPLIT_MODE_KEY, "syllable");
  localStorage.setItem(GROUP_DATA_KEY, JSON.stringify(GROUP_ALL));
  localStorage.removeItem(GROUP_REMOVED_KEY);                   // 清除手動移除紀錄

  setMessage("✅ 已還原預設並自動儲存，回遊戲頁即可套用。", true);
}

// ── 學習統計（Google Sheets 同步 + Google 登入） ──

const STATS_KEY = "word_tetris_combo_stats_v1";
const GOOGLE_USER_KEY = "word_tetris_google_user_v1";

// ★★★ 請在這裡填入你的設定 ★★★
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCSMkz1NiiUjB-32e_L4i3VtQbtpzUFYWgOPX4qOwbtjGGrZ_V2qvMYutX0iP-_NWlBQ/exec";      // Google Apps Script 部署網址
const GOOGLE_CLIENT_ID = "280426045341-s5tias2et5fgfkm6v4pasodaimi9usot.apps.googleusercontent.com";     // Google Cloud Console 的 OAuth Client ID
// ★★★ 以上兩個值必須填入才能正常運作 ★★★

const viewStatsBtn = document.getElementById("viewStatsBtn");
const clearStatsBtn = document.getElementById("clearStatsBtn");
const statsDisplay = document.getElementById("statsDisplay");
const googleSignInBtn = document.getElementById("googleSignInBtn");
const googleUserInfo = document.getElementById("googleUserInfo");
const googleUserAvatar = document.getElementById("googleUserAvatar");
const googleUserName = document.getElementById("googleUserName");
const googleSignOutBtn = document.getElementById("googleSignOutBtn");

// ── Google 登入 ──

/** 解碼 JWT credential（不需要外部 library） */
function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function loadGoogleUser() {
  try {
    const raw = localStorage.getItem(GOOGLE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveGoogleUser(user) {
  localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user));
}

function clearGoogleUser() {
  localStorage.removeItem(GOOGLE_USER_KEY);
}

/** 登入成功回呼 */
function handleGoogleCredentialResponse(response) {
  try {
    const payload = decodeJwt(response.credential);
    const user = {
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture || "",
    };
    saveGoogleUser(user);
    updateGoogleAuthUI();
    setMessage("✅ 已登入：" + user.email, true);
  } catch (e) {
    setMessage("❌ Google 登入失敗：" + e.message);
  }
}

/** 更新登入 / 登出 UI */
function updateGoogleAuthUI() {
  const user = loadGoogleUser();
  if (user) {
    googleSignInBtn.style.display = "none";
    googleUserInfo.style.display = "flex";
    googleUserName.textContent = user.name + " (" + user.email + ")";
    if (user.picture) {
      googleUserAvatar.src = user.picture;
      googleUserAvatar.style.display = "inline";
    } else {
      googleUserAvatar.style.display = "none";
    }
  } else {
    googleSignInBtn.style.display = "block";
    googleUserInfo.style.display = "none";
  }
}

/** 初始化 GIS（等 library 載入完成後呼叫） */
let _gisRetry = 0;
function initGoogleSignIn() {
  if (typeof google === "undefined" || !google.accounts) {
    _gisRetry++;
    if (_gisRetry > 15) {
      // 5 秒後放棄（可能是 file:// 或無網路）
      console.warn("Google Identity Services 載入失敗，Google 登入功能不可用。請確認使用 http:// 或 https:// 開啟頁面。");
      googleSignInBtn.innerHTML = '<p style="color:#888;font-size:12px;">⚠️ Google 登入不可用（需透過 http/https 開啟頁面）</p>';
      updateGoogleAuthUI();
      return;
    }
    setTimeout(initGoogleSignIn, 300);
    return;
  }
  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
    });
    // 僅在未登入時渲染按鈕
    if (!loadGoogleUser()) {
      google.accounts.id.renderButton(googleSignInBtn, {
        theme: "outline",
        size: "medium",
        text: "signin_with",
        locale: "zh-TW",
      });
    }
  } catch (e) {
    console.warn("Google Sign-In 初始化失敗:", e);
    googleSignInBtn.innerHTML = '<p style="color:#888;font-size:12px;">⚠️ Google 登入初始化失敗</p>';
  }
  updateGoogleAuthUI();
}

tapBind(googleSignOutBtn, () => {
  clearGoogleUser();
  // 清除 GIS 狀態
  if (typeof google !== "undefined" && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  updateGoogleAuthUI();
  // 重新渲染登入按鈕
  if (typeof google !== "undefined" && google.accounts) {
    google.accounts.id.renderButton(googleSignInBtn, {
      theme: "outline",
      size: "medium",
      text: "signin_with",
      locale: "zh-TW",
    });
  }
  setMessage("已登出 Google 帳號。");
});

// 頁面載入後初始化 GIS
initGoogleSignIn();

// ── 統計功能（從 Google Sheets 讀取） ──

const loadFailedBtn = document.getElementById("loadFailedBtn");
const failedWordsArea = document.getElementById("failedWordsArea");

function loadComboStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (typeof parsed === "object" && parsed !== null) ? parsed : {};
  } catch { return {}; }
}

/**
 * 從 Google Sheets 取得統計資料
 * 策略：http/https 頁面先嘗試 fetch；失敗或 file:// 頁面改用 JSONP
 */
function fetchStatsFromSheets(action) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("YOUR_")) {
    return Promise.reject(new Error("請先在 settings.js 中設定 APPS_SCRIPT_URL。"));
  }
  const user = loadGoogleUser();
  if (!user) {
    return Promise.reject(new Error("請先登入 Google 帳號。"));
  }

  const baseUrl = APPS_SCRIPT_URL
    + "?action=" + encodeURIComponent(action)
    + "&email=" + encodeURIComponent(user.email);

  // http / https → 嘗試 fetch，失敗再回退 JSONP
  if (location.protocol === "http:" || location.protocol === "https:") {
    return _fetchViaFetch(baseUrl).catch(fetchErr => {
      console.warn("fetch 方式失敗，改用 JSONP:", fetchErr.message);
      return _fetchViaJsonp(baseUrl);
    });
  }
  // file:// → 直接用 JSONP
  return _fetchViaJsonp(baseUrl);
}

/** 方式一：使用 fetch（適用 http/https 頁面） */
function _fetchViaFetch(baseUrl) {
  return fetch(baseUrl, { redirect: "follow" })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      if (data && data.ok) return data;
      throw new Error(data.error || "回傳資料異常");
    });
}

/** 方式二：JSONP（適用 file:// 頁面，也可作備用） */
function _fetchViaJsonp(baseUrl) {
  return new Promise((resolve, reject) => {
    const cbName = "_jsonpCb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(
        "請求逾時（20 秒）。\n\n" +
        "🔧 請確認以下事項：\n" +
        "1. google_apps_script.js 已完整貼入 Apps Script 編輯器\n" +
        "2. 已點選「部署 → 管理部署 → ✏️ → 版本選「新版本」→ 部署」\n" +
        "3. 存取權限設為「所有人」\n\n" +
        "📋 測試網址（在瀏覽器新分頁開啟看是否回傳 JSON）：\n" + baseUrl
      ));
    }, 20000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[cbName];
      const el = document.getElementById(cbName);
      if (el) el.remove();
    }

    window[cbName] = function (data) {
      cleanup();
      if (data && data.ok) {
        resolve(data);
      } else {
        reject(new Error(data ? (data.error || "回傳資料異常") : "回傳為空"));
      }
    };

    const url = baseUrl + "&callback=" + encodeURIComponent(cbName);
    const script = document.createElement("script");
    script.id = cbName;
    script.src = url;
    script.onerror = () => {
      cleanup();
      reject(new Error(
        "Script 載入失敗。\n\n" +
        "🔧 最可能的原因：\n" +
        "① Apps Script 尚未重新部署（需要「管理部署 → 新版本 → 部署」）\n" +
        "② 部署網址已變更（重新部署後請更新 APPS_SCRIPT_URL）\n\n" +
        "📋 請在瀏覽器新分頁開啟以下網址測試：\n" + baseUrl
      ));
    };
    document.head.appendChild(script);
  });
}

// ── 查看失敗率排行（從 Google Sheets） ──

let statsFilterAbove50 = false;
let _cachedSheetStats = null; // 暫存，避免重複 fetch

tapBind(viewStatsBtn, async () => {
  statsFilterAbove50 = false;
  _cachedSheetStats = null;
  statsDisplay.style.display = "block";
  statsDisplay.innerHTML = '<p style="color:#666;">⏳ 正在從 Google Sheets 載入統計資料...</p>';
  try {
    const data = await fetchStatsFromSheets("stats");
    if (!data.ok) throw new Error(data.error || "未知錯誤");
    _cachedSheetStats = data.stats || [];
    renderStatsDisplay();
  } catch (e) {
    const msg = e.message || "未知錯誤";
    // 將 \n 轉為 <br>，讓診斷資訊換行顯示
    const htmlMsg = escapeHtml(msg).replace(/\n/g, "<br>");
    statsDisplay.innerHTML = `<p style="color:#c62828;white-space:pre-wrap;">❌ ${htmlMsg}</p>`;
  }
});

function renderStatsDisplay() {
  const sorted = _cachedSheetStats || [];
  if (sorted.length === 0) {
    statsDisplay.style.display = "block";
    statsDisplay.innerHTML = "<p style='color:#666;'>Google Sheets 中尚無統計資料。玩幾局遊戲後資料會自動同步。</p>";
    return;
  }

  const above50 = sorted.filter(s => s.failRate > 0.5);
  const above70 = sorted.filter(s => s.failRate > 0.7);
  const list = statsFilterAbove50 ? above50 : sorted;

  let html = `<div style="margin-bottom:10px;padding:10px 14px;background:#f0f4ff;border-radius:8px;font-size:13px;border:1px solid #d0d8f0;">`;
  html += `<div style="font-weight:bold;color:#333;margin-bottom:4px;">📊 統計摘要（共 ${sorted.length} 組）</div>`;
  html += `<span style="color:#c62828;">🔴 失敗率 &gt; 70%：<b>${above70.length}</b> 組</span>`;
  html += `<span style="margin-left:12px;color:#e65100;">🟠 失敗率 &gt; 50%：<b>${above50.length}</b> 組</span>`;
  html += `<br><span style="color:#666;font-size:12px;margin-top:4px;display:inline-block;">💡 資料來源：Google Sheets（重新開始 / 遊戲結束 / 破關 時自動同步）</span>`;
  html += `</div>`;

  const btnStyle50 = statsFilterAbove50
    ? "background:#e65100;color:#fff;border:none;"
    : "background:#fff;color:#e65100;border:1px solid #e65100;";
  const btnStyleAll = !statsFilterAbove50
    ? "background:#1565c0;color:#fff;border:none;"
    : "background:#fff;color:#1565c0;border:1px solid #1565c0;";
  html += `<div style="margin-bottom:10px;display:flex;gap:8px;">`;
  html += `<button id="_statsShowAll" style="${btnStyleAll}padding:6px 14px;border-radius:6px;font-size:13px;cursor:pointer;">全部 (${sorted.length})</button>`;
  html += `<button id="_statsShow50" style="${btnStyle50}padding:6px 14px;border-radius:6px;font-size:13px;cursor:pointer;">失敗率 &gt; 50% (${above50.length})</button>`;
  html += `</div>`;

  if (list.length === 0) {
    html += `<p style="color:#2e7d32;font-weight:bold;">🎉 太棒了！沒有失敗率超過 50% 的組合。</p>`;
  } else {
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#e8eaf6;border-bottom:2px solid #c5cae9;text-align:left;">
          <th style="padding:6px 8px;color:#333;">#</th>
          <th style="padding:6px 8px;color:#333;">組合</th>
          <th style="padding:6px 8px;color:#333;text-align:center;">出現</th>
          <th style="padding:6px 8px;color:#333;text-align:center;">消除</th>
          <th style="padding:6px 8px;color:#333;">失敗率</th>
        </tr>
      </thead><tbody>`;

    const showCount = Math.min(list.length, 50);
    for (let i = 0; i < showCount; i++) {
      const s = list[i];
      const failPct = (s.failRate * 100).toFixed(0);
      const barColor = s.failRate > 0.7 ? "#c62828" : s.failRate > 0.5 ? "#e65100" : s.failRate > 0.3 ? "#f9a825" : "#2e7d32";
      const rowBg = s.failRate > 0.7 ? "background:#ffebee;" : s.failRate > 0.5 ? "background:#fff3e0;" : "";
      const parts = (s.display || s.comboKey || "").split(",");
      let comboHtml;
      if (parts.length >= 2) {
        const hint = escapeHtml(parts[0]);
        const words = parts.slice(1).map(w => escapeHtml(w.trim())).join(", ");
        comboHtml = `<span style="color:#1565c0;font-weight:600;">${words}</span>` +
                    `<br><span style="color:#888;font-size:11px;">${hint}</span>`;
      } else {
        comboHtml = `<span style="color:#333;font-weight:500;">${escapeHtml(s.display || s.comboKey || "")}</span>`;
      }
      html += `<tr style="border-bottom:1px solid #eee;${rowBg}">
        <td style="padding:6px 8px;color:#999;font-size:12px;">${i + 1}</td>
        <td style="padding:6px 8px;word-break:break-all;">${comboHtml}</td>
        <td style="padding:6px 8px;text-align:center;color:#555;">${s.appear}</td>
        <td style="padding:6px 8px;text-align:center;color:#555;">${s.cleared}</td>
        <td style="padding:6px 8px;">
          <span style="color:${barColor};font-weight:bold;font-size:14px;">${failPct}%</span>
          <div style="background:#e0e0e0;height:5px;border-radius:3px;margin-top:3px;">
            <div style="background:${barColor};height:5px;border-radius:3px;width:${failPct}%;"></div>
          </div>
        </td>
      </tr>`;
    }
    html += `</tbody></table>`;
    if (list.length > showCount) {
      html += `<p style="color:#888;margin-top:8px;">（僅顯示前 ${showCount} 筆，共 ${list.length} 筆）</p>`;
    }
  }

  statsDisplay.style.display = "block";
  statsDisplay.innerHTML = html;

  document.getElementById("_statsShowAll")?.addEventListener("click", () => {
    statsFilterAbove50 = false;
    renderStatsDisplay();
  });
  document.getElementById("_statsShow50")?.addEventListener("click", () => {
    statsFilterAbove50 = true;
    renderStatsDisplay();
  });
}

// ── 立即載入：從 Google Sheets 載入失敗率 > 50% 的 word ──

let _loadedFailedWords = []; // 載入的失敗 word 列表

tapBind(loadFailedBtn, async () => {
  failedWordsArea.style.display = "block";
  failedWordsArea.innerHTML = '<p style="color:#666;">⏳ 正在從 Google Sheets 載入失敗率 &gt; 50% 的組合...</p>';
  loadFailedBtn.disabled = true;
  loadFailedBtn.textContent = "載入中...";
  try {
    const data = await fetchStatsFromSheets("failed50");
    if (!data.ok) throw new Error(data.error || "未知錯誤");
    _loadedFailedWords = (data.words || []).map(w => ({
      // display 格式：「中文提示,word1,word2,...」→ 取 word 部分作為 combo
      raw: w.display || w.comboKey || "",
      comboKey: w.comboKey || "",
      failRate: w.failRate || 0,
      appear: w.appear || 0,
      cleared: w.cleared || 0,
      // 單字模式：origRow 保留原始 2 欄格式（中文,德文），回填時優先使用
      origRow: w.origRow || "",
    }));
    if (_loadedFailedWords.length === 0) {
      failedWordsArea.innerHTML = '<p style="color:#2e7d32;font-weight:bold;">🎉 太棒了！沒有失敗率超過 50% 的組合。</p>';
      return;
    }
    renderFailedWords();
    setMessage(`✅ 已從 Google Sheets 載入 ${_loadedFailedWords.length} 組失敗率 > 50% 的單字。可手動移除不需要的，再按「儲存」生效。`, true);
  } catch (e) {
    const msg = e.message || "未知錯誤";
    const htmlMsg = escapeHtml(msg).replace(/\n/g, "<br>");
    failedWordsArea.innerHTML = `<p style="color:#c62828;white-space:pre-wrap;">❌ ${htmlMsg}</p>`;
  } finally {
    loadFailedBtn.disabled = false;
    loadFailedBtn.textContent = "立即載入";
  }
});

/** 將 _loadedFailedWords 項目轉成可用的 row 字串 */
function _failedWordToRow(w) {
  if (w.origRow) return normalizeRowString(w.origRow);
  const parts = w.raw.split(",");
  if (parts.length >= 2) return normalizeRowString(w.raw);
  return normalizeRowString(w.comboKey);
}

function renderFailedWords() {
  if (_loadedFailedWords.length === 0) {
    failedWordsArea.style.display = "none";
    return;
  }
  let html = `<div style="padding:10px 14px;background:#fff3e0;border-radius:8px;border:1px solid #ffe0b2;">`;
  html += `<div style="font-weight:bold;color:#e65100;margin-bottom:8px;">📥 已載入失敗率 &gt; 50% 的組合（${_loadedFailedWords.length} 組）</div>`;
  html += `<div style="font-size:12px;color:#888;margin-bottom:8px;">請先手動移除不需要的項目，再選擇「加入」或「取代」，最後按「儲存」生效。</div>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">`;
  html += `<button id="_addFailedToList" style="background:#e65100;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:13px;cursor:pointer;">全部加入單字列表</button>`;
  html += `<button id="_replaceFailedToList" style="background:#c62828;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:13px;cursor:pointer;">全部取代單字列表</button>`;
  html += `<button id="_clearFailed" style="background:#fff;color:#888;border:1px solid #ccc;padding:6px 14px;border-radius:6px;font-size:13px;cursor:pointer;">清除</button>`;
  html += `</div>`;
  html += `<div style="max-height:200px;overflow-y:auto;">`;
  for (let i = 0; i < _loadedFailedWords.length; i++) {
    const w = _loadedFailedWords[i];
    const failPct = (w.failRate * 100).toFixed(0);
    const barColor = w.failRate > 0.7 ? "#c62828" : "#e65100";
    // 優先用 origRow 顯示（單字模式下是原始 2 欄格式）
    const displayStr = w.origRow || w.raw;
    const parts = displayStr.split(",");
    let label;
    if (parts.length >= 2) {
      label = `<span style="color:#1565c0;font-weight:600;">${escapeHtml(parts.slice(1).join(", "))}</span>` +
              ` <span style="color:#888;font-size:11px;">(${escapeHtml(parts[0])})</span>`;
    } else {
      label = `<span style="color:#333;">${escapeHtml(displayStr)}</span>`;
    }
    html += `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f0f0f0;" data-failed-idx="${i}">
      <button class="_removeFailedItem" data-idx="${i}" style="background:none;border:1px solid #ccc;color:#c62828;border-radius:4px;padding:2px 8px;font-size:11px;cursor:pointer;">移除</button>
      ${label}
      <span style="margin-left:auto;color:${barColor};font-weight:bold;font-size:12px;">${failPct}%</span>
    </div>`;
  }
  html += `</div></div>`;

  failedWordsArea.innerHTML = html;

  // ── 「全部加入」按鈕：合併到現有單字列表 ──
  document.getElementById("_addFailedToList")?.addEventListener("click", () => {
    let added = 0;
    for (const w of _loadedFailedWords) {
      const wordRow = _failedWordToRow(w);
      if (!isValidRowString(wordRow)) continue;
      const normKey = wordRow.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
      const exists = displayRows.some(r => {
        const norm = r.text.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
        return norm === normKey;
      });
      if (!exists) {
        displayRows.push({ text: wordRow, source: "custom" });
        customRows.push(wordRow);
        customRowsFull.push(wordRow);
        added++;
      }
    }
    if (!customActive) {
      customActive = true;
      updateSourceUI();
    }
    saveCustomRowsFull();
    renderRows();
    _loadedFailedWords = [];
    failedWordsArea.style.display = "none";
    setMessage(`✅ 已合併 ${added} 組到單字列表。按「儲存」生效。`, true);
  });

  // ── 「全部取代」按鈕：用載入的字完全取代現有單字列表 ──
  document.getElementById("_replaceFailedToList")?.addEventListener("click", () => {
    const newCustomRows = [];
    for (const w of _loadedFailedWords) {
      const wordRow = _failedWordToRow(w);
      if (!isValidRowString(wordRow)) continue;
      // 去重
      const normKey = wordRow.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
      const exists = newCustomRows.some(r => {
        const norm = r.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).join(",");
        return norm === normKey;
      });
      if (!exists) newCustomRows.push(wordRow);
    }
    // 取代記憶體中的自定義列表
    customRows = [...newCustomRows];
    customRowsFull = [...newCustomRows];
    // 重建 displayRows：移除舊 custom，加入新的
    displayRows = displayRows.filter(r => r.source !== "custom");
    for (const w of newCustomRows) {
      displayRows.push({ text: w, source: "custom" });
    }
    if (!customActive) {
      customActive = true;
    }
    saveCustomRowsFull();
    updateSourceUI();
    renderRows();
    _loadedFailedWords = [];
    failedWordsArea.style.display = "none";
    setMessage(`🔄 已用 ${newCustomRows.length} 組取代整個自定義單字列表。按「儲存」生效。`, true);
  });

  // ── 「清除」按鈕 ──
  document.getElementById("_clearFailed")?.addEventListener("click", () => {
    _loadedFailedWords = [];
    failedWordsArea.style.display = "none";
  });

  // ── 個別「移除」按鈕（事件代理） ──
  failedWordsArea.addEventListener("click", (e) => {
    const btn = e.target.closest("._removeFailedItem");
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if (idx >= 0 && idx < _loadedFailedWords.length) {
      _loadedFailedWords.splice(idx, 1);
      renderFailedWords();
    }
  });
}

// ── 清除統計 ──

tapBind(clearStatsBtn, () => {
  if (confirm("確定要清除所有學習統計資料嗎？此操作無法還原。\n（僅清除本機資料，Google Sheets 資料不受影響）")) {
    localStorage.removeItem(STATS_KEY);
    statsDisplay.style.display = "none";
    _cachedSheetStats = null;
    setMessage("已清除本機統計資料。", true);
  }
});

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── 綁定事件 ──
tapBind(addBtn, addRow);
tapBind(saveBtn, saveRows);
tapBind(resetBtn, resetDefault);
newRowInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addRow();
});

// 群組按鈕綁定
groupBtns.forEach(btn => {
  tapBind(btn, () => {
    const gi = parseInt(btn.dataset.group, 10);
    toggleGroup(gi);
  });
});
// 自定義按鈕綁定
tapBind(customSourceBtn, toggleCustom);
// 單字模式按鈕綁定
tapBind(singleWordModeBtn, toggleSingleWordMode);
// 拆分模式按鈕綁定
splitModeBtns.forEach(btn => {
  tapBind(btn, () => {
    splitMode = btn.dataset.split;
    updateSourceUI();
    setMessage(`拆分模式已切換為「${
      splitMode === "syllable" ? "音節拆分" :
      splitMode === "random" ? "隨機拆分" : "混合"
    }」，按「儲存」生效。`);
  });
});

// ── 初始化 ──
preventZoom();
pickCountInput.value = pickCount;
debugToggle.checked = localStorage.getItem(DEBUG_KEY) === "1";
autoRemoveToggle.checked = localStorage.getItem(AUTO_REMOVE_KEY) === "1";

const _savedLens = loadAllowedLens();
len2Toggle.checked = _savedLens.includes(2);
len3Toggle.checked = _savedLens.includes(3);
len4Toggle.checked = _savedLens.includes(4);
len5Toggle.checked = _savedLens.includes(5);

// 根據已存的狀態建立 displayRows
buildDisplayRows();
updateSourceUI();
renderRows();

