"use client";

import { useChatStore } from "@/app/stores/chatStore";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ChatSidebar from "./components/chatbot/ChatSidebar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {

  const sidebarOpen = useChatStore((state: any) => state.isOpen);
  return (
    <div className="min-h-screen flex">
      {/* Main area */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-[calc(100%-320px)]" : "w-full"
        }`}
      >
        <Header />

        <main className="flex-1 p-6">
          {children}
        </main>

        <Footer />
      </div>

      {/* Right Sidebar */}
      <ChatSidebar />
    </div>
  );
}