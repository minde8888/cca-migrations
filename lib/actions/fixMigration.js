import fs from 'fs';
import path from 'path';
import { initializeConnection, cleanup } from '../database/connection.js';

const getMigrationFiles = (migrationsDir) => {
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  try {
    return fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .map(file => parseMigrationFile(file))
      .sort((a, b) => a.timestamp - b.timestamp);  
  } catch (error) {
    console.error(`Error reading migration directory: ${migrationsDir}`, error);
    throw error;
  }
};

const parseMigrationFile = (file) => {
  // Try to extract timestamp from end of filename first
  const timestampMatch = file.match(/(\d+)\.js$/);
  if (timestampMatch) {
    const timestamp = parseInt(timestampMatch[1], 10);
    return {
      timestamp,
      name: file.replace('.js', '')
    };
  }

  // Fall back to original format (timestamp-name.js)
  const [timestamp, ...nameParts] = file.split('-');
  const parsedTimestamp = parseInt(timestamp, 10);
  
  if (isNaN(parsedTimestamp)) {
    throw new Error(`Invalid migration filename format: ${file}. Expected format: either 'timestamp-name.js' or 'name{timestamp}.js'`);
  }

  return {
    timestamp: parsedTimestamp,
    name: `${timestamp}-${nameParts.join('-').replace('.js', '')}`
  };
};

const syncMigrations = async (queryRunner, migrationFiles) => {
  try {
    await queryRunner.startTransaction();

    await queryRunner.query('DELETE FROM migrations');

    for (const migration of migrationFiles) {
      console.log(`Adding migration to DB: ${migration.name}`);
      await queryRunner.query(
        'INSERT INTO migrations(timestamp, name) VALUES($1, $2)',
        [migration.timestamp, migration.name]
      );
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
    console.error('Error syncing migrations:', error);
    throw error;
  }
};

export const runFixMigration = async (dataSource, migrationsDir) => {
  if (!migrationsDir) {
    throw new Error('Migrations directory path is required');
  }

  let queryRunner = null;

  try {
    console.log('Initializing connection...');
    queryRunner = await initializeConnection(dataSource);

    console.log('Reading migration files from:', migrationsDir);
    const migrationFiles = getMigrationFiles(migrationsDir);
    
    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    console.log('Migration files found:', migrationFiles);

    await syncMigrations(queryRunner, migrationFiles);
    console.log('Migrations have been synchronized successfully.');
  } catch (error) {
    console.error('Error during migration fix process:', error.message);
    throw error;
  } finally {
    await cleanup(dataSource, queryRunner);
  }
};