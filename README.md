# JetAPI MCP Server

[![npm](https://img.shields.io/npm/v/jetapi-mcp-server)](https://www.npmjs.com/package/jetapi-mcp-server)
[![CI](https://github.com/jetapi/jetapi-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/jetapi/jetapi-mcp-server/actions/workflows/ci.yml)
[![MCP Registry](https://img.shields.io/badge/MCP_Registry-io.github.jetapi%2Fjetapi--mcp--server-0568FD)](https://registry.modelcontextprotocol.io)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

Official MCP server for [JetAPI](https://jetapi.io) — send WhatsApp, Telegram, SMS and MAX messages, files and bulk mailings from AI agents like Claude, Cursor and VS Code.

## Tools

| Tool | Description |
| --- | --- |
| `get_account` | Full account info: balance, dispatch routing, sender names, subscription, WhatsApp/Telegram session status (token is masked) |
| `get_balance` | Balance, customer ID, dispatch routing channels and registered sender names |
| `get_utm_tags` | List UTM tags used to track dispatches |
| `send_message` | Send a text via WhatsApp, Telegram (tdlib), Telegram Bot, SMS, VK/OK or MAX — with cascade, scheduling, priority, reply-to and callbacks |
| `send_bulk` | Send the same message to many phone numbers at once |
| `get_delivery_status` | Status and details of a delivery, with the status explained in plain words |
| `delete_delivery` | Delete a delivered WhatsApp/Telegram message on all recipient devices |
| `get_phone_info` | Country, operator and normalized format of a phone number |
| `send_file` | Send a document, image, audio or video from a local path, URL or base64 (up to 100 MB) |
| `create_webhook` | Subscribe a URL to events: incoming messages, WhatsApp statuses, login/logout |
| `get_webhook` | Details of one webhook |
| `list_webhooks` | All registered webhooks |
| `delete_webhook` | Delete a webhook |
| `update_webhook` | Change a webhook's URL and/or event types |

## Get a token

Sign up at **[jetapi.io](https://jetapi.io)** and copy the API token from the dashboard. To send through WhatsApp or Telegram, connect the messenger in the dashboard first.

## Installation

### Claude Desktop — one click

1. Download `jetapi-mcp-server.mcpb` from the [latest release](https://github.com/jetapi/jetapi-mcp-server/releases/latest).
2. Double-click it (or drag it into *Claude Desktop → Settings → Extensions*).
3. Paste your JetAPI token when asked. It is stored securely by Claude Desktop.

### Claude Desktop — config file

Requires Node.js 18.17 or newer. Open *Settings → Developer → Edit Config* (`claude_desktop_config.json`) and add:

```json
{
  "mcpServers": {
    "jetapi": {
      "command": "npx",
      "args": ["-y", "jetapi-mcp-server"],
      "env": { "JETAPI_TOKEN": "your_token_here" }
    }
  }
}
```

Restart Claude Desktop.

### Claude Code

```bash
claude mcp add jetapi -- npx -y jetapi-mcp-server
```

The server needs `JETAPI_TOKEN`, so pass it when adding:

```bash
claude mcp add jetapi --env JETAPI_TOKEN=your_token_here -- npx -y jetapi-mcp-server
```

### Cursor

Add to `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "jetapi": {
      "command": "npx",
      "args": ["-y", "jetapi-mcp-server"],
      "env": { "JETAPI_TOKEN": "your_token_here" }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` — VS Code will prompt for the token and keep it out of the file:

```json
{
  "inputs": [
    { "type": "promptString", "id": "jetapi_token", "description": "JetAPI token", "password": true }
  ],
  "servers": {
    "jetapi": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "jetapi-mcp-server"],
      "env": { "JETAPI_TOKEN": "${input:jetapi_token}" }
    }
  }
}
```

### MCP Registry

The server is listed in the [official MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.jetapi/jetapi-mcp-server`, so clients and catalogs that read the registry can install it directly.

### Other MCP clients

Any client that supports stdio servers:

```json
{
  "command": "npx",
  "args": ["-y", "jetapi-mcp-server"],
  "env": { "JETAPI_TOKEN": "your_token_here" }
}
```

## Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `JETAPI_TOKEN` | yes | — | Bearer token from the JetAPI dashboard |
| `JETAPI_BASE_URL` | no | `https://api.jetapi.io` | API host |
| `JETAPI_DEBUG` | no | `0` | `1` logs every request to stderr |

## Channels

`dispatch_routing` is an ordered list of channels. JetAPI tries them one by one and moves to the next channel only if delivery through the previous one fails. Without it, the default routing from your JetAPI dashboard is used.

| Value | Channel | Recipient |
| --- | --- | --- |
| `whatsapp` | WhatsApp | `phone` or `whatsapp_lid` |
| `tdlib` | Personal Telegram account | `phone`, `username` or `tdlib_user_id` (negative ID = group chat) |
| `telegram` | Telegram Bot | `phone` |
| `sms` | SMS | `phone` |
| `notify` | VK / OK notifications | `phone` |
| `max` | MAX messenger | `phone` |

## Usage examples

Ask Claude in plain language:

| Say | Tool |
| --- | --- |
| "Show my JetAPI account — is WhatsApp connected?" | `get_account` |
| "How much money is left on JetAPI?" | `get_balance` |
| "Which UTM tags do I have?" | `get_utm_tags` |
| "Send a WhatsApp message to +7 999 123-45-67: Your order has shipped." | `send_message` |
| "Message @john_doe on Telegram that the meeting moved to 3 pm." | `send_message` (tdlib) |
| "Try WhatsApp first, then SMS: Your code is 4821." | `send_message` (cascade) |
| "Remind 79991234567 tomorrow at 09:00 UTC about the appointment." | `send_message` (scheduled) |
| "Send 'Sale starts today!' to 79991234567, 79997654321 and 995598464533." | `send_bulk` |
| "Was message 94396942 delivered?" | `get_delivery_status` |
| "Delete message 94396942." | `delete_delivery` |
| "Which operator is +995 598 464 533?" | `get_phone_info` |
| "Send ~/Documents/invoice.pdf to 79991234567 on WhatsApp." | `send_file` |
| "Send incoming WhatsApp messages to https://example.com/hook." | `create_webhook` |
| "Show webhook 57." | `get_webhook` |
| "List my webhooks." | `list_webhooks` |
| "Delete webhook 57." | `delete_webhook` |
| "Point webhook 57 to https://example.com/new-hook." | `update_webhook` |

## Behaviour

- Parameters are sent as URL query parameters, as the JetAPI API expects; `send_file` uploads the file as `multipart/form-data`.
- Incompatible parameters (e.g. a Telegram `username` without the `tdlib` channel, or `scheduled_at` in the past) are rejected before any request is sent.
- HTTP 429 is retried up to 3 times with exponential backoff, honouring `Retry-After`.
- 5xx responses are retried twice after 1 s — except for requests that send messages or create webhooks (`send_message`, `send_bulk`, `send_file`, `create_webhook`), so nothing is sent twice.
- Requests time out after 30 seconds.
- Errors are returned as readable tool errors, e.g. `Invalid JetAPI token. Check your JETAPI_TOKEN.` or `Validation error: text: the text cannot be empty`.
- All logs go to stderr; stdout is reserved for the MCP protocol.

## Development

```bash
git clone https://github.com/jetapi/jetapi-mcp-server.git
cd jetapi-mcp-server
npm install
cp .env.example .env   # put your token in .env
npm run build
npm start
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Run the TypeScript source directly |
| `npm run inspector` | Open the MCP Inspector with all tools |
| `npm run check` | Verify versions in `package.json` / `server.json` / `manifest.json` and that the server exposes all 14 tools |
| `npm run build:mcpb` | Build the Claude Desktop extension into `build/jetapi-mcp-server.mcpb` |

### Releasing

1. Bump the version in `package.json`, `server.json` (both `version` fields) and `manifest.json`, and add a `CHANGELOG.md` entry.
2. Merge to `main`, then push a tag: `git tag v1.2.3 && git push origin v1.2.3`.
3. The [Release workflow](.github/workflows/release.yml) publishes to npm (trusted publishing with provenance), creates a GitHub release with the `.mcpb` bundle and updates the MCP Registry.

## License

[ISC](LICENSE)
