import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/_onBoardingSlides.scss";

const slides = [
    {
        title: "Welcome to the Neighborhood Board",
        text: "Post, browse, and connect with your community in real time!",
        img: "/assets/onboarding/welcome.svg",
    },
    {
        title: "Create Posts Easily",
        text: "Share events, lost & found, garage sales—and everyone sees them instantly.",
        img: "/assets/onboarding/create.svg",
    },
    {
        title: "Stay Connected",
        text: "Comment, like, and follow posts you care about.",
        img: "/assets/onboarding/connect.svg",
    },
    {
        title: "Join Us!",
        text: "Already have an account? Log in, or register to get started.",
        img: "/assets/onboarding/join.svg",
    },
];

export default function OnboardingSlides({ onFinish }) {
    const [idx, setIdx] = useState(0);
    const navigate = useNavigate();
    const isLast = idx === slides.length - 1;

    const next = () => setIdx((i) => Math.min(i + 1, slides.length - 1));
    const back = () => setIdx((i) => Math.max(i - 1, 0));
    const skip = () => onFinish();
    const goLogin = () => {
        onFinish();
        navigate("/login");
    };
    const goRegister = () => {
        onFinish();
        navigate("/register");
    };

    return (
        <div className="onboarding">
            <button className="onboarding__skip" onClick={skip}>
                Skip
            </button>

            <img
                src={slides[idx].img}
                alt=""
                className="onboarding__image"
            />
            <h2 className="onboarding__title">{slides[idx].title}</h2>
            <p className="onboarding__text">{slides[idx].text}</p>

            <div className="onboarding__controls">
                <button
                    onClick={back}
                    className="btn-outline"
                    disabled={idx === 0}
                >
                    Back
                </button>

                {!isLast ? (
                    <button onClick={next} className="btn-primary">
                        Next
                    </button>
                ) : (
                    <>
                        <button onClick={goLogin} className="btn-outline">
                            Log In
                        </button>
                        <button onClick={goRegister} className="btn-primary">
                            Register
                        </button>
                    </>
                )}
            </div>

            <div className="onboarding__dots">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        className={
                            "onboarding__dot" + (i === idx ? " onboarding__dot--active" : "")
                        }
                        onClick={() => setIdx(i)}
                    />
                ))}
            </div>
        </div>
    );
}
