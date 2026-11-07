import { describe, expect, it } from "vitest";
import { toBanglaDigits, toEnglishDigits, convertDigits } from "../src/index.js";

describe("digits", () => {
  it("converts to Bangla", () => {
    expect(toBanglaDigits("Room 1234, 5th floor")).toBe("Room ১২৩৪, ৫th floor");
    expect(toBanglaDigits(9876543210)).toBe("৯৮৭৬৫৪৩২১০");
    expect(toBanglaDigits(12n)).toBe("১২");
  });
  it("converts to English", () => expect(toEnglishDigits("০১৭১২-৩৪৫৬৭৮")).toBe("01712-345678"));
  it("round trips every digit", () => {
    const all = "0123456789";
    expect(toEnglishDigits(toBanglaDigits(all))).toBe(all);
  });
  it("convertDigits both ways", () => {
    expect(convertDigits("2026", "bn")).toBe("২০২৬");
    expect(convertDigits("২০২৬", "en")).toBe("2026");
    expect(() => convertDigits("1", "fr" as "bn")).toThrow(RangeError);
    expect(() => toEnglishDigits(5 as unknown as string)).toThrow(TypeError);
  });
});
