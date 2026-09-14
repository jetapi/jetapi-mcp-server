import dotenv from "dotenv"
import { ConfigError } from "./errors.js"

// dotenv 17 announces itself on stdout unless told to be quiet, and stdout carries the MCP protocol.
dotenv.config({ quiet: true })

export const SERVER_NAME = "jetapi-mcp-server"
export const SERVER_VERSION = "1.0.0"

const DEFAULT_BASE_URL = "https://api.jetapi.io"
const REQUEST_TIMEOUT_MS = 30_000

export interface Config {
  /** Bearer token from the JetAPI dashboard. Checked per request so the server can start without it. */
  token?: string
  baseUrl: string
  timeoutMs: number
}

export function loadConfig(): Config {
  const baseUrl = process.env.JETAPI_BASE_URL?.trim() || DEFAULT_BASE_URL
  let url: URL
  try {
    url = new URL(baseUrl)
  } catch {
    throw new ConfigError(`JETAPI_BASE_URL is not a valid URL: ${baseUrl}`)
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new ConfigError(`JETAPI_BASE_URL must start with https:// (got ${baseUrl})`)
  }

  return {
    token: process.env.JETAPI_TOKEN?.trim() || undefined,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    timeoutMs: REQUEST_TIMEOUT_MS,
  }
}
