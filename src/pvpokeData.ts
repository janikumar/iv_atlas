export type LeagueKey = 'little' | 'great' | 'ultra' | 'master'
export type IvSpread = { rank: number; ivs: [number, number, number]; cp: number; level: number; attack: number; defense: number; hp: number; product: number }
export type LeagueResult = { speciesId: string; speciesName: string; rank: number; rating: number; score: number; cp: number; level: number; ivs: [number, number, number]; attack: number; defense: number; hp: number; tier: 'S' | 'A' | 'B' }
export type AtlasPokemon = { speciesId: string; speciesName: string; image: string; types: string[]; baseStats: { attack: number; defense: number; stamina: number }; evolutions: string[]; leagues: Partial<Record<LeagueKey, LeagueResult>> }
type RankingRow = { speciesId?: string; speciesName?: string; rank?: number; rating?: number; score?: number }
type GameMasterPokemon = { speciesId?: string; speciesName?: string; dex?: number; types?: string[]; baseStats?: { atk?: number; def?: number; hp?: number }; family?: { parent?: string; evolutions?: string[] } }

const ROOT = 'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data'
const rankingUrls: Record<LeagueKey, string> = { little: `${ROOT}/rankings/all/overall/rankings-500.json`, great: `${ROOT}/rankings/all/overall/rankings-1500.json`, ultra: `${ROOT}/rankings/all/overall/rankings-2500.json`, master: `${ROOT}/rankings/all/overall/rankings-10000.json` }
export const leagueCaps: Record<LeagueKey, number> = { little: 500, great: 1500, ultra: 2500, master: 10000 }
// Exact PvPoke CPM values for every half level from 1 through 51.
// The array index is (level - 1) * 2. Never interpolate or round these values.
const cpMultipliers = [
  0.0939999967813491, 0.135137430784308, 0.166397869586944, 0.192650914456886,
  0.215732470154762, 0.236572655026622, 0.255720049142837, 0.273530381100769,
  0.290249884128570, 0.306057381335773, 0.321087598800659, 0.335445032295077,
  0.349212676286697, 0.362457748778790, 0.375235587358474, 0.387592411085168,
  0.399567276239395, 0.411193549517250, 0.422500014305114, 0.432926413410414,
  0.443107545375824, 0.453059953871985, 0.462798386812210, 0.472336077786704,
  0.481684952974319, 0.490855810259008, 0.499858438968658, 0.508701756943992,
  0.517393946647644, 0.525942508771329, 0.534354329109191, 0.542635762230353,
  0.550792694091796, 0.558830599438087, 0.566754519939422, 0.574569153785168,
  0.582278907299041, 0.589887911977272, 0.597400009632110, 0.604823657502073,
  0.612157285213470, 0.619404110566050, 0.626567125320434, 0.633649181622743,
  0.640652954578399, 0.647580963301656, 0.654435634613037, 0.661219263506722,
  0.667934000492096, 0.674581899290818, 0.681164920330047, 0.687684905887771,
  0.694143652915954, 0.700542893277978, 0.706884205341339, 0.713169102333341,
  0.719399094581604, 0.725575616972598, 0.731700003147125, 0.734741011137376,
  0.737769484519958, 0.740785574597326, 0.743789434432983, 0.746781208702482,
  0.749761044979095, 0.752729105305821, 0.755685508251190, 0.758630366519684,
  0.761563837528228, 0.764486065255226, 0.767397165298461, 0.770297273971590,
  0.773186504840850, 0.776064945942412, 0.778932750225067, 0.781790064808426,
  0.784636974334716, 0.787473583646825, 0.790300011634826, 0.792803950958807,
  0.795300006866455, 0.797803921486970, 0.800300002098083, 0.802803892322847,
  0.805299997329711, 0.807803863460723, 0.810299992561340, 0.812803834895026,
  0.815299987792968, 0.817803806620319, 0.820299983024597, 0.822803778631297,
  0.825299978256225, 0.827803750922782, 0.830299973487854, 0.832803753381377,
  0.835300028324127, 0.837803755931569, 0.840300023555755, 0.842803729034748,
  0.845300018787384, 0.847803702398935, 0.850300014019012, 0.852803676019539,
  0.855300009250640, 0.857803649892077, 0.860300004482269, 0.862803624012168,
  0.865299999713897
]

function rows(payload: unknown): RankingRow[] { if (Array.isArray(payload)) return payload as RankingRow[]; if (payload && typeof payload === 'object') { const value = payload as Record<string, unknown>; for (const key of ['rankings', 'data', 'results']) if (Array.isArray(value[key])) return value[key] as RankingRow[] } return [] }
function nameFor(name: string | undefined, id: string) { return name || id.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ') }
function cpFor(base: AtlasPokemon['baseStats'], ivs: [number, number, number], cpm: number) { return Math.max(10, Math.floor((base.attack + ivs[0]) * Math.sqrt(base.defense + ivs[1]) * Math.sqrt(base.stamina + ivs[2]) * cpm * cpm / 10)) }
function legalLevelIndex(base: AtlasPokemon['baseStats'], ivs: [number, number, number], cap: number) { let low = 0; let high = cpMultipliers.length - 1; while (low < high) { const middle = Math.ceil((low + high) / 2); if (cpFor(base, ivs, cpMultipliers[middle]) <= cap) low = middle; else high = middle - 1 } return low }
export function calculateStatsAtLevel(base: AtlasPokemon['baseStats'], ivs: [number, number, number], level: number) {
  const levelIndex = Math.max(0, Math.min(cpMultipliers.length - 1, Math.round((level - 1) * 2)))
  const cpm = cpMultipliers[levelIndex]
  const attack = (base.attack + ivs[0]) * cpm
  const defense = (base.defense + ivs[1]) * cpm
  const hp = Math.max(10, Math.floor((base.stamina + ivs[2]) * cpm))
  return { cp: cpFor(base, ivs, cpm), level: 1 + levelIndex / 2, attack, defense, hp, product: attack * defense * hp }
}
export function topIvSpreads(base: AtlasPokemon['baseStats'], cap: number, count = 100): IvSpread[] { const combinations: IvSpread[] = []; for (let attackIv = 0; attackIv <= 15; attackIv++) for (let defenseIv = 0; defenseIv <= 15; defenseIv++) for (let staminaIv = 0; staminaIv <= 15; staminaIv++) { const ivs: [number, number, number] = [attackIv, defenseIv, staminaIv]; const levelIndex = legalLevelIndex(base, ivs, cap); const cpm = cpMultipliers[levelIndex]; const attack = (base.attack + attackIv) * cpm; const defense = (base.defense + defenseIv) * cpm; const hp = Math.max(10, Math.floor((base.stamina + staminaIv) * cpm)); combinations.push({ rank: 0, ivs, cp: cpFor(base, ivs, cpm), level: 1 + levelIndex / 2, attack, defense, hp, product: attack * defense * hp }) } return combinations.sort((a, b) => b.product - a.product || b.cp - a.cp || a.ivs[0] - b.ivs[0] || a.ivs[1] - b.ivs[1] || a.ivs[2] - b.ivs[2]).slice(0, count).map((spread, index) => ({ ...spread, rank: index + 1 })) }
export function rankIvSpread(base: AtlasPokemon['baseStats'], cap: number, ivs: [number, number, number]): IvSpread { const ranked = topIvSpreads(base, cap, 4096); const found = ranked.find((spread) => spread.ivs[0] === ivs[0] && spread.ivs[1] === ivs[1] && spread.ivs[2] === ivs[2]); return found ?? ranked[ranked.length - 1] }

export async function loadAtlasData(): Promise<AtlasPokemon[]> {
  const [gmResponse, ...rankingResponses] = await Promise.all([fetch(`${ROOT}/gamemaster.json`), ...Object.values(rankingUrls).map((url) => fetch(url))]); if (!gmResponse.ok || rankingResponses.some((response) => !response.ok)) throw new Error('PvPoke data could not be loaded')
  const gameMaster = ((await gmResponse.json()) as { pokemon?: GameMasterPokemon[] }).pokemon ?? []; const byId = new Map(gameMaster.map((pokemon) => [pokemon.speciesId ?? '', pokemon])); const results = new Map<string, AtlasPokemon>();
  for (const pokemon of gameMaster) { if (!pokemon.speciesId || !pokemon.baseStats) continue; const baseStats = { attack: pokemon.baseStats.atk ?? 100, defense: pokemon.baseStats.def ?? 100, stamina: pokemon.baseStats.hp ?? 100 }; const item: AtlasPokemon = { speciesId: pokemon.speciesId, speciesName: nameFor(pokemon.speciesName, pokemon.speciesId), image: pokemon.dex ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dex}.png` : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', types: pokemon.types ?? [], baseStats, evolutions: [], leagues: {} }; results.set(item.speciesId, item) }
  const connected = (start: string, seen = new Set<string>()): string[] => { if (seen.has(start)) return [...seen]; seen.add(start); const pokemon = byId.get(start); const next = [...(pokemon?.family?.evolutions ?? []), ...(pokemon?.family?.parent ? [pokemon.family.parent] : [])]; next.forEach((id) => connected(id, seen)); return [...seen] }
  for (const item of results.values()) item.evolutions = connected(item.speciesId)
  const rankingSets = await Promise.all(rankingResponses.map((response) => response.json())); const keys = Object.keys(rankingUrls) as LeagueKey[]; keys.forEach((league, index) => rows(rankingSets[index]).forEach((row, rowIndex) => { if (!row.speciesId) return; const item = results.get(row.speciesId); if (!item) return; const rank = row.rank ?? rowIndex + 1; const spread = topIvSpreads(item.baseStats, leagueCaps[league], 1)[0]; item.leagues[league] = { speciesId: item.speciesId, speciesName: item.speciesName, rank, rating: row.rating ?? 0, score: row.score ?? 0, cp: spread.cp, level: spread.level, ivs: spread.ivs, attack: spread.attack, defense: spread.defense, hp: spread.hp, tier: rank <= 10 ? 'S' : rank <= 50 ? 'A' : 'B' } }))
  return [...results.values()]
}
