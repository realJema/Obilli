"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, ThumbsUp, ChevronLeft, ChevronRight, Flag, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

// Sample images data
const serviceImages = [
  "/placeholder.svg?height=600&width=800&text=Main+Image",
  "/placeholder.svg?height=600&width=800&text=Image+2",
  "/placeholder.svg?height=600&width=800&text=Image+3",
  "/placeholder.svg?height=600&width=800&text=Image+4",
  "/placeholder.svg?height=600&width=800&text=Image+5",
]

// Sample reviews data
const reviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=50&width=50&text=SJ",
      country: "United States",
    },
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Exceptional work! The delivery was quick and the quality exceeded my expectations. Would definitely recommend!",
    helpful: 12,
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=50&width=50&text=MC",
      country: "Singapore",
    },
    rating: 4,
    date: "1 month ago",
    comment: "Great communication and good quality work. Would use this service again.",
    helpful: 8,
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      image: "/placeholder.svg?height=50&width=50&text=EW",
      country: "United Kingdom",
    },
    rating: 5,
    date: "2 months ago",
    comment: "Absolutely brilliant service! The attention to detail was impressive.",
    helpful: 15,
  },
]

// Sample similar listings data
const similarListings = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Similar service ${i + 1}`,
  description: "High-quality work delivered on time.",
  seller: {
    name: `Seller${i + 1}`,
    title: "Level 2 Seller",
    image: `/placeholder.svg?height=50&width=50&text=S${i + 1}`,
  },
  price: 29 + i * 10,
  rating: 4.5 + Math.random() * 0.5,
  reviews: 50 + i * 10,
  image: `/placeholder.svg?height=200&width=300&text=Service+${i + 1}`,
}))

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(serviceImages[0])
  const [startIndex, setStartIndex] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const visibleCount = 5

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + visibleCount >= similarListings.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setStartIndex((prevIndex) => (prevIndex === 0 ? similarListings.length - visibleCount : prevIndex - 1))
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle review submission here
    console.log({ rating, reviewText })
    setReviewText("")
    setRating(0)
  }

  const service = {
    id: params.id,
    title: "I will create a professional website design for your business",
    description:
      "Get a stunning, modern website design that will make your business stand out from the competition. I specialize in creating responsive, user-friendly designs that are optimized for conversions.\n\nMy service includes:\n\n• Custom website design tailored to your brand\n• Responsive layout for all devices\n• Modern UI/UX best practices\n• Design files in multiple formats\n• Detailed documentation\n• Regular communication and updates\n\nI follow a systematic approach to ensure your website design not only looks great but also delivers results. Each design is created with your specific business goals in mind, incorporating elements that drive user engagement and conversions.",
    price: 299,
    deliveryTime: 3,
    revisions: 2,
    rating: 4.9,
    reviews: 152,
    seller: {
      name: "DesignPro",
      image: "/placeholder.svg?height=80&width=80",
      level: "Level 2 Seller",
    },
  }

  // Calculate rating distribution
  const ratingDistribution = {
    5: 70,
    4: 20,
    3: 7,
    2: 2,
    1: 1,
  }

  return (
    <>
      <div className="container py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Link>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
            <div className="flex items-center mb-4">
              <Image
                src={service.seller.image || "/placeholder.svg"}
                alt={service.seller.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{service.seller.name}</p>
                <p className="text-sm text-muted-foreground">{service.seller.level}</p>
              </div>
            </div>

            {/* Main Image */}
            <div className="aspect-video relative mb-4">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Service preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {serviceImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === image ? "border-green-600" : "border-transparent hover:border-green-600/50"
                  }`}
                >
                  <Image src={image || "/placeholder.svg"} alt={`Preview ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Description Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div className="text-sm space-y-4 whitespace-pre-line">{service.description}</div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Reviews</h2>

              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="mb-8 space-y-4">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          i < (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button type="submit" disabled={!rating || !reviewText.trim()}>
                  Submit Review
                </Button>
              </form>

              {/* Reviews Stats and List */}
              <div className="space-y-6">
                <div className="flex items-start gap-8 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">{service.rating}</div>
                    <div className="flex items-center justify-center mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(service.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{service.reviews} reviews</div>
                  </div>
                  <div className="flex-1">
                    {Object.entries(ratingDistribution)
                      .reverse()
                      .map(([rating, percentage]) => (
                        <div key={rating} className="flex items-center gap-2 mb-2">
                          <div className="text-sm w-8">{rating} stars</div>
                          <Progress value={percentage} className="h-2" />
                          <div className="text-sm text-muted-foreground w-12">{percentage}%</div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={review.user.image} alt={review.user.name} />
                            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{review.user.name}</p>
                            <p className="text-sm text-muted-foreground">{review.user.country}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm mb-3">{review.comment}</p>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="border rounded-lg p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XAF',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  }).format(service.price)}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-muted-foreground ml-1">({service.reviews})</span>
                </div>
              </div>
              <p className="text-sm mb-4">
                Get your professional website design in just {service.deliveryTime} days with {service.revisions}{" "}
                revisions.
              </p>
              <Button className="w-full mb-4">Continue ({new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'XAF',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
              }).format(service.price)})</Button>
              <div className="text-sm text-muted-foreground mb-6">
                <p className="mb-2">This order includes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Professional website design</li>
                  <li>Responsive layout</li>
                  <li>Source files included</li>
                  <li>{service.revisions} revisions</li>
                </ul>
              </div>

              {/* Contact and Report Buttons */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button variant="ghost" className="w-full text-muted-foreground">
                  <Flag className="h-4 w-4 mr-2" />
                  Report Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings Section */}
      <div className="border-t">
        <div className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Similar Services</h2>
          <div className="relative">
            <div className="flex gap-6">
              {similarListings.slice(startIndex, startIndex + visibleCount).map((listing) => (
                <Link key={listing.id} href={`/services/${listing.id}`} className="w-1/5 group">
                  <div className="border rounded-lg overflow-hidden transition-colors hover:border-green-600 h-full flex flex-col">
                    <div className="aspect-video relative">
                      <Image
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={listing.seller.image} alt={listing.seller.name} />
                            <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{listing.seller.name}</p>
                            <p className="text-xs text-muted-foreground">{listing.seller.title}</p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-green-600 line-clamp-2">{listing.title}</h3>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-semibold">{listing.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground ml-1">({listing.reviews})</span>
                      </div>
                      <div className="mt-auto">
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="font-semibold">{new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: 'XAF',
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0
                        }).format(listing.price)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

