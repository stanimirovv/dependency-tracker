import { exec as execCb } from "child_process";
import util from "util";
const exec = util.promisify(execCb);

describe("test dependency tracker", () => {
  it("should produce a report with the missing dependencies", async () => {
    const { stdout } = await exec(
      "node ./dist/index.js package-lock.example.json"
    );

    expect(stdout).not.toBeNull();
    const parsedReport = JSON.parse(stdout);
    expect(parsedReport.packageReports.length > 0).toBe(true);

    const firstReport = parsedReport.packageReports[0];
    expect(firstReport.packageName).toBe("reflect-metadata");
    expect(firstReport.latestVersion > firstReport.currentVersion).toBe(true);
    expect(firstReport.versionsBehind > 0).toBe(true);

    const lastExitStatusCmdOutput = await exec("echo $?");
    expect(parseInt(lastExitStatusCmdOutput.stdout)).toEqual(0);
  });

  it("should support exit status for CI pipelines", async () => {
    expect.assertions(3);
    try {
      await exec(
        "VERSIONS_BEHIND_THRESHOLD=0 node ./dist/index.js package-lock.example.json"
      );
    } catch (e: any) {
      expect(e).toBeDefined();
      expect(e.code).toBeDefined();
      expect(e.code).toEqual(1);
    }
  });

  it("should support versions behind threshold", async () => {
    const { stdout } = await exec(
      "VERSIONS_BEHIND_THRESHOLD=100000 node ./dist/index.js package-lock.example.json"
    );
    expect(stdout).not.toBeNull();
    const parsedReport = JSON.parse(stdout);
    expect(parsedReport.packageReports.length > 0).toBe(true);
  });

  it("should support skipping packages", async () => {
    const outputWithoutSkipPackages = await exec(
      "node ./dist/index.js package-lock.example.json"
    );

    const outputWithSkipPackages = await exec(
      `PACKAGES_TO_SKIP='["typescript"]' node ./dist/index.js package-lock.example.json`
    );

    const parsedReportWithoutSkip = JSON.parse(
      outputWithoutSkipPackages.stdout
    );
    const parsedReportWithSkip = JSON.parse(outputWithSkipPackages.stdout);
    expect(parsedReportWithoutSkip.packageReports.length).toEqual(
      parsedReportWithSkip.packageReports.length + 1
    );
  });

  it("print decay score", async () => {
    const { stdout } = await exec(
      "ONLY_DECAY=1 node ./dist/index.js package-lock.example.json"
    );
    expect(stdout).not.toBeNull();
    const decayScore = parseInt(stdout);
    expect(decayScore > 0).toBe(true);
  });

  it("should support decayScore threshold", async () => {
    expect.assertions(3);
    try {
      const { stdout } = await exec(
        "DECAY_THRESHOLD=10 node ./dist/index.js package-lock.example.json"
      );
    } catch (e: any) {
      expect(e).toBeDefined();
      expect(e.code).toBeDefined();
      expect(e.code).toEqual(1);
    }
  });

  it("should support versions behind threshold", async () => {
    const { stdout } = await exec(
      "DECAY_THRESHOLD=10000000 node ./dist/index.js package-lock.example.json"
    );
    expect(stdout).not.toBeNull();
    const parsedReport = JSON.parse(stdout);
    expect(parsedReport.packageReports.length > 0).toBe(true);
  });

  it("should support development dependencies and have default package-lock path", async () => {
    const { stdout } = await exec(
      "ADD_DEV_DEPENDENCIES=1 DECAY_THRESHOLD=10000000 node ./dist/index.js"
    );
    expect(stdout).not.toBeNull();
    const parsedReport = JSON.parse(stdout);
    expect(parsedReport.decayScore).not.toBeNull();
  });
});
