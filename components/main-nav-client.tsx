"use client"

import Link from "next/link"
import { useEffect } from "react"
import type { Category } from "@/lib/store/categories"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface MainNavClientProps {
  categories: Category[]
}

export function MainNavClient({ categories }: MainNavClientProps) {
  useEffect(() => {
    // Log categories data when component mounts
    console.log("MainNavClient received categories:", categories)
  }, [categories])

  // Early return with minimal UI if no categories
  if (!categories?.length) {
    console.warn("MainNavClient: No categories provided")
    return (
      <div className="border-b">
        <div className="container">
          <div className="h-12" />
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="border-b">
        <div className="container">
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap">
              {categories.map((category) => {
                // Log each category being rendered
                console.log("Rendering category:", category.name)
                
                return (
                  <NavigationMenuItem key={category.id}>
                    <NavigationMenuTrigger className="h-12 text-base">
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-4 md:w-[700px] md:grid-cols-2 lg:w-[800px]">
                        {category.subgroups.map((subgroup) => (
                          <div key={subgroup.id} className="space-y-2">
                            <Link
                              href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}`}
                              className="block text-base font-medium leading-none mb-2 hover:text-green-600"
                            >
                              {subgroup.name}
                            </Link>
                            <ul className="space-y-1">
                              {subgroup.subcategories.map((subcategory) => (
                                <li key={subcategory.id}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={`/filter?category=${category.slug}&subgroup=${subgroup.slug}&subcategory=${subcategory.slug}`}
                                      className="block select-none space-y-1 rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in MainNavClient:", error)
    // Return minimal UI in case of error
    return (
      <div className="border-b">
        <div className="container">
          <div className="h-12" />
        </div>
      </div>
    )
  }
}

