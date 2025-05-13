import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuestContext } from "@/contexts/QuestContext";
import { Question } from "@/types/quest";
import "./QuestionPage.scss";
import logoImage from "@/assets/logo.jpg";

const QuestionPage = () => {
  const { id, question_id } = useParams<{ id: string; question_id: string }>();
  const { quest, loading, error, fetchQuest } = useQuestContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(
    quest?.questions[0] || null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchQuest(id);
    }
  }, [id, fetchQuest]);

  const navigate = useNavigate();

  const handleNextQuestion = () => {
    if (!quest || !quest.questions) {
      console.error("Quest or questions not available");
      return;
    }

    setCurrentQuestionIndex(
      quest.questions.findIndex((question) => question._id === question_id)
    );

    if (currentQuestionIndex === -1) {
      console.error("Current question not found in quest");
      return;
    }

    setSelectedAnswers([]);

    if (currentQuestionIndex < quest.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestion(quest.questions[nextIndex]);
      navigate(`/complete-quest/${id}/${quest.questions[nextIndex]._id}`);
    } else {
      navigate("/rating-form");
    }
  };

const handleCheckboxChange = (value: string) => {
  setSelectedAnswers((prev) =>
    prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value]
  );
};

  return (
    <>
      {loading ? (
        <p>Loading question...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : !quest ? (
        <p>No quest found</p>
      ) : (
        <>
          <div className="question">
            <div className="question__info">
              <h1>{question?.value}</h1>
              <p>
                {question?.points} {question?.points === 1 ? "point" : "points"}
              </p>
              <div className="question__image">
                <img src={question?.image || logoImage} alt="Question image" />
              </div>
              <div className="question__answers">
                {question?.answers.map((answer) => (
                  <label className="answer" key={answer.id}>
                    <input
                      type="checkbox"
                      name="answer"
                      value={answer.id}
                      checked={selectedAnswers.includes(answer.id.toString())}
                      onChange={() => handleCheckboxChange(answer.id.toString())}
                    />
                    <span className="custom-checkbox"></span>
                    {answer.value}
                  </label>
                ))}
              </div>
            </div>
            <div className="question__submit">
              <button
                onClick={handleNextQuestion}
                disabled={loading || !quest.questions}
              >
                {currentQuestionIndex === quest.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionPage;
