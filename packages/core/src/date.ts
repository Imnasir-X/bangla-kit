import { BANGLA_MONTHS, SEASONS, WEEKDAYS } from "./data.js";
import { toBanglaDigits } from "./digits.js";

export type DateInput = Date | string | number | { year: number; month: number; day: number };

export interface BanglaDate {
  /** Bangabda year, e.g. 1433. */
  year: number;
  /** 1 (বৈশাখ) to 12 (চৈত্র). */
  month: number;
  day: number;
  monthName: string;
  season: string;
  weekday: string;
  /** The Gregorian date that was converted, as YYYY-MM-DD. */
  gregorian: string;
  /** e.g. "২২ কার্তিক ১৪৩৩". */
  formatted: string;
}

export interface BanglaDateOptions {
  /**
   * Hours east of UTC used to read a Date or timestamp. Default 6 (Bangladesh, no DST).
   * Ignored for "YYYY-MM-DD" strings and {year, month, day} objects.
   */
  utcOffsetHours?: number;
}

const DAY_MS = 86_400_000;

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function toYmd(input: DateInput, offset: number): [number, number, number] {
  if (typeof input === "object" && !(input instanceof Date)) {
    const { year, month, day } = input;
    if (![year, month, day].every(Number.isInteger))
      throw new TypeError("year, month and day must be integers");
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
      throw new RangeError(`Invalid date ${year}-${month}-${day}`);
    }
    return [year, month, day];
  }
  if (typeof input === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
    if (m) return toYmd({ year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }, offset);
  }
  const date = input instanceof Date ? input : new Date(input);
  const t = date.getTime();
  if (Number.isNaN(t)) throw new TypeError(`Not a valid date: ${String(input)}`);
  const local = new Date(t + offset * 3_600_000);
  return [local.getUTCFullYear(), local.getUTCMonth() + 1, local.getUTCDate()];
}

/**
 * Convert a Gregorian date to the Bangladesh national calendar (Bangabda, 2019 revision).
 * বৈশাখ to আশ্বিন have 31 days, কার্তিক to মাঘ and চৈত্র have 30,
 * and ফাল্গুন has 29, or 30 when its February is in a leap year. ১ বৈশাখ is 14 April.
 *
 * @example toBanglaDate("2026-11-07").formatted // "২২ কার্তিক ১৪৩৩"
 */
export function toBanglaDate(
  input: DateInput = new Date(),
  opts: BanglaDateOptions = {},
): BanglaDate {
  const [gy, gm, gd] = toYmd(input, opts.utcOffsetHours ?? 6);
  const target = Date.UTC(gy, gm - 1, gd);
  const startYear = target >= Date.UTC(gy, 3, 14) ? gy : gy - 1;
  const year = startYear - 593;
  let dayOfYear = Math.round((target - Date.UTC(startYear, 3, 14)) / DAY_MS);
  const lengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeap(startYear + 1) ? 30 : 29, 30];
  let month = 0;
  while (dayOfYear >= (lengths[month] as number)) {
    dayOfYear -= lengths[month] as number;
    month += 1;
  }
  const day = dayOfYear + 1;
  const monthName = BANGLA_MONTHS[month] as string;
  const weekday = WEEKDAYS[new Date(target).getUTCDay()] as string;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    year,
    month: month + 1,
    day,
    monthName,
    season: SEASONS[Math.floor(month / 2)] as string,
    weekday,
    gregorian: `${gy}-${pad(gm)}-${pad(gd)}`,
    formatted: `${toBanglaDigits(day)} ${monthName} ${toBanglaDigits(year)}`,
  };
}
