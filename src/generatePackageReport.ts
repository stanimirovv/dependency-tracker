import { shouldSkipVersion } from "./shouldSkipVersion";
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
    const minorVersion = version.split(".")[1];
    const patchVersion = version.split(".")[2];

    // skip dev, alpha, and beta versions
    if (shouldSkipVersion(patchVersion)) {
      return false;
    }

    // extract current versions
    const currentMajorVersion = currentVersion.split(".")[0];
    const currentMinorVersion = currentVersion.split(".")[1];
    const currentPatchVersion = currentVersion.split(".")[2];

    // Calculate which versions are behind
    const hasBiggerMajorVersion = majorVersion > currentMajorVersion;
    const hasBiggerMinorVersion =
      majorVersion === currentMajorVersion &&
      minorVersion > currentMinorVersion;
    const hasBiggerPatchVersion =
      majorVersion === currentMajorVersion &&
      minorVersion === currentMinorVersion &&
      patchVersion > currentPatchVersion;

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

  const latestVersion = versionsBehindArray[0];
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
