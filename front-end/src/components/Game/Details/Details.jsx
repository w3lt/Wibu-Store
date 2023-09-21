import React, { useState } from "react";
import "./Details.css";

function Details({ description }) {
    const systemRequirements = {
        windows: {
            minimum: {
                os: "Windows 7 or 8.1, 64-bit",
                processor: "AMD Quad core @ 2.5 GHz/Intel Quad core @ 2.0 GHz",
                memory: "4 GB RAM",
                graphics: "AMD Radeon HD 4870/Nvidia GeForce 8800 GT",
                directX: "Version 10",
                storage: "26 GB available space"
            },
            recommended: {
                os: "Windows 7 or 8.1, 64-bit",
                processor: "AMD Six core @ 3.2 GHz/ix core @ 3.2 GHz Processor (Intel): Quad core @ 3.0 GHz",
                memory: "8 GB RAM",
                graphics: "AMD Radeon HD 7870 or R9 270/Nvidia GeForce GTX 660",
                directX: "Version 11",
                storage: "26 GB available space"
            }
        },
        macOS: {
            minimum: {
                os: "macOS 10.13.6 or newer",
                processor: "Dual core from Intel",
                memory: "4 GB RAM",
                graphics: "Metal-capable GPU (AMD GCN-based GPU or newer, NVIDIA Kepler-based GPU or newer, Intel HD 4000 or newer)",
                network: "Broadband Internet connection",
                storage: "60 GB available space"
            },
            recommended: null
        }
    };

    const [currentSystemRequirementTag, setCurrentSystemRequirementTag] = useState(0);

    const systemRequirementsTagNames = [];
    if (systemRequirements.windows !== undefined) systemRequirementsTagNames.push("Windows");
    if (systemRequirements.macOS !== undefined) systemRequirementsTagNames.push("Mac OS");

    return (
        <div className="game-description">
            <div className="about-this-game">
                <div className="about-this-game-title title">About this game</div>
                <div>{description}</div>
            </div>
            
            <div className="system-requirements">
                <div className="system-requirements-title title">System Requirements</div>
                <div className="system-requirements-content">
                    <div className="system-requirements-tags">
                        {systemRequirementsTagNames.map((tagName, index) => {
                            return <div key={index} onClick={() => {setCurrentSystemRequirementTag(index);}} className={`system-requirements-tag ${currentSystemRequirementTag === index ? "system-requirements-current-tag": ""}`}>{tagName}</div>
                        })}
                    </div>

                    <div className="system-requirement-details">
                        <div className="system-requirement-minimum">
                            <div style={{marginBottom: "5px"}}>Minimun</div>
                            {(currentSystemRequirementTag === 0) && Object.entries(systemRequirements.windows.minimum).map(([key, value], index) => {
                                if (key.localeCompare("os") === 0) key = "OS";
                                key = key.charAt(0).toUpperCase() + key.slice(1);
                                return <div key={index}>{key}: {value}</div>
                            })}
                            {(currentSystemRequirementTag === 1) && Object.entries(systemRequirements.macOS.minimum).map(([key, value], index) => {
                                if (key.localeCompare("os") === 0) key = "OS";
                                key = key.charAt(0).toUpperCase() + key.slice(1);
                                return <div key={index}>{key}: {value}</div>
                            })}
                        </div>
                        {(currentSystemRequirementTag === 0) && (systemRequirements.windows.recommended !== null) && <div className="system-requirement-recommended">
                            <div style={{marginBottom: "5px"}}>Recommended</div>
                            {Object.entries(systemRequirements.windows.recommended).map(([key, value], index) => {
                                if (key.localeCompare("os") === 0) key = "OS";
                                key = key.charAt(0).toUpperCase() + key.slice(1);
                                return <div key={index}>{key}: {value}</div>
                            })}
                        </div>}
                        {(currentSystemRequirementTag === 1) && (systemRequirements.macOS.recommended !== null) && <div className="system-requirement-recommended">
                            <div style={{marginBottom: "5px"}}>Recommended</div>
                            {Object.entries(systemRequirements.macOS.recommended).map(([key, value], index) => {
                                if (key.localeCompare("os") === 0) key = "OS";
                                key = key.charAt(0).toUpperCase() + key.slice(1);
                                return <div key={index}>{key}: {value}</div>
                            })}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details;