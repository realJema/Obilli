import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "./providers"
import { constructMetadata } from "@/lib/metadata"
import { GoogleTagManager } from "@/components/google-tag-manager"
import { Analytics } from "@vercel/analytics/react"

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <GoogleTagManager />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
