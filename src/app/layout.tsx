import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Function to fetch site settings
async function getSiteSettings() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });
  
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_name, site_description, favicon_url, logo_url")
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching site settings:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: settings?.site_name || "Obilli - Classified Marketplace",
    description: settings?.site_description || "Buy and sell goods, services, and find jobs in Cameroon",
    keywords: ["marketplace", "classified", "cameroon", "buy", "sell", "services", "jobs", "obilli"],
    icons: {
      icon: settings?.favicon_url || "/favicon.ico",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const logoUrl = settings?.logo_url || "/logo.png";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <Header logoUrl={logoUrl} />
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