'use client';

import "./style.scss";
import StatInput from './StatInput';
import { Observation, StatKey } from '@/types/calculator';
import React from "react";
import TrashIcon from "../icons/TrashIcon";

interface Props {
    observations: Observation[],
    handleObservationLevelChange: (id: string, value: number) => void,
    handleObservationStatChange: (id: string, field: StatKey, value: number) => void,
    removeObservation: (id: string) => void,
    showEVs: boolean;
    handleObservationEVChange: (id: string, field: StatKey, value: number) => void,
}

export default function StatsInputs({ observations, handleObservationLevelChange, handleObservationStatChange, removeObservation, showEVs, handleObservationEVChange }: Props) {
    console.log("rendering StatsInputs with observations: ", observations)

    return (
        <div className='stats-inputs'>
            {["Level", "HP", "Atk", "Def", "Sp. Atk", "Sp. Def", "Spd", ""].map((statName) => (
                <span key={statName} className="stats-names">
                    {statName}
                </span>))}
            {observations?.map((observation, index) => {
                const id = observation.id;
                return (
                    <React.Fragment key={id}>
                        <div className="input-wrapper">

                            <StatInput
                                value={observation.level}
                                onChange={(newValue) => handleObservationLevelChange(id, newValue)}
                                style={{ color: "var(--poke-yellow)" }}
                            />
                        </div>
                        {(Object.keys(observation.stats) as StatKey[]).map((statName) => (
                            <div className="input-wrapper">

                                <StatInput
                                    key={statName}
                                    value={observation.stats[statName]}
                                    onChange={(newValue) => handleObservationStatChange(id, statName, newValue)} />
                            </div>
                        ))}
                        {index > 0 ? (
                            <div className="input-wrapper">

                                <button
                                    className='remove-observation'
                                    type={"button"}
                                    title={"Delete row"}
                                    aria-label={"Delete row"}
                                    onClick={() => {
                                        console.log("removing observation with id: ", id)
                                        removeObservation(id)
                                    }}>
                                    <TrashIcon />
                                </button>
                            </div>
                        ) :
                            (
                                <div style={{ width: "32px" }}>{""}</div>
                            )}
                        {showEVs && (
                            <>
                                <div className="evs title">EVs:</div>
                                {(Object.keys(observation.evs) as StatKey[]).map((statName) => (
                                    <div className="input-wrapper evs">

                                        <StatInput
                                            key={statName}
                                            value={observation.evs[statName]}
                                            onChange={(newValue) => handleObservationEVChange(id, statName, newValue)} />
                                    </div>
                                ))}
                                <div style={{ width: "32px" }}>{""}</div>
                            </>

                        )}
                    </React.Fragment>
                )
            })}


        </div>
    )
    // return (
    //     <>
    //         <form
    //             className={"container"}
    //             onSubmit={handleSubmitStats}>
    //             <div>
    //                 <label htmlFor="level-input">Level: </label>
    //                 <input
    //                     id="level-input"
    //                     type="number"
    //                     value={inputStats.level}
    //                     onChange={(e) => handleStatChange('level', Number(e.target.value))}
    //                     min="1" max="100" />
    //             </div>
    //             {genGroup === "MODERN" && <div>
    //                 <label htmlFor="nature-input">Nature: </label>
    //                 <select
    //                     onChange={(e) => handleStatChange('nature', e.target.value)}
    //                     value={inputStats.nature}>
    //                     {natures.map((nature, index) => (
    //                         <option key={index} value={nature.id}>
    //                             {nature.id}
    //                         </option>
    //                     ))}
    //                 </select>
    //             </div>}

    //             <div className="stats">
    //                 <StatInput
    //                     stat={"hp"}
    //                     value={inputStats.hp}
    //                     handleStatChange={handleStatChange} />
    //                 <StatInput
    //                     stat={"atk"}
    //                     value={inputStats.atk}
    //                     handleStatChange={handleStatChange} />
    //                 <StatInput
    //                     stat={"def"}
    //                     value={inputStats.def}
    //                     handleStatChange={handleStatChange} />

    //                 {gen === 'GEN_1' ? (
    //                     <div>
    //                         <label htmlFor="">Special: </label>
    //                         <input
    //                             type="number"
    //                             value={inputStats.spAtk === 0 ? '' : inputStats.spAtk}

    //                             onChange={(e) => {
    //                                 handleStatChange('spAtk', Number(e.target.value))
    //                                 handleStatChange('spDef', Number(e.target.value))
    //                             }
    //                             }
    //                         />
    //                     </div>
    //                 ) : (
    //                     <>

    //                         <StatInput
    //                             stat={"spAtk"}
    //                             value={inputStats.spAtk}
    //                             handleStatChange={handleStatChange} />
    //                         <StatInput
    //                             stat={"spDef"}
    //                             value={inputStats.spDef}
    //                             handleStatChange={handleStatChange} />
    //                     </>
    //                 )}

    //                 <StatInput
    //                     stat={"spd"}
    //                     value={inputStats.spd}
    //                     handleStatChange={handleStatChange} />
    //             </div>
    //             <button
    //                 type="submit"
    //                 className="submit-stats">Calculate</button>
    //         </form>
    //     </>
    // );
}