import { findConfigFileRecursive } from "./findConfigFileRecursively.js";

export const findConfigFile = () => {
  const startPath = process.cwd();
  let configPath = findConfigFileRecursive(startPath);

  if (!configPath) {
    console.error(
      `Could not find caa-config.json in any parent directory of ${startPath}`
    );
    process.exit(1);
  }

  return configPath;
};