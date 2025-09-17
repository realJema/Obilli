import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Obilli - Classified Marketplace",
  description: "Buy and sell goods, services, and find jobs in Cameroon",
  keywords: ["marketplace", "classified", "cameroon", "buy", "sell", "services", "jobs"],
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <CategoryNav />
            <main className="flex-1 pb-16 md:pb-0 relative">
              {children}
            </main>
            <Footer />
            <MobileNav className="md:hidden" />
          </div>
        </Providers>
      </body>
    </html>
  );
}