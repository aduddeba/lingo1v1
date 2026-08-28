import type { LanguageAncestryQuestion } from '@/types/practice';

// 20 language-ancestry questions.
// Each shows a chain of language names with one stage hidden.
// Players select the correct language name for the hidden stage.
// Invariant: answer === languageChain[hiddenIndex]

export const LANGUAGE_ANCESTRY_QUESTIONS: LanguageAncestryQuestion[] = [

  // ── EASY - well-known family trees, final stage hidden ──────────────────────

  {
    id: 'la-001', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Latin', 'Vulgar Latin', '???', 'French'],
    hiddenIndex: 2,
    prompt: 'Latin became French - but not overnight. What is the name of the stage spoken in Gaul between Vulgar Latin and Modern French?',
    options: ['Old French', 'Gallo-Romance', 'Medieval Latin', 'Proto-Romance'],
    answer: 'Old French',
    explanation: 'Old French (8th–14th c.) is the direct bridge between Vulgar Latin and Modern French. It is attested from the Oaths of Strasbourg (842 CE), the oldest surviving text in a recognizable Romance language. Gallo-Romance is the broader branch label (ancestor of French and Occitan together), not a spoken stage. Medieval Latin was the written scholarly language, not a vernacular evolution of Vulgar Latin.',
  },

  {
    id: 'la-002', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Proto-Germanic', 'West Germanic', 'Anglo-Frisian', '???'],
    hiddenIndex: 3,
    prompt: 'When Anglo-Saxon tribes crossed the North Sea to Britain around 450 CE, their Anglo-Frisian dialect became a distinct language. What is it called?',
    options: ['Old English', 'Old Frisian', 'Old Saxon', 'Gothic'],
    answer: 'Old English',
    explanation: 'Old English (Anglo-Saxon, 450–1150 CE) emerged when Germanic tribes (Angles, Saxons, Jutes) settled Britain. Old Frisian remains its closest living relative - the two were mutually intelligible until around 1000 CE. Gothic is a separate East Germanic language. Old Saxon developed in northern Germany and eventually gave rise to Low German.',
  },

  {
    id: 'la-003', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Proto-Germanic', 'North Germanic', 'Proto-Norse', '???'],
    hiddenIndex: 3,
    prompt: 'Proto-Norse (attested in runic inscriptions, 200–700 CE) evolved into the common tongue of the Viking Age. What was it called?',
    options: ['Old Norse', 'Old English', 'Gothic', 'Old High German'],
    answer: 'Old Norse',
    explanation: 'Proto-Norse (Runic Norse) evolved into Old Norse by ~700 CE, spoken across Scandinavia during the Viking Age. Old Norse spread to Iceland, Greenland, Normandy, and the British Isles. It later split into Old West Norse (Norway, Iceland) and Old East Norse (Sweden, Denmark), giving rise to all modern Scandinavian languages. Old English is West Germanic; Gothic is East Germanic.',
  },

  {
    id: 'la-004', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Latin', 'Vulgar Latin', 'Ibero-Romance', 'Old Castilian', '???'],
    hiddenIndex: 4,
    prompt: 'Old Castilian was the prestigious dialect of the medieval Kingdom of Castile. What modern national language did it become?',
    options: ['Spanish', 'Portuguese', 'Catalan', 'Galician'],
    answer: 'Spanish',
    explanation: 'Old Castilian (10th–16th c.) was the dialect of the Kingdom of Castile, also known as Old Spanish. As Castile expanded to dominate the Iberian Peninsula, its dialect became the prestige variety, standardized as Spanish. Portuguese and Galician share a common ancestor (Galician-Portuguese) and descended through a separate western branch.',
  },

  {
    id: 'la-005', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Proto-Slavic', 'East Slavic', 'Old East Slavic', '???'],
    hiddenIndex: 3,
    prompt: 'The language of Kievan Rus split into three branches. Which descended through the Moscow dialect?',
    options: ['Russian', 'Ukrainian', 'Belarusian', 'Bulgarian'],
    answer: 'Russian',
    explanation: 'Old East Slavic was spoken across Kievan Rus (9th–12th c.). After the state fragmented, the Moscow dialect became the foundation of Russian, the northeastern branch. Ukrainian developed in central and southwestern regions; Belarusian in the west. Bulgarian is South Slavic - a cousin, not a descendant of Old East Slavic.',
  },

  {
    id: 'la-006', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Proto-Semitic', 'Central Semitic', 'Northwest Semitic', 'Canaanite', '???'],
    hiddenIndex: 4,
    prompt: 'The Canaanite languages were spoken across the ancient Levant. Which branch survives as a living language today?',
    options: ['Hebrew', 'Phoenician', 'Moabite', 'Ammonite'],
    answer: 'Hebrew',
    explanation: 'Hebrew is the only Canaanite language that survived as a living tongue (revived as a spoken language in the 19th–20th century). Phoenician died out around the 1st–4th centuries CE. Moabite and Ammonite are attested only in inscriptions and had no documented continuity beyond the Iron Age.',
  },

  {
    id: 'la-007', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Germanic', 'North Germanic', '???'],
    hiddenIndex: 3,
    prompt: 'North Germanic split from the broader Germanic family around 2000 BCE. What is its earliest well-attested form?',
    options: ['Proto-Norse', 'Old Norse', 'Old Swedish', 'Old Danish'],
    answer: 'Proto-Norse',
    explanation: 'Proto-Norse (also called Runic Norse) is attested in Elder Futhark runic inscriptions from approximately 200–700 CE. It preceded Old Norse, from which the modern Scandinavian languages descend. Old Norse, Old Swedish, and Old Danish are later stages - Proto-Norse is the direct first step after the Proto-Germanic / North Germanic split.',
  },

  {
    id: 'la-008', difficulty: 1, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Balto-Slavic', 'Slavic', 'West Slavic', '???'],
    hiddenIndex: 4,
    prompt: 'This language is known for its complex consonant clusters. What is this language?',
    options: ['Polish', 'French', 'Russian', 'Croatian'],
    answer: 'Polish',
    explanation: 'Polish is a West Slavic language that has consonant clusters like "cz", "sz", "rz" and has a unique alphabet with 32 letters.',
  },

  // ── MEDIUM - less obvious intermediate stages ────────────────────────────────

  {
    id: 'la-009', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Indo-Iranian', 'Old Iranian', 'Avestan', 'Pahlavi', '???'],
    hiddenIndex: 5,
    prompt: 'After the Arab conquest of the Sasanian Empire (651 CE), Pahlavi absorbed Arabic vocabulary and adopted a new script. What language did it become?',
    options: ['New Persian', 'Pashto', 'Sogdian', 'Kurdish'],
    answer: 'New Persian',
    explanation: 'Pahlavi (Middle Persian) was the official language of the Sasanian Empire. After the Arab conquest it retained its grammar and core vocabulary but adopted the Perso-Arabic script and massive Arabic borrowings, becoming New Persian (Farsi/Dari). Pashto and Kurdish are related Iranian branches - parallel descendants, not direct successors of Pahlavi.',
  },

  {
    id: 'la-010', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Proto-Indo-European', 'Hellenic', 'Proto-Greek', '???', 'Koine Greek'],
    hiddenIndex: 3,
    prompt: "Proto-Greek developed into a rich landscape of classical dialects, later unified by Koine. What do we call this classical stage?",
    options: ['Ancient Greek', 'Latin', 'Phrygian', 'Etruscan'],
    answer: 'Ancient Greek',
    explanation: "Ancient Greek (c.800–300 BCE) encompassed the classical dialects (Attic, Doric, Ionic, Aeolic) used in Homer's epics, Athenian democracy, and Platonic philosophy. Koine Greek (~300 BCE) arose when Alexander's conquests needed a common tongue, blending the dialects - especially Attic. Proto-Greek is the reconstructed ancestor from ~2000 BCE. Latin and Phrygian were separate Indo-European branches; Etruscan was non-Indo-European.",
  },

  {
    id: 'la-011', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Celtic', 'Insular Celtic', 'Goidelic', '???'],
    hiddenIndex: 4,
    prompt: 'The Goidelic branch produced the oldest richly attested form of an Irish language. What is this earliest stage called?',
    options: ['Old Irish', 'Old Welsh', 'Old Cornish', 'Pictish'],
    answer: 'Old Irish',
    explanation: "Old Irish (c.600–900 CE) is the oldest well-attested Goidelic stage, preserved in manuscripts and Ogham inscriptions. Its verb system could express over 500 forms - one of the most complex morphologies of any recorded language. Old Welsh and Old Cornish are Brittonic - a parallel Insular Celtic branch. Pictish, the poorly understood language of ancient Scotland, is not classified as Goidelic.",
  },

  {
    id: 'la-012', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Proto-Austronesian', 'Malayo-Polynesian', 'Philippine', 'Proto-Philippine', '???'],
    hiddenIndex: 4,
    prompt: 'Proto-Philippine split into regional branches. Which branch gave rise to the language of the Laguna Copperplate (900 CE)?',
    options: ['Old Tagalog', 'Old Malay', 'Old Javanese', 'Old Cebuano'],
    answer: 'Old Tagalog',
    explanation: 'Old Tagalog (attested from ~900 CE in the Laguna Copperplate Inscription) is the earliest documented stage of the Philippine language that evolved into modern Tagalog/Filipino. Old Malay is a separate Malayo-Polynesian branch. Old Javanese (Kawi) was a prestigious literary language of Java. Old Cebuano is a parallel Philippine branch descending from a different Proto-Philippine node.',
  },

  {
    id: 'la-013', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Proto-Sino-Tibetan', 'Sinitic', 'Old Chinese', 'Middle Chinese', '???'],
    hiddenIndex: 4,
    prompt: "Middle Chinese (Qieyun rhyming dictionary, 601 CE) was the common ancestor of all modern Chinese varieties. Which branch became China's modern lingua franca?",
    options: ['Early Mandarin', 'Cantonese', 'Min Chinese', 'Wu Chinese'],
    answer: 'Early Mandarin',
    explanation: 'Early Mandarin (Old Mandarin) emerged in northern China during the Tang and Song dynasties and was documented in the Zhongyuan Yinyun (1324 CE). It became the basis for Modern Standard Chinese (Putonghua/Mandarin). Cantonese, Min, Wu, and Hakka are other Middle Chinese descendants that developed in southern China - parallel branches, not ancestors of Mandarin.',
  },

  {
    id: 'la-014', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Balto-Slavic', 'Baltic', 'East Baltic', '???'],
    hiddenIndex: 4,
    prompt: 'East Baltic diverged into two branches in the early medieval period. Which language stage represents the direct ancestor of modern Latvian?',
    options: ['Old Latvian', 'Old Lithuanian', 'Old Prussian', 'Curonian'],
    answer: 'Old Latvian',
    explanation: "Old Latvian is the earliest attested stage of Latvian, with texts surviving from the 16th century. East Baltic split into the Lithuanian and Latvian branches. Old Lithuanian is the parallel branch ancestor. Old Prussian was a West Baltic language that went extinct in the 17th–18th centuries. Curonian was an extinct Baltic language whose speakers were gradually absorbed into Latvian and Lithuanian communities.",
  },

  {
    id: 'la-015', difficulty: 2, type: 'language_ancestry',
    languageChain: ['Proto-Semitic', 'Semitic', 'East Semitic', 'Akkadian', 'Old Babylonian', '???'],
    hiddenIndex: 5,
    prompt: "Old Babylonian (~2000–1500 BCE) was the language of Hammurabi's Code. What stage came next in the Babylonian dialect?",
    options: ['Middle Babylonian', 'Late Babylonian', 'Neo-Assyrian', 'Standard Babylonian'],
    answer: 'Middle Babylonian',
    explanation: 'Babylonian Akkadian progressed: Old (2000–1500 BCE) → Middle (1500–1000 BCE) → Neo (1000–600 BCE) → Late Babylonian stages. Middle Babylonian is attested in the Amarna Letters - international Bronze Age diplomatic correspondence between Egypt and Mesopotamian kingdoms, demonstrating Babylonian as the lingua franca of the ancient Near East.',
  },

  // ── HARD - obscure branches, proto-languages, and less-taught lineages ───────

  {
    id: 'la-016', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Indo-Iranian', 'Indo-Aryan', 'Shauraseni Prakrit', '???'],
    hiddenIndex: 4,
    prompt: 'Shauraseni Prakrit was spoken in the Mathura region of northern India. What transitional stage immediately followed it on the path to modern Hindi?',
    options: ['Shauraseni Apabhramsha', 'Pali', 'Sanskrit', 'Ardhamagadhi Prakrit'],
    answer: 'Shauraseni Apabhramsha',
    explanation: 'Prakrits evolved into Apabhramsha languages (~500–1200 CE) - the transitional bridge between Middle Indo-Aryan (Prakrits) and New Indo-Aryan (modern languages). Shauraseni Apabhramsha specifically gave rise to the Western Hindi dialects (Braj Bhasha, Khariboli), and through them to modern Hindi, Gujarati, and Rajasthani. Pali and Ardhamagadhi are different Prakrit branches serving different literary traditions.',
  },

  {
    id: 'la-017', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Proto-Afroasiatic', 'Semitic', 'South Semitic', 'Ethiopian Semitic', "Old Ethiopic (Ge'ez)", '???'],
    hiddenIndex: 5,
    prompt: "Ge'ez became the liturgical language of the Ethiopian Orthodox Church but gave rise to living descendants. Which is the most widely spoken modern Ethiopian Semitic language?",
    options: ['Amharic', 'Tigrinya', 'Tigre', 'Harari'],
    answer: 'Amharic',
    explanation: "Amharic (spoken by ~25 million people and the official language of Ethiopia) is the most widely spoken modern descendant of the Ethiosemitic branch. Tigrinya, Tigre, and Harari are sister languages - all descended from the same South Ethiopic ancestor - but Amharic holds the greatest political prestige and number of speakers. Ge'ez itself has been maintained as a liturgical language for over 1,600 years.",
  },

  {
    id: 'la-018', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Anatolian', 'Luwic', 'Luwian', '???'],
    hiddenIndex: 4,
    prompt: 'Luwian was spoken across Bronze Age Anatolia (~2000–1000 BCE). Which attested language is its most direct descendant within the Luwic subgroup?',
    options: ['Lycian', 'Lydian', 'Palaic', 'Carian'],
    answer: 'Lycian',
    explanation: 'Lycian (southwestern Anatolia, attested ~5th–1st c. BCE) is classified within the Luwic branch of Anatolian as a direct descendant of Luwian. Carian has debated placement in Luwic. Lydian belongs to a separate Anatolian branch. Palaic is even older than Luwian - an earlier Anatolian branch, not a later one. The Luwic group represents one of the easternmost branches of Indo-European.',
  },

  {
    id: 'la-019', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Proto-Polynesian', 'Proto-Eastern Polynesian', 'Proto-Central Eastern Polynesian', 'Proto-Tahitic', 'Old Tahitian', '???'],
    hiddenIndex: 5,
    prompt: 'Proto-Tahitic split when Polynesian navigators reached Aotearoa around 1300 CE. Which language descended through that southern migration?',
    options: ['Māori', 'Hawaiian', 'Samoan', 'Tongan'],
    answer: 'Māori',
    explanation: 'The Tahitic branch includes Tahitian and Māori (and Rarotongan). Hawaiian descended through the Marquesic branch - a parallel Eastern Polynesian line, not Tahitic. Samoan and Tongan are Polynesian but are not Eastern Polynesian - they diverged much earlier from Proto-Polynesian. The Māori language preserves many Proto-Tahitic features due to the relative isolation of New Zealand after settlement.',
  },

  {
    id: 'la-020', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Indo-European', 'Indo-Iranian', 'Indo-Aryan', 'Vedic Sanskrit', 'Classical Sanskrit', 'Pali', '???'],
    hiddenIndex: 6,
    prompt: 'Pali was the scriptural language of Theravāda Buddhism. Which Middle Indo-Aryan language evolved directly from Pali as a vernacular?',
    options: ['Sinhalese', 'Tamil', 'Telugu', 'Kannada'],
    answer: 'Sinhalese',
    explanation: 'Sinhalese (spoken in Sri Lanka) is the only modern Indo-Aryan language that can trace a continuous lineage through Pali. Pali was brought to Sri Lanka by Buddhist missionaries in the 3rd century BCE, and the island\'s Indo-Aryan vernacular evolved under its strong influence. Tamil, Telugu, and Kannada are Dravidian languages - a completely separate family from Indo-Aryan.',
  },

  {
    id: 'la-021', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Proto-Niger-Congo', 'Atlantic-Congo', 'Volta-Congo', 'Benue-Congo', 'Bantoid', 'Southern Bantoid', 'Narrow Bantu', '???'],
    hiddenIndex: 7,
    prompt: 'Narrow Bantu languages spread from Cameroon/Nigeria across sub-Saharan Africa over 3,000 years. Which of these belongs directly within Narrow Bantu?',
    options: ['Swahili', 'Hausa', 'Yoruba', 'Amharic'],
    answer: 'Swahili',
    explanation: 'Swahili (Kiswahili) is a Narrow Bantu language spoken by ~200 million people across East Africa as a lingua franca. Hausa is Afroasiatic (Chadic branch). Yoruba is Atlantic-Congo but belongs to the Defoid branch of Volta-Congo - it diverged long before the Bantu expansion. Amharic is Semitic. The Bantu expansion from the Cameroon–Nigeria highlands is one of the most dramatic language spreads in human history.',
  },

  {
    id: 'la-022', difficulty: 3, type: 'language_ancestry',
    languageChain: ['Dravidian', 'South-Central Dravidian', '???'],
    hiddenIndex: 2,
    prompt: 'This language is also known as "Italian of the East" since the vast majority of words end with a vowel. Choose the language that has this lineage.',
    options: ['Hindi', 'Tamil', 'Telugu', 'Bengali'],
    answer: 'Telugu',
    explanation: 'Telugu is a Dravidian language spoken by ~100 million people worldwide. It is one of the fastest growing languages in the United States.',
  },

];
