"use client";

import { useChatStore } from "@/app/stores/chatStore";

export default function Header() {
  const toggleSidebar = useChatStore((state: any) => state.toggle);
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1>Logo</h1>

      <button
        onClick={toggleSidebar}
        className="rounded bg-gray-800 px-4 py-2 text-white"
      >
        Toggle Sidebar
      </button>
    </header>
  );
}