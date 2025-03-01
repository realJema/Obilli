"use client"

import { useQuery } from "@tanstack/react-query"
import type { Category } from "@/lib/store/categories"
import { MainNavClient } from "./main-nav-client"

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  const data = await response.json()
  return data.data
}

export function MainNav() {
  const { data: categories, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  })

  // If there's an error, log it and return minimal UI
  if (isError) {
    console.error("Error fetching categories:", error)
    return (
      <div className="border-b">
        <div className="container">
          <div className="h-12" />
        </div>
      </div>
    )
  }

  // If no categories are returned, return minimal UI
  if (!categories || categories.length === 0) {
    return (
      <div className="border-b">
        <div className="container">
          <div className="h-12" />
        </div>
      </div>
    )
  }

  return <MainNavClient categories={categories} />
}

