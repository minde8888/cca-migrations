import fs from "fs";
import path from "path";

export const findConfigFileRecursive = (currentPath, maxDepth = 10) => {
  if (maxDepth < 0) return null;

  try {
    const files = fs.readdirSync(currentPath);
    const configFile = files.find((file) => file === "cca.config.json");

    if (configFile) {
      return path.join(currentPath, configFile);
    }

    const parentDir = path.dirname(currentPath);
    if (parentDir === currentPath) {
      return null;
    }

    return findConfigFileRecursive(parentDir, maxDepth - 1);
  } catch (error) {
    console.error("Error reading directory:", error.message);
    return null;
  }
};
