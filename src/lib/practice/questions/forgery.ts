import type { ForgeryQuestion } from '@/types/practice';

// 43 forgery questions across three difficulty levels.
// Each presents one genuine text and one AI-generated fake in the same language.
// Players identify which is real.
// Fakes use invented words or impossible phonotactic/character patterns —
// not grammatical errors — so no language knowledge is required.
// Invariant: answer === realText

export const FORGERY_QUESTIONS: ForgeryQuestion[] = [
  // ── EASY — familiar Latin-script languages ────────────────────────────────

  {
    id: 'fo-001',
    difficulty: 1,
    type: 'forgery',
    language: 'Finnish',
    script: 'Latin',
    region: 'europe',
    realText: 'Ystäväni tulee huomenna.',
    fakeText: 'Yrlävivä tellegs ragätä.',
    options: [],
    answer: 'Ystäväni tulee huomenna.',
    explanation:
      'The real sentence is authentic Finnish. The fake sentence contains several invented words that do not belong to Finnish vocabulary.',
  },

  {
    id: 'fo-002',
    difficulty: 1,
    type: 'forgery',
    language: 'Spanish',
    script: 'Latin',
    region: 'europe',
    realText: 'El pájaro canta en el árbol.',
    fakeText: 'El comisete está planzada.',
    options: [],
    answer: 'El pájaro canta en el árbol.',
    explanation:
      'The real sentence is authentic Spanish. The fake sentence contains multiple invented words.',
  },

  {
    id: 'fo-003',
    difficulty: 1,
    type: 'forgery',
    language: 'Italian',
    script: 'Latin',
    region: 'europe',
    realText: 'Ho bisogno di aiuto, per favore.',
    fakeText: 'Ho brastino di zalupo, per gronavi.',
    options: [],
    answer: 'Ho bisogno di aiuto, per favore.',
    explanation:
      'The real sentence is authentic Italian. The fake sentence contains several invented words.',
  },

  {
    id: 'fo-004',
    difficulty: 1,
    type: 'forgery',
    language: 'German',
    script: 'Latin',
    region: 'europe',
    realText: 'Ich spreche ein bisschen Deutsch.',
    fakeText: 'Ich jelken ein dischen und weiner.',
    options: [],
    answer: 'Ich spreche ein bisschen Deutsch.',
    explanation:
      'The real sentence is authentic German. The fake sentence contains several invented words.',
  },

  {
    id: 'fo-005',
    difficulty: 1,
    type: 'forgery',
    language: 'French',
    script: 'Latin',
    region: 'europe',
    realText: 'Le chat dort sur le canapé.',
    fakeText: 'Le chat et chatlet fromagé.',
    options: [],
    answer: 'Le chat dort sur le canapé.',
    explanation:
      'The real sentence is authentic French. The fake sentence contains several invented words.',
  },

  {
    id: 'fo-006',
    difficulty: 1,
    type: 'forgery',
    language: 'Swedish',
    script: 'Latin',
    region: 'europe',
    realText: 'Vad kostar det?',
    fakeText: 'Hej, wet keppen vildgås på mig.',
    options: [],
    answer: 'Vad kostar det?',
    explanation:
      'The real sentence is authentic Swedish. The fake sentence contains invented words.',
  },

  {
    id: 'fo-007',
    difficulty: 1,
    type: 'forgery',
    language: 'Portuguese',
    script: 'Latin',
    region: 'europe',
    realText: 'Obrigado pela sua ajuda.',
    fakeText: 'Hola mis filhos grazie a la ayudarte.',
    options: [],
    answer: 'Obrigado pela sua ajuda.',
    explanation:
      'The real sentence is authentic Portuguese. The fake sentence contains invented vocabulary.',
  },

  {
    id: 'fo-008',
    difficulty: 1,
    type: 'forgery',
    language: 'Dutch',
    script: 'Latin',
    region: 'europe',
    realText: 'Ik wil een kopje thee bestellen.',
    fakeText: 'Die woolersprager je een appelfest.',
    options: [],
    answer: 'Ik wil een kopje thee bestellen.',
    explanation:
      'The real sentence is authentic Dutch. The fake sentence contains several invented words.',
  },

  {
    id: 'fo-009',
    difficulty: 2,
    type: 'forgery',
    language: 'Turkish',
    script: 'Latin',
    region: 'west_asia_north_africa',
    realText: 'Bugün hava çok güzel.',
    fakeText: 'Selam jürdü oğlu sempa güzük merti.',
    options: [],
    answer: 'Bugün hava çok güzel.',
    explanation:
      'The real sentence is authentic Turkish. The fake sentence contains invented words.',
  },

  {
    id: 'fo-010',
    difficulty: 2,
    type: 'forgery',
    language: 'Welsh',
    script: 'Latin',
    region: 'europe',
    realText: "Mae'n bwrw glaw heddiw.",
    fakeText: 'Wyll wenn garbaur hiura.',
    options: [],
    answer: "Mae'n bwrw glaw heddiw.",
    explanation: 'The real sentence is authentic Welsh. The fake sentence contains invented words.',
  },

  {
    id: 'fo-011',
    difficulty: 2,
    type: 'forgery',
    language: 'Polish',
    script: 'Latin',
    region: 'europe',
    realText: 'Przepraszam, gdzie jest dworzec?',
    fakeText: 'Zdravo jemczeta halaczezny prczezna',
    options: [],
    answer: 'Przepraszam, gdzie jest dworzec?',
    explanation:
      'The real sentence is authentic Polish. The fake sentence contains invented words.',
  },

  {
    id: 'fo-012',
    difficulty: 2,
    type: 'forgery',
    language: 'Hungarian',
    script: 'Latin',
    region: 'europe',
    realText: 'Hol van a legközelebbi patika?',
    fakeText: 'Maled olvasjat a vajat.',
    options: [],
    answer: 'Hol van a legközelebbi patika?',
    explanation:
      'The real sentence is authentic Hungarian. The fake sentence contains invented words.',
  },

  {
    id: 'fo-015',
    difficulty: 2,
    type: 'forgery',
    language: 'Swahili',
    script: 'Latin',
    region: 'sub_saharan_africa',
    realText: 'Mimi ni mwalimu wa Kiswahili.',
    fakeText: 'Me afrika falundo wa Kisabuli.',
    options: [],
    answer: 'Mimi ni mwalimu wa Kiswahili.',
    explanation:
      'The real sentence is authentic Swahili. The fake sentence contains invented words.',
  },

  {
    id: 'fo-016',
    difficulty: 2,
    type: 'forgery',
    language: 'Vietnamese',
    script: 'Latin (tonal diacritics)',
    region: 'southeast_asia',
    realText: 'Tôi muốn đặt phòng khách sạn.',
    fakeText: 'Họ phở đặt lương khép phòng.',
    options: [],
    answer: 'Tôi muốn đặt phòng khách sạn.',
    explanation:
      'The real sentence is authentic Vietnamese. The fake sentence contains invented words.',
  },

  {
    id: 'fo-017',
    difficulty: 2,
    type: 'forgery',
    language: 'Indonesian',
    script: 'Latin',
    region: 'southeast_asia',
    realText: 'Bali adalah pulau yang sangat indah.',
    fakeText: 'Bali palau trinal yang peradan merdu.',
    options: [],
    answer: 'Bali adalah pulau yang sangat indah.',
    explanation:
      'The real sentence is authentic Indonesian. The fake sentence contains invented words.',
  },

  {
    id: 'fo-037',
    difficulty: 1,
    type: 'forgery',
    language: 'Danish',
    script: 'Latin',
    region: 'europe',
    realText: 'Jeg vil gerne have en kop kaffe.',
    fakeText: 'Je vell greene havor en plof koffee.',
    options: [],
    answer: 'Jeg vil gerne have en kop kaffe.',
    explanation:
      'The real sentence is authentic Danish. The fake sentence contains invented words.',
  },

  {
    id: 'fo-039',
    difficulty: 1,
    type: 'forgery',
    language: 'Romanian',
    script: 'Latin',
    region: 'europe',
    realText: 'Bună ziua, cum vă numiți?',
    fakeText: 'Bună eu, imens vă gronec?',
    options: [],
    answer: 'Bună ziua, cum vă numiți?',
    explanation:
      'The real sentence is authentic Romanian. The fake sentence contains invented words.',
  },

  // ── MEDIUM — less familiar languages ─────────────────────────────────────

  {
    id: 'fo-044',
    difficulty: 2,
    type: 'forgery',
    language: 'Welsh',
    script: 'Latin',
    region: 'europe',
    realText: "Mae'n bwrw glaw heddiw.",
    fakeText: "Mae'n burwo glaw heddyw.",
    options: [],
    answer: "Mae'n bwrw glaw heddiw.",
    explanation:
      '"Mae\'n bwrw glaw heddiw" means "It is raining today." Welsh "bwrw" (throwing/falling) is a genuine verb — the cluster bwr is valid in Welsh. The fake "burwo" transposes w into the syllable nucleus, which is not how Welsh syllables are built. "Heddiw" (today) ends in -w functioning as a vowel; "heddyw" inserts y before the final w, which does not occur in this word.',
  },

  {
    id: 'fo-045',
    difficulty: 2,
    type: 'forgery',
    language: 'Hungarian',
    script: 'Latin',
    region: 'europe',
    realText: 'Hol van a legközelebbi patika?',
    fakeText: 'Hol van a legközelebbi patiga?',
    options: [],
    answer: 'Hol van a legközelebbi patika?',
    explanation:
      '"Hol van a legközelebbi patika?" means "Where is the nearest pharmacy?" "Patika" (pharmacy) ends in -ka, a standard Hungarian suffix pattern. The fake changes k to g, producing "patiga" — not a Hungarian word. While k→g substitutions look subtle, "patiga" is not a word in Hungarian and produces a wrong-sounding combination for any Hungarian speaker.',
  },

  {
    id: 'fo-013',
    difficulty: 2,
    type: 'forgery',
    language: 'Japanese',
    script: 'Hiragana/Kanji',
    region: 'east_asia',
    realText: 'ありがとうございます。',
    fakeText: 'ありがとうごいざます。',
    options: [],
    answer: 'ありがとうございます。',
    explanation:
      '"ありがとうございます" means "Thank you very much." "ございます" (gozaimasu) is a fixed polite word whose character sequence is standardized — ご・ざ・い・ま・す. The fake scrambles it to "ごいざます," transposing ざ and い. Japanese words are built from fixed syllable sequences, and any transposition immediately breaks the pattern a native speaker recognizes, even if the individual characters look the same.',
  },

  {
    id: 'fo-014',
    difficulty: 2,
    type: 'forgery',
    language: 'Korean',
    script: 'Hangul',
    region: 'east_asia',
    realText: '서울은 아름다운 도시입니다.',
    fakeText: '서울은 아릅다운 도시임니다.',
    options: [],
    answer: '서울은 아름다운 도시입니다.',
    explanation:
      '"서울은 아름다운 도시입니다" means "Seoul is a beautiful city." "아름다운" (beautiful) uses ㅁ (m) in the syllable "름." The fake writes "아릅다운" with ㅂ (b/p) instead, producing a non-word. "입니다" (formal sentence ending) has ㅂ in its first syllable; the fake "임니다" puts ㅁ there — a wrong character in both directions. These substitutions produce impossible Korean word shapes.',
  },

  {
    id: 'fo-046',
    difficulty: 2,
    type: 'forgery',
    language: 'Swahili',
    script: 'Latin',
    region: 'sub_saharan_africa',
    realText: 'Mimi ni mwalimu wa Kiswahili.',
    fakeText: 'Mimi ni mwalibu wa Kiswahara.',
    options: [],
    answer: 'Mimi ni mwalimu wa Kiswahili.',
    explanation:
      '"Mimi ni mwalimu wa Kiswahili" means "I am a Swahili teacher." "Mwalimu" (teacher) is a genuine Swahili word — "mwalibu" replaces the -mu ending with -bu, which breaks the derivational pattern. In Swahili, languages are named with the Ki- prefix — "Kiswahili" is correct; "Kiswahara" is an invented name that follows no Swahili naming convention.',
  },

  {
    id: 'fo-047',
    difficulty: 2,
    type: 'forgery',
    language: 'Vietnamese',
    script: 'Latin (tonal diacritics)',
    region: 'southeast_asia',
    realText: 'Tôi muốn đặt phòng khách sạn.',
    fakeText: 'Tôi muốn đặt phộng khách sạm.',
    options: [],
    answer: 'Tôi muốn đặt phòng khách sạn.',
    explanation:
      '"Tôi muốn đặt phòng khách sạn" means "I want to book a hotel room." Vietnamese tonal diacritics determine meaning entirely — each mark is a different word. "Phòng" (room) uses the huyền tone mark; "phộng" uses the nặng mark, which is a completely different syllable. "Sạn" (in "khách sạn," hotel) ends in n; "sạm" replaces the final consonant with m, which cannot close this syllable in Vietnamese.',
  },

  {
    id: 'fo-048',
    difficulty: 2,
    type: 'forgery',
    language: 'Indonesian',
    script: 'Latin',
    region: 'southeast_asia',
    realText: 'Bali adalah pulau yang sangat indah.',
    fakeText: 'Bali adalah pulau yang sanyat indak.',
    options: [],
    answer: 'Bali adalah pulau yang sangat indah.',
    explanation:
      '"Bali adalah pulau yang sangat indah" means "Bali is a very beautiful island." "Sangat" (very) and "indah" (beautiful) are core Indonesian vocabulary. The fake changes "sangat" to "sanyat" — not an Indonesian word — and "indah" to "indak," which does not exist. Indonesian words ending in -dah are common; -dak in this position is not. The fake looks superficially similar but uses letter patterns that don\'t produce real Indonesian words.',
  },

  // ── HARD — non-Latin scripts and subtle visual differences ────────────────

  {
    id: 'fo-018',
    difficulty: 3,
    type: 'forgery',
    language: 'Georgian',
    script: 'Georgian (Mkhedruli)',
    region: 'west_asia_north_africa',
    realText: 'გამარჯობა, როგორ ხარ?',
    fakeText: 'გამარჯობა, როღარ ხარ?',
    options: [],
    answer: 'გამარჯობა, როგორ ხარ?',
    explanation:
      '"გამარჯობა, როგორ ხარ?" means "Hello, how are you?" "როგორ" (how) uses გ (g, a voiced velar stop). The fake substitutes ღ (gh, a voiced uvular fricative) for გ and drops the second syllable, producing "როღარ" — a non-word. Georgian has a large and distinctive consonant inventory; გ and ღ look similar but represent different sounds, making the fake visually subtle but linguistically impossible.',
  },

  {
    id: 'fo-019',
    difficulty: 3,
    type: 'forgery',
    language: 'Basque',
    script: 'Latin',
    region: 'europe',
    realText: 'Mesedez, non dago autobus geltokia?',
    fakeText: 'Mesedez, non dago autobus geltogida?',
    options: [],
    answer: 'Mesedez, non dago autobus geltokia?',
    explanation:
      '"Mesedez, non dago autobus geltokia?" means "Please, where is the bus stop?" Basque is a language isolate — unrelated to any other language family. "Geltokia" (the stop/station) combines the root "geltoki" with the definite article -a. The fake "geltogida" replaces k with g, changes the vowel, and appends -ida — a suffix with no function in Basque morphology. The resulting word follows no Basque pattern.',
  },

  {
    id: 'fo-020',
    difficulty: 3,
    type: 'forgery',
    language: 'Arabic',
    script: 'Arabic (right to left)',
    region: 'west_asia_north_africa',
    realText: 'أنا بخير، شكراً لك.',
    fakeText: 'أنا بحير، شكراً لك.',
    options: [],
    answer: 'أنا بخير، شكراً لك.',
    explanation:
      '"أنا بخير، شكراً لك" means "I am fine, thank you." "بخير" (bi-khayr, in well-being) uses خ (kha, voiceless velar fricative). The fake replaces it with ح (ha, voiceless pharyngeal fricative), producing "بحير" — not a standard Arabic expression. The letters خ and ح have the same base shape and differ only by a dot, making this a visually plausible but meaningless substitution.',
  },

  {
    id: 'fo-021',
    difficulty: 3,
    type: 'forgery',
    language: 'Russian',
    script: 'Cyrillic',
    region: 'europe',
    realText: 'Санкт-Петербург — красивый город.',
    fakeText: 'Санкт-Петербург — красипый горот.',
    options: [],
    answer: 'Санкт-Петербург — красивый город.',
    explanation:
      '"Санкт-Петербург — красивый город" means "Saint Petersburg is a beautiful city." "Красивый" (beautiful) and "город" (city) are fundamental Russian words. The fake substitutes В (v) with П (p) in "красипый" and changes final Д (d) in "город" to Т (t), creating "горот" — a non-word. In Cyrillic, В and П can look similar to untrained readers, making this a visually subtle but linguistically impossible substitution.',
  },

  {
    id: 'fo-022',
    difficulty: 3,
    type: 'forgery',
    language: 'Thai',
    script: 'Thai',
    region: 'southeast_asia',
    realText: 'วันนี้อากาศดีมาก',
    fakeText: 'วันนี้อาษาสดีมาก',
    options: [],
    answer: 'วันนี้อากาศดีมาก',
    explanation:
      '"วันนี้อากาศดีมาก" means "Today the weather is very good." "อากาศ" (weather/atmosphere) uses ก (k) and ศ (a Thai s-class consonant). The fake "อาษาส" substitutes ษ (another s-class consonant) for ก and rearranges the consonants, producing a sequence that does not form the Thai word for weather. Thai orthography precisely specifies which consonant class appears in each word, making these substitutions immediately wrong to any Thai reader.',
  },

  {
    id: 'fo-023',
    difficulty: 3,
    type: 'forgery',
    language: 'Amharic',
    script: "Ethiopic (Ge'ez)",
    region: 'sub_saharan_africa',
    realText: 'እንደምን ነዎት?',
    fakeText: 'እንደምን ናዎት?',
    options: [],
    answer: 'እንደምን ነዎት?',
    explanation:
      '"እንደምን ነዎት?" means "How are you?" (formal). Amharic uses an abugida where each character encodes a consonant-vowel pair. "ነዎት" uses ነ (ne). The fake changes ነ to ና (na) — altering the vowel of the key word from -e to -a, producing "ናዎት," which is not a standard Amharic expression. To readers unfamiliar with Ethiopic script, ነ and ና look nearly identical.',
  },

  {
    id: 'fo-024',
    difficulty: 3,
    type: 'forgery',
    language: 'Icelandic',
    script: 'Latin (with þ and ð)',
    region: 'europe',
    realText: 'Hvernig líður þér?',
    fakeText: 'Hvernig lidur þer?',
    options: [],
    answer: 'Hvernig líður þér?',
    explanation:
      '"Hvernig líður þér?" means "How are you?" Icelandic preserves Old Norse orthography with long vowels marked by accents. "Líður" (goes/passes) has a long í; "lidur" with plain i and u is not the same word. "Þér" uses the letter þ (thorn) — unique to Icelandic among living languages — and an accent on é. "þer" drops both the accent and uses a bare e, producing a non-standard form. Spotting þ and accented vowels is the fastest visual marker of authentic Icelandic text.',
  },

  {
    id: 'fo-025',
    difficulty: 3,
    type: 'forgery',
    language: 'Tamil',
    script: 'Tamil',
    region: 'south_asia',
    realText: 'சென்னை ஒரு பெரிய நகரம்.',
    fakeText: 'வணக்கம் ்கமநீற்றுங்கற்ள் அவங்கற்று.',
    options: [],
    answer: 'சென்னை ஒரு பெரிய நகரம்.',
    explanation:
      '"சென்னை ஒரு பெரிய நகரம்" means "Chennai is a large city." "பெரிய" (large) ends in ய (ya) and "நகரம்" (city) ends in ம் (anusvara m). The fake changes ய to க in "பெரிக" and ம் to ப் in "நகரப்" — neither combination produces a Tamil word. Tamil word endings follow strict phonological patterns and these substitutions immediately read as non-Tamil to any speaker of the language.',
  },

  {
    id: 'fo-026',
    difficulty: 3,
    type: 'forgery',
    language: 'Telugu',
    script: 'Telugu',
    region: 'south_asia',
    realText: 'హైదరాబాద్ ఒక అందమైన నగరం.',
    fakeText: 'హైదరాబాద్ పులిఅంతేరాగు లోటు.',
    options: [],
    answer: 'హైదరాబాద్ ఒక అందమైన నగరం.',
    explanation:
      '"హైదరాబాద్ ఒక అందమైన నగరం" means "Hyderabad is a beautiful city." The other sentence contains "పులి," which means "tiger," but the overall sentence is nonsense.',
  },

  {
    id: 'fo-027',
    difficulty: 3,
    type: 'forgery',
    language: 'Kannada',
    script: 'Kannada',
    region: 'south_asia',
    realText: 'ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ.',
    fakeText: 'ಬೆಳಗೆ ಔಷದಿ ಅಗೋಧು.',
    options: [],
    answer: 'ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ.',
    explanation:
      '"ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ" means "Bengaluru is the capital of Karnataka" — an actual sentence. The fake is an unrelated string of words ("ಬೆಳಗೆ" morning, "ಔಷದಿ" medicine, "ಅಗೋಧು" not a real word) that does not form a coherent Kannada sentence.',
  },

  {
    id: 'fo-028',
    difficulty: 3,
    type: 'forgery',
    language: 'Malayalam',
    script: 'Malayalam',
    region: 'south_asia',
    realText: 'കൊച്ചി ഒരു തുറമുഖ നഗരം ആണ്.',
    fakeText: 'ആലയം തേൻകുഴൽ ഗാർക്‌നെ',
    options: [],
    answer: 'കൊച്ചി ഒരു തുറമുഖ നഗരം ആണ്.',
    explanation:
      '"കൊച്ചി ഒരു തുറമുഖ നഗരം ആണ്" means "Kochi is a port city." The fake substitutes ഛ (chha) for ച (cha) in the city name, producing "കൊഛ്ചി" — a wrong character. It also changes the short vowel ഉ to the long ഊ in "തൂറ" and "മൂഖ" — "തുറ" means harbor/port while "തൂറ" is a different word entirely. Malayalam distinguishes short and long vowels with separate diacritic characters, and these substitutions produce non-existent words.',
  },

  {
    id: 'fo-029',
    difficulty: 2,
    type: 'forgery',
    language: 'Hindi',
    script: 'Devanagari',
    region: 'south_asia',
    realText: 'दिल्ली भारत की राजधानी है।',
    fakeText: 'ताज़ाॐ नमस्ते तरबूजूली है।',
    options: [],
    answer: 'दिल्ली भारत की राजधानी है।',
    explanation:
      '"दिल्ली भारत की राजधानी है" means "Delhi is India\'s capital." "भारत" (India) ends in त (ta) — the fake changes it to ब (ba), producing "भारब," which is not a word. "राजधानी" (capital) ends in ी (long i vowel sign) — the fake replaces it with क (ka), a consonant, producing "राजधानक." In Devanagari, consonants cannot end words this way without a halant mark, making "राजधानक" an obviously wrong form.',
  },

  {
    id: 'fo-030',
    difficulty: 3,
    type: 'forgery',
    language: 'Urdu',
    script: 'Nastaliq (Arabic-based, right to left)',
    region: 'south_asia',
    realText: 'لاہور پاکستان کا خوبصورت شہر ہے۔',
    fakeText: 'شیر خان رضا لاہوری۔',
    options: [],
    answer: 'لاہور پاکستان کا خوبصورت شہر ہے۔',
    explanation:
      '"لاہور پاکستان کا خوبصورت شہر ہے" means "Lahore is a beautiful city of Pakistan." "پاکستان" (Pakistan) and "خوبصورت" (beautiful) are widely recognized words. The fake replaces ت (ta) with ب (ba) in both, producing "پاکسبان" and "خوبصوبت" — neither is a real word. In Nastaliq script, ت and ب use similar base shapes and differ primarily by dot placement, making this a visually subtle but immediately wrong substitution.',
  },

  {
    id: 'fo-031',
    difficulty: 3,
    type: 'forgery',
    language: 'Persian',
    script: 'Nastaliq (Arabic-based, right to left)',
    region: 'west_asia_north_africa',
    realText: 'تهران پایتخت ایران است.',
    fakeText: 'ترضا تضاف فلنج استاد من خرم',
    options: [],
    answer: 'تهران پایتخت ایران است.',
    explanation:
      '"تهران پایتخت ایران است" means "Tehran is the capital of Iran." "پایتخت" (capital) and "ایران" (Iran) are foundational Persian words. The fake replaces ت (ta) with ب (ba) in both, producing "پایبخت" and "ایبان" — neither is a Persian word. In Nastaliq script ت and ب share a similar base form, making the substitution visually plausible but linguistically obvious to any Persian reader.',
  },

  // ── South Asia (additional) ──────────────────────────────────────────────

  {
    id: 'fo-032',
    difficulty: 3,
    type: 'forgery',
    language: 'Bengali',
    script: 'Bengali',
    region: 'south_asia',
    realText: 'ঢাকা বাংলাদেশের রাজধানী।',
    fakeText: 'ঢাকা সুবর্ণ বার্ষিষ্ট গার্বাহ।',
    options: [],
    answer: 'ঢাকা বাংলাদেশের রাজধানী।',
    explanation:
      '"ঢাকা বাংলাদেশের রাজধানী" means "Dhaka is the capital of Bangladesh." "বাংলাদেশ" (Bangladesh) contains শ (sha) — the fake writes বাংলাদেস with স (sa) instead, a different sibilant. "রাজধানী" (capital) ends in ী (long i) — the fake replaces it with ক (ka), a consonant that cannot end this word. Bengali has two distinct s-letters (শ and স), and substituting them is an immediate error to any Bengali reader.',
  },

  {
    id: 'fo-033',
    difficulty: 3,
    type: 'forgery',
    language: 'Gujarati',
    script: 'Gujarati',
    region: 'south_asia',
    realText: 'અમદાવાદ ગુજરાતની રાજધાની છે.',
    fakeText: 'હમેદાબાદ બોરીસહરલા ખાઓ છીએ.',
    options: [],
    answer: 'અમદાવાદ ગુજરાતની રાજધાની છે.',
    explanation:
      '"અમદાવાદ ગુજરાતની રાજધાની છે" means "Ahmedabad is the capital of Gujarat." "ગુ" uses a short u vowel marker (ુ); the fake "ગૂ" uses the long u marker (ૂ) — a different character that changes the syllable. "છે" (is, copula) loses its vowel marker in the fake, becoming the bare consonant "છ" — which cannot stand alone at this position in Gujarati. Gujarati vowel markers look similar but are phonologically distinct.',
  },

  {
    id: 'fo-034',
    difficulty: 3,
    type: 'forgery',
    language: 'Marathi',
    script: 'Devanagari',
    region: 'south_asia',
    realText: 'मुंबई महाराष्ट्राची राजधानी आहे.',
    fakeText: 'आहुल अर्धनायर नाकरी अहेनर् अनुस्वार्ध.',
    options: [],
    answer: 'मुंबई महाराष्ट्राची राजधानी आहे.',
    explanation:
      '"मुंबई महाराष्ट्राची राजधानी आहे" means "Mumbai is Maharashtra\'s capital." "राजधानी" ends in ी (long i vowel sign) — the fake drops it, leaving the bare "राजधान" without a proper word ending. "आहे" (is) ends in ए (e) — the fake changes it to व (va), producing "आहव," which is not a Marathi word. Missing or wrong vowel signs produce immediately unrecognizable forms in Devanagari.',
  },

  {
    id: 'fo-035',
    difficulty: 3,
    type: 'forgery',
    language: 'Punjabi',
    script: 'Gurmukhi',
    region: 'south_asia',
    realText: 'ਅੰਮ੍ਰਿਤਸਰ ਇੱਕ ਪਵਿੱਤਰ ਸ਼ਹਿਰ ਹੈ।',
    fakeText: 'ਤਾਤੀ ਪੁਰਾ ਕਰਨ ਚੁਆ ਖੇਡ ਹੈ।',
    options: [],
    answer: 'ਅੰਮ੍ਰਿਤਸਰ ਇੱਕ ਪਵਿੱਤਰ ਸ਼ਹਿਰ ਹੈ।',
    explanation:
      '"ਅੰਮ੍ਰਿਤਸਰ ਇੱਕ ਪਵਿੱਤਰ ਸ਼ਹਿਰ ਹੈ" means "Amritsar is a holy city." "ਪਵਿੱਤਰ" (holy) ends in ਰ (ra) and "ਸ਼ਹਿਰ" (city) also ends in ਰ. The fake replaces both final ਰ with ਬ (ba), producing "ਪਵਿੱਤਬ" and "ਸ਼ਹਿਬ" — neither is a Punjabi word. In Gurmukhi, ਰ (ra) and ਬ (ba) have somewhat similar shapes, making this substitution visually subtle but linguistically obvious.',
  },

  {
    id: 'fo-036',
    difficulty: 3,
    type: 'forgery',
    language: 'Sindhi',
    script: 'Perso-Arabic',
    region: 'south_asia',
    realText: 'ڪراچي پاڪستان جو سڀ کان وڏو شهر آهي.',
    fakeText: 'ڪتاتی پورا کارن چوا خیل سیرف',
    options: [],
    answer: 'ڪراچي پاڪستان جو سڀ کان وڏو شهر آهي.',
    explanation:
      '"ڪراچي پاڪستان جو سڀ کان وڏو شهر آهي" means "Karachi is Pakistan\'s largest city." The fake changes ت (ta) to ب (ba) in "پاڪسبان" and ر (ra) to ب (ba) in "وڏب" — creating non-words. In Sindhi Nastaliq, certain letter forms share similar base shapes, and incorrect substitutions produce words that no Sindhi speaker would recognize. Sindhi uses unique extended Arabic letters (like ڪ and ڏ) for sounds absent in standard Arabic.',
  },

  // ── Europe (additional) ──────────────────────────────────────────────────

  {
    id: 'fo-038',
    difficulty: 2,
    type: 'forgery',
    language: 'Greek',
    script: 'Greek',
    region: 'europe',
    realText: 'Το ελληνικό φαγητό είναι πολύ νόστιμο.',
    fakeText: 'Tο ελληνκά ακροπολιο αθήνα φερος μελόνιος.',
    options: [],
    answer: 'Το ελληνικό φαγητό είναι πολύ νόστιμο.',
    explanation:
      '"Το ελληνικό φαγητό είναι πολύ νόστιμο" means "Greek food is very delicious." "Φαγητό" (food) contains the sequence ητ — the fake reverses this to ιτ, producing "φαγιτό," which is not a Greek word. "Νόστιμο" (delicious) has an intervocalic μ; "νόστριμο" inserts ρ between τ and ι, creating the cluster τρι that cannot appear in this word. Both substitutions produce visually Greek-looking but meaningless sequences.',
  },

  // ── Africa (additional) ───────────────────────────────────────────────────

  {
    id: 'fo-040',
    difficulty: 2,
    type: 'forgery',
    language: 'Zulu',
    script: 'Latin',
    region: 'sub_saharan_africa',
    realText: 'Ngiyabonga kakhulu ngosizo lwakho.',
    fakeText: 'Ngyiyamu bolulafo ngozulu ngulu.',
    options: [],
    answer: 'Ngiyabonga kakhulu ngosizo lwakho.',
    explanation:
      '"Ngiyabonga kakhulu ngosizo lwakho" means "Thank you very much for your help." Zulu word endings follow highly regular Bantu patterns. "Ngiyabonga" ends in -a, not -e; "kakhulu" ends in -ulu, not -ule; "ngosizo" ends in -izo, not -iso. The fake\'s substitutions produce non-existent words at every turn. Zulu as a Bantu language has consistent final vowel patterns, and deviating from them creates immediately unrecognizable forms.',
  },

  {
    id: 'fo-041',
    difficulty: 1,
    type: 'forgery',
    language: 'Afrikaans',
    script: 'Latin',
    region: 'sub_saharan_africa',
    realText: 'Die see is baie mooi vandag.',
    fakeText: 'Die is thee vendee.',
    options: [],
    answer: 'Die see is baie mooi vandag.',
    explanation:
      '"Die see is baie mooi vandag" means "The sea is very beautiful today." Afrikaans and Dutch share roots but have distinct spellings. "See" (sea) is Afrikaans — Dutch spells it "zee." "Vandag" (today) is Afrikaans — Dutch spells it "vandaag" (with double-a). The fake uses Dutch spellings for both words, producing text that looks like Afrikaans at a glance but follows Dutch orthographic conventions throughout. Spotting see/zee and vandag/vandaag is a reliable visual tell between the two languages.',
  },

  // ── East Asia (additional) ────────────────────────────────────────────────

  {
    id: 'fo-042',
    difficulty: 2,
    type: 'forgery',
    language: 'Mandarin Chinese',
    script: 'Simplified Chinese (Hanzi)',
    region: 'east_asia',
    realText: '上海是中国最大的城市之一。',
    fakeText: '上火上女人目的市肾一。',
    options: [],
    answer: '上海是中国最大的城市之一。',
    explanation:
      '"上海是中国最大的城市之一" means "Shanghai is one of China\'s largest cities." "城市" (chéngshì, city) is a fixed two-character compound — 城 (city/town) + 市 (market). The fake reverses this to "市城," which is not a standard Chinese word. Chinese compound words have a fixed character order determined by meaning and usage; reversing them breaks the compound entirely, even though both individual characters are unchanged.',
  },

  {
    id: 'fo-043',
    difficulty: 3,
    type: 'forgery',
    language: 'Cantonese',
    script: 'Traditional Chinese (Hanzi)',
    region: 'east_asia',
    realText: '我今日喺屋企食飯。',
    fakeText: 'だ今目喺甜企食甜。',
    options: [],
    answer: '我今日喺屋企食飯。',
    explanation:
      '"我今日喺屋企食飯" is Cantonese for "I ate at home today." Several characters mark this as Cantonese: "喺" (hai2, at/in — not used in written Mandarin) and "屋企" (uk1kei2, home — a colloquial Cantonese compound). The fake changes 日 (jat6, day/sun) to 目 (muk6, eye) in "今日" (today), producing "今目" — not a word in any Chinese variety. The characters 日 and 目 look nearly identical: both are rectangular boxes divided by horizontal lines, differing only in the number of internal strokes.',
  },
];
