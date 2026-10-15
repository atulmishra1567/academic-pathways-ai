// Server-only Lovable AI Gateway helper.
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const AI_MODEL = "google/gemini-3-flash-preview";

export class AIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function call(body: Record<string, unknown>) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AIError("AI is not configured.", 500);
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: AI_MODEL, ...body }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`AI gateway error [${res.status}]: ${t.slice(0, 300)}`);
    if (res.status === 429) throw new AIError("AI is busy right now. Please try again in a minute.", 429);
    if (res.status === 402) throw new AIError("AI credits are used up for this workspace.", 402);
    throw new AIError(`AI request failed (${res.status}).`, res.status);
  }
  return res.json();
}

export async function aiText(messages: Msg[]): Promise<string> {
  const json = await call({ messages });
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new AIError("The AI returned an empty answer.", 502);
  return String(text);
}

export async function aiStructured<T>(messages: Msg[], name: string, parameters: Record<string, unknown>): Promise<T> {
  const json = await call({
    messages,
    tools: [{ type: "function", function: { name, description: "Return the structured result", parameters } }],
    tool_choice: { type: "function", function: { name } },
  });
  const args = json?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new AIError("The AI returned no structured data.", 502);
  try {
    return JSON.parse(args) as T;
  } catch {
    throw new AIError("The AI returned malformed structured data.", 502);
  }
}
