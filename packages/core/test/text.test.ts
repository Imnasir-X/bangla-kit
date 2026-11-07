import { describe, expect, it } from "vitest";
import { cleanText } from "../src/index.js";

describe("cleanText", () => {
  it("normalises to NFC", () => {
    const decomposed = "\u0995\u09C7\u09BE"; // ক + ে + া
    expect(cleanText(decomposed)).toBe("\u0995\u09CB"); // কো
  });
  it("removes invisible characters but keeps ZWJ and ZWNJ", () => {
    expect(cleanText("বাং\u200Bলা\uFEFF")).toBe("বাংলা");
    expect(cleanText("র\u200D্যাব")).toBe("র\u200D্যাব");
    expect(cleanText("a\u200Cb")).toBe("a\u200Cb");
  });
  it("collapses spaces and fixes dari spacing", () => {
    expect(cleanText("  আমি   ভাত খাই ।আমি   বাড়ি যাই  । ")).toBe("আমি ভাত খাই। আমি বাড়ি যাই।");
  });
  it("turns pipes after Bangla into dari", () => {
    expect(cleanText("আমি ভাত খাই| তুমি?")).toBe("আমি ভাত খাই। তুমি?");
    expect(cleanText("a | b")).toBe("a | b");
    expect(cleanText("খাই|", { fixDari: false })).toBe("খাই|");
  });
  it("removes space before punctuation and tidies lines", () => {
    expect(cleanText("হ্যালো , কেমন আছ ?\r\n\r\n\r\n\r\nভালো")).toBe("হ্যালো, কেমন আছ?\n\nভালো");
  });
  it("converts digits on request", () => {
    expect(cleanText("দাম 250 টাকা", { digits: "bn" })).toBe("দাম ২৫০ টাকা");
    expect(cleanText("দাম ২৫০ টাকা", { digits: "en" })).toBe("দাম 250 টাকা");
  });
  it("rejects non-strings", () =>
    expect(() => cleanText(1 as unknown as string)).toThrow(TypeError));
});
