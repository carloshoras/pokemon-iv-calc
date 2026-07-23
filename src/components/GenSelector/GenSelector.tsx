'use client';

import { GenEra } from "@/types/calculator";
import "./style.scss"

interface Props {
  selectedGen: GenEra;
  onChange: (field: "genEra", value: string) => void;
}

function GenSelector({ selectedGen, onChange }: Props) {
  return (
    <div className='gen-selector'>
      <span className="title-input">GENERATION</span>

      <div className='radio-buttons'>
        {/* Opción RETRO */}
        <label htmlFor='retro'>
          <input
            id='retro'
            type="radio"
            name="gen-group"
            value="RETRO"
            checked={selectedGen === 'RETRO'}
            onChange={() => onChange("genEra", "RETRO")}
          />
          Gen 1 - 2 (DVs)
        </label>

        {/* Opción MODERN */}
        <label htmlFor='modern'>
          <input
            id="modern"
            type="radio"
            name="gen-group"
            value="MODERN"
            checked={selectedGen === 'MODERN'}
            onChange={() => onChange("genEra", "MODERN")}
          />
          Gen 3 - 9 (IVs)
        </label>
      </div>
    </div>
  );
}

export default GenSelector;