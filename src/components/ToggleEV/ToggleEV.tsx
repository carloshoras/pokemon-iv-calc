'use client';

import { useEffect, useState } from "react";
import "./style.scss";

interface Props {
    showEVs: boolean;
    setShowEVs: (value: boolean) => void;
}

export default function ToggleEV({ showEVs, setShowEVs }: Props) {

    useEffect(() => {
        console.log("EVs toggled", showEVs)
    }, [showEVs])

    return (
        <div className="toggle-container">
            <label className="switch">
                <input
                    type="checkbox"
                    checked={showEVs}
                    onChange={() => setShowEVs(!showEVs)}
                />
                <span className="slider"></span>
            </label>
            <span className={`name-slider ${showEVs ? 'active' : ''}`}>Include EVs</span>
        </div>
    );
}

