import "./QuestForm.scss";
import { Dropdown } from "./Dropdown";
import QuestionForm from "./QuestionForm";
import { useRef } from "react";
import { FaPlus, FaImage, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { QUESTS_URL as URL } from "@/constants/questConstants";
import { convertImage } from "@/utils/fileHandling";
import { QuestFormProvider } from "@/contexts/QuestFormProvider";
import { useQuestFormContext } from "@/contexts/QuestFormContext";
import { useAppContext } from "@/contexts/AppContext";

const QuestForm = () => {
  return (
    <QuestFormProvider>
      <QuestFormContent />
    </QuestFormProvider>
  );
};

const QuestFormContent = () => {
  const {
    //Question state
    questions,
    totalPoints,
    addQuestion,

    //useStates
    image,
    setImage,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    time,
    setTime,
    showTimeControls,
    setShowTimeControls,

    clearSavedData,
  } = useQuestFormContext();

  const { fetchAllQuests } = useAppContext();

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    const newState = !showTimeControls;
    setShowTimeControls(newState);
    if (!newState) setTime(-1);
    else setTime(30);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedImage = await convertImage(e);
    setImage(convertedImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const accessToken = localStorage.getItem("accessToken");
    e.preventDefault();

    try {
      const userData = sessionStorage.getItem("userData");
      if (!userData) throw new Error("User data not found in session storage");

      const parsedUserData = JSON.parse(userData);

      const username = parsedUserData.name || "Anonymous";
      const authorId = parsedUserData.id || "";
      const profileImage = parsedUserData.profileImage || "";

      const author = { username, authorId, profileImage };

      const response = await fetch(`${URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create quest");
      }

      await fetchAllQuests();
      clearSavedData();
      navigate("/");
    } catch (err) {
      console.error("Error submitting the quest:", err);
    }
  };

  return (
    <div className="quest-form__background">
      <form className="quest-form" onSubmit={handleSubmit}>
        <div className="hero-section">
          <h1>Ready to launch your own quest?</h1>
        </div>

        <div className="quest-form__group">
          <h3>Image</h3>
          <div className="image-upload-container">
            <div className={`icon-container ${image ? "has-image" : ""}`}>
              {image ? (
                <>
                  <FaTimes className="icon" onClick={() => setImage("")} />
                  <div className="image-badge"></div>
                </>
              ) : (
                <FaImage
                  className="icon"
                  onClick={() => fileInputRef.current?.click()}
                />
              )}
            </div>
            <span className="image-label">
              {image ? "Image added" : "Add quest image"}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
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
            onSelect={(category) => {
              setCategory(category);
            }}
          />
        </div>

        <div className="container">
          <div className="text-section">
            <h2>Time</h2>
            <p>Sets the time limit for completing your quest</p>
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
                onClick={() => setTime((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="text"
                value={time}
                onChange={(e) => {
                  setTime(
                    Math.min(Math.max(0, parseInt(e.target.value) || 0), 999),
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
          <div className="header-info">
            <h3>Questions</h3>
            <span>(Total {totalPoints} points)</span>
          </div>

          {questions.map((question) => (
            <QuestionForm
              key={question.order}
              questionOrder={question.order}
              questionNumber={question.order + 1}
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
    </div>
  );
};

export default QuestForm;
