import { PackageVersionReport } from "./packageVersionReport.type";

export type Report = {
  decayScore: number;
  packageReports: PackageVersionReport[];
};
