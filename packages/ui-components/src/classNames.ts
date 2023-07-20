export function classNames(
  ...classes: Array<string | undefined | null | boolean>
): string | undefined {
  return classes.filter(Boolean).join(" ") || undefined;
}
