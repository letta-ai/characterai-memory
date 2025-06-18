"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ApiKeyForm } from "@/components/api-key-form"
import type React from "react"

interface DeveloperSettingsDialogProps {
  children: React.ReactNode // The trigger element, which will be the settings icon button
}

export function DeveloperSettingsDialog({ children }: DeveloperSettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Developer Settings</DialogTitle>
          <DialogDescription>Enter your Letta API key to configure the application.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ApiKeyForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
