"use client"

import type React from "react"
import { useState } from "react"
import { useLetta } from "@/hooks/use-letta"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LettaClient } from "@letta-ai/letta-client"
import { Loader2, KeyRound } from "lucide-react"

export function ApiKeyForm() {
  const { apiKey, setApiKey } = useLetta()
  const [keyInput, setKeyInput] = useState(apiKey || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyInput) {
      toast({ title: "Error", description: "API Key cannot be empty.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const tempClient = new LettaClient({ token: keyInput })
      await tempClient.agents.list({ limit: 1 })
      setApiKey(keyInput)
      toast({
        title: "Connection Successful",
        description: "Your Letta API key is valid and has been saved.",
      })
    } catch (error) {
      toast({ title: "Invalid API Key", description: "Please check your key and try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="api-key"
          type="password"
          placeholder="lk-..."
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          disabled={isLoading}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? "Testing..." : "Save and test connection"}
      </Button>
    </form>
  )
}
