import { toBanglaDigits } from "./digits.js";
import { parseNumeric, type NumericInput } from "./parse.js";

export interface FormatLakhOptions {
  /** Output digits. Default "en". */
  digits?: "en" | "bn";
  /** Fix the number of fraction digits (rounded half up). Default keeps them as written. */
  fractionDigits?: number;
}

function groupIndian(intText: string): string {
  if (intText.length <= 3) return intText;
  const last3 = intText.slice(-3);
  const head = intText.slice(0, -3);
  return `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
}

/**
 * Group a number the South Asian way: 12,34,56,789.
 *
 * @example formatLakh(1234567) // "12,34,567"
 * @example formatLakh(1234567.5, { digits: "bn", fractionDigits: 2 }) // "১২,৩৪,৫৬৭.৫০"
 */
export function formatLakh(input: NumericInput, opts: FormatLakhOptions = {}): string {
  let { negative, integer, fraction } = parseNumeric(input);
  const fd = opts.fractionDigits;
  if (fd !== undefined) {
    if (!Number.isInteger(fd) || fd < 0 || fd > 20) {
      throw new RangeError("fractionDigits must be an integer from 0 to 20");
    }
    const padded = fraction.padEnd(fd + 1, "0");
    let scaled = BigInt(integer.toString() + padded.slice(0, fd));
    if (Number(padded[fd]) >= 5) scaled += 1n;
    const s = scaled.toString().padStart(fd + 1, "0");
    integer = BigInt(fd === 0 ? s : s.slice(0, -fd));
    fraction = fd === 0 ? "" : s.slice(-fd);
    if (integer === 0n && /^0*$/.test(fraction)) negative = false;
  }
  let out = groupIndian(integer.toString());
  if (fraction) out += `.${fraction}`;
  if (negative) out = `-${out}`;
  return opts.digits === "bn" ? toBanglaDigits(out) : out;
}
