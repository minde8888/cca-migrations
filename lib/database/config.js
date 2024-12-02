import { DataSource } from "typeorm";
import fs from "fs";
import path from "path";

export const AppDataSource = async (configPath) => {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const migrationsPath = path.join(
      process.cwd(),
      "lib",
      "migrations",
      "*{.ts,.js}"
    );

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
      migrations: [migrationsPath],
      migrationsTableName: "migrations",
    });
  } catch (error) {
    console.error("Error initializing DataSource:", error.message);
    throw error;
  }
};
