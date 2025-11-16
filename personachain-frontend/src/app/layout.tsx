'use client';

import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Navigation />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
