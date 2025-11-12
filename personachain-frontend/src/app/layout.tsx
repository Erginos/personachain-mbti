import type { Metadata } from "next";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaChain",
  description: "Discover your personality on-chain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
