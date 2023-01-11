export function shouldSkipVersion(version: string): boolean {
  return (
    version.includes("-dev") ||
    version.includes("-alpha") ||
    version.includes("-rc") ||
    version.includes("-beta")
  );
}
