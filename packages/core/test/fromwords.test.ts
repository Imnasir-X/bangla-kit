import { describe, expect, it } from "vitest";
import { fromWords, toWords, WORD_VARIANTS, WORDS_0_99 } from "../src/index.js";

describe("fromWords", () => {
  it("round-trips every integer from 0 to 20,000", () => {
    for (let i = 0; i <= 20_000; i++) expect(fromWords(toWords(i)).number, String(i)).toBe(i);
  });
  it("round-trips large and sampled values, both hundred styles and লাখ", () => {
    const samples = [
      99_999n,
      100_000n,
      1_250_000n,
      9_999_999n,
      10_000_000n,
      123_456_789n,
      10n ** 14n,
      98765432109876543210n,
    ];
    for (let i = 0n; i < 2000n; i++) samples.push((i * 7_919_191n) ** 2n % 10n ** 13n);
    for (const n of samples) {
      expect(fromWords(toWords(n)).value).toBe(n.toString());
      expect(fromWords(toWords(n, { hundred: "colloquial", lakh: "লাখ" })).value).toBe(
        n.toString(),
      );
    }
  });
  it("round-trips decimals and negatives", () => {
    for (const s of ["-5", "12.05", "0.5", "-1234.001", "0.0"]) {
      expect(fromWords(toWords(s)).value).toBe(s === "0.0" ? "0.0" : s);
    }
    expect(fromWords("ঋণাত্মক শূন্য").value).toBe("0");
  });
  it("accepts every listed variant spelling", () => {
    for (const [w, v] of Object.entries(WORD_VARIANTS)) expect(fromWords(w).number, w).toBe(v);
    expect(Object.keys(WORD_VARIANTS).some((w) => WORDS_0_99.includes(w))).toBe(false);
  });
  it.each([
    ["একশো", 100],
    ["দুইশত", 200],
    ["তিনশ পঁচিশ", 325],
    ["শত", 100],
    ["হাজার", 1000],
    ["বায়ান্ন হাজার", 52000],
    ["পাঁচ লাখ", 500000],
    ["এক কোটি টাকা মাত্র", 10_000_000],
    ["বারো লক্ষ, পঞ্চাশ হাজার।", 1_250_000],
    ["  সাত  ", 7],
    ["মাইনাস তিন", -3],
    ["এক পয়েন্ট পাঁচ", 1.5],
    ["কোটি", 10_000_000],
  ])("%s", (w, n) => expect(fromWords(w).number).toBe(n));
  it("gives value but no number when it can't be exact", () => {
    const r = fromWords(toWords(10n ** 20n));
    expect(r.value).toBe("100000000000000000000");
    expect(r.number).toBeUndefined();
  });
  it.each([
    "",
    "আপেল",
    "এক দুই",
    "হাজার লক্ষ",
    "শত শত",
    "এক দশমিক",
    "এক দশমিক বারো",
    "পাঁচ শত হাজার শত",
  ])("rejects %j", (bad) => expect(() => fromWords(bad)).toThrow(SyntaxError));
  it("rejects non-strings", () =>
    expect(() => fromWords(5 as unknown as string)).toThrow(TypeError));
});
