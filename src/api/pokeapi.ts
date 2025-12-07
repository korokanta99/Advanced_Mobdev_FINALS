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

export async function getPokemonList(offset = 0, limit = 151) { // Limit to 151 or 200 for initial scope
  try {
    // Fetch a paginated list of Pokemon
    const res = await fetch(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`);
    const data = await res.json();
    // You might need a second step to fetch full details for each Pokemon in the list
    return data.results;
  } catch (err) {
    console.error("Error fetching Pokémon list:", err);
    throw err;
  }
}
