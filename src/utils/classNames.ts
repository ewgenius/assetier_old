export function classNames(
  ...classes: (string | null | undefined | boolean)[]
) {
  return classes.filter(Boolean).join(" ");
}
