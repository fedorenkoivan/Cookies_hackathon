import { useState, useEffect } from "react";
import "./QuestForm.scss";
import { Dropdown } from "./Dropdown";
import QuestionForm from "./QuestionForm";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CATEGORIES as QUEST_CATEGORIES, QUESTS_URL as URL } from "@/constants/questConstants";
import { Question, Answer } from "@/types/quest";
import { convertImage } from "@/utils/fileHandling";


const QuestForm = () => {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [time, setTime] = useState<number>(-1);
  const [showTimeControls, setShowTimeControls] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([{ order: 0, value: "", image: "", points: 1 ,answers: [{ order: 0, value: "", isCorrect: false }] }]);
  const [totalPoints, setTotalPoints] = useState<number>(1);

  const navigate = useNavigate();

  const handleToggle = () => {
    const newState = !showTimeControls;
    setShowTimeControls(newState);
    if (!newState) setTime(-1);
    else setTime(30);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedImage = await convertImage(e);
    setImage(convertedImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const accessToken = localStorage.getItem("accessToken");
    e.preventDefault();
    try {
      const userData = sessionStorage.getItem("userData");
      const author = userData ? JSON.parse(userData).name || "Anonymous" : "Anonymous";
      await fetch(`${URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          author,
          description,
          category,
          time,
          questions,
          image,
        }),
      });
    } catch (err) {
      console.error("Error submitting the quest:", err);
    }
    navigate("/");
  };

  useEffect(() => {
    setQuestions((prev) => prev.map((q, index) => ({ ...q, order: index })));
  }, [questions.length]);

  const addQuestion = () => {
    if (questions.length >= 20) return; 
    setQuestions((prev) => [
      ...prev,
      {
        order: prev.length,
        value: "",
        image: "",
        points: 1,
        answers: [{ order: 0, value: "", isCorrect: false }],
      },
    ]);
  };

  const removeQuestion = (order: number) => {
    if (questions.length <= 1) return; 
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.order !== order);
      return filtered.map((q, index) => ({
        ...q,
        order: index,
      }));
    });
  };

  const updateQuestion = (
    order: number,
    value: string,
    image: string,
    points: number,
    answers: Answer[]
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.order === order ? { ...q, value, image, points, answers } : q))
    );
    setTotalPoints(() => {
      const newPoints = questions.reduce((acc, q) => acc + q.points, 0);
      return newPoints;
    });
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
            content={QUEST_CATEGORIES}
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
                onClick={() => setTime((prev) => Math.max(30, prev - 1))}
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
                onClick={() => setTime((prev) => Math.min(999, prev + 1))}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="quest-form__group">
          <div className="header-info"><h3>Questions</h3><span>(Total {totalPoints} points)</span></div>
          {questions.map((question) => (
            <QuestionForm
              key={question.order}
              questionNumber={question.order + 1}
              onDelete={() => removeQuestion(question.order)}
              onChange={(q, image, points, a) => updateQuestion(question.order, q, image, points, a)}
              updateValue={question.value}
              updateImage={question.image}
              updatePoints={question.points}
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
            <p>Add Question</p>
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
