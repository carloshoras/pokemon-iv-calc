'use client';

import { PokemonEntry } from '@/types/pokemon';
import Select, { OnChangeValue, StylesConfig } from 'react-select'

interface Props {
  filteredPokemons: PokemonEntry[];
  selectedPokemon?: PokemonEntry;
  onChange: (field: "pokemonId", value: string) => void;
}

type PokemonOption = {
  value: string;
  label: string;
}

const selectStyles: StylesConfig<PokemonOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 'auto',
    backgroundColor: 'var(--poke-input-bg)',
    border: '1px solid',
    borderColor: state.isFocused ? 'var(--poke-blue)' : 'var(--poke-border)',
    borderRadius: 6,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(96, 165, 250, 0.15)' : 'none',
    cursor: 'pointer',
    color: 'inherit',
    '&:hover': {
      borderColor: '#ffffff',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '5px',
  }),
  input: (base) => ({
    ...base,
    color: 'inherit',
    margin: 0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--poke-muted)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'inherit',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--poke-input-bg)',
    border: '1px solid var(--poke-border)',
    zIndex: 15,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(96, 165, 250, 0.15)' : 'var(--poke-input-bg)',
    color: 'inherit',
    cursor: 'pointer',
  }),
};

export default function PokemonSelector({ filteredPokemons, selectedPokemon, onChange }: Props) {
  console.log("CHORIZO ", selectedPokemon)

  const pokemonOptions: PokemonOption[] = filteredPokemons.map((pokemon) => (
    {
      "value": pokemon.id,
      "label": pokemon.label
    }
  )
  )

  // 2. Si existe selectedPokemon, construimos el objeto PokemonOption.
  // Si no existe (es undefined), le pasamos null a react-select.
  const currentValue: PokemonOption | null = selectedPokemon
    ? { value: selectedPokemon.id, label: selectedPokemon.label }
    : null;

  const handleChange = (selectedOption: OnChangeValue<PokemonOption, false>) => {
    if (selectedOption) {
      console.log("selectedOption: ", selectedOption)
      console.log("jijijij ", selectedPokemon)
      onChange("pokemonId", selectedOption.value);
    }
  };

  return (
    <div className='pokemon-selector'>
      <label
        className='title-input'
        htmlFor="pokemon-select">POKÉMON</label>
      <Select<PokemonOption, false>
        options={pokemonOptions}
        value={currentValue}
        onChange={handleChange}
        styles={selectStyles}
        className="input-pokemon-selector" />
      {/* <select
        className='input-pokemon-selector'
        id="pokemon-select"
        value={selectedIdPokemon}
        onChange={(e) => onChange("pokemonId", e.target.value)}
      >
        <option value="">-- Select one pokemon --</option>
        {filteredPokemons.map((pokemon) => (
          <option key={pokemon.id} value={pokemon.id}>
            {pokemon.label}
          </option>
        ))}
      </select> */}
    </div>
  );
  // return (
  //   <div className='pokemon-selector'>
  //     <label
  //       className='title-input'
  //       htmlFor="pokemon-select">POKÉMON</label>
  //     <select
  //       className='input-pokemon-selector'
  //       id="pokemon-select"
  //       value={selectedIdPokemon}
  //       onChange={(e) => onChange("pokemonId", e.target.value)}
  //     >
  //       <option value="">-- Select one pokemon --</option>
  //       {filteredPokemons.map((pokemon) => (
  //         <option key={pokemon.id} value={pokemon.id}>
  //           {pokemon.label}
  //         </option>
  //       ))}
  //     </select>
  //   </div>
  // );
}