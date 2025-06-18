"use client"

import { LettaClient, type BlockResponse } from "@letta-ai/letta-client"
import { createContext, useContext, useState, useMemo, useCallback, type ReactNode, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  SHARED_USER_PROFILE_BLOCK_LABEL,
  DEFAULT_USER_PROFILE_CONTENT,
  SHARED_USER_PROFILE_BLOCK_DESCRIPTION,
} from "@/lib/constants"

const LETTA_API_KEY_STORAGE_KEY = "letta-api-key"
const SHARED_USER_PROFILE_BLOCK_ID_STORAGE_KEY = "letta-shared-profile-block-id"

interface LettaContextType {
  apiKey: string | null
  setApiKey: (key: string | null) => void
  client: LettaClient | null
  sharedUserProfileBlockId: string | null
  sharedUserProfileContent: string | null
  loadOrCreateSharedUserProfileBlock: (apiClient: LettaClient) => Promise<string | null> // Returns blockId or null
  updateSharedUserProfileContent: (newContent: string) => Promise<void>
  isUserProfileLoading: boolean
}

const LettaContext = createContext<LettaContextType | undefined>(undefined)

export function LettaProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyInternal] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LETTA_API_KEY_STORAGE_KEY)
    }
    return null
  })

  const [sharedUserProfileBlockId, setSharedUserProfileBlockIdInternal] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SHARED_USER_PROFILE_BLOCK_ID_STORAGE_KEY)
    }
    return null
  })

  const [sharedUserProfileContent, setSharedUserProfileContent] = useState<string | null>(null)
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(false)
  const { toast } = useToast()

  const client = useMemo(() => {
    if (apiKey) {
      console.log("Creating new LettaClient instance with API key.")
      return new LettaClient({ token: apiKey })
    }
    console.log("API key is null, client is null.")
    return null
  }, [apiKey])

  const setAndStoreSharedUserProfileBlockId = useCallback((blockId: string | null) => {
    setSharedUserProfileBlockIdInternal(blockId)
    if (blockId) {
      localStorage.setItem(SHARED_USER_PROFILE_BLOCK_ID_STORAGE_KEY, blockId)
    } else {
      localStorage.removeItem(SHARED_USER_PROFILE_BLOCK_ID_STORAGE_KEY)
    }
  }, [])

  const loadOrCreateSharedUserProfileBlock = useCallback(
    async (apiClient: LettaClient): Promise<string | null> => {
      if (!apiClient) {
        console.error("loadOrCreateSharedUserProfileBlock: apiClient is null")
        return null
      }
      setIsUserProfileLoading(true)
      console.log(
        `Attempting to load or create shared user profile block with label: ${SHARED_USER_PROFILE_BLOCK_LABEL}`,
      )
      try {
        const existingBlocks = await apiClient.blocks.list({ label: SHARED_USER_PROFILE_BLOCK_LABEL, limit: 1 })
        console.log("Existing blocks response:", existingBlocks)

        let userProfileBlock: BlockResponse | undefined = undefined
        if (existingBlocks && Array.isArray(existingBlocks.data) && existingBlocks.data.length > 0) {
          userProfileBlock = existingBlocks.data[0]
        } else if (existingBlocks && Array.isArray(existingBlocks) && existingBlocks.length > 0) {
          userProfileBlock = existingBlocks[0] as BlockResponse
        }

        if (userProfileBlock) {
          console.log("Found existing shared user profile block:", userProfileBlock)
          setAndStoreSharedUserProfileBlockId(userProfileBlock.id)
          setSharedUserProfileContent(userProfileBlock.value)
          // toast({ title: "User Profile Loaded", description: "Your shared profile has been loaded." }) // Toast can be repetitive if content also loads
          return userProfileBlock.id
        } else {
          console.log("No existing shared user profile block found. Creating a new one.")
          const newBlock = await apiClient.blocks.create({
            label: SHARED_USER_PROFILE_BLOCK_LABEL,
            value: DEFAULT_USER_PROFILE_CONTENT,
            description: SHARED_USER_PROFILE_BLOCK_DESCRIPTION,
          })
          console.log("Created new shared user profile block:", newBlock)
          setAndStoreSharedUserProfileBlockId(newBlock.id)
          setSharedUserProfileContent(newBlock.value)
          toast({ title: "User Profile Created", description: "A new shared profile has been created for you." })
          return newBlock.id
        }
      } catch (error) {
        console.error("Error loading or creating shared user profile block:", error)
        toast({
          title: "Profile Error",
          description: "Could not load or create your shared user profile.",
          variant: "destructive",
        })
        setAndStoreSharedUserProfileBlockId(null) // Clear on error
        setSharedUserProfileContent(null)
        return null
      } finally {
        setIsUserProfileLoading(false)
      }
    },
    [toast, setAndStoreSharedUserProfileBlockId],
  )

  const setApiKey = useCallback(
    (key: string | null) => {
      setApiKeyInternal(key)
      if (key) {
        localStorage.setItem(LETTA_API_KEY_STORAGE_KEY, key)
        const tempClient = new LettaClient({ token: key })
        loadOrCreateSharedUserProfileBlock(tempClient).catch(console.error)
      } else {
        localStorage.removeItem(LETTA_API_KEY_STORAGE_KEY)
        setAndStoreSharedUserProfileBlockId(null)
        setSharedUserProfileContent(null)
      }
    },
    [loadOrCreateSharedUserProfileBlock, setAndStoreSharedUserProfileBlockId],
  )

  useEffect(() => {
    async function fetchProfileContent() {
      if (apiKey && client && sharedUserProfileBlockId && !sharedUserProfileContent && !isUserProfileLoading) {
        console.log(
          `API key and Block ID (${sharedUserProfileBlockId}) exist, but content is missing. Fetching content.`,
        )
        setIsUserProfileLoading(true)
        try {
          // Use client.blocks.retrieve() as per the user's provided documentation
          const block = await client.blocks.retrieve(sharedUserProfileBlockId)
          if (block) {
            setSharedUserProfileContent(block.value)
            console.log("Successfully fetched shared profile content on reload/init.")
            toast({ title: "User Profile Loaded", description: "Your profile content has been loaded." })
          } else {
            console.warn("Block ID found in storage, but block not found on server. Clearing stored ID.")
            setAndStoreSharedUserProfileBlockId(null)
          }
        } catch (error) {
          console.error("Error fetching shared user profile content on reload/init:", error)
          toast({
            title: "Profile Content Error",
            description: `Could not fetch your profile content. ${error instanceof Error ? error.message : "Unknown error"}`,
            variant: "destructive",
          })
        } finally {
          setIsUserProfileLoading(false)
        }
      }
    }
    fetchProfileContent()
  }, [
    apiKey,
    client,
    sharedUserProfileBlockId,
    sharedUserProfileContent,
    isUserProfileLoading,
    toast,
    setAndStoreSharedUserProfileBlockId,
  ])

  const updateSharedUserProfileContent = useCallback(
    async (newContent: string) => {
      if (!client || !sharedUserProfileBlockId) {
        toast({
          title: "Error",
          description: "Cannot update profile. Client or Block ID missing.",
          variant: "destructive",
        })
        return
      }
      setIsUserProfileLoading(true)
      try {
        await client.blocks.modify(sharedUserProfileBlockId, { value: newContent })
        setSharedUserProfileContent(newContent)
        toast({ title: "Profile Updated", description: "Your shared profile has been saved." })
      } catch (error) {
        console.error("Error updating shared user profile content:", error)
        toast({
          title: "Update Failed",
          description: `Could not save your profile. ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setIsUserProfileLoading(false)
      }
    },
    [client, sharedUserProfileBlockId, toast],
  )

  const value = {
    apiKey,
    setApiKey,
    client,
    sharedUserProfileBlockId,
    sharedUserProfileContent,
    loadOrCreateSharedUserProfileBlock,
    updateSharedUserProfileContent,
    isUserProfileLoading,
  }

  return <LettaContext.Provider value={value}>{children}</LettaContext.Provider>
}

export function useLetta() {
  const context = useContext(LettaContext)
  if (context === undefined) {
    throw new Error("useLetta must be used within a LettaProvider")
  }
  return context
}
