"use client";

import { useEffect, useRef, useState } from "react";
import CryptoMarketCard from "@/components/ui/CryptoMarketCard";
import LinkedSectionHeading from "./LinkedSectionHeading";

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface Props {
  initialCoins: CoinData[];
}

export default function CryptoMarketGrid({ initialCoins }: Props) {
  const [coins, setCoins] = useState(initialCoins);
  const latestData = useRef<Record<string, { price: number; change: number }>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    let flushInterval: ReturnType<typeof setInterval>;
    let closedByUs = false;

    function connect() {
      const streams = initialCoins
        .map((c) => `${c.symbol.toLowerCase()}usdt@ticker`)
        .join("/");

      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const data = msg?.data;
        if (!data?.s) return;

        const symbol = data.s.replace("USDT", "").toLowerCase();
        latestData.current[symbol] = {
          price: parseFloat(data.c),
          change: parseFloat(data.P),
        };
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        if (closedByUs) return;
        // exponential backoff, capped at 30s
        const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts.current);
        reconnectAttempts.current += 1;
        setTimeout(connect, delay);
      };
    }

    connect();

    // Flush buffered ticks to state every second instead of on every message
    flushInterval = setInterval(() => {
      if (Object.keys(latestData.current).length === 0) return;
      setCoins((prev) =>
        prev.map((coin) => {
          const update = latestData.current[coin.symbol.toLowerCase()];
          return update
            ? { ...coin, current_price: update.price, price_change_percentage_24h: update.change }
            : coin;
        })
      );
    }, 1000);

    return () => {
      closedByUs = true;
      clearInterval(flushInterval);
      wsRef.current?.close();
    };
  }, [initialCoins]);

  return (
    <div>
      <LinkedSectionHeading href="/markets/coins" label="Market Summary" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mt-4">
        {coins.map((coin) => (
          <CryptoMarketCard
            key={coin.id}
            iconSrc={coin.image}
            name={coin.name}
            symbol={coin.symbol}
            price={coin.current_price}
            currency="USD"
            changePercent={coin.price_change_percentage_24h ?? 0}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}