#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { JetApiClient } from "./client.js"
import { SERVER_NAME, SERVER_VERSION, loadConfig } from "./config.js"
import { MISSING_TOKEN_MESSAGE } from "./errors.js"
import { log } from "./logger.js"
import { accountTools } from "./tools/account.js"
import { bulkTools } from "./tools/bulk.js"
import { deliveryTools } from "./tools/delivery.js"
import { fileTools } from "./tools/file.js"
import { phoneTools } from "./tools/phone.js"
import { registerTools, type AnyToolDefinition } from "./tools/registry.js"
import { webhookTools } from "./tools/webhooks.js"

const INSTRUCTIONS = `JetAPI sends WhatsApp, Telegram (personal account or bot), SMS, VK/OK and MAX messages.
Typical flow: get_account (is WhatsApp/Telegram authorized, is the subscription active) → send_message / send_file / send_bulk → get_delivery_status.
Phone numbers use international format with the country code, e.g. 79991234567.`

const tools: AnyToolDefinition[] = [
  ...accountTools,
  ...deliveryTools,
  ...bulkTools,
  ...phoneTools,
  ...fileTools,
  ...webhookTools,
]

async function main(): Promise<void> {
  const config = loadConfig()
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION }, { instructions: INSTRUCTIONS })
  registerTools(server, tools, { config, client: new JetApiClient(config) })

  await server.connect(new StdioServerTransport())

  log.raw(`JetAPI MCP Server v${SERVER_VERSION} — ${tools.length} tools loaded`)
  if (!config.token) log.warn(MISSING_TOKEN_MESSAGE)
}

main().catch((err: unknown) => {
  log.error(`Failed to start: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})
