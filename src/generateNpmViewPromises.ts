import { exec as execCb } from "child_process";
import util from "util";
import { PackageWithVersions } from "./types/packageWithVersions.type";
const exec = util.promisify(execCb);

export default function generateNpmViewPromises(
  dependencies: Record<string, string>
): Promise<PackageWithVersions>[] {
  return Object.keys(dependencies).map(async (packageName: string) => {
    try {
      const { stdout } = await exec(`npm view ${packageName} --json`);
      const parsedOutput = JSON.parse(stdout);
      // Clean up the package versions
      const currentVersion = dependencies[packageName];
      return {
        packageName,
        versions: parsedOutput.versions,
        currentVersion,
        latestVersion: parsedOutput["dist-tags"].latest,
      };
    } catch (e) {
      console.error(`Error getting versions for ${packageName}, error: `, e);
      throw e;
    }
  });
}
