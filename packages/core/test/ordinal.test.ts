import { describe, expect, it } from "vitest";
import { toOrdinal, toDateOrdinal } from "../src/index.js";

describe("toOrdinal", () => {
  it.each([
    [1, "প্রথম"],
    [2, "দ্বিতীয়"],
    [3, "তৃতীয়"],
    [4, "চতুর্থ"],
    [6, "ষষ্ঠ"],
    [10, "দশম"],
    [11, "একাদশ"],
    [16, "ষোড়শ"],
    [19, "ঊনবিংশ"],
    [20, "বিংশ"],
    [21, "একুশতম"],
    [100, "এক শততম"],
    [125, "এক শত পঁচিশতম"],
  ])("%i", (n, w) => expect(toOrdinal(n)).toBe(w));
  it.each([
    [1, "১ম"],
    [2, "২য়"],
    [3, "৩য়"],
    [4, "৪র্থ"],
    [5, "৫ম"],
    [6, "৬ষ্ঠ"],
    [9, "৯ম"],
    [10, "১০ম"],
    [11, "১১তম"],
    [52, "৫২তম"],
  ])("short %i", (n, w) => expect(toOrdinal(n, { style: "short" })).toBe(w));
  it.each([0, -1, 1.5, NaN])("rejects %s", (n) => expect(() => toOrdinal(n)).toThrow(RangeError));
});

describe("toDateOrdinal", () => {
  it.each([
    [1, "১লা"],
    [2, "২রা"],
    [3, "৩রা"],
    [4, "৪ঠা"],
    [5, "৫ই"],
    [18, "১৮ই"],
    [19, "১৯শে"],
    [21, "২১শে"],
    [31, "৩১শে"],
  ])("%i", (d, w) => expect(toDateOrdinal(d)).toBe(w));
  it("rejects bad days", () => {
    expect(() => toDateOrdinal(0)).toThrow(RangeError);
    expect(() => toDateOrdinal(33)).toThrow(RangeError);
  });
});
