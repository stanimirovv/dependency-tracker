import { PackageVersionReport } from "./types/packageVersionReport.type";

export default function calculateDecayScore(
  reports: PackageVersionReport[]
): number {
  let decayScore = 0;
  reports.forEach((report) => {
    decayScore += 1000 * report.majorVersionsBehind;
    decayScore += 100 * report.minorVersionsBehind;
    decayScore += 1 * report.patchVersionsBehind;
  });

  return decayScore;
}
