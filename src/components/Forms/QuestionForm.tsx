import "./QuestionForm.scss";
import { useState, useEffect } from "react";

import { FaEdit, FaTrash } from "react-icons/fa";

interface QuestionProps {
  questionNumber: number;
  onDelete: () => void;
  onChange: (q: string) => void;
  newValue: string;
}

const QuestionsForm: React.FC<QuestionProps> = ({ questionNumber, onDelete, onChange, newValue }) => {
  const [question, setQuestion] = useState("");
  const onEdit = () => {
    console.log("Edit");
  };

useEffect(() => {
  setQuestion(newValue);
}, [questionNumber, newValue]);

  return (
    <>
      <div className="question-form">
        <div className="question-wrapper">
          <div className="question-number">{questionNumber}</div>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value)
              onChange(e.target.value)
            }}
          >
          </input>
          <div className="icons-wrapper">
            <FaTrash className="icon" onClick={onDelete} />
            <FaEdit className="icon" onClick={onEdit} />
          </div>
        </div>
        <div className="question-group"></div>
      </div>
    </>
  );
};

export default QuestionsForm;
