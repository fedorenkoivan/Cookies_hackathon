import { useState, useEffect } from "react";
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
  const [showTimeControls, setShowTimeControls] = useState<boolean>(false);
  const [questions, setQuestions] = useState<
    {
      id: number;
      value: string;
      answers: { id: number; value: string; isCorrect: boolean }[];
    }[]
  >([{ id: 0, value: "", answers: [{ id: 0, value: "", isCorrect: false }] }]);

  const URL = "http://localhost:5000/quests";

  const handleToggle = () => {
    const newState = !showTimeControls;
    setShowTimeControls(newState);
    if (!newState) setTime(90); // Reset to default when disabling
    else setTime(0); // Initialize to 0 when enabling
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
          // questions, // Include questions data in the submission
        }),
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

  useEffect(() => {
    setQuestions((prev) => prev.map((q, index) => ({ ...q, id: index })));
  }, [questions.length]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev, 
      { 
        id: prev.length, 
        value: "", 
        answers: [{ id: 0, value: "", isCorrect: false }] 
      }
    ]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions((prev) => {
        const filtered = prev.filter((q) => q.id !== id);
        // Re-index questions
        return filtered.map((q, index) => ({
          ...q,
          id: index
        }));
      });
    }
  };

  const updateQuestion = (id: number, value: string, answers: { id: number; value: string; isCorrect: boolean }[]) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, value, answers } : q)
    );
  };

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
            className={`toggle-button ${showTimeControls ? "toggled" : ""}`}
            type="button"
            onClick={handleToggle}
          >
            <div className="thumb"></div>
          </button>
        </div>

        {showTimeControls && (
          <div className="container">
            <div className="text-section">
              <b>Seconds</b>
            </div>
            <div className="controls">
              <button
                type="button"
                onClick={() => setTime(prev => Math.max(0, prev - 1))}
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
                onClick={() => setTime(prev => Math.min(999, prev + 1))}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="quest-form__group">
          <h3>Questions</h3>
          <div className="question-header" />
          {questions.map((question) => (
            <QuestionForm
              key={question.id}
              questionNumber={question.id + 1}
              onDelete={() => removeQuestion(question.id)}
              onChange={(q, a) => updateQuestion(question.id, q, a)}
              updateValue={question.value}
              updateAnswers={question.answers}
            />
          ))}
          <button
            className="add-question-btn"
            type="button"
            onClick={addQuestion}
          >
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
