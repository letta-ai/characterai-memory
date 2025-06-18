"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserProfileEditor } from "@/components/user-profile-editor" // We'll use the existing editor logic
import type React from "react"

interface UserProfileDialogProps {
  children: React.ReactNode // The trigger element (profile icon button)
}

export function UserProfileDialog({ children }: UserProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit Your Shared Profile</DialogTitle>
          <DialogDescription>
            This information is shared with all AI characters to help them personalize conversations. Agents can also
            update this profile.
          </DialogDescription>
        </DialogHeader>
        <UserProfileEditor isDialogMode={true} />
      </DialogContent>
    </Dialog>
  )
}
