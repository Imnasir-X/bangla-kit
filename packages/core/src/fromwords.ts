import { WORDS_0_99 } from "./data.js";
import { WORD_VARIANTS } from "./variants.js";

const BASE = new Map<string, number>();
WORDS_0_99.forEach((w, i) => BASE.set(w, i));
for (const [w, v] of Object.entries(WORD_VARIANTS)) BASE.set(w, v);

const HUNDRED_WORDS = new Set(["শত", "শো", "শ", "শতো"]);
const SCALES: Record<string, bigint> = {
  হাজার: 1_000n,
  লক্ষ: 100_000n,
  লাখ: 100_000n,
  কোটি: 10_000_000n,
};
const NEGATIVE = new Set(["ঋণাত্মক", "মাইনাস", "বিয়োগ"]);
const POINT = new Set(["দশমিক", "পয়েন্ট"]);
const FILLERS = new Set(["মাত্র", "টাকা"]);

/** Split "একশো" / "দুইশত" style compounds into number word + hundred word. */
function splitToken(token: string): string[] {
  if (BASE.has(token) || HUNDRED_WORDS.has(token) || token in SCALES) return [token];
  for (const h of ["শত", "শতো", "শো", "শ"]) {
    if (token.endsWith(h)) {
      const head = token.slice(0, -h.length);
      if (BASE.has(head)) return [head, h];
    }
  }
  return [token];
}

function wordsToInteger(tokens: string[]): bigint {
  if (tokens.length === 0) throw new SyntaxError("No number words found");
  // Highest scale first: everything before the last কোটি multiplies কোটি.
  const croreAt = tokens.lastIndexOf("কোটি");
  if (croreAt >= 0) {
    const head = tokens.slice(0, croreAt);
    const tail = tokens.slice(croreAt + 1);
    const crores = head.length ? wordsToInteger(head) : 1n;
    return crores * 10_000_000n + (tail.length ? wordsToInteger(tail) : 0n);
  }
  let total = 0n;
  let current: bigint | null = null;
  let lastScale = Infinity;
  for (const t of tokens) {
    const base = BASE.get(t);
    if (base !== undefined) {
      if (current !== null) throw new SyntaxError(`Unexpected number word "${t}"`);
      current = BigInt(base);
      continue;
    }
    if (HUNDRED_WORDS.has(t)) {
      if (lastScale <= 100) throw new SyntaxError(`Unexpected "${t}"`);
      total += (current ?? 1n) * 100n;
      current = null;
      lastScale = 100;
      continue;
    }
    const scale = SCALES[t];
    if (scale !== undefined) {
      if (Number(scale) >= lastScale) throw new SyntaxError(`"${t}" is out of order`);
      total += (current ?? 1n) * scale;
      current = null;
      lastScale = Number(scale);
      continue;
    }
    throw new SyntaxError(`Unknown word "${t}"`);
  }
  return total + (current ?? 0n);
}

export interface FromWordsResult {
  /** Exact decimal string, e.g. "1250000" or "-12.05". */
  value: string;
  /** The same value as a number, when it fits exactly; otherwise undefined. */
  number: number | undefined;
}

/**
 * Read Bangla number words back into a number. Accepts the canonical spellings plus common
 * variants (আঠাশ, বায়ান্ন, লাখ, একশো, দুইশত), negatives, দশমিক decimals, and ignores টাকা and মাত্র.
 *
 * @example fromWords("বারো লক্ষ পঞ্চাশ হাজার").value // "1250000"
 * @example fromWords("একশো এক").number // 101
 */
export function fromWords(text: string): FromWordsResult {
  if (typeof text !== "string") throw new TypeError("fromWords expects a string");
  const raw = text
    .normalize("NFC")
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
    .replace(/[,।]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !FILLERS.has(t))
    .flatMap(splitToken);
  let negative = false;
  if (raw[0] && NEGATIVE.has(raw[0])) {
    negative = true;
    raw.shift();
  }
  const pointAt = raw.findIndex((t) => POINT.has(t));
  const intTokens = pointAt >= 0 ? raw.slice(0, pointAt) : raw;
  const fracTokens = pointAt >= 0 ? raw.slice(pointAt + 1) : [];
  if (pointAt >= 0 && fracTokens.length === 0) throw new SyntaxError("Missing digits after দশমিক");
  const integer = wordsToInteger(intTokens);
  const fraction = fracTokens
    .map((t) => {
      const d = BASE.get(t);
      if (d === undefined || d > 9)
        throw new SyntaxError(`Expected a single digit after দশমিক, got "${t}"`);
      return String(d);
    })
    .join("");
  const isZero = integer === 0n && /^0*$/.test(fraction);
  const value = `${negative && !isZero ? "-" : ""}${integer}${fraction ? `.${fraction}` : ""}`;
  const asNumber = Number(value);
  const exact =
    fraction === ""
      ? integer <= BigInt(Number.MAX_SAFE_INTEGER)
      : value.replace(/0+$/, "").replace(/\.$/, "") === String(asNumber);
  return { value, number: exact ? asNumber : undefined };
}
