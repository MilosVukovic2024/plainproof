import Anthropic from "@anthropic-ai/sdk";

// The two kinds of Claude call the pipeline makes. Tests swap this object for a fake.
export type AI = {
  /** Research with live web search. Returns the written notes and every page the search returned. */
  search(system: string, prompt: string, maxSearches: number): Promise<{ text: string; urls: Found[] }>;
  /** No tools; the reply is JSON that matches `schema`. */
  json<T>(system: string, prompt: string, schema: object): Promise<T>;
};
export type Found = { url: string; title: string; date?: string };

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
let client: Anthropic | undefined;
const anthropic = () => (client ??= new Anthropic());

export const claude: AI = {
  async search(system, prompt, maxSearches) {
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: prompt }];
    const urls = new Map<string, Found>();
    let text = "";
    // A long search turn can pause; sending the paused message back resumes it.
    for (let turn = 0; turn < 6; turn++) {
      // Streaming, because the SDK refuses long non-streaming requests.
      const res = await anthropic().messages.stream({
        model: MODEL, max_tokens: 32000, system, messages,
        tools: [{ type: "web_search_20260318", name: "web_search", max_uses: maxSearches }],
      }).finalMessage();
      for (const block of res.content as any[]) {
        if (block.type === "text") {
          text += block.text;
          for (const c of block.citations ?? []) if (c.url) urls.set(c.url, { url: c.url, title: c.title ?? c.url });
        }
        if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
          for (const r of block.content) if (r.url) urls.set(r.url, { url: r.url, title: r.title ?? r.url, date: r.page_age ?? undefined });
        }
      }
      if (res.stop_reason !== "pause_turn") break;
      messages.push({ role: "assistant", content: res.content });
    }
    if (!text.trim()) throw new Error("search returned no text");
    return { text, urls: [...urls.values()] };
  },

  async json(system, prompt, schema) {
    const res = await anthropic().messages.stream({
      model: MODEL, max_tokens: 32000, system,
      messages: [{ role: "user", content: prompt }],
      output_config: { format: { type: "json_schema", schema: schema as any } },
    }).finalMessage();
    if (res.stop_reason === "max_tokens") throw new Error("JSON reply was cut off");
    const text = res.content.flatMap(b => (b.type === "text" ? [b.text] : [])).join("");
    return JSON.parse(text);
  },
};
