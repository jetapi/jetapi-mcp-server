# Privacy Policy — JetAPI MCP Server

_Last updated: 2026-09-14_

This policy describes how the **JetAPI MCP Server** — the npm package `jetapi-mcp-server` and the Claude Desktop extension `jetapi-mcp-server.mcpb` (together, "the extension") — handles data. The extension is published by **JETAPI LLC** ("JetAPI", "we").

It supplements the **[JETAPI LLC Privacy Policy](https://jetapi.io/jp/privacypolicy)**, which governs personal data processed by the JetAPI service itself. Use of the JetAPI service is also subject to the [JetAPI Public Offer](https://jetapi.io/offer).

## 1. What the extension is

The extension is a program that runs locally on your computer and lets an AI assistant (for example Claude) call the JetAPI API on your behalf. It has no servers of its own and sends data only to the JetAPI API host you configure (by default `https://api.jetapi.io`).

## 2. Data collection

The extension handles only the data needed to perform the actions you request:

| Data | Source | Purpose |
| --- | --- | --- |
| JetAPI API token | You, in the extension settings or your MCP client configuration | Authenticating requests to the JetAPI API |
| Message content and recipients (text, phone numbers, Telegram usernames or IDs, WhatsApp LIDs, scheduling options) | You or the AI assistant, when a messaging tool is called | Sending the message through JetAPI |
| Files you choose to send (local path, URL or base64 content) | You or the AI assistant, when `send_file` is called | Uploading the file to JetAPI for delivery |
| Webhook URLs and event types | You or the AI assistant, when a webhook tool is called | Managing webhooks in your JetAPI account |
| API responses (delivery IDs and statuses, balance, account and subscription details, phone number operator data, webhook settings) | The JetAPI API | Showing the result of the tool call |

The extension does **not** collect analytics, telemetry, crash reports, device identifiers or usage statistics.

## 3. Use of data

Data is used only to carry out the action you or the AI assistant requested: sending a message or file, checking or deleting a delivery, looking up a phone number, reading account information or managing webhooks. Every tool call results in a request to the JetAPI API; nothing is sent in the background.

## 4. Storage

- The extension keeps no database, cache or history. Tool inputs and API responses are held in memory only while a request is processed.
- Your API token is stored by your MCP client, not by the extension. Claude Desktop keeps extension settings marked as sensitive in its secure storage; other clients keep it in their configuration file or in a local `.env` file you create.
- For `send_file`, the extension reads the file you point to, or downloads it from the URL you give, only to upload it to JetAPI. It does not keep a copy.
- Diagnostic logs are written only to the local standard error stream of the extension process and are not sent anywhere. With the optional `JETAPI_DEBUG=1` setting, logs include request URLs, which may contain message text and phone numbers. The API token is never logged.
- Data you send through the extension is stored by the JetAPI service as described in the [JETAPI LLC Privacy Policy](https://jetapi.io/jp/privacypolicy).

## 5. Third-party sharing

- The extension sends data only to the JetAPI API, over HTTPS.
- To deliver messages, the JetAPI service passes message content and recipient identifiers to the channels you select (for example WhatsApp, Telegram, SMS, VK/OK or MAX). Disclosure to service providers is described in the [JETAPI LLC Privacy Policy](https://jetapi.io/jp/privacypolicy).
- If you use `send_file` with a URL, the extension downloads the file from that URL, so the site hosting the file receives that request.
- The AI assistant you use receives tool inputs and results as part of your conversation. That data is governed by the assistant provider's privacy policy — for Claude, the [Anthropic Privacy Policy](https://www.anthropic.com/legal/privacy).

## 6. Data retention

- **Extension:** retains no data after a request completes.
- **JetAPI service:** personal data is retained for as long as necessary to achieve the purposes described in the [JETAPI LLC Privacy Policy](https://jetapi.io/jp/privacypolicy). Download links created for files sent through channels without native file support are valid for 7 days.
- You can stop the extension's access at any time by rotating or deleting your API token in the JetAPI dashboard and uninstalling the extension.

## 7. Your rights

You control which actions run: MCP clients such as Claude Desktop ask for confirmation before running tools. Your rights of access, rectification, erasure and objection regarding data held by the JetAPI service are described in the [JETAPI LLC Privacy Policy](https://jetapi.io/jp/privacypolicy); to exercise them, contact us at the address below.

## 8. Security

The extension communicates with the JetAPI API over HTTPS using your bearer token. Keep your token secret — anyone who has it can use your JetAPI account.

## 9. Changes

We may update this policy when the extension changes. The current version is always available at <https://github.com/jetapi/jetapi-mcp-server/blob/main/PRIVACY.md>.

## 10. Contact

JETAPI LLC — Data Protection Officer
Email: [support@jetapi.io](mailto:support@jetapi.io)
Website: <https://jetapi.io>
