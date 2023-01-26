import fs from "fs";

export default function getDependenciesFromLockFile(
  lockFilePath: string,
  checkDevDependencies: boolean
): Record<string, string> {
  try {
    const fileContents = fs.readFileSync(lockFilePath, "utf8");
    const packageLock = JSON.parse(fileContents);
    let packages = packageLock.packages[""].dependencies || {};
    if (checkDevDependencies) {
      const devDependencies = packageLock.packages[""].devDependencies || {};
      packages = { ...packages, ...devDependencies };
    }

    return packages;
  } catch (e) {
    console.error(`Error reading lock file: ${lockFilePath}, error: `, e);
    process.exit();
  }
}
