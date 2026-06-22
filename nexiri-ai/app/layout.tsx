import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Header />
          <main style={{ minHeight: "80vh" }}>
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}