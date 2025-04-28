import React, { useEffect, useState } from "react";
import "../styles/components/_themeToggle.scss";

export default function ThemeToggle() {
    const [dark, setDark] = useState(localStorage.getItem("theme")==="dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", dark?"dark":"light");
        localStorage.setItem("theme", dark?"dark":"light");
    }, [dark]);

    return (
        <button onClick={() => setDark(d => !d)} className="theme-toggle">
            {dark ? "☀️" : "🌙"}
        </button>
    );
}
