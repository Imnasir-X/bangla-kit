/**
 * Spellings people also write for 0-99, mapped to their value. The canonical spelling
 * (Bangla Academy, as in WORDS_0_99) is what bangla-kit outputs; these are only accepted
 * when reading words back with fromWords.
 */
export const WORD_VARIANTS: Readonly<Record<string, number>> = {
  এগার: 11,
  বার: 12,
  তের: 13,
  চোদ্দ: 14,
  চোদ্দো: 14,
  চৌদ্দো: 14,
  পনের: 15,
  ষোল: 16,
  সতের: 17,
  আঠার: 18,
  ঊনিশ: 19,
  কুড়ি: 20,
  আঠাশ: 28,
  উনত্রিশ: 29,
  ঊনতিরিশ: 29,
  উনতিরিশ: 29,
  তিরিশ: 30,
  পঁইত্রিশ: 35,
  উনচল্লিশ: 39,
  বেয়াল্লিশ: 42,
  পঁইতাল্লিশ: 45,
  ছেয়াল্লিশ: 46,
  উনপঞ্চাশ: 49,
  বায়ান্ন: 52,
  উনষাট: 59,
  উনসত্তর: 69,
  বায়াত্তর: 72,
  উনআশি: 79,
  অষ্টাশি: 88,
  অষ্টআশি: 88,
  উননব্বই: 89,
};
