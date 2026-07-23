import { GenEra } from "./calculator";

export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  spd: number;
}


export interface PokemonEntry {
  id: string;          // Ej: "71-gen1", "71-gen2", "71-gen6"
  pokedexId: number;   // Ej: 71
  displayName: string; // Ej: "Victreebel"
  label: string;       // Ej: "Victreebel (Gen 2-5)"
  genEra: GenEra;
  specificEra: string; // Para detalles finos: "GEN_1", "GEN_2", "GEN_6", etc.
  eraStart: number;    // Primera generación donde aplican estas stats
  eraEnd: number | null; // Última generación (null = en adelante)
  baseStats: BaseStats;
  spriteUrl: string;
}