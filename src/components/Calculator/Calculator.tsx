'use client';

import { useMemo, useState } from 'react';
import { PokemonEntry } from '@/types/pokemon';
import GenSelector from '../GenSelector/GenSelector';
import { useCalculatorSession } from '@/hooks/useCalculatorSession';
import PokemonSelector from '../PokemonSelector';
import NatureSelector from '../NatureSelector';
import "./style.scss";
import StatsInputs from '../StatsInputs/StatsInputs';
import React from 'react';
import ToggleEV from '../ToggleEV/ToggleEV';
import { getIVBarPercentage, getIVGradeClass } from '@/utils/ivDisplay';
import IVbar from '../Results/IVbar/IVbar';
import Results from '../Results/Results';

interface Props {
  allPokemons: PokemonEntry[];
}

export default function Calculator({ allPokemons }: Props) {
  const [showEVs, setShowEVs] = useState(false)

  console.log({ allPokemons })

  const {
    observations,
    userInputData,
    results,
    handleMetaChange,
    addObservation,
    removeObservation,
    handleObservationStatChange,
    handleObservationEVChange,
    handleObservationLevelChange,
    handleSubmit } = useCalculatorSession();


  const filteredPokemons: PokemonEntry[] = useMemo(() => {
    const selectedRange = userInputData.genEra === "RETRO"
      ? { start: 1, end: 2 }
      : { start: 3, end: 9 };

    return allPokemons.filter((pokemon) => {
      const pokemonEnd = pokemon.eraEnd ?? Number.MAX_SAFE_INTEGER;
      return pokemon.eraStart <= selectedRange.end && pokemonEnd >= selectedRange.start;
    });
  }, [allPokemons, userInputData.genEra])

  const selectedPokemon: PokemonEntry | undefined = useMemo(() => {
    const selectedPokemonUser = filteredPokemons.find(pokemon => pokemon.id === userInputData.pokemonId);
    console.log({ selectedPokemonUser })
    return selectedPokemonUser
  }, [filteredPokemons, userInputData.pokemonId])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPokemon) {
      alert("Please select a pokemon")
      return;
    }
    handleSubmit(selectedPokemon)
  }

  return (
    <>
      <form
        className='form-calculator'
        onSubmit={handleFormSubmit}>
        <div className='first-row card'>
          <GenSelector
            selectedGen={userInputData.genEra}
            onChange={handleMetaChange} />
          <PokemonSelector
            filteredPokemons={filteredPokemons}
            selectedPokemon={selectedPokemon}
            onChange={handleMetaChange} />
          {userInputData.genEra === "MODERN" && (
            <NatureSelector selectedNature={userInputData.nature} onChange={handleMetaChange} />
          )}
        </div>
        <div className='observation-row card'>
          <div className="upper-buttons-row">
            <button
              type="button"
              className="add-observation"
              onClick={() => addObservation()}>
              <span>+</span> Add Level
            </button>
            <ToggleEV showEVs={showEVs} setShowEVs={setShowEVs} />
          </div>
          <StatsInputs
            observations={observations}
            handleObservationStatChange={handleObservationStatChange}
            handleObservationLevelChange={handleObservationLevelChange}
            removeObservation={removeObservation}
            showEVs={showEVs}
            handleObservationEVChange={handleObservationEVChange} />
          <div className='buttons-row'>
            <button
              type="submit"
              className="calculate-ivs">
              Calculate IVs
            </button>
          </div>
        </div>
        <div className='results card'>
          {userInputData.pokemonId && (
            <div className='image-pokemon'>
              <img
                src={selectedPokemon?.spriteUrl}
                width={150} />
              <span className='pokemon-name'>{selectedPokemon?.displayName}</span>
            </div>
          )}

          <Results results={results} />
        </div>
      </form>
    </>
  );
}


// export default function Calculator({ allPokemons }: Props) {


//   const filteredPokemons = allPokemons.filter(pokemon => pokemon.genGroup === genGroup);
//   const selectedPokemon = filteredPokemons.find(pokemon => pokemon.id === selectedIdPokemon);

//   const handleSubmitIVs = () => {
//     if (!selectedPokemon) return;

//     const newResults: IVResults = {
//       hp: calculatePossibleIVs('hp', selectedPokemon.baseStats.hp, userStats.hp, userStats.level, 0, userStats.nature),
//       atk: calculatePossibleIVs('atk', selectedPokemon.baseStats.atk, userStats.atk, userStats.level, 0, userStats.nature),
//       def: calculatePossibleIVs('def', selectedPokemon.baseStats.def, userStats.def, userStats.level, 0, userStats.nature),
//       spAtk: calculatePossibleIVs('spAtk', selectedPokemon.baseStats.spAtk, userStats.spAtk, userStats.level, 0, userStats.nature),
//       spDef: calculatePossibleIVs('spDef', selectedPokemon.baseStats.spDef, userStats.spDef, userStats.level, 0, userStats.nature),
//       spd: calculatePossibleIVs('spd', selectedPokemon.baseStats.spd, userStats.spd, userStats.level, 0, userStats.nature),
//     };

//     console.log({ newResults })

//     setResultsIV(newResults);
//   };

//   return (
//     <>
//       <div className='first-row'>
//         <GenSelector
//           selectedGen={genGroup}
//           onChange={setGen} />
//         <PokemonSelector
//           pokemons={filteredPokemons}
//           selectedIdPokemon={selectedIdPokemon}
//           onSelect={setSelectedIdPokemon} />

//       </div>
//       <StatsInputs
//         inputStats={userStats}
//         handleStatChange={handleStatChange}
//         handleSubmitIVs={handleSubmitIVs}
//         gen={selectedPokemon?.specificEra}
//         genGroup={genGroup} />
//       {selectedPokemon && (
//         <>
//           <p>
//             Pokémon seleccionado: {selectedPokemon.name}
//           </p>
//           <img
//             src={selectedPokemon.spriteUrl}
//             width={150} />
//         </>
//       )}
//       {Object.keys(userStats).map((stat) => (
//         <>
//           <p>{stat}</p>
//           <span>{userStats[stat]}</span>
//         </>
//       ))}
//     </>
//   );
// }