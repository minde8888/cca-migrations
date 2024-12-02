import { runMigration } from "./actions/runMigration.js";
import { revertMigration } from "./actions/revertMigration.js";
import { runFixMigration } from "./actions/fixMigration.js";
import { runForceMigration } from "./actions/forceMigration.js";

const migrationActions = {
  run: async (dataSource) => await runMigration(dataSource),
  revert: async (dataSource) => await revertMigration(dataSource),
  fix: async (dataSource, migrationsDir) =>
    await runFixMigration(dataSource, migrationsDir),
  force: async (dataSource) => await runForceMigration(dataSource),
};

export const handleMigration = async (action, dataSource, migrationsDir) => {
  
  try {
    const migrationHandler = migrationActions[action];

    if (!migrationHandler) {
      throw new Error(`Unknown migration action: ${action}`);
    }

    await migrationHandler(dataSource, migrationsDir);
  } catch (error) {
    console.error(`Failed to ${action} migrations:`, error);
    process.exit(1);
  }
};
