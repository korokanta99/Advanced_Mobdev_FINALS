// src/api/pokeapi.ts

const API_URL = "https://pokeapi.co/api/v2";

export async function getPokemonById(id: number) {
  try {
    const res = await fetch(`${API_URL}/pokemon/${id}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching Pokémon:", err);
    throw err;
  }
}

export async function searchPokemon(name: string) {
  try {
    const res = await fetch(`${API_URL}/pokemon/${name.toLowerCase()}`);
    return await res.json();
  } catch (err) {
    console.error("Search failed:", err);
    return null; // UI can handle "not found"
  }
}

export async function getPokemonList(offset = 0, limit = 151) {
  try {
    // 1. Fetch the list of names
    const res = await fetch(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`);
    const data = await res.json();

    // 2. CRITICAL STEP: Fetch full details (ID & Image) for each item
    // Without this, 'item.id' is undefined and the Pokedex stays empty.
    const detailedList = await Promise.all(
      data.results.map(async (item: any) => {
        const detailsResponse = await fetch(item.url);
        return await detailsResponse.json();
      })
    );

    return detailedList;
  } catch (err) {
    console.error("Error fetching Pokémon list:", err);
    throw err;
  }
}