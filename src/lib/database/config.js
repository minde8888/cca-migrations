import { DataSource } from "typeorm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const AppDataSource = async (configPath) => {
  try {
    const projectRoot = process.cwd();
    const migrationsPath = path.join(projectRoot, "migrations");

    const migrationFiles = fs.readdirSync(migrationsPath);
    console.log("Found migration files:", migrationFiles);

    if (!configPath) {
      throw new Error("Configuration path is required");
    }

    const configContent = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configContent);

    return new DataSource({
      name: "postgres",
      type: config.type,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false,
      logging: ["query", "error", "schema", "migration"],
      logger: "advanced-console",
      entities: [],
      migrations: [`${migrationsPath}/*.js`],
      migrationsTableName: "migrations",
      migrationsRun: false,
      metadataTableName: "typeorm_metadata",
    });
  } catch (error) {
    console.error("Error initializing DataSource:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
};
