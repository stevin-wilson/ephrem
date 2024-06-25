#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { DEFAULT_LANGUAGES, DEFAULT_PASSAGE_OPTIONS, } from '../api-bible/api-constants.js';
import { setApiKey, setDefaultLanguages, setDefaultPassageOptions, } from '../api-bible/api-utils.js';
import { DEFAULT_BIBLES, DEFAULT_BIBLES_TO_EXCLUDE, DEFAULT_CACHE_DIR, } from '../cache/cache-constants.js';
import { setDefaultBibles, setDefaultBiblesToExclude, setDefaultCacheDir, } from '../cache/cache-utils.js';
import { setDefaultUseMajorityFallback } from '../reference/reference-utils.js';
import { getPassages } from '../passage/get-passages.js';
import { normalizeLanguage } from '../utils.js';
const showFigletText = () => {
    console.log(chalk.magenta.bold(figlet.textSync('Ephrem', { horizontalLayout: 'full' })));
};
const printPassages = async (options) => {
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
            message: 'Enter Bible(s) to ignore when inferring book ID from a book name. Use comma as separator:',
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
                { name: 'includeNotes', value: 'includeNotes' },
                { name: 'includeTitles', value: 'includeTitles' },
                { name: 'includeChapterNumbers', value: 'includeChapterNumbers' },
                { name: 'includeVerseNumbers', value: 'includeVerseNumbers' },
                { name: 'includeVerseSpans', value: 'includeVerseSpans' },
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
        setDefaultUseMajorityFallback(answers.useMajorityFallback.includes('useMajorityFallback'));
        setDefaultBiblesToExclude(answers.biblesToExclude.split(','));
        const defaultPassageOptions = {
            contentType: answers.contentType,
            includeNotes: answers.passageOptions.includes('includeNotes'),
            includeTitles: answers.passageOptions.includes('includeTitles'),
            includeChapterNumbers: answers.passageOptions.includes('includeChapterNumbers'),
            includeVerseNumbers: answers.passageOptions.includes('includeVerseNumbers'),
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
    .option('--languages <type>', 'List of languages associated with the reference or Bibles', DEFAULT_LANGUAGES.join(','))
    .option('--content-type <type>', 'The content type for the passage output', /^(json|html|text)$/i, DEFAULT_PASSAGE_OPTIONS.contentType
    ? DEFAULT_PASSAGE_OPTIONS.contentType
    : 'text')
    .option('--include-notes <boolean>', 'Should notes be included', false)
    .option('--include-titles <boolean>', 'Should titles be included', false)
    .option('--include-chapter-numbers <boolean>', 'Should chapter numbers be included', false)
    .option('--include-verse-numbers <boolean>', 'Should verse numbers be included', false)
    .option('--include-verse-spans <boolean>', 'Should verse spans be included', false)
    .action(async (passages, { contentType, languages, includeNotes, includeTitles, includeChapterNumbers, includeVerseNumbers, includeVerseSpans, }) => {
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
            .map((l) => normalizeLanguage(l)),
    });
});
if (!process.argv.includes('get-passages') ||
    (process.argv.includes('get-passages') &&
        (process.argv.includes('--help') || process.argv.includes('-h')))) {
    showFigletText();
}
program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaS9jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUNMLGlCQUFpQixFQUNqQix1QkFBdUIsR0FDeEIsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQ0wsU0FBUyxFQUNULG1CQUFtQixFQUNuQix3QkFBd0IsR0FDekIsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQ0wsY0FBYyxFQUNkLHlCQUF5QixFQUN6QixpQkFBaUIsR0FDbEIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLHlCQUF5QixFQUN6QixrQkFBa0IsR0FDbkIsTUFBTSx5QkFBeUIsQ0FBQztBQUNqQyxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUU5RSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFFdkQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTlDLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtJQUMxQixPQUFPLENBQUMsR0FBRyxDQUNULEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUMxRSxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUFFLE9BQTJCLEVBQWlCLEVBQUU7SUFDekUsTUFBTSxhQUFhLEdBQUcsTUFBTSxXQUFXLENB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