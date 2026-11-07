#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, VERSION } from "./index.js";

if (process.argv.includes("--version")) {
  console.log(VERSION);
  process.exit(0);
}

const server = createServer();
await server.connect(new StdioServerTransport());
console.error(`bangla-kit-mcp ${VERSION} running on stdio`);
