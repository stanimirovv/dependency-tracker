import fs from "fs";

export default function getDependenciesFromLockFile(
  lockFilePath: string
): Record<string, string> {
  try {
    const fileContents = fs.readFileSync(lockFilePath, "utf8");
    const packageLock = JSON.parse(fileContents);
    return packageLock.packages[""].dependencies;
  } catch (e) {
    console.error(`Error reading lock file: ${lockFilePath}, error: `, e);
    process.exit();
  }
}
