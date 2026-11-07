import { describe, expect, it, beforeAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/index.js";

let client: Client;

beforeAll(async () => {
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  await createServer().connect(serverT);
  client = new Client({ name: "test", version: "0.0.0" });
  await client.connect(clientT);
});

async function call(name: string, args: Record<string, unknown>) {
  const res = (await client.callTool({ name, arguments: args })) as {
    content: { type: string; text: string }[];
    isError?: boolean;
  };
  return { text: res.content[0]?.text ?? "", isError: res.isError ?? false };
}

describe("bangla-kit MCP server", () => {
  it("lists one tool per function, each with a description and schema", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "bangla_date",
      "clean_text",
      "convert_digits",
      "format_lakh",
      "to_taka",
      "to_words",
    ]);
    for (const t of tools) {
      expect(t.description?.length).toBeGreaterThan(30);
      expect(t.inputSchema.type).toBe("object");
      expect(t.annotations?.readOnlyHint).toBe(true);
    }
  });
  it("to_words", async () => {
    expect((await call("to_words", { number: 1250000 })).text).toBe("বারো লক্ষ পঞ্চাশ হাজার");
    expect((await call("to_words", { number: "১০০", hundred: "colloquial" })).text).toBe("একশো");
  });
  it("to_taka", async () => {
    expect((await call("to_taka", { amount: "1250.50" })).text).toBe(
      "এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র",
    );
  });
  it("format_lakh", async () => {
    expect((await call("format_lakh", { number: 1234567, digits: "bn" })).text).toBe("১২,৩৪,৫৬৭");
  });
  it("convert_digits", async () => {
    expect((await call("convert_digits", { text: "২০২৬", to: "en" })).text).toBe("2026");
  });
  it("clean_text", async () => {
    expect((await call("clean_text", { text: "আমি  ভাত খাই ।" })).text).toBe("আমি ভাত খাই।");
  });
  it("bangla_date", async () => {
    const d = JSON.parse((await call("bangla_date", { date: "2026-11-07" })).text);
    expect(d.formatted).toBe("২২ কার্তিক ১৪৩৩");
    const today = JSON.parse((await call("bangla_date", {})).text);
    expect(today.year).toBeGreaterThan(1430);
  });
  it("returns a tool error for bad input instead of crashing", async () => {
    const r = await call("to_words", { number: "abc" });
    expect(r.isError).toBe(true);
    expect(r.text).toMatch(/^Error:/);
  });
});
