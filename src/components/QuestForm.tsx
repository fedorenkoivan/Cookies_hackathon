import "../styles/QuestForm.scss";
import "../styles/HeroSection.scss";
import { useState } from "react";

const QuestForm = () => {
    const [toggled, setToggled] = useState(false);
    const [secondsVisibility, setSecondsVisibility] = useState(false);
    const [seconds, setSeconds] = useState(90);

    const onClick = () => {
        setToggled(!toggled);
        setSecondsVisibility(!secondsVisibility);
    };

    return (
        <>
            <section className="hero">
                <div className="hero__content">
                    <h1 className="hero__title">
                        CREATE YOUR OWN QUEST
                    </h1>
                </div>
            </section>
            <div className="quest-form">
                <div className="quest-form__group">
                    <h3>Title</h3>
                    <input
                        type="text"
                        placeholder="Title of your quest"
                    />
                </div>
                <div className="quest-form__group">
                    <h3>Description</h3>
                    <textarea
                        placeholder="Description of your quest"
                    />
                </div>
                <div className="quest-form__group">
                    <h3>Category</h3>
                    <input
                        placeholder="Quest Category (Education, Health, Tech etc.)"
                    />
                </div>
                <div className="container">
                    <div className="text-section">
                        <h2>Time</h2>
                        <p>Set the maximum time to finish the game.</p>
                    </div>
                    <button className={`toggle-button ${toggled ? "toggled" : ""}`} onClick={onClick}>
                        <div className="thumb"></div>
                    </button>
                </div>
                {secondsVisibility && (
                    <div className="container">
                        <div className="text-section">
                            <b>Seconds</b>
                        </div>
                        <div className="controls">
                            <button onClick={() => setSeconds((prev) => Math.max(0, prev - 1))}>-</button>
                            <p>{seconds}</p>
                            <button onClick={() => setSeconds((prev) => prev + 1)}>+</button>
                        </div>
                    </div>
                )}
            <button className="next-btn">Next</button>
            </div>
            <section className="hero">
                <div className="hero__content">
                </div>
            </section>
        </>
    );
};

export default QuestForm;

