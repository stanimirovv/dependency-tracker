# Dependency tracker

A light weight, configurable, and zero dependency script that counts how many versions behind the project is from its dependencies.

This is not a replacement for `npm outdated` 
It offers similar functionality from a different angle. The goal is to be able to use this script as a validator for CI/CD pipelines.
Main difference is that this script will not print the latest version of each dependency, but rather how many versions behind the project is for each dependency.
Also unlike npm outdated this script is configurable to have a tolerance for how many versions behind the project is allowed to be and can ignore major/minor/patch versions when checking for versions behind.
You can even skip specific packages, see the USAGE section.

The script will check the following:
- How many versions behind the project is for each dependency
- How many major, minor and patch versions it is behind for each dependency
- Which is the latest and greatest version of each dependency

The script will print a report on STDOUT in json format containing the information above.

## Features

The script can be used as a validator for CI/CD pipelines by checking the exit code of the script.
If the exit code is 0, the project is up to date with its dependencies.
If the exit code is 1, the project is not up to date with its dependencies.
Use the envvar `VERSIONS_BEHIND_THRESHOLD=<max versions behind int>` to enable the non 0 exit statuses.
Set `VERSIONS_BEHIND_THRESHOLD=0` to fail on any version behind.
You can also skip major/minor/patch versions by setting the envvars `SKIP_MAJOR_VERSIONS=1` and `SKIP_MINOR_VERSIONS=1` and `SKIP_PATCH_VERSIONS=1`. 
Skips dev/alpha/beta/rc versions.

The script generates an overall `decay score` for the project.
The dependency score is the sum of all dependency versions behind.
1000 for major versions behind, 100 for minor and 1 for patch.
Patch is considered less important as they are released significantly more often than major/minor versions.

If for readability or scripting purposes you want the script to return only the decay score, you can use the envvar `ONLY_DECAY=1`.
You can also use `DECAY_THRESHOLD=<max decay score int>` to set a threshold for the decay score and have the script return a non 0 exit status if the decay score is above the threshold.

By default only the prd dependencies are checked.
You can also check dev dependencies by setting the envvar `CHECK_DEV_DEPENDENCIES=1`.

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
