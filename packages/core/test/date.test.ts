import { describe, expect, it } from "vitest";
import { toBanglaDate } from "../src/index.js";

describe("toBanglaDate (Bangladesh revised calendar, 2019)", () => {
  it.each([
    ["2024-04-14", 1431, 1, 1, "১ বৈশাখ ১৪৩১"],
    ["2024-04-13", 1430, 12, 30, "৩০ চৈত্র ১৪৩০"],
    ["2024-10-16", 1431, 6, 31, "৩১ আশ্বিন ১৪৩১"],
    ["2024-10-17", 1431, 7, 1, "১ কার্তিক ১৪৩১"],
    ["2024-12-16", 1431, 9, 1, "১ পৌষ ১৪৩১"],
    ["2025-02-14", 1431, 11, 1, "১ ফাল্গুন ১৪৩১"],
    ["2025-02-21", 1431, 11, 8, "৮ ফাল্গুন ১৪৩১"],
    ["2025-03-14", 1431, 11, 29, "২৯ ফাল্গুন ১৪৩১"],
    ["2025-03-15", 1431, 12, 1, "১ চৈত্র ১৪৩১"],
    ["2025-03-26", 1431, 12, 12, "১২ চৈত্র ১৪৩১"],
    ["2024-03-14", 1430, 11, 30, "৩০ ফাল্গুন ১৪৩০"],
    ["2024-03-15", 1430, 12, 1, "১ চৈত্র ১৪৩০"],
    ["2026-11-07", 1433, 7, 22, "২২ কার্তিক ১৪৩৩"],
  ] as const)("%s", (g, year, month, day, formatted) => {
    const d = toBanglaDate(g);
    expect([d.year, d.month, d.day, d.formatted]).toEqual([year, month, day, formatted]);
    expect(d.gregorian).toBe(g);
  });

  it("fills season and weekday", () => {
    const d = toBanglaDate({ year: 2026, month: 11, day: 7 });
    expect(d.monthName).toBe("কার্তিক");
    expect(d.season).toBe("হেমন্ত");
    expect(d.weekday).toBe("শনিবার");
    expect(toBanglaDate("2025-02-21").season).toBe("বসন্ত");
    expect(toBanglaDate("2024-04-14").season).toBe("গ্রীষ্ম");
  });

  it("reads Date objects on Bangladesh time by default", () => {
    // 2024-04-13 20:00 UTC is 2024-04-14 02:00 in Dhaka.
    const d = new Date(Date.UTC(2024, 3, 13, 20));
    expect(toBanglaDate(d).formatted).toBe("১ বৈশাখ ১৪৩১");
    expect(toBanglaDate(d, { utcOffsetHours: 0 }).formatted).toBe("৩০ চৈত্র ১৪৩০");
    expect(toBanglaDate(d.getTime()).day).toBe(1);
  });

  it("every day of a year maps to a valid, consecutive Bangla date", () => {
    for (const startYear of [2023, 2024, 2099]) {
      let prev = toBanglaDate({ year: startYear, month: 4, day: 14 });
      expect([prev.month, prev.day]).toEqual([1, 1]);
      for (let i = 1; i < 366; i++) {
        const t = new Date(Date.UTC(startYear, 3, 14 + i));
        const d = toBanglaDate({
          year: t.getUTCFullYear(),
          month: t.getUTCMonth() + 1,
          day: t.getUTCDate(),
        });
        const next = d.day === 1 ? (prev.month === 12 ? [1] : [prev.month + 1]) : [prev.month];
        expect(d.month).toBe(next[0]);
        if (d.day !== 1) expect(d.day).toBe(prev.day + 1);
        prev = d;
      }
    }
  });

  it("defaults to today", () => expect(toBanglaDate().year).toBeGreaterThan(1430));

  it("rejects invalid dates", () => {
    expect(() => toBanglaDate("2025-02-30")).toThrow(RangeError);
    expect(() => toBanglaDate("not a date")).toThrow(TypeError);
    expect(() => toBanglaDate({ year: 2025, month: 1.5, day: 1 })).toThrow(TypeError);
  });
});
