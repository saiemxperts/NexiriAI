export default function CoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="coin-layout">
      {/* No dropdown navigation here */}
      <h1>fk</h1>
      <div className="coin-content">
        {children}
      </div>
    </div>
  );
}