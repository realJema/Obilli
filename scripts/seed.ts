import { seedDatabase } from "@/lib/supabase/seed-data"

async function main() {
  try {
    await seedDatabase()
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

main()

