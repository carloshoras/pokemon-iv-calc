export type GenEra = "RETRO" | "MODERN"
export type StatKey = "hp" | "atk" | "def" | "spAtk" | "spDef" | "spd";

//Objeto que tendrá TODAS las StatKey como llaves y sus respectivos valores seran numeros
export type Stats = Record<StatKey, number>;
//Como el objeto de arriba, pero con el Partial le decimos a TS que no tienen por qué estar TODAS las keys de StatKey

export interface Observation {
    level: number;
    stats: Stats;
    evs: EVs;
    id: string;
}

export interface UserInputData {
    genEra: GenEra;
    pokemonId: string;
    nature?: string;
    observations: Observation[];
}

export type IVResults = Record<StatKey, number[]>;

export type EVs = Record<StatKey, number>