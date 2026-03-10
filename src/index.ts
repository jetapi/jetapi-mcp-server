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
  "Send a message via Jetapi to WhatsApp or Telegram",
  {
    dispatch_routing: z.array(z.string()).min(1),
    text: z.string().min(1),
    phone: z.string().optional(),
    username: z.string().optional(),
    tdlib: z.string().optional()
  },
  async ({ dispatch_routing, text, phone, username, tdlib }) => {
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

    try {
      const result = await sendJetapiMessage(jetapiBaseUrl, jetapiToken, {
        dispatch_routing,
        text,
        phone,
        username,
        tdlib
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