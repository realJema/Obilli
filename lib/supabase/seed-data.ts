import { supabase } from "./client"
import { categories } from "@/lib/config/categories"

const SAMPLE_IMAGES = [
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/800/600?random=2",
  "https://picsum.photos/800/600?random=3",
  "https://picsum.photos/800/600?random=4",
  "https://picsum.photos/800/600?random=5",
]

const SAMPLE_LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Miami, FL",
  "Seattle, WA",
  "Boston, MA",
  "Austin, TX",
]

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"]

async function createSampleUsers() {
  const users = [
    {
      email: "john@example.com",
      password: "password123",
      profile: {
        username: "johndoe",
        full_name: "John Doe",
        bio: "Professional photographer with 10 years of experience",
        location: "New York, NY",
      },
    },
    {
      email: "sarah@example.com",
      password: "password123",
      profile: {
        username: "sarahsmith",
        full_name: "Sarah Smith",
        bio: "Digital artist and graphic designer",
        location: "Los Angeles, CA",
      },
    },
    {
      email: "mike@example.com",
      password: "password123",
      profile: {
        username: "mikeross",
        full_name: "Mike Ross",
        bio: "Web developer and UI/UX designer",
        location: "Chicago, IL",
      },
    },
  ]

  const createdUsers = []

  for (const user of users) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    })

    if (authError) {
      console.error("Error creating user:", authError)
      continue
    }

    if (!authData.user) continue

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      ...user.profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      continue
    }

    createdUsers.push({ ...authData.user, profile: user.profile })
  }

  return createdUsers
}

async function seedCategories() {
  const createdCategories: Record<string, string> = {}

  try {
    for (const category of categories) {
      const { data: mainCategory, error: mainError } = await supabase
        .from("categories")
        .insert({
          name: category.title,
          slug: category.title.toLowerCase().replace(/\s+/g, "-"),
        })
        .select("id")
        .single()

      if (mainError) throw mainError
      createdCategories[category.title] = mainCategory.id

      for (const subgroup of category.subgroups) {
        const { data: subCategory, error: subError } = await supabase
          .from("categories")
          .insert({
            name: subgroup.name,
            slug: subgroup.name.toLowerCase().replace(/\s+/g, "-"),
            parent_id: mainCategory.id,
          })
          .select("id")
          .single()

        if (subError) throw subError
        createdCategories[subgroup.name] = subCategory.id

        const subcategoryInserts = subgroup.subcategories.map((subcategory) => ({
          name: subcategory,
          slug: subcategory.toLowerCase().replace(/\s+/g, "-"),
          parent_id: subCategory.id,
        }))

        const { error: subcatError } = await supabase.from("categories").insert(subcategoryInserts)

        if (subcatError) throw subcatError
      }
    }

    return createdCategories
  } catch (error) {
    console.error("Error seeding categories:", error)
    throw error
  }
}

async function createSampleListings(users: any[], categoryIds: Record<string, string>) {
  const listings = []

  // Create 20 sample listings
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const categoryKeys = Object.keys(categoryIds)
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)]

    const listing = {
      title: `Sample Listing ${i + 1}`,
      description: `This is a detailed description for sample listing ${i + 1}. It includes all the necessary information about the product or service being offered.`,
      price: Math.floor(Math.random() * 900) + 100,
      category_id: categoryIds[randomCategory],
      seller_id: user.id,
      condition: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
      location: SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)],
      images: SAMPLE_IMAGES.slice(0, Math.floor(Math.random() * 3) + 2),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("listings").insert(listing).select("id").single()

    if (error) {
      console.error("Error creating listing:", error)
      continue
    }

    listings.push({ ...listing, id: data.id })
  }

  return listings
}

async function createSampleReviews(users: any[], listings: any[]) {
  const reviews = []

  for (const listing of listings) {
    // Create 1-3 reviews per listing
    const numReviews = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < numReviews; i++) {
      const reviewer = users[Math.floor(Math.random() * users.length)]

      // Don't allow self-reviews
      if (reviewer.id === listing.seller_id) continue

      const review = {
        listing_id: listing.id,
        reviewer_id: reviewer.id,
        rating: Math.floor(Math.random() * 3) + 3, // Ratings between 3-5
        comment: `This is a ${["great", "fantastic", "excellent", "good"][Math.floor(Math.random() * 4)]} listing! Review #${i + 1}`,
        helpful_count: Math.floor(Math.random() * 10),
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("reviews").insert(review)

      if (error) {
        console.error("Error creating review:", error)
        continue
      }

      reviews.push(review)
    }
  }

  return reviews
}

export async function seedDatabase() {
  try {
    console.log("Creating sample users...")
    const users = await createSampleUsers()
    console.log(`Created ${users.length} users`)

    console.log("Seeding categories...")
    const categoryIds = await seedCategories()
    console.log("Categories seeded successfully")

    console.log("Creating sample listings...")
    const listings = await createSampleListings(users, categoryIds)
    console.log(`Created ${listings.length} listings`)

    console.log("Creating sample reviews...")
    const reviews = await createSampleReviews(users, listings)
    console.log(`Created ${reviews.length} reviews`)

    console.log("Database seeded successfully!")
    return { users, listings, reviews }
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

