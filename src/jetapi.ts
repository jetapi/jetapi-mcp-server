export type JetapiSendMessageParams = {
  dispatch_routing: string[]
  text: string
  phone?: string
  username?: string
  tdlib?: string
}

export async function sendJetapiMessage(
  baseUrl: string,
  token: string,
  payload: JetapiSendMessageParams
) {
  const response = await fetch(`${baseUrl}/api/v1/delivery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  const responseText = await response.text()

  let data: unknown = null

  try {
    data = responseText ? JSON.parse(responseText) : null
  } catch {
    data = responseText
  }

  if (!response.ok) {
    throw new Error(
      `Jetapi request failed with status ${response.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`
    )
  }

  return data
}