import { useState, useEffect, useRef } from "react";
import "./QuestionForm.scss";

import AnswerForm from "./AnswerForm";
import { Answer } from "@/types/quest";

import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes } from "react-icons/fa";
import { convertImage } from "@/utils/fileHandling";

interface QuestionProps {
  questionNumber: number;
  onDelete: () => void;
  onChange: (q: string, image: string, points: number, a: Answer[]) => void;
  updateValue: string;
  updateImage: string;
  updatePoints: number;
  updateAnswers: Answer[];
}

const QuestionsForm: React.FC<QuestionProps> = ({ questionNumber, onDelete, onChange, updateValue, updateAnswers, updatePoints, updateImage }) => {
  const [question, setQuestion] = useState(updateValue);
  const [answers, setAnswers] = useState<Answer[]>(updateAnswers);
  const [points, setPoints] = useState<number>(updatePoints);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(updateImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = await convertImage(e);
    setImage(newImage);
    console.log("Image changed:", newImage);
  };

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
    if (updatePoints !== points) {
      setPoints(updatePoints);
    }
  }, [updatePoints]);

  useEffect(() => {
    if (updateImage !== image) {
      setImage(updateImage);
    }
  }, [updateImage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(question, image, points as number, answers);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [question, answers, points, image, onChange]);

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
            <div className={`icon-container ${image ? 'has-image' : ''}`}>
              {image ? (
                <>
                  <FaTimes className="icon" onClick={() => setImage("")} />
                  <div className="image-badge"></div>
                </>
              ) : (
                <FaImage className="icon" onClick={() => fileInputRef.current?.click()} />
              )}
            </div>
            <FaTrash className="icon" onClick={onDelete} />
            <FaEdit className="icon" onClick={onEdit} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
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
              value={points}
              onChange={(e) => {
                setPoints(Math.min(Math.max(0, parseInt(e.target.value) || 0), 99));
              }}
            />
          </div>
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
          </>
        )}
        <div className="question-group"></div>
      </div>
    </>
  );
};

export default QuestionsForm;
