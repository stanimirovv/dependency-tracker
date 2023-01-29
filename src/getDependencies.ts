import getDependenciesFromLockFile from "./getDependenciesFromLockFile";

export default function getDependencies(packageLockPath: string) {
  const dependenciesToCheck = JSON.parse(process.env.PACKAGES_TO_TRACK || "[]");

  const dependenciesToSkip = JSON.parse(process.env.PACKAGES_TO_SKIP || "[]");
  const dependencies = getDependenciesFromLockFile(
    packageLockPath,
    Boolean(process.env.ADD_DEV_DEPENDENCIES)
  );

  const filteredDependencies: Record<string, string> = {};
  Object.keys(dependencies).forEach((dependency) => {
    const mustSkipBecauseNotInToCheckList =
      dependenciesToCheck.length > 0 &&
      dependenciesToCheck.indexOf(dependency) == -1;

    const mustSkip = dependenciesToSkip.indexOf(dependency) > -1;

    if (mustSkip || mustSkipBecauseNotInToCheckList) {
      return;
    }
    filteredDependencies[dependency] = dependencies[dependency];
  });
  return filteredDependencies;
}
