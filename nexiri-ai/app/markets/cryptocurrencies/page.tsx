import CryptoMarketCard from "@/app/components/Ui/CryptoMarketCard";
import LinkedSectionHeading from "@/app/components/Ui/LinkedSectionHeading";

interface CryptoMockData {
  id: string;
  iconSrc: string;
  name: string;
symbol?: string;
  price: string;
  currency: string;
  changePercent: number;
}

const mockCryptoData: CryptoMockData[] = [
  {
    id: "bitcoin",
    iconSrc: "https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC.svg",
    name: "Bitcoin",
    symbol: "BTC",
    price: "63,099.70",
    currency: "USD",
    changePercent: 1.37,
  },
  {
    id: "ethereum",
    iconSrc: "https://s3-symbol-logo.tradingview.com/crypto/XTVCETH.svg",
    name: "Ethereum",
    symbol: "ETH",
    price: "3,412.85",
    currency: "USD",
    changePercent: -0.82,
  },
  {
    id: "solana",
    iconSrc: "https://s3-symbol-logo.tradingview.com/crypto/XTVCSOL.svg",
    name: "Solana",
    symbol: "SOL",
    price: "142.63",
    currency: "USD",
    changePercent: 4.21,
  },
  {
    id: "ripple",
    iconSrc: "https://s3-symbol-logo.tradingview.com/crypto/XTVCXRP.svg",
    name: "XRP",
    symbol: "XRP",
    price: "0.5231",
    currency: "USD",
    changePercent: 0,
  },
];

export default function CryptocurrenciesOverviewPage() {
  return (
    <>
      <LinkedSectionHeading href="/markets/coins" label="Market Summary" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mt-4">
        {mockCryptoData.map((coin) => (
          <CryptoMarketCard
            key={coin.id}
            iconSrc={coin.iconSrc}
            name={coin.name}
            symbol={coin.symbol}
            price={coin.price}
            currency={coin.currency}
            changePercent={coin.changePercent}
            variant="split"
          />
        ))}
      </div>
    </>
  );
}