import { initializeConnection, cleanup } from "../database/connection.js";

export const revertMigration = async (dataSource) => {
  let queryRunner = null;

  try {
    console.log("Starting migration revert process...");

    queryRunner = await initializeConnection(dataSource);
    const initializedDataSource = queryRunner.manager.connection;
    const pendingMigrations = await initializedDataSource.showMigrations();

    if (pendingMigrations.length === 0) {
      console.log("No migrations to revert.");
      return;
    }

    console.log("Reverting last migration...");
    await initializedDataSource.undoLastMigration();

    console.log("Migration successfully reverted.");
  } catch (error) {
    console.error("Failed to revert migration:", error.message);
    throw error;
  } finally {
    await cleanup(dataSource, queryRunner);
  }
};
