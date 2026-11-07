import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { toWords, toTaka, formatLakh, convertDigits, cleanText, toBanglaDate } from "bangla-kit";

export const VERSION = "0.1.0";

const numeric = z
  .union([z.number(), z.string()])
  .describe(
    'A number, or a numeric string. Strings may use Bangla digits and commas, e.g. "১,২৫,০০০". Use a string for very large or exact decimal values.',
  );

type ToolResult = { content: { type: "text"; text: string }[]; isError?: boolean };

function ok(text: string): ToolResult {
  return { content: [{ type: "text", text }] };
}

function run(fn: () => string): ToolResult {
  try {
    return ok(fn());
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], isError: true };
  }
}

/** Build the bangla-kit MCP server with one tool per core function. */
export function createServer(): McpServer {
  const server = new McpServer({ name: "bangla-kit", version: VERSION });

  server.registerTool(
    "to_words",
    {
      title: "Number to Bangla words",
      description:
        "Write a number in Bangla words using the Bangladeshi system (হাজার, লক্ষ, কোটি). Use this instead of writing Bangla number words yourself. Example: 1250000 gives বারো লক্ষ পঞ্চাশ হাজার.",
      inputSchema: {
        number: numeric,
        hundred: z
          .enum(["formal", "colloquial"])
          .optional()
          .describe("formal: এক শত (default). colloquial: একশো."),
        lakh: z.enum(["লক্ষ", "লাখ"]).optional().describe("Word for 100,000. Default লক্ষ."),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ number, hundred, lakh }) => run(() => toWords(number, { hundred, lakh })),
  );

  server.registerTool(
    "to_taka",
    {
      title: "Amount to taka words (cheque style)",
      description:
        "Write a money amount as Bangla taka and poisha words, as on a cheque, ending in মাত্র. Poisha round half up to 2 places. Example: 1250.50 gives এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র.",
      inputSchema: {
        amount: numeric,
        only: z.boolean().optional().describe("Append মাত্র. Default true."),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ amount, only }) => run(() => toTaka(amount, { only })),
  );

  server.registerTool(
    "format_lakh",
    {
      title: "Lakh and crore number formatting",
      description:
        "Group a number with commas the South Asian way (12,34,56,789), optionally in Bangla digits.",
      inputSchema: {
        number: numeric,
        digits: z.enum(["en", "bn"]).optional().describe("Output digits. Default en."),
        fractionDigits: z
          .number()
          .int()
          .min(0)
          .max(20)
          .optional()
          .describe("Round to this many decimals."),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ number, digits, fractionDigits }) =>
      run(() => formatLakh(number, { digits, fractionDigits })),
  );

  server.registerTool(
    "convert_digits",
    {
      title: "Convert Bangla and English digits",
      description:
        "Convert every digit in a text between Bangla (০-৯) and English (0-9). Other characters are kept.",
      inputSchema: {
        text: z.string().describe("Text containing digits."),
        to: z.enum(["bn", "en"]).describe("bn for Bangla digits, en for English digits."),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ text, to }) => run(() => convertDigits(text, to)),
  );

  server.registerTool(
    "clean_text",
    {
      title: "Clean Bangla text",
      description:
        "Normalise Bangla text: Unicode NFC, invisible characters removed (ZWJ and ZWNJ kept), spaces collapsed, dari (।) spacing fixed, pipes after Bangla turned into dari.",
      inputSchema: {
        text: z.string().describe("Text to clean."),
        digits: z.enum(["bn", "en"]).optional().describe("Also convert digits."),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ text, digits }) => run(() => cleanText(text, { digits })),
  );

  server.registerTool(
    "bangla_date",
    {
      title: "Gregorian to Bangla calendar date",
      description:
        "Convert a Gregorian date to the Bangladesh national calendar (Bangabda, 2019 revision). Returns JSON with year, month, day, month name, season, weekday and a formatted Bangla string. Omit date for today in Bangladesh.",
      inputSchema: {
        date: z
          .string()
          .optional()
          .describe("YYYY-MM-DD, or any ISO date-time. Default today (Asia/Dhaka)."),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ date }) => run(() => JSON.stringify(toBanglaDate(date ?? new Date()), null, 2)),
  );

  return server;
}
