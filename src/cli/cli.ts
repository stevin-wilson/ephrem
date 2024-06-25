#!/usr/bin/env node
import {Command} from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  DEFAULT_LANGUAGES,
  DEFAULT_PASSAGE_OPTIONS,
} from '../api-bible/api-constants.js';
import {
  setApiKey,
  setDefaultLanguages,
  setDefaultPassageOptions,
} from '../api-bible/api-utils.js';
import {
  DEFAULT_BIBLES,
  DEFAULT_BIBLES_TO_EXCLUDE,
  DEFAULT_CACHE_DIR,
} from '../cache/cache-constants.js';
import {
  setDefaultBibles,
  setDefaultBiblesToExclude,
  setDefaultCacheDir,
} from '../cache/cache-utils.js';
import {setDefaultUseMajorityFallback} from '../reference/reference-utils.js';
import {PassageOptions} from '../api-bible/api-types.js';
import {getPassages} from '../passage/get-passages.js';
import {GetPassagesOptions} from '../passage/passage-types.js';
import {normalizeLanguage} from '../utils.js';

const showFigletText = () => {
  console.log(
    chalk.magenta.bold(figlet.textSync('Ephrem', {horizontalLayout: 'full'}))
  );
};

const printPassages = async (options: GetPassagesOptions): Promise<void> => {
  const passageOutput = await getPassages(options);

  for (const passages of Object.values(passageOutput)) {
    passages.forEach(passage => {
      console.log('\n');
      console.log(chalk.blueBright.bold(passage.data.reference));
      console.log(passage.data.content);
    });
  }
};

const program = new Command();

program
  .name('ephrem')
  .version('0.0.1')
  .description('API Wrapper for API.Bible');

program
  .command('init')
  .description('Setup user config to fetch passages from API.Bible')
  .action(() => {
    showFigletText();
    const questions = [
      {
        name: 'apiKey',
        message: 'Enter your API Key:',
        type: 'password',
      },
      {
        name: 'languages',
        message: 'Enter your preferred language(s). Use comma as separator:',
        type: 'input',
        default: DEFAULT_LANGUAGES.join(','),
      },
      {
        name: 'bibles',
        message: 'Enter your preferred Bible(s). Use comma as separator:',
        type: 'input',
        default: DEFAULT_BIBLES.join(','),
      },
      {
        name: 'biblesToExclude',
        message:
          'Enter Bible(s) to ignore when inferring book ID from a book name. Use comma as separator:',
        type: 'input',
        default: DEFAULT_BIBLES_TO_EXCLUDE.join(','),
      },
      {
        name: 'contentType',
        message: 'Select format for passage output:',
        type: 'list',
        choices: ['html', 'json', 'text'],
        default: 'text',
      },
      {
        name: 'passageOptions',
        message: 'Enable options for passage output:',
        type: 'checkbox',
        choices: [
          {name: 'includeNotes', value: 'includeNotes'},
          {name: 'includeTitles', value: 'includeTitles'},
          {name: 'includeChapterNumbers', value: 'includeChapterNumbers'},
          {name: 'includeVerseNumbers', value: 'includeVerseNumbers'},
          {name: 'includeVerseSpans', value: 'includeVerseSpans'},
        ],
      },
      {
        name: 'cacheDir',
        message: 'Enter path to use for caching:',
        type: 'input',
        default: DEFAULT_CACHE_DIR,
      },
    ];

    inquirer.prompt(questions).then(answers => {
      // Store these values as default somewhere
      setApiKey(answers.apiKey);
      setDefaultLanguages(answers.languages.split(','));
      setDefaultBibles(answers.bibles.split(','));
      setDefaultUseMajorityFallback(
        answers.useMajorityFallback.includes('useMajorityFallback')
      );
      setDefaultBiblesToExclude(answers.biblesToExclude.split(','));

      const defaultPassageOptions: PassageOptions = {
        contentType: answers.contentType,
        includeNotes: answers.passageOptions.includes('includeNotes'),
        includeTitles: answers.passageOptions.includes('includeTitles'),
        includeChapterNumbers: answers.passageOptions.includes(
          'includeChapterNumbers'
        ),
        includeVerseNumbers: answers.passageOptions.includes(
          'includeVerseNumbers'
        ),
        includeVerseSpans: answers.passageOptions.includes('includeVerseSpans'),
      };

      setDefaultPassageOptions(defaultPassageOptions);
      setDefaultCacheDir(answers.cacheDir);
      console.log('Successfully completed setup to use Ephrem');
    });
  });

program
  .command('get-passages')
  .description('Fetch passages from API.Bible')
  .argument('<passages>', 'Passages to retrieve')
  .option(
    '--languages <type>',
    'List of languages associated with the reference or Bibles',
    DEFAULT_LANGUAGES.join(',')
  )
  .option(
    '--content-type <type>',
    'The content type for the passage output',
    /^(json|html|text)$/i,
    DEFAULT_PASSAGE_OPTIONS.contentType
      ? DEFAULT_PASSAGE_OPTIONS.contentType
      : 'text'
  )
  .option('--include-notes <boolean>', 'Should notes be included', false)
  .option('--include-titles <boolean>', 'Should titles be included', false)
  .option(
    '--include-chapter-numbers <boolean>',
    'Should chapter numbers be included',
    false
  )
  .option(
    '--include-verse-numbers <boolean>',
    'Should verse numbers be included',
    false
  )
  .option(
    '--include-verse-spans <boolean>',
    'Should verse spans be included',
    false
  )
  .action(
    async (
      passages,
      {
        contentType,
        languages,
        includeNotes,
        includeTitles,
        includeChapterNumbers,
        includeVerseNumbers,
        includeVerseSpans,
      }
    ) => {
      await printPassages({
        input: passages,
        passageOptions: {
          contentType,
          includeNotes,
          includeTitles,
          includeChapterNumbers,
          includeVerseNumbers,
          includeVerseSpans,
        },
        languages: languages
          .split(',')
          .map((l: string) => normalizeLanguage(l)),
      });
    }
  );
if (
  !process.argv.includes('get-passages') ||
  (process.argv.includes('get-passages') &&
    (process.argv.includes('--help') || process.argv.includes('-h')))
) {
  showFigletText();
}
program.parse(process.argv);
