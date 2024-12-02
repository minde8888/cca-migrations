import { MigrationExecutor } from "typeorm";
import { initializeConnection, cleanup } from "../database/connection.js";

export const runForceMigration = async (dataSource) => {
  let queryRunner = null;

  try {
    console.log("Initializing connection...");
    queryRunner = await initializeConnection(dataSource);

      const initializedDataSource = queryRunner.manager.connection;

    console.log("Initializing migration executor...");
    const migrationExecutor = createMigrationExecutor(initializedDataSource, queryRunner);

    await executePendingMigrations(migrationExecutor);
    await logCurrentTables(queryRunner);
  } catch (error) {
    handleMigrationError(error);
  } finally {
    await cleanup(dataSource, queryRunner);
  }
};

const createMigrationExecutor = (dataSource, queryRunner) => {
  if (!dataSource || !dataSource.isInitialized) {
    throw new Error("DataSource must be initialized before creating MigrationExecutor");
  }
  
  return new MigrationExecutor(dataSource, queryRunner);
};

const executePendingMigrations = async (migrationExecutor) => {
  try {
    console.log("Checking for pending migrations...");
    const pendingMigrations = await migrationExecutor.getPendingMigrations();

    if (pendingMigrations.length > 0) {
      console.log(`Found ${pendingMigrations.length} pending migration(s):`);
      pendingMigrations.forEach(migration => 
        console.log(` - ${migration.name}`)
      );
      
      console.log("Executing migrations...");
      await migrationExecutor.executePendingMigrations();
      console.log("All pending migrations have been executed successfully.");
    } else {
      console.log("No pending migrations found.");
    }
  } catch (error) {
    console.error("Error executing pending migrations:", error);
    throw error;
  }
};

const logCurrentTables = async (queryRunner) => {
  try {
    console.log("Checking current database tables...");
    const tables = await queryRunner.getTables();
    
    if (tables.length > 0) {
      console.log("Current tables in database:");
      tables.forEach(table => console.log(` - ${table.name}`));
    } else {
      console.log("No tables found in database.");
    }
  } catch (error) {
    console.error("Error getting tables:", error);
    throw error;
  }
};

const handleMigrationError = (error) => {
  if (error.message.includes('options')) {
    console.error("Failed to initialize migration executor. Please ensure DataSource is properly configured.");
  } else {
    console.error("Failed to run migrations:", error.message);
  }
  throw error;
};