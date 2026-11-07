import { BN_DIGITS } from "./data.js";

const BN_TO_EN: Record<string, string> = Object.fromEntries(
  BN_DIGITS.map((d, i) => [d, String(i)]),
);

/** Convert ASCII digits 0-9 to Bangla digits. Other characters pass through. */
export function toBanglaDigits(input: string | number | bigint): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] as string);
}

/** Convert Bangla digits ০-৯ to ASCII digits. Other characters pass through. */
export function toEnglishDigits(input: string): string {
  if (typeof input !== "string") throw new TypeError("toEnglishDigits expects a string");
  return input.replace(/[০-৯]/g, (d) => BN_TO_EN[d] as string);
}

/** Convert digits in either direction. */
export function convertDigits(input: string | number | bigint, to: "bn" | "en"): string {
  if (to === "bn") return toBanglaDigits(input);
  if (to === "en") return toEnglishDigits(String(input));
  throw new RangeError(`Unknown digit target "${String(to)}", use "bn" or "en"`);
}
