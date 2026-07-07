"use client";

import { useChatStore } from "@/app/stores/chatStore";
import { SearchInput } from "../Ui/SearchInput";
import { useState } from "react";
import Image from "next/image";
import NexiriAiLogo from "@/public/nexiri-ai-logo.png";
import { GlowButton } from "../Ui/GlowButton";

export default function Header() {
  const toggleSidebar = useChatStore((state: any) => state.toggle);
  const [SearchValue, setSearchValue] = useState("");
  return (
    <header className="h-16 border-b flex items-center justify-between px-8">
      <div className="w-48 flex items-center justify-center">
      <Image src={NexiriAiLogo} alt="Nexiri AI Logo" style={{
    width: "auto",
    height: "auto",
  }} />
  </div>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
    <SearchInput
        value={SearchValue}
        onChange={setSearchValue}
      />
      </div>
      <div className="w-48 flex items-center justify-end">

<GlowButton onClick={toggleSidebar} >
  Ask Nex
</GlowButton>
      </div>
    </header>
  );
}