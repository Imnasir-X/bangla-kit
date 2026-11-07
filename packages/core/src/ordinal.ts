import { toBanglaDigits } from "./digits.js";
import { toWords } from "./words.js";

const ORDINALS_1_20 = [
  "প্রথম",
  "দ্বিতীয়",
  "তৃতীয়",
  "চতুর্থ",
  "পঞ্চম",
  "ষষ্ঠ",
  "সপ্তম",
  "অষ্টম",
  "নবম",
  "দশম",
  "একাদশ",
  "দ্বাদশ",
  "ত্রয়োদশ",
  "চতুর্দশ",
  "পঞ্চদশ",
  "ষোড়শ",
  "সপ্তদশ",
  "অষ্টাদশ",
  "ঊনবিংশ",
  "বিংশ",
];
const SHORT_SUFFIX = ["ম", "য়", "য়", "র্থ", "ম", "ষ্ঠ", "ম", "ম", "ম", "ম"];

export interface ToOrdinalOptions {
  /** "long": প্রথম, একুশতম. "short": ১ম, ২১তম. Default "long". */
  style?: "long" | "short";
}

function checkPositive(n: number): void {
  if (!Number.isSafeInteger(n) || n < 1)
    throw new RangeError("Ordinal needs a positive whole number");
}

/**
 * Ordinal numbers. 1 to 20 use the traditional forms (প্রথম ... বিংশ); after that, words + তম.
 *
 * @example toOrdinal(3) // "তৃতীয়"
 * @example toOrdinal(21) // "একুশতম"
 * @example toOrdinal(4, { style: "short" }) // "৪র্থ"
 */
export function toOrdinal(n: number, opts: ToOrdinalOptions = {}): string {
  checkPositive(n);
  if ((opts.style ?? "long") === "short") {
    return toBanglaDigits(n) + (n <= 10 ? (SHORT_SUFFIX[n - 1] as string) : "তম");
  }
  if (n <= 20) return ORDINALS_1_20[n - 1] as string;
  return `${toWords(n)}তম`;
}

/**
 * Day of the month as written in Bangla dates: ১লা, ২রা, ৩রা, ৪ঠা, ৫ই ... ১৮ই, ১৯শে ... ৩১শে.
 *
 * @example toDateOrdinal(21) // "২১শে"
 */
export function toDateOrdinal(day: number): string {
  checkPositive(day);
  if (day > 32) throw new RangeError("Day must be 1 to 32");
  const suffix = day === 1 ? "লা" : day <= 3 ? "রা" : day === 4 ? "ঠা" : day <= 18 ? "ই" : "শে";
  return toBanglaDigits(day) + suffix;
}
