"use client"

import { useState, useEffect } from "react"
import { useLetta } from "@/hooks/use-letta"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"
import { DEFAULT_USER_PROFILE_CONTENT } from "@/lib/constants"
import { cn } from "@/lib/utils" // Make sure cn is imported

interface UserProfileEditorProps {
  isDialogMode?: boolean
}

export function UserProfileEditor({ isDialogMode = false }: UserProfileEditorProps) {
  const { sharedUserProfileContent, updateSharedUserProfileContent, isUserProfileLoading, apiKey } = useLetta()
  const [profileText, setProfileText] = useState(sharedUserProfileContent || DEFAULT_USER_PROFILE_CONTENT)
  const { toast } = useToast()

  useEffect(() => {
    if (sharedUserProfileContent) {
      setProfileText(sharedUserProfileContent)
    } else if (apiKey) {
      // If API key exists but no content, means it might be loading or default
      setProfileText(DEFAULT_USER_PROFILE_CONTENT)
    }
  }, [sharedUserProfileContent, apiKey])

  const handleSaveProfile = async () => {
    if (!profileText.trim()) {
      toast({
        title: "Error",
        description: "Profile content cannot be empty.",
        variant: "destructive",
      })
      return
    }
    await updateSharedUserProfileContent(profileText)
  }

  // This component now primarily returns the form elements.
  // The Dialog component itself will provide the modal "card" structure.
  return (
    <div
      className={cn(
        "space-y-4",
        isDialogMode ? "py-1" : "w-full bg-card/80 backdrop-blur-sm border-border shadow-xl rounded-xl p-6",
      )}
    >
      {!isDialogMode && ( // Only show card header if not in dialog (though this mode is now unused)
        <div className="flex flex-row items-center gap-3 space-y-0 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold">Your Shared Profile</h3>
            <p className="text-xs text-muted-foreground">
              This info helps AIs personalize conversations. It can be updated by you or the agents.
            </p>
          </div>
        </div>
      )}
      <div>
        <Textarea
          id="user-profile"
          placeholder="Describe yourself, your interests, or any preferences..."
          value={profileText}
          onChange={(e) => setProfileText(e.target.value)}
          rows={isDialogMode ? 8 : 5} // More rows for dialog
          disabled={isUserProfileLoading}
          className={cn("min-h-[150px]", isDialogMode ? "" : "bg-background/50")}
        />
        {isUserProfileLoading && !sharedUserProfileContent && (
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading your profile...
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={isUserProfileLoading || profileText === sharedUserProfileContent}
          className="bg-sky-500 hover:bg-sky-600 text-white"
        >
          {isUserProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isUserProfileLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  )
}
