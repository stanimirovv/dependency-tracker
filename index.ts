#!/usr/bin/env node
import calculateDecayScore from "./src/calculateDecayScore";
import generateNpmViewPromises from "./src/generateNpmViewPromises";
import generatePackageReport from "./src/generatePackageReport";
import getDependenciesFromLockFile from "./src/getDependenciesFromLockFile";
import shouldExit from "./src/shouldExit";
import { PackageVersionReport } from "./src/types/packageVersionReport.type";
import { Report } from "./src/types/report";
import { ReportConfig } from "./src/types/reportConfig.type";

// Parse the package lock file
const packageLockPath = process.argv[2];
if (!packageLockPath) {
  console.error("Please provide a path to the package-lock.json file");
  process.exit();
}

const dependencies = getDependenciesFromLockFile(packageLockPath);
const packagesToSkip = JSON.parse(process.env.PACKAGES_TO_SKIP || "[]");

const packagesWithVersionsPromises = generateNpmViewPromises(
  dependencies,
  packagesToSkip
);
const reportConfig: ReportConfig = {
  skipMajorVersions: Boolean(process.env.SKIP_MAJOR_VERSIONS),
  skipMinorVersions: Boolean(process.env.SKIP_MINOR_VERSIONS),
  skipPatchVersions: Boolean(process.env.SKIP_PATCH_VERSIONS),
  showDevVersions: Boolean(process.env.SHOW_DEV_VERSIONS),
};

Promise.all(packagesWithVersionsPromises).then((values) => {
  const packageReports: PackageVersionReport[] = values.map((packageReport) =>
    generatePackageReport(packageReport, reportConfig)
  );

  const decayScore = calculateDecayScore(packageReports);
  const report: Report = { decayScore, packageReports };
  if (process.env.ONLY_DECAY) {
    console.log(decayScore);
  } else {
    console.log(JSON.stringify(report));
  }

  const versionsBehindThreshold = parseInt(
    process.env.VERSIONS_BEHIND_THRESHOLD || "-1"
  );

  const decayThreshold = parseInt(process.env.DECAY_THRESHOLD || "-1");
  if (shouldExit(report, versionsBehindThreshold, decayThreshold)) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});
