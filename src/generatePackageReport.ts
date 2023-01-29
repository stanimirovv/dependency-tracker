import { compareVersions } from "compare-versions";
import { PackageVersionReport } from "./types/packageVersionReport.type";
import { PackageWithVersions } from "./types/packageWithVersions.type";
import { ReportConfig } from "./types/reportConfig.type";

export default function generatePackageReport(
  { versions, currentVersion, packageName, latestVersion }: PackageWithVersions,
  reportConfig: ReportConfig
): PackageVersionReport {
  const originalCurrentVersion = currentVersion;
  let minorVersionsBehind = 0;
  let patchVersionsBehind = 0;
  let majorVersionsBehind = 0;

  versions.forEach((version: string) => {
    if (isUnstableVersion(version)) {
      return;
    }

    // extract versions
    const majorVersion = version.split(".")[0];
    const minorVersion = `${version.split(".")[0]}.${version.split(".")[1]}`;
    const patchVersion = version;

    // extract current versions
    const currentMajorVersion = currentVersion.split(".")[0];
    const currentMinorVersion = `${currentVersion.split(".")[0]}.${
      currentVersion.split(".")[1]
    }`;
    const currentPatchVersion = currentVersion;

    // Calculate which versions are behind

    const isVersionAheadOfLatest =
      compareVersions(version, latestVersion) === 1;

    const incrementPatch = shouldIncrementPatch(
      patchVersion,
      currentPatchVersion,
      reportConfig.skipPatchVersions,
      isVersionAheadOfLatest
    );
    const incrementMinor = shouldIncrementMinor(
      minorVersion,
      currentMinorVersion,
      reportConfig.skipMinorVersions,
      isVersionAheadOfLatest
    );

    const incrementMajor = shouldIncrementMajor(
      majorVersion,
      currentMajorVersion,
      reportConfig.skipMajorVersions,
      isVersionAheadOfLatest
    );

    if (incrementMajor) {
      majorVersionsBehind++;
    } else if (incrementMinor) {
      minorVersionsBehind++;
    } else if (incrementPatch) {
      patchVersionsBehind++;
    }
    if (incrementMajor || incrementMinor || incrementPatch) {
      currentVersion = version;
    }
  });

  const versionsBehind =
    minorVersionsBehind + patchVersionsBehind + majorVersionsBehind;

  return {
    packageName,
    versionsBehind,
    minorVersionsBehind,
    patchVersionsBehind,
    majorVersionsBehind,
    currentVersion: originalCurrentVersion,
    latestVersion,
  };
}

function shouldIncrementMajor(
  majorVersion: string,
  currentMajorVersion: string,
  skipMajorVersions: boolean,
  isVersionAheadOfLatest: boolean
) {
  const hasBiggerMajorVersion =
    compareVersions(majorVersion, currentMajorVersion) === 1;
  return hasBiggerMajorVersion && !skipMajorVersions && !isVersionAheadOfLatest;
}

function shouldIncrementMinor(
  minorVersion: string,
  currentMinorVersion: string,
  skipMinorVersions: boolean,
  isVersionAheadOfLatest: boolean
) {
  const hasBiggerMinorVersion =
    compareVersions(minorVersion, currentMinorVersion) === 1;
  return hasBiggerMinorVersion && !skipMinorVersions && !isVersionAheadOfLatest;
}

function shouldIncrementPatch(
  patchVersion: string,
  currentPatchVersion: string,
  skipPatchVersions: boolean,
  isVersionAheadOfLatest: boolean
) {
  const hasBiggerPatchVersion =
    compareVersions(patchVersion, currentPatchVersion) === 1;
  return hasBiggerPatchVersion && !skipPatchVersions && !isVersionAheadOfLatest;
}

function isUnstableVersion(version: string): boolean {
  const unstableKeywords = [
    "alpha",
    "beta",
    "rc",
    "next",
    "dev",
    "canary",
    "insiders",
    "preview",
    "exp",
  ];
  return (
    unstableKeywords.filter((keyword) => version.includes(keyword)).length > 0
  );
}
