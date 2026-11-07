# bangla-kit

Accurate Bangla numbers, taka, digits, text and dates for JavaScript, plus an MCP server so AI assistants stop getting Bangla numbers wrong.

[![npm](https://img.shields.io/npm/v/bangla-kit.svg)](https://www.npmjs.com/package/bangla-kit)
[![CI](https://github.com/Imnasir-X/bangla-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Imnasir-X/bangla-kit/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](#tests)
[![bundle size](https://img.shields.io/bundlephobia/minzip/bangla-kit)](https://bundlephobia.com/package/bangla-kit)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

| Package                          | What it is                                              |
| -------------------------------- | ------------------------------------------------------- |
| [`bangla-kit`](packages/core)    | Zero-dependency, fully typed core library (ESM and CJS) |
| [`bangla-kit-mcp`](packages/mcp) | MCP server exposing every function as a tool            |

## Install

```bash
npm install bangla-kit
```

## Examples

```ts
import { toWords, toTaka, formatLakh, toBanglaDate } from "bangla-kit";

toWords(1250000); // "বারো লক্ষ পঞ্চাশ হাজার"
toTaka(1250.5); // "এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র"
formatLakh(123456789, { digits: "bn" }); // "১২,৩৪,৫৬,৭৮৯"
toBanglaDate("2026-11-07").formatted; // "২২ কার্তিক ১৪৩৩"
```

## Use it from Claude, Cursor or any MCP client

```json
{
  "mcpServers": {
    "bangla-kit": { "command": "npx", "args": ["-y", "bangla-kit-mcp"] }
  }
}
```

Then ask: "Write ৳12,50,000.75 on a cheque in Bangla." The assistant calls `to_taka` and gets
`বারো লক্ষ পঞ্চাশ হাজার টাকা পঁচাত্তর পয়সা মাত্র`, exactly.

<!-- Demo GIF: docs/demo.gif (Claude using the to_taka tool) -->

## API (v0.1)

| Function                                                                      | Does                                                                                                                                                                                     |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toWords(n, opts?)`                                                           | Number to Bangla words. Handles 0, negatives, decimals, bigint, Bangla-digit strings. Options: `hundred: "formal" \| "colloquial"`, `lakh: "লক্ষ" \| "লাখ"`, `negativeWord`, `pointWord` |
| `toTaka(n, opts?)`                                                            | Cheque-style taka and poisha with মাত্র. Poisha round half up                                                                                                                            |
| `formatLakh(n, opts?)`                                                        | 12,34,56,789 grouping, `digits: "bn"`, `fractionDigits`                                                                                                                                  |
| `toBanglaDigits(s)` / `toEnglishDigits(s)` / `convertDigits(s, "bn" \| "en")` | Digit conversion                                                                                                                                                                         |
| `cleanText(s, opts?)`                                                         | NFC, invisible characters removed (ZWJ and ZWNJ kept), spaces collapsed, dari (।) fixed                                                                                                  |
| `toBanglaDate(date?, opts?)`                                                  | Bangladesh national calendar (Bangabda, 2019 revision): year, month, day, month name, season, weekday, formatted                                                                         |

Invalid input throws a `TypeError` or `RangeError`; it never returns a wrong word silently.

## Accuracy

Bangla number words from 1 to 99 are irregular, so each is a hand-written entry, kept in a
[golden fixture](packages/core/test/fixtures/words-0-99.json) that native speakers sign off before each release.
Spelling follows the Bangla Academy standard. Found a word you disagree with? Open an issue with a source.

The calendar follows the 2019 revision used in Bangladesh: ১ বৈশাখ is 14 April, ২১ ফেব্রুয়ারি is ৮ ফাল্গুন,
১৬ ডিসেম্বর is ১ পৌষ. The West Bengal calendar differs and is planned as an option.

## Tests

```bash
pnpm install
pnpm test        # 109 tests
pnpm coverage    # 100% lines
pnpm build
```

## Roadmap

- Words back to numbers
- Ordinals (প্রথম, দ্বিতীয়)
- West Bengal calendar option
- Bangla to Gregorian date conversion

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues get a reply within 24 hours.

## License

MIT, by [Nasir Khan](https://github.com/Imnasir-X).
