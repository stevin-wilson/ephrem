import {Books} from '../../books.js';

export interface BookName {
  readonly name: string;
  readonly abbreviations?: string[];
}

export const BookNames = new Map<Books, BookName[]>();
// Add entries to the map for each book
// Genesis = 'GEN',
BookNames.set(Books.Genesis, [{name: 'ഉല്പത്തി', abbreviations: ['ഉല്പ']}]);

// Exodus = 'EXO',
BookNames.set(Books.Exodus, [{name: 'പുറപ്പാടു', abbreviations: ['പുറ']}]);

// Leviticus = 'LEV',
BookNames.set(Books.Leviticus, [
  {name: 'ലേവ്യപുസ്തകം', abbreviations: ['ലേവ്യ']},
]);

// Numbers = 'NUM',
BookNames.set(Books.Numbers, [
  {
    name: 'സംഖ്യാപുസ്തകം',
    abbreviations: ['സംഖ്യാ'],
  },
]);

// Deuteronomy = 'DEU',
BookNames.set(Books.Deuteronomy, [
  {
    name: 'ആവർത്തനപുസ്തകം',
    abbreviations: ['ആവർത്തനം'],
  },
]);

// Joshua = 'JOS',
BookNames.set(Books.Joshua, [{name: 'യോശുവ'}]);

// Judges = 'JDG',
BookNames.set(Books.Judges, [
  {name: 'ന്യായാധിപന്മാർ', abbreviations: ['ന്യായാ']},
]);

// Ruth = 'RUT',
BookNames.set(Books.Ruth, [{name: 'രൂത്ത്'}]);

// Samuel_1 = '1SA',
BookNames.set(Books.Samuel_1, [{name: '1 ശമൂവേൽ', abbreviations: ['1 ശമു']}]);

// Samuel_2 = '2SA',
BookNames.set(Books.Samuel_2, [{name: '2 ശമൂവേൽ', abbreviations: ['2 ശമു']}]);

// Kings_1 = '1KI',
BookNames.set(Books.Kings_1, [
  {
    name: '1 രാജാക്കന്മാർ',
    abbreviations: ['1 രാജാ'],
  },
]);

// Kings_2 = '2KI',
BookNames.set(Books.Kings_2, [
  {
    name: '2 രാജാക്കന്മാർ',
    abbreviations: ['2 രാജാ'],
  },
]);

// Chronicles_1 = '1CH',
BookNames.set(Books.Chronicles_1, [
  {
    name: '1 ദിനവൃത്താന്തം',
    abbreviations: ['1 ദിന'],
  },
]);

// Chronicles_2 = '2CH',
BookNames.set(Books.Chronicles_2, [
  {
    name: '2 ദിനവൃത്താന്തം',
    abbreviations: ['2 ദിന'],
  },
]);

// Ezra = 'EZR',
BookNames.set(Books.Ezra, [{name: 'എസ്രാ'}]);

// Nehemiah = 'NEH',
BookNames.set(Books.Nehemiah, [{name: 'നെഹെമ്യാവു', abbreviations: ['നെഹെ']}]);

// Esther_Hebrew = 'EST',
BookNames.set(Books.Esther_Hebrew, [
  {name: 'എസ്ഥേർ', abbreviations: ['എസ്ഥേ']},
]);

// Job = 'JOB',
BookNames.set(Books.Job, [{name: 'ഇയ്യോബ്', abbreviations: ['ഇയ്യോ']}]);

// Psalms = 'PSA',
BookNames.set(Books.Psalms, [
  {name: 'സങ്കീർത്തനങ്ങൾ', abbreviations: ['സങ്കീ']},
]);

// Proverbs = 'PRO',
BookNames.set(Books.Proverbs, [
  {name: 'സദൃശവാക്യങ്ങൾ', abbreviations: ['സദൃ']},
]);

// Ecclesiastes = 'ECC',
BookNames.set(Books.Ecclesiastes, [
  {
    name: 'സഭാപ്രസംഗി',
    abbreviations: ['സഭാ'],
  },
]);

// Song_of_Songs = 'SNG',
BookNames.set(Books.Song_of_Songs, [
  {
    name: 'ഉത്തമഗീതം',
    abbreviations: ['ഉത്ത'],
  },
]);

// Isaiah = 'ISA',
BookNames.set(Books.Isaiah, [{name: 'യെശയ്യാവു', abbreviations: ['യെശ']}]);

// Jeremiah = 'JER',
BookNames.set(Books.Jeremiah, [{name: 'യിരെമ്യാവു', abbreviations: ['യിരെ']}]);

// Lamentations = 'LAM',
BookNames.set(Books.Lamentations, [
  {name: 'വിലാപങ്ങൾ', abbreviations: ['വിലാ']},
]);

// Ezekiel = 'EZK',
BookNames.set(Books.Ezekiel, [{name: 'യെഹെസ്കേൽ', abbreviations: ['യെഹെ']}]);

// Daniel_Hebrew = 'DAN',
BookNames.set(Books.Daniel_Hebrew, [
  {name: 'ദാനീയേൽ', abbreviations: ['ദാനീ']},
]);

// Hosea = 'HOS',
BookNames.set(Books.Hosea, [{name: 'ഹോശേയ', abbreviations: ['ഹോശേ']}]);

// Joel = 'JOL',
BookNames.set(Books.Joel, [{name: 'യോവേൽ', abbreviations: ['യോവേ']}]);

// Amos = 'AMO',
BookNames.set(Books.Amos, [{name: 'ആമോസ്', abbreviations: ['ആമോ']}]);

// Obadiah = 'OBA',
BookNames.set(Books.Obadiah, [{name: 'ഓബദ്യാവു', abbreviations: ['ഓബ']}]);

// Jonah = 'JON',
BookNames.set(Books.Jonah, [{name: 'യോനാ'}]);

// Micah = 'MIC',
BookNames.set(Books.Micah, [{name: 'മീഖാ'}]);

// Nahum = 'NAM',
BookNames.set(Books.Nahum, [{name: 'നഹൂം'}]);

// Habakkuk = 'HAB',
BookNames.set(Books.Habakkuk, [{name: 'ഹബക്കൂൿ', abbreviations: ['ഹബ']}]);

// Zephaniah = 'ZEP',
BookNames.set(Books.Zephaniah, [
  {
    name: 'സെഫന്യാവു',
    abbreviations: ['സെഫ'],
  },
]);

// Haggai = 'HAG',
BookNames.set(Books.Haggai, [{name: 'ഹഗ്ഗായി', abbreviations: ['ഹഗ്ഗാ']}]);

// Zechariah = 'ZEC',
BookNames.set(Books.Zechariah, [
  {
    name: 'സെഖര്യാവു',
    abbreviations: ['സെഖ'],
  },
]);

// Malachi = 'MAL',
BookNames.set(Books.Malachi, [{name: 'മലാഖി', abbreviations: ['മലാ']}]);

// Matthew = 'MAT',
BookNames.set(Books.Matthew, [{name: 'മത്തായി', abbreviations: ['മത്താ']}]);

// Mark = 'MRK',
BookNames.set(Books.Mark, [
  {
    name: 'മർക്കൊസ്',
    abbreviations: ['മർക്കൊ'],
  },
]);

// Luke = 'LUK',
BookNames.set(Books.Luke, [{name: 'ലൂക്കൊസ്', abbreviations: ['ലൂക്കൊ']}]);

// John = 'JHN',
BookNames.set(Books.John, [{name: 'യോഹന്നാൻ'}]);

// Acts = 'ACT',
BookNames.set(Books.Acts, [
  {
    name: 'അപ്പൊസ്തലന്മാരുടെ പ്രവൃത്തികൾ',
    abbreviations: ['അപ്പൊ. പ്രവൃത്തികൾ', 'പ്രവൃത്തികൾ'],
  },
]);

// Romans = 'ROM',
BookNames.set(Books.Romans, [{name: 'റോമർ'}]);

// Corinthians_1 = '1CO',
BookNames.set(Books.Corinthians_1, [
  {name: '1 കൊരിന്ത്യർ', abbreviations: ['1 കൊരി']},
]);

// Corinthians_2 = '2CO',
BookNames.set(Books.Corinthians_2, [
  {name: '2 കൊരിന്ത്യർ', abbreviations: ['2 കൊരി']},
]);

// Galatians = 'GAL',
BookNames.set(Books.Galatians, [{name: 'ഗലാത്യർ', abbreviations: ['ഗലാ']}]);

// Ephesians = 'EPH',
BookNames.set(Books.Ephesians, [{name: 'എഫെസ്യർ', abbreviations: ['എഫെ']}]);

// Philippians = 'PHP',
BookNames.set(Books.Philippians, [
  {
    name: 'ഫിലിപ്പിയർ',
    abbreviations: ['ഫിലി'],
  },
]);

// Colossians = 'COL',
BookNames.set(Books.Colossians, [
  {name: 'കൊലൊസ്സ്യർ', abbreviations: ['കൊലൊ']},
]);

// Thessalonians_1 = '1TH',
BookNames.set(Books.Thessalonians_1, [
  {
    name: '1 തെസ്സലൊനീക്യർ',
    abbreviations: ['1 തെസ്സ'],
  },
]);

// Thessalonians_2 = '2TH',
BookNames.set(Books.Thessalonians_2, [
  {
    name: '2 തെസ്സലൊനീക്യർ',
    abbreviations: ['2 തെസ്സ'],
  },
]);

// Timothy_1 = '1TI',
BookNames.set(Books.Timothy_1, [
  {name: '1 തിമൊഥെയൊസ്', abbreviations: ['1 തിമൊ']},
]);

// Timothy_2 = '2TI',
BookNames.set(Books.Timothy_2, [
  {name: '2 തിമൊഥെയൊസ്', abbreviations: ['2 തിമൊ']},
]);

// Titus = 'TIT',
BookNames.set(Books.Titus, [{name: 'തീത്തൊസ്', abbreviations: ['തീത്തൊ']}]);

// Philemon = 'PHM',
BookNames.set(Books.Philemon, [{name: 'ഫിലേമോൻ', abbreviations: ['ഫിലേ']}]);

// Hebrews = 'HEB',
BookNames.set(Books.Hebrews, [{name: 'എബ്രായർ', abbreviations: ['എബ്രാ']}]);

// James = 'JAS',
BookNames.set(Books.James, [{name: 'യാക്കോബ്', abbreviations: ['യാക്കോ']}]);

// Peter_1 = '1PE',
BookNames.set(Books.Peter_1, [{name: '1 പത്രൊസ്', abbreviations: ['1 പത്രൊ']}]);

// Peter_2 = '2PE',
BookNames.set(Books.Peter_2, [{name: '2 പത്രൊസ്', abbreviations: ['2 പത്രൊ']}]);

// John_1 = '1JN',
BookNames.set(Books.John_1, [{name: '1 യോഹന്നാൻ', abbreviations: ['1 യോഹ']}]);

// John_2 = '2JN',
BookNames.set(Books.John_2, [{name: '2 യോഹന്നാൻ', abbreviations: ['2 യോഹ']}]);

// John_3 = '3JN',
BookNames.set(Books.John_3, [{name: '3 യോഹന്നാൻ', abbreviations: ['3 യോഹ']}]);

// Jude = 'JUD',
BookNames.set(Books.Jude, [{name: 'യൂദാ'}]);

// Revelation = 'REV',
BookNames.set(Books.Revelation, [
  {name: 'വെളിപ്പാടു', abbreviations: ['വെളി']},
]);

// Tobit = 'TOB',
BookNames.set(Books.Tobit, [{name: 'തോബിത്‌'}]);

// Judith = 'JDT',
BookNames.set(Books.Judith, [{name: 'യൂദിത്ത്‌'}]);

// Wisdom_of_Solomon = 'WIS',
BookNames.set(Books.Wisdom_of_Solomon, [
  {
    name: 'ജ്‌ഞാനം',
  },
]);

// Sirach = 'SIR',
BookNames.set(Books.Sirach, [{name: 'പ്രഭാഷകന്‍'}]);

// Baruch = 'BAR',
BookNames.set(Books.Baruch, [{name: 'ബാറൂക്ക്‌'}]);

// Maccabees_1 = '1MA',
BookNames.set(Books.Maccabees_1, [
  {
    name: '1 മക്കബായര്‍',
  },
]);

// Maccabees_2 = '2MA',
BookNames.set(Books.Maccabees_2, [
  {
    name: '2 മക്കബായര്‍',
  },
]);

// define function to parse reference groups

// define function to parse references
