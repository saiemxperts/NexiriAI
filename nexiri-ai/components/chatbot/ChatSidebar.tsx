"use client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/app/stores/chatStore";

export default function ChatSidebar() {
  const {
    isOpen,
    pendingMessage,
    clearPendingMessage,
  } = useChatStore();

  const [input, setInput] = useState("");

  async function sendMessage(message: string) {
    // Call your backend
  }

  useEffect(() => {
    if (!pendingMessage) return;

    setInput(pendingMessage);

    sendMessage(pendingMessage);

    clearPendingMessage();
  }, [pendingMessage]);

 

  return (
    <aside
      className={`
        overflow-hidden
        border-l
        bg-red-500
        shadow-lg
        transition-all
        duration-300
        ${
          isOpen
            ? "w-80"
            : "w-0"
        }
      `}
    >
        <div className="w-80 h-full p-5">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={() => sendMessage(input)}>
        Send
      </button>
    </div>
    </aside>
  );
}