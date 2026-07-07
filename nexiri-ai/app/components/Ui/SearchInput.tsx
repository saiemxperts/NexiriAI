"use client";
import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  symbol: string;
  name: string;
  isin: string;
  cusip: string;
}

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  results?: SearchResult[];
}

export function SearchInput({
  value,
  onChange,
  onClear,
  onClose,
  results = [],
  className,
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleClose = () => {
    onChange("");
    onClear?.();
    onClose?.();
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const filtered = value
    ? results.filter((r) =>
        [r.symbol, r.name, r.isin, r.cusip].some((f) =>
          f.toLowerCase().includes(value.toLowerCase())
        )
      )
    : results;

  return (
    <>
      <div
        className={cn(
          "relative z-50 rounded-3xl bg-gray-100 transition-all duration-300 ease-in-out",
          isFocused ? "w-[800px]" : "w-[300px]"
        )}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={isFocused ? "Symbol, ISIN, or CUSIP" : "Search (Ctrl + K)"}
          className={cn(
            "h-10 border-0 bg-transparent pl-9 shadow-none",
            "placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            value || isFocused ? "pr-20" : "pr-3",
            className
          )}
          {...props}
        />

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {value ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="text-sm text-muted-foreground transition-colors hover:text-black"
              aria-label="Clear search"
            >
              Clear
            </button>
          ) : null}

          {value && isFocused ? <div className="h-4 w-px bg-gray-300" /> : null}

          {isFocused ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClose}
              className="text-muted-foreground transition-colors hover:text-black"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {isFocused ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "fixed left-1/2 top-16 bottom-3 z-50 w-[600px] -translate-x-1/2",
              "overflow-hidden rounded-xl bg-white shadow-2xl",
              "animate-in fade-in zoom-in-95 duration-200"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto">
                {filtered.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-white text-xs uppercase text-muted-foreground">
                      <tr className="border-b">
                        <th className="px-4 py-3 font-medium">Symbol</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">ISIN</th>
                        <th className="px-4 py-3 font-medium">CUSIP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr
                          key={r.symbol}
                          className="cursor-pointer border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">{r.symbol}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {r.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {r.isin}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {r.cusip}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex h-full items-center justify-center px-4 py-16 text-sm text-muted-foreground">
                    {value ? "No matches found" : "Start typing to search"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}