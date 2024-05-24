import {BookName, Books} from '../../books.js';

const BookNames = new Map<Books, BookName[]>();
// Add entries to the map for each book
// Genesis = 'GEN',
BookNames.set(Books.Genesis, [
  {name: 'Genesis', abbreviations: ['Gen', 'Ge', 'Gn'], orthodox_only: false},
]);

// Exodus = 'EXO',
BookNames.set(Books.Exodus, [
  {name: 'Exodus', abbreviations: ['Ex', 'Exod', 'Exo'], orthodox_only: false},
]);

// Leviticus = 'LEV',
BookNames.set(Books.Leviticus, [
  {name: 'Leviticus', abbreviations: ['Lev', 'Le', 'Lv'], orthodox_only: false},
]);

// Numbers = 'NUM',
BookNames.set(Books.Numbers, [
  new BookName('Numbers', ['Num', 'Nu', 'Nm', 'Nb']),
]);

// Deuteronomy = 'DEU',
BookNames.set(Books.Deuteronomy, [
  new BookName('Deuteronomy', ['Deut', 'De', 'Dt']),
]);

// Joshua = 'JOS',
BookNames.set(Books.Joshua, [new BookName('Joshua', ['Josh', 'Jos', 'Jsh'])]);

// Judges = 'JDG',
BookNames.set(Books.Judges, [
  new BookName('Judges', ['Judg', 'Jdg', 'Jg', 'Jdgs']),
]);

// Ruth = 'RUT',
BookNames.set(Books.Ruth, [new BookName('Ruth', ['Ruth', 'Rth', 'Ru'])]);

// Samuel_1 = '1SA',
BookNames.set(Books.Samuel_1, [
  new BookName('1 Samuel', [
    '1 Sam',
    '1 Sm',
    '1 Sa',
    '1 S',
    'I Sam',
    'I Sa',
    '1Sam',
    '1Sa',
    '1S',
    '1st Samuel',
    '1st Sam',
    'First Samuel',
    'First Sam',
  ]),
  new BookName(
    '1 Kings',
    ['1 Kgs', '1 Ki', '1Kgs', '1Kin', '1Ki', '1K', 'I Kgs', 'I Ki'],
    true
  ),
  new BookName('1 Kingdoms', [], true),
]);

// Samuel_2 = '2SA',
BookNames.set(Books.Samuel_2, [
  new BookName('1 Samuel', [
    '2 Sam',
    '2 Sm',
    '2 Sa',
    '2 S',
    'II Sam',
    'II Sa',
    '2Sam',
    '2Sa',
    '2S',
    '2nd Samuel',
    '2nd Sam',
    'Second Samuel',
    'Second Sam',
  ]),
  new BookName('2 Kings', [], true),
  new BookName('2 Kingdoms', [], true),
]);

// Kings_1 = '1KI',
BookNames.set(Books.Kings_1, [
  new BookName('1 Kings', [
    '1 Kgs',
    '1 Ki',
    '1Kgs',
    '1Kin',
    '1Ki',
    '1K',
    'I Kgs',
    'I Ki',
    '1st Kings',
    '1st Kgs',
    'First Kings',
    'First Kgs',
  ]),
  new BookName('3 Kings', [], true),
  new BookName('3 Kingdoms', [], true),
]);

// Kings_2 = '2KI',
BookNames.set(Books.Kings_2, [
  new BookName('2 Kings', [
    '2 Kgs',
    '2 Ki',
    '2Kgs',
    '2Kin',
    '2Ki',
    '2K',
    'II Kgs',
    'II Ki',
    '2nd Kings',
    '2nd Kgs',
    'Second Kings',
    'Second Kgs',
  ]),
  new BookName('4 Kings', [], true),
  new BookName('4 Kingdoms', [], true),
]);

// Chronicles_1 = '1CH',
BookNames.set(Books.Chronicles_1, [
  new BookName('1 Chronicles', [
    '1 Chron',
    '1 Chr',
    '1 Ch',
    '1Chron',
    '1Chr',
    '1Ch',
    'I Chron',
    'I Chr',
    'I Ch',
    '1st Chronicles',
    '1st Chron',
    'First Chronicles',
    'First Chron',
  ]),
]);

// Chronicles_2 = '2CH',
BookNames.set(Books.Chronicles_2, [
  new BookName('2 Chronicles', [
    '2 Chron',
    '2 Chr',
    '2 Ch',
    '2Chron',
    '2Chr',
    '2Ch',
    'II Chron',
    'II Chr',
    'II Ch',
    '2nd Chronicles',
    '2nd Chron',
    'Second Chronicles',
    'Second Chron',
  ]),
]);

// Ezra = 'EZR',
BookNames.set(Books.Ezra, [new BookName('Ezra', ['Ezr', 'Ez'])]);

// Nehemiah = 'NEH',
BookNames.set(Books.Nehemiah, [new BookName('Nehemiah', ['Neh', 'Ne'])]);

// Esther_Hebrew = 'EST',
BookNames.set(Books.Esther_Hebrew, [
  new BookName('Esther', ['Est', 'Esth', 'Es']),
]);

// Job = 'JOB',
BookNames.set(Books.Job, [new BookName('Job', ['Jb'])]);

// Psalms = 'PSA',
BookNames.set(Books.Psalms, [
  new BookName('Psalms', ['Ps', 'Psalm', 'Pslm', 'Psa', 'Psm', 'Pss']),
]);

// Proverbs = 'PRO',
BookNames.set(Books.Proverbs, [
  new BookName('Proverbs', ['Prov', 'Pro', 'Prv', 'Pr']),
]);

// Ecclesiastes = 'ECC',
BookNames.set(Books.Ecclesiastes, [
  new BookName('Ecclesiastes', ['Eccles', 'Eccle', 'Ecc', 'Ec']),
  new BookName('Qoholeth', ['Qoh']),
]);

// Song_of_Songs = 'SNG',
BookNames.set(Books.Song_of_Songs, [
  new BookName('Song of Solomon', ['Song', 'Song of Songs', 'SOS', 'So']),
  new BookName('Canticle of Canticles', ['Canticles', 'Cant']),
]);

// Isaiah = 'ISA',
BookNames.set(Books.Isaiah, [new BookName('Isaiah', ['Isa', 'Is'])]);

// Jeremiah = 'JER',
BookNames.set(Books.Jeremiah, [new BookName('Jeremiah', ['Jer', 'Je', 'Jr'])]);

// Lamentations = 'LAM',
BookNames.set(Books.Lamentations, [
  new BookName('Lamentations', ['Lam', 'La']),
]);

// Ezekiel = 'EZK',
BookNames.set(Books.Ezekiel, [new BookName('Ezekiel', ['Ezek', 'Eze', 'Ezk'])]);

// Daniel_Hebrew = 'DAN',
BookNames.set(Books.Daniel_Hebrew, [
  new BookName('Daniel', ['Dan', 'Da', 'Dn']),
]);

// Hosea = 'HOS',
BookNames.set(Books.Hosea, [new BookName('Hosea', ['Hos', 'Ho'])]);

// Joel = 'JOL',
BookNames.set(Books.Joel, [new BookName('Joel', ['Jl'])]);

// Amos = 'AMO',
BookNames.set(Books.Amos, [new BookName('Amos', ['Am'])]);

// Obadiah = 'OBA',
BookNames.set(Books.Obadiah, [new BookName('Obadiah', ['Obad', 'Ob'])]);

// Jonah = 'JON',
BookNames.set(Books.Jonah, [new BookName('Jonah', ['Jnh', 'Jon'])]);

// Micah = 'MIC',
BookNames.set(Books.Micah, [new BookName('Micah', ['Mic', 'Mc'])]);

// Nahum = 'NAM',
BookNames.set(Books.Nahum, [new BookName('Nahum', ['Nah', 'Na'])]);

// Habakkuk = 'HAB',
BookNames.set(Books.Habakkuk, [new BookName('Habakkuk', ['Hab', 'Hb'])]);

// Zephaniah = 'ZEP',
BookNames.set(Books.Zephaniah, [
  new BookName('Zephaniah', ['Zeph', 'Zep', 'Zp']),
]);

// Haggai = 'HAG',
BookNames.set(Books.Haggai, [new BookName('Haggai', ['Hag', 'Hg'])]);

// Zechariah = 'ZEC',
BookNames.set(Books.Zechariah, [
  new BookName('Zechariah', ['Zech', 'Zec', 'Zc']),
]);

// Malachi = 'MAL',
BookNames.set(Books.Malachi, [new BookName('Malachi', ['Mal', 'Ml'])]);

// Matthew = 'MAT',
BookNames.set(Books.Matthew, [new BookName('Matthew', ['Matt', 'Mt'])]);

// Mark = 'MRK',
BookNames.set(Books.Mark, [new BookName('Mark', ['Mrk', 'Mar', 'Mk', 'Mr'])]);

// Luke = 'LUK',
BookNames.set(Books.Luke, [new BookName('Luke', ['Luk', 'Lk'])]);

// John = 'JHN',
BookNames.set(Books.John, [new BookName('John', ['Joh', 'Jhn', 'Jn'])]);

// Acts = 'ACT',
BookNames.set(Books.Acts, [new BookName('Acts', ['Act', 'Ac'])]);

// Romans = 'ROM',
BookNames.set(Books.Romans, [new BookName('Romans', ['Rom', 'Ro', 'Rm'])]);

// Corinthians_1 = '1CO',
BookNames.set(Books.Corinthians_1, [
  new BookName('1 Corinthians', [
    '1 Cor',
    '1 Co',
    '1Cor',
    '1Co',
    '1Corinthians',
    'I Corinthians',
    'I Cor',
    'I Co',
    '1st Corinthians',
    'First Corinthians',
  ]),
]);

// Corinthians_2 = '2CO',
BookNames.set(Books.Corinthians_2, [
  new BookName('2 Corinthians', [
    '2 Cor',
    '2 Co',
    '2Cor',
    '2Co',
    '2Corinthians',
    'II Corinthians',
    'II Cor',
    'II Co',
    '2nd Corinthians',
    'Second Corinthians',
  ]),
]);

// Galatians = 'GAL',
BookNames.set(Books.Galatians, [new BookName('Galatians', ['Gal', 'Ga'])]);

// Ephesians = 'EPH',
BookNames.set(Books.Ephesians, [new BookName('Ephesians', ['Eph', 'Ephes'])]);

// Philippians = 'PHP',
BookNames.set(Books.Philippians, [
  new BookName('Philippians', ['Phil', 'Php', 'Pp']),
]);

// Colossians = 'COL',
BookNames.set(Books.Colossians, [new BookName('Colossians', ['Col', 'Co'])]);

// Thessalonians_1 = '1TH',
BookNames.set(Books.Thessalonians_1, [
  new BookName('1 Thessalonians', [
    '1 Thess',
    '1 Thes',
    '1 Th',
    'I Thessalonians',
    'I Thess',
    'I Thes',
    'I Th',
    '1Thessalonians',
    '1Thess',
    '1Thes',
    '1Th',
    '1st Thessalonians',
    '1st Thess',
    'First Thessalonians',
    'First Thess',
  ]),
]);

// Thessalonians_2 = '2TH',
BookNames.set(Books.Thessalonians_2, [
  new BookName('2 Thessalonians', [
    '2 Thess',
    '2 Thes',
    '2 Th',
    'II Thessalonians',
    'II Thess',
    'II Thes',
    'II Th',
    '2Thessalonians',
    '2Thess',
    '2Thes',
    '2Th',
    '2nd Thessalonians',
    '2nd Thess',
    'Second Thessalonians',
    'Second Thess',
  ]),
]);

// Timothy_1 = '1TI',
BookNames.set(Books.Timothy_1, [
  new BookName('1 Timothy', [
    '1 Tim',
    '1 Ti',
    'I Timothy',
    'I Tim',
    'I Ti',
    '1Timothy',
    '1Tim',
    '1Ti',
    '1st Timothy',
    '1st Tim',
    'First Timothy',
    'First Tim',
  ]),
]);

// Timothy_2 = '2TI',
BookNames.set(Books.Timothy_2, [
  new BookName('2 Timothy', [
    '2 Tim',
    '2 Ti',
    'II Timothy',
    'II Tim',
    'II Ti',
    '2Timothy',
    '2Tim',
    '2Ti',
    '2nd Timothy',
    '2nd Tim',
    'Second Timothy',
    'Second Tim',
  ]),
]);

// Titus = 'TIT',
BookNames.set(Books.Titus, [new BookName('Titus', ['Tit', 'Ti'])]);

// Philemon = 'PHM',
BookNames.set(Books.Philemon, [
  new BookName('Philemon', ['Philem', 'Phm', 'Pm']),
]);

// Hebrews = 'HEB',
BookNames.set(Books.Hebrews, [new BookName('Hebrews', ['Heb'])]);

// James = 'JAS',
BookNames.set(Books.James, [new BookName('James', ['Jas', 'Jm'])]);

// Peter_1 = '1PE',
BookNames.set(Books.Peter_1, [
  new BookName('1 Peter', [
    '1 Pet',
    '1 Pe',
    '1 Pt',
    '1 P',
    'I Pet',
    'I Pt',
    'I Pe',
    '1Peter',
    '1Pet',
    '1Pe',
    '1Pt',
    '1P',
    'I Peter',
    '1st Peter',
    'First Peter',
  ]),
]);

// Peter_2 = '2PE',
BookNames.set(Books.Peter_2, [
  new BookName('2 Peter', [
    '2 Pet',
    '2 Pe',
    '2 Pt',
    '2 P',
    'II Peter',
    'II Pet',
    'II Pt',
    'II Pe',
    '2Peter',
    '2Pet',
    '2Pe',
    '2Pt',
    '2P',
    '2nd Peter',
    'Second Peter',
  ]),
]);

// John_1 = '1JN',
BookNames.set(Books.John_1, [
  new BookName('1 John', [
    '1 John',
    '1 Jhn',
    '1 Jn',
    '1 J',
    '1John',
    '1Jhn',
    '1Joh',
    '1Jn',
    '1Jo',
    '1J',
    'I John',
    'I Jhn',
    'I Joh',
    'I Jn',
    'I Jo',
    '1st John',
    'First John',
  ]),
]);

// John_2 = '2JN',
BookNames.set(Books.John_2, [
  new BookName('2 John', [
    '2 John',
    '2 Jhn',
    '2 Jn',
    '2 J',
    '2John',
    '2Jhn',
    '2Joh',
    '2Jn',
    '2Jo',
    '2J',
    'II John',
    'II Jhn',
    'II Joh',
    'II Jn',
    'II Jo',
    '2nd John',
    'Second John',
  ]),
]);

// John_3 = '3JN',
BookNames.set(Books.John_3, [
  new BookName('3 John', [
    '3 John',
    '3 Jhn',
    '3 Jn',
    '3 J',
    '3John',
    '3Jhn',
    '3Joh',
    '3Jn',
    '3Jo',
    '3J',
    'III John',
    'III Jhn',
    'III Joh',
    'III Jn',
    'III Jo',
    '3rd John',
    'Third John',
  ]),
]);

// Jude = 'JUD',
BookNames.set(Books.Jude, [new BookName('Jude', ['Jud', 'Jd'])]);

// Revelation = 'REV',
BookNames.set(Books.Revelation, [
  new BookName('Revelation', ['Rev', 'Re', 'The Revelation']),
]);

// Tobit = 'TOB',
BookNames.set(Books.Tobit, [new BookName('Tobit', ['Tob', 'Tb'])]);

// Judith = 'JDT',
BookNames.set(Books.Judith, [new BookName('Judith', ['Jth', 'Jdth', 'Jdt'])]);

// Esther_Greek = 'ESG',
BookNames.set(Books.Esther_Greek, [
  new BookName('Additions to Esther', [
    'Add Esth',
    'Add Es',
    'Rest of Esther',
    'The Rest of Esther',
    'AEs',
    'AddEsth',
  ]),
]);

// Wisdom_of_Solomon = 'WIS',
BookNames.set(Books.Wisdom_of_Solomon, [
  new BookName('Wisdom of Solomon', ['Wisd. of Sol', 'Wisdom', 'Wis', 'Ws']),
]);

// Sirach = 'SIR',
BookNames.set(Books.Sirach, [
  new BookName('Sirach', ['Sir']),
  new BookName('Ecclesiasticus', ['Ecclus']),
]);

// Baruch = 'BAR',
BookNames.set(Books.Baruch, [new BookName('Baruch', ['Bar'])]);

// Letter_of_Jeremiah = 'LJE',
BookNames.set(Books.Letter_of_Jeremiah, [
  new BookName('Letter of Jeremiah', [
    'Ep. Jer',
    'Let. Jer',
    'Ltr. Jer',
    'LJe',
  ]),
]);

// Song_of_the_3_Young_Men = 'S3Y',
BookNames.set(Books.Song_of_the_3_Young_Men, [
  new BookName('Song of the 3 Young Men', [
    'Sg. of 3 Childr',
    'Song of Three',
    'Song of Thr',
    'Song Thr',
    'The Song of Three Youths',
    'The Song of the Three Holy Children',
    'Song of the Three Holy Children',
    'Song of the Three Holy Children',
    'Song of Three Children',
    'The Song of Three Jews',
    'Song of Three Jews',
    'Song of Three Youths',
  ]),
  new BookName('Prayer of Azariah', ['Prayer of Azariah', 'Azariah', 'Pr. Az']),
]);

// Susanna = 'SUS',
BookNames.set(Books.Susanna, [new BookName('Susanna', ['Sus'])]);

// Bel_and_the_Dragon = 'BEL',
BookNames.set(Books.Bel_and_the_Dragon, [
  new BookName('Bel and the Dragon', ['Bel and Dr', 'Bel']),
]);

// Maccabees_1 = '1MA',
BookNames.set(Books.Maccabees_1, [
  new BookName('1 Maccabees', [
    '1 Macc',
    '1 Mac',
    '1Maccabees',
    '1Macc',
    '1Mac',
    '1Ma',
    '1M',
    'I Maccabees',
    'I Macc',
    'I Mac',
    'I Ma',
    '1st Maccabees',
    'First Maccabees',
  ]),
]);

// Maccabees_2 = '2MA',
BookNames.set(Books.Maccabees_2, [
  new BookName('2 Maccabees', [
    '2 Macc',
    '2 Mac',
    '2Maccabees',
    '2Macc',
    '2Mac',
    '2Ma',
    '2M',
    'II Maccabees',
    'II Macc',
    'II Mac',
    'II Ma',
    '2nd Maccabees',
    'Second Maccabees',
  ]),
]);

// Maccabees_3 = '3MA',
BookNames.set(Books.Maccabees_3, [
  new BookName('3 Maccabees', [
    '3 Macc',
    '3 Mac',
    '3Maccabees',
    '3Macc',
    '3Mac',
    '3Ma',
    '3M',
    'III Maccabees',
    'III Macc',
    'III Mac',
    'III Ma',
    '3rd Maccabees',
    'Third Maccabees',
  ]),
]);

// Maccabees_4 = '4MA',
BookNames.set(Books.Maccabees_4, [
  new BookName('4 Maccabees', [
    '4 Macc',
    '4 Mac',
    '4Maccabees',
    '4Macc',
    '4Mac',
    '4Ma',
    '4M',
    'IV Maccabees',
    'IV Macc',
    'IV Mac',
    'IV Ma',
    '4th Maccabees',
    'Fourth Maccabees',
  ]),
]);

// Esdras_1_Greek = '1ES',
BookNames.set(Books.Esdras_1_Greek, [
  new BookName('1 Esdras', [
    '1 Esd',
    '1 Esdr',
    '1Esdras',
    '1Esdr',
    '1Esd',
    '1Es',
    'I Esdras',
    'I Esdr',
    'I Esd',
    'I Es',
    '1st Esdras',
    'First Esdras',
  ]),
]);

// Esdras_2_Latin = '2ES',
BookNames.set(Books.Esdras_2_Latin, [
  new BookName('2 Esdras', [
    '2 Esd',
    '2 Esdr',
    '2Esdras',
    '2Esdr',
    '2Esd',
    '2Es',
    'II Esdras',
    'II Esdr',
    'II Esd',
    'II Es',
    '2nd Esdras',
    'Second Esdras',
  ]),
]);

// Prayer_of_Manasseh = 'MAN',
BookNames.set(Books.Prayer_of_Manasseh, [
  new BookName('Prayer of Manasseh', [
    'Pr. of Man',
    'PMa',
    'Prayer of Manasses',
  ]),
]);

// Psalm_151 = 'PS2'
BookNames.set(Books.Psalm_151, [new BookName('Psalm 151', ['Ps. 151'])]);

// Odae = 'ODA',
BookNames.set(Books.Odae, [new BookName('Ode', ['Ode'])]);

// Psalms_of_Solomon = 'PSS',
BookNames.set(Books.Psalms_of_Solomon, [
  new BookName('Psalms of Solomon', [
    'Ps. Solomon',
    'Ps. Sol',
    'Psalms Solomon',
    'PsSol',
  ]),
]);

// Psalms_152_155 = 'PS3',
BookNames.set(Books.Psalms_152_155, [
  new BookName('Additional Psalm', ['Add. Psalm', 'Add. Ps']),
]);

// Letter_to_the_Laodiceans = 'LAO',
BookNames.set(Books.Letter_to_the_Laodiceans, [
  new BookName('Epistle to the Laodiceans', [
    'Ep. Lao',
    'Epistle to Laodiceans',
    'Epistle Laodiceans',
    'Epist. Laodiceans',
    'Ep. Laod',
    'Laodiceans',
    'Laod',
  ]),
  new BookName('Letter to the Laodiceans', [
    'Ep. Lao',
    'Epistle to Laodiceans',
    'Epistle Laodiceans',
    'Epist. Laodiceans',
    'Ep. Laod',
    'Laodiceans',
    'Laod',
  ]),
]);
