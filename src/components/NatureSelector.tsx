import { NATURES } from "@/lib/formulas";
import React from 'react';


interface Props {
    selectedNature: string | undefined,
    onChange: (field: "nature", value: string) => void,
}

export default function NatureSelector({ selectedNature, onChange }: Props) {
    return (
        <div className="nature-selector">
            <label
                className="title-input"
                htmlFor="nature-input">NATURE </label>
            <select
                className="input-pokemon-selector"
                onChange={(e) => onChange("nature", e.target.value)}
                value={selectedNature}>
                <option value="">-- Select one nature --</option>
                {Object.entries(NATURES).map(([natureId, nature]) => (
                    <option key={natureId} value={natureId}>
                        {nature.label}
                    </option>
                ))}
            </select>
        </div>
    )
}