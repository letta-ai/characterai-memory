import { promises as fs } from "fs"
import path from "path"
import type { Character } from "./types"

// This assumes your characters.json is in the `lib` directory.
// For Next.js, when deploying, files outside of `public` or specific Next.js directories
// might not be directly accessible via fs in serverless functions in the same way as in local dev.
// However, for `page.tsx` (Server Component) during build or SSR, this should work.
// If issues arise in deployment, consider moving characters.json to `public` and fetching it,
// or embedding it directly if small. For now, this approach is fine for development.
const charactersFilePath = path.join(process.cwd(), "lib/characters.json")

let allCharactersCache: Character[] | null = null

async function loadCharacters(): Promise<Character[]> {
  // In a server environment, this cache might be per request or per instance depending on deployment.
  // For simplicity, we'll use a simple module-level cache.
  if (process.env.NODE_ENV === "development" || !allCharactersCache) {
    const jsonData = await fs.readFile(charactersFilePath, "utf-8")
    allCharactersCache = JSON.parse(jsonData) as Character[]
  }
  return allCharactersCache!
}

export async function getCharacterByHandle(handle: string): Promise<Character | undefined> {
  const characters = await loadCharacters()
  return characters.find((char) => char.handle === handle)
}

export async function getAllCharacters(): Promise<Character[]> {
  return loadCharacters()
}
