import { formatLakh, toTaka } from "bangla-kit";

export function invoiceLine(amount: number) {
  return {
    figure: `৳${formatLakh(amount, { digits: "bn", fractionDigits: 2 })}`,
    inWords: toTaka(amount),
  };
}
// invoiceLine(125000) -> { figure: "৳১,২৫,০০০.০০", inWords: "এক লক্ষ পঁচিশ হাজার টাকা মাত্র" }
