# bangla-kit-mcp

An MCP server that gives AI assistants exact Bangla number words, taka cheque text, lakh and crore
formatting, digit conversion, text cleanup and Bangla calendar dates.

```json
{
  "mcpServers": {
    "bangla-kit": { "command": "npx", "args": ["-y", "bangla-kit-mcp"] }
  }
}
```

## Tools

| Tool             | Input                                  | Example output                                 |
| ---------------- | -------------------------------------- | ---------------------------------------------- |
| `to_words`       | `number`, `hundred?`, `lakh?`          | বারো লক্ষ পঞ্চাশ হাজার                         |
| `to_taka`        | `amount`, `only?`                      | এক হাজার দুই শত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র |
| `format_lakh`    | `number`, `digits?`, `fractionDigits?` | ১২,৩৪,৫৬৭                                      |
| `convert_digits` | `text`, `to`                           | 2026                                           |
| `clean_text`     | `text`, `digits?`                      | আমি ভাত খাই।                                   |
| `bangla_date`    | `date?`                                | JSON with ২২ কার্তিক ১৪৩৩                      |

All tools are read-only and never touch the network.

Test it with the MCP Inspector: `npx @modelcontextprotocol/inspector npx -y bangla-kit-mcp`.
