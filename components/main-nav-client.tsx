"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { Category } from "@/lib/store/categories"
import HorizontalMenu from "@/app/components/HorizontalMenu"

interface MainNavClientProps {
  categories: Category[]
}

export function MainNavClient({ categories }: MainNavClientProps) {
  const categoryItems = categories.map((category) => (
    <NavigationMenuItem key={category.id} className="flex-shrink-0">
      <NavigationMenuTrigger className="h-12 text-base px-4 group">
        <Link 
          href={`/filter?category=${category.slug}`} 
          className="hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {category.name}
        </Link>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-screen max-w-7xl bg-popover">
          <div className="container">
            <div className="grid gap-x-8 gap-y-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {category.subgroups.map((subgroup) => (
                <div key={subgroup.id} className="space-y-4">
                  <Link
                    href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}`}
                    className="text-lg font-medium leading-none hover:text-primary"
                  >
                    {subgroup.name}
                  </Link>
                  <ul className="space-y-3">
                    {subgroup.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}&subcategory=${subcategory.slug}`}
                          className="text-base text-muted-foreground hover:text-primary transition-colors"
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  ));

  return (
    <div className="border-b">
      <div className="container py-1">
        <NavigationMenu>
          <div className="relative w-full px-6">
            <HorizontalMenu items={categoryItems} />
          </div>
        </NavigationMenu>
      </div>
    </div>
  )
}

