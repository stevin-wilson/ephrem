import {Books} from '../../books.js';

export type Usage = 'orthodox' | 'common';

export interface BookName {
  readonly name: string;
  readonly abbreviations?: string[];
  /**
   * `orthodoxOnly` is used to indicate name and abbreviation that are exclusive to Orthodox Bibles.
   * For example, 1 Samuel is called 1 Kings or Kingdoms in Orthodox Bibles
   */
  readonly usage: Usage[];
}

export const BookNames = new Map<Books, BookName[]>();
// Add entries to the map for each book
// Genesis = 'GEN',
BookNames.set(Books.Genesis, [
  {
    name: 'Genesis',
    abbreviations: ['Gen', 'Gn'],
    usage: ['common', 'orthodox'],
  },
]);

// Exodus = 'EXO',
BookNames.set(Books.Exodus, [
  {
    name: 'Exodus',
    abbreviations: ['Ex', 'Exod'],
    usage: ['common', 'orthodox'],
  },
]);

// Leviticus = 'LEV',
BookNames.set(Books.Leviticus, [
  {
    name: 'Leviticus',
    abbreviations: ['Lev', 'Lv'],
    usage: ['common', 'orthodox'],
  },
]);

// Numbers = 'NUM',
BookNames.set(Books.Numbers, [
  {
    name: 'Numbers',
    abbreviations: ['Num', 'Nm'],
    usage: ['common', 'orthodox'],
  },
]);

// Deuteronomy = 'DEU',
BookNames.set(Books.Deuteronomy, [
  {
    name: 'Deuteronomy',
    abbreviations: ['Deut', 'Dt'],
    usage: ['common', 'orthodox'],
  },
]);

// Joshua = 'JOS',
BookNames.set(Books.Joshua, [
  {
    name: 'Joshua',
    abbreviations: ['Josh', 'Jo'],
    usage: ['common', 'orthodox'],
  },
]);

// Judges = 'JDG',
BookNames.set(Books.Judges, [
  {
    name: 'Judges',
    abbreviations: ['Judg', 'Jgs'],
    usage: ['common', 'orthodox'],
  },
]);

// Ruth = 'RUT',
BookNames.set(Books.Ruth, [
  {name: 'Ruth', abbreviations: ['Ru'], usage: ['common', 'orthodox']},
]);

// Samuel_1 = '1SA',
BookNames.set(Books.Samuel_1, [
  {
    name: '1 Samuel',
    abbreviations: ['1 Sam', '1 Sm'],
    usage: ['common', 'orthodox'],
  },
  {
    name: '1 Kings',
    abbreviations: ['1 Kgs'],
    usage: ['orthodox'],
  },
  {name: '1 Kingdoms', usage: ['orthodox']},
]);

// Samuel_2 = '2SA',
BookNames.set(Books.Samuel_2, [
  {
    name: '2 Samuel',
    abbreviations: ['2 Sam', '2 Sm'],
    usage: ['common', 'orthodox'],
  },
  {
    name: '2 Kings',
    abbreviations: ['2 Kgs'],
    usage: ['orthodox'],
  },
  {name: '2 Kingdoms', usage: ['orthodox']},
]);

// Kings_1 = '1KI',
BookNames.set(Books.Kings_1, [
  {
    name: '1 Kings',
    abbreviations: ['1 Kgs'],
    usage: ['common'],
  },
  {
    name: '3 Kings',
    abbreviations: ['3 Kgs'],
    usage: ['orthodox'],
  },
  {name: '3 Kingdoms', usage: ['orthodox']},
]);

// Kings_2 = '2KI',
BookNames.set(Books.Kings_2, [
  {
    name: '2 Kings',
    abbreviations: ['2 Kgs'],
    usage: ['common'],
  },
  {
    name: '4 Kings',
    abbreviations: ['4 Kgs'],
    usage: ['orthodox'],
  },
  {name: '4 Kingdoms', usage: ['orthodox']},
]);

// Chronicles_1 = '1CH',
BookNames.set(Books.Chronicles_1, [
  {
    name: '1 Chronicles',
    abbreviations: ['1 Chron', '1 Chr'],
    usage: ['common', 'orthodox'],
  },
]);

// Chronicles_2 = '2CH',
BookNames.set(Books.Chronicles_2, [
  {
    name: '2 Chronicles',
    abbreviations: ['2 Chron', '2 Chr'],
    usage: ['common', 'orthodox'],
  },
]);

// Ezra = 'EZR',
BookNames.set(Books.Ezra, [
  {name: 'Ezra', abbreviations: ['Ezr'], usage: ['common', 'orthodox']},
]);

// Nehemiah = 'NEH',
BookNames.set(Books.Nehemiah, [
  {name: 'Nehemiah', abbreviations: ['Neh'], usage: ['common', 'orthodox']},
]);

// Esther_Hebrew = 'EST',
BookNames.set(Books.Esther_Hebrew, [
  {name: 'Esther', abbreviations: ['Est'], usage: ['common', 'orthodox']},
]);

// Job = 'JOB',
BookNames.set(Books.Job, [
  {name: 'Job', abbreviations: ['Jb'], usage: ['common', 'orthodox']},
]);

// Psalms = 'PSA',
BookNames.set(Books.Psalms, [
  {name: 'Psalms', abbreviations: ['Ps', 'Pss'], usage: ['common', 'orthodox']},
]);

// Proverbs = 'PRO',
BookNames.set(Books.Proverbs, [
  {
    name: 'Proverbs',
    abbreviations: ['Prov', 'Prv'],
    usage: ['common', 'orthodox'],
  },
]);

// Ecclesiastes = 'ECC',
BookNames.set(Books.Ecclesiastes, [
  {
    name: 'Ecclesiastes',
    abbreviations: ['Eccles', 'Eccl'],
    usage: ['common', 'orthodox'],
  },
  {name: 'Qoholeth', abbreviations: ['Qoh'], usage: ['common', 'orthodox']},
]);

// Song_of_Songs = 'SNG',
BookNames.set(Books.Song_of_Songs, [
  {
    name: 'Song of Solomon',
    abbreviations: ['Song of Sol', 'Sg'],
    usage: ['common', 'orthodox'],
  },
  {name: 'Song of Songs', usage: ['common', 'orthodox']},
  {
    name: 'Canticle of Canticles',
    abbreviations: ['Canticles', 'Cant'],
    usage: ['common', 'orthodox'],
  },
]);

// Isaiah = 'ISA',
BookNames.set(Books.Isaiah, [
  {name: 'Isaiah', abbreviations: ['Isa', 'Is'], usage: ['common', 'orthodox']},
]);

// Jeremiah = 'JER',
BookNames.set(Books.Jeremiah, [
  {name: 'Jeremiah', abbreviations: ['Jer'], usage: ['common', 'orthodox']},
]);

// Lamentations = 'LAM',
BookNames.set(Books.Lamentations, [
  {name: 'Lamentations', abbreviations: ['Lam'], usage: ['common', 'orthodox']},
]);

// Ezekiel = 'EZK',
BookNames.set(Books.Ezekiel, [
  {
    name: 'Ezekiel',
    abbreviations: ['Ezek', 'Ez'],
    usage: ['common', 'orthodox'],
  },
]);

// Daniel_Hebrew = 'DAN',
BookNames.set(Books.Daniel_Hebrew, [
  {name: 'Daniel', abbreviations: ['Dan', 'Dn'], usage: ['common', 'orthodox']},
]);

// Hosea = 'HOS',
BookNames.set(Books.Hosea, [
  {name: 'Hosea', abbreviations: ['Hos'], usage: ['common', 'orthodox']},
]);

// Joel = 'JOL',
BookNames.set(Books.Joel, [
  {name: 'Joel', abbreviations: ['Jl'], usage: ['common', 'orthodox']},
]);

// Amos = 'AMO',
BookNames.set(Books.Amos, [
  {name: 'Amos', abbreviations: ['Am'], usage: ['common', 'orthodox']},
]);

// Obadiah = 'OBA',
BookNames.set(Books.Obadiah, [
  {
    name: 'Obadiah',
    abbreviations: ['Obad', 'Ob'],
    usage: ['common', 'orthodox'],
  },
]);

// Jonah = 'JON',
BookNames.set(Books.Jonah, [
  {name: 'Jonah', abbreviations: ['Jon'], usage: ['common', 'orthodox']},
]);

// Micah = 'MIC',
BookNames.set(Books.Micah, [
  {name: 'Micah', abbreviations: ['Mic', 'Mi'], usage: ['common', 'orthodox']},
]);

// Nahum = 'NAM',
BookNames.set(Books.Nahum, [
  {name: 'Nahum', abbreviations: ['Nah', 'Na'], usage: ['common', 'orthodox']},
]);

// Habakkuk = 'HAB',
BookNames.set(Books.Habakkuk, [
  {
    name: 'Habakkuk',
    abbreviations: ['Hab', 'Hb'],
    usage: ['common', 'orthodox'],
  },
]);

// Zephaniah = 'ZEP',
BookNames.set(Books.Zephaniah, [
  {
    name: 'Zephaniah',
    abbreviations: ['Zeph', 'Zep'],
    usage: ['common', 'orthodox'],
  },
]);

// Haggai = 'HAG',
BookNames.set(Books.Haggai, [
  {name: 'Haggai', abbreviations: ['Hag', 'Hg'], usage: ['common', 'orthodox']},
]);

// Zechariah = 'ZEC',
BookNames.set(Books.Zechariah, [
  {
    name: 'Zechariah',
    abbreviations: ['Zech', 'Zec'],
    usage: ['common', 'orthodox'],
  },
]);

// Malachi = 'MAL',
BookNames.set(Books.Malachi, [
  {name: 'Malachi', abbreviations: ['Mal'], usage: ['common', 'orthodox']},
]);

// Matthew = 'MAT',
BookNames.set(Books.Matthew, [
  {
    name: 'Matthew',
    abbreviations: ['Matt', 'Mt'],
    usage: ['common', 'orthodox'],
  },
]);

// Mark = 'MRK',
BookNames.set(Books.Mark, [
  {
    name: 'Mark',
    abbreviations: ['Mk'],
    usage: ['common', 'orthodox'],
  },
]);

// Luke = 'LUK',
BookNames.set(Books.Luke, [
  {name: 'Luke', abbreviations: ['Lk'], usage: ['common', 'orthodox']},
]);

// John = 'JHN',
BookNames.set(Books.John, [
  {name: 'John', abbreviations: ['Jn'], usage: ['common', 'orthodox']},
]);

// Acts = 'ACT',
BookNames.set(Books.Acts, [
  {
    name: 'Acts of the Apostles',
    abbreviations: ['Acts'],
    usage: ['common', 'orthodox'],
  },
]);

// Romans = 'ROM',
BookNames.set(Books.Romans, [
  {name: 'Romans', abbreviations: ['Rom'], usage: ['common', 'orthodox']},
]);

// Corinthians_1 = '1CO',
BookNames.set(Books.Corinthians_1, [
  {
    name: '1 Corinthians',
    abbreviations: ['1 Cor'],
    usage: ['common', 'orthodox'],
  },
]);

// Corinthians_2 = '2CO',
BookNames.set(Books.Corinthians_2, [
  {
    name: '2 Corinthians',
    abbreviations: ['2 Cor'],
    usage: ['common', 'orthodox'],
  },
]);

// Galatians = 'GAL',
BookNames.set(Books.Galatians, [
  {name: 'Galatians', abbreviations: ['Gal'], usage: ['common', 'orthodox']},
]);

// Ephesians = 'EPH',
BookNames.set(Books.Ephesians, [
  {name: 'Ephesians', abbreviations: ['Eph'], usage: ['common', 'orthodox']},
]);

// Philippians = 'PHP',
BookNames.set(Books.Philippians, [
  {
    name: 'Philippians',
    abbreviations: ['Phil'],
    usage: ['common', 'orthodox'],
  },
]);

// Colossians = 'COL',
BookNames.set(Books.Colossians, [
  {name: 'Colossians', abbreviations: ['Col'], usage: ['common', 'orthodox']},
]);

// Thessalonians_1 = '1TH',
BookNames.set(Books.Thessalonians_1, [
  {
    name: '1 Thessalonians',
    abbreviations: ['1 Thess', '1 Thes'],
    usage: ['common', 'orthodox'],
  },
]);

// Thessalonians_2 = '2TH',
BookNames.set(Books.Thessalonians_2, [
  {
    name: '2 Thessalonians',
    abbreviations: ['2 Thess', '2 Thes'],
    usage: ['common', 'orthodox'],
  },
]);

// Timothy_1 = '1TI',
BookNames.set(Books.Timothy_1, [
  {
    name: '1 Timothy',
    abbreviations: ['1 Tim', '1 Tm'],
    usage: ['common', 'orthodox'],
  },
]);

// Timothy_2 = '2TI',
BookNames.set(Books.Timothy_2, [
  {
    name: '2 Timothy',
    abbreviations: ['2 Tim', '2 Tm'],
    usage: ['common', 'orthodox'],
  },
]);

// Titus = 'TIT',
BookNames.set(Books.Titus, [
  {name: 'Titus', abbreviations: ['Ti'], usage: ['common', 'orthodox']},
]);

// Philemon = 'PHM',
BookNames.set(Books.Philemon, [
  {
    name: 'Philemon',
    abbreviations: ['Philem', 'Phlm'],
    usage: ['common', 'orthodox'],
  },
]);

// Hebrews = 'HEB',
BookNames.set(Books.Hebrews, [
  {name: 'Hebrews', abbreviations: ['Heb'], usage: ['common', 'orthodox']},
]);

// James = 'JAS',
BookNames.set(Books.James, [
  {name: 'James', abbreviations: ['Jas'], usage: ['common', 'orthodox']},
]);

// Peter_1 = '1PE',
BookNames.set(Books.Peter_1, [
  {
    name: '1 Peter',
    abbreviations: ['1 Pet', '1 Pt'],
    usage: ['common', 'orthodox'],
  },
]);

// Peter_2 = '2PE',
BookNames.set(Books.Peter_2, [
  {
    name: '2 Peter',
    abbreviations: ['2 Pet', '2 Pt'],
    usage: ['common', 'orthodox'],
  },
]);

// John_1 = '1JN',
BookNames.set(Books.John_1, [
  {name: '1 John', abbreviations: ['1 Jn'], usage: ['common', 'orthodox']},
]);

// John_2 = '2JN',
BookNames.set(Books.John_2, [
  {name: '2 John', abbreviations: ['2 Jn'], usage: ['common', 'orthodox']},
]);

// John_3 = '3JN',
BookNames.set(Books.John_3, [
  {name: '3 John', abbreviations: ['3 Jn'], usage: ['common', 'orthodox']},
]);

// Jude = 'JUD',
BookNames.set(Books.Jude, [{name: 'Jude', usage: ['common', 'orthodox']}]);

// Revelation = 'REV',
BookNames.set(Books.Revelation, [
  {
    name: 'Revelation',
    abbreviations: ['Rev', 'Rv'],
    usage: ['common', 'orthodox'],
  },
  {name: 'Apocalypse', abbreviations: ['Apoc'], usage: ['common', 'orthodox']},
]);

// Tobit = 'TOB',
BookNames.set(Books.Tobit, [
  {name: 'Tobit', abbreviations: ['Tob', 'Tb'], usage: ['common', 'orthodox']},
]);

// Judith = 'JDT',
BookNames.set(Books.Judith, [
  {
    name: 'Judith',
    abbreviations: ['Jth', 'Jdt'],
    usage: ['common', 'orthodox'],
  },
]);

// Esther_Greek = 'ESG',
BookNames.set(Books.Esther_Greek, [
  {
    name: 'Additions to Esther',
    usage: ['common', 'orthodox'],
  },
  {
    name: 'Rest of Esther',
    usage: ['common', 'orthodox'],
  },
]);

// Wisdom_of_Solomon = 'WIS',
BookNames.set(Books.Wisdom_of_Solomon, [
  {
    name: 'Wisdom of Solomon',
    abbreviations: ['Wisd. of Sol', 'Ws'],
    usage: ['common', 'orthodox'],
  },
]);

// Sirach = 'SIR',
BookNames.set(Books.Sirach, [
  {name: 'Sirach', abbreviations: ['Sir'], usage: ['common', 'orthodox']},
  {
    name: 'Ecclesiasticus',
    abbreviations: ['Ecclus'],
    usage: ['common', 'orthodox'],
  },
]);

// Baruch = 'BAR',
BookNames.set(Books.Baruch, [
  {name: 'Baruch', abbreviations: ['Bar'], usage: ['common', 'orthodox']},
]);

// Letter_of_Jeremiah = 'LJE',
BookNames.set(Books.Letter_of_Jeremiah, [
  {name: 'Letter of Jeremiah', usage: ['common', 'orthodox']},
]);

// Song_of_the_3_Young_Men = 'S3Y',
BookNames.set(Books.Song_of_the_3_Young_Men, [
  {name: 'Song of the 3 Young Men', usage: ['common', 'orthodox']},
  {
    name: 'Song of the Three Holy Children',
    abbreviations: ['Song of Three Children'],
    usage: ['common', 'orthodox'],
  },
  {name: 'Prayer of Azariah', usage: ['common', 'orthodox']},
]);

// Susanna = 'SUS',
BookNames.set(Books.Susanna, [
  {name: 'Susanna', abbreviations: ['Sus'], usage: ['common', 'orthodox']},
]);

// Bel_and_the_Dragon = 'BEL',
BookNames.set(Books.Bel_and_the_Dragon, [
  {
    name: 'Bel and the Dragon',
    abbreviations: ['Bel and Dragon'],
    usage: ['common', 'orthodox'],
  },
]);

// Maccabees_1 = '1MA',
BookNames.set(Books.Maccabees_1, [
  {
    name: '1 Maccabees',
    abbreviations: ['1 Macc', '1 Mc'],
    usage: ['common', 'orthodox'],
  },
]);

// Maccabees_2 = '2MA',
BookNames.set(Books.Maccabees_2, [
  {
    name: '2 Maccabees',
    abbreviations: ['2 Macc', '2 Mc'],
    usage: ['common', 'orthodox'],
  },
]);

// Maccabees_3 = '3MA',
BookNames.set(Books.Maccabees_3, [
  {
    name: '3 Maccabees',
    abbreviations: ['3 Macc', '3 Mc'],
    usage: ['common', 'orthodox'],
  },
]);

// Maccabees_4 = '4MA',
BookNames.set(Books.Maccabees_4, [
  {
    name: '4 Maccabees',
    abbreviations: ['4 Macc', '4 Mc'],
    usage: ['common', 'orthodox'],
  },
]);

// Esdras_1_Greek = '1ES',
BookNames.set(Books.Esdras_1_Greek, [
  {name: '1 Esdras', abbreviations: ['1 Esd'], usage: ['common', 'orthodox']},
]);

// Esdras_2_Latin = '2ES',
BookNames.set(Books.Esdras_2_Latin, [
  {name: '2 Esdras', abbreviations: ['2 Esd'], usage: ['common', 'orthodox']},
]);

// Prayer_of_Manasseh = 'MAN',
BookNames.set(Books.Prayer_of_Manasseh, [
  {
    name: 'Prayer of Manasseh',
    abbreviations: ['Pr. of Man'],
    usage: ['common', 'orthodox'],
  },
  {
    name: 'Prayer of Manasses',
    usage: ['common', 'orthodox'],
  },
]);

// identify if a bible uses 1,2,3,4 Kings instead of 1,2 Samuel and 1,2 Kings
const getBibleType = (bookNames: string[]): Usage => {
  // Define the target strings to search for
  const targets = ['3 Kings', '4 Kings', '3 Kingdoms', '4 Kingdoms'];

  // Check if any of the target strings are in the list
  if (targets.some(target => bookNames.includes(target))) {
    return 'orthodox';
  } else {
    return 'common';
  }
};

// define function to parse reference groups

// define function to parse references
