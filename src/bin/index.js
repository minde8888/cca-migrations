#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import fs from "fs";

import { handleMigration } from "../lib/migrationsHandler.js";
import { AppDataSource } from "../lib/database/config.js";
import { findConfigFile } from "../lib/utils/findConfigFile.js";

const program = new Command();

program
  .name("cca-migrations")
  .description("CCA Migration tool")
  .version("0.0.95");

program
  .argument("<action>", "Action to perform (run/revert/fix/force)")
  .description('Run database migrations')
  .action(async (action) => {
    try {
      const migrationsDir = getMigrationsDirectory();
      const configPath = await findConfigFile();

      const dataSource = await AppDataSource(configPath);

      await handleMigration(action, dataSource, migrationsDir);
    } catch (error) {
      handleCommandError(error);
    }
  });

const getMigrationsDirectory = () => {
  const migrationsDir = path.resolve(process.cwd(), "migrations");

  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  return migrationsDir;
};

const handleCommandError = (error) => {
  console.error("Error executing command:", error.message);
  process.exit(1);
};

program.parse();