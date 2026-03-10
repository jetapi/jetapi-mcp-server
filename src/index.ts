import "dotenv/config"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { sendJetapiMessage } from "./jetapi.js"

const jetapiToken = process.env.JETAPI_TOKEN
const jetapiBaseUrl = process.env.JETAPI_BASE_URL || "https://api.jetapi.io"

const server = new McpServer({
  name: "jetapi-mcp",
  version: "1.0.0"
})

server.tool(
  "jetapi_send_message",
  "Send a message via Jetapi. For WhatsApp use phone only. For Telegram use exactly one of: phone, username, or Telegram ID.",
  {
    dispatch_routing: z
      .array(z.string())
      .min(1)
      .describe('Channel routing array. Example: ["whatsapp"] or ["tdlib"]'),

    text: z
      .string()
      .min(1)
      .describe("Message text"),

    phone: z
      .string()
      .optional()
      .describe("Recipient phone number. Required for WhatsApp. Can also be used for Telegram."),

    username: z
      .string()
      .optional()
      .describe("Telegram username only. Use without @ if possible."),

    telegram_id: z
      .string()
      .optional()
      .describe("Telegram ID")
  },
  async ({ dispatch_routing, text, phone, username, telegram_id }) => {
    if (!jetapiToken) {
      return {
        content: [
          {
            type: "text",
            text: "JETAPI_TOKEN is not set in .env"
          }
        ],
        isError: true
      }
    }

    const recipients = [phone, username, telegram_id].filter(
      (value) => typeof value === "string" && value.trim() !== ""
    )

    if (recipients.length !== 1) {
      return {
        content: [
          {
            type: "text",
            text: "You must provide exactly one recipient field: phone, username, or telegram_id."
          }
        ],
        isError: true
      }
    }

    const routing = dispatch_routing.map((item) => item.toLowerCase())
    const isWhatsApp = routing.includes("whatsapp")
    const isTelegram = routing.includes("tdlib") || routing.includes("telegram")

    if (isWhatsApp && !phone) {
      return {
        content: [
          {
            type: "text",
            text: "For WhatsApp, use phone only."
          }
        ],
        isError: true
      }
    }

    if (isWhatsApp && (username || telegram_id)) {
      return {
        content: [
          {
            type: "text",
            text: "For WhatsApp, username and telegram_id must be empty. Use phone only."
          }
        ],
        isError: true
      }
    }

    if (isTelegram && !phone && !username && !telegram_id) {
      return {
        content: [
          {
            type: "text",
            text: "For Telegram, provide exactly one of: phone, username, or telegram_id."
          }
        ],
        isError: true
      }
    }

    try {
      const result = await sendJetapiMessage(jetapiBaseUrl, jetapiToken, {
        dispatch_routing,
        text,
        phone,
        username,
        tdlib: telegram_id
      })

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Unknown Jetapi error"
          }
        ],
        isError: true
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)