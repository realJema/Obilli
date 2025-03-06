"use client"

import Link from "next/link"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContactButtonsProps {
  phoneNumber: string | null
  email: string | null
  listingTitle: string
}

export function ContactButtons({ phoneNumber, email, listingTitle }: ContactButtonsProps) {
  const formatPhoneNumber = (phone: string | null): string | null => {
    if (!phone) return null;
    
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If the number already starts with 237, remove it
    const withoutPrefix = cleaned.startsWith('237') ? cleaned.slice(3) : cleaned;
    
    // Check if the remaining number is valid (should be 9 digits for Cameroon)
    if (withoutPrefix.length !== 9) return null;
    
    // Return the formatted number with +237 prefix
    return `+237${withoutPrefix}`;
  }

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  return (
    <div className="flex flex-col gap-3">
      {/* Call Button */}
      <Button 
        className="w-full" 
        size="lg"
        variant="outline"
        asChild
      >
        <Link 
          href={formattedPhoneNumber ? `tel:${formattedPhoneNumber}` : "#"}
          onClick={(e) => {
            if (!formattedPhoneNumber) {
              e.preventDefault()
              alert("Seller's phone number is not available or invalid")
            }
          }}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Seller
        </Link>
      </Button>

      {/* WhatsApp Button */}
      <Button 
        className="w-full bg-green-600 hover:bg-green-700" 
        size="lg"
        asChild
      >
        <Link 
          href={formattedPhoneNumber 
            ? `https://wa.me/${formattedPhoneNumber.replace('+', '')}?text=Hi, I'm interested in your listing: ${listingTitle}`
            : "#"}
          target="_blank"
          onClick={(e) => {
            if (!formattedPhoneNumber) {
              e.preventDefault()
              alert("Seller's phone number is not available or invalid")
            }
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat on WhatsApp
        </Link>
      </Button>

      {/* Email Button */}
      <Button 
        className="w-full" 
        size="lg"
        variant="secondary"
        asChild
      >
        <Link 
          href={email ? `mailto:${email}?subject=Inquiry about: ${listingTitle}` : "#"}
          onClick={(e) => {
            if (!email) {
              e.preventDefault()
              alert("Seller's email is not available")
            }
          }}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </Link>
      </Button>
    </div>
  )
} 
