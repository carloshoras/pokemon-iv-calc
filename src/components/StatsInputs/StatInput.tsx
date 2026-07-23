'use client';

import "./style.scss";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
    value: number;
    onChange: (newValue: number) => void
}

export default function StatInput({ value, onChange, ...delegated }: Props) {
    return (
        <>
            <input
                className="stat-input input-pokemon-selector"
                type="number"
                value={value === 0 ? '' : value}
                onChange={(e) => onChange(Number(e.target.value))}
                {...delegated} />
        </>
    );
}