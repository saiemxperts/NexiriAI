import CryptoDropdownNav from "@/app/components/layout/CryptoDropdownNav";

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="crypto-layout">
      {/* Dropdown Navigation ONLY for crypto section */}
      <CryptoDropdownNav />
      <div className="crypto-content">
        {children}
      </div>
    </div>
  );
}