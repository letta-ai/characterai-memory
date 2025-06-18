"use client"

import { useState, useEffect, useCallback } from "react"
import type { Character } from "@/lib/types"
import { CharacterCard } from "@/components/character-card"
import { getAllCharacters } from "@/lib/get-character-data.server"
import { useLetta } from "@/hooks/use-letta"
import { getAllAgentsMap } from "@/lib/letta-agent-utils"
import { Loader2, Search, RefreshCw, Settings, UserCircle, Sparkles } from "lucide-react" // Added Sparkles
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeveloperSettingsDialog } from "@/components/developer-settings-dialog"
import { UserProfileDialog } from "@/components/user-profile-dialog"

export default function HomePage() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true)
  const { client, apiKey, isUserProfileLoading, sharedUserProfileBlockId } = useLetta()
  const [existingAgentsMap, setExistingAgentsMap] = useState<Map<string, string>>(new Map())
  const [isLoadingAgents, setIsLoadingAgents] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCharacters = useCallback(async () => {
    setIsLoadingCharacters(true)
    try {
      const chars = await getAllCharacters()
      setAllCharacters(chars)
      setFilteredCharacters(chars)
    } catch (error) {
      console.error("Failed to fetch characters:", error)
    } finally {
      setIsLoadingCharacters(false)
    }
  }, [])

  const fetchAgents = useCallback(async () => {
    if (!client) return
    setIsLoadingAgents(true)
    try {
      const agentsMap = await getAllAgentsMap(client)
      setExistingAgentsMap(agentsMap)
    } catch (error) {
      console.error("HomePage: Failed to fetch agents list:", error)
      setExistingAgentsMap(new Map())
    } finally {
      setIsLoadingAgents(false)
    }
  }, [client])

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  useEffect(() => {
    if (apiKey && client) {
      fetchAgents()
    } else {
      setExistingAgentsMap(new Map())
    }
  }, [apiKey, client, fetchAgents])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCharacters(allCharacters)
    } else {
      setFilteredCharacters(
        allCharacters.filter(
          (char) =>
            char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            char.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [searchTerm, allCharacters])

  const handleAgentReset = useCallback(async () => {
    await fetchAgents()
  }, [fetchAgents])

  if (isLoadingCharacters && allCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50">
        <Loader2 className="h-16 w-16 animate-spin text-sky-400" />
        <p className="mt-6 text-xl font-medium">Loading Avatars of Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 px-4 md:px-8 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400 animate-subtle-pulse-glow">
            CharacterPlus
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-xs md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Discover characters..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {apiKey && sharedUserProfileBlockId && (
              <UserProfileDialog>
                <Button variant="ghost" size="icon" aria-label="User Profile">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </UserProfileDialog>
            )}
            <DeveloperSettingsDialog>
              <Button variant="ghost" size="icon" aria-label="Developer Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </DeveloperSettingsDialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-sky-400" />
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500">
                Explore Characters
              </h2>
            </div>
            {apiKey && (
              <Button
                onClick={fetchAgents}
                disabled={isLoadingAgents || isUserProfileLoading}
                variant="outline"
                size="sm"
              >
                {isLoadingAgents ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Agents
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => {
              const agentName = `character_${character.handle}`
              const agentId = existingAgentsMap.get(agentName)
              return (
                <CharacterCard
                  key={character.handle}
                  character={character}
                  agentId={agentId}
                  onAgentReset={handleAgentReset}
                  isProfileLoading={isUserProfileLoading}
                  apiKey={apiKey}
                />
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
