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
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  // Roving tabIndex: which item is "active" for keyboard focus.
  // Defaults to the current page's item, or the first item.
  const initialIndex = Math.max(
    0,
    MENU_ITEMS.findIndex((item) => item.href === pathname)
  );
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);

  const triggerId = React.useId();
  const menuId = React.useId();

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
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Move focus to the active item whenever the menu opens.
  React.useEffect(() => {
    if (open) {
      itemRefs.current[activeIndex]?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const openAndFocus = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAndFocus(activeIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus(MENU_ITEMS.length - 1);
    }
  };

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = (index + 1) % MENU_ITEMS.length;
        setActiveIndex(next);
        itemRefs.current[next]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = (index - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        setActiveIndex(prev);
        itemRefs.current[prev]?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        setActiveIndex(0);
        itemRefs.current[0]?.focus();
        break;
      }
      case "End": {
        e.preventDefault();
        const last = MENU_ITEMS.length - 1;
        setActiveIndex(last);
        itemRefs.current[last]?.focus();
        break;
      }
      case "Tab": {
        // Let focus leave the menu naturally, but close it.
        setOpen(false);
        break;
      }
      default:
        break;
    }
  };

  const selectItem = (item: MenuItemConfig, index: number) => {
    setActiveIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
    router.push(item.href);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "relative mx-auto w-fit font-[Inter,sans-serif] flex flex-col",
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
        id={triggerId}
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
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
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200",
            !open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id={menuId}
          className={cn(
            "absolute left-0 top-full z-50 mt-2",
            "min-w-full w-max",
            "rounded-xl bg-white p-2",
            "shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
          )}
          role="menu"
          aria-labelledby={triggerId}
        >
          <div className="flex flex-col gap-[2px]">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  role="menuitem"
                  key={item.href}
                  type="button"
                  tabIndex={activeIndex === index ? 0 : -1}
                  onClick={() => selectItem(item, index)}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                  onFocus={() => setActiveIndex(index)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex h-[38px] w-full items-center gap-[10px]",
                    "rounded-md px-3 text-[14px] whitespace-nowrap",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F2F2F]",
                    isActive
                      ? "bg-[#2F2F2F] text-white"
                      : "text-[#111827] hover:bg-[#F3F4F6]"
                  )}
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
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