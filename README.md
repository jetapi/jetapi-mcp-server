# JetAPI MCP Server

MCP server for [JetAPI](https://jetapi.io) — send WhatsApp, Telegram, SMS and MAX messages, files and bulk mailings from AI agents like Claude.

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
| `send_file` | Send a document, image, audio, video or contact card from a local path, URL or base64 (up to 100 MB) |
| `create_webhook` | Subscribe a URL to events: incoming messages, WhatsApp statuses, login/logout |
| `get_webhook` | Details of one webhook |
| `list_webhooks` | All registered webhooks |
| `delete_webhook` | Delete a webhook |
| `update_webhook` | Change a webhook's URL and/or event types |

## Get a token

Sign up at **[jetapi.io](https://jetapi.io)** and copy the API token from the dashboard.

## Installation

Requires Node.js 18.17 or newer.

### Claude Desktop

Open *Settings → Developer → Edit Config* (`claude_desktop_config.json`) and add:

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

### Other MCP clients

Any client that supports stdio servers:

```json
{
  "command": "npx",
  "args": ["-y", "jetapi-mcp-server"],
  "env": { "JETAPI_TOKEN": "your_token_here" }
}
```

### From source

```bash
git clone https://github.com/jetapi/jetapi-mcp-server.git
cd jetapi-mcp-server
npm install
cp .env.example .env   # put your token in .env
npm run build
npm start
```

`npm run dev` runs the TypeScript source directly; `npm run inspector` opens the MCP Inspector with all 14 tools.

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

## License

ISC
