import Calculator from "@/components/Calculator/Calculator";
import pokemonData from "@/data/pokemon-list.json";
import { PokemonEntry } from "@/types/pokemon";

export default async function Home() {

  //Typescript doesn't know how to read the JSON's interior to see if it complies with the PokemonEntry interface
  // with this we're telling it "trust me, I know this JSON has the same structure as a PokemonEntry array"
  const allPokemons = pokemonData as PokemonEntry[];


  return (
    <>


      <Calculator allPokemons={allPokemons} />

    </>

  );
}
