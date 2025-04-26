import React, { createContext, useContext, useState, useEffect } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem("hasOnboarded") === "true";
        setHasOnboarded(done);
    }, []);

    const completeOnboarding = () => {
        localStorage.setItem("hasOnboarded", "true");
        setHasOnboarded(true);
    };

    return (
        <OnboardingContext.Provider value={{ hasOnboarded, completeOnboarding }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    return useContext(OnboardingContext);
}
