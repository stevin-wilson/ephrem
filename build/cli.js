#!/usr/bin/env node
import {Command} from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import {input, confirm, password, checkbox} from '@inquirer/prompts';

console.log(
  chalk.magenta.bold(figlet.textSync('Ephrem', {horizontalLayout: 'full'}))
);

const program = new Command();

program
  .name('ephrem')
  .version('0.0.1')
  .description('An example CLI for managing a directory');

program.command('init').description('Initialize settings');
// set cache dir
// api key
// default passage options
// use fall back
// bibles to exclude
// languages
// default bibles
// use configstore

program
  .command('get-passages')
  .description('Split a string into substrings and display as an array')
  .argument('<passages>', 'passages to retrieve')
  .option('-m, --mkdir <value>', 'Create a directory')
  .option('-t, --touch <value>', 'Create a file');
// default passage options
// use fall back
// bibles to exclude
// languages
// default bibles

program.command('clear-cache').description('Initialize settings');

program.parse(process.argv);
