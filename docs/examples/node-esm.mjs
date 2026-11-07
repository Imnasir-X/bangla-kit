import { toWords, toTaka, formatLakh, toBanglaDate, cleanText } from "bangla-kit";

console.log(toWords(1250000)); // বারো লক্ষ পঞ্চাশ হাজার
console.log(toTaka("99999.50")); // নিরানব্বই হাজার নয় শত নিরানব্বই টাকা পঞ্চাশ পয়সা মাত্র
console.log(formatLakh(123456789.5, { digits: "bn", fractionDigits: 2 })); // ১২,৩৪,৫৬,৭৮৯.৫০
console.log(toBanglaDate("2026-02-21")); // { day: 8, monthName: "ফাল্গুন", ... }
console.log(cleanText("আমি  ভাত খাই ।")); // আমি ভাত খাই।
