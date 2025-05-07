import { useState, useEffect } from "react";
import "./QuestionForm.scss";

import AnswerForm from "./AnswerForm";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface QuestionProps {
  questionNumber: number;
  onDelete: () => void;
  onChange: (q: string, a: { id: number; value: string; isCorrect: boolean }[]) => void;
  updateValue: string;
  updateAnswers: { id: number; value: string; isCorrect: boolean }[];
}

const QuestionsForm: React.FC<QuestionProps> = ({ questionNumber, onDelete, onChange, updateValue, updateAnswers }) => {
  const [question, setQuestion] = useState(updateValue);
  const [answers, setAnswers] = useState<{ id: number; value: string; isCorrect: boolean }[]>(updateAnswers);
  const [isEditing, setIsEditing] = useState(false);

  const onEdit = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    if (JSON.stringify(updateAnswers) !== JSON.stringify(answers)) {
      setAnswers(updateAnswers);
    }
  }, [updateAnswers]);

  useEffect(() => {
    if (updateValue !== question) {
      setQuestion(updateValue);
    }
  }, [updateValue]);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      onChange(question, answers);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [question, answers, onChange]);

  const addAnswer = () => {
    if (answers.length >= 7) return;
    setAnswers((prev) => [...prev, { id: prev.length, value: "", isCorrect: false }]);
  };

  const removeAnswer = (id: number) => {
    if (answers.length <= 1) return;
    setAnswers((prev) => {
      const filtered = prev.filter((q) => q.id !== id);
      return filtered.map((ans, index) => ({ ...ans, id: index }));
    });
  };

  return (
    <>
      <div className="question-form">
        <div className="question-wrapper">
          <div className="question-number">{questionNumber}</div>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
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
              <p>Add Answer</p>
            </button>
          </div>
        )}
        <div className="question-group"></div>
      </div>
    </>
  );
};

export default QuestionsForm;
