"use client";

import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Main area */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-[calc(100%-320px)]" : "w-full"
        }`}
      >
        <Header
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-6">
          {children}
        </main>

        <Footer />
      </div>

      {/* Right Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
      />
    </div>
  );
}