#!/usr/bin/env node

import { Command } from 'commander';
import { command as printCommand } from './print/command.ts';
import { command as snapCommand } from './snap/command.ts';

const program = new Command();

program
    .name('pagepress')
    .description('Convert web pages and Markdown to PDF and images')
    .version('0.1.0');

program.addCommand(printCommand);
program.addCommand(snapCommand);

program.parse();
