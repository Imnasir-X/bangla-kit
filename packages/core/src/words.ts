import { WORDS_0_99 } from "./data.js";
import { parseNumeric, type NumericInput } from "./parse.js";

export interface ToWordsOptions {
  /** "formal" uses শত (cheque style, default). "colloquial" uses শো, e.g. একশো. */
  hundred?: "formal" | "colloquial";
  /** Word for 100,000. Default "লক্ষ"; "লাখ" is common in speech. */
  lakh?: "লক্ষ" | "লাখ";
  /** Word placed before negative numbers. Default "ঋণাত্মক". */
  negativeWord?: string;
  /** Word for the decimal point. Default "দশমিক". */
  pointWord?: string;
}

const CRORE = 10_000_000n;
const LAKH = 100_000n;
const THOUSAND = 1_000n;
const HUNDRED = 100n;

function under100(n: bigint): string {
  return WORDS_0_99[Number(n)] as string;
}

function hundredWord(h: bigint, style: "formal" | "colloquial"): string {
  const base = under100(h);
  return style === "formal" ? `${base} শত` : `${base}শো`;
}

/** Words for a non-negative integer, Bangladeshi system (হাজার, লক্ষ, কোটি). */
export function integerToWords(n: bigint, opts: ToWordsOptions = {}): string {
  if (n < 0n) throw new RangeError("integerToWords expects a non-negative integer");
  if (n === 0n) return WORDS_0_99[0] as string;
  const style = opts.hundred ?? "formal";
  const lakhWord = opts.lakh ?? "লক্ষ";
  const parts: string[] = [];

  const crore = n / CRORE;
  let rest = n % CRORE;
  if (crore > 0n) parts.push(`${integerToWords(crore, opts)} কোটি`);

  const lakh = rest / LAKH;
  rest %= LAKH;
  if (lakh > 0n) parts.push(`${under100(lakh)} ${lakhWord}`);

  const thousand = rest / THOUSAND;
  rest %= THOUSAND;
  if (thousand > 0n) parts.push(`${under100(thousand)} হাজার`);

  const hundred = rest / HUNDRED;
  rest %= HUNDRED;
  if (hundred > 0n) parts.push(hundredWord(hundred, style));

  if (rest > 0n) parts.push(under100(rest));
  return parts.join(" ");
}

function fractionToWords(fraction: string): string {
  return [...fraction].map((d) => WORDS_0_99[Number(d)] as string).join(" ");
}

/**
 * Convert a number to Bangla words.
 *
 * @example toWords(1250000) // "বারো লক্ষ পঞ্চাশ হাজার"
 * @example toWords("12.05") // "বারো দশমিক শূন্য পাঁচ"
 */
export function toWords(input: NumericInput, opts: ToWordsOptions = {}): string {
  const { negative, integer, fraction } = parseNumeric(input);
  let out = integerToWords(integer, opts);
  if (fraction.length > 0) out += ` ${opts.pointWord ?? "দশমিক"} ${fractionToWords(fraction)}`;
  if (negative) out = `${opts.negativeWord ?? "ঋণাত্মক"} ${out}`;
  return out;
}

export interface ToTakaOptions extends Omit<ToWordsOptions, "pointWord"> {
  /** Append মাত্র ("only"), as on cheques. Default true. */
  only?: boolean;
}

/**
 * Cheque-style taka text. Poisha are rounded half up to two places.
 *
 * @example toTaka(1250.5) // "এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র"
 */
export function toTaka(input: NumericInput, opts: ToTakaOptions = {}): string {
  const { negative, integer, fraction } = parseNumeric(input);
  let taka = integer;
  let poisha = BigInt((fraction + "00").slice(0, 2));
  if (fraction.length > 2 && Number(fraction[2]) >= 5) poisha += 1n;
  if (poisha === 100n) {
    taka += 1n;
    poisha = 0n;
  }
  const parts: string[] = [];
  if (taka > 0n || poisha === 0n) parts.push(`${integerToWords(taka, opts)} টাকা`);
  if (poisha > 0n) parts.push(`${integerToWords(poisha, opts)} পয়সা`);
  let out = parts.join(" ");
  if (negative && (taka > 0n || poisha > 0n)) out = `${opts.negativeWord ?? "ঋণাত্মক"} ${out}`;
  if (opts.only ?? true) out += " মাত্র";
  return out;
}
