import { PackageVersionReport } from "./types/packageVersionReport.type";

export default function shouldExit(
  report: PackageVersionReport[],
  versionsBehindThreshold: number
) {
  const totalVersionsBehind = report.reduce(
    (total, packageReport) => packageReport.versionsBehind + total,
    0
  );

  const isTooManyVersionsBehind =
    versionsBehindThreshold == 0 ||
    (totalVersionsBehind > versionsBehindThreshold &&
      versionsBehindThreshold > 0);

  return report.length > 0 && isTooManyVersionsBehind;
}
