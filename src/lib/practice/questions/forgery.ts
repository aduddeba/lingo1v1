import type { ForgeryQuestion } from '@/types/practice';

// Forgery questions across three difficulty levels.
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
    fakeText: 'Yrkälöö zzz-vanta kõõmna.',
    options: [],
    answer: 'Ystäväni tulee huomenna.',
    explanation:
      'The real sentence is authentic Finnish. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-002',
    difficulty: 1,
    type: 'forgery',
    language: 'Spanish',
    script: 'Latin',
    region: 'europe',
    realText: 'El pájaro canta en el árbol.',
    fakeText: 'Ñalo brujísimo xqz en árbolito.',
    options: [],
    answer: 'El pájaro canta en el árbol.',
    explanation:
      'The real sentence is authentic Spanish. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-003',
    difficulty: 1,
    type: 'forgery',
    language: 'Italian',
    script: 'Latin',
    region: 'europe',
    realText: 'Ho bisogno di aiuto, per favore.',
    fakeText: 'Zor bisogno di aiutalò, krava zizzi.',
    options: [],
    answer: 'Ho bisogno di aiuto, per favore.',
    explanation:
      'The real sentence is authentic Italian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-004',
    difficulty: 1,
    type: 'forgery',
    language: 'German',
    script: 'Latin',
    region: 'europe',
    realText: 'Ich spreche ein bisschen Deutsch.',
    fakeText: 'Ich sprechz blitzkrügen der wochenquarz.',
    options: [],
    answer: 'Ich spreche ein bisschen Deutsch.',
    explanation:
      'The real sentence is authentic German. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-005',
    difficulty: 1,
    type: 'forgery',
    language: 'French',
    script: 'Latin',
    region: 'europe',
    realText: 'Le chat dort sur le canapé.',
    fakeText: 'Le fromage zzz dort dans chatouille.',
    options: [],
    answer: 'Le chat dort sur le canapé.',
    explanation:
      'The real sentence is authentic French. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-006',
    difficulty: 1,
    type: 'forgery',
    language: 'Swedish',
    script: 'Latin',
    region: 'europe',
    realText: 'Vad kostar det?',
    fakeText: 'Våd skørflinga det blåå?',
    options: [],
    answer: 'Vad kostar det?',
    explanation:
      'The real sentence is authentic Swedish. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-007',
    difficulty: 1,
    type: 'forgery',
    language: 'Portuguese',
    script: 'Latin',
    region: 'europe',
    realText: 'Obrigado pela sua ajuda.',
    fakeText: 'Obrigalhão pela sua zzz-grácia.',
    options: [],
    answer: 'Obrigado pela sua ajuda.',
    explanation:
      'The real sentence is authentic Portuguese. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-008',
    difficulty: 1,
    type: 'forgery',
    language: 'Dutch',
    script: 'Latin',
    region: 'europe',
    realText: 'Ik wil een kopje thee bestellen.',
    fakeText: 'Ik wil een snorflappel thee-klomp bestellen.',
    options: [],
    answer: 'Ik wil een kopje thee bestellen.',
    explanation:
      'The real sentence is authentic Dutch. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-009',
    difficulty: 2,
    type: 'forgery',
    language: 'Turkish',
    script: 'Latin',
    region: 'west_asia_north_africa',
    realText: 'Bugün hava çok güzel.',
    fakeText: 'Ğürsel mavi çok zzzgül kapak.',
    options: [],
    answer: 'Bugün hava çok güzel.',
    explanation:
      'The real sentence is authentic Turkish. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-011',
    difficulty: 2,
    type: 'forgery',
    language: 'Polish',
    script: 'Latin',
    region: 'europe',
    realText: 'Przepraszam, gdzie jest dworzec?',
    fakeText: 'Przdravo szczękczeta żółć-blargh?',
    options: [],
    answer: 'Przepraszam, gdzie jest dworzec?',
    explanation:
      'The real sentence is authentic Polish. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-037',
    difficulty: 1,
    type: 'forgery',
    language: 'Danish',
    script: 'Latin',
    region: 'europe',
    realText: 'Jeg vil gerne have en kop kaffe.',
    fakeText: 'Jeg vil grønne kaffelump øø plask.',
    options: [],
    answer: 'Jeg vil gerne have en kop kaffe.',
    explanation:
      'The real sentence is authentic Danish. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-039',
    difficulty: 1,
    type: 'forgery',
    language: 'Romanian',
    script: 'Latin',
    region: 'europe',
    realText: 'Bună ziua, cum vă numiți?',
    fakeText: 'Bună zgronț, vă flomți numbracă?',
    options: [],
    answer: 'Bună ziua, cum vă numiți?',
    explanation:
      'The real sentence is authentic Romanian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
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
    fakeText: 'Wllw glawydd cymruzz bwrbwr?',
    options: [],
    answer: "Mae'n bwrw glaw heddiw.",
    explanation:
      'The real sentence is authentic Welsh. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-045',
    difficulty: 2,
    type: 'forgery',
    language: 'Hungarian',
    script: 'Latin',
    region: 'europe',
    realText: 'Hol van a legközelebbi patika?',
    fakeText: 'Magyagar garszbzág zdravo?',
    options: [],
    answer: 'Hol van a legközelebbi patika?',
    explanation:
      'The real sentence is authentic Hungarian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-013',
    difficulty: 2,
    type: 'forgery',
    language: 'Japanese',
    script: 'Hiragana/Kanji',
    region: 'east_asia',
    realText: 'ありがとうございます。',
    fakeText: 'ありがズザます東京ぽぽぽんぽん。',
    options: [],
    answer: 'ありがとうございます。',
    explanation:
      'The real sentence is authentic Japanese. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-014',
    difficulty: 2,
    type: 'forgery',
    language: 'Korean',
    script: 'Hangul',
    region: 'east_asia',
    realText: '서울은 아름다운 도시입니다.',
    fakeText: '서울블라 아름퐁 도시각각입니다.',
    options: [],
    answer: '서울은 아름다운 도시입니다.',
    explanation:
      'The real sentence is authentic Korean. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-046',
    difficulty: 2,
    type: 'forgery',
    language: 'Swahili',
    script: 'Latin',
    region: 'sub_saharan_africa',
    realText: 'Mimi ni mwalimu wa Kiswahili.',
    fakeText: 'Mwalaga kiswahara zungu-mungu fofo.',
    options: [],
    answer: 'Mimi ni mwalimu wa Kiswahili.',
    explanation:
      'The real sentence is authentic Swahili. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-047',
    difficulty: 2,
    type: 'forgery',
    language: 'Vietnamese',
    script: 'Latin (tonal diacritics)',
    region: 'southeast_asia',
    realText: 'Tôi muốn đặt phòng khách sạn.',
    fakeText: 'Tôi zzz phòng khách bão-lủng sạn.',
    options: [],
    answer: 'Tôi muốn đặt phòng khách sạn.',
    explanation:
      'The real sentence is authentic Vietnamese. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-048',
    difficulty: 2,
    type: 'forgery',
    language: 'Indonesian',
    script: 'Latin',
    region: 'southeast_asia',
    realText: 'Bali adalah pulau yang sangat indah.',
    fakeText: 'Bali pulau sanyat grondu indak sekali.',
    options: [],
    answer: 'Bali adalah pulau yang sangat indah.',
    explanation:
      'The real sentence is authentic Indonesian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
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
    fakeText: 'ღამარჯღბა, რგღრღ ხარ?',
    options: [],
    answer: 'გამარჯობა, როგორ ხარ?',
    explanation:
      'The real sentence is authentic Georgian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-019',
    difficulty: 3,
    type: 'forgery',
    language: 'Basque',
    script: 'Latin',
    region: 'europe',
    realText: 'Mesedez, non dago autobus geltokia?',
    fakeText: 'Xaberdez, non gorga autobusz klexoriaж?',
    options: [],
    answer: 'Mesedez, non dago autobus geltokia?',
    explanation:
      'The real sentence is authentic Basque. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-020',
    difficulty: 3,
    type: 'forgery',
    language: 'Arabic',
    script: 'Arabic (right to left)',
    region: 'west_asia_north_africa',
    realText: 'أنا بخير، شكراً لك.',
    fakeText: 'أنا ززز بخارون، شكرلكا.',
    options: [],
    answer: 'أنا بخير، شكراً لك.',
    explanation:
      'The real sentence is authentic Arabic. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-021',
    difficulty: 3,
    type: 'forgery',
    language: 'Russian',
    script: 'Cyrillic',
    region: 'europe',
    realText: 'Санкт-Петербург — красивый город.',
    fakeText: 'Санкто-Блицбург - крашовый жжужжгород.',
    options: [],
    answer: 'Санкт-Петербург — красивый город.',
    explanation:
      'The real sentence is authentic Russian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-022',
    difficulty: 3,
    type: 'forgery',
    language: 'Thai',
    script: 'Thai',
    region: 'southeast_asia',
    realText: 'วันนี้อากาศดีมาก',
    fakeText: 'ฟฟฟวันนี้ซาซาอากึ๊กมาก',
    options: [],
    answer: 'วันนี้อากาศดีมาก',
    explanation:
      'The real sentence is authentic Thai. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-023',
    difficulty: 3,
    type: 'forgery',
    language: 'Amharic',
    script: "Ethiopic (Ge'ez)",
    region: 'sub_saharan_africa',
    realText: 'እንደምን ነዎት?',
    fakeText: 'እዝዝ ብላብላ ናዎታም?',
    options: [],
    answer: 'እንደምን ነዎት?',
    explanation:
      'The real sentence is authentic Amharic. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-024',
    difficulty: 3,
    type: 'forgery',
    language: 'Icelandic',
    script: 'Latin (with þ and ð)',
    region: 'europe',
    realText: 'Hvernig líður þér?',
    fakeText: 'Hvørk blíðr þrumsk zzz?',
    options: [],
    answer: 'Hvernig líður þér?',
    explanation:
      'The real sentence is authentic Icelandic. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-025',
    difficulty: 3,
    type: 'forgery',
    language: 'Tamil',
    script: 'Tamil',
    region: 'south_asia',
    realText: 'சென்னை ஒரு பெரிய நகரம்.',
    fakeText: 'ழ்ழ்ழ் க்ரூம்பா நொற்றுங்கற்ள்ழ்.',
    options: [],
    answer: 'சென்னை ஒரு பெரிய நகரம்.',
    explanation:
      'The real sentence is authentic Tamil. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-026',
    difficulty: 3,
    type: 'forgery',
    language: 'Telugu',
    script: 'Telugu',
    region: 'south_asia',
    realText: 'హైదరాబాద్ ఒక అందమైన నగరం.',
    fakeText: 'బ్లాబ్లాబ్లాద్ద్ద్ హైదరాబాద్ గుండు పులిబ్లా.',
    options: [],
    answer: 'హైదరాబాద్ ఒక అందమైన నగరం.',
    explanation:
      'The real sentence is authentic Telugu. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-027',
    difficulty: 3,
    type: 'forgery',
    language: 'Kannada',
    script: 'Kannada',
    region: 'south_asia',
    realText: 'ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ.',
    fakeText: 'ಕಕಕ್ ಬೆಂಗಳೂರು ಝುಂಬಾ ಅಗೋಧು ಪ್ಲಾಕ್.',
    options: [],
    answer: 'ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ.',
    explanation:
      'The real sentence is authentic Kannada. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-028',
    difficulty: 3,
    type: 'forgery',
    language: 'Malayalam',
    script: 'Malayalam',
    region: 'south_asia',
    realText: 'കൊച്ചി ഒരു തുറമുഖ നഗരം ആണ്.',
    fakeText: 'ഴഴഴ് കൊച്ചി ഗാർക്‌നെ തുമ്പ്ലാ.',
    options: [],
    answer: 'കൊച്ചി ഒരു തുറമുഖ നഗരം ആണ്.',
    explanation:
      'The real sentence is authentic Malayalam. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-029',
    difficulty: 2,
    type: 'forgery',
    language: 'Hindi',
    script: 'Devanagari',
    region: 'south_asia',
    realText: 'दिल्ली भारत की राजधानी है।',
    fakeText: 'झझझ दिल्ली ब्लार्ग नमस्तेजू है।',
    options: [],
    answer: 'दिल्ली भारत की राजधानी है।',
    explanation:
      'The real sentence is authentic Hindi. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-030',
    difficulty: 3,
    type: 'forgery',
    language: 'Urdu',
    script: 'Nastaliq (Arabic-based, right to left)',
    region: 'south_asia',
    realText: 'لاہور پاکستان کا خوبصورت شہر ہے۔',
    fakeText: 'لاہور ززز خوبخواب بلاستان ہے۔',
    options: [],
    answer: 'لاہور پاکستان کا خوبصورت شہر ہے۔',
    explanation:
      'The real sentence is authentic Urdu. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-031',
    difficulty: 3,
    type: 'forgery',
    language: 'Persian',
    script: 'Nastaliq (Arabic-based, right to left)',
    region: 'west_asia_north_africa',
    realText: 'تهران پایتخت ایران است.',
    fakeText: 'تهران ززز پایفلنج خرمدان است.',
    options: [],
    answer: 'تهران پایتخت ایران است.',
    explanation:
      'The real sentence is authentic Persian. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
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
    fakeText: 'ঢাকা ঝঝঝ বার্গুলা গার্বাহ।',
    options: [],
    answer: 'ঢাকা বাংলাদেশের রাজধানী।',
    explanation:
      'The real sentence is authentic Bengali. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-033',
    difficulty: 3,
    type: 'forgery',
    language: 'Gujarati',
    script: 'Gujarati',
    region: 'south_asia',
    realText: 'અમદાવાદ ગુજરાતની રાજધાની છે.',
    fakeText: 'અમદાવાદ ઝઝઝ બોરીફલાં ખાઓછું.',
    options: [],
    answer: 'અમદાવાદ ગુજરાતની રાજધાની છે.',
    explanation:
      'The real sentence is authentic Gujarati. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-034',
    difficulty: 3,
    type: 'forgery',
    language: 'Marathi',
    script: 'Devanagari',
    region: 'south_asia',
    realText: 'मुंबई महाराष्ट्राची राजधानी आहे.',
    fakeText: 'मुंबई झाझा अर्धब्लार राजधानीझू.',
    options: [],
    answer: 'मुंबई महाराष्ट्राची राजधानी आहे.',
    explanation:
      'The real sentence is authentic Marathi. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-035',
    difficulty: 3,
    type: 'forgery',
    language: 'Punjabi',
    script: 'Gurmukhi',
    region: 'south_asia',
    realText: 'ਅੰਮ੍ਰਿਤਸਰ ਇੱਕ ਪਵਿੱਤਰ ਸ਼ਹਿਰ ਹੈ।',
    fakeText: 'ਝਝਝ ਅੰਮ੍ਰਿ ਬਲਾਰ ਪਵਿੱਤਰੂ ਹੈ।',
    options: [],
    answer: 'ਅੰਮ੍ਰਿਤਸਰ ਇੱਕ ਪਵਿੱਤਰ ਸ਼ਹਿਰ ਹੈ।',
    explanation:
      'The real sentence is authentic Punjabi. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-036',
    difficulty: 3,
    type: 'forgery',
    language: 'Sindhi',
    script: 'Perso-Arabic',
    region: 'south_asia',
    realText: 'ڪراچي پاڪستان جو سڀ کان وڏو شهر آهي.',
    fakeText: 'ڪراچي زآزآ بلاستان چوا خیل سیرف.',
    options: [],
    answer: 'ڪراچي پاڪستان جو سڀ کان وڏو شهر آهي.',
    explanation:
      'The real sentence is authentic Sindhi. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
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
    fakeText: 'Ζζζ ελληνκά ακρομπλό φαγητόνιος.',
    options: [],
    answer: 'Το ελληνικό φαγητό είναι πολύ νόστιμο.',
    explanation:
      'The real sentence is authentic Greek. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
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
    fakeText: 'Ngiyazzz blulakhulu zungu-ngulu.',
    options: [],
    answer: 'Ngiyabonga kakhulu ngosizo lwakho.',
    explanation:
      'The real sentence is authentic Zulu. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-041',
    difficulty: 1,
    type: 'forgery',
    language: 'Afrikaans',
    script: 'Latin',
    region: 'sub_saharan_africa',
    realText: 'Die see is baie mooi vandag.',
    fakeText: 'Die zeez blaar mooi-vandaglik.',
    options: [],
    answer: 'Die see is baie mooi vandag.',
    explanation:
      'The real sentence is authentic Afrikaans. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
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
    fakeText: '上海火火女女市肾.',
    options: [],
    answer: '上海是中国最大的城市之一。',
    explanation:
      'The real sentence is authentic Mandarin Chinese. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },

  {
    id: 'fo-043',
    difficulty: 3,
    type: 'forgery',
    language: 'Cantonese',
    script: 'Traditional Chinese (Hanzi)',
    region: 'east_asia',
    realText: '我今日喺屋企食飯。',
    fakeText: '我今だ目喺甜甜甜甜飯。',
    options: [],
    answer: '我今日喺屋企食飯。',
    explanation:
      'The real sentence is authentic Cantonese. The fake option is deliberately more visually distorted, using exaggerated clusters, repeated filler, or mismatched-looking word shapes so the forgery is easier to spot.',
  },
];
