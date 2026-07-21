"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronUp,
  Globe,
  Coins,
  ChartNoAxesCombined,
  PieChart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemConfig {
  label: string;
  icon: LucideIcon;
  href: string;
}

const MENU_ITEMS: MenuItemConfig[] = [
  { label: "Overview", icon: Globe, href: "/markets/cryptocurrencies" },
  { label: "Coins", icon: Coins, href: "/markets/cryptocurrencies/coins" },
  {
    label: "Market cap charts",
    icon: ChartNoAxesCombined,
    href: "/markets/cryptocurrencies/market-cap",
  },
  {
    label: "Dominance chart",
    icon: PieChart,
    href: "/markets/cryptocurrencies/dominance",
  },
];

export interface CryptoDropdownNavProps {
  title?: string;
  className?: string;
}

export function CryptoDropdownNav({
  title = "Overview",
  className,
}: CryptoDropdownNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);

  const activeItem = MENU_ITEMS.find((item) => item.href === pathname) ?? null;

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "relative mx-auto my-4 w-fit font-[Inter,sans-serif] flex flex-col",
        className
      )}
    >
      {/* Label */}
      <div className="mb-0 flex justify-center">
        <span className="text-lg font-semibold tracking-wide text-[#111827]">
          Crypto Market
        </span>
      </div>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex w-fit items-center justify-between gap-2",
          "rounded-xl px-3 py-2",
          "text-[48px] font-bold leading-[48px] text-[#111827]",
          "transition-colors",
          open ? "bg-[#F2F2F2]" : "bg-transparent hover:bg-[#F2F2F2]"
        )}
      >
        <span>{activeItem?.label || title}</span>

        <ChevronUp
          size={32}
          strokeWidth={5}

          className={cn(
            "transition-transform duration-200",
            !open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-2",
            "min-w-full w-max",
            "rounded-xl bg-white p-2",
            "shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
          )}
          role="menu"
        >
          <div className="flex flex-col gap-[2px]">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  role="menuitem"
                  key={item.href}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex h-[38px] w-full items-center gap-[10px]",
                    "rounded-md px-3 text-[14px] whitespace-nowrap",
                    isActive
                      ? "bg-[#2F2F2F] text-white"
                      : "text-[#111827] hover:bg-[#F3F4F6]"
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      isActive
                        ? "text-white"
                        : "text-[#4B5563] group-hover:text-[#111827]"
                    )}
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CryptoDropdownNav;