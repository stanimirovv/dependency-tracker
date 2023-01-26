import { compareVersions } from "compare-versions";
import { PackageVersionReport } from "./types/packageVersionReport.type";
import { PackageWithVersions } from "./types/packageWithVersions.type";
import { ReportConfig } from "./types/reportConfig.type";

export default function generatePackageReport(
  { versions, currentVersion, packageName }: PackageWithVersions,
  reportConfig: ReportConfig
): PackageVersionReport {
  let minorVersionsBehind = 0;
  let patchVersionsBehind = 0;
  let majorVersionsBehind = 0;

  const versionsBehindArray = versions.filter((version: string) => {
    // extract versions
    const majorVersion = version.split(".")[0];
    const minorVersion = `${version.split(".")[0]}${version.split(".")[1]}`;
    const patchVersion = version;

    // extract current versions
    const currentMajorVersion = currentVersion.split(".")[0];
    const currentMinorVersion = `${currentVersion.split(".")[0]}${
      currentVersion.split(".")[1]
    }`;
    const currentPatchVersion = currentVersion;

    // Calculate which versions are behind
    const hasBiggerMajorVersion =
      compareVersions(majorVersion, currentMajorVersion) === 1;
    const hasBiggerMinorVersion =
      compareVersions(minorVersion, currentMinorVersion) === 1;
    const hasBiggerPatchVersion =
      compareVersions(patchVersion, currentPatchVersion) === 1;

    // Increment the versions behind
    if (hasBiggerMajorVersion && !reportConfig.skipMajorVersions) {
      majorVersionsBehind++;
    }

    if (hasBiggerMinorVersion && !reportConfig.skipMinorVersions) {
      minorVersionsBehind++;
    }

    if (hasBiggerPatchVersion && !reportConfig.skipPatchVersions) {
      patchVersionsBehind++;
    }

    return version > currentVersion;
  });

  const latestVersion =
    versionsBehindArray.length > 0 ? versionsBehindArray[0] : currentVersion;
  const versionsBehind =
    minorVersionsBehind + patchVersionsBehind + majorVersionsBehind;

  return {
    packageName,
    versionsBehind,
    minorVersionsBehind,
    patchVersionsBehind,
    majorVersionsBehind,
    currentVersion,
    latestVersion,
  };
}
