"use client"

import { useState } from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { Category } from "@/lib/store/categories"
import React from "react"
import { cn } from "@/lib/utils"

interface MainNavClientProps {
  categories: Category[]
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <Link
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        {children}
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function MainNavClient({ categories }: MainNavClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="h-9"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <ul className="grid w-[500px] gap-3 p-4 grid-cols-2">
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/filter?category=${category.slug}`}
                >
                  <ul className="mt-2 space-y-1">
                    {category.subgroups?.map((subgroup) => (
                      <li key={subgroup.id}>
                        <Link
                          href={`/filter?category=${subgroup.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {subgroup.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
} 
