#!/usr/bin/env node
import {Command} from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

console.log(
  chalk.magenta.bold(figlet.textSync('Ephrem', {horizontalLayout: 'full'}))
);

const program = new Command();

program
  .name('ephrem')
  .version('0.0.1')
  .description('An example CLI for managing a directory');

program
  .command('init')
  .description('Split a string into substrings and display as an array');

program
  .command('get-passages')
  .description('Split a string into substrings and display as an array')
  .argument('<passages>', 'passages to retrieve')
  .option('-m, --mkdir <value>', 'Create a directory')
  .option('-t, --touch <value>', 'Create a file');

program.parse(process.argv);
// options
