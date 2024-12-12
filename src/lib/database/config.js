import { DataSource } from "typeorm";
import fs from "fs";
import path from "path";

export const AppDataSource = async (configPath) => {
  try {
    let configContent = fs.readFileSync(configPath, "utf8");
    configContent = configContent.replace(/^\uFEFF/, '');
    
    const config = JSON.parse(configContent);
    
    const migrationsDir = path.join(process.cwd(), "migrations");
    console.log(`Resolved migrations path: ${migrationsPath}`);

    return new DataSource({
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
      migrations: [`${migrationsDir}/*.ts`, `${migrationsDir}/*.js`],
      migrationsTableName: "migrations",
    });
  } catch (error) {
    console.error("Error initializing DataSource:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
};
