import type { AcceptedAnswer, ScriptBlitzQuestion } from '@/types/practice';

// ─── Script Blitz Question Bank ───────────────────────────────────────────────
// 380+ questions across two categories:
//   'script'   - player identifies the writing system (e.g. "Cyrillic")
//   'language' - player identifies the language (e.g. "Finnish")
//
// Difficulty guide:
//   easy   - highly distinctive, common scripts / languages
//   medium - requires more specific knowledge
//   hard   - closely related to another, short or ambiguous sample

const CYRILLIC_ALIASES = ['cyrillic script', 'cyrillic alphabet'];
const ARABIC_ALIASES   = ['arabic script', 'arabic alphabet', 'perso-arabic'];
const HEBREW_ALIASES   = ['hebrew script', 'hebrew alphabet'];
const GEORGIAN_ALIASES = ['georgian script', 'mkhedruli'];
const ARMENIAN_ALIASES = ['armenian script', 'armenian alphabet'];
const GREEK_ALIASES    = ['greek script', 'greek alphabet'];
const DEVANAGARI_ALIASES = ['devanagari script', 'devanagari alphabet', 'nagari'];
const THAI_ALIASES     = ['thai script', 'thai alphabet'];
const TIBETAN_ALIASES  = ['tibetan script', 'tibetan alphabet'];
const HANGUL_ALIASES   = ['hangul', 'hangeul', 'korean', 'korean script'];
const HIRAGANA_ALIASES = ['hiragana script', 'japanese hiragana'];
const KATAKANA_ALIASES = ['katakana script', 'japanese katakana'];
const BENGALI_ALIASES  = ['bengali script', 'bengali alphabet', 'bangla script', 'bangla'];
const GUJARATI_ALIASES = ['gujarati script', 'gujarati alphabet'];
const GURMUKHI_ALIASES = ['gurmukhi script', 'gurmukhi alphabet', 'punjabi script'];
const TAMIL_ALIASES    = ['tamil script', 'tamil alphabet'];
const TELUGU_ALIASES   = ['telugu script', 'telugu alphabet'];
const KANNADA_ALIASES  = ['kannada script', 'kannada alphabet'];
const MALAYALAM_ALIASES = ['malayalam script', 'malayalam alphabet'];
const SINHALA_ALIASES  = ['sinhala script', 'sinhala alphabet', 'sinhalese', 'sinhalese script'];
const ETHIOPIC_ALIASES = ["ge'ez", 'geez', 'ethiopic script', 'fidel', "ge'ez script"];
const WIDELY_USED_MUSLIM_SURNAME_COUNTRIES = [
  'Pakistan',
  'India',
  'Bangladesh',
  'Afghanistan',
  'Saudi Arabia',
  'United Arab Emirates',
  'UAE',
  'Kuwait',
  'Yemen',
  'Oman',
  'Egypt',
  'Libya',
  'Tunisia',
  'Algeria',
  'Mauritania',
  'Sudan',
  'Morocco',
  'Qatar',
  'Bahrain',
  'Iraq',
  'Jordan',
  'Syria',
  'Lebanon',
  'Palestine',
  'Iran',
  'Turkey',
] as const;
const WIDELY_USED_MUSLIM_SURNAME_ALIASES = [
  ...WIDELY_USED_MUSLIM_SURNAME_COUNTRIES,
  'pakistani',
  'indian',
  'bengali',
  'bangladeshi',
  'afghan',
  'saudi',
  'emirati',
  'arab',
  'arabic',
  'kuwaiti',
  'yemeni',
  'omani',
  'egyptian',
  'libyan',
  'tunisian',
  'algerian',
  'mauritanian',
  'sudanese',
  'moroccan',
  'qatari',
  'bahraini',
  'iraqi',
  'jordanian',
  'syrian',
  'lebanese',
  'palestinian',
  'iranian',
  'persian',
  'turkish',
] as const;

function surnameAnswers(input: {
  broad: readonly string[];
  specific?: readonly string[];
  preferred?: readonly string[];
}): AcceptedAnswer[] {
  return [
    ...input.broad.map((value) => ({ value, specificity: 'broad' }) as const),
    ...(input.specific ?? []).map((value) => ({ value, specificity: 'specific' }) as const),
    ...(input.preferred ?? []).map((value) => ({ value, specificity: 'preferred' }) as const),
  ];
}

function widelyUsedMuslimSurnameAnswers(): AcceptedAnswer[] {
  return surnameAnswers({ broad: WIDELY_USED_MUSLIM_SURNAME_ALIASES });
}

export const SCRIPT_BLITZ_QUESTIONS: ScriptBlitzQuestion[] = [

  // ══════════════════════════════════════════════════════════════════════
  // TYPE A - SCRIPT IDENTIFICATION
  // ══════════════════════════════════════════════════════════════════════

  // ── Cyrillic ────────────────────────────────────────────────────────────────

  { id: 'sb-cyr-001', category: 'script', displayText: 'Привет', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Used in Russian, Ukrainian, Bulgarian and more', difficulty: 'easy' },
  { id: 'sb-cyr-002', category: 'script', displayText: 'Как дела?', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Means "How are you?" in Russian', difficulty: 'easy' },
  { id: 'sb-cyr-003', category: 'script', displayText: 'Добро пожаловать', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Russian for "Welcome"', difficulty: 'easy' },
  { id: 'sb-cyr-004', category: 'script', displayText: 'Слава Україні', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Ukrainian phrase', difficulty: 'easy' },
  { id: 'sb-cyr-005', category: 'script', displayText: 'Государственный университет', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Russian for "State University"', difficulty: 'medium' },
  { id: 'sb-cyr-006', category: 'script', displayText: 'Добър ден', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Bulgarian for "Good day"', difficulty: 'easy' },
  { id: 'sb-cyr-007', category: 'script', displayText: 'Добродошли у Србију', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Serbian for "Welcome to Serbia"', difficulty: 'easy' },
  { id: 'sb-cyr-008', category: 'script', displayText: 'Беларуская мова', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Belarusian for "Belarusian language"', difficulty: 'medium' },
  { id: 'sb-cyr-009', category: 'script', displayText: 'Монгол улс', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Mongolian for "Mongolia"', difficulty: 'medium' },
  { id: 'sb-cyr-010', category: 'script', displayText: 'Қазақстан', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Kazakhstan in Kazakh Cyrillic', difficulty: 'hard' },
  { id: 'sb-cyr-011', category: 'script', displayText: 'Тоҷикистон', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Tajikistan in Tajik Cyrillic', difficulty: 'hard' },
  { id: 'sb-cyr-012', category: 'script', displayText: 'Кыргызстан', answer: 'Cyrillic', aliases: CYRILLIC_ALIASES, hint: 'Kyrgyzstan in Kyrgyz', difficulty: 'medium' },

  // ── Arabic ───────────────────────────────────────────────────────────────────

  { id: 'sb-ara-001', category: 'script', displayText: 'مرحباً', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Means "Hello"', difficulty: 'easy' },
  { id: 'sb-ara-002', category: 'script', displayText: 'السلام عليكم', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Peace be upon you - Islamic greeting', difficulty: 'easy' },
  { id: 'sb-ara-003', category: 'script', displayText: 'اللغة العربية', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Means "The Arabic language"', difficulty: 'easy' },
  { id: 'sb-ara-004', category: 'script', displayText: 'شكراً جزيلاً', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Means "Thank you very much"', difficulty: 'easy' },
  { id: 'sb-ara-005', category: 'script', displayText: 'القاهرة عاصمة مصر', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Cairo is the capital of Egypt', difficulty: 'medium' },
  { id: 'sb-ara-006', category: 'script', displayText: 'كيف حالك؟', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Means "How are you?"', difficulty: 'easy' },
  { id: 'sb-ara-007', category: 'script', displayText: 'بسم الله الرحمن الرحيم', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Opening phrase of the Quran', difficulty: 'medium' },
  { id: 'sb-ara-008', category: 'script', displayText: 'أنا بخير', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Means "I am fine"', difficulty: 'easy' },
  { id: 'sb-ara-009', category: 'script', displayText: 'مدينة الرياض', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'The city of Riyadh', difficulty: 'medium' },
  { id: 'sb-ara-010', category: 'script', displayText: 'مساء الخير', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'Means "Good evening"', difficulty: 'easy' },
  { id: 'sb-ara-011', category: 'script', displayText: 'أهلاً وسهلاً', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'A common Arabic welcome phrase', difficulty: 'easy' },
  { id: 'sb-ara-012', category: 'script', displayText: 'الجامعة العربية', answer: 'Arabic', aliases: ARABIC_ALIASES, hint: 'The Arab League', difficulty: 'medium' },

  // ── Hebrew ───────────────────────────────────────────────────────────────────

  { id: 'sb-heb-001', category: 'script', displayText: 'שלום', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Means "Hello / Peace / Goodbye"', difficulty: 'easy' },
  { id: 'sb-heb-002', category: 'script', displayText: 'ברוכים הבאים', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Means "Welcome"', difficulty: 'easy' },
  { id: 'sb-heb-003', category: 'script', displayText: 'מדינת ישראל', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'State of Israel', difficulty: 'easy' },
  { id: 'sb-heb-004', category: 'script', displayText: 'שבת שלום', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Sabbath greeting', difficulty: 'medium' },
  { id: 'sb-heb-005', category: 'script', displayText: 'ירושלים', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Jerusalem', difficulty: 'easy' },
  { id: 'sb-heb-006', category: 'script', displayText: 'תודה רבה', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-heb-007', category: 'script', displayText: 'לחיים', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'To life! - a toast', difficulty: 'medium' },
  { id: 'sb-heb-008', category: 'script', displayText: 'שנה טובה', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Happy New Year', difficulty: 'medium' },
  { id: 'sb-heb-009', category: 'script', displayText: 'עברית שפה עתיקה', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Hebrew is an ancient language', difficulty: 'hard' },
  { id: 'sb-heb-010', category: 'script', displayText: 'יום טוב', answer: 'Hebrew', aliases: HEBREW_ALIASES, hint: 'Good day / holiday', difficulty: 'medium' },

  // ── Georgian ─────────────────────────────────────────────────────────────────

  { id: 'sb-geo-001', category: 'script', displayText: 'გამარჯობა', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'Hello in Georgian', difficulty: 'easy' },
  { id: 'sb-geo-002', category: 'script', displayText: 'საქართველო', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'Georgia (the country)', difficulty: 'easy' },
  { id: 'sb-geo-003', category: 'script', displayText: 'ქართული ენა', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'Georgian language', difficulty: 'easy' },
  { id: 'sb-geo-004', category: 'script', displayText: 'თბილისი', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'Capital city of Georgia', difficulty: 'easy' },
  { id: 'sb-geo-005', category: 'script', displayText: 'გმადლობთ', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'Thank you (formal)', difficulty: 'medium' },
  { id: 'sb-geo-006', category: 'script', displayText: 'კარგი დღე', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'Good day', difficulty: 'medium' },
  { id: 'sb-geo-007', category: 'script', displayText: 'როგორ ხარ?', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'How are you?', difficulty: 'hard' },
  { id: 'sb-geo-008', category: 'script', displayText: 'ბაგრატი მეფე', answer: 'Georgian', aliases: GEORGIAN_ALIASES, hint: 'King Bagrat - historical Georgian ruler', difficulty: 'hard' },

  // ── Armenian ─────────────────────────────────────────────────────────────────

  { id: 'sb-arm-001', category: 'script', displayText: 'Բարի գալուստ', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'Welcome in Armenian', difficulty: 'easy' },
  { id: 'sb-arm-002', category: 'script', displayText: 'Հայաստան', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'Armenia', difficulty: 'easy' },
  { id: 'sb-arm-003', category: 'script', displayText: 'Երևան', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'Capital of Armenia', difficulty: 'easy' },
  { id: 'sb-arm-004', category: 'script', displayText: 'Հայոց լեզու', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'The Armenian language', difficulty: 'medium' },
  { id: 'sb-arm-005', category: 'script', displayText: 'Ողջույն', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'Hello / Greetings', difficulty: 'medium' },
  { id: 'sb-arm-006', category: 'script', displayText: 'Շնորհակալություն', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'Thank you', difficulty: 'hard' },
  { id: 'sb-arm-007', category: 'script', displayText: 'Արարատ', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'Mount Ararat', difficulty: 'medium' },
  { id: 'sb-arm-008', category: 'script', displayText: 'Հայ ժողովուրդ', answer: 'Armenian', aliases: ARMENIAN_ALIASES, hint: 'The Armenian people', difficulty: 'hard' },

  // ── Greek ─────────────────────────────────────────────────────────────────────

  { id: 'sb-grk-001', category: 'script', displayText: 'Καλημέρα', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Good morning in Greek', difficulty: 'easy' },
  { id: 'sb-grk-002', category: 'script', displayText: 'Ελλάδα', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Greece', difficulty: 'easy' },
  { id: 'sb-grk-003', category: 'script', displayText: 'Αθήνα', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Athens', difficulty: 'easy' },
  { id: 'sb-grk-004', category: 'script', displayText: 'Ευχαριστώ πολύ', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-grk-005', category: 'script', displayText: 'Φιλοσοφία', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Philosophy', difficulty: 'easy' },
  { id: 'sb-grk-006', category: 'script', displayText: 'Ολυμπιακοί Αγώνες', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Olympic Games', difficulty: 'medium' },
  { id: 'sb-grk-007', category: 'script', displayText: 'Τι κάνεις;', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'How are you?', difficulty: 'medium' },
  { id: 'sb-grk-008', category: 'script', displayText: 'Γεια σας', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Hello (formal)', difficulty: 'easy' },
  { id: 'sb-grk-009', category: 'script', displayText: 'Δημοκρατία', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Democracy', difficulty: 'medium' },
  { id: 'sb-grk-010', category: 'script', displayText: 'Καλώς ήρθατε', answer: 'Greek', aliases: GREEK_ALIASES, hint: 'Welcome (formal)', difficulty: 'medium' },

  // ── Devanagari ────────────────────────────────────────────────────────────────

  { id: 'sb-dev-001', category: 'script', displayText: 'नमस्ते', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Hindi greeting "Namaste"', difficulty: 'easy' },
  { id: 'sb-dev-002', category: 'script', displayText: 'भारत', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'India in Hindi', difficulty: 'easy' },
  { id: 'sb-dev-003', category: 'script', displayText: 'दिल्ली', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Delhi', difficulty: 'easy' },
  { id: 'sb-dev-004', category: 'script', displayText: 'धन्यवाद', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Thank you in Hindi/Nepali', difficulty: 'easy' },
  { id: 'sb-dev-005', category: 'script', displayText: 'संस्कृत भाषा', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Sanskrit language', difficulty: 'medium' },
  { id: 'sb-dev-006', category: 'script', displayText: 'मुम्बई', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Mumbai in Hindi/Marathi', difficulty: 'easy' },
  { id: 'sb-dev-007', category: 'script', displayText: 'हिन्दी हमारी राष्ट्रभाषा है', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Hindi is our national language', difficulty: 'medium' },
  { id: 'sb-dev-008', category: 'script', displayText: 'नेपाल', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Nepal written in Nepali', difficulty: 'easy' },
  { id: 'sb-dev-009', category: 'script', displayText: 'शुभ प्रभात', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'Good morning', difficulty: 'medium' },
  { id: 'sb-dev-010', category: 'script', displayText: 'आप कैसे हैं?', answer: 'Devanagari', aliases: DEVANAGARI_ALIASES, hint: 'How are you? (formal Hindi)', difficulty: 'medium' },

  // ── Thai ──────────────────────────────────────────────────────────────────────

  { id: 'sb-tha-001', category: 'script', displayText: 'สวัสดี', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Hello in Thai', difficulty: 'easy' },
  { id: 'sb-tha-002', category: 'script', displayText: 'ประเทศไทย', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Thailand', difficulty: 'easy' },
  { id: 'sb-tha-003', category: 'script', displayText: 'ขอบคุณมาก', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-tha-004', category: 'script', displayText: 'กรุงเทพมหานคร', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Bangkok', difficulty: 'medium' },
  { id: 'sb-tha-005', category: 'script', displayText: 'อาหารไทย', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Thai food', difficulty: 'easy' },
  { id: 'sb-tha-006', category: 'script', displayText: 'ราชอาณาจักรไทย', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Kingdom of Thailand', difficulty: 'medium' },
  { id: 'sb-tha-007', category: 'script', displayText: 'น้ำ', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Water in Thai', difficulty: 'medium' },
  { id: 'sb-tha-008', category: 'script', displayText: 'วันนี้อากาศดีมาก', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Today the weather is very good', difficulty: 'hard' },
  { id: 'sb-tha-009', category: 'script', displayText: 'ภาษาไทย', answer: 'Thai', aliases: THAI_ALIASES, hint: 'Thai language', difficulty: 'easy' },
  { id: 'sb-tha-010', category: 'script', displayText: 'เชิญทางนี้', answer: 'Thai', aliases: THAI_ALIASES, hint: 'This way, please', difficulty: 'hard' },

  // ── Tibetan ───────────────────────────────────────────────────────────────────

  { id: 'sb-tib-001', category: 'script', displayText: 'བཀྲ་ཤིས་བདེ་ལེགས།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Auspicious well-being - a Tibetan blessing', difficulty: 'easy' },
  { id: 'sb-tib-002', category: 'script', displayText: 'ལྷ་ས།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Lhasa, capital of Tibet', difficulty: 'easy' },
  { id: 'sb-tib-003', category: 'script', displayText: 'བོད་ལྗོངས།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Tibet', difficulty: 'easy' },
  { id: 'sb-tib-004', category: 'script', displayText: 'བུདྡྷ་ཆོས།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Buddhist dharma', difficulty: 'medium' },
  { id: 'sb-tib-005', category: 'script', displayText: 'རྒྱལ་ཁབ།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Country / nation', difficulty: 'medium' },
  { id: 'sb-tib-006', category: 'script', displayText: 'སྙིང་རྗེ།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Compassion', difficulty: 'hard' },
  { id: 'sb-tib-007', category: 'script', displayText: 'མཐོ་སྒང་།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'High plateau', difficulty: 'hard' },
  { id: 'sb-tib-008', category: 'script', displayText: 'དགེ་འདུན།', answer: 'Tibetan', aliases: TIBETAN_ALIASES, hint: 'Sangha / Buddhist community', difficulty: 'hard' },

  // ── Korean Hangul ─────────────────────────────────────────────────────────────

  { id: 'sb-han-001', category: 'script', displayText: '안녕하세요', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Hello in Korean', difficulty: 'easy' },
  { id: 'sb-han-002', category: 'script', displayText: '대한민국', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Republic of Korea', difficulty: 'easy' },
  { id: 'sb-han-003', category: 'script', displayText: '서울', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Seoul, capital of South Korea', difficulty: 'easy' },
  { id: 'sb-han-004', category: 'script', displayText: '감사합니다', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Thank you (formal)', difficulty: 'easy' },
  { id: 'sb-han-005', category: 'script', displayText: '한국어', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Korean language', difficulty: 'easy' },
  { id: 'sb-han-006', category: 'script', displayText: '반갑습니다', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Nice to meet you', difficulty: 'medium' },
  { id: 'sb-han-007', category: 'script', displayText: '사랑해요', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'I love you', difficulty: 'medium' },
  { id: 'sb-han-008', category: 'script', displayText: '어서 오세요', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Welcome / Come in', difficulty: 'medium' },
  { id: 'sb-han-009', category: 'script', displayText: '한글은 독창적인 문자입니다', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Hangul is an original script', difficulty: 'hard' },
  { id: 'sb-han-010', category: 'script', displayText: '좋은 아침', answer: 'Hangul', aliases: HANGUL_ALIASES, hint: 'Good morning', difficulty: 'easy' },

  // ── Japanese Hiragana ─────────────────────────────────────────────────────────

  { id: 'sb-hir-001', category: 'script', displayText: 'ありがとうございます', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'Thank you very much in Japanese', difficulty: 'easy' },
  { id: 'sb-hir-002', category: 'script', displayText: 'おはようございます', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'Good morning (formal)', difficulty: 'easy' },
  { id: 'sb-hir-003', category: 'script', displayText: 'こんにちは', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'Hello / Good afternoon', difficulty: 'easy' },
  { id: 'sb-hir-004', category: 'script', displayText: 'さようなら', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'Goodbye', difficulty: 'easy' },
  { id: 'sb-hir-005', category: 'script', displayText: 'いただきます', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'Said before eating a meal', difficulty: 'medium' },
  { id: 'sb-hir-006', category: 'script', displayText: 'にほんごがすきです', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'I like Japanese language', difficulty: 'medium' },
  { id: 'sb-hir-007', category: 'script', displayText: 'おなまえはなんですか', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'What is your name?', difficulty: 'hard' },
  { id: 'sb-hir-008', category: 'script', displayText: 'たべもの', answer: 'Hiragana', aliases: HIRAGANA_ALIASES, hint: 'Food in Japanese', difficulty: 'medium' },

  // ── Japanese Katakana ─────────────────────────────────────────────────────────

  { id: 'sb-kat-001', category: 'script', displayText: 'コンピュータ', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Computer in Japanese', difficulty: 'easy' },
  { id: 'sb-kat-002', category: 'script', displayText: 'テレビ', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Television in Japanese', difficulty: 'easy' },
  { id: 'sb-kat-003', category: 'script', displayText: 'アメリカ', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'America in Japanese', difficulty: 'easy' },
  { id: 'sb-kat-004', category: 'script', displayText: 'レストラン', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Restaurant in Japanese', difficulty: 'easy' },
  { id: 'sb-kat-005', category: 'script', displayText: 'スーパーマーケット', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Supermarket in Japanese', difficulty: 'medium' },
  { id: 'sb-kat-006', category: 'script', displayText: 'ピアノ', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Piano in Japanese', difficulty: 'easy' },
  { id: 'sb-kat-007', category: 'script', displayText: 'トーキョー', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Tokyo in Katakana', difficulty: 'medium' },
  { id: 'sb-kat-008', category: 'script', displayText: 'アイスクリーム', answer: 'Katakana', aliases: KATAKANA_ALIASES, hint: 'Ice cream in Japanese', difficulty: 'medium' },

  // ── Bengali ───────────────────────────────────────────────────────────────────

  { id: 'sb-ben-001', category: 'script', displayText: 'নমস্কার', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'Hello / Greetings in Bengali', difficulty: 'easy' },
  { id: 'sb-ben-002', category: 'script', displayText: 'বাংলাদেশ', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'Bangladesh', difficulty: 'easy' },
  { id: 'sb-ben-003', category: 'script', displayText: 'ধন্যবাদ', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'Thank you in Bengali', difficulty: 'medium' },
  { id: 'sb-ben-004', category: 'script', displayText: 'ঢাকা বাংলাদেশের রাজধানী', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'Dhaka is the capital of Bangladesh', difficulty: 'medium' },
  { id: 'sb-ben-005', category: 'script', displayText: 'বাংলা ভাষা', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'Bengali language', difficulty: 'easy' },
  { id: 'sb-ben-006', category: 'script', displayText: 'আমার সোনার বাংলা', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'My golden Bengal - Bangladesh national anthem opening', difficulty: 'hard' },
  { id: 'sb-ben-007', category: 'script', displayText: 'আপনি কেমন আছেন?', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'How are you? (formal)', difficulty: 'hard' },
  { id: 'sb-ben-008', category: 'script', displayText: 'সুপ্রভাত', answer: 'Bengali', aliases: BENGALI_ALIASES, hint: 'Good morning', difficulty: 'medium' },

  // ── Gujarati ──────────────────────────────────────────────────────────────────

  { id: 'sb-guj-001', category: 'script', displayText: 'ગુજરાત', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'Gujarat, a state in India', difficulty: 'easy' },
  { id: 'sb-guj-002', category: 'script', displayText: 'નમસ્તે', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'Hello in Gujarati', difficulty: 'medium' },
  { id: 'sb-guj-003', category: 'script', displayText: 'ગુજરાતી ભાષા', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'Gujarati language', difficulty: 'easy' },
  { id: 'sb-guj-004', category: 'script', displayText: 'ધન્યવાદ', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'Thank you in Gujarati', difficulty: 'medium' },
  { id: 'sb-guj-005', category: 'script', displayText: 'અમદાવાદ', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'Ahmedabad, largest city in Gujarat', difficulty: 'medium' },
  { id: 'sb-guj-006', category: 'script', displayText: 'ભારત', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'India in Gujarati', difficulty: 'hard' },
  { id: 'sb-guj-007', category: 'script', displayText: 'ગરબા', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'Garba - traditional Gujarati dance', difficulty: 'medium' },
  { id: 'sb-guj-008', category: 'script', displayText: 'ક્યારે આવ્યા?', answer: 'Gujarati', aliases: GUJARATI_ALIASES, hint: 'When did you arrive?', difficulty: 'hard' },

  // ── Gurmukhi ──────────────────────────────────────────────────────────────────

  { id: 'sb-gur-001', category: 'script', displayText: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Punjabi Sikh greeting', difficulty: 'easy' },
  { id: 'sb-gur-002', category: 'script', displayText: 'ਪੰਜਾਬ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Punjab region', difficulty: 'easy' },
  { id: 'sb-gur-003', category: 'script', displayText: 'ਅੰਮ੍ਰਿਤਸਰ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Amritsar, home of the Golden Temple', difficulty: 'medium' },
  { id: 'sb-gur-004', category: 'script', displayText: 'ਧੰਨਵਾਦ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Thank you in Punjabi', difficulty: 'medium' },
  { id: 'sb-gur-005', category: 'script', displayText: 'ਵਾਹਿਗੁਰੂ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Waheguru - Sikh name for God', difficulty: 'hard' },
  { id: 'sb-gur-006', category: 'script', displayText: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Punjabi language', difficulty: 'easy' },
  { id: 'sb-gur-007', category: 'script', displayText: 'ਭਾਰਤ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'India in Punjabi', difficulty: 'hard' },
  { id: 'sb-gur-008', category: 'script', displayText: 'ਚੰਡੀਗੜ੍ਹ', answer: 'Gurmukhi', aliases: GURMUKHI_ALIASES, hint: 'Chandigarh, capital of Punjab', difficulty: 'hard' },

  // ── Tamil ─────────────────────────────────────────────────────────────────────

  { id: 'sb-tam-001', category: 'script', displayText: 'வணக்கம்', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Hello / Greetings in Tamil', difficulty: 'easy' },
  { id: 'sb-tam-002', category: 'script', displayText: 'தமிழ்நாடு', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Tamil Nadu, a state in India', difficulty: 'easy' },
  { id: 'sb-tam-003', category: 'script', displayText: 'சென்னை', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Chennai, capital of Tamil Nadu', difficulty: 'easy' },
  { id: 'sb-tam-004', category: 'script', displayText: 'நன்றி', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Thank you in Tamil', difficulty: 'easy' },
  { id: 'sb-tam-005', category: 'script', displayText: 'தமிழ் மொழி', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Tamil language', difficulty: 'easy' },
  { id: 'sb-tam-006', category: 'script', displayText: 'இந்தியா', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'India in Tamil', difficulty: 'medium' },
  { id: 'sb-tam-007', category: 'script', displayText: 'யாழ்ப்பாணம்', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Jaffna, a city in Sri Lanka', difficulty: 'hard' },
  { id: 'sb-tam-008', category: 'script', displayText: 'தமிழ் இலக்கியம்', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'Tamil literature', difficulty: 'hard' },
  { id: 'sb-tam-009', category: 'script', displayText: 'அன்னையர் நாள்', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: "Mother's Day in Tamil", difficulty: 'hard' },
  { id: 'sb-tam-010', category: 'script', displayText: 'ஒரு நாடு', answer: 'Tamil', aliases: TAMIL_ALIASES, hint: 'One country', difficulty: 'medium' },

  // ── Telugu ────────────────────────────────────────────────────────────────────

  { id: 'sb-tel-001', category: 'script', displayText: 'నమస్కారం', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'Hello in Telugu', difficulty: 'easy' },
  { id: 'sb-tel-002', category: 'script', displayText: 'తెలుగు భాష', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'Telugu language', difficulty: 'easy' },
  { id: 'sb-tel-003', category: 'script', displayText: 'హైదరాబాద్', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'Hyderabad', difficulty: 'easy' },
  { id: 'sb-tel-004', category: 'script', displayText: 'ధన్యవాదాలు', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'Thank you in Telugu', difficulty: 'medium' },
  { id: 'sb-tel-005', category: 'script', displayText: 'తెలంగాణ', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'Telangana state', difficulty: 'medium' },
  { id: 'sb-tel-006', category: 'script', displayText: 'ఆంధ్రప్రదేశ్', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'Andhra Pradesh state', difficulty: 'hard' },
  { id: 'sb-tel-007', category: 'script', displayText: 'మీరు ఎలా ఉన్నారు?', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'How are you? (formal)', difficulty: 'hard' },
  { id: 'sb-tel-008', category: 'script', displayText: 'భారతదేశం', answer: 'Telugu', aliases: TELUGU_ALIASES, hint: 'India in Telugu', difficulty: 'medium' },

  // ── Kannada ───────────────────────────────────────────────────────────────────

  { id: 'sb-kan-001', category: 'script', displayText: 'ನಮಸ್ಕಾರ', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'Hello in Kannada', difficulty: 'easy' },
  { id: 'sb-kan-002', category: 'script', displayText: 'ಕರ್ನಾಟಕ', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'Karnataka state', difficulty: 'easy' },
  { id: 'sb-kan-003', category: 'script', displayText: 'ಬೆಂಗಳೂರು', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'Bengaluru / Bangalore', difficulty: 'easy' },
  { id: 'sb-kan-004', category: 'script', displayText: 'ಕನ್ನಡ ಭಾಷೆ', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'Kannada language', difficulty: 'easy' },
  { id: 'sb-kan-005', category: 'script', displayText: 'ಧನ್ಯವಾದಗಳು', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'Thank you in Kannada', difficulty: 'medium' },
  { id: 'sb-kan-006', category: 'script', displayText: 'ಹೇಗಿದ್ದೀರಿ?', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'How are you?', difficulty: 'medium' },
  { id: 'sb-kan-007', category: 'script', displayText: 'ಭಾರತ', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'India in Kannada', difficulty: 'hard' },
  { id: 'sb-kan-008', category: 'script', displayText: 'ಮೈಸೂರು', answer: 'Kannada', aliases: KANNADA_ALIASES, hint: 'Mysore, a city in Karnataka', difficulty: 'hard' },

  // ── Malayalam ─────────────────────────────────────────────────────────────────

  { id: 'sb-mal-001', category: 'script', displayText: 'നമസ്കാരം', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'Hello in Malayalam', difficulty: 'easy' },
  { id: 'sb-mal-002', category: 'script', displayText: 'കേരളം', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'Kerala state', difficulty: 'easy' },
  { id: 'sb-mal-003', category: 'script', displayText: 'മലയാളം', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'Malayalam language', difficulty: 'easy' },
  { id: 'sb-mal-004', category: 'script', displayText: 'തിരുവനന്തപുരം', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'Thiruvananthapuram, Kerala capital', difficulty: 'medium' },
  { id: 'sb-mal-005', category: 'script', displayText: 'നന്ദി', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'Thank you in Malayalam', difficulty: 'medium' },
  { id: 'sb-mal-006', category: 'script', displayText: 'ഇന്ത്യ', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'India in Malayalam', difficulty: 'hard' },
  { id: 'sb-mal-007', category: 'script', displayText: 'ഭാരതം', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'India (formal name) in Malayalam', difficulty: 'hard' },
  { id: 'sb-mal-008', category: 'script', displayText: 'ഒരു നാട്', answer: 'Malayalam', aliases: MALAYALAM_ALIASES, hint: 'One land', difficulty: 'hard' },

  // ── Sinhala ───────────────────────────────────────────────────────────────────

  { id: 'sb-sin-001', category: 'script', displayText: 'ආයුබෝවන්', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Welcome / Hello in Sinhala', difficulty: 'easy' },
  { id: 'sb-sin-002', category: 'script', displayText: 'ශ්‍රී ලංකාව', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Sri Lanka', difficulty: 'easy' },
  { id: 'sb-sin-003', category: 'script', displayText: 'කොළඹ', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Colombo, capital of Sri Lanka', difficulty: 'easy' },
  { id: 'sb-sin-004', category: 'script', displayText: 'සිංහල', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Sinhala language/people', difficulty: 'easy' },
  { id: 'sb-sin-005', category: 'script', displayText: 'ස්තූතියි', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Thank you in Sinhala', difficulty: 'medium' },
  { id: 'sb-sin-006', category: 'script', displayText: 'ඔබ කොහොමද?', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'How are you?', difficulty: 'medium' },
  { id: 'sb-sin-007', category: 'script', displayText: 'ශ්‍රී ලංකා ජනරජය', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Democratic Socialist Republic of Sri Lanka', difficulty: 'hard' },
  { id: 'sb-sin-008', category: 'script', displayText: 'අපේ රට', answer: 'Sinhala', aliases: SINHALA_ALIASES, hint: 'Our country', difficulty: 'hard' },

  // ── Ethiopic (Ge'ez) ──────────────────────────────────────────────────────────

  { id: 'sb-eth-001', category: 'script', displayText: 'ሰላም', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'Hello / Peace in Amharic', difficulty: 'easy' },
  { id: 'sb-eth-002', category: 'script', displayText: 'ኢትዮጵያ', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'Ethiopia', difficulty: 'easy' },
  { id: 'sb-eth-003', category: 'script', displayText: 'አዲስ አበባ', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'Addis Ababa, capital of Ethiopia', difficulty: 'easy' },
  { id: 'sb-eth-004', category: 'script', displayText: 'አማርኛ', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'Amharic language', difficulty: 'medium' },
  { id: 'sb-eth-005', category: 'script', displayText: 'እናቴ', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'My mother in Amharic', difficulty: 'medium' },
  { id: 'sb-eth-006', category: 'script', displayText: 'እንደምን ነዎት?', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'How are you? (formal Amharic)', difficulty: 'medium' },
  { id: 'sb-eth-007', category: 'script', displayText: 'አብርሃም', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'Abraham - a common Ethiopian name', difficulty: 'hard' },
  { id: 'sb-eth-008', category: 'script', displayText: 'ፈቃድ', answer: 'Ethiopic', aliases: ETHIOPIC_ALIASES, hint: 'Permission / will', difficulty: 'hard' },

  // ══════════════════════════════════════════════════════════════════════
  // TYPE B - LANGUAGE IDENTIFICATION
  // ══════════════════════════════════════════════════════════════════════

  // ── Finnish ────────────────────────────────────────────────────────────────────

  { id: 'sb-fin-001', category: 'language', displayText: 'Hyvää huomenta', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'Good morning - note the double vowels ää, oo', difficulty: 'easy' },
  { id: 'sb-fin-002', category: 'language', displayText: 'Kiitos paljon', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-fin-003', category: 'language', displayText: 'Suomi on kaunis maa', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'Finland is a beautiful country', difficulty: 'easy' },
  { id: 'sb-fin-004', category: 'language', displayText: 'Helsinki on pääkaupunki', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'Helsinki is the capital city', difficulty: 'medium' },
  { id: 'sb-fin-005', category: 'language', displayText: 'Puhutko suomea?', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'Do you speak Finnish?', difficulty: 'medium' },
  { id: 'sb-fin-006', category: 'language', displayText: 'Tuulinen päivä', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'A windy day', difficulty: 'hard' },
  { id: 'sb-fin-007', category: 'language', displayText: 'Hauskaa päivänjatkoa', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'Have a nice rest of the day', difficulty: 'hard' },
  { id: 'sb-fin-008', category: 'language', displayText: 'Minulla on nälkä', answer: 'Finnish', aliases: ['suomi', 'finnish language'], hint: 'I am hungry', difficulty: 'hard' },

  // ── Turkish ────────────────────────────────────────────────────────────────────

  { id: 'sb-tur-001', category: 'language', displayText: 'Merhaba, nasılsın?', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Hello, how are you? - ı and ş are Turkish letters', difficulty: 'easy' },
  { id: 'sb-tur-002', category: 'language', displayText: 'Teşekkür ederim', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Thank you - look for ş and ü', difficulty: 'easy' },
  { id: 'sb-tur-003', category: 'language', displayText: 'İstanbul güzel bir şehir', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Istanbul is a beautiful city', difficulty: 'easy' },
  { id: 'sb-tur-004', category: 'language', displayText: 'Bugün hava çok güzel', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Today the weather is very beautiful', difficulty: 'medium' },
  { id: 'sb-tur-005', category: 'language', displayText: 'Çay içmek ister misiniz?', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Would you like some tea?', difficulty: 'medium' },
  { id: 'sb-tur-006', category: 'language', displayText: 'Türkiye güzel bir ülke', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Turkey is a beautiful country', difficulty: 'easy' },
  { id: 'sb-tur-007', category: 'language', displayText: 'Günaydın', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'Good morning', difficulty: 'easy' },
  { id: 'sb-tur-008', category: 'language', displayText: 'Ne zaman geleceksin?', answer: 'Turkish', aliases: ['türkçe', 'turkce', 'turkish language'], hint: 'When will you come?', difficulty: 'hard' },

  // ── Welsh ─────────────────────────────────────────────────────────────────────

  { id: 'sb-wel-001', category: 'language', displayText: 'Bore da', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'Good morning - Welsh has distinctive ll and dd', difficulty: 'easy' },
  { id: 'sb-wel-002', category: 'language', displayText: 'Diolch yn fawr', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-wel-003', category: 'language', displayText: 'Croeso i Gymru', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'Welcome to Wales', difficulty: 'easy' },
  { id: 'sb-wel-004', category: 'language', displayText: 'Mae hi\'n bwrw glaw', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'It is raining', difficulty: 'medium' },
  { id: 'sb-wel-005', category: 'language', displayText: 'Sut mae?', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'How are you?', difficulty: 'easy' },
  { id: 'sb-wel-006', category: 'language', displayText: 'Rwyf wrth fy modd', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'I am in my element / I love it', difficulty: 'hard' },
  { id: 'sb-wel-007', category: 'language', displayText: 'Llangollen', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'A town in Wales - double-L is a Welsh consonant', difficulty: 'medium' },
  { id: 'sb-wel-008', category: 'language', displayText: 'Cymraeg yw fy iaith gyntaf', answer: 'Welsh', aliases: ['cymraeg', 'welsh language'], hint: 'Welsh is my first language', difficulty: 'hard' },

  // ── Additional Languages ─────────────────────────────────────────────────────

  { id: 'sb-odi-001', category: 'language', displayText: 'ନମସ୍କାର', answer: 'Odia', aliases: ['oriya', 'odia language', 'oriya language'], hint: 'A greeting in Odia, written in the rounded Odia script', difficulty: 'hard' },
  { id: 'sb-mar-001', category: 'language', displayText: 'तुम्ही कसे आहात?', answer: 'Marathi', aliases: ['marathi language', 'marāṭhī', 'marathi'], hint: 'How are you? - Devanagari, but the तुम्ही form points toward Marathi', difficulty: 'hard' },
  { id: 'sb-san-001', category: 'language', displayText: 'सर्वे भवन्तु सुखिनः', answer: 'Sanskrit', aliases: ['samskrita', 'saṃskṛta', 'sanskrit language'], hint: 'A classical Sanskrit benediction', difficulty: 'hard' },
  { id: 'sb-lat-001', category: 'language', displayText: 'Carpe diem', answer: 'Latin', aliases: ['latina', 'latin language'], hint: 'A famous Latin phrase meaning "seize the day"', difficulty: 'medium' },
  { id: 'sb-alb-001', category: 'language', displayText: 'Mirëdita', answer: 'Albanian', aliases: ['shqip', 'albanian language'], hint: 'Good day in Albanian - ë is common in Albanian spelling', difficulty: 'medium' },
  { id: 'sb-nep-001', category: 'language', displayText: 'तपाईंलाई कस्तो छ?', answer: 'Nepali', aliases: ['nepali language', 'nepali'], hint: 'How are you? - Devanagari with Nepali forms like तपाईंलाई', difficulty: 'hard' },
  { id: 'sb-uig-001', category: 'language', displayText: 'ياخشىمۇسىز', answer: 'Uyghur', aliases: ['uygur', 'uighur', 'uyghur language'], hint: 'A Uyghur greeting written in the Arabic-based Uyghur script', difficulty: 'hard' },
  { id: 'sb-uzb-001', category: 'language', displayText: 'O‘zbekiston go‘zal mamlakat', answer: 'Uzbek', aliases: ['o‘zbek', 'ozbek', 'uzbek language'], hint: 'Uzbek text in Latin script; look for O‘zbekiston and the okina-like mark', difficulty: 'hard' },
  { id: 'sb-kaz-001', category: 'language', displayText: 'Сәлеметсіз бе?', answer: 'Kazakh', aliases: ['qazaq', 'kazakh language'], hint: 'A Kazakh greeting; ә and і distinguish it from Russian Cyrillic', difficulty: 'hard' },
  { id: 'sb-kur-001', category: 'language', displayText: 'Tu çawa yî?', answer: 'Kurdish', aliases: ['kurmanji', 'sorani', 'kurdish language'], hint: 'How are you? - Kurmanji Kurdish in Latin script', difficulty: 'hard' },
  { id: 'sb-lao-001', category: 'language', displayText: 'ສະບາຍດີ', answer: 'Lao', aliases: ['laotian', 'lao language'], hint: 'A Lao greeting; the script resembles Thai but has its own rounded forms', difficulty: 'hard' },
  { id: 'sb-bur-001', category: 'language', displayText: 'မင်္ဂလာပါ', answer: 'Burmese', aliases: ['myanmar', 'myanmar language', 'burmese language'], hint: 'A Burmese greeting written in the rounded Myanmar script', difficulty: 'hard' },
  { id: 'sb-khm-001', category: 'language', displayText: 'សូមស្វាគមន៍', answer: 'Khmer', aliases: ['cambodia', 'cambodia language'], hint: '\'Your welcome\' in Khmer. Khmer is spoken primarily in Cambodia.', difficulty: 'hard'},

  // ── Polish ────────────────────────────────────────────────────────────────────

  { id: 'sb-pol-001', category: 'language', displayText: 'Dzień dobry', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'Good day - look for ń and the ń cluster', difficulty: 'easy' },
  { id: 'sb-pol-002', category: 'language', displayText: 'Dziękuję bardzo', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'Thank you very much - ę is a nasal e', difficulty: 'easy' },
  { id: 'sb-pol-003', category: 'language', displayText: 'Warszawa jest piękna', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'Warsaw is beautiful', difficulty: 'easy' },
  { id: 'sb-pol-004', category: 'language', displayText: 'Jak się masz?', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'How are you? - ę and się are Polish markers', difficulty: 'medium' },
  { id: 'sb-pol-005', category: 'language', displayText: 'Przepraszam, gdzie jest...', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'Excuse me, where is... - note the prz cluster', difficulty: 'medium' },
  { id: 'sb-pol-006', category: 'language', displayText: 'Język polski jest piękny', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'The Polish language is beautiful', difficulty: 'easy' },
  { id: 'sb-pol-007', category: 'language', displayText: 'Dobranoc', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'Good night', difficulty: 'medium' },
  { id: 'sb-pol-008', category: 'language', displayText: 'Nie rozumiem', answer: 'Polish', aliases: ['polski', 'polish language'], hint: 'I do not understand', difficulty: 'hard' },

  // ── Czech ─────────────────────────────────────────────────────────────────────

  { id: 'sb-cze-001', category: 'language', displayText: 'Dobrý den', answer: 'Czech', aliases: ['cestina', 'czech language', 'čeština'], hint: 'Good day - ý with an accent is common in Czech', difficulty: 'easy' },
  { id: 'sb-cze-002', category: 'language', displayText: 'Děkuji moc', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'Thank you very much - ě is uniquely Czech', difficulty: 'easy' },
  { id: 'sb-cze-003', category: 'language', displayText: 'Praha je krásné město', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'Prague is a beautiful city', difficulty: 'medium' },
  { id: 'sb-cze-004', category: 'language', displayText: 'Mluvíte česky?', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'Do you speak Czech? - í and ě', difficulty: 'medium' },
  { id: 'sb-cze-005', category: 'language', displayText: 'Jak se máš?', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'How are you? - á and š', difficulty: 'medium' },
  { id: 'sb-cze-006', category: 'language', displayText: 'Řeka Vltava', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'The Vltava River - Ř is unique to Czech', difficulty: 'hard' },
  { id: 'sb-cze-007', category: 'language', displayText: 'Jsem z České republiky', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'I am from the Czech Republic', difficulty: 'hard' },
  { id: 'sb-cze-008', category: 'language', displayText: 'Dobrou noc', answer: 'Czech', aliases: ['cestina', 'czech language'], hint: 'Good night', difficulty: 'medium' },

  // ── Slovak ────────────────────────────────────────────────────────────────────

  { id: 'sb-slk-001', category: 'language', displayText: 'Dobrý deň', answer: 'Slovak', aliases: ['slovensky', 'slovak language', 'slovenčina', 'czech'], hint: 'Good day - deň uses ň, unique to Slovak', difficulty: 'medium' },
  { id: 'sb-slk-002', category: 'language', displayText: 'Ďakujem', answer: 'Slovak', aliases: ['slovensky', 'slovak language'], hint: 'Thank you - Ď is unique to Slovak', difficulty: 'easy' },
  { id: 'sb-slk-003', category: 'language', displayText: 'Bratislava je hlavné mesto', answer: 'Slovak', aliases: ['slovensky', 'slovak language'], hint: 'Bratislava is the capital city', difficulty: 'medium' },
  { id: 'sb-slk-004', category: 'language', displayText: 'Hovoríte po slovensky?', answer: 'Slovak', aliases: ['slovensky', 'slovak language'], hint: 'Do you speak Slovak?', difficulty: 'hard' },
  { id: 'sb-slk-005', category: 'language', displayText: 'Slovenská republika', answer: 'Slovak', aliases: ['slovensky', 'slovak language'], hint: 'The Slovak Republic', difficulty: 'medium' },
  { id: 'sb-slk-006', category: 'language', displayText: 'Ľúbim ťa', answer: 'Slovak', aliases: ['slovensky', 'slovak language'], hint: 'I love you - Ľ is exclusively Slovak', difficulty: 'hard' },

  // ── Hungarian ────────────────────────────────────────────────────────────────

  { id: 'sb-hun-001', category: 'language', displayText: 'Jó reggelt', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'Good morning - ő is a Hungarian vowel', difficulty: 'easy' },
  { id: 'sb-hun-002', category: 'language', displayText: 'Köszönöm szépen', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'Thank you very much - ő and ö', difficulty: 'easy' },
  { id: 'sb-hun-003', category: 'language', displayText: 'Magyarország', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'Hungary - gy is a digraph unique to Hungarian', difficulty: 'easy' },
  { id: 'sb-hun-004', category: 'language', displayText: 'Budapest szép város', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'Budapest is a beautiful city', difficulty: 'easy' },
  { id: 'sb-hun-005', category: 'language', displayText: 'Hogyan vagy?', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'How are you?', difficulty: 'medium' },
  { id: 'sb-hun-006', category: 'language', displayText: 'Nem értem', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'I do not understand', difficulty: 'medium' },
  { id: 'sb-hun-007', category: 'language', displayText: 'Szép napot kívánok', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'Have a nice day', difficulty: 'hard' },
  { id: 'sb-hun-008', category: 'language', displayText: 'Viszontlátásra', answer: 'Hungarian', aliases: ['magyar', 'hungarian language'], hint: 'Goodbye (formal)', difficulty: 'hard' },

  // ── Icelandic ─────────────────────────────────────────────────────────────────

  { id: 'sb-ice-001', category: 'language', displayText: 'Góðan dag', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'Good day - ð is a letter only Icelandic uses actively', difficulty: 'easy' },
  { id: 'sb-ice-002', category: 'language', displayText: 'Takk fyrir', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'Thank you', difficulty: 'easy' },
  { id: 'sb-ice-003', category: 'language', displayText: 'Ísland er fallegt land', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'Iceland is a beautiful country', difficulty: 'easy' },
  { id: 'sb-ice-004', category: 'language', displayText: 'Hvernig líður þér?', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'How are you? - þ (thorn) is unique to Icelandic', difficulty: 'medium' },
  { id: 'sb-ice-005', category: 'language', displayText: 'Þetta er gott', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'This is good - þ starts the sentence', difficulty: 'easy' },
  { id: 'sb-ice-006', category: 'language', displayText: 'Reykjavík er höfuðborgin', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'Reykjavik is the capital', difficulty: 'medium' },
  { id: 'sb-ice-007', category: 'language', displayText: 'Við sjáumst', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'See you later', difficulty: 'medium' },
  { id: 'sb-ice-008', category: 'language', displayText: 'Þarftu hjálp?', answer: 'Icelandic', aliases: ['islenska', 'íslenska', 'icelandic language'], hint: 'Do you need help? - þ and á', difficulty: 'hard' },

  // ── Swahili ────────────────────────────────────────────────────────────────────

  { id: 'sb-swa-001', category: 'language', displayText: 'Habari za asubuhi', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'Good morning news - Bantu structure', difficulty: 'easy' },
  { id: 'sb-swa-002', category: 'language', displayText: 'Asante sana', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-swa-003', category: 'language', displayText: 'Karibu Kenya', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'Welcome to Kenya', difficulty: 'easy' },
  { id: 'sb-swa-004', category: 'language', displayText: 'Mimi ni mwalimu', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'I am a teacher - mw- prefix is Swahili', difficulty: 'medium' },
  { id: 'sb-swa-005', category: 'language', displayText: 'Ninahitaji msaada', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'I need help', difficulty: 'medium' },
  { id: 'sb-swa-006', category: 'language', displayText: 'Tutaonana kesho', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: "We'll see each other tomorrow", difficulty: 'hard' },
  { id: 'sb-swa-007', category: 'language', displayText: 'Nakupenda', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'I love you', difficulty: 'medium' },
  { id: 'sb-swa-008', category: 'language', displayText: 'Jambo', answer: 'Swahili', aliases: ['kiswahili', 'swahili language'], hint: 'Hello - a well-known Swahili greeting', difficulty: 'easy' },

  // ── Vietnamese ────────────────────────────────────────────────────────────────

  { id: 'sb-vie-001', category: 'language', displayText: 'Xin chào', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Hello - tonal diacritics are key', difficulty: 'easy' },
  { id: 'sb-vie-002', category: 'language', displayText: 'Cảm ơn bạn rất nhiều', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-vie-003', category: 'language', displayText: 'Việt Nam đất nước tươi đẹp', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Vietnam is a beautiful country', difficulty: 'easy' },
  { id: 'sb-vie-004', category: 'language', displayText: 'Hà Nội là thủ đô', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Hanoi is the capital', difficulty: 'medium' },
  { id: 'sb-vie-005', category: 'language', displayText: 'Bạn có khỏe không?', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Are you well?', difficulty: 'medium' },
  { id: 'sb-vie-006', category: 'language', displayText: 'Tôi yêu Việt Nam', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'I love Vietnam', difficulty: 'easy' },
  { id: 'sb-vie-007', category: 'language', displayText: 'Chúc mừng năm mới', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Happy New Year', difficulty: 'medium' },
  { id: 'sb-vie-008', category: 'language', displayText: 'Tạm biệt', answer: 'Vietnamese', aliases: ['tieng viet', 'vietnamese language'], hint: 'Goodbye', difficulty: 'medium' },

  // ── Indonesian ────────────────────────────────────────────────────────────────

  { id: 'sb-ind-001', category: 'language', displayText: 'Selamat pagi', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'Good morning', difficulty: 'easy' },
  { id: 'sb-ind-002', category: 'language', displayText: 'Terima kasih banyak', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-ind-003', category: 'language', displayText: 'Jakarta adalah ibu kota', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'Jakarta is the capital', difficulty: 'easy' },
  { id: 'sb-ind-004', category: 'language', displayText: 'Indonesia adalah negara kepulauan', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'Indonesia is an archipelago nation', difficulty: 'medium' },
  { id: 'sb-ind-005', category: 'language', displayText: 'Saya bisa berbicara bahasa Indonesia', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'I can speak Indonesian - bisa = can', difficulty: 'medium' },
  { id: 'sb-ind-006', category: 'language', displayText: 'Bagaimana keadaan Anda?', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'How are you? - Bagaimana is distinctly Indonesian', difficulty: 'medium' },
  { id: 'sb-ind-007', category: 'language', displayText: 'Selamat datang di Indonesia', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'Welcome to Indonesia', difficulty: 'easy' },
  { id: 'sb-ind-008', category: 'language', displayText: 'Sampai jumpa', answer: 'Indonesian', aliases: ['bahasa indonesia', 'indonesian language'], hint: 'See you later', difficulty: 'hard' },

  // ── Malay ─────────────────────────────────────────────────────────────────────

  { id: 'sb-mly-001', category: 'language', displayText: 'Apa khabar?', answer: 'Malay', aliases: ['bahasa melayu', 'malay language'], hint: 'How are you? - khabar is distinctly Malay', difficulty: 'medium' },
  { id: 'sb-mly-002', category: 'language', displayText: 'Sama-sama', answer: 'Malay', aliases: ['bahasa melayu', 'malay language'], hint: "You're welcome - used in Malaysia", difficulty: 'medium' },
  { id: 'sb-mly-003', category: 'language', displayText: 'Selamat datang ke Malaysia', answer: 'Malay', aliases: ['bahasa melayu', 'malay language'], hint: 'Welcome to Malaysia', difficulty: 'easy' },
  { id: 'sb-mly-004', category: 'language', displayText: 'Saya boleh bertutur bahasa Melayu', answer: 'Malay', aliases: ['bahasa melayu', 'malay language'], hint: 'I can speak Malay - boleh and bertutur are Malay', difficulty: 'hard' },
  { id: 'sb-mly-005', category: 'language', displayText: 'Kuala Lumpur ibu kota Malaysia', answer: 'Malay', aliases: ['bahasa melayu', 'malay language'], hint: 'Kuala Lumpur is the capital of Malaysia', difficulty: 'easy' },
  { id: 'sb-mly-006', category: 'language', displayText: 'Terima kasih kerana membantu', answer: 'Malay', aliases: ['bahasa melayu', 'malay language'], hint: 'Thank you for helping - kerana is Malay', difficulty: 'hard' },

  // ── Irish (Gaeilge) ───────────────────────────────────────────────────────────

  { id: 'sb-iri-001', category: 'language', displayText: 'Dia duit', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'Hello - literally "God to you"', difficulty: 'easy' },
  { id: 'sb-iri-002', category: 'language', displayText: 'Go raibh maith agat', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'Thank you - raibh and agat are Irish', difficulty: 'easy' },
  { id: 'sb-iri-003', category: 'language', displayText: 'Fáilte go hÉirinn', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'Welcome to Ireland - fáilte is famous', difficulty: 'easy' },
  { id: 'sb-iri-004', category: 'language', displayText: 'Conas atá tú?', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'How are you? - atá is an Irish verb form', difficulty: 'medium' },
  { id: 'sb-iri-005', category: 'language', displayText: 'Tá áthas orm', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'I am happy - tá and orm are Irish grammar', difficulty: 'medium' },
  { id: 'sb-iri-006', category: 'language', displayText: 'Cad is ainm duit?', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'What is your name?', difficulty: 'hard' },
  { id: 'sb-iri-007', category: 'language', displayText: 'Slán go fóill', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'Goodbye for now', difficulty: 'hard' },
  { id: 'sb-iri-008', category: 'language', displayText: 'Is breá liom Éire', answer: 'Irish', aliases: ['gaeilge', 'irish gaelic', 'irish language'], hint: 'I love Ireland - liom and Éire', difficulty: 'hard' },

  // ── Basque ────────────────────────────────────────────────────────────────────

  { id: 'sb-baq-001', category: 'language', displayText: 'Kaixo', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'Hello in Basque - a language isolate', difficulty: 'easy' },
  { id: 'sb-baq-002', category: 'language', displayText: 'Eskerrik asko', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'Thank you very much', difficulty: 'easy' },
  { id: 'sb-baq-003', category: 'language', displayText: 'Euskal Herria', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'The Basque Country', difficulty: 'medium' },
  { id: 'sb-baq-004', category: 'language', displayText: 'Egun on', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'Good morning', difficulty: 'easy' },
  { id: 'sb-baq-005', category: 'language', displayText: 'Zer moduz?', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'How are you?', difficulty: 'medium' },
  { id: 'sb-baq-006', category: 'language', displayText: 'Mila esker', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'A thousand thanks', difficulty: 'medium' },
  { id: 'sb-baq-007', category: 'language', displayText: 'Agur', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'Goodbye in Basque', difficulty: 'easy' },
  { id: 'sb-baq-008', category: 'language', displayText: 'Zenbat da hori?', answer: 'Basque', aliases: ['euskara', 'euskera', 'basque language'], hint: 'How much does that cost?', difficulty: 'hard' },

  // ── Croatian ──────────────────────────────────────────────────────────────────

  { id: 'sb-hrv-001', category: 'language', displayText: 'Dobar dan', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'Good day - similar to Serbian/Bosnian', difficulty: 'medium' },
  { id: 'sb-hrv-002', category: 'language', displayText: 'Hvala lijepa', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'Thank you very much - lijepa is Croatian spelling', difficulty: 'medium' },
  { id: 'sb-hrv-003', category: 'language', displayText: 'Hrvatska je lijepa zemlja', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'Croatia is a beautiful country - ij is Croatian', difficulty: 'easy' },
  { id: 'sb-hrv-004', category: 'language', displayText: 'Zagreb je glavni grad', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'Zagreb is the main city', difficulty: 'easy' },
  { id: 'sb-hrv-005', category: 'language', displayText: 'Dobro jutro', answer: 'Croatian', aliases: ['hrvatski', 'croatian language', 'bosnian', 'serbian'], hint: 'Good morning - shared across South Slavic', difficulty: 'hard' },
  { id: 'sb-hrv-006', category: 'language', displayText: 'Vidimo se', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'See you later', difficulty: 'medium' },
  { id: 'sb-hrv-007', category: 'language', displayText: 'Lijepo mi je upoznati vas', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'Nice to meet you - ij is a Croatian vowel combination', difficulty: 'hard' },
  { id: 'sb-hrv-008', category: 'language', displayText: 'Govorite li engleski?', answer: 'Croatian', aliases: ['hrvatski', 'croatian language'], hint: 'Do you speak English?', difficulty: 'hard' },

  // ── Serbian ───────────────────────────────────────────────────────────────────

  { id: 'sb-srp-001', category: 'language', displayText: 'Beograd je prestonica Srbije', answer: 'Serbian', aliases: ['srpski', 'serbian language'], hint: 'Belgrade is the capital of Serbia', difficulty: 'easy' },
  { id: 'sb-srp-002', category: 'language', displayText: 'Hvala lepo', answer: 'Serbian', aliases: ['srpski', 'serbian language', 'croatian'], hint: 'Thank you very much - shared phrase', difficulty: 'hard' },
  { id: 'sb-srp-003', category: 'language', displayText: 'Srbija je lepa zemlja', answer: 'Serbian', aliases: ['srpski', 'serbian language'], hint: 'Serbia is a beautiful country - lepa vs Croatian lijepa', difficulty: 'medium' },
  { id: 'sb-srp-004', category: 'language', displayText: 'Kako ste?', answer: 'Serbian', aliases: ['srpski', 'serbian language', 'croatian'], hint: 'How are you? (formal) - shared form', difficulty: 'hard' },
  { id: 'sb-srp-005', category: 'language', displayText: 'Zdravo', answer: 'Serbian', aliases: ['srpski', 'serbian language', 'croatian'], hint: 'Hello - common South Slavic greeting', difficulty: 'hard' },
  { id: 'sb-srp-006', category: 'language', displayText: 'Doviđenja', answer: 'Serbian', aliases: ['srpski', 'serbian language'], hint: 'Goodbye - đ is Serbian/Croatian letter', difficulty: 'medium' },

  // ── Bosnian ───────────────────────────────────────────────────────────────────

  { id: 'sb-bos-001', category: 'language', displayText: 'Bosna i Hercegovina', answer: 'Bosnian', aliases: ['bosanski', 'bosnian language'], hint: 'Bosnia and Herzegovina', difficulty: 'easy' },
  { id: 'sb-bos-002', category: 'language', displayText: 'Sarajevo je glavni grad', answer: 'Bosnian', aliases: ['bosanski', 'bosnian language'], hint: 'Sarajevo is the main city', difficulty: 'easy' },
  { id: 'sb-bos-003', category: 'language', displayText: 'Selam', answer: 'Bosnian', aliases: ['bosanski', 'bosnian language'], hint: 'Islamic greeting used in Bosnia', difficulty: 'medium' },
  { id: 'sb-bos-004', category: 'language', displayText: 'Hvala', answer: 'Bosnian', aliases: ['bosanski', 'bosnian language', 'croatian', 'serbian'], hint: 'Thank you - shared across the region', difficulty: 'hard' },
  { id: 'sb-bos-005', category: 'language', displayText: 'Lijepo je ovdje', answer: 'Bosnian', aliases: ['bosanski', 'bosnian language', 'croatian'], hint: 'It is beautiful here', difficulty: 'hard' },
  { id: 'sb-bos-006', category: 'language', displayText: 'Kako si?', answer: 'Bosnian', aliases: ['bosanski', 'bosnian language', 'croatian', 'serbian'], hint: 'How are you? (informal)', difficulty: 'hard' },

  // ── Norwegian ─────────────────────────────────────────────────────────────────

  { id: 'sb-nor-001', category: 'language', displayText: 'God morgen', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: "Good morning - God with no 'd' sound", difficulty: 'medium' },
  { id: 'sb-nor-002', category: 'language', displayText: 'Takk for det', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: 'Thank you for that', difficulty: 'medium' },
  { id: 'sb-nor-003', category: 'language', displayText: 'Norge er et vakkert land', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: 'Norway is a beautiful country', difficulty: 'easy' },
  { id: 'sb-nor-004', category: 'language', displayText: 'Oslo er hovedstaden', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: 'Oslo is the capital', difficulty: 'easy' },
  { id: 'sb-nor-005', category: 'language', displayText: 'Vær så snill', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: 'Please - vær is Norwegian', difficulty: 'hard' },
  { id: 'sb-nor-006', category: 'language', displayText: 'Ha det bra', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: 'Take care / Goodbye', difficulty: 'medium' },
  { id: 'sb-nor-007', category: 'language', displayText: 'Unnskyld meg', answer: 'Norwegian', aliases: ['norsk', 'norwegian language'], hint: 'Excuse me', difficulty: 'medium' },
  { id: 'sb-nor-008', category: 'language', displayText: 'Hvordan har du det?', answer: 'Norwegian', aliases: ['norsk', 'norwegian language', 'danish'], hint: 'How are you? - same in Norwegian and Danish', difficulty: 'hard' },

  // ── Swedish ────────────────────────────────────────────────────────────────────

  { id: 'sb-swe-001', category: 'language', displayText: 'God morgon', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'Good morning - Swedish has morgon vs Norwegian morgen', difficulty: 'medium' },
  { id: 'sb-swe-002', category: 'language', displayText: 'Tack så mycket', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'Thank you very much - tack is Swedish', difficulty: 'easy' },
  { id: 'sb-swe-003', category: 'language', displayText: 'Sverige är ett vackert land', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'Sweden is a beautiful country', difficulty: 'easy' },
  { id: 'sb-swe-004', category: 'language', displayText: 'Stockholm är huvudstaden', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'Stockholm is the capital', difficulty: 'easy' },
  { id: 'sb-swe-005', category: 'language', displayText: 'Hur mår du?', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'How are you? - mår is Swedish', difficulty: 'medium' },
  { id: 'sb-swe-006', category: 'language', displayText: 'Förlåt', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'Sorry / Excuse me - ö is common in Swedish', difficulty: 'medium' },
  { id: 'sb-swe-007', category: 'language', displayText: 'Varsågod', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: "Here you go / You're welcome", difficulty: 'hard' },
  { id: 'sb-swe-008', category: 'language', displayText: 'Hej då', answer: 'Swedish', aliases: ['svenska', 'swedish language'], hint: 'Goodbye - hej is Swedish', difficulty: 'easy' },

  // ── Danish ────────────────────────────────────────────────────────────────────

  { id: 'sb-dan-001', category: 'language', displayText: 'Mange tak', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'Many thanks - mange tak is specifically Danish', difficulty: 'easy' },
  { id: 'sb-dan-002', category: 'language', displayText: 'Danmark er et smukt land', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'Denmark is a beautiful country', difficulty: 'easy' },
  { id: 'sb-dan-003', category: 'language', displayText: 'København er hovedstaden', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'Copenhagen is the capital', difficulty: 'easy' },
  { id: 'sb-dan-004', category: 'language', displayText: 'Undskyld', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'Sorry / Excuse me - Danish spelling', difficulty: 'medium' },
  { id: 'sb-dan-005', category: 'language', displayText: 'Hyggelig aften', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'A cozy evening - hygge is Danish', difficulty: 'medium' },
  { id: 'sb-dan-006', category: 'language', displayText: 'Vær venlig', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'Be kind / please', difficulty: 'hard' },
  { id: 'sb-dan-007', category: 'language', displayText: 'Hej hej', answer: 'Danish', aliases: ['dansk', 'danish language', 'swedish'], hint: 'Bye bye - used in Danish and Swedish', difficulty: 'hard' },
  { id: 'sb-dan-008', category: 'language', displayText: 'Jeg elsker dig', answer: 'Danish', aliases: ['dansk', 'danish language'], hint: 'I love you - elsker is Danish', difficulty: 'medium' },

  // ── Afrikaans ─────────────────────────────────────────────────────────────────

  { id: 'sb-afr-001', category: 'language', displayText: 'Goeie more', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'Good morning - goeie is Afrikaans', difficulty: 'easy' },
  { id: 'sb-afr-002', category: 'language', displayText: 'Baie dankie', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'Thank you very much - baie is Afrikaans', difficulty: 'easy' },
  { id: 'sb-afr-003', category: 'language', displayText: 'Suid-Afrika is \'n pragtige land', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'South Africa is a beautiful country', difficulty: 'easy' },
  { id: 'sb-afr-004', category: 'language', displayText: 'Hoe gaan dit?', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'How is it going?', difficulty: 'medium' },
  { id: 'sb-afr-005', category: 'language', displayText: 'Jy is welkom', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: "You are welcome - jy is Afrikaans for 'you'", difficulty: 'medium' },
  { id: 'sb-afr-006', category: 'language', displayText: 'Tot siens', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'Until seeing - Afrikaans goodbye', difficulty: 'easy' },
  { id: 'sb-afr-007', category: 'language', displayText: 'Die see is baie mooi', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'The sea is very beautiful', difficulty: 'medium' },
  { id: 'sb-afr-008', category: 'language', displayText: 'Ek is bly om jou te sien', answer: 'Afrikaans', aliases: ['afrikaans language'], hint: 'I am glad to see you', difficulty: 'hard' },

  // ── Romanian ───────────────────────────────────────────────────────────────────

  { id: 'sb-ron-001', category: 'language', displayText: 'Bună ziua', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Good day - ă is a key Romanian vowel', difficulty: 'easy' },
  { id: 'sb-ron-002', category: 'language', displayText: 'Mulțumesc frumos', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Thank you very much - ț is uniquely Romanian', difficulty: 'easy' },
  { id: 'sb-ron-003', category: 'language', displayText: 'România este o țară frumoasă', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Romania is a beautiful country - ț and â', difficulty: 'easy' },
  { id: 'sb-ron-004', category: 'language', displayText: 'Ce mai faci?', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'How are you? - ce and mai are Romanian', difficulty: 'medium' },
  { id: 'sb-ron-005', category: 'language', displayText: 'La revedere', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Goodbye - sounds like French revoir', difficulty: 'medium' },
  { id: 'sb-ron-006', category: 'language', displayText: 'Vorbești românește?', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Do you speak Romanian? - ș is Romanian', difficulty: 'medium' },
  { id: 'sb-ron-007', category: 'language', displayText: 'Noapte bună', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Good night', difficulty: 'medium' },
  { id: 'sb-ron-008', category: 'language', displayText: 'Îmi pare bine', answer: 'Romanian', aliases: ['romana', 'romanian language'], hint: 'Nice to meet you / I am glad', difficulty: 'hard' },

  // ── Estonian ──────────────────────────────────────────────────────────────────

  { id: 'sb-est-001', category: 'language', displayText: 'Tere hommikust', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Good morning - Estonian is related to Finnish', difficulty: 'medium' },
  { id: 'sb-est-002', category: 'language', displayText: 'Aitäh väga', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Thank you very much - ä is Estonian', difficulty: 'medium' },
  { id: 'sb-est-003', category: 'language', displayText: 'Eesti on ilus maa', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Estonia is a beautiful country', difficulty: 'easy' },
  { id: 'sb-est-004', category: 'language', displayText: 'Tallinn on pealinn', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Tallinn is the capital', difficulty: 'easy' },
  { id: 'sb-est-005', category: 'language', displayText: 'Kuidas läheb?', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'How is it going?', difficulty: 'medium' },
  { id: 'sb-est-006', category: 'language', displayText: 'Head aega', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Goodbye - literally "good time"', difficulty: 'hard' },
  { id: 'sb-est-007', category: 'language', displayText: 'Vabandust', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Excuse me / Sorry', difficulty: 'hard' },
  { id: 'sb-est-008', category: 'language', displayText: 'Palun', answer: 'Estonian', aliases: ['eesti', 'estonian language'], hint: 'Please / Here you go', difficulty: 'hard' },

  // ── Latvian ────────────────────────────────────────────────────────────────────

  { id: 'sb-lav-001', category: 'language', displayText: 'Labrīt', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Good morning - macron ī is Latvian', difficulty: 'medium' },
  { id: 'sb-lav-002', category: 'language', displayText: 'Paldies', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Thank you in Latvian', difficulty: 'easy' },
  { id: 'sb-lav-003', category: 'language', displayText: 'Latvija ir skaista valsts', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Latvia is a beautiful country', difficulty: 'easy' },
  { id: 'sb-lav-004', category: 'language', displayText: 'Rīga ir galvaspilsēta', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Riga is the capital', difficulty: 'easy' },
  { id: 'sb-lav-005', category: 'language', displayText: 'Kā iet?', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'How is it going?', difficulty: 'medium' },
  { id: 'sb-lav-006', category: 'language', displayText: 'Uz redzēšanos', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Until seeing - Latvian goodbye', difficulty: 'hard' },
  { id: 'sb-lav-007', category: 'language', displayText: 'Lūdzu', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Please - ū is Latvian long vowel', difficulty: 'hard' },
  { id: 'sb-lav-008', category: 'language', displayText: 'Labdien', answer: 'Latvian', aliases: ['latviesu', 'latvian language'], hint: 'Good afternoon', difficulty: 'medium' },

  // ── Lithuanian ─────────────────────────────────────────────────────────────────

  { id: 'sb-lit-001', category: 'language', displayText: 'Labas rytas', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'Good morning - Lithuanian Baltic language', difficulty: 'medium' },
  { id: 'sb-lit-002', category: 'language', displayText: 'Ačiū', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'Thank you - č and ū are Lithuanian', difficulty: 'easy' },
  { id: 'sb-lit-003', category: 'language', displayText: 'Lietuva yra graži šalis', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'Lithuania is a beautiful country', difficulty: 'easy' },
  { id: 'sb-lit-004', category: 'language', displayText: 'Vilnius yra sostinė', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'Vilnius is the capital', difficulty: 'easy' },
  { id: 'sb-lit-005', category: 'language', displayText: 'Kaip sekasi?', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'How are you doing?', difficulty: 'medium' },
  { id: 'sb-lit-006', category: 'language', displayText: 'Viso gero', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'All the best - goodbye', difficulty: 'hard' },
  { id: 'sb-lit-007', category: 'language', displayText: 'Prašau', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'Please', difficulty: 'hard' },
  { id: 'sb-lit-008', category: 'language', displayText: 'Labai malonu susipažinti', answer: 'Lithuanian', aliases: ['lietuviu', 'lithuanian language'], hint: 'Very nice to meet you', difficulty: 'hard' },

  // ══════════════════════════════════════════════════════════════════════
  // TYPE C - SURNAME GEOGRAPHY
  // Player sees a surname and types the country where it is most common.
  // Aliases include all legitimately accepted answers (e.g. "Brazil" for "Fernandes").
  // ══════════════════════════════════════════════════════════════════════

  // ── Japan ─────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-j001', category: 'surname', displayText: 'Sato', answer: 'Japan', aliases: ['japanese'], hint: 'The single most common surname in Japan', difficulty: 'easy' },
  { id: 'sb-sur-j002', category: 'surname', displayText: 'Suzuki', answer: 'Japan', aliases: ['japanese'], hint: 'One of the top three Japanese surnames', difficulty: 'easy' },
  { id: 'sb-sur-j003', category: 'surname', displayText: 'Tanaka', answer: 'Japan', aliases: ['japanese'], hint: 'Literally "middle of the rice field" in Japanese', difficulty: 'easy' },
  { id: 'sb-sur-j004', category: 'surname', displayText: 'Nakamura', answer: 'Japan', aliases: ['japanese'], hint: 'Common Japanese surname meaning "in the village"', difficulty: 'easy' },
  { id: 'sb-sur-j005', category: 'surname', displayText: 'Yamamoto', answer: 'Japan', aliases: ['japanese'], hint: 'Means "base of the mountain"', difficulty: 'easy' },
  { id: 'sb-sur-j006', category: 'surname', displayText: 'Watanabe', answer: 'Japan', aliases: ['japanese'], hint: 'Means "crossing a river" - top-five Japanese surname', difficulty: 'easy' },
  { id: 'sb-sur-j007', category: 'surname', displayText: 'Kobayashi', answer: 'Japan', aliases: ['japanese'], hint: 'Means "small forest"', difficulty: 'medium' },
  { id: 'sb-sur-j008', category: 'surname', displayText: 'Takahashi', answer: 'Japan', aliases: ['japanese'], hint: 'Means "high bridge" - third most common in Japan', difficulty: 'easy' },
  { id: 'sb-sur-j009', category: 'surname', displayText: 'Ito', answer: 'Japan', aliases: ['japanese'], hint: 'Very common Japanese family name', difficulty: 'medium' },
  { id: 'sb-sur-j010', category: 'surname', displayText: 'Yoshida', answer: 'Japan', aliases: ['japanese'], hint: 'Common Japanese surname, means "lucky rice field"', difficulty: 'medium' },
  { id: 'sb-sur-j011', category: 'surname', displayText: 'Uchida', answer: 'Japan', aliases: ['japanese'], hint: 'Common Japanese surname, means "inside the rice field"', difficulty: 'medium' },

  // ── Korea ─────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-k001', category: 'surname', displayText: 'Kim', answer: 'Korea', aliases: ['south korea', 'korean', 'north korea'], hint: 'Carried by ~21% of all Koreans', difficulty: 'easy' },
  { id: 'sb-sur-k002', category: 'surname', displayText: 'Park', answer: 'Korea', aliases: ['south korea', 'korean'], hint: 'Second most common Korean surname', difficulty: 'easy' },
  { id: 'sb-sur-k003', category: 'surname', displayText: 'Choi', answer: 'Korea', aliases: ['south korea', 'korean', 'choe'], hint: 'Fourth most common Korean surname', difficulty: 'easy' },
  { id: 'sb-sur-k004', category: 'surname', displayText: 'Jeong', answer: 'Korea', aliases: ['south korea', 'korean', 'jung', 'chung'], hint: 'Common Korean name, also romanized Jung or Chung', difficulty: 'medium' },
  { id: 'sb-sur-k005', category: 'surname', displayText: 'Yoon', answer: 'Korea', aliases: ['south korea', 'korean', 'yun'], hint: 'Common Korean surname, also romanized Yun', difficulty: 'medium' },
  { id: 'sb-sur-k006', category: 'surname', displayText: 'Lim', answer: 'Korea', aliases: ['south korea', 'korean', 'rim', 'im'], hint: 'Korean surname, also romanized Rim or Im', difficulty: 'hard' },
  { id: 'sb-sur-k007', category: 'surname', displayText: 'Shin', answer: 'Korea', aliases: ['south korea', 'korean'], hint: 'Common Korean surname', difficulty: 'medium' },
  { id: 'sb-sur-k008', category: 'surname', displayText: 'Sung', answer: 'Korea', aliases: ['south korea', 'korean'], hint: 'More uncommon Korean surname', difficulty: 'hard' },
  { id: 'sb-sur-k009', category: 'surname', displayText: 'Na', answer: 'Korea', aliases: ['south korea', 'korean'], hint: 'More uncommon Korean surname', difficulty: 'hard' },

  // ── China ─────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-c001', category: 'surname', displayText: 'Wang', answer: 'China', aliases: ['chinese', 'taiwan', 'taiwanese'], hint: 'The most common surname in mainland China', difficulty: 'easy' },
  { id: 'sb-sur-c002', category: 'surname', displayText: 'Zhang', answer: 'China', aliases: ['chinese', 'taiwan', 'taiwanese'], hint: 'Third most common surname in China', difficulty: 'easy' },
  { id: 'sb-sur-c003', category: 'surname', displayText: 'Liu', answer: 'China', aliases: ['chinese', 'taiwan'], hint: 'Fourth most common Chinese surname', difficulty: 'easy' },
  { id: 'sb-sur-c004', category: 'surname', displayText: 'Chen', answer: 'China', aliases: ['chinese', 'taiwan', 'taiwanese', 'singapore'], hint: 'Fifth most common in China; very common in Taiwan and SE Asia', difficulty: 'medium' },
  { id: 'sb-sur-c005', category: 'surname', displayText: 'Yang', answer: 'China', aliases: ['chinese', 'taiwan'], hint: 'Sixth most common Chinese surname', difficulty: 'medium' },
  { id: 'sb-sur-c006', category: 'surname', displayText: 'Huang', answer: 'China', aliases: ['chinese', 'taiwan', 'taiwanese'], hint: 'Common Chinese surname meaning "yellow"', difficulty: 'medium' },
  { id: 'sb-sur-c007', category: 'surname', displayText: 'Zhou', answer: 'China', aliases: ['chinese'], hint: 'Very common in China, also an ancient dynasty name', difficulty: 'hard' },
  { id: 'sb-sur-c008', category: 'surname', displayText: 'Wu', answer: 'China', aliases: ['chinese', 'taiwan'], hint: 'Ninth most common Chinese surname', difficulty: 'hard' },
  { id: 'sb-sur-c009', category: 'surname', displayText: 'Feng', answer: 'China', aliases: ['chinese', 'taiwan'], hint: 'Common Chinese surname.', difficulty: 'hard' },
  { id: 'sb-sur-c010', category: 'surname', displayText: 'Jiang', answer: 'China', aliases: ['chinese', 'taiwan', 'taiwanese'], hint: 'Common Chinese surname meaning "river"', difficulty: 'medium' },
  { id: 'sb-sur-c011', category: 'surname', displayText: 'Pan', answer: 'China', aliases: ['chinese', 'taiwan', 'taiwanese', 'vietnam', 'vietnamese', 'korea', 'korean'], hint: 'East Asian surname best known as Mandarin Pan, with related Vietnamese and Korean forms', difficulty: 'hard' },

  // ── Vietnam ───────────────────────────────────────────────────────────────────

  { id: 'sb-sur-v001', category: 'surname', displayText: 'Nguyen', answer: 'Vietnam', aliases: ['vietnamese'], hint: 'Carried by nearly 40% of all Vietnamese people', difficulty: 'easy' },
  { id: 'sb-sur-v002', category: 'surname', displayText: 'Tran', answer: 'Vietnam', aliases: ['vietnamese'], hint: 'Second most common Vietnamese surname', difficulty: 'easy' },
  { id: 'sb-sur-v003', category: 'surname', displayText: 'Pham', answer: 'Vietnam', aliases: ['vietnamese'], hint: 'Third most common Vietnamese surname', difficulty: 'medium' },
  { id: 'sb-sur-v004', category: 'surname', displayText: 'Hoang', answer: 'Vietnam', aliases: ['vietnamese', 'hoàng'], hint: 'Common Vietnamese family name', difficulty: 'medium' },
  { id: 'sb-sur-v005', category: 'surname', displayText: 'Vo', answer: 'Vietnam', aliases: ['vietnamese', 'vũ', 'vu'], hint: 'Common Vietnamese surname, also romanized Vũ', difficulty: 'hard' },
  { id: 'sb-sur-v006', category: 'surname', displayText: 'Dang', answer: 'Vietnam', aliases: ['vietnamese', 'đặng'], hint: 'Common Vietnamese family name', difficulty: 'hard' },
  { id: 'sb-sur-v007', category: 'surname', displayText: 'Giang', answer: 'Vietnam', aliases: ['vietnamese'], hint: 'Vietnamese surname also used as a given name', difficulty: 'hard' },
  { id: 'sb-sur-v008', category: 'surname', displayText: 'Hồ', answer: 'Vietnam', aliases: ['vietnamese', 'ho'], hint: 'Vietnamese surname commonly written Ho without the tone mark', difficulty: 'hard' },

  // ── India ─────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-i001', category: 'surname', displayText: 'Patel', answer: 'India', aliases: ['indian', 'gujarat', 'gujarati'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Gujarati'], preferred: ['Gujarat'] }), hint: 'Originating from Gujarat; now one of the most recognizable Indian surnames', difficulty: 'easy' },
  { id: 'sb-sur-i002', category: 'surname', displayText: 'Singh', answer: 'India', aliases: ['indian', 'punjabi', 'sikh', 'pakistan'], hint: 'Borne by Sikhs and many Hindus across North India', difficulty: 'easy' },
  { id: 'sb-sur-i003', category: 'surname', displayText: 'Sharma', answer: 'India', aliases: ['indian', 'nepali', 'nepal'], hint: 'Brahmin surname across North India and Nepal', difficulty: 'easy' },
  { id: 'sb-sur-i004', category: 'surname', displayText: 'Gupta', answer: 'India', aliases: ['indian'], hint: 'Common Hindu surname from North and Central India', difficulty: 'easy' },
  { id: 'sb-sur-i005', category: 'surname', displayText: 'Kapoor', answer: 'India', aliases: ['indian', 'punjabi'], hint: 'Prominent surname among Punjabi Hindus; linked to Bollywood families', difficulty: 'medium' },
  { id: 'sb-sur-i006', category: 'surname', displayText: 'Iyer', answer: 'India', aliases: ['indian', 'tamil', 'tamil brahmin'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Tamil', 'Tamil Brahmin'], preferred: ['Tamil Nadu'] }), hint: 'Tamil Brahmin surname, primarily from Tamil Nadu', difficulty: 'medium' },
  { id: 'sb-sur-i007', category: 'surname', displayText: 'Nair', answer: 'India', aliases: ['indian', 'kerala', 'malayali'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Malayali'], preferred: ['Kerala'] }), hint: 'An influential caste surname from Kerala', difficulty: 'medium' },
  { id: 'sb-sur-i008', category: 'surname', displayText: 'Mukherjee', answer: 'India', aliases: ['indian', 'bengali', 'west bengal'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Bengali'], preferred: ['West Bengal'] }), hint: 'Prominent Bengali Brahmin surname', difficulty: 'medium' },
  { id: 'sb-sur-i009', category: 'surname', displayText: 'Reddy', answer: 'India', aliases: ['indian', 'andhra', 'telangana', 'telugu'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Telugu'], preferred: ['Andhra', 'Andhra Pradesh', 'Telangana'] }), hint: 'Common Telugu surname from Andhra Pradesh and Telangana', difficulty: 'medium' },
  { id: 'sb-sur-i010', category: 'surname', displayText: 'Chatterjee', answer: 'India', aliases: ['indian', 'bengali'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Bengali'], preferred: ['West Bengal'] }), hint: 'Bengali Brahmin surname from West Bengal', difficulty: 'medium' },
  { id: 'sb-sur-i011', category: 'surname', displayText: 'Chakraborty', answer: 'India', aliases: ['indian', 'bengali'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Bengali'], preferred: ['West Bengal'] }), hint: 'Bengali Brahmin surname from West Bengal', difficulty: 'medium' },
  { id: 'sb-sur-i012', category: 'surname', displayText: 'Gowda', answer: 'India', aliases: ['indian', 'kannada'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Kannada'], preferred: ['Karnataka'] }), hint: 'Common surname in Karnataka', difficulty: 'hard' },
  { id: 'sb-sur-i013', category: 'surname', displayText: 'Banerjee', answer: 'India', aliases: ['indian', 'bengali'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Bengali'], preferred: ['West Bengal'] }), hint: 'Common surname in Bengal', difficulty: 'medium' },
  { id: 'sb-sur-i014', category: 'surname', displayText: 'Bhatt', answer: 'India', aliases: ['indian', 'punjabi', 'kashmiri'], hint: 'Common surname in Kashmir and Punjab meaning "scholar"', difficulty: 'medium' },
  { id: 'sb-sur-i015', category: 'surname', displayText: 'Krishnan', answer: 'India', aliases: ['indian', 'tamil', 'malayali'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Tamil', 'Malayali'], preferred: ['Tamil Nadu'] }), hint: 'Common surname in Tamil Nadu', difficulty: 'medium' },
  { id: 'sb-sur-i016', category: 'surname', displayText: 'Ghattamaneni', answer: 'India', aliases: ['indian', 'telugu', 'andhra', 'telangana'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Telugu'], preferred: ['Andhra Pradesh', 'Andhra', 'Telangana'] }), hint: 'Telugu surname associated with Andhra Pradesh and Telangana', difficulty: 'hard' },
  { id: 'sb-sur-i017', category: 'surname', displayText: 'Pillai', answer: 'India', aliases: ['indian', 'sri lanka', 'sri lankan', 'tamil', 'tamil nadu'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian', 'Sri Lanka', 'Sri Lankan'], specific: ['Tamil'], preferred: ['Tamil Nadu'] }), hint: 'Tamil title and surname found especially in Tamil Nadu and Sri Lanka', difficulty: 'hard' },
  { id: 'sb-sur-i018', category: 'surname', displayText: 'Thakur', answer: 'India', aliases: ['indian', 'nepal', 'nepali', 'north india', 'indian subcontinent'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian', 'Nepal', 'Nepali'], specific: ['Indian subcontinent'], preferred: ['North India'] }), hint: 'Title and surname used across the Indian subcontinent', difficulty: 'hard' },
  { id: 'sb-sur-i019', category: 'surname', displayText: 'Ramasamy', answer: 'India', aliases: ['indian', 'tamil', 'tamil nadu'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['Tamil'], preferred: ['Tamil Nadu'] }), hint: 'Tamil name and surname built from Rama plus a respectful suffix', difficulty: 'hard' },
  { id: 'sb-sur-i020', category: 'surname', displayText: 'Mishra', answer: 'India', aliases: ['indian', 'nepal', 'nepali', 'brahmin', 'north india'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian', 'Nepal', 'Nepali'], specific: ['Brahmin'], preferred: ['North India'] }), hint: 'Brahmin surname found in India and Nepal', difficulty: 'hard' },
  { id: 'sb-sur-i021', category: 'surname', displayText: 'Jaiswal', answer: 'India', aliases: ['indian', 'north india', 'uttar pradesh'], acceptedAnswers: surnameAnswers({ broad: ['India', 'Indian'], specific: ['North India'], preferred: ['Uttar Pradesh'] }), hint: 'North Indian surname associated with trading communities', difficulty: 'hard' },

  // ── Sri Lanka ─────────────────────────────────────────────────────────────────
  { id: 'sb-sur-l001', category: 'surname', displayText: 'Gunawardene', answer: 'Sri Lanka', aliases: ['sri lankan', 'sinhalese'], hint: 'Common Sinhalese surname.', difficulty: 'hard' },
  { id: 'sb-sur-l002', category: 'surname', displayText: 'Thilakarathna', answer: 'Sri Lanka', aliases: ['sri lankan', 'sinhalese'], hint: 'Common Sinhalese surname.', difficulty: 'hard' },
  { id: 'sb-sur-l003', category: 'surname', displayText: 'Ranasinghe', answer: 'Sri Lanka', aliases: ['sri lankan', 'sinhalese'], hint: 'Common Sinhalese surname.', difficulty: 'hard' },
  { id: 'sb-sur-l004', category: 'surname', displayText: 'Wijewardena', answer: 'Sri Lanka', aliases: ['sri lankan', 'sinhalese'], hint: 'Common Sinhalese surname.', difficulty: 'hard' },
  { id: 'sb-sur-l005', category: 'surname', displayText: 'Dissanayake', answer: 'Sri Lanka', aliases: ['sri lankan', 'sinhalese'], hint: 'Common Sinhalese surname.', difficulty: 'hard' },

  // ── Nepal ─────────────────────────────────────────────────────────────────────
  { id: 'sb-sur-np001', category: 'surname', displayText: 'Paudel', answer: 'Nepal', aliases: ['nepal', 'nepali'], hint: 'Common Nepali surname.', difficulty: 'hard' },
  { id: 'sb-sur-np002', category: 'surname', displayText: 'Thapa', answer: 'Nepal', aliases: ['nepal', 'nepali'], hint: 'Common Nepali surname.', difficulty: 'hard' },
  { id: 'sb-sur-np003', category: 'surname', displayText: 'Kafle', answer: 'Nepal', aliases: ['nepal', 'nepali'], hint: 'Common Nepali brahmin surname.', difficulty: 'hard' },
  { id: 'sb-sur-np004', category: 'surname', displayText: 'Chhetri', answer: 'Nepal', aliases: ['nepal', 'nepali'], hint: 'Common Nepali surname.', difficulty: 'hard' },


  // ── Pakistan / Muslim South Asia ──────────────────────────────────────────────

  { id: 'sb-sur-p001', category: 'surname', displayText: 'Khan', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES, 'central asia'], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Most common surname in Pakistan; also widespread across Muslim communities', difficulty: 'medium' },
  { id: 'sb-sur-p002', category: 'surname', displayText: 'Qureshi', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Descended from the Quraysh tribe; common across Muslim communities', difficulty: 'medium' },
  { id: 'sb-sur-p003', category: 'surname', displayText: 'Malik', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Common across Pakistan, Muslim South Asia, and the wider Muslim world', difficulty: 'hard' },
  { id: 'sb-sur-p004', category: 'surname', displayText: 'Chaudhry', answer: 'Pakistan', aliases: ['pakistani', 'india', 'indian', 'bengali', 'bangladesh', 'chaudhary'], hint: 'Landowner title-turned-surname in Punjab (Pakistan and India)', difficulty: 'hard' },
  { id: 'sb-sur-p005', category: 'surname', displayText: 'Shah', answer: 'India', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES, 'nepal'], acceptedAnswers: surnameAnswers({ broad: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES, 'Nepal', 'Nepali'] }), hint: 'Means "king" - found across South Asia, Iran, and the wider Muslim world', difficulty: 'medium' },
  { id: 'sb-sur-p006', category: 'surname', displayText: 'Raza', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Common across Muslims in South Asia and beyond.', difficulty: 'medium' },
  { id: 'sb-sur-p007', category: 'surname', displayText: 'Ahmed', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Commonly used as a last name and first name across Muslim communities.', difficulty: 'medium' },
  { id: 'sb-sur-p008', category: 'surname', displayText: 'Mustafa', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Commonly used as a last name and first name across Muslim communities.', difficulty: 'medium' },
  { id: 'sb-sur-p009', category: 'surname', displayText: 'Sharif', answer: 'Pakistan', aliases: [...WIDELY_USED_MUSLIM_SURNAME_ALIASES], acceptedAnswers: widelyUsedMuslimSurnameAnswers(), hint: 'Commonly used as a last name and first name across Muslim communities.', difficulty: 'medium' },

  // ── Germany ───────────────────────────────────────────────────────────────────

  { id: 'sb-sur-d001', category: 'surname', displayText: 'Müller', answer: 'Germany', aliases: ['german', 'austria', 'switzerland', 'austrian', 'swiss'], hint: 'Most common surname in Germany - means "miller"', difficulty: 'easy' },
  { id: 'sb-sur-d002', category: 'surname', displayText: 'Schmidt', answer: 'Germany', aliases: ['german', 'austria', 'swiss', 'austrian'], hint: 'Second most common German surname - means "blacksmith"', difficulty: 'easy' },
  { id: 'sb-sur-d003', category: 'surname', displayText: 'Schneider', answer: 'Germany', aliases: ['german', 'austria', 'austrian'], hint: 'Common German surname meaning "tailor"', difficulty: 'easy' },
  { id: 'sb-sur-d004', category: 'surname', displayText: 'Fischer', answer: 'Germany', aliases: ['german', 'austria', 'austrian'], hint: 'Means "fisherman" - one of Germany\'s top surnames', difficulty: 'easy' },
  { id: 'sb-sur-d005', category: 'surname', displayText: 'Wagner', answer: 'Germany', aliases: ['german', 'austria', 'austrian'], hint: 'Means "wagon-maker" - also famous as a composer surname', difficulty: 'easy' },
  { id: 'sb-sur-d006', category: 'surname', displayText: 'Becker', answer: 'Germany', aliases: ['german', 'austria'], hint: 'Means "baker" - well-known German surname', difficulty: 'medium' },
  { id: 'sb-sur-d007', category: 'surname', displayText: 'Hoffmann', answer: 'Germany', aliases: ['german', 'austria'], hint: 'Common German surname meaning "steward of a farm"', difficulty: 'medium' },
  { id: 'sb-sur-d008', category: 'surname', displayText: 'Koch', answer: 'Germany', aliases: ['german', 'austria', 'austrian'], hint: 'Means "cook" - notable as a famous bacteriologist surname', difficulty: 'medium' },

  // ── France ────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-f001', category: 'surname', displayText: 'Dupont', answer: 'France', aliases: ['french', 'belgium', 'belgian'], hint: 'Prototypical French surname - means "of the bridge"', difficulty: 'easy' },
  { id: 'sb-sur-f002', category: 'surname', displayText: 'Dubois', answer: 'France', aliases: ['french', 'belgium', 'belgian'], hint: 'Means "of the woods" - one of the most recognizable French surnames', difficulty: 'easy' },
  { id: 'sb-sur-f003', category: 'surname', displayText: 'Moreau', answer: 'France', aliases: ['french'], hint: 'Means "dark-complexioned" - very common French surname', difficulty: 'medium' },
  { id: 'sb-sur-f004', category: 'surname', displayText: 'Laurent', answer: 'France', aliases: ['french', 'belgium', 'belgian'], hint: 'French form of Lawrence - common in France and Belgium', difficulty: 'medium' },
  { id: 'sb-sur-f005', category: 'surname', displayText: 'Renard', answer: 'France', aliases: ['french', 'belgium'], hint: 'Means "fox" - a distinctly French surname', difficulty: 'medium' },
  { id: 'sb-sur-f006', category: 'surname', displayText: 'Lefevre', answer: 'France', aliases: ['french', 'lefèvre', 'belgium'], hint: 'Means "the blacksmith" - very common in northern France', difficulty: 'hard' },
  { id: 'sb-sur-f007', category: 'surname', displayText: 'Rousseau', answer: 'France', aliases: ['french', 'belgium'], hint: 'Means "reddish complexion" in French', difficulty: 'hard' },

  // ── Italy ─────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-it001', category: 'surname', displayText: 'Rossi', answer: 'Italy', aliases: ['italian'], hint: 'The most common surname in Italy - means "red-haired"', difficulty: 'easy' },
  { id: 'sb-sur-it002', category: 'surname', displayText: 'Ferrari', answer: 'Italy', aliases: ['italian'], hint: 'Means "blacksmith" - also famous as a car brand', difficulty: 'easy' },
  { id: 'sb-sur-it003', category: 'surname', displayText: 'Bianchi', answer: 'Italy', aliases: ['italian'], hint: 'Means "white" - very common Italian surname', difficulty: 'easy' },
  { id: 'sb-sur-it004', category: 'surname', displayText: 'Esposito', answer: 'Italy', aliases: ['italian'], hint: 'Most common in Naples - given to foundlings, means "exposed"', difficulty: 'medium' },
  { id: 'sb-sur-it005', category: 'surname', displayText: 'Colombo', answer: 'Italy', aliases: ['italian'], hint: 'Italian surname meaning "dove" - also Christopher Columbus\'s name', difficulty: 'medium' },
  { id: 'sb-sur-it006', category: 'surname', displayText: 'Ricci', answer: 'Italy', aliases: ['italian'], hint: 'Means "curly-haired" - common across Italy', difficulty: 'medium' },
  { id: 'sb-sur-it007', category: 'surname', displayText: 'Romano', answer: 'Italy', aliases: ['italian'], hint: 'Means "Roman" - common in southern Italy', difficulty: 'medium' },

  // ── Spain / Latin America ────────────────────────────────────────────────────

  { id: 'sb-sur-es001', category: 'surname', displayText: 'García', answer: 'Spain', aliases: ['spanish', 'mexico', 'colombia', 'argentina', 'latin america', 'mexican', 'colombian', 'argentinian', 'hispanic'], hint: 'The most common surname in Spain and throughout Latin America', difficulty: 'easy' },
  { id: 'sb-sur-es002', category: 'surname', displayText: 'Martínez', answer: 'Spain', aliases: ['spanish', 'mexico', 'latin america', 'mexican', 'hispanic'], hint: 'Second most common in Spain - son of Martín', difficulty: 'medium' },
  { id: 'sb-sur-es003', category: 'surname', displayText: 'López', answer: 'Spain', aliases: ['spanish', 'mexico', 'latin america', 'mexican'], hint: 'Third most common in Spain - son of Lope', difficulty: 'medium' },
  { id: 'sb-sur-es004', category: 'surname', displayText: 'González', answer: 'Spain', aliases: ['spanish', 'mexico', 'latin america', 'mexican', 'colombian'], hint: 'Son of Gonzalo - very common across the Spanish-speaking world', difficulty: 'medium' },
  { id: 'sb-sur-es005', category: 'surname', displayText: 'Hernández', answer: 'Mexico', aliases: ['spain', 'spanish', 'mexican', 'latin america'], hint: 'Most common surname in Mexico; son of Hernando', difficulty: 'hard' },
  { id: 'sb-sur-es006', category: 'surname', displayText: 'Sánchez', answer: 'Spain', aliases: ['spanish', 'mexico', 'latin america', 'mexican', 'hispanic'], hint: 'Son of Sancho - very common in Spain and Latin America', difficulty: 'medium' },

  // ── Portugal / Brazil ─────────────────────────────────────────────────────────

  { id: 'sb-sur-pt001', category: 'surname', displayText: 'Fernandes', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Son of Fernando - common in both Portugal and Brazil', difficulty: 'easy' },
  { id: 'sb-sur-pt002', category: 'surname', displayText: 'Silva', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Means "forest" - top surname in both Portugal and Brazil', difficulty: 'easy' },
  { id: 'sb-sur-pt003', category: 'surname', displayText: 'Santos', answer: 'Brazil', aliases: ['portugal', 'portuguese', 'brazilian', 'philippines', 'filipino'], hint: 'Means "saints" - extremely common in Brazil and Portugal', difficulty: 'easy' },
  { id: 'sb-sur-pt004', category: 'surname', displayText: 'Pereira', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Means "pear tree" - top five in both Portugal and Brazil', difficulty: 'easy' },
  { id: 'sb-sur-pt005', category: 'surname', displayText: 'Costa', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Means "coast" - very common in Portugal and Brazil', difficulty: 'medium' },
  { id: 'sb-sur-pt006', category: 'surname', displayText: 'Oliveira', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Means "olive tree" - a top surname in Brazil', difficulty: 'medium' },
  { id: 'sb-sur-pt007', category: 'surname', displayText: 'Ferreira', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Means "iron worker" - one of the top ten in Portugal', difficulty: 'medium' },
  { id: 'sb-sur-pt008', category: 'surname', displayText: 'Carvalho', answer: 'Portugal', aliases: ['brazil', 'portuguese', 'brazilian'], hint: 'Means "oak tree" - distinctly Portuguese', difficulty: 'hard' },

  // ── Scandinavia ───────────────────────────────────────────────────────────────

  { id: 'sb-sur-sc001', category: 'surname', displayText: 'Johansson', answer: 'Sweden', aliases: ['swedish'], hint: 'The most common surname in Sweden - son of Johan', difficulty: 'easy' },
  { id: 'sb-sur-sc002', category: 'surname', displayText: 'Andersson', answer: 'Sweden', aliases: ['swedish'], hint: 'Second most common Swedish surname - son of Anders', difficulty: 'easy' },
  { id: 'sb-sur-sc003', category: 'surname', displayText: 'Karlsson', answer: 'Sweden', aliases: ['swedish'], hint: 'Third most common Swedish surname - son of Karl', difficulty: 'easy' },
  { id: 'sb-sur-sc004', category: 'surname', displayText: 'Eriksson', answer: 'Sweden', aliases: ['swedish'], hint: 'Common Swedish surname - son of Erik', difficulty: 'medium' },
  { id: 'sb-sur-sc005', category: 'surname', displayText: 'Svensson', answer: 'Sweden', aliases: ['swedish'], hint: 'Son of Sven - distinctly Swedish spelling', difficulty: 'medium' },
  { id: 'sb-sur-sc006', category: 'surname', displayText: 'Nielsen', answer: 'Denmark', aliases: ['danish', 'norway', 'norwegian'], hint: 'The most common surname in Denmark - son of Niels', difficulty: 'easy' },
  { id: 'sb-sur-sc007', category: 'surname', displayText: 'Jensen', answer: 'Denmark', aliases: ['danish', 'norway', 'norwegian'], hint: 'Second most common in Denmark - son of Jens', difficulty: 'easy' },
  { id: 'sb-sur-sc008', category: 'surname', displayText: 'Pedersen', answer: 'Denmark', aliases: ['danish'], hint: 'Son of Peder - distinctly Danish (vs Norwegian Pedersen)', difficulty: 'medium' },
  { id: 'sb-sur-sc009', category: 'surname', displayText: 'Sørensen', answer: 'Denmark', aliases: ['danish'], hint: 'Son of Søren - ø marks this as distinctly Danish', difficulty: 'medium' },
  { id: 'sb-sur-sc010', category: 'surname', displayText: 'Johansen', answer: 'Norway', aliases: ['norwegian', 'denmark', 'danish'], hint: 'The most common surname in Norway - note the -en ending', difficulty: 'medium' },
  { id: 'sb-sur-sc011', category: 'surname', displayText: 'Olsen', answer: 'Norway', aliases: ['norwegian', 'denmark', 'danish'], hint: 'Son of Ole - more common in Norway than Denmark', difficulty: 'medium' },
  { id: 'sb-sur-sc012', category: 'surname', displayText: 'Eriksen', answer: 'Norway', aliases: ['norwegian'], hint: 'Son of Erik - the -sen ending marks it as Norwegian/Danish', difficulty: 'hard' },
  { id: 'sb-sur-sc013', category: 'surname', displayText: 'Hansen', answer: 'Norway', aliases: ['norwegian', 'denmark', 'danish'], hint: 'Son of Hans - more common in Norway than Denmark', difficulty: 'medium' },

  // ── Eastern Europe ────────────────────────────────────────────────────────────

  { id: 'sb-sur-ee001', category: 'surname', displayText: 'Nowak', answer: 'Poland', aliases: ['polish'], hint: 'The most common surname in Poland - means "newcomer"', difficulty: 'easy' },
  { id: 'sb-sur-ee002', category: 'surname', displayText: 'Kowalski', answer: 'Poland', aliases: ['polish'], hint: 'Very common Polish surname meaning "blacksmith"', difficulty: 'easy' },
  { id: 'sb-sur-ee003', category: 'surname', displayText: 'Wiśniewski', answer: 'Poland', aliases: ['polish'], hint: 'Third most common in Poland - the ś and ń mark Polish', difficulty: 'medium' },
  { id: 'sb-sur-ee004', category: 'surname', displayText: 'Popescu', answer: 'Romania', aliases: ['romanian'], hint: 'The most common Romanian surname - means "priest\'s son"', difficulty: 'easy' },
  { id: 'sb-sur-ee005', category: 'surname', displayText: 'Ionescu', answer: 'Romania', aliases: ['romanian'], hint: 'Second most common in Romania - son of Ion', difficulty: 'easy' },
  { id: 'sb-sur-ee006', category: 'surname', displayText: 'Novák', answer: 'Czech Republic', aliases: ['czech', 'czechia', 'slovakia', 'slovak', 'czech republic'], hint: 'Most common Czech and Slovak surname - means "newcomer"', difficulty: 'medium' },
  { id: 'sb-sur-ee007', category: 'surname', displayText: 'Dvořák', answer: 'Czech Republic', aliases: ['czech', 'czechia', 'czech republic'], hint: 'Famous Czech surname (the composer) - ř is unique to Czech', difficulty: 'medium' },
  { id: 'sb-sur-ee008', category: 'surname', displayText: 'Nagy', answer: 'Hungary', aliases: ['hungarian'], hint: 'The most common Hungarian surname - means "big"', difficulty: 'easy' },
  { id: 'sb-sur-ee009', category: 'surname', displayText: 'Kovács', answer: 'Hungary', aliases: ['hungarian'], hint: 'Second most common in Hungary - means "blacksmith"', difficulty: 'easy' },
  { id: 'sb-sur-ee010', category: 'surname', displayText: 'Szabó', answer: 'Hungary', aliases: ['hungarian'], hint: 'Fourth most common in Hungary - means "tailor"', difficulty: 'medium' },
  { id: 'sb-sur-ee011', category: 'surname', displayText: 'Papadopoulos', answer: 'Greece', aliases: ['greek'], hint: 'The most common Greek surname - means "son of a priest"', difficulty: 'easy' },
  { id: 'sb-sur-ee012', category: 'surname', displayText: 'Georgiou', answer: 'Greece', aliases: ['greek', 'cyprus', 'cypriot'], hint: 'Common in Greece and Cyprus - son of Georgios', difficulty: 'medium' },
  { id: 'sb-sur-ee013', category: 'surname', displayText: 'Ivanov', answer: 'Russia', aliases: ['russian', 'bulgaria', 'bulgarian'], hint: 'Most common in Russia and Bulgaria - son of Ivan', difficulty: 'easy' },
  { id: 'sb-sur-ee014', category: 'surname', displayText: 'Smirnov', answer: 'Russia', aliases: ['russian'], hint: 'Second most common Russian surname - means "quiet"', difficulty: 'easy' },
  { id: 'sb-sur-ee015', category: 'surname', displayText: 'Shevchenko', answer: 'Ukraine', aliases: ['ukrainian'], hint: 'Most common Ukrainian surname - linked to poet Taras Shevchenko', difficulty: 'easy' },
  { id: 'sb-sur-ee016', category: 'surname', displayText: 'Kovalenko', answer: 'Ukraine', aliases: ['ukrainian'], hint: 'Very common Ukrainian surname - means "blacksmith"', difficulty: 'medium' },
  { id: 'sb-sur-ee017', category: 'surname', displayText: 'Petrov', answer: 'Russia', aliases: ['russian', 'bulgaria', 'bulgarian'], hint: 'Very common in Russia and Bulgaria - son of Peter', difficulty: 'medium' },
  { id: 'sb-sur-ee018', category: 'surname', displayText: 'Szczęsny', answer: 'Poland', aliases: ['polish'], hint: 'Polish surname meaning "lucky"', difficulty: 'medium' },
  { id: 'sb-sur-ee019', category: 'surname', displayText: 'Szymański', answer: 'Poland', aliases: ['polish'], hint: '9th most common Polish surname - means son of Simon', difficulty: 'medium'},
  { id: 'sb-sur-ee020', category: 'surname', displayText: 'Hradecký', answer: 'Czech Republic', aliases: ['czech', 'czechia', 'slovakia', 'slovak', 'czech republic'], hint: 'Czech and Slovak surname; the ý ending points toward West Slavic names', difficulty: 'hard' },
  { id: 'sb-sur-ee021', category: 'surname', displayText: 'Krejčí', answer: 'Czech Republic', aliases: ['czech', 'czechia', 'czech republic'], hint: 'Czech surname meaning "tailor"; ř/č-style diacritics are a strong clue', difficulty: 'hard' },
  { id: 'sb-sur-ee022', category: 'surname', displayText: 'Brožek', answer: 'Czech Republic', aliases: ['czech', 'czechia', 'czech republic'], hint: 'Czech surname; ž and the -ek ending are useful clues', difficulty: 'hard' },
  { id: 'sb-sur-ee023', category: 'surname', displayText: 'Bednarek', answer: 'Poland', aliases: ['polish'], hint: 'Polish surname from bednarz, a cooper or barrel-maker', difficulty: 'hard' },
  { id: 'sb-sur-ee024', category: 'surname', displayText: 'Křížek', answer: 'Czech Republic', aliases: ['czech', 'czechia', 'czech republic'], hint: 'Czech surname; ř and ž make the origin especially visible', difficulty: 'hard' },
  { id: 'sb-sur-ee025', category: 'surname', displayText: 'Ibrahimović', answer: 'Bosnia and Herzegovina', aliases: ['bosnia', 'bosnian', 'bosniak', 'herzegovina', 'balkan'], hint: 'Bosnian patronymic surname meaning son of Ibrahim', difficulty: 'hard' },
  { id: 'sb-sur-ee026', category: 'surname', displayText: 'Bajraktarević', answer: 'Bosnia and Herzegovina', aliases: ['bosnia', 'bosnian', 'bosniak', 'herzegovina', 'balkan'], hint: 'Predominantly Bosnian surname from Turkish bayraktar, meaning flag-bearer', difficulty: 'hard' },
  { id: 'sb-sur-ee027', category: 'surname', displayText: 'Mehmedović', answer: 'Bosnia and Herzegovina', aliases: ['bosnia', 'bosnian', 'bosniak', 'herzegovina', 'balkan'], hint: 'Bosnian patronymic surname meaning son of Mehmed', difficulty: 'hard' },
  { id: 'sb-sur-ee028', category: 'surname', displayText: 'Zieliński', answer: 'Poland', aliases: ['polish', 'zielinski'], hint: 'Polish surname from place names related to zielen, meaning green', difficulty: 'hard' },

  // ── Thailand ─────────────────────────────────────────────────────────────────
  { id: 'sb-sur-th001', category: 'surname', displayText: 'Ayutthaya', answer: 'Thailand', aliases: ['thai'], hint: 'Thai surname sharing its name with the historic kingdom and city of Ayutthaya', difficulty: 'hard' },
  { id: 'sb-sur-th002', category: 'surname', displayText: 'Ratanakorn', answer: 'Thailand', aliases: ['thai'], hint: 'Thai surname built from elements associated with jewels and treasure', difficulty: 'hard' },

  // ── Ireland / Scotland / Wales ────────────────────────────────────────────────

  { id: 'sb-sur-gb001', category: 'surname', displayText: 'Murphy', answer: 'Ireland', aliases: ['irish'], hint: 'The most common surname in Ireland', difficulty: 'easy' },
  { id: 'sb-sur-gb002', category: 'surname', displayText: 'O\'Brien', answer: 'Ireland', aliases: ['irish'], hint: 'Very common Irish surname - the O\' prefix marks Irish origin', difficulty: 'easy' },
  { id: 'sb-sur-gb003', category: 'surname', displayText: 'Walsh', answer: 'Ireland', aliases: ['irish'], hint: 'Third most common Irish surname', difficulty: 'easy' },
  { id: 'sb-sur-gb004', category: 'surname', displayText: 'McCarthy', answer: 'Ireland', aliases: ['irish'], hint: 'Common Irish surname from County Cork', difficulty: 'medium' },
  { id: 'sb-sur-gb005', category: 'surname', displayText: 'O\'Connor', answer: 'Ireland', aliases: ['irish'], hint: 'Famous Irish surname - descendant of Conor', difficulty: 'easy' },
  { id: 'sb-sur-gb006', category: 'surname', displayText: 'MacDonald', answer: 'Scotland', aliases: ['scottish', 'uk', 'scotland'], hint: 'The most common Scottish clan name - son of Donald', difficulty: 'easy' },
  { id: 'sb-sur-gb007', category: 'surname', displayText: 'MacLeod', answer: 'Scotland', aliases: ['scottish', 'uk'], hint: 'Well-known Scottish clan name - son of Leod', difficulty: 'easy' },
  { id: 'sb-sur-gb008', category: 'surname', displayText: 'Campbell', answer: 'Scotland', aliases: ['scottish', 'uk', 'scotland'], hint: 'One of the most famous Scottish clan surnames', difficulty: 'medium' },
  { id: 'sb-sur-gb009', category: 'surname', displayText: 'Jones', answer: 'Wales', aliases: ['welsh', 'uk', 'wales'], hint: 'The most common surname in Wales - son of John', difficulty: 'easy' },
  { id: 'sb-sur-gb010', category: 'surname', displayText: 'Evans', answer: 'Wales', aliases: ['welsh', 'uk', 'wales'], hint: 'Son of Evan - distinctly associated with Wales', difficulty: 'medium' },
  { id: 'sb-sur-gb011', category: 'surname', displayText: 'Davies', answer: 'Wales', aliases: ['welsh', 'uk'], hint: 'Welsh form of Davis - most common in Wales', difficulty: 'medium' },

  // ── England ───────────────────────────────────────────────────────────────────
  { id: 'sb-sur-en001', category: 'surname', displayText: 'Smith', answer: 'England', aliases: ['english', 'uk', 'england'], hint: 'The most common surname in England', difficulty: 'easy' },
  { id: 'sb-sur-en002', category: 'surname', displayText: 'Baker', answer: 'England', aliases: ['english', 'uk', 'england'], hint: 'English surname deriving from the profession', difficulty: 'easy' },
  { id: 'sb-sur-en003', category: 'surname', displayText: 'King', answer: 'England', aliases: ['english', 'uk', 'england'], hint: 'Common English surname', difficulty: 'easy' },
  { id: 'sb-sur-en004', category: 'surname', displayText: 'Miller', answer: 'England', aliases: ['english', 'scottish', 'uk', 'england','scotland'], hint: 'Common English surname', difficulty: 'easy' },
  { id: 'sb-sur-en005', category: 'surname', displayText: 'Woods', answer: 'England', aliases: ['english', 'scottish', 'uk', 'england','scotland'], hint: 'Common English surname', difficulty: 'easy' },

  // ── Africa ────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-af001', category: 'surname', displayText: 'Okafor', answer: 'Nigeria', aliases: ['nigerian', 'igbo'], hint: 'Igbo surname from southeastern Nigeria', difficulty: 'medium' },
  { id: 'sb-sur-af002', category: 'surname', displayText: 'Adeyemi', answer: 'Nigeria', aliases: ['nigerian', 'yoruba'], hint: 'Yoruba surname - the crown fits me - from southwestern Nigeria', difficulty: 'medium' },
  { id: 'sb-sur-af003', category: 'surname', displayText: 'Okonkwo', answer: 'Nigeria', aliases: ['nigerian', 'igbo'], hint: 'Famous Igbo surname from Chinua Achebe\'s Things Fall Apart', difficulty: 'medium' },
  { id: 'sb-sur-af004', category: 'surname', displayText: 'Mensah', answer: 'Ghana', aliases: ['ghanaian', 'akan'], hint: 'Akan surname meaning "third-born son" - primarily from Ghana', difficulty: 'medium' },
  { id: 'sb-sur-af005', category: 'surname', displayText: 'Boateng', answer: 'Ghana', aliases: ['ghanaian', 'akan'], hint: 'Akan surname from Ghana - well-known in European football', difficulty: 'medium' },
  { id: 'sb-sur-af006', category: 'surname', displayText: 'Appiah', answer: 'Ghana', aliases: ['ghanaian', 'akan'], hint: 'Common Akan surname from Ghana', difficulty: 'medium' },
  { id: 'sb-sur-af007', category: 'surname', displayText: 'Dlamini', answer: 'South Africa', aliases: ['south african', 'zulu', 'swazi', 'eswatini', 'swaziland'], hint: 'The most common surname in South Africa and Eswatini', difficulty: 'easy' },
  { id: 'sb-sur-af008', category: 'surname', displayText: 'Nkosi', answer: 'South Africa', aliases: ['south african', 'zulu', 'nguni'], hint: 'Zulu surname meaning "chief" or "king"', difficulty: 'medium' },
  { id: 'sb-sur-af009', category: 'surname', displayText: 'Ndlovu', answer: 'South Africa', aliases: ['south african', 'zimbabwe', 'zimbabwean', 'zulu', 'ndebele'], hint: 'Means "elephant" - common among Zulu and Ndebele speakers', difficulty: 'medium' },
  { id: 'sb-sur-af010', category: 'surname', displayText: 'Traoré', answer: 'Mali', aliases: ['malian', 'senegal', 'senegalese', 'ivory coast', 'guinea', 'west africa'], hint: 'One of the most common surnames across West Africa', difficulty: 'hard' },

  // ── Philippines ───────────────────────────────────────────────────────────────

  { id: 'sb-sur-ph001', category: 'surname', displayText: 'Reyes', answer: 'Philippines', aliases: ['filipino', 'philippine', 'philippines', 'spain', 'spanish', 'mexico', 'mexican'], hint: 'The most common surname in the Philippines - means "kings"', difficulty: 'medium' },
  { id: 'sb-sur-ph002', category: 'surname', displayText: 'Cruz', answer: 'Philippines', aliases: ['filipino', 'philippine', 'spain', 'spanish', 'portugal', 'brazil'], hint: 'Means "cross" - very common in the Philippines and across the Spanish-speaking world', difficulty: 'hard' },
  { id: 'sb-sur-ph003', category: 'surname', displayText: 'Bautista', answer: 'Philippines', aliases: ['filipino', 'philippine', 'philippines', 'spain', 'spanish'], hint: 'Means "Baptist" - distinctly associated with the Philippines', difficulty: 'medium' },
  { id: 'sb-sur-ph004', category: 'surname', displayText: 'Dela Cruz', answer: 'Philippines', aliases: ['filipino', 'philippine', 'philippines'], hint: 'Means "of the cross" - the most common Filipino surname', difficulty: 'easy' },

  // ── Turkey ────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-tr001', category: 'surname', displayText: 'Yılmaz', answer: 'Turkey', aliases: ['turkish'], hint: 'The most common surname in Turkey - means "brave, undaunted"', difficulty: 'easy' },
  { id: 'sb-sur-tr002', category: 'surname', displayText: 'Kaya', answer: 'Turkey', aliases: ['turkish'], hint: 'Second most common Turkish surname - means "rock"', difficulty: 'easy' },
  { id: 'sb-sur-tr003', category: 'surname', displayText: 'Demir', answer: 'Turkey', aliases: ['turkish'], hint: 'Means "iron" - very common in Turkey', difficulty: 'medium' },
  { id: 'sb-sur-tr004', category: 'surname', displayText: 'Şahin', answer: 'Turkey', aliases: ['turkish'], hint: 'Means "falcon" - the ş marks it as Turkish', difficulty: 'medium' },
  { id: 'sb-sur-tr005', category: 'surname', displayText: 'Çelik', answer: 'Turkey', aliases: ['turkish'], hint: 'Means "steel" - ç marks it as Turkish', difficulty: 'medium' },

  // ── Iran ──────────────────────────────────────────────────────────────────────

  { id: 'sb-sur-ir001', category: 'surname', displayText: 'Ahmadi', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Very common Iranian surname derived from Ahmad', difficulty: 'easy' },
  { id: 'sb-sur-ir002', category: 'surname', displayText: 'Hosseini', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Descends from Hussein - very common in Shia Iran', difficulty: 'easy' },
  { id: 'sb-sur-ir003', category: 'surname', displayText: 'Tehrani', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Means "from Tehran" - a common Iranian surname', difficulty: 'medium' },
  { id: 'sb-sur-ir004', category: 'surname', displayText: 'Shirazi', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Means "from Shiraz" - a city in southern Iran', difficulty: 'medium' },
  { id: 'sb-sur-ir005', category: 'surname', displayText: 'Reza', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Means "thankfullness" or "gratitude." A common Iranian surname.', difficulty: 'medium' },
  { id: 'sb-sur-ir006', category: 'surname', displayText: 'Yeganeh', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Means "unique" - a common Iranian surname.', difficulty: 'medium' },
  { id: 'sb-sur-ir007', category: 'surname', displayText: 'Mossadegh', answer: 'Iran', aliases: ['iranian', 'persian'], hint: 'Means "verified" - an Iranian surname.', difficulty: 'medium' },

];
