"use client";
import { useState } from "react";

export default function MessageBubble({ role, text, time }: { role: "user" | "assistant"; text: string; time?: string }) {
  const [expanded, setExpanded] = useState(false);
  const isUser = role === "user";

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">{isUser ? 'U' : 'A'}</div>
        <div>
          <div
            onClick={() => setExpanded((s) => !s)}
            className={`${isUser ? "bg-purple-600 text-white" : "bg-white/6 text-gray-100"} px-4 py-3 rounded-lg cursor-pointer break-words`}
            style={{ whiteSpace: expanded ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '640px' }}
          >
            {text}
          </div>
          {time && <div className="text-xs text-gray-400 mt-1">{time}</div>}
        </div>
      </div>
    </div>
  );
}
