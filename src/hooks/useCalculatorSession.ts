import { IVResults, Observation, StatKey, UserInputData } from "@/types/calculator";
import { useState } from "react";
import { determinePossibleIVs } from '@/lib/formulas';
import { PokemonEntry } from "@/types/pokemon";


// Valores iniciales
const initialObservation: Observation = {
    level: 32,
    stats: {
        hp: 100,
        atk: 81,
        def: 50,
        spAtk: 67,
        spDef: 49,
        spd: 59,
    },
    evs: {
        hp: 0,
        atk: 0,
        def: 0,
        spAtk: 0,
        spDef: 0,
        spd: 0,
    },
    id: Date.now().toString()
};

// const initialResults: IVResults = {
//     hp: [],
//     atk: [],
//     def: [],
//     spAtk: [],
//     spDef: [],
//     spd: [],
// };

const initialInputData: UserInputData = {
    genEra: "MODERN",
    pokemonId: "",
    nature: "",
    observations: [initialObservation],
}

export function useCalculatorSession() {
    const [observations, setObservations] = useState<Observation[]>([initialObservation]);
    const [userInputData, setUserInputData] = useState<UserInputData>(initialInputData);
    const [results, setResults] = useState<IVResults | null>(null);

    const handleSubmit = (selectedPokemon: PokemonEntry) => {
        // Auxiliar updatedUserInputData with new stats/ev's introduced by the user
        const updatedUserInputData = {
            ...userInputData,
            observations: observations
        }

        setUserInputData(updatedUserInputData)
        const calculated = determinePossibleIVs(updatedUserInputData, selectedPokemon.baseStats);
        setResults(calculated)
    }

    //Handle change in genEra, pokemon selected or nature
    const handleMetaChange = (field: "genEra" | "pokemonId" | "nature", value: string) => {
        console.log("ferlakjkj", field, value)
        setUserInputData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    //Handle change in the stats and update state variable Observations
    const handleObservationStatChange = (id: string, field: StatKey, value: number) => {
        setObservations(prev => prev.map(obs =>
            obs.id === id
                ? { ...obs, stats: { ...obs.stats, [field]: value } }
                : obs
        ))
    }

    //Handle change in the EV's and update state variable Observations
    const handleObservationEVChange = (id: string, field: StatKey, value: number) => {
        setObservations(prev => prev.map(obs =>
            obs.id === id
                ? { ...obs, evs: { ...obs.evs, [field]: value } }
                : obs
        ))
    }

    //Handle change in the level and update state variable Observations
    const handleObservationLevelChange = (id: string, value: number) => {
        setObservations(prev => prev.map(obs =>
            obs.id == id
                ? { ...obs, level: value }
                : obs
        ))
    }

    //Add a new line to fill out with level/stats/EV's
    const addObservation = () => {
        const newLevel = observations[observations.length - 1].level + 1

        const newObservation: Observation = {
            level: newLevel,
            stats: {
                hp: 0,
                atk: 0,
                def: 0,
                spAtk: 0,
                spDef: 0,
                spd: 0,
            },
            evs: {
                hp: 0,
                atk: 0,
                def: 0,
                spAtk: 0,
                spDef: 0,
                spd: 0,
            },
            id: Date.now().toString()
        }
        setObservations(prev => [...prev, newObservation])
    }

    //Delete line with level/stats/EV's
    const removeObservation = (id: string) => {
        setObservations(prev => prev.filter(obs => obs.id !== id))
    }

    return {
        observations,
        userInputData,
        results,
        handleMetaChange,
        addObservation,
        removeObservation,
        handleObservationStatChange,
        handleObservationEVChange,
        handleObservationLevelChange,
        handleSubmit
    };

}