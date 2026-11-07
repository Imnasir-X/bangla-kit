export interface CleanTextOptions {
  /** Convert digits: "bn" to Bangla, "en" to ASCII. Default leaves digits alone. */
  digits?: "bn" | "en";
  /** Replace a pipe "|" used as a full stop after Bangla text with the dari "।". Default true. */
  fixDari?: boolean;
}

// Zero-width space, word joiner, BOM, soft hyphen. ZWJ and ZWNJ are kept: Bangla needs them (র‍্যাব).
const INVISIBLE = /[\u200B\u2060\uFEFF\u00AD]/g;
const BN_CHAR = "[\u0980-\u09FF]";

/**
 * Clean Bangla text: Unicode NFC, invisible characters removed, spaces collapsed,
 * spacing around the dari "।" fixed, and stray pipes turned into dari.
 */
export function cleanText(input: string, opts: CleanTextOptions = {}): string {
  if (typeof input !== "string") throw new TypeError("cleanText expects a string");
  let s = input.normalize("NFC").replace(INVISIBLE, "");
  s = s.replace(/\r\n?/g, "\n");
  if (opts.fixDari ?? true) s = s.replace(new RegExp(`(${BN_CHAR})\\s*\\|`, "g"), "$1।");
  s = s.replace(/[ \t\u00A0]+/g, " ");
  s = s.replace(/ *। */g, "। ").replace(/। (\n|$)/g, "।$1");
  s = s.replace(/ +([,!?;:])/g, "$1");
  s = s
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (opts.digits === "bn") s = s.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)] as string);
  if (opts.digits === "en") s = s.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
  return s;
}
