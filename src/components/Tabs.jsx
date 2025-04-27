import React, { useState } from "react";
import "../styles/components/_tabs.scss";

export default function Tabs({ tabs }) {
    // tabs: [{ label: string, Component: JSX.Element }]
    const [active, setActive] = useState(0);

    return (
        <div className="tabs">
            <div className="tabs__headers">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        className={`tabs__header${i === active ? " tabs__header--active" : ""}`}
                        onClick={() => setActive(i)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="tabs__content">
                {tabs[active].Component}
            </div>
        </div>
    );
}
