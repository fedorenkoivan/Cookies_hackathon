import { useState, useRef } from "react";
import "./QuestionForm.scss";
import AnswerForm from "./AnswerForm";
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes } from "react-icons/fa";
import { convertImage } from "@/utils/fileHandling";
import { useQuestFormContext } from "@/contexts/QuestFormContext";

interface QuestionProps {
  questionNumber: number;
  questionOrder: number;
}

const QuestionsForm: React.FC<QuestionProps> = ({
  questionNumber,
  questionOrder,
}) => {
  const {
    removeQuestion,
    updateQuestionValue,
    updateQuestionImage,
    updateQuestionPoints,
    addAnswer,
    findQuestion,
  } = useQuestFormContext();

  const question = findQuestion(questionOrder);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!question) return null;

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = await convertImage(e);
    updateQuestionImage(questionOrder, newImage);
  };

  const deleteImage = () => {
    updateQuestionImage(questionOrder, "");
  };

  const onEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      <div className="question-form">
        <div className="question-wrapper">
          <div className="question-number">{questionNumber}</div>
          <input
            type="text"
            placeholder="Question"
            value={question.value}
            onChange={(e) => updateQuestionValue(questionOrder, e.target.value)}
          />
          <div className="icons-wrapper">
            <div
              className={`icon-container ${question.image ? "has-image" : ""}`}
            >
              {question.image ? (
                <>
                  <FaTimes className="icon" onClick={() => deleteImage()} />
                  <div className="image-badge"></div>
                </>
              ) : (
                <FaImage
                  className="icon"
                  onClick={() => fileInputRef.current?.click()}
                />
              )}
            </div>
            <FaTrash
              className="icon"
              onClick={() => removeQuestion(questionOrder)}
            />
            <FaEdit className="icon" onClick={onEdit} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={uploadImage}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>
        {isEditing && (
          <>
            <div className="points-wrapper">
              <p>Points</p>
              <input
                type="text"
                placeholder="Points"
                value={question.points}
                onChange={(e) => {
                  if (e.target.value) {
                    updateQuestionPoints(questionOrder, parseInt(e.target.value));
                  } else {
                    updateQuestionPoints(questionOrder, 0);
                  }
                }}
              />
            </div>
            <div className="answer-wrapper">
              {question.answers.map((answer) => (
                <AnswerForm
                  key={answer.order}
                  questionOrder={questionOrder}
                  answerOrder={answer.order}
                />
              ))}
              <button
                className="add-answer-btn"
                type="button"
                onClick={() => addAnswer(questionOrder)}
              >
                <span className="icon">
                  <FaPlus />
                </span>
                <p>Add Answer</p>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuestionsForm;
