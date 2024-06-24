#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { DEFAULT_LANGUAGES } from '../api-bible/api-constants.js';
import { setApiKey, setDefaultLanguages, setDefaultPassageOptions, } from '../api-bible/api-utils.js';
import { DEFAULT_BIBLES_TO_EXCLUDE, DEFAULT_CACHE_DIR, } from '../cache/cache-constants.js';
import { setDefaultBibles, setDefaultBiblesToExclude, setDefaultCacheDir, } from '../cache/cache-utils.js';
import { setDefaultUseMajorityFallback } from '../reference/reference-utils.js';
import { getPassages } from '../passage/get-passages.js';
const printPassages = async (options) => {
    const passageOutput = await getPassages(options);
    for (const passages of Object.values(passageOutput)) {
        passages.forEach(passage => {
            chalk.yellow.bold(passage.data.reference);
            chalk.white(passage.data.content);
            chalk.gray.italic(passage.data.copyright);
        });
    }
};
console.log(chalk.magenta.bold(figlet.textSync('Ephrem', { horizontalLayout: 'full' })));
const program = new Command();
program
    .name('ephrem')
    .version('0.0.1')
    .description('API Wrapper for API.Bible');
program
    .command('init')
    .description('Setup user config to fetch passages from API.Bible')
    .action(() => {
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
            default: DEFAULT_LANGUAGES.join(','),
        },
        {
            name: 'useMajorityFallback',
            message: 'If book name is not in a Bible, identify Book code from other Bibles that have the book name as fallback:',
            type: 'checkbox',
            choices: [{ name: 'useMajorityFallback', value: 'useMajorityFallback' }],
        },
        {
            name: 'biblesToExclude',
            message: 'Enter Bible(s) to ignore when inferring book ID in the fallback method. Use comma as separator:',
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
    .option('--content-type <type>', 'The content type for the passage output', /^(json|html|text)$/i, 'text')
    .option('--include-notes <boolean>', 'Should notes be included', false)
    .option('--include-titles <boolean>', 'Should titles be included', false)
    .option('--include-chapter-numbers <boolean>', 'Should chapter numbers be included', false)
    .option('--include-verse-numbers <boolean>', 'Should verse numbers be included', false)
    .option('--include-verse-spans <boolean>', 'Should verse spans be included', false)
    .action(async (passages, { contentType, includeNotes, includeTitles, includeChapterNumbers, includeVerseNumbers, includeVerseSpans, }) => {
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
    });
});
program.parse(process.argv);
// options
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaS9jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUNMLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsd0JBQXdCLEdBQ3pCLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixpQkFBaUIsR0FDbEIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLHlCQUF5QixFQUN6QixrQkFBa0IsR0FDbkIsTUFBTSx5QkFBeUIsQ0FBQztBQUNqQyxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUU5RSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFHdkQsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUFFLE9BQTJCLEVBQWlCLEVBQUU7SUFDekUsTUFBTSxhQUFhLEdBQUcsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFakQsS0FBSyxNQUFNLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7UUFDcEQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN6QixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFP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