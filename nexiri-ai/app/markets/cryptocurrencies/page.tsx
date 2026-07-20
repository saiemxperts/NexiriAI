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
      <LinkedSectionHeading href="/markets/coins" label="Market Summary" />
      <CryptoMarketGrid initialCoins={filteredCoins} />
      <div className="grid items-stretch gap-4 lg:grid-cols-[65%_35%] my-6">
  <div className="h-full rounded-lg border px-0 py-2">
    <div className="mx-4 mt-2">
      <LinkedSectionHeading fontSize="lg" href="/markets/cryptocurrencies/market-cap" label="Crypto total market cap" />
      <div className="flex flex-wrap gap-12 mt-4">
      <MetricCard
        value="2.18 T"
        unit="USD"
        label="Value"
        diff="-11.68 B"
        percentage={-0.53}
      />
      <MetricCard
        value="2.18 T"
        unit="USD"
        label="Volume"
        percentage={+0.53}
      />
      </div>
      </div>
      <TotalMarketCap />
  </div>

  <div className="flex h-full flex-col justify-between rounded-lg border p-6">
    <div>Top</div>
    <div>Bottom</div>
  </div>
</div>
    </>
  );
}