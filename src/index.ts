import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const server = new McpServer({
  name: "jetapi-mcp",
  version: "1.0.0"
})

server.tool(
  "jetapi_ping",
  "Simple test tool to verify Jetapi MCP server is running",
  {
    message: z.string().optional()
  },
  async ({ message }) => {
    return {
      content: [
        {
          type: "text",
          text: `Jetapi MCP server is alive. Message: ${message ?? "ok"}`
        }
      ]
    }
  }
)

const transport = new StdioServerTransport()

await server.connect(transport)