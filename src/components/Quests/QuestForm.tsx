import { useState } from "react";

import "../../styles/QuestForm.scss";
import "../../styles/HeroSection.scss";

import { Dropdown } from "./Dropdown";

const QuestForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // const [category, setCategory] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<number>(90);
  const [toggled, setToggled] = useState<boolean>(false);
  const [secondsVisibility, setSecondsVisibility] = useState<boolean>(false);

  const handleToggle = () => {
    setToggled((prev) => !prev);
    setSecondsVisibility((prev) => !prev);
    if (!toggled) setTimeLimit(0);
  };

  const questCategories: string[] = [
    "Adventure & Exploration",
    "Puzzle & Logic",
    "Educational & Learning",
    "Creative & Artistic",
    "Team Challenges",
    "Mystery & Investigation",
  ];

  return (
    <>
      <form className="quest-form">
        <div className="hero-section">
          <h1>Ready to lounch your own quest?</h1>
        </div>

        <div className="quest-form__group">
          <h3>Image</h3>
          <input type="file" accept="image/*" />
        </div>

        <div className="quest-form__group">
          <h3>Title</h3>
          <input
            type="text"
            placeholder="Title of your quest"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="quest-form__group">
          <h3>Description</h3>
          <textarea
            placeholder="Description of your quest"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="quest-form__group">
          <h3>Category</h3>
          <Dropdown
            buttonText="Category of your quest"
            content={questCategories}
          />
        </div>

        <div className="container">
          <div className="text-section">
            <h2>Time</h2>
            <p>Set the maximum time to finish the game.</p>
          </div>
          <button
            className={`toggle-button ${toggled ? "toggled" : ""}`}
            onClick={handleToggle}
          >
            <div className="thumb"></div>
          </button>
        </div>

        {secondsVisibility && (
          <div className="container">
            <div className="text-section">
              <b>Seconds</b>
            </div>
            <div className="controls">
              <button
                type="button"
                onClick={() => {
                  setTimeLimit((prev) => Math.max(0, prev - 1));
                  console.log(timeLimit);
                }}
              >
                -
              </button>
              <input
                type="text"
                value={timeLimit}
                onChange={(e) => {
                  setTimeLimit(
                    Math.min(Math.max(0, parseInt(e.target.value) || 0), 999)
                  );
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setTimeLimit((prev) => prev + 1);
                  console.log(timeLimit);
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        <button className="next-btn" type="submit">
          Submit Quest
        </button>
      </form>
    </>
  );
};

export default QuestForm;
