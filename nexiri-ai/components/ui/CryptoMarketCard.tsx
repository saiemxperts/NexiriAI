import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDigitFlash } from "@/hooks/useDigitFlash";

type CryptoCardVariant = "default" | "split";

interface CryptoMarketCardProps {
  iconSrc: string;
  iconAlt?: string;
  name: string;
  symbol?: string;
  price: number;
  currency?: string;
  changePercent: number;
  variant?: CryptoCardVariant;
  className?: string;
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

export default function CryptoMarketCard({
  iconSrc,
  iconAlt,
  name,
  symbol,
  price,
  currency = "USD",
  changePercent,
  variant = "default",
  className,
}: CryptoMarketCardProps) {
  const changeColor =
    changePercent > 0
      ? "text-[#089981]"
      : changePercent < 0
      ? "text-[#F23645]"
      : "text-[#6B7280]";

  const sign = changePercent > 0 ? "+" : "";
  const formattedChange = `${sign}${changePercent.toFixed(2)}%`;

  const { formatted: formattedPrice, flashMap, offset } = useDigitFlash(price);

  if (variant === "split") {
    return (
      <div
        className={cn(
          "group flex w-full min-h-[72px] items-center justify-between gap-3 box-border",
          "rounded-[14px] border border-[#f0eded] hover:bg-[#f0eded] hover:cursor-pointer transition-colors duration-200",
          "px-4 py-3 sm:px-4 sm:py-3",
          "max-sm:px-3.5 max-sm:py-2.5",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-full max-sm:h-6 max-sm:w-6 max-sm:min-w-6">
            <Image
              src={iconSrc}
              alt={iconAlt ?? `${name} icon`}
              width={28}
              height={28}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <h3 className="m-0 text-[16px] font-medium leading-[18px] tracking-normal text-[#111111]">
              {name}
            </h3>
            {symbol && (
              <span className="text-[13px] font-normal leading-[16px] text-[#111111] bg-[#F2F2F2] group-hover:bg-blue-500 group-hover:text-white px-2 py-0.5 rounded-sm w-fit text-center transition-colors duration-200">
                {symbol}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-center gap-1">
          <h4 className="m-0 text-[13px] font-normal leading-[18px] text-[#111111] text-right">
            {renderFlashedNumber(formattedPrice, flashMap, offset)} {currency}
          </h4>
          <h4
            className={cn(
              "m-0 text-[14px] font-medium leading-[18px] text-right",
              changeColor
            )}
          >
            {formattedChange}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full min-h-[72px] items-center gap-3 box-border",
        "rounded-[14px] border border-[#f0eded] hover:bg-[#f0eded] transition-colors duration-200",
        "px-4 py-3 sm:px-4 sm:py-3",
        "max-sm:px-3.5 max-sm:py-2.5",
        className
      )}
    >
      <div className="flex h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-full max-sm:h-6 max-sm:w-6 max-sm:min-w-6">
        <Image
          src={iconSrc}
          alt={iconAlt ?? `${name} icon`}
          width={28}
          height={28}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col justify-center gap-1">
        <h3 className="m-0 text-[16px] font-medium leading-[18px] tracking-normal text-[#111111] max-sm:text-[16px]">
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <h4 className="m-0 text-[13px] font-normal leading-[18px] text-[#111111] max-sm:text-[13px]">
            {renderFlashedNumber(formattedPrice, flashMap, offset)} {currency}
          </h4>
          <h4
            className={cn(
              "m-0 text-[14px] font-medium leading-[18px] max-sm:text-[13px]",
              changeColor
            )}
          >
            {formattedChange}
          </h4>
        </div>
      </div>
    </div>
  );
}