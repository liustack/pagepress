#!/usr/bin/env node

declare const __APP_VERSION__: string;

import { Command } from 'commander';
import { command as pdfCommand } from './pdf/command.ts';
import { command as shotCommand } from './shot/command.ts';

const program = new Command();

program
    .name('pagepress')
    .description('Convert web pages and Markdown to PDF and images')
    .version(__APP_VERSION__);

program.addCommand(pdfCommand);
program.addCommand(shotCommand);

program.parse();
