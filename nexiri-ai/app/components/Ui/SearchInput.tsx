"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  className,
  placeholder = "Symbol, ISIN, or CUSIP",
  ...props
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 rounded-full border-[#D7D7D7] bg-[#F5F6F8] pl-11 pr-16 shadow-none",
          "placeholder:text-[#6B7280]",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        {...props}
      />

      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      ) : (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
}