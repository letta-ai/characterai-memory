import type { LettaClient, AgentResponse, AgentListResponse } from "@letta-ai/letta-client"

/**
 * Fetches all agents, handling pagination.
 * @param client The LettaClient instance.
 * @returns A Map of agent names to agent IDs.
 */
export async function getAllAgentsMap(client: LettaClient): Promise<Map<string, string>> {
  const agentsMap = new Map<string, string>()
  let cursor: string | undefined = undefined
  let page = 1
  console.log("Starting to fetch all agents...")

  do {
    try {
      console.log(`Fetching page ${page} of agents with cursor: ${cursor}`)
      const response: AgentListResponse = await client.agents.list({ cursor: cursor, limit: 50 }) // Fetch 50 per page
      console.log(`Response from agents.list (page ${page}):`, JSON.parse(JSON.stringify(response)))

      const agentsOnPage: AgentResponse[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
          ? (response as unknown as AgentResponse[]) // Handle if API returns array directly
          : []

      if (agentsOnPage.length > 0) {
        agentsOnPage.forEach((agent) => {
          if (agent.name && agent.id) {
            agentsMap.set(agent.name, agent.id)
          }
        })
        console.log(`Fetched ${agentsOnPage.length} agents on page ${page}. Total in map: ${agentsMap.size}`)
      } else {
        console.log(`No agents found on page ${page}.`)
      }

      cursor = (response as any).next_cursor // Standard pagination cursor
      page++
    } catch (error) {
      console.error(`Error fetching page ${page} of agents:`, error)
      cursor = undefined // Stop pagination on error
    }
  } while (cursor)

  console.log(`Finished fetching all agents. Total found: ${agentsMap.size}`)
  return agentsMap
}

/**
 * Finds an agent by its exact name, using the getAllAgentsMap for a comprehensive search.
 * @param client The LettaClient instance.
 * @param name The exact name of the agent to find.
 * @returns The found agent ID or undefined.
 */
export async function findAgentIdByName(client: LettaClient, name: string): Promise<string | undefined> {
  console.log(`Searching for agent ID for name: "${name}" using comprehensive list.`)
  const allAgents = await getAllAgentsMap(client)
  return allAgents.get(name)
}
