import React from "react";
import OnboardingSlides from "../components/OnboardingSlides";
import { useOnboarding } from "../context/OnboardingContext";

export default function Onboarding() {
    const { completeOnboarding } = useOnboarding();

    // When they either Skip or finish via Login/Register, we mark onboarding done.
    const handleFinish = () => {
        completeOnboarding();
    };

    return <OnboardingSlides onFinish={handleFinish} />;
}
