import fs from "fs";
import path from "path";

export const findConfigFileRecursive = (currentPath, maxDepth = 10) => {
  if (maxDepth < 0) {
    console.error("Maximum directory traversal depth reached.");
    return null;
  }

  try {
    const files = fs.readdirSync(currentPath);

    const configFile = files.find((file) => file === "cca.config.json");

    if (configFile) {
      const resolvedPath = path.join(currentPath, configFile);
      return resolvedPath;
    }

    const parentDir = path.dirname(currentPath);
    if (parentDir === currentPath) {
      console.log("Reached the root directory. Stopping search.");
      return null;
    }

    return findConfigFileRecursive(parentDir, maxDepth - 1);
  } catch (error) {
    console.error(`Error accessing ${currentPath}: ${error.message}`);
    return null;
  }
};
