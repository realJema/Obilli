import { Metadata } from "next"

export const siteConfig = {
  name: "Obilli",
  description: "Everything You Need, Right Here.",
  url: "https://obilli.com", // Replace with your actual domain
  ogImage: "https://obilli.com/og.jpg", // Replace with your actual OG image URL
  links: {
    twitter: "https://twitter.com/obilli",
    github: "https://github.com/obilli"
  }
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
      description,
      images: [
        {
          url: image
        }
      ],
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US"
    },
    twitter: {
      card: "summary_large_image",
      title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
      description,
      images: [image],
      creator: "@obilli"
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}

export function constructListingMetadata({
  title,
  description,
  images,
  price,
  condition,
  location
}: {
  title: string
  description: string
  images: string[]
  price: number
  condition: string
  location: { name: string; parent?: { name: string } }
}): Metadata {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(price)

  const locationString = location.parent 
    ? `${location.name}, ${location.parent.name}`
    : location.name

  const metaDescription = `${title} - ${condition} condition - ${formattedPrice} - Located in ${locationString}. ${description.slice(0, 150)}...`

  return constructMetadata({
    title,
    description: metaDescription,
    image: images?.[0] || siteConfig.ogImage,
  })
}

export function constructProfileMetadata({
  username,
  fullName,
  bio,
  avatarUrl,
  totalListings,
  rating,
  location
}: {
  username: string
  fullName: string
  bio?: string | null
  avatarUrl?: string | null
  totalListings: number
  rating: number
  location?: string | null
}): Metadata {
  const description = `Check out ${fullName}'s profile on Obilli. ${
    bio ? bio + "." : ""
  } ${totalListings} listings · ${rating.toFixed(1)} stars${
    location ? ` · Based in ${location}` : ""
  }`

  return constructMetadata({
    title: `${fullName} (@${username})`,
    description,
    image: avatarUrl || siteConfig.ogImage,
  })
} 
