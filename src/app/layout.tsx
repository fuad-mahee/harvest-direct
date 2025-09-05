import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harvest Direct - Farm to Table Fresh Produce",
  description: "Connect directly with local farmers for the freshest, most sustainable produce. No middlemen, just pure quality from farm to your table.",
  keywords: "fresh produce, local farmers, organic food, farm to table, sustainable farming",
  authors: [{ name: "Harvest Direct Team" }],
  openGraph: {
    title: "Harvest Direct - Farm to Table Fresh Produce",
    description: "Connect directly with local farmers for the freshest, most sustainable produce.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <ConditionalNavigation />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
