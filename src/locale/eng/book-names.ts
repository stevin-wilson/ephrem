import {Books} from '../../books.js';

export interface BookName {
  readonly name: string;
  readonly abbreviations?: string[];
  /**
   * `orthodox_only` is used to indicate name and abbreviation that are exclusive to Orthodox Bibles.
   * For example, 1 Samuel is called 1 Kings or Kingdoms in Orthodox Bibles
   */
  readonly orthodox_only: boolean;
}

const BookNames = new Map<Books, BookName[]>();
// Add entries to the map for each book
// Genesis = 'GEN',
BookNames.set(Books.Genesis, [
  {name: 'Genesis', abbreviations: ['Gen', 'Gn'], orthodox_only: false},
]);

// Exodus = 'EXO',
BookNames.set(Books.Exodus, [
  {name: 'Exodus', abbreviations: ['Ex', 'Exod'], orthodox_only: false},
]);

// Leviticus = 'LEV',
BookNames.set(Books.Leviticus, [
  {name: 'Leviticus', abbreviations: ['Lev', 'Lv'], orthodox_only: false},
]);

// Numbers = 'NUM',
BookNames.set(Books.Numbers, [
  {
    name: 'Numbers',
    abbreviations: ['Num', 'Nm'],
    orthodox_only: false,
  },
]);

// Deuteronomy = 'DEU',
BookNames.set(Books.Deuteronomy, [
  {
    name: 'Deuteronomy',
    abbreviations: ['Deut', 'Dt'],
    orthodox_only: false,
  },
]);

// Joshua = 'JOS',
BookNames.set(Books.Joshua, [
  {name: 'Joshua', abbreviations: ['Josh', 'Jo'], orthodox_only: false},
]);

// Judges = 'JDG',
BookNames.set(Books.Judges, [
  {name: 'Judges', abbreviations: ['Judg', 'Jgs'], orthodox_only: false},
]);

// Ruth = 'RUT',
BookNames.set(Books.Ruth, [
  {name: 'Ruth', abbreviations: ['Ru'], orthodox_only: false},
]);

// Samuel_1 = '1SA',
BookNames.set(Books.Samuel_1, [
  {name: '1 Samuel', abbreviations: ['1 Sam', '1 Sm'], orthodox_only: false},
  {
    name: '1 Kings',
    abbreviations: ['1 Kgs'],
    orthodox_only: true,
  },
  {name: '1 Kingdoms', orthodox_only: true},
]);

// Samuel_2 = '2SA',
BookNames.set(Books.Samuel_2, [
  {name: '2 Samuel', abbreviations: ['2 Sam', '2 Sm'], orthodox_only: false},
  {
    name: '2 Kings',
    abbreviations: ['2 Kgs'],
    orthodox_only: true,
  },
  {name: '2 Kingdoms', orthodox_only: true},
]);

// Kings_1 = '1KI',
BookNames.set(Books.Kings_1, [
  {
    name: '1 Kings',
    abbreviations: ['1 Kgs'],
    orthodox_only: false,
  },
  {
    name: '3 Kings',
    abbreviations: ['3 Kgs'],
    orthodox_only: true,
  },
  {name: '3 Kingdoms', orthodox_only: true},
]);

// Kings_2 = '2KI',
BookNames.set(Books.Kings_2, [
  {
    name: '2 Kings',
    abbreviations: ['2 Kgs'],
    orthodox_only: false,
  },
  {
    name: '4 Kings',
    abbreviations: ['4 Kgs'],
    orthodox_only: true,
  },
  {name: '4 Kingdoms', orthodox_only: true},
]);

// Chronicles_1 = '1CH',
BookNames.set(Books.Chronicles_1, [
  {
    name: '1 Chronicles',
    abbreviations: ['1 Chron', '1 Chr'],
    orthodox_only: false,
  },
]);

// Chronicles_2 = '2CH',
BookNames.set(Books.Chronicles_2, [
  {
    name: '2 Chronicles',
    abbreviations: ['2 Chron', '2 Chr'],
    orthodox_only: false,
  },
]);

// Ezra = 'EZR',
BookNames.set(Books.Ezra, [
  {name: 'Ezra', abbreviations: ['Ezr'], orthodox_only: false},
]);

// Nehemiah = 'NEH',
BookNames.set(Books.Nehemiah, [
  {name: 'Nehemiah', abbreviations: ['Neh'], orthodox_only: false},
]);

// Esther_Hebrew = 'EST',
BookNames.set(Books.Esther_Hebrew, [
  {name: 'Esther', abbreviations: ['Est'], orthodox_only: false},
]);

// Job = 'JOB',
BookNames.set(Books.Job, [
  {name: 'Job', abbreviations: ['Jb'], orthodox_only: false},
]);

// Psalms = 'PSA',
BookNames.set(Books.Psalms, [
  {name: 'Psalms', abbreviations: ['Ps', 'Pss'], orthodox_only: false},
]);

// Proverbs = 'PRO',
BookNames.set(Books.Proverbs, [
  {name: 'Proverbs', abbreviations: ['Prov', 'Prv'], orthodox_only: false},
]);

// Ecclesiastes = 'ECC',
BookNames.set(Books.Ecclesiastes, [
  {
    name: 'Ecclesiastes',
    abbreviations: ['Eccles', 'Eccl'],
    orthodox_only: false,
  },
  {name: 'Qoholeth', abbreviations: ['Qoh'], orthodox_only: false},
]);

// Song_of_Songs = 'SNG',
BookNames.set(Books.Song_of_Songs, [
  {
    name: 'Song of Solomon',
    abbreviations: ['Song of Sol', 'Sg'],
    orthodox_only: false,
  },
  {name: 'Song of Songs', orthodox_only: false},
  {
    name: 'Canticle of Canticles',
    abbreviations: ['Canticles', 'Cant'],
    orthodox_only: false,
  },
]);

// Isaiah = 'ISA',
BookNames.set(Books.Isaiah, [
  {name: 'Isaiah', abbreviations: ['Isa', 'Is'], orthodox_only: false},
]);

// Jeremiah = 'JER',
BookNames.set(Books.Jeremiah, [
  {name: 'Jeremiah', abbreviations: ['Jer'], orthodox_only: false},
]);

// Lamentations = 'LAM',
BookNames.set(Books.Lamentations, [
  {name: 'Lamentations', abbreviations: ['Lam'], orthodox_only: false},
]);

// Ezekiel = 'EZK',
BookNames.set(Books.Ezekiel, [
  {name: 'Ezekiel', abbreviations: ['Ezek', 'Ez'], orthodox_only: false},
]);

// Daniel_Hebrew = 'DAN',
BookNames.set(Books.Daniel_Hebrew, [
  {name: 'Daniel', abbreviations: ['Dan', 'Dn'], orthodox_only: false},
]);

// Hosea = 'HOS',
BookNames.set(Books.Hosea, [
  {name: 'Hosea', abbreviations: ['Hos'], orthodox_only: false},
]);

// Joel = 'JOL',
BookNames.set(Books.Joel, [
  {name: 'Joel', abbreviations: ['Jl'], orthodox_only: false},
]);

// Amos = 'AMO',
BookNames.set(Books.Amos, [
  {name: 'Amos', abbreviations: ['Am'], orthodox_only: false},
]);

// Obadiah = 'OBA',
BookNames.set(Books.Obadiah, [
  {name: 'Obadiah', abbreviations: ['Obad', 'Ob'], orthodox_only: false},
]);

// Jonah = 'JON',
BookNames.set(Books.Jonah, [
  {name: 'Jonah', abbreviations: ['Jon'], orthodox_only: false},
]);

// Micah = 'MIC',
BookNames.set(Books.Micah, [
  {name: 'Micah', abbreviations: ['Mic', 'Mi'], orthodox_only: false},
]);

// Nahum = 'NAM',
BookNames.set(Books.Nahum, [
  {name: 'Nahum', abbreviations: ['Nah', 'Na'], orthodox_only: false},
]);

// Habakkuk = 'HAB',
BookNames.set(Books.Habakkuk, [
  {name: 'Habakkuk', abbreviations: ['Hab', 'Hb'], orthodox_only: false},
]);

// Zephaniah = 'ZEP',
BookNames.set(Books.Zephaniah, [
  {
    name: 'Zephaniah',
    abbreviations: ['Zeph', 'Zep'],
    orthodox_only: false,
  },
]);

// Haggai = 'HAG',
BookNames.set(Books.Haggai, [
  {name: 'Haggai', abbreviations: ['Hag', 'Hg'], orthodox_only: false},
]);

// Zechariah = 'ZEC',
BookNames.set(Books.Zechariah, [
  {
    name: 'Zechariah',
    abbreviations: ['Zech', 'Zec'],
    orthodox_only: false,
  },
]);

// Malachi = 'MAL',
BookNames.set(Books.Malachi, [
  {name: 'Malachi', abbreviations: ['Mal'], orthodox_only: false},
]);

// Matthew = 'MAT',
BookNames.set(Books.Matthew, [
  {name: 'Matthew', abbreviations: ['Matt', 'Mt'], orthodox_only: false},
]);

// Mark = 'MRK',
BookNames.set(Books.Mark, [
  {
    name: 'Mark',
    abbreviations: ['Mk'],
    orthodox_only: false,
  },
]);

// Luke = 'LUK',
BookNames.set(Books.Luke, [
  {name: 'Luke', abbreviations: ['Lk'], orthodox_only: false},
]);

// John = 'JHN',
BookNames.set(Books.John, [
  {name: 'John', abbreviations: ['Jn'], orthodox_only: false},
]);

// Acts = 'ACT',
BookNames.set(Books.Acts, [
  {name: 'Acts of the Apostles', abbreviations: ['Acts'], orthodox_only: false},
]);

// Romans = 'ROM',
BookNames.set(Books.Romans, [
  {name: 'Romans', abbreviations: ['Rom'], orthodox_only: false},
]);

// Corinthians_1 = '1CO',
BookNames.set(Books.Corinthians_1, [
  {name: '1 Corinthians', abbreviations: ['1 Cor'], orthodox_only: false},
]);

// Corinthians_2 = '2CO',
BookNames.set(Books.Corinthians_2, [
  {name: '2 Corinthians', abbreviations: ['2 Cor'], orthodox_only: false},
]);

// Galatians = 'GAL',
BookNames.set(Books.Galatians, [
  {name: 'Galatians', abbreviations: ['Gal'], orthodox_only: false},
]);

// Ephesians = 'EPH',
BookNames.set(Books.Ephesians, [
  {name: 'Ephesians', abbreviations: ['Eph'], orthodox_only: false},
]);

// Philippians = 'PHP',
BookNames.set(Books.Philippians, [
  {
    name: 'Philippians',
    abbreviations: ['Phil'],
    orthodox_only: false,
  },
]);

// Colossians = 'COL',
BookNames.set(Books.Colossians, [
  {name: 'Colossians', abbreviations: ['Col'], orthodox_only: false},
]);

// Thessalonians_1 = '1TH',
BookNames.set(Books.Thessalonians_1, [
  {
    name: '1 Thessalonians',
    abbreviations: ['1 Thess', '1 Thes'],
    orthodox_only: false,
  },
]);

// Thessalonians_2 = '2TH',
BookNames.set(Books.Thessalonians_2, [
  {
    name: '2 Thessalonians',
    abbreviations: ['2 Thess', '2 Thes'],
    orthodox_only: false,
  },
]);

// Timothy_1 = '1TI',
BookNames.set(Books.Timothy_1, [
  {name: '1 Timothy', abbreviations: ['1 Tim', '1 Tm'], orthodox_only: false},
]);

// Timothy_2 = '2TI',
BookNames.set(Books.Timothy_2, [
  {name: '2 Timothy', abbreviations: ['2 Tim', '2 Tm'], orthodox_only: false},
]);

// Titus = 'TIT',
BookNames.set(Books.Titus, [
  {name: 'Titus', abbreviations: ['Ti'], orthodox_only: false},
]);

// Philemon = 'PHM',
BookNames.set(Books.Philemon, [
  {name: 'Philemon', abbreviations: ['Philem', 'Phlm'], orthodox_only: false},
]);

// Hebrews = 'HEB',
BookNames.set(Books.Hebrews, [
  {name: 'Hebrews', abbreviations: ['Heb'], orthodox_only: false},
]);

// James = 'JAS',
BookNames.set(Books.James, [
  {name: 'James', abbreviations: ['Jas'], orthodox_only: false},
]);

// Peter_1 = '1PE',
BookNames.set(Books.Peter_1, [
  {name: '1 Peter', abbreviations: ['1 Pet', '1 Pt'], orthodox_only: false},
]);

// Peter_2 = '2PE',
BookNames.set(Books.Peter_2, [
  {name: '2 Peter', abbreviations: ['2 Pet', '2 Pt'], orthodox_only: false},
]);

// John_1 = '1JN',
BookNames.set(Books.John_1, [
  {name: '1 John', abbreviations: ['1 Jn'], orthodox_only: false},
]);

// John_2 = '2JN',
BookNames.set(Books.John_2, [
  {name: '2 John', abbreviations: ['2 Jn'], orthodox_only: false},
]);

// John_3 = '3JN',
BookNames.set(Books.John_3, [
  {name: '3 John', abbreviations: ['3 Jn'], orthodox_only: false},
]);

// Jude = 'JUD',
BookNames.set(Books.Jude, [{name: 'Jude', orthodox_only: false}]);

// Revelation = 'REV',
BookNames.set(Books.Revelation, [
  {name: 'Revelation', abbreviations: ['Rev', 'Rv'], orthodox_only: false},
  {name: 'Apocalypse', abbreviations: ['Apoc'], orthodox_only: false},
]);

// Tobit = 'TOB',
BookNames.set(Books.Tobit, [
  {name: 'Tobit', abbreviations: ['Tob', 'Tb'], orthodox_only: false},
]);

// Judith = 'JDT',
BookNames.set(Books.Judith, [
  {name: 'Judith', abbreviations: ['Jth', 'Jdt'], orthodox_only: false},
]);

// Esther_Greek = 'ESG',
BookNames.set(Books.Esther_Greek, [
  {
    name: 'Additions to Esther',
    orthodox_only: false,
  },
  {
    name: 'Rest of Esther',
    orthodox_only: false,
  },
]);

// Wisdom_of_Solomon = 'WIS',
BookNames.set(Books.Wisdom_of_Solomon, [
  {
    name: 'Wisdom of Solomon',
    abbreviations: ['Wisd. of Sol', 'Ws'],
    orthodox_only: false,
  },
]);

// Sirach = 'SIR',
BookNames.set(Books.Sirach, [
  {name: 'Sirach', abbreviations: ['Sir'], orthodox_only: false},
  {name: 'Ecclesiasticus', abbreviations: ['Ecclus'], orthodox_only: false},
]);

// Baruch = 'BAR',
BookNames.set(Books.Baruch, [
  {name: 'Baruch', abbreviations: ['Bar'], orthodox_only: false},
]);

// Letter_of_Jeremiah = 'LJE',
BookNames.set(Books.Letter_of_Jeremiah, [
  {name: 'Letter of Jeremiah', orthodox_only: false},
]);

// Song_of_the_3_Young_Men = 'S3Y',
BookNames.set(Books.Song_of_the_3_Young_Men, [
  {name: 'Song of the 3 Young Men', orthodox_only: false},
  {
    name: 'Song of the Three Holy Children',
    abbreviations: ['Song of Three Children'],
    orthodox_only: false,
  },
  {name: 'Prayer of Azariah', orthodox_only: false},
]);

// Susanna = 'SUS',
BookNames.set(Books.Susanna, [
  {name: 'Susanna', abbreviations: ['Sus'], orthodox_only: false},
]);

// Bel_and_the_Dragon = 'BEL',
BookNames.set(Books.Bel_and_the_Dragon, [
  {
    name: 'Bel and the Dragon',
    abbreviations: ['Bel and Dragon'],
    orthodox_only: false,
  },
]);

// Maccabees_1 = '1MA',
BookNames.set(Books.Maccabees_1, [
  {
    name: '1 Maccabees',
    abbreviations: ['1 Macc', '1 Mc'],
    orthodox_only: false,
  },
]);

// Maccabees_2 = '2MA',
BookNames.set(Books.Maccabees_2, [
  {
    name: '2 Maccabees',
    abbreviations: ['2 Macc', '2 Mc'],
    orthodox_only: false,
  },
]);

// Maccabees_3 = '3MA',
BookNames.set(Books.Maccabees_3, [
  {
    name: '3 Maccabees',
    abbreviations: ['3 Macc', '3 Mc'],
    orthodox_only: false,
  },
]);

// Maccabees_4 = '4MA',
BookNames.set(Books.Maccabees_4, [
  {
    name: '4 Maccabees',
    abbreviations: ['4 Macc', '4 Mc'],
    orthodox_only: false,
  },
]);

// Esdras_1_Greek = '1ES',
BookNames.set(Books.Esdras_1_Greek, [
  {name: '1 Esdras', abbreviations: ['1 Esd'], orthodox_only: false},
]);

// Esdras_2_Latin = '2ES',
BookNames.set(Books.Esdras_2_Latin, [
  {name: '2 Esdras', abbreviations: ['2 Esd'], orthodox_only: false},
]);

// Prayer_of_Manasseh = 'MAN',
BookNames.set(Books.Prayer_of_Manasseh, [
  {
    name: 'Prayer of Manasseh',
    abbreviations: ['Pr. of Man'],
    orthodox_only: false,
  },
  {
    name: 'Prayer of Manasses',
    orthodox_only: false,
  },
]);

// identify if a bible uses 1,2,3,4 Kings instead of 1,2 Samuel and 1,2 Kings
const hasOrthodoxNames = (bookNames: string[]) => {
  // Define the target strings to search for
  const targets = ['3 Kings', '4 Kings', '3 Kingdoms', '4 Kingdoms'];

  // Check if any of the target strings are in the list
  return targets.some(target => bookNames.includes(target));
};

// define function to parse reference groups

// define function to parse references
