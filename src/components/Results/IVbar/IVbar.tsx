import { getIVBarPercentage, getIVGradeClass } from "@/utils/ivDisplay";
import "./style.scss"
import { averageArray } from "@/utils/utils";

interface IVbarProps {
    possibleIVs: number[];
}

export default function IVbar({ possibleIVs }: IVbarProps) {
    const averageIV = averageArray(possibleIVs)

    const percentage = getIVBarPercentage(averageIV);
    const ivGradeClass = getIVGradeClass(averageIV);

    return (
        <div className="iv-bar-wrapper">
            <div
                className={`percentage-bar ${ivGradeClass}`}
                style={{ width: `${percentage}%` }}>

            </div>
        </div>
    )
    // return (
    //     <span className={`iv-bar ${ivGradeClass}`}>{percentage}</span>
    // )
}