import "./AnswerForm.scss";
import { FaCheckSquare, FaTimes } from "react-icons/fa";
import { useQuestFormContext } from "@/contexts/QuestFormContext";

interface AnswerProps {
  questionOrder: number;
  answerOrder: number;
}

const AnswerForm: React.FC<AnswerProps> = ({
  questionOrder,
  answerOrder,
}) => {

  const { updateAnswer, deleteAnswer, findQuestion } = useQuestFormContext();
  const question = findQuestion(questionOrder);
  if (!question) return null;

  const answer = question.answers.find(a => a.order === answerOrder);
  if (!answer) return null;

  const removeAnswer = () => {
    deleteAnswer(questionOrder, answerOrder);
  };

  const handleUpdate = (value: string, isCorrect: boolean) => {
    updateAnswer(questionOrder, answerOrder, value, isCorrect);
  };

  return (
    <div className="answer-group">
      <div className="check-box">
        <FaCheckSquare
          className={`icon ${answer.isCorrect ? "correct" : ""}`}
          onClick={() => handleUpdate(answer.value, !answer.isCorrect)}
        />
      </div>
      <input
        type="text"
        placeholder="Answer"
        value={answer.value}
        onChange={(e) => handleUpdate(e.target.value, answer.isCorrect)}
      />
      <FaTimes className="cancel-icon" onClick={removeAnswer} />
    </div>
  );
};

export default AnswerForm;
