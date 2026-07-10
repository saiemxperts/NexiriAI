import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function renderFlashedNumber(
  text: string,
  flashMap: Record<number, "up" | "down">,
  offset: number
) {
  return text.split("").map((char, i) => {
    const direction = flashMap[i + offset];
    return (
      <span
        key={i}
        className={cn(
          "transition-colors duration-500",
          direction === "up" && "text-[#089981]",
          direction === "down" && "text-[#F23645]"
        )}
      >
        {char}
      </span>
    );
  });
}