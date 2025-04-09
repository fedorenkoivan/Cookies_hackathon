import { useState, useEffect } from "react";
import "./QuestionForm.scss";

import AnswerForm from "./AnswerForm";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface QuestionProps {
  questionNumber: number;
  onDelete: () => void;
  onChange: (q: string) => void;
  updateValue: string;
}

const QuestionsForm: React.FC<QuestionProps> = ({ questionNumber, onDelete, onChange, updateValue: updateValue }) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<{ id: number; value: string; isCorrect: boolean }[]>([
    { id: 0, value: "", isCorrect: false },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const onEdit = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    setAnswers((prev) => prev.map((q, index) => ({ ...q, id: index })));
  }, [answers.length]);

  const addAnswer = () => {
    setAnswers((prev) => [...prev, { id: prev.length, value: "", isCorrect: false }]);
  };

  const removeAnswer = (id: number) => {
    if (answers.length > 1) {
      setAnswers((prev) => prev.filter((q) => q.id !== id));
    }
  };

  useEffect(() => {
    setQuestion(updateValue);
  }, [questionNumber, updateValue]);

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
              setQuestion(e.target.value);
              onChange(e.target.value);
              console.log(e.target.value);

              console.log("Current question state:", question);
            }}
          ></input>
          <div className="icons-wrapper">
            <FaTrash className="icon" onClick={onDelete} />
            <FaEdit className="icon" onClick={onEdit} />
          </div>
        </div>
        {isEditing && (
          <div className="answer-wrapper">
            {answers.map((answer) => (
              <AnswerForm
                key={answer.id}
                onDelete={() => removeAnswer(answer.id)}
                onChange={(value, isCorrect) => {
                  setAnswers(prev => 
                    prev.map(a => a.id === answer.id ? { ...a, value, isCorrect } : a)
                  );
                }}
                updateValue={answer.value}
                updateIsCorrect={answer.isCorrect}
              />
            ))}
            <button className="add-answer-btn" type="button" onClick={addAnswer}>
              <span className="icon">
                <FaPlus />
              </span>
              Add Answer
            </button>
          </div>
        )}
        <div className="question-group"></div>
      </div>
    </>
  );
};

export default QuestionsForm;
