import type { HistoricalEvolutionQuestion } from '@/types/practice';

// 30 chain-based questions.
// Each shows a full linguistic ancestry chain with one stage hidden (chain[hiddenIndex]).
// Players select the correct word form for the hidden stage.
// Invariant: answer === chain[hiddenIndex].form

export const HISTORICAL_EVOLUTION_QUESTIONS: HistoricalEvolutionQuestion[] = [

  // ── EASY — predict_end: the hidden stage is always the modern English word ──

  {
    id: 'he-001', difficulty: 1, type: 'predict_end',
    targetWord: 'window',
    chain: [
      { language: 'Old Norse', form: 'vindauga', gloss: '"wind" + "eye"' },
      { language: 'Middle English', form: 'windoge' },
      { language: 'Modern English', form: 'window' },
    ],
    hiddenIndex: 2,
    prompt: 'Old Norse sailors called wall openings "wind eyes." Follow the chain — what modern English word did it become?',
    options: ['window', 'wander', 'wicket', 'windle'],
    answer: 'window',
    explanation: '"Window" from Old Norse vindauga (vindr=wind + auga=eye). Norse settlers brought the compound to Britain, replacing Old English "eagþyrl" (eye-hole). The word describes exactly what a window does: it is the eye through which wind and light enter. The silent w-sound in Norse became the familiar English word.',
  },

  {
    id: 'he-002', difficulty: 1, type: 'predict_end',
    targetWord: 'coffee',
    chain: [
      { language: 'Arabic', form: 'qahwa', gloss: 'wine of the bean' },
      { language: 'Turkish', form: 'kahve' },
      { language: 'Dutch', form: 'koffie' },
      { language: 'Modern English', form: 'coffee' },
    ],
    hiddenIndex: 3,
    prompt: '"Qahwa" crossed three languages before reaching English. What did it become?',
    options: ['coffee', 'cobalt', 'coffer', 'cough'],
    answer: 'coffee',
    explanation: '"Coffee" from Arabic qahwa (possibly from Kaffa, Ethiopia, where the plant grew wild) → Turkish kahve → Italian caffè → Dutch koffie → English. The drink arrived in Britain around 1600, and coffeehouse culture rapidly transformed political and literary life. The Arabic al-qahwa literally meant "that which dulls hunger."',
  },

  {
    id: 'he-003', difficulty: 1, type: 'predict_end',
    targetWord: 'hotel',
    chain: [
      { language: 'Latin', form: 'hospitālis', gloss: 'of a guest' },
      { language: 'Old French', form: 'ostel' },
      { language: 'Modern English', form: 'hotel' },
    ],
    hiddenIndex: 2,
    prompt: 'Latin "hospitālis" (guest-related) contracted through Old French. What did it become in modern English?',
    options: ['hotel', 'hostel', 'hostile', 'hovel'],
    answer: 'hotel',
    explanation: 'Latin hospitālis → Old French ostel → two English branches: "hostel" (older, arrived via medieval French) and "hotel" (arrived 18th-century via Parisian French hôtel). Both trace to Latin hospes (guest/host), which also gives "hospital," "hospice," and "hospitality." The same word once covered medicine, lodging, and welcome.',
  },

  {
    id: 'he-004', difficulty: 1, type: 'predict_end',
    targetWord: 'dish',
    chain: [
      { language: 'Latin', form: 'discus', gloss: 'flat circular object' },
      { language: 'Old French', form: 'deis' },
      { language: 'Middle English', form: 'disch' },
      { language: 'Modern English', form: 'dish' },
    ],
    hiddenIndex: 3,
    prompt: 'Latin "discus" (flat plate) travelled into kitchens through Old French. What humble household word did it become?',
    options: ['dish', 'disc', 'dais', 'desk'],
    answer: 'dish',
    explanation: 'Latin discus spawned a remarkable word family: "dish" (for food), "dais" (a raised platform, from the same Old French deis), "desk" (via Medieval Latin discus), and "disc/disk." All four are siblings — different English words from the same Roman flat plate. A desk is literally a dish you write on.',
  },

  {
    id: 'he-005', difficulty: 1, type: 'predict_end',
    targetWord: 'sugar',
    chain: [
      { language: 'Sanskrit', form: 'śarkarā', gloss: 'grit / raw sugar crystals' },
      { language: 'Arabic', form: 'sukkar' },
      { language: 'Old French', form: 'sucre' },
      { language: 'Modern English', form: 'sugar' },
    ],
    hiddenIndex: 3,
    prompt: 'Sanskrit "śarkarā" (meaning grit or gravel — describing raw sugar crystals) sweetened its way through Arabic and Old French. What did English make of it?',
    options: ['sugar', 'sucker', 'liquor', 'sachet'],
    answer: 'sugar',
    explanation: 'Sanskrit śarkarā (grit/gravel, for the texture of raw sugar) → Arabic sukkar → Old French sucre → English "sugar." The same Sanskrit root reached English via Greek and Latin as "saccharine." Sugar cane was unknown to ancient Europeans; the word travelled with the crop from South Asia through the Arab world to medieval Europe.',
  },

  {
    id: 'he-006', difficulty: 1, type: 'predict_end',
    targetWord: 'chair',
    chain: [
      { language: 'Greek', form: 'kathedra', gloss: 'kata- (down) + hedra (seat)' },
      { language: 'Latin', form: 'cathedra', gloss: 'bishop\'s throne' },
      { language: 'Old French', form: 'chaire' },
      { language: 'Modern English', form: 'chair' },
    ],
    hiddenIndex: 3,
    prompt: 'Greek "kathedra" (a seat you sit DOWN into) became a bishop\'s throne in Latin. What everyday English word did it evolve into?',
    options: ['chair', 'choir', 'cathedral', 'chore'],
    answer: 'chair',
    explanation: '"Chair" and "cathedral" are doublets from the same Greek kathedra (kata=down + hedra=seat). Via Old French "chaire," it became the everyday chair. Via Latin ecclesiastical use, cathedra became "cathedral" — the church containing the bishop\'s throne. The bishop\'s authority is still called their "cathedra," giving us "ex cathedra" (from the seat of authority).',
  },

  {
    id: 'he-007', difficulty: 1, type: 'predict_end',
    targetWord: 'night',
    chain: [
      { language: 'Proto-Indo-European', form: '*nókʷts' },
      { language: 'Old English', form: 'niht' },
      { language: 'Middle English', form: 'nyght' },
      { language: 'Modern English', form: 'night' },
    ],
    hiddenIndex: 3,
    prompt: 'A Proto-Indo-European root for darkness passed through Old English and Middle English. What familiar word did it produce?',
    options: ['night', 'might', 'knight', 'nigh'],
    answer: 'night',
    explanation: '"Night" is a pure Germanic inheritance. PIE *nókʷts is related to Latin nox (→ "nocturnal"), Greek nyx (→ "nyctophobia"), and Sanskrit nakt. The silent "gh" in "night" represents an older guttural sound [x], like the ch in Scottish "loch," which disappeared from English pronunciation in the 16th century but remained fossilised in spelling.',
  },

  {
    id: 'he-008', difficulty: 1, type: 'predict_end',
    targetWord: 'camera',
    chain: [
      { language: 'Latin', form: 'camera', gloss: 'vaulted room / chamber' },
      { language: 'Italian', form: 'camera oscura', gloss: 'dark chamber (optical device)' },
      { language: 'Modern English', form: 'camera' },
    ],
    hiddenIndex: 2,
    prompt: 'Latin "camera" (a vaulted room) was borrowed by Italian scientists for an optical device. What did that device give English?',
    options: ['camera', 'chamber', 'cameo', 'camouflage'],
    answer: 'camera',
    explanation: 'Latin camera (vaulted room) → Italian camera oscura (dark chamber) — a box that projected images through a pinhole. When Daguerre invented photography (1839), the box kept the name "camera." "Chamber" is a doublet: the same Latin word entered English through a different Old French route. Both a bedroom and a camera are, etymologically, just rooms.',
  },

  {
    id: 'he-009', difficulty: 1, type: 'predict_end',
    targetWord: 'alchemy',
    chain: [
      { language: 'Arabic', form: 'al-kīmiyā', gloss: '"the" + transmutation (from Greek khēmeia)' },
      { language: 'Medieval Latin', form: 'alchimia' },
      { language: 'Old French', form: 'alchimie' },
      { language: 'Modern English', form: 'alchemy' },
    ],
    hiddenIndex: 3,
    prompt: 'Arabic "al-kīmiyā" (the art of transmuting metals) passed through Latin and French. What did English call it?',
    options: ['alchemy', 'algebra', 'algorithm', 'almanac'],
    answer: 'alchemy',
    explanation: '"Alchemy" from Arabic al-kīmiyā (the Greek khēmeia, art of transmuting metals). Medieval alchemists sought to turn lead into gold. As "alchemy" lost its al- prefix in English, it became "chemistry" — the modern science. The al- article is an Arabic fingerprint on many English words: algebra, algorithm, alcohol, alkaline, alkali.',
  },

  {
    id: 'he-010', difficulty: 1, type: 'predict_end',
    targetWord: 'woman',
    chain: [
      { language: 'Old English', form: 'wīfmann', gloss: '"woman" + "person"' },
      { language: 'Middle English', form: 'wumman' },
      { language: 'Modern English', form: 'woman' },
    ],
    hiddenIndex: 2,
    prompt: 'Old English joined "wīf" (woman) and "mann" (person/human) into a compound. What single word does it give us today?',
    options: ['woman', 'womb', 'wimple', 'warden'],
    answer: 'woman',
    explanation: '"Woman" from Old English wīfmann — wīf (woman/wife) + mann (person). Old English "mann" was gender-neutral (any human); the gendered sense of "man" developed later. So "woman" literally means "female person" — the gender-neutral "person" (mann) qualified by the female marker (wīf). The pronunciation shifted: wīfmann → wimman → wumman → woman.',
  },

  // ── MEDIUM — mix of predict_end (surprising origins) and fill_gap ──────────

  {
    id: 'he-011', difficulty: 2, type: 'predict_end',
    targetWord: 'lord',
    chain: [
      { language: 'Old English', form: 'hlāford', gloss: '"loaf" + "guardian"' },
      { language: 'Middle English', form: 'laverd' },
      { language: 'Modern English', form: 'lord' },
    ],
    hiddenIndex: 2,
    prompt: '"Hlāford" fused the words for "loaf" (bread) and "guardian." What title of authority did it become?',
    options: ['lord', 'lore', 'laud', 'lard'],
    answer: 'lord',
    explanation: '"Lord" from Old English hlāford — hlāf (loaf/bread) + weard (guardian). A lord was literally the one who guarded and distributed the bread. Similarly, "lady" comes from hlǣfdīge (loaf-kneader). The social hierarchy was built on who controlled the bread supply. Bread — not gold — defined power in Anglo-Saxon England.',
  },

  {
    id: 'he-012', difficulty: 2, type: 'predict_end',
    targetWord: 'lady',
    chain: [
      { language: 'Old English', form: 'hlǣfdīge', gloss: '"loaf" + "kneader"' },
      { language: 'Middle English', form: 'lavedi' },
      { language: 'Modern English', form: 'lady' },
    ],
    hiddenIndex: 2,
    prompt: '"Hlǣfdīge" combined "hlāf" (loaf) with "dīge" (kneader of dough). What did it become in modern English?',
    options: ['lady', 'laity', 'lass', 'lacy'],
    answer: 'lady',
    explanation: '"Lady" from Old English hlǣfdīge — hlāf (loaf) + dīge (one who kneads). "Lord" (loaf-guardian) and "lady" (loaf-kneader) are a matching pair, both built on the same bread. "Dairy" shares the same dīge root — a dairy was originally a place where dough was worked. Power and sustenance were inseparable in Old English social vocabulary.',
  },

  {
    id: 'he-013', difficulty: 2, type: 'predict_end',
    targetWord: 'paradise',
    chain: [
      { language: 'Old Persian', form: 'pairi-daēza', gloss: '"around" + "wall"' },
      { language: 'Greek', form: 'paradeisos', gloss: 'enclosed royal garden' },
      { language: 'Latin', form: 'paradisus' },
      { language: 'Modern English', form: 'paradise' },
    ],
    hiddenIndex: 3,
    prompt: 'A walled Persian royal garden — pairi (around) + daēza (wall) — passed through Greek and Latin. What did English make of it?',
    options: ['paradise', 'paradigm', 'parity', 'parable'],
    answer: 'paradise',
    explanation: '"Paradise" from Old Persian pairi-daēza (a walled enclosure, a royal garden). Alexander the Great encountered these gardens and Greek writers adopted paradeisos. Early Bible translators chose the word for the Garden of Eden. The word travelled from mud-wall enclosure to royal pleasure ground to divine heaven — a journey of 2,500 years.',
  },

  {
    id: 'he-014', difficulty: 2, type: 'predict_end',
    targetWord: 'treasure',
    chain: [
      { language: 'Greek', form: 'thēsauros', gloss: 'treasure storehouse' },
      { language: 'Latin', form: 'thēsaurus' },
      { language: 'Old French', form: 'trésor' },
      { language: 'Modern English', form: 'treasure' },
    ],
    hiddenIndex: 3,
    prompt: 'Greek "thēsauros" (a place where things are stored) entered Latin unchanged, then French. What did English take from it?',
    options: ['treasure', 'thesaurus', 'treasury', 'trestle'],
    answer: 'treasure',
    explanation: '"Treasure" and "thesaurus" are doublets from the same Greek thēsauros. One path: Greek → Latin → Old French trésor → English "treasure" (13th c.). Another: Latin thēsaurus → English "thesaurus" for a word-storehouse (Roget, 1852). The Greek word is from tithēmi (to place) — literally "that which is placed in store."',
  },

  {
    id: 'he-015', difficulty: 2, type: 'predict_end',
    targetWord: 'wife',
    chain: [
      { language: 'Proto-Germanic', form: '*wībą', gloss: 'woman (any adult female)' },
      { language: 'Old English', form: 'wīf', gloss: 'woman (not yet specifically married)' },
      { language: 'Middle English', form: 'wif', gloss: 'woman / married woman' },
      { language: 'Modern English', form: 'wife' },
    ],
    hiddenIndex: 3,
    prompt: 'Proto-Germanic "*wībą" meant simply "woman." Follow the narrowing of meaning — what did the word become?',
    options: ['wife', 'waif', 'life', 'vine'],
    answer: 'wife',
    explanation: '"Wife" from Proto-Germanic *wībą (any woman). Old English wīf kept the general sense — a "fishwife" or "midwife" is any woman, not necessarily a married one. By Middle English, "wife" narrowed to mean a married woman, as "woman" (from wīfmann) took over the general sense. The word specialised while its compound form generalised.',
  },

  {
    id: 'he-016', difficulty: 2, type: 'fill_gap',
    targetWord: 'indigo',
    chain: [
      { language: 'Sanskrit', form: 'nīla', gloss: 'dark blue' },
      { language: 'Arabic', form: 'nīl' },
      { language: 'Spanish', form: 'añil' },
      { language: 'Modern English', form: 'indigo' },
    ],
    hiddenIndex: 2,
    prompt: 'Sanskrit "nīla" (dark blue) moved through Arabic and then a Spanish step before reaching English as "indigo." What was the Spanish form?',
    options: ['añil', 'índigo', 'anil', 'ñilo'],
    answer: 'añil',
    explanation: '"Indigo" traces to Sanskrit nīla (dark blue) → Arabic nīl (the Nile; al-nīl the plant) → Spanish añil (the Arabic article al- fused into añil) → Portuguese índigo → English. Spain dominated the indigo trade through its American colonies, making the Spanish stage pivotal. The word also gives English "aniline" — the synthetic dye family that replaced natural indigo.',
  },

  {
    id: 'he-017', difficulty: 2, type: 'fill_gap',
    targetWord: 'bird',
    chain: [
      { language: 'Old English', form: 'bridd', gloss: 'young bird / nestling' },
      { language: 'Middle English', form: 'brid' },
      { language: 'Modern English', form: 'bird' },
    ],
    hiddenIndex: 1,
    prompt: 'Old English "bridd" (a nestling, not any bird) had its letters rearranged in Middle English. What was the transitional form?',
    options: ['brid', 'byrd', 'birde', 'bred'],
    answer: 'brid',
    explanation: '"Bird" from Old English bridd (a nestling — not yet used for all birds). In Middle English the consonants transposed: bridd → brid → bird. This is metathesis — spontaneous transposition of sounds. The same process changed Old English "wæps" to "wasp," "þridda" to "third," and "frisian" to "firs." The letters rearranged to become more pronounceable.',
  },

  {
    id: 'he-018', difficulty: 2, type: 'predict_end',
    targetWord: 'whisky',
    chain: [
      { language: 'Latin', form: 'aqua vitae', gloss: 'water of life' },
      { language: 'Scottish Gaelic', form: 'uisce beatha', gloss: 'water of life' },
      { language: 'Middle English', form: 'usquebaugh' },
      { language: 'Modern English', form: 'whisky' },
    ],
    hiddenIndex: 3,
    prompt: '"Water of life" was borrowed into Gaelic from Latin, then compressed over centuries by English speakers. What is the result?',
    options: ['whisky', 'biscuit', 'wisket', 'whisper'],
    answer: 'whisky',
    explanation: '"Whisky" from Gaelic uisce beatha (water of life — a translation of Latin aqua vitae). "Uisce" compressed through Middle English usquebaugh → whisky by the 18th century. Many languages name their spirits "water of life": French eau de vie, Scandinavian aquavit, Russian водка (voda=water). The word "whisky" lost about two-thirds of its syllables on the journey.',
  },

  {
    id: 'he-019', difficulty: 2, type: 'fill_gap',
    targetWord: 'fuel',
    chain: [
      { language: 'Latin', form: 'focus', gloss: 'hearth / fireplace' },
      { language: 'Old French', form: 'fouaille', gloss: 'material for a fire' },
      { language: 'Middle English', form: 'fewel' },
      { language: 'Modern English', form: 'fuel' },
    ],
    hiddenIndex: 1,
    prompt: 'Latin "focus" (hearth) generated an Old French word for firewood that English compressed into "fuel." What was that Old French step?',
    options: ['fouaille', 'feu', 'foyer', 'flamme'],
    answer: 'fouaille',
    explanation: 'Latin focus (hearth) → Old French fouaille (material for a hearth) → Middle English fewel → "fuel." The same Latin focus also gave "foyer" (the hearth/entrance hall of a theatre) and — via Kepler in 1604 — "focus" itself (he used it for the focal point of a lens). One Latin fireplace produced three unrelated English words.',
  },

  {
    id: 'he-020', difficulty: 2, type: 'fill_gap',
    targetWord: 'friar',
    chain: [
      { language: 'Proto-Indo-European', form: '*bhreh₂tēr', gloss: 'brother' },
      { language: 'Latin', form: 'frāter' },
      { language: 'Old French', form: 'frère' },
      { language: 'Modern English', form: 'friar' },
    ],
    hiddenIndex: 2,
    prompt: 'PIE "*bhreh₂tēr" (brother) → Latin "frāter" → then an Old French step → English "friar." What was the missing French form?',
    options: ['frère', 'fratre', 'frari', 'frier'],
    answer: 'frère',
    explanation: 'PIE *bhreh₂tēr → Latin frāter → Old French frère → English "friar" (a religious brother). The same PIE root gives English "brother" (via Germanic), making "friar" and "brother" cognates — one French-borrowed, one Old English-inherited. Latin frāter also gives "fraternal," "confraternity," and (through Greek phrater) "phrase." The PIE root for "brother" is one of the most prolific in the language.',
  },

  // ── HARD — fill_gap with obscure intermediate stages ─────────────────────

  {
    id: 'he-021', difficulty: 3, type: 'fill_gap',
    targetWord: 'pedigree',
    chain: [
      { language: 'Latin', form: 'pēs / pedis', gloss: 'foot' },
      { language: 'Old French', form: 'pied de grue', gloss: 'crane\'s foot' },
      { language: 'Middle English', form: 'pedegru' },
      { language: 'Modern English', form: 'pedigree' },
    ],
    hiddenIndex: 1,
    prompt: 'Medieval scribes used a three-line mark resembling a crane\'s footprint to show family descent. What was the Old French phrase that named it?',
    options: ['pied de grue', 'pied de roi', 'pied-à-terre', 'pied de boeuf'],
    answer: 'pied de grue',
    explanation: '"Pedigree" from Old French pied de grue (crane\'s foot). Scribes drew three radiating lines to mark genealogical descent in manuscripts — resembling a crane\'s three-toed print. "Pied de grue" → Middle English pedegru → pedigree. The crane appears elsewhere in etymology: "geranium" (from Greek geranos, crane) names the plant whose seed pods resemble a crane\'s beak.',
  },

  {
    id: 'he-022', difficulty: 3, type: 'fill_gap',
    targetWord: 'govern',
    chain: [
      { language: 'Greek', form: 'kybernētēs', gloss: 'steersman / helmsman' },
      { language: 'Latin', form: 'gubernāre', gloss: 'to steer a ship' },
      { language: 'Old French', form: 'governer' },
      { language: 'Modern English', form: 'govern' },
    ],
    hiddenIndex: 1,
    prompt: '"Govern" descends from the Greek word for a ship\'s steersman. What was the crucial Latin step that transmitted it to Old French?',
    options: ['gubernāre', 'gubernator', 'cubernare', 'guberium'],
    answer: 'gubernāre',
    explanation: '"Govern" from Greek kybernētēs (steersman) → Latin gubernāre → Old French governer → English. The same Greek root gave Norbert Wiener "cybernetics" (the science of control and communication, 1948). "Govern" and "cyber" are distant cousins — one arrived through Latin and French, one was coined directly from Greek. Both mean: the art of steering.',
  },

  {
    id: 'he-023', difficulty: 3, type: 'fill_gap',
    targetWord: 'apron',
    chain: [
      { language: 'Latin', form: 'mappa', gloss: 'napkin / cloth' },
      { language: 'Old French', form: 'nappe' },
      { language: 'Middle English', form: 'napron', gloss: '"a napron" misheard as "an apron"' },
      { language: 'Modern English', form: 'apron' },
    ],
    hiddenIndex: 2,
    prompt: 'Old French "nappe" became Middle English "napron." The n at the start was then stolen by the article "an." What was the Middle English form before the theft?',
    options: ['napron', 'naperon', 'nappern', 'naporn'],
    answer: 'napron',
    explanation: '"Apron" from Old French nappe → Middle English "a napron." Speakers misanalysed "a napron" as "an apron," and the n transferred from the noun to the article. This is called wrong division or metanalysis. The same process reversed for "a newt" (was "an ewt," from Old English efete) and "an adder" (was "a naddre," from Old English næddre, cognate with "snake").',
  },

  {
    id: 'he-024', difficulty: 3, type: 'predict_end',
    targetWord: 'salary',
    chain: [
      { language: 'Latin', form: 'sal', gloss: 'salt' },
      { language: 'Latin', form: 'salārium', gloss: 'salt allowance paid to soldiers' },
      { language: 'Middle English', form: 'salarie' },
      { language: 'Modern English', form: 'salary' },
    ],
    hiddenIndex: 3,
    prompt: 'Roman soldiers received a "salārium" — an allowance to buy salt. This payment gave English a word for all regular income. What is it?',
    options: ['salary', 'sale', 'saline', 'salvage'],
    answer: 'salary',
    explanation: '"Salary" from Latin salārium (salt allowance, from sal = salt). Salt was essential for preserving food and precious enough to act as currency, hence "worth one\'s salt." The same sal root gives "sauce," "sausage," "salad" (salted vegetables), "salami," and "salve." Salt shaped Western language as much as it shaped Western history.',
  },

  {
    id: 'he-025', difficulty: 3, type: 'fill_gap',
    targetWord: 'tragedy',
    chain: [
      { language: 'Greek', form: 'tragōidia', gloss: '"goat" (tragos) + "song" (ōidē)' },
      { language: 'Latin', form: 'tragoedia' },
      { language: 'Old French', form: 'tragédie' },
      { language: 'Modern English', form: 'tragedy' },
    ],
    hiddenIndex: 2,
    prompt: 'Greek "goat-song" (tragōidia) passed through Latin unchanged, then took an Old French form before becoming English. What was that French step?',
    options: ['tragédie', 'trageoire', 'trobadie', 'tragidie'],
    answer: 'tragédie',
    explanation: '"Tragedy" from Greek tragōidia (tragos=goat + ōidē=song). At Athenian dramatic festivals, a goat was the prize for the best performance, and early ritual choruses may have worn goatskins. The word entered English in the 14th century via Old French tragédie, along with a wave of literary vocabulary. The goat is long forgotten; the genre remains.',
  },

  {
    id: 'he-026', difficulty: 3, type: 'fill_gap',
    targetWord: 'cotton',
    chain: [
      { language: 'Sanskrit', form: 'karpāsa', gloss: 'cotton plant' },
      { language: 'Greek', form: 'karpasos' },
      { language: 'Arabic', form: 'al-quṭn' },
      { language: 'Old French', form: 'coton' },
      { language: 'Modern English', form: 'cotton' },
    ],
    hiddenIndex: 2,
    prompt: 'Sanskrit "karpāsa" reached Europe through Greek and then a pivotal Arabic stage. What was the Arabic form that transmitted it to Old French?',
    options: ['al-quṭn', 'al-katn', 'al-koton', 'al-qatan'],
    answer: 'al-quṭn',
    explanation: '"Cotton" from Sanskrit karpāsa → Greek karpasos → Arabic al-quṭn (the cotton) → Old French coton → English. Arab traders dominated the medieval cotton trade, making the Arabic stage the transmission point for the word into Europe. Arabic gave Europe many fabric words: cotton, muslin (from Mosul), damask (from Damascus), and satin (from Zaytun/Quanzhou, China).',
  },

  {
    id: 'he-027', difficulty: 3, type: 'fill_gap',
    targetWord: 'assassin',
    chain: [
      { language: 'Arabic', form: 'hashshāshīn', gloss: 'hashish users' },
      { language: 'Medieval Latin', form: 'assassinus' },
      { language: 'Old French', form: 'assassin' },
      { language: 'Modern English', form: 'assassin' },
    ],
    hiddenIndex: 1,
    prompt: 'Arabic "hashshāshīn" was Latinised by Crusader-era scholars before entering French and English. What was the Medieval Latin form?',
    options: ['assassinus', 'assassinator', 'hashiminus', 'assasarius'],
    answer: 'assassinus',
    explanation: '"Assassin" from Arabic hashshāshīn (users of hashish), referring to the Nizari Ismaili sect of Alamut (c.1090–1275) who carried out political killings. Crusaders brought the word home. It was Latinised as assassinus, then adopted unchanged into French and English. Whether the hashish connection is historical fact or enemy slander remains debated — but the word spread with the fear.',
  },

  {
    id: 'he-028', difficulty: 3, type: 'fill_gap',
    targetWord: 'algebra',
    chain: [
      { language: 'Arabic', form: 'al-jabr', gloss: 'reunion of broken parts' },
      { language: 'Medieval Latin', form: 'algebra' },
      { language: 'Modern English', form: 'algebra' },
    ],
    hiddenIndex: 1,
    prompt: 'Arabic "al-jabr" (reunion of broken parts) needed a Latin form before Europeans could study it. What did medieval scholars call it?',
    options: ['algebra', 'algorismus', 'alchimia', 'alkali'],
    answer: 'algebra',
    explanation: '"Algebra" from al-Khwārizmī\'s 9th-century treatise on solving equations. Medieval scholars Latinised al-jabr as algebra (identically), then English adopted it. Al-Khwārizmī\'s own name — Latinised as Algoritmi — gave us "algorithm." The same book introduced Hindu-Arabic numerals (0–9) to Europe. One Arab mathematician shaped how the entire Western world does mathematics.',
  },

  {
    id: 'he-029', difficulty: 3, type: 'fill_gap',
    targetWord: 'glamour',
    chain: [
      { language: 'Latin', form: 'grammatica', gloss: 'grammar / the art of letters' },
      { language: 'Middle English', form: 'grammarye', gloss: 'occult learning / magic spells' },
      { language: 'Scots English', form: 'glamour', gloss: 'a magic spell' },
      { language: 'Modern English', form: 'glamour' },
    ],
    hiddenIndex: 1,
    prompt: 'Latin "grammatica" became associated with magic in the Middle Ages and shifted meaning entirely. What was the Middle English form that linked grammar to sorcery?',
    options: ['grammarye', 'gramariye', 'grimoire', 'gramery'],
    answer: 'grammarye',
    explanation: '"Glamour" is a Scottish corruption of "grammar." In the Middle Ages, Latin literacy was so rare it seemed magical — "grammarye" meant both learning and occult knowledge. Scottish speakers transformed grammarye into "glamour" (a magic spell). By the 1930s Hollywood adopted it for "alluring charm." Latin "grimoire" (a book of magic) is the same word again, via French.',
  },

  {
    id: 'he-030', difficulty: 3, type: 'fill_gap',
    targetWord: 'garble',
    chain: [
      { language: 'Arabic', form: 'gharbala', gloss: 'to sift and select' },
      { language: 'Italian', form: 'garbellare', gloss: 'to sift spices for quality' },
      { language: 'Middle English', form: 'garbelen', gloss: 'to sort / select' },
      { language: 'Modern English', form: 'garble', gloss: 'to distort / scramble' },
    ],
    hiddenIndex: 1,
    prompt: 'Arabic "gharbala" (to sift carefully) passed through an Italian spice-trade term before reaching English with a completely reversed meaning. What was the Italian step?',
    options: ['garbellare', 'garbolare', 'garbare', 'garbarino'],
    answer: 'garbellare',
    explanation: '"Garble" from Arabic gharbala (to sift, select) → Italian garbellare (to sift spices) → Middle English garbelen (to sort). Originally it meant careful, precise selection — the opposite of confusion. The meaning reversed because spice merchants who "garbled" goods were accused of secretly adulterating them. The act of sorting became synonymous with the deception it concealed.',
  },
];
