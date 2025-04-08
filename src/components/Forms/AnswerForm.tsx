import { useEffect, useState } from "react";

import { FaCheckSquare, FaTimes } from "react-icons/fa";
import "./AnswerForm.scss";

interface AnswerProps {
  onDelete: () => void;
  onChange: (a: string, b: boolean) => void;
  updateValue: string;
  updateIsCorrect: boolean;
}

const AnswerForm: React.FC<AnswerProps> = ({
  onDelete,
  onChange,
  updateValue,
  updateIsCorrect,
}) => {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(updateIsCorrect);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    onChange(e.target.value, isCorrect);
  };

  useEffect(() => {
    setAnswer(updateValue);
    setIsCorrect(updateIsCorrect);
  }, [updateValue, updateIsCorrect]);

  const handleCorrectToggle = () => {
    const newIsCorrect = !isCorrect;
    setIsCorrect(newIsCorrect);
    onChange(answer, newIsCorrect);
  };

  return (
    <>
      <div className="answer-group">
        <div className="check-box">
          <FaCheckSquare
            className={`icon ${isCorrect ? "correct" : ""}`}
            onClick={handleCorrectToggle}
          />
        </div>
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={handleChange}
        ></input>
        <FaTimes className="cancel-icon" onClick={onDelete} />
      </div>
    </>
  );
};

export default AnswerForm;
