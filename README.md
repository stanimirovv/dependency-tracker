# Dependency tracker

A light weight, configurable script that generates a score depending on how many versions behind the project is from its dependencies.

This is not a replacement for `npm outdated` 

The script has 2 primary use cases:
- Exploration purposes to understand how many versions behind the project is from its dependencies.
- Use it as a guard in CI/CD pipelines to fail if the project is not up to date with its dependencies.

## Features

Print a JSON report with a dacay score and the packages and their versions behind.

Use standard bash exit code:
If the exit code is 0, the project is up to date with its dependencies.
If the exit code is 1, the project is not up to date with its dependencies.

### Configuration
Use the envvar `VERSIONS_BEHIND_THRESHOLD=<max versions behind int>` to enable the non 0 exit statuses.
Set `VERSIONS_BEHIND_THRESHOLD=0` to fail on any version behind.
You can also skip major/minor/patch versions by setting the envvars `SKIP_MAJOR_VERSIONS=1` and `SKIP_MINOR_VERSIONS=1` and `SKIP_PATCH_VERSIONS=1`. 
Skips dev/alpha/beta/rc versions.

### Decay score
The script generates an overall `decay score` for the project.
The dependency score is the sum of all dependency versions behind.
1000 for major versions behind, 100 for minor and 1 for patch.
Patch is considered less important as they are released significantly more often than major/minor versions.

If for readability or scripting purposes you want the script to return only the decay score, you can use the envvar `ONLY_DECAY=1`.

You can also use `DECAY_THRESHOLD=<max decay score int>` to set a threshold for the decay score and have the script return a non 0 exit status if the decay score is above the threshold.

By default only the prd dependencies are checked.
You can also check dev dependencies by setting the envvar `CHECK_DEV_DEPENDENCIES=1`.

You can use `PACKAGES_TO_SKIP='["package1", "package2"]'` to skip specific packages.
The alternative is to use `PACKAGES_TO_TRACK='["package1", "package2"]'` to only track specific packages.

## Installation
```bash
npm i @stanimirovv/dependency-tracker
```

## Usage

Simple report:
```bash
npx @stanimirovv/dependency-tracker /path/to/package-lock.json
```
Note: default path is `./package-lock.json`

Set status code to 1 if versions behind is more than 0:
```bash
VERSIONS_BEHIND_THRESHOLD=0 npx @stanimirovv/dependency-tracker /path/to/package-lock.json
```

Skip patch versions:
```bash
SKIP_PATCH_VERSIONS=1 npx @stanimirovv/dependency-tracker /path/to/package-lock.json
```

Skip versions behind on typescript
```bash
PACKAGES_TO_SKIP='["typescript"]' npx @stanimirovv/dependency-tracker /path/to/package-lock.json
```

Have a max decay score of 10000 and skip minor versions:
```bash
DECAY_THRESHOLD=10000 SKIP_MINOR_VERSIONS=1 npx @stanimirovv/dependency-tracker /path/to/package-lock.json
```

## Example report
```json
{"decayScore":1,"packageReports":[{"packageName":"reflect-metadata","versionsBehind":1,"minorVersionsBehind":0,"patchVersionsBehind":1,"majorVersionsBehind":0,"currentVersion":"0.1.12","latestVersion":"0.1.13"},{"packageName":"@types/bcrypt","versionsBehind":0,"minorVersionsBehind":0,"patchVersionsBehind":0,"majorVersionsBehind":0,"currentVersion":"^5.0.0","latestVersion":"5.0.0"}]}
```

 ## Work Log
 2022/01/29 - generatePackageReport must be refactored and simplified. We need more tests for it.