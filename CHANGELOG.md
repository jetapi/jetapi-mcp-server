# Changelog

## 1.0.2 — 2026-09-14

- Added a privacy policy for the extension (`PRIVACY.md`), a "Privacy Policy" section in the README and `privacy_policies` in `manifest.json`, as required for the Claude Desktop extensions directory.

## 1.0.1 — 2026-09-14

- Listed in the official MCP Registry as `io.github.jetapi/jetapi-mcp-server` (`mcpName` in `package.json`, `server.json`).
- One-click Claude Desktop extension (`jetapi-mcp-server.mcpb`) attached to GitHub releases.
- Releases are published from GitHub Actions with npm trusted publishing and provenance.
- `prepublishOnly` builds the server, so a stale `dist` can't be published.
- Added LICENSE and `glama.json`.

## 1.0.0 — 2026-09-14

- Initial release with 14 tools: `get_account`, `get_balance`, `get_utm_tags`, `send_message`, `send_bulk`, `get_delivery_status`, `delete_delivery`, `get_phone_info`, `send_file`, `create_webhook`, `get_webhook`, `list_webhooks`, `delete_webhook`, `update_webhook`.
