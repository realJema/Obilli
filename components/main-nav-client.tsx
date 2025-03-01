"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { Category } from "@/lib/store/categories"

interface MainNavClientProps {
  categories: Category[]
}

export function MainNavClient({ categories }: MainNavClientProps) {
  return (
    <div className="border-b">
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap">
            {categories.map((category) => (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger className="h-12 text-base">
                  <Link href={`/filter?category=${category.slug}`} className="hover:text-primary">
                    {category.name}
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] gap-3 p-4 md:w-[700px] md:grid-cols-2 lg:w-[800px]">
                    {category.subgroups.map((subgroup) => (
                      <div key={subgroup.id} className="space-y-2">
                        <Link
                          href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}`}
                          className="block text-base font-medium leading-none mb-2 hover:text-primary"
                        >
                          {subgroup.name}
                        </Link>
                        <ul className="space-y-1">
                          {subgroup.subcategories.map((subcategory) => (
                            <li key={subcategory.id}>
                              <Link
                                href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}&subcategory=${subcategory.slug}`}
                                className="block select-none space-y-1 rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {subcategory.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

