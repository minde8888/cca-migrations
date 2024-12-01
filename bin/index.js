#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import { findConfigFile } from '../lib/findConfigFile.js';
import { initializeDataSource } from '../lib/initializeDataSource.js';
import { runMigrations } from '../lib/runMigrations.js';

const program = new Command();

program
  .name('cca-migrations')
  .description('CCA Migration tool')
  .version('0.0.24');

program
  .command('run')
  .description('Run database migrations')
  .action(async () => {
    try {
      const configPath = findConfigFile();
      console.log(`Using config from: ${configPath}`);

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const AppDataSource = await initializeDataSource(config);

      await runMigrations(AppDataSource, 'run');

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    } catch (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
  });

program
  .command('revert')
  .description('Revert last migration')
  .action(async () => {
    try {
      const configPath = findConfigFile();
      console.log(`Using config from: ${configPath}`);

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const AppDataSource = await initializeDataSource(config);

      await runMigrations(AppDataSource, 'revert');

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    } catch (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
  });

program.parse();