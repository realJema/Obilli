"use client"

import { useQuery } from "@tanstack/react-query"
import type { Category } from "@/lib/store/categories"
import { FooterClient } from "./footer-client"

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  const data = await response.json()
  return data.data
}

export function Footer() {
  const { data: categories, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  })

  // Return minimal footer if there's an error or no categories
  if (isError || !categories || categories.length === 0) {
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

  return <FooterClient categories={categories} />
}

