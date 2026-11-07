import { describe, expect, it } from "vitest";
import { formatLakh } from "../src/index.js";

describe("formatLakh", () => {
  it.each<[number | string | bigint, string]>([
    [0, "0"],
    [999, "999"],
    [1000, "1,000"],
    [100000, "1,00,000"],
    [1234567, "12,34,567"],
    [10000000, "1,00,00,000"],
    [123456789, "12,34,56,789"],
    [-1234567.89, "-12,34,567.89"],
    [12345678901234567890n, "1,23,45,67,89,01,23,45,67,890"],
    ["১২৩৪৫৬", "1,23,456"],
  ])("%s", (n, out) => expect(formatLakh(n)).toBe(out));
  it("outputs Bangla digits", () =>
    expect(formatLakh(1234567, { digits: "bn" })).toBe("১২,৩৪,৫৬৭"));
  it("fixes fraction digits with half-up rounding", () => {
    expect(formatLakh(1234567.5, { fractionDigits: 2 })).toBe("12,34,567.50");
    expect(formatLakh("99999.995", { fractionDigits: 2 })).toBe("1,00,000.00");
    expect(formatLakh("1.4", { fractionDigits: 0 })).toBe("1");
    expect(formatLakh("1.5", { fractionDigits: 0 })).toBe("2");
    expect(formatLakh("-0.001", { fractionDigits: 2 })).toBe("0.00");
    expect(formatLakh("0.05", { fractionDigits: 1, digits: "bn" })).toBe("০.১");
  });
  it("rejects bad options and input", () => {
    expect(() => formatLakh(1, { fractionDigits: -1 })).toThrow(RangeError);
    expect(() => formatLakh(1, { fractionDigits: 1.5 })).toThrow(RangeError);
    expect(() => formatLakh("x")).toThrow(TypeError);
  });
});
