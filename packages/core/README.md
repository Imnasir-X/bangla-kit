# bangla-kit

Zero-dependency, fully typed Bangla utilities: number to words, cheque-style taka text, lakh and crore
formatting, digit conversion, text cleanup and the Bangladesh national calendar. ESM and CJS.

```bash
npm install bangla-kit
```

```ts
import { toWords, toTaka, formatLakh, toBanglaDate } from "bangla-kit";

toWords(1250000); // "বারো লক্ষ পঞ্চাশ হাজার"
toTaka(1250.5); // "এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র"
formatLakh(1234567, { digits: "bn" }); // "১২,৩৪,৫৬৭"
toBanglaDate("2026-11-07").formatted; // "২২ কার্তিক ১৪৩৩"
```

Full docs: https://github.com/Imnasir-X/bangla-kit#readme
