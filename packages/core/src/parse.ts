import { toEnglishDigits } from "./digits.js";

export type NumericInput = number | bigint | string;

export interface ParsedNumber {
  negative: boolean;
  integer: bigint;
  /** Fraction digits exactly as written, without the dot. Empty when none. */
  fraction: string;
}

const NUMERIC = /^([+-])?(\d+)(?:\.(\d+))?$/;

/**
 * Parse a number, bigint or numeric string (ASCII or Bangla digits, commas allowed)
 * into an exact sign, integer part and fraction digits. Throws on anything else.
 */
export function parseNumeric(input: NumericInput): ParsedNumber {
  if (typeof input === "bigint") {
    return { negative: input < 0n, integer: input < 0n ? -input : input, fraction: "" };
  }
  let text: string;
  if (typeof input === "number") {
    if (!Number.isFinite(input)) throw new RangeError("Number must be finite");
    if (Number.isInteger(input)) {
      if (!Number.isSafeInteger(input)) {
        throw new RangeError("Integer is beyond Number.MAX_SAFE_INTEGER, pass a bigint or string");
      }
      text = String(input);
    } else {
      text = String(input);
      if (/e/i.test(text)) {
        throw new RangeError("Number is too small or large to read exactly, pass a string");
      }
    }
    if (Object.is(input, -0)) text = "0";
  } else if (typeof input === "string") {
    text = toEnglishDigits(input.trim()).replace(/,/g, "");
  } else {
    throw new TypeError("Expected a number, bigint or numeric string");
  }
  const m = NUMERIC.exec(text);
  if (!m) throw new TypeError(`Not a valid number: "${String(input)}"`);
  const integer = BigInt(m[2] as string);
  const fraction = m[3] ?? "";
  const isZero = integer === 0n && /^0*$/.test(fraction);
  return { negative: m[1] === "-" && !isZero, integer, fraction };
}
