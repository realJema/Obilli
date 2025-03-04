"use client"

import { useState } from "react"
import { Edit, Trash, Rocket, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProfileListingCardProps {
  listing: any
  variant?: "default" | "compact"
}

export function ProfileListingCard({ listing, variant }: ProfileListingCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBoostDialog, setShowBoostDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/listings/${listing.id}/edit`)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const supabase = createClientComponentClient()
      
      // Delete the listing
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id)

      if (error) throw error

      toast.success("Listing deleted successfully")
      router.refresh()
    } catch (error) {
      console.error("Error deleting listing:", error)
      toast.error("Failed to delete listing")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleView = () => {
    router.push(`/listings/${listing.id}`)
  }

  return (
    <div className="group relative">
      <ListingCard listing={listing} variant={variant} />
      
      {/* Overlay with Actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3 p-4 w-full max-w-[80%]">
          <Button
            variant="secondary"
            className="bg-white hover:bg-white/90 text-black"
            onClick={handleView}
          >
            <Eye className="h-5 w-5 mr-2" />
            View
          </Button>

          <Button
            variant="secondary"
            className="bg-white hover:bg-white/90 text-black"
            onClick={handleEdit}
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </Button>

          <Button
            variant="secondary"
            className="bg-white hover:bg-white/90 text-black"
            onClick={() => setShowBoostDialog(true)}
          >
            <Rocket className="h-5 w-5 mr-2" />
            Boost
          </Button>

          <Button
            variant="secondary"
            className="bg-white hover:bg-white/90 text-destructive hover:bg-destructive hover:text-white"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-5 w-5 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boost Dialog */}
      <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Boost Listing</DialogTitle>
            <DialogDescription>
              Coming soon! Boost your listing to reach more potential buyers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBoostDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
