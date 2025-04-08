import { useState } from "react";
import "./QuestForm.scss";
import { Dropdown } from "./Dropdown";
import QuestionForm from "./QuestionForm";
import { FaPlus } from "react-icons/fa";

const QuestForm = () => {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [time, setTime] = useState<number>(90);
  const [toggled, setToggled] = useState<boolean>(false);
  const [secondsVisibility, setSecondsVisibility] = useState<boolean>(false);

  const URL = "http://localhost:5000/quests";

  const handleToggle = () => {
    setToggled((prev) => !prev);
    setSecondsVisibility((prev) => !prev);
    if (!toggled) setTime(0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        title,
          author: "John Doe",
          description,
          category,
          time,
          image,
        })
      });
    } catch (err) {
      console.error("Error submitting the quest:", err);
    }
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
      <form className="quest-form" onSubmit={handleSubmit}>
        <div className="hero-section">
          <h1>Ready to launch your own quest?</h1>
        </div>

        <div className="quest-form__group">
          <h3>Image</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
            buttonText="Select a category"
            content={questCategories}
            onSelect={(category) => {
              setCategory(category);
            }}
          />
        </div>

        <div className="container">
          <div className="text-section">
            <h2>Time</h2>
            <p>Set the maximum time to finish the quest.</p>
          </div>
          <button
            className={`toggle-button ${toggled ? "toggled" : ""}`}
            type="button"
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
                  setTime((prev) => Math.max(0, prev - 1));
                  console.log(time);
                }}
              >
                -
              </button>
              <input
                type="text"
                value={time}
                onChange={(e) => {
                  setTime(
                    Math.min(Math.max(0, parseInt(e.target.value) || 0), 999)
                  );
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setTime((prev) => prev + 1);
                  console.log(time);
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="quest-form__group">
          <h3>Questions</h3>
          <QuestionForm />
          <button className="add-btn" type="button">
            <span className="icon">
              <FaPlus />
            </span>
            Add Question
          </button>
        </div>

        <button className="next-btn" type="submit">
          Submit Quest
        </button>
      </form>
    </>
  );
};

export default QuestForm;
