export function cn(...args: Array<string | undefined | null | false>) {
  return args
    .filter((x): x is string => typeof x === "string")
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");
}
