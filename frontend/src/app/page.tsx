"use client";
import { useState, useRef } from "react";
import api from "@/lib/api";
import MessageBubble from "@/components/MessageBubble";

type Message = { id: string; role: "user" | "assistant"; text: string; time?: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function send() {
    if (!input.trim()) return;
    const now = new Date().toISOString();
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input, time: now };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const placeholder: Message = { id: `a-${Date.now()}`, role: "assistant", text: "…", time: now };
    setMessages((m) => [...m, placeholder]);

    try {
      const res = await api.post("/chat", { message: input });
      const assistantText = res.data?.reply || "(no reply)";

      setMessages((m) => {
        const copy = [...m];
        const idx = copy.findIndex((x) => x.role === "assistant" && x.text === "…");
        if (idx >= 0) copy[idx] = { ...copy[idx], text: assistantText };
        return copy;
      });
    } catch (err) {
      console.error(err);
      setMessages((m) => m.map((x) => (x.role === "assistant" && x.text === "…" ? { ...x, text: "Server error" } : x)));
    } finally {
      setLoading(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Grok-style Chat</h1>
        <p className="text-sm text-gray-400">Ask questions, request summaries, or style the explanation.</p>
      </div>

      <div className="flex-1 overflow-auto glass rounded-xl p-6 mb-4" style={{ minHeight: 480 }}>
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} text={m.text} time={m.time} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Ask something — e.g. 'Summarize the audio like I'm 12'"
          className="flex-1 p-3 rounded-md bg-white/5"
        />
        <button onClick={send} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-md text-white">
          {loading ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}