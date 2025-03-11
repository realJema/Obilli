import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            servicely
          </Link>
          <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="w-full pl-10" placeholder="Search for any service..." />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-green-600 hover:bg-green-700">Join</Button>
          </div>
        </div>
      </header>

      <MainNav />

      <main className="container py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Find the perfect service for your needs</h1>
          <p className="text-lg text-muted-foreground">
            From design to development, marketing to music - get any service you need, when you need it.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Popular Services</h2>
          <Button variant="ghost">View All</Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Link
              key={i}
              href="#"
              className="group overflow-hidden rounded-lg border bg-card transition-colors hover:border-green-600"
            >
              <div className="aspect-video relative">
                <Image
                  src={`/placeholder.svg?height=200&width=300`}
                  alt="Service thumbnail"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <span className="font-medium">Seller Name</span>
                </div>
                <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-green-600">
                  I will create a professional website design for your business
                </h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-sm">Starting at</span>
                  <span className="text-base font-semibold text-foreground">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XAF',
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0
                    }).format(29)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="my-12">
          <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              "Graphics & Design",
              "Digital Marketing",
              "Writing & Translation",
              "Video & Animation",
              "Music & Audio",
              "Programming & Tech",
              "Business",
              "Lifestyle",
            ].map((category) => (
              <Button key={category} variant="outline" className="h-auto py-4 text-base">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

