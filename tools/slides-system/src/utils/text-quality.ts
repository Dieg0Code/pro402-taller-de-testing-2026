export const suspiciousMojibakePatterns = [
  "\u00C3",
  "\u00C2",
  "\u00E2\u20AC",
  "\u00E2\u20AC\u201D",
  "\u00E2\u20AC\u201C",
  "\u00E2\u20AC\u0153",
  "\u00E2\u20AC\u009D",
  "\u00E2\u20AC\u2122",
];

export function findMojibakeMatches(input: string): string[] {
  const text = String(input ?? "");
  const matches = suspiciousMojibakePatterns.filter((pattern) => text.includes(pattern));
  return [...new Set(matches)];
}

export function containsMojibake(input: string): boolean {
  return findMojibakeMatches(input).length > 0;
}
