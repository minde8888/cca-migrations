export const runMigrations = async (AppDataSource, action) => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log("Initializing DataSource...");
      await AppDataSource.initialize();
    }

    console.log("Performing '" + action + "' migration...");

    if (action === "run") {
      console.log("Running migrations...");
      const migrations = await AppDataSource.runMigrations();
      console.log("Applied migrations:", migrations.length);
    } else if (action === "revert") {
      console.log("Reverting last migration...");
      await AppDataSource.undoLastMigration();
    }

    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};
