import StableCoinMarketCap from "@/components/markets/StableMarketCap";
import TotalMarketCap from "@/components/markets/TotalMarketCap";
import CryptoMarketCard from "@/components/ui/CryptoMarketCard";
import CryptoMarketGrid from "@/components/ui/CryptoMarketGrid";
import LinkedSectionHeading from "@/components/ui/LinkedSectionHeading";
import { MetricCard } from "@/components/ui/MetricCard";

async function getTopCoins() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
    {
      next: {
        revalidate: 60, // Refresh every minute
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch top coins");
  }

  return res.json();
}

export default async function CryptocurrenciesOverviewPage() {
  const excludedCoins = ["tether", "usd-coin", "binance-usd", "dai", "true-usd"];
  const coins = await getTopCoins();
  const filteredCoins = coins.filter((coin: any) => !excludedCoins.includes(coin.id)).slice(0, 4); // Limit to top 4 coins after filtering

  return (
    <>
      <CryptoMarketGrid initialCoins={filteredCoins} />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] my-6">
        <div className="h-full rounded-lg border px-0 py-2">
          <TotalMarketCap />
        </div>

        <div className="h-full rounded-lg p-0 flex flex-col justify-between">
        <div className="flex h-auto flex-col justify-between rounded-lg border px-0 py-2 overflow-hidden">
          <StableCoinMarketCap />
        </div>
        <div className="flex h-auto flex-col justify-between rounded-lg border px-0 py-2 overflow-hidden">
          <StableCoinMarketCap />
        </div>
        <div className="flex h-auto flex-col justify-between rounded-lg border px-0 py-2 overflow-hidden">
          <StableCoinMarketCap />
        </div>
        </div>
      </div>
    </>
  );
}