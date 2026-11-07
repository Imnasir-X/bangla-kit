import { describe, expect, it } from "vitest";
import { toWords, toTaka, integerToWords, WORDS_0_99 } from "../src/index.js";
import golden from "./fixtures/words-0-99.json";

describe("WORDS_0_99 golden list", () => {
  it("has exactly 100 entries that match the reviewed fixture", () => {
    expect(WORDS_0_99).toHaveLength(100);
    for (let i = 0; i < 100; i++) {
      expect(toWords(i), `number ${i}`).toBe((golden.words as Record<string, string>)[String(i)]);
    }
  });
  it("has no duplicates and no stray whitespace", () => {
    expect(new Set(WORDS_0_99).size).toBe(100);
    for (const w of WORDS_0_99) expect(w).toBe(w.trim().normalize("NFC"));
  });
  it.each([
    [11, "এগারো"],
    [19, "উনিশ"],
    [29, "ঊনত্রিশ"],
    [42, "বিয়াল্লিশ"],
    [53, "তিপ্পান্ন"],
    [69, "ঊনসত্তর"],
    [79, "ঊনআশি"],
    [88, "অষ্টাশি"],
    [89, "ঊননব্বই"],
    [99, "নিরানব্বই"],
  ])("spot check %i", (n, w) => expect(toWords(n)).toBe(w));
});

describe("toWords", () => {
  it.each<[number | string | bigint, string]>([
    [0, "শূন্য"],
    [100, "এক শত"],
    [101, "এক শত এক"],
    [999, "নয় শত নিরানব্বই"],
    [1000, "এক হাজার"],
    [1001, "এক হাজার এক"],
    [9999, "নয় হাজার নয় শত নিরানব্বই"],
    [100000, "এক লক্ষ"],
    [123456, "এক লক্ষ তেইশ হাজার চার শত ছাপ্পান্ন"],
    [1250000, "বারো লক্ষ পঞ্চাশ হাজার"],
    [10000000, "এক কোটি"],
    [10000001, "এক কোটি এক"],
    [1000000000, "এক শত কোটি"],
    [123456789, "বারো কোটি চৌত্রিশ লক্ষ ছাপ্পান্ন হাজার সাত শত ঊননব্বই"],
    [10n ** 14n, "এক কোটি কোটি"],
    ["1,25,000", "এক লক্ষ পঁচিশ হাজার"],
    ["১২৫০", "এক হাজার দুই শত পঞ্চাশ"],
    [-5, "ঋণাত্মক পাঁচ"],
    [-0, "শূন্য"],
    ["-0.0", "শূন্য দশমিক শূন্য"],
    [12.05, "বারো দশমিক শূন্য পাঁচ"],
    ["0.5", "শূন্য দশমিক পাঁচ"],
    ["+7", "সাত"],
  ])("%s", (n, w) => expect(toWords(n)).toBe(w));

  it("handles bigint beyond Number range", () => {
    expect(toWords(98765432109876543210n)).toBe(
      integerToWords(9876543210987n) + " কোটি " + integerToWords(6543210n),
    );
  });

  it("supports colloquial hundreds and লাখ", () => {
    expect(toWords(250, { hundred: "colloquial" })).toBe("দুইশো পঞ্চাশ");
    expect(toWords(500000, { lakh: "লাখ" })).toBe("পাঁচ লাখ");
    expect(toWords(-3, { negativeWord: "মাইনাস" })).toBe("মাইনাস তিন");
    expect(toWords("1.5", { pointWord: "পয়েন্ট" })).toBe("এক পয়েন্ট পাঁচ");
  });

  it.each([NaN, Infinity, -Infinity, 2 ** 60, 1e-7, "abc", "1.2.3", "", "1e5", " - 4"])(
    "rejects %s",
    (bad) => expect(() => toWords(bad as number)).toThrow(),
  );
  it("rejects non-numeric types", () => {
    expect(() => toWords(null as unknown as number)).toThrow(TypeError);
    expect(() => toWords({} as unknown as number)).toThrow(TypeError);
    expect(() => integerToWords(-1n)).toThrow(RangeError);
  });
});

describe("toTaka", () => {
  it.each<[number | string, string]>([
    [1250.5, "এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র"],
    [0, "শূন্য টাকা মাত্র"],
    [0.75, "পঁচাত্তর পয়সা মাত্র"],
    ["100.00", "এক শত টাকা মাত্র"],
    ["99.995", "এক শত টাকা মাত্র"],
    ["10.004", "দশ টাকা মাত্র"],
    ["10.005", "দশ টাকা এক পয়সা মাত্র"],
    [125000, "এক লক্ষ পঁচিশ হাজার টাকা মাত্র"],
    [-20, "ঋণাত্মক বিশ টাকা মাত্র"],
  ])("%s", (n, w) => expect(toTaka(n)).toBe(w));
  it("can drop মাত্র", () => expect(toTaka(5, { only: false })).toBe("পাঁচ টাকা"));
  it("rejects bad input", () => expect(() => toTaka("taka")).toThrow());
});
