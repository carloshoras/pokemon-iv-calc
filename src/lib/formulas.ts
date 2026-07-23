import { IVResults, Observation, StatKey, UserInputData } from "@/types/calculator";
import { BaseStats } from "@/types/pokemon";
import { range } from "@/utils/utils";

type NatureStat = Exclude<StatKey, "hp">;

interface NatureData {
    label: string;
    increased: NatureStat | null;
    decreased: NatureStat | null;
}

export const NATURES: Record<string, NatureData> = {
    hardy: { label: 'Hardy (neutral)', increased: null, decreased: null },
    lonely: { label: 'Lonely (+Atk, -Def)', increased: 'atk', decreased: 'def' },
    brave: { label: 'Brave (+Atk, -Spd)', increased: 'atk', decreased: 'spd' },
    adamant: { label: 'Adamant (+Atk, -Sp.Atk)', increased: 'atk', decreased: 'spAtk' },
    naughty: { label: 'Naughty (+Atk, -Sp.Def)', increased: 'atk', decreased: 'spDef' },
    bold: { label: 'Bold (+Def, -Atk)', increased: 'def', decreased: 'atk' },
    docile: { label: 'Docile (neutral)', increased: null, decreased: null },
    relaxed: { label: 'Relaxed (+Def, -Spd)', increased: 'def', decreased: 'spd' },
    impish: { label: 'Impish (+Def, -Sp.Atk)', increased: 'def', decreased: 'spAtk' },
    lax: { label: 'Lax (+Def, -Sp.Def)', increased: 'def', decreased: 'spDef' },
    timid: { label: 'Timid (+Spd, -Atk)', increased: 'spd', decreased: 'atk' },
    hasty: { label: 'Hasty (+Spd, -Def)', increased: 'spd', decreased: 'def' },
    serious: { label: 'Serious (neutral)', increased: null, decreased: null },
    jolly: { label: 'Jolly (+Spd, -Sp.Atk)', increased: 'spd', decreased: 'spAtk' },
    naive: { label: 'Naive (+Spd, -Sp.Def)', increased: 'spd', decreased: 'spDef' },
    modest: { label: 'Modest (+Sp.Atk, -Atk)', increased: 'spAtk', decreased: 'atk' },
    mild: { label: 'Mild (+Sp.Atk, -Def)', increased: 'spAtk', decreased: 'def' },
    quiet: { label: 'Quiet (+Sp.Atk, -Spd)', increased: 'spAtk', decreased: 'spd' },
    bashful: { label: 'Bashful (neutral)', increased: null, decreased: null },
    rash: { label: 'Rash (+Sp.Atk, -Sp.Def)', increased: 'spAtk', decreased: 'spDef' },
    calm: { label: 'Calm (+Sp.Def, -Atk)', increased: 'spDef', decreased: 'atk' },
    gentle: { label: 'Gentle (+Sp.Def, -Def)', increased: 'spDef', decreased: 'def' },
    sassy: { label: 'Sassy (+Sp.Def, -Spd)', increased: 'spDef', decreased: 'spd' },
    careful: { label: 'Careful (+Sp.Def, -Sp.Atk)', increased: 'spDef', decreased: 'spAtk' },
    quirky: { label: 'Quirky (neutral)', increased: null, decreased: null },
};

const STAT_KEYS: StatKey[] = ["hp", "atk", "def", "spAtk", "spDef", "spd"];

export const getNatureMultiplier = (nature: string | undefined, statKey: StatKey): number => {
    const natureStats = nature ? NATURES[nature] : undefined;
    if (natureStats?.increased === statKey) return 1.1;
    if (natureStats?.decreased === statKey) return 0.9;
    return 1
}

export const calculatePossibleIVs = (
    statKey: StatKey,
    baseStat: number,
    possibleIVs: number[],
    level: number,
    ev: number = 0,
    multiplier: number,
    actualStat: number
): number[] => {
    let newPossibleIVs: number[] = []
    if (statKey === "hp") {
        for (let possibleIV of possibleIVs) {
            const result = Math.floor(((2 * baseStat + possibleIV + Math.floor(ev / 4)) * level) / 100) + level + 10;
            if (result === actualStat) newPossibleIVs.push(possibleIV)

        }
    } else {
        for (let possibleIV of possibleIVs) {
            const base = Math.floor(((2 * baseStat + possibleIV + Math.floor(ev / 4)) * level) / 100) + 5;
            const result = Math.floor(base * multiplier);
            if (result === actualStat) newPossibleIVs.push(possibleIV)
        }
    }
    console.log({ newPossibleIVs })
    return newPossibleIVs
}



export const determinePossibleIVs = (
    userInputData: UserInputData,
    baseStats: BaseStats
): IVResults => {
    let IVs = {} as IVResults
    for (let statKey of STAT_KEYS) {
        console.log("Baloo", statKey)
        const multiplier = getNatureMultiplier(userInputData.nature ?? undefined, statKey);
        let possibleIVs = range(0, 32);
        let i = 0;
        // while we still have more than one candidate and we haven't checked for all conversations
        while (possibleIVs.length > 1 && i < userInputData.observations.length) {
            const currentObservation = userInputData.observations[i];
            const ev = currentObservation.evs?.[statKey] ?? 0;
            const actualStat = currentObservation.stats[statKey];
            console.log({ possibleIVs })
            possibleIVs = calculatePossibleIVs(
                statKey,
                baseStats[statKey],
                possibleIVs,
                currentObservation.level,
                ev,
                multiplier,
                actualStat
            );
            i++;
        }
        IVs[statKey] = possibleIVs
    }
    return IVs
}

function getCandidatesForObservation(
    observation: Observation,
    statKey: StatKey,
    baseStat: number,
    nature: string
): number[] {
    const observedValue = observation.stats[statKey];
    const ev = observation.evs?.[statKey] ?? 0;
    const candidates: number[] = [];

    for (let iv = 0; iv <= 31; iv++) {
        const value = calculateStatValue(statKey, baseStat, iv, observation.level, ev, nature);
        if (value === observedValue) {
            candidates.push(iv);
        }
    }

    return candidates;
}