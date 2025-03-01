export const categories = [
  {
    id: "1",
    name: "Graphics & Design",
    slug: "graphics-design",
    subgroups: [
      {
        id: "1-1",
        name: "Logo & Brand Identity",
        slug: "logo-brand-identity",
        subcategories: [
          {
            id: "1-1-1",
            name: "Logo Design",
            slug: "logo-design",
          },
          {
            id: "1-1-2",
            name: "Brand Style Guides",
            slug: "brand-style-guides",
          },
          {
            id: "1-1-3",
            name: "Business Cards & Stationery",
            slug: "business-cards",
          },
        ],
      },
      {
        id: "1-2",
        name: "Web & App Design",
        slug: "web-app-design",
        subcategories: [
          {
            id: "1-2-1",
            name: "Website Design",
            slug: "website-design",
          },
          {
            id: "1-2-2",
            name: "App Design",
            slug: "app-design",
          },
          {
            id: "1-2-3",
            name: "UX Design",
            slug: "ux-design",
          },
        ],
      },
      {
        id: "1-3",
        name: "Art & Illustration",
        slug: "art-illustration",
        subcategories: [
          {
            id: "1-3-1",
            name: "Illustration",
            slug: "illustration",
          },
          {
            id: "1-3-2",
            name: "AI Artists",
            slug: "ai-artists",
          },
          {
            id: "1-3-3",
            name: "Portrait Art",
            slug: "portrait-art",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Digital Marketing",
    slug: "digital-marketing",
    subgroups: [
      {
        id: "2-1",
        name: "Search Marketing",
        slug: "search-marketing",
        subcategories: [
          {
            id: "2-1-1",
            name: "SEO",
            slug: "seo",
          },
          {
            id: "2-1-2",
            name: "Local SEO",
            slug: "local-seo",
          },
        ],
      },
      {
        id: "2-2",
        name: "Social Media",
        slug: "social-media",
        subcategories: [
          {
            id: "2-2-1",
            name: "Social Media Marketing",
            slug: "social-media-marketing",
          },
          {
            id: "2-2-2",
            name: "Influencer Marketing",
            slug: "influencer-marketing",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Programming & Tech",
    slug: "programming-tech",
    subgroups: [
      {
        id: "3-1",
        name: "Website Development",
        slug: "website-development",
        subcategories: [
          {
            id: "3-1-1",
            name: "Web Applications",
            slug: "web-applications",
          },
          {
            id: "3-1-2",
            name: "E-Commerce Development",
            slug: "ecommerce-development",
          },
        ],
      },
      {
        id: "3-2",
        name: "Mobile Development",
        slug: "mobile-development",
        subcategories: [
          {
            id: "3-2-1",
            name: "iOS Development",
            slug: "ios-development",
          },
          {
            id: "3-2-2",
            name: "Android Development",
            slug: "android-development",
          },
        ],
      },
    ],
  },
] as const

export type Category = (typeof categories)[number]
export type Subgroup = Category["subgroups"][number]
export type Subcategory = Subgroup["subcategories"][number]

