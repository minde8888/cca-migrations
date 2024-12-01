import path from "path";
import { DataSource } from "typeorm";
import { fileURLToPath } from 'url';

export const initializeDataSource = async (config) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const migrationsPath = path.join(__dirname, "migrations", "*.js");

    const AppDataSource = new DataSource({
      name: "default",
      type: config.type,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false,
      logging: ["query", "error"],
      entities: [],
      migrations: [migrationsPath],
      migrationsTableName: "migrations",
    });

    console.log("Found migrations:", AppDataSource.migrations);

    return AppDataSource;
  } catch (error) {
    console.error("Error initializing DataSource:", error);
    throw error;
  }
};
