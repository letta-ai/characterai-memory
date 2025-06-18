"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Character } from "@/lib/types"
import { useLetta } from "@/hooks/use-letta"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw, Loader2, MessageSquarePlus, BrainCircuit, Lock } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CharacterCardProps {
  character: Character
  agentId: string | undefined
  onAgentReset: () => Promise<void>
  isProfileLoading: boolean
  apiKey: string | null
}

export function CharacterCard({ character, agentId, onAgentReset, isProfileLoading, apiKey }: CharacterCardProps) {
  const { client } = useLetta()
  const { toast } = useToast()
  const [isResetting, setIsResetting] = useState(false)
  const isInteractive = !!apiKey

  const handleResetAgent = async (e: React.MouseEvent) => {
    // No need for e.preventDefault() here as this button is not inside a Link anymore
    if (!agentId || !client) return
    setIsResetting(true)
    try {
      await client.agents.delete(agentId)
      toast({ title: "Agent Reset", description: `${character.name}'s agent has been deleted.` })
      await onAgentReset()
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" })
    } finally {
      setIsResetting(false)
    }
  }

  const CardBody = ({ children }: { children: React.ReactNode }) => (
    <div
      className={cn(
        "flex flex-col bg-card/80 backdrop-blur-sm border-border transition-all duration-300 ease-in-out shadow-lg rounded-xl overflow-hidden group h-full", // Ensure card takes full height for flex
        isInteractive ? "hover:border-sky-500/50 hover:shadow-sky-500/10" : "cursor-not-allowed",
      )}
    >
      {children}
    </div>
  )

  return (
    <CardBody>
      <CardHeader className="p-0 relative">
        <Image
          src={character.profilePicture || `/placeholder.svg?width=400&height=300&query=${character.name}+portrait`}
          alt={character.name}
          width={400}
          height={300}
          className={cn(
            "w-full h-48 object-cover transition-transform duration-300",
            isInteractive ? "group-hover:scale-105" : "grayscale-[50%]",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        {isInteractive && agentId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetAgent} // This button is NOT a link
            disabled={isResetting || isProfileLoading}
            className="absolute top-2 right-2 z-10 h-7 w-7 bg-black/30 hover:bg-destructive/80 text-white rounded-full"
            aria-label="Reset Agent"
          >
            {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold tracking-tight">{character.name}</CardTitle>
          {isInteractive &&
            (agentId ? (
              <Badge variant="outline" className="text-xs border-green-500/70 text-green-400 bg-green-500/10">
                <BrainCircuit className="mr-1 h-3 w-3" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs border-sky-500/70 text-sky-400 bg-sky-500/10">
                <MessageSquarePlus className="mr-1 h-3 w-3" /> New
              </Badge>
            ))}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1 mb-3">{character.shortDescription}</p>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50">
        {isInteractive ? (
          <Link
            href={`/chat/${character.handle}`}
            className="w-full"
            aria-disabled={isProfileLoading}
            onClick={(e) => {
              if (isProfileLoading) e.preventDefault()
            }}
          >
            <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white" disabled={isProfileLoading}>
              {isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Chat Now
            </Button>
          </Link>
        ) : (
          <Button className="w-full" disabled={true}>
            <Lock className="mr-2 h-4 w-4" />
            Chat Now
          </Button>
        )}
      </CardFooter>
    </CardBody>
  )
}
