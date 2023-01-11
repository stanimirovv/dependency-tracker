export type PackageVersionReport = {
  packageName: string;
  versionsBehind: number;
  minorVersionsBehind: number;
  patchVersionsBehind: number;
  majorVersionsBehind: number;
  latestVersion: string;
  currentVersion: string;
};
