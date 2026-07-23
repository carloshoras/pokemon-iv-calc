import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_PATH = path.join(process.cwd(), "src", "data", "pokemon-list.json");
const POKEMON_LIST_URL = "https://pokeapi.co/api/v2/pokemon?limit=20000";
const CONCURRENCY = 20;
const MAX_GENERATION = 9;

const GENERATION_NAME_TO_NUMBER = {
    "generation-i": 1,
    "generation-ii": 2,
    "generation-iii": 3,
    "generation-iv": 4,
    "generation-v": 5,
    "generation-vi": 6,
    "generation-vii": 7,
    "generation-viii": 8,
    "generation-ix": 9,
};

function formatDisplayName(rawName) {
    const specialCases = {
        "mr-mime": "Mr. Mime",
        "mime-jr": "Mime Jr.",
        "ho-oh": "Ho-Oh",
        "porygon-z": "Porygon-Z",
        "jangmo-o": "Jangmo-o",
        "hakamo-o": "Hakamo-o",
        "kommo-o": "Kommo-o",
        "type-null": "Type: Null",
        "mr-rime": "Mr. Rime",
    };

    if (specialCases[rawName]) {
        return specialCases[rawName];
    }

    return rawName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function toBaseStats(stats) {
    // se crea objeto con 
    const statMap = Object.fromEntries(
        stats.map((stat) => [stat.stat.name, stat.base_stat])
    );

    return {
        hp: statMap["hp"] ?? 0,
        atk: statMap["attack"] ?? 0,
        def: statMap["defense"] ?? 0,
        spAtk: statMap["special-attack"] ?? 0,
        spDef: statMap["special-defense"] ?? 0,
        spd: statMap["speed"] ?? 0,
    };
}

const STAT_NAME_MAPPING = {
    "hp": "hp",
    "attack": "atk",
    "defense": "def",
    "special-attack": "spAtk",
    "special-defense": "spDef",
    "speed": "spd",
};

async function fetchPokemonByUrl(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed fetching pokemon detail from ${url}`);
    }

    return response.json();
}

async function fetchAllPokemonRefs() {
    const response = await fetch(POKEMON_LIST_URL);

    if (!response.ok) {
        throw new Error("Failed fetching pokemon list from PokeAPI");
    }

    const listResponse = await response.json();
    return listResponse.results ?? [];
}

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

function getGenerationNumber(generationName) {
    return GENERATION_NAME_TO_NUMBER[generationName] ?? null;
}

function getSpeciesIdFromUrl(speciesUrl) {
    const match = speciesUrl.match(/\/pokemon-species\/(\d+)\/?$/);
    return match ? Number(match[1]) : null;
}

function inferIntroGeneration(speciesId) {
    if (speciesId <= 151) return 1;
    if (speciesId <= 251) return 2;
    if (speciesId <= 386) return 3;
    if (speciesId <= 493) return 4;
    if (speciesId <= 649) return 5;
    if (speciesId <= 721) return 6;
    if (speciesId <= 809) return 7;
    if (speciesId <= 905) return 8;
    return 9;
}

function inferEra(genStart, genEnd) {
    if (genStart >= 1 && genStart <= 2 && genEnd <= 2 && genEnd != null) return 'RETRO'
    if (genStart > 2) return 'MODERN'
    return 'RETRO/MODERN'
}

function buildStatSegments(pokemon) {
    let currentBaseStats = toBaseStats(pokemon.stats)
    let numOfChanges = pokemon.past_stats.length - 1
    let currentGen = null
    let statSegments = []
    for (let i = numOfChanges; i >= 0; i--) {
        // console.log("pokemon", pokemon.name)
        const currentPokemonPastStats = pokemon.past_stats[i]
        if (currentPokemonPastStats.generation.name === "generation-i" &&
            currentPokemonPastStats.stats.length === 1 &&
            currentPokemonPastStats.stats[0].stat.name === "special" &&
            currentPokemonPastStats.stats[0].base_stat === currentBaseStats.spAtk &&
            currentBaseStats.spAtk === currentBaseStats.spDef
        ) break
        let startGen = GENERATION_NAME_TO_NUMBER[currentPokemonPastStats.generation.name] + 1 //2
        let endGen = currentGen //null

        statSegments.push({
            "eraStart": startGen,
            "eraEnd": endGen,
            "baseStats": currentBaseStats,  //39hp, 52atk, 43def, 60spAtk, 50spDef, 65spd
            "genEra": inferEra(startGen, endGen)
        })
        currentGen = GENERATION_NAME_TO_NUMBER[currentPokemonPastStats.generation.name] //1
        let statsChanged = {}
        for (let stat of currentPokemonPastStats.stats) {
            const statChanged = stat.stat.name
            const statChangedValue = stat.base_stat
            if (statChanged === 'special') {
                statsChanged = { spAtk: statChangedValue, spDef: statChangedValue }
            } else {
                statsChanged[STAT_NAME_MAPPING[statChanged]] = statChangedValue
            }
        }
        console.log(pokemon.name, statsChanged)
        currentBaseStats = { ...currentBaseStats, ...statsChanged }

    }

    //         currentGen = past_stats[i].generation //5

    // 


    //caso special y mas de una stat cambiada
    //         currentBaseStats = { ...currentBaseStats, stat.name: stats.base_stat }
    //     }


    // }
    // console.log({
    //     "eraStart": inferIntroGeneration(pokemon.id),
    //     "eraEnd": currentGen,
    //     "baseStats": currentBaseStats,
    //     "genEra": inferEra(inferIntroGeneration(pokemon.id), currentGen)
    // })

    statSegments.push({
        "eraStart": inferIntroGeneration(pokemon.id),
        "eraEnd": currentGen,
        "baseStats": currentBaseStats,
        "genEra": inferEra(inferIntroGeneration(pokemon.id), currentGen)
    })

    return statSegments

}




// const pastCheckpoints = (pokemon.past_stats ?? [])
//     .map((pastStatsEntry) => ({
//         endGen: getGenerationNumber(pastStatsEntry.generation.name),
//         stats: toBaseStats(pastStatsEntry.stats),
//     }))
//     .filter((entry) => entry.endGen !== null)
//     .sort((a, b) => a.endGen - b.endGen);


function getStatsForGeneration(segments, generation) {
    const segment = segments.find(
        (currentSegment) =>
            currentSegment.startGen <= generation && generation <= currentSegment.endGen
    );

    return segment?.stats;
}

function getSpecificEra(startGeneration) {
    if (startGeneration <= 1) return "GEN_1";
    if (startGeneration <= 2) return "GEN_2";
    if (startGeneration <= 5) return "GEN_3";
    return "GEN_6";
}

function getRangeLabel(startGeneration, endGeneration) {
    if (endGeneration === null) {
        return `Gen ${startGeneration}+`;
    }

    if (startGeneration === endGeneration) {
        return `Gen ${startGeneration}`;
    }

    return `Gen ${startGeneration}-${endGeneration}`;
}

function getRangeIdSuffix(startGeneration, endGeneration) {
    if (endGeneration === null) {
        return `gen${startGeneration}plus`;
    }

    if (startGeneration === endGeneration) {
        return `gen${startGeneration}`;
    }

    return `gen${startGeneration}-${endGeneration}`;
}

function buildPokemonEntriesByEra(pokemon) {
    //Name to put below the image
    const displayName = formatDisplayName(pokemon.name);
    const spriteUrl =
        pokemon.sprites.other?.["official-artwork"]?.front_default ??
        pokemon.sprites.front_default ??
        "";
    const segments = buildStatSegments(pokemon);

    return segments
        .map((segment) => {
            //"Gen 2-5"
            const rangeLabel = getRangeLabel(segment.eraStart, segment.eraEnd);
            //"gen6plus"
            const rangeIdSuffix = getRangeIdSuffix(segment.eraStart, segment.eraEnd);

            // console.log("BALOO", {
            //     id: `${pokemon.id}-${rangeIdSuffix}`,
            //     pokedexId: pokemon.id,
            //     displayName,
            //     label: `${displayName} (${rangeLabel})`,
            //     genEra: segment.genEra,
            //     eraStart: segment.eraStart,
            //     eraEnd: segment.eraEnd,
            //     baseStats: segment.baseStats,
            //     spriteUrl,
            // })

            return {
                id: `${pokemon.id}-${rangeIdSuffix}`,
                pokedexId: pokemon.id,
                displayName,
                label: `${displayName} (${rangeLabel})`,
                genEra: segment.genEra,
                eraStart: segment.eraStart,
                eraEnd: segment.eraEnd,
                baseStats: segment.baseStats,
                spriteUrl,
            };


        })

    // return targetEras
    //     .map((era) => {
    //         if (introGeneration > era.end) {
    //             return null;
    //         }

    //         const effectiveStart = Math.max(era.start, introGeneration);
    //         const statsForEra = getStatsForGeneration(segments, effectiveStart);

    //         if (!statsForEra) {
    //             return null;
    //         }

    //         const rangeLabel = getRangeLabel(effectiveStart, era.end);
    //         const rangeIdSuffix = getRangeIdSuffix(effectiveStart, era.end);

    //         return {
    //             id: `${pokemon.id}-${rangeIdSuffix}`,
    //             pokedexId: pokemon.id,
    //             displayName,
    //             label: `${displayName} (${rangeLabel})`,
    //             genEra: effectiveStart <= 2 ? "RETRO" : "MODERN",
    //             specificEra: getSpecificEra(effectiveStart),
    //             eraStart: effectiveStart,
    //             eraEnd: era.end === Infinity ? null : era.end,
    //             baseStats: statsForEra,
    //             spriteUrl,
    //         };
    //     })
    //     .filter((entry) => entry !== null);
}

async function main() {
    // Calls endpoint to obtain all pokemon in an array: [{name, url}, {name, url}]
    const refs = await fetchAllPokemonRefs();
    // chunks = [[20 pokemon], [20 pokemon], ...]
    const chunks = chunkArray(refs, CONCURRENCY);

    let fetched = [];
    let failedCount = 0;

    for (const chunk of chunks) {
        // List of promises {status: 'fulfilled', value: object}
        const results = await Promise.allSettled(
            chunk.map((ref) => fetchPokemonByUrl(ref.url))
        );

        // Array of objects with the data for each pokemon of the chunk
        const fulfilled = results
            .filter((result) => result.status === "fulfilled")
            .map((result) => {
                return result.value
            }
            );

        // Array of objects with the data for each pokemon
        fetched = fetched.concat(fulfilled);
        failedCount += results.length - fulfilled.length;
    }
    const allPokemons = fetched
        .flatMap((pokemon) => buildPokemonEntriesByEra(pokemon))
        .sort((a, b) => {
            if (a.pokedexId !== b.pokedexId) {
                return a.pokedexId - b.pokedexId;
            }
            return a.eraStart - b.eraStart;
        });

    await writeFile(OUTPUT_PATH, JSON.stringify(allPokemons, null, 2) + "\n", "utf-8");

    console.log(`Generated ${allPokemons.length} pokemon into ${OUTPUT_PATH}`);
    if (failedCount > 0) {
        console.warn(`Skipped ${failedCount} failed fetches.`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});