"use client"

import Link from "next/link"
import type { Category } from "@/lib/store/categories"

interface FooterClientProps {
  categories: Category[]
}

export function FooterClient({ categories }: FooterClientProps) {
  // Early return with minimal footer if no categories
  if (!categories?.length) {
    return (
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="mt-12 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 Obilli. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-muted py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-lg font-semibold">
                <Link href={`/filter?category=${category.slug}`} className="hover:text-primary">
                  {category.name}
                </Link>
              </h3>
              <ul className="space-y-2">
                {category.subgroups.map((subgroup) => (
                  <li key={subgroup.id}>
                    <Link
                      href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {subgroup.name}
                    </Link>
                    <ul className="mt-1 ml-4 space-y-1">
                      {subgroup.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <Link
                            href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}&subcategory=${subcategory.slug}`}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 Obilli. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

