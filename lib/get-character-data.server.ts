"use server"

import { promises as fs } from "fs"
import path from "path"
import type { Character } from "./types"

const charactersFilePath = path.join(process.cwd(), "lib/characters.json")

// Cache for character data to avoid reading file on every call in the same server instance/request lifecycle
let allCharactersCache: Character[] | null = null

async function loadCharacters(): Promise<Character[]> {
  if (process.env.NODE_ENV === "development" || !allCharactersCache) {
    // In development, always reload to reflect changes. In production, cache it.
    const jsonData = await fs.readFile(charactersFilePath, "utf-8")
    allCharactersCache = JSON.parse(jsonData) as Character[]
  }
  return allCharactersCache!
}

export async function getCharacterByHandleServer(handle: string): Promise<Character | undefined> {
  const characters = await loadCharacters()
  return characters.find((char) => char.handle === handle)
}

export async function getAllCharacters(): Promise<Character[]> {
  return loadCharacters()
}
