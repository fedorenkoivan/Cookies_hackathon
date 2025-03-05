import "../../styles/QuestForm.scss";
import "../../styles/HeroSection.scss";
import { useState } from "react";

const QuestForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<number>(90);
  const [toggled, setToggled] = useState<boolean>(false);
  const [secondsVisibility, setSecondsVisibility] = useState<boolean>(false);

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">CREATE YOUR OWN QUEST</h1>
        </div>
      </section>

      <form className="quest-form">
        <div className="quest-form__group">
          <h3>Image</h3>
          <input type="file" required />
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
          <input
            type="text"
            placeholder="Quest Category (Education, Health, Tech etc.)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="container">
          <div className="text-section">
            <h2>Time</h2>
            <p>Set the maximum time to finish the game.</p>
          </div>
          <button className={`toggle-button ${toggled ? "toggled" : ""}`}>
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
                onClick={() => setTimeLimit((prev) => Math.max(0, prev - 1))}
              >
                -
              </button>
              <p>{timeLimit}</p>
              <button
                type="button"
                onClick={() => setTimeLimit((prev) => prev + 1)}
              >
                +
              </button>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) =>
                  setTimeLimit(Math.max(0, parseInt(e.target.value) || 0))
                }
                style={{ width: "60px", textAlign: "center" }}
              />
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
