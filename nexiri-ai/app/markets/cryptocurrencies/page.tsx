import CryptoMarketCard from "@/components/ui/CryptoMarketCard";
import CryptoMarketGrid from "@/components/ui/CryptoMarketGrid";
import LinkedSectionHeading from "@/components/ui/LinkedSectionHeading";

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
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mt-4">
        {filteredCoins.map((coin: any) => (
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
      </div> */}
    </>
  );
}