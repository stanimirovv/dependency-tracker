import { Report } from "./types/report";

export default function shouldExit(
  report: Report,
  versionsBehindThreshold: number,
  decayThreshold: number
) {
  const totalVersionsBehind = report.packageReports.reduce(
    (total, packageReport) => packageReport.versionsBehind + total,
    0
  );

  const isTooManyVersionsBehind =
    versionsBehindThreshold == 0 ||
    (totalVersionsBehind > versionsBehindThreshold &&
      versionsBehindThreshold > 0);

  return (
    report.packageReports.length > 0 &&
    (isTooManyVersionsBehind ||
      (report.decayScore > decayThreshold && decayThreshold > 0))
  );
}
