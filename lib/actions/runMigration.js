import { initializeConnection, cleanup } from "../database/connection.js";

export const runMigration = async (dataSource) => {
  let queryRunner = null;
  
  try {
    queryRunner = await initializeConnection(dataSource);
    
    const initializedDataSource = queryRunner.manager.connection;
    
    console.log("Checking current migrations state...");
    const executedMigrations = await initializedDataSource.showMigrations();
    console.log("Current executed migrations:", executedMigrations);

    console.log("Clearing migration history...");
    await queryRunner.query('DELETE FROM migrations');
    
    console.log("Running migrations...");
    const migrations = await initializedDataSource.runMigrations({
      transaction: 'each'  
    });

    if (migrations.length > 0) {
      console.log("Successfully applied migrations:");
      migrations.forEach(migration => {
        console.log(` - ${migration.name}`);
      });
    } else {
      console.log("No new migrations to apply.");
    }

    const tables = await queryRunner.getTables();
    console.log("Current tables in database:", tables.map(t => t.name));

    console.log("Migration action completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
    if (error.message.includes('already exists')) {
      console.log("Hint: If tables already exist but aren't in migrations table, try running 'migrations fix' first.");
    }
    throw error;
  } finally {
    await cleanup(dataSource, queryRunner);
  }
};