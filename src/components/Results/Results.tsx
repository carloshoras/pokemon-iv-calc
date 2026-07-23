import { IVResults } from "@/types/calculator";
import { getIVGradeClass } from "@/utils/ivDisplay";
import React from "react";
import IVbar from "./IVbar/IVbar";
import "./style.scss"

interface ResultsProps {
    results: IVResults;
}

export default function Results({ results }: ResultsProps) {

    return (
        <div className='possible-ivs'>

            {results && Object.keys(results).map(stat => {
                const possibleIVsList = results[stat as keyof typeof results];
                const isIVConfirmed = possibleIVsList.length === 1;
                const statusClass = isIVConfirmed ? getIVGradeClass(possibleIVsList[0]) : '';
                return (
                    <React.Fragment key={stat} >
                        <span className='stat-name'>{stat.toUpperCase()}</span>
                        <IVbar possibleIVs={possibleIVsList} />
                        {/* <span>{getIVBarPercentage(possibleIVsList)}</span> */}
                        <span className='ivs-values'>
                            {possibleIVsList.join(", ")}
                        </span>
                        {isIVConfirmed ? (
                            <div className='ivs-comment'>
                                <span className={`ivs-comment ${statusClass} confirmed`}>Confirmed</span>
                            </div>
                        ) : (
                            <span className='ivs-comment'>Not confirmed</span>
                        )}
                    </React.Fragment>
                )
            }
            )}
        </div>)
}